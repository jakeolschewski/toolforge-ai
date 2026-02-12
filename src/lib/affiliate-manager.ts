// Multi-Affiliate Program Integration System
// Manages 100+ affiliate programs with intelligent link rotation and geo-targeting

import { supabase } from './supabase';

export type AffiliateProgram =
  | 'amazon'
  | 'shareasale'
  | 'impact'
  | 'cj'
  | 'rakuten'
  | 'awin'
  | 'partnerstack'
  | 'rewardful'
  | 'direct'
  | 'custom';

export interface AffiliateLink {
  program: AffiliateProgram;
  url: string;
  commission_rate?: number;
  cookie_duration_days?: number;
  geo_restrictions?: string[]; // ISO country codes
  priority?: number; // Higher = preferred
  is_active?: boolean;
  last_checked?: string;
  status?: 'active' | 'expired' | 'broken';
}

export interface AffiliateLinkConfig {
  tool_id: string;
  links: AffiliateLink[];
  default_program?: AffiliateProgram;
  rotation_strategy?: 'highest_commission' | 'round_robin' | 'geo_based' | 'performance_based';
  fallback_url?: string;
}

export interface AffiliatePerformance {
  program: AffiliateProgram;
  clicks: number;
  conversions: number;
  revenue: number;
  epc: number; // Earnings Per Click
  conversion_rate: number;
  avg_commission: number;
  last_conversion?: string;
}

export interface GeoLocation {
  country_code: string;
  continent: string;
  region?: string;
}

export class AffiliateManager {
  private static instance: AffiliateManager;
  private performanceCache: Map<string, AffiliatePerformance[]> = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes
  private cacheTimestamps: Map<string, number> = new Map();

  // Affiliate program configurations
  private programConfigs: Record<AffiliateProgram, {
    name: string;
    default_commission_rate: number;
    cookie_duration_days: number;
    requires_approval: boolean;
    supported_geos?: string[];
    parameter_key?: string; // e.g., 'tag' for Amazon, 'afftrack' for others
  }> = {
    amazon: {
      name: 'Amazon Associates',
      default_commission_rate: 0.03,
      cookie_duration_days: 1,
      requires_approval: true,
      parameter_key: 'tag',
    },
    shareasale: {
      name: 'ShareASale',
      default_commission_rate: 0.10,
      cookie_duration_days: 30,
      requires_approval: true,
      parameter_key: 'afftrack',
    },
    impact: {
      name: 'Impact',
      default_commission_rate: 0.15,
      cookie_duration_days: 30,
      requires_approval: true,
      parameter_key: 'irclickid',
    },
    cj: {
      name: 'CJ Affiliate',
      default_commission_rate: 0.10,
      cookie_duration_days: 30,
      requires_approval: true,
      parameter_key: 'sid',
    },
    rakuten: {
      name: 'Rakuten Advertising',
      default_commission_rate: 0.08,
      cookie_duration_days: 30,
      requires_approval: true,
    },
    awin: {
      name: 'Awin',
      default_commission_rate: 0.10,
      cookie_duration_days: 30,
      requires_approval: true,
    },
    partnerstack: {
      name: 'PartnerStack',
      default_commission_rate: 0.20,
      cookie_duration_days: 90,
      requires_approval: false,
    },
    rewardful: {
      name: 'Rewardful',
      default_commission_rate: 0.20,
      cookie_duration_days: 90,
      requires_approval: false,
    },
    direct: {
      name: 'Direct Affiliate',
      default_commission_rate: 0.30,
      cookie_duration_days: 90,
      requires_approval: true,
    },
    custom: {
      name: 'Custom Program',
      default_commission_rate: 0.15,
      cookie_duration_days: 30,
      requires_approval: false,
    },
  };

  private constructor() {
    // Singleton pattern
  }

  static getInstance(): AffiliateManager {
    if (!AffiliateManager.instance) {
      AffiliateManager.instance = new AffiliateManager();
    }
    return AffiliateManager.instance;
  }

  /**
   * Get the optimal affiliate link for a tool based on strategy
   */
  async getOptimalLink(
    toolId: string,
    strategy: 'highest_commission' | 'round_robin' | 'geo_based' | 'performance_based' = 'highest_commission',
    userGeo?: GeoLocation
  ): Promise<{ url: string; program: AffiliateProgram; tracking_id?: string } | null> {
    try {
      // Fetch affiliate links for the tool
      const { data: affiliateLinks } = await supabase
        .from('affiliate_links')
        .select('*')
        .eq('tool_id', toolId)
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (!affiliateLinks || affiliateLinks.length === 0) {
        return null;
      }

      let selectedLink: any;

      switch (strategy) {
        case 'highest_commission':
          selectedLink = this.selectByHighestCommission(affiliateLinks);
          break;

        case 'geo_based':
          selectedLink = this.selectByGeo(affiliateLinks, userGeo);
          break;

        case 'performance_based':
          selectedLink = await this.selectByPerformance(toolId, affiliateLinks);
          break;

        case 'round_robin':
          selectedLink = this.selectRoundRobin(toolId, affiliateLinks);
          break;

        default:
          selectedLink = affiliateLinks[0];
      }

      if (!selectedLink) {
        return null;
      }

      // Generate tracking ID for attribution
      const trackingId = this.generateTrackingId(toolId, selectedLink.program);

      // Append affiliate parameters
      const url = this.appendAffiliateParams(
        selectedLink.url,
        selectedLink.program,
        trackingId
      );

      return {
        url,
        program: selectedLink.program,
        tracking_id: trackingId,
      };
    } catch (error) {
      console.error('Error getting optimal link:', error);
      return null;
    }
  }

  /**
   * Select link with highest commission rate
   */
  private selectByHighestCommission(links: any[]): any {
    return links.reduce((best, current) => {
      const currentRate = current.commission_rate ||
        this.programConfigs[current.program as AffiliateProgram]?.default_commission_rate || 0;
      const bestRate = best.commission_rate ||
        this.programConfigs[best.program as AffiliateProgram]?.default_commission_rate || 0;
      return currentRate > bestRate ? current : best;
    });
  }

  /**
   * Select link based on geo-targeting
   */
  private selectByGeo(links: any[], userGeo?: GeoLocation): any {
    if (!userGeo) {
      return links[0];
    }

    // Filter links that support user's country
    const geoCompatibleLinks = links.filter(link => {
      if (!link.geo_restrictions || link.geo_restrictions.length === 0) {
        return true; // No restrictions = available everywhere
      }
      return link.geo_restrictions.includes(userGeo.country_code);
    });

    if (geoCompatibleLinks.length === 0) {
      return links[0]; // Fallback to first link
    }

    // Among compatible links, select by highest commission
    return this.selectByHighestCommission(geoCompatibleLinks);
  }

  /**
   * Select link based on historical performance (EPC)
   */
  private async selectByPerformance(toolId: string, links: any[]): Promise<any> {
    const performance = await this.getPerformanceMetrics(toolId);

    if (performance.length === 0) {
      return this.selectByHighestCommission(links);
    }

    // Create performance map
    const perfMap = new Map(
      performance.map(p => [p.program, p.epc])
    );

    // Select link with highest EPC
    return links.reduce((best, current) => {
      const currentEpc = perfMap.get(current.program) || 0;
      const bestEpc = perfMap.get(best.program) || 0;
      return currentEpc > bestEpc ? current : best;
    });
  }

  /**
   * Round-robin link selection
   */
  private selectRoundRobin(toolId: string, links: any[]): any {
    const sessionKey = `rr_${toolId}`;
    const currentIndex = parseInt(
      typeof window !== 'undefined'
        ? sessionStorage.getItem(sessionKey) || '0'
        : '0'
    );

    const selected = links[currentIndex % links.length];

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(sessionKey, String((currentIndex + 1) % links.length));
    }

    return selected;
  }

  /**
   * Append affiliate parameters to URL
   */
  private appendAffiliateParams(
    url: string,
    program: AffiliateProgram,
    trackingId: string
  ): string {
    try {
      const urlObj = new URL(url);
      const config = this.programConfigs[program];

      if (config.parameter_key) {
        urlObj.searchParams.set(config.parameter_key, trackingId);
      }

      // Add universal tracking parameter
      urlObj.searchParams.set('utm_source', 'toolforge');
      urlObj.searchParams.set('utm_medium', 'affiliate');
      urlObj.searchParams.set('utm_campaign', program);

      return urlObj.toString();
    } catch (error) {
      console.error('Error appending params:', error);
      return url;
    }
  }

  /**
   * Generate unique tracking ID
   */
  private generateTrackingId(toolId: string, program: AffiliateProgram): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `tf_${program}_${toolId.substring(0, 8)}_${timestamp}${random}`;
  }

  /**
   * Get performance metrics for a tool
   */
  async getPerformanceMetrics(toolId: string): Promise<AffiliatePerformance[]> {
    // Check cache first
    const cached = this.performanceCache.get(toolId);
    const cacheTime = this.cacheTimestamps.get(toolId) || 0;

    if (cached && Date.now() - cacheTime < this.cacheExpiry) {
      return cached;
    }

    try {
      const { data } = await supabase
        .from('affiliate_performance')
        .select('*')
        .eq('tool_id', toolId)
        .order('epc', { ascending: false });

      const performance = (data || []).map(p => ({
        program: p.program,
        clicks: p.clicks,
        conversions: p.conversions,
        revenue: p.revenue,
        epc: p.epc,
        conversion_rate: p.conversion_rate,
        avg_commission: p.avg_commission,
        last_conversion: p.last_conversion,
      }));

      // Update cache
      this.performanceCache.set(toolId, performance);
      this.cacheTimestamps.set(toolId, Date.now());

      return performance;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return [];
    }
  }

  /**
   * Track affiliate click
   */
  async trackClick(
    toolId: string,
    program: AffiliateProgram,
    trackingId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase.from('affiliate_click_logs').insert({
        tool_id: toolId,
        program,
        tracking_id: trackingId,
        metadata,
        created_at: new Date().toISOString(),
      });

      // Update click count in performance table
      await supabase.rpc('increment_affiliate_clicks', {
        p_tool_id: toolId,
        p_program: program,
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  /**
   * Record conversion
   */
  async recordConversion(
    trackingId: string,
    revenue: number,
    commissionRate?: number
  ): Promise<void> {
    try {
      // Find the click log
      const { data: clickLog } = await supabase
        .from('affiliate_click_logs')
        .select('*')
        .eq('tracking_id', trackingId)
        .single();

      if (!clickLog) {
        console.error('Click log not found for tracking ID:', trackingId);
        return;
      }

      // Record conversion
      await supabase.from('affiliate_conversions').insert({
        tool_id: clickLog.tool_id,
        program: clickLog.program,
        tracking_id: trackingId,
        revenue,
        commission_rate: commissionRate,
        commission_amount: revenue * (commissionRate || 0),
        created_at: new Date().toISOString(),
      });

      // Update performance metrics
      await supabase.rpc('record_affiliate_conversion', {
        p_tool_id: clickLog.tool_id,
        p_program: clickLog.program,
        p_revenue: revenue,
      });
    } catch (error) {
      console.error('Error recording conversion:', error);
    }
  }

  /**
   * Check link health (validate URLs still work)
   */
  async checkLinkHealth(toolId: string): Promise<{
    healthy: number;
    broken: number;
    expired: number;
  }> {
    try {
      const { data: links } = await supabase
        .from('affiliate_links')
        .select('*')
        .eq('tool_id', toolId);

      if (!links) {
        return { healthy: 0, broken: 0, expired: 0 };
      }

      let healthy = 0, broken = 0, expired = 0;

      for (const link of links) {
        try {
          const response = await fetch(link.url, { method: 'HEAD' });

          if (response.ok) {
            healthy++;
            await supabase
              .from('affiliate_links')
              .update({
                status: 'active',
                last_checked: new Date().toISOString(),
              })
              .eq('id', link.id);
          } else {
            broken++;
            await supabase
              .from('affiliate_links')
              .update({
                status: 'broken',
                last_checked: new Date().toISOString(),
              })
              .eq('id', link.id);
          }
        } catch (error) {
          broken++;
        }
      }

      return { healthy, broken, expired };
    } catch (error) {
      console.error('Error checking link health:', error);
      return { healthy: 0, broken: 0, expired: 0 };
    }
  }

  /**
   * Get all supported affiliate programs
   */
  getSupportedPrograms(): Array<{
    id: AffiliateProgram;
    name: string;
    commission_rate: number;
    cookie_duration: number;
  }> {
    return Object.entries(this.programConfigs).map(([id, config]) => ({
      id: id as AffiliateProgram,
      name: config.name,
      commission_rate: config.default_commission_rate,
      cookie_duration: config.cookie_duration_days,
    }));
  }

  /**
   * Bulk import affiliate links
   */
  async bulkImportLinks(
    toolId: string,
    links: Array<{
      program: AffiliateProgram;
      url: string;
      commission_rate?: number;
      priority?: number;
    }>
  ): Promise<{ success: boolean; imported: number; failed: number }> {
    let imported = 0;
    let failed = 0;

    for (const link of links) {
      try {
        await supabase.from('affiliate_links').insert({
          tool_id: toolId,
          program: link.program,
          url: link.url,
          commission_rate: link.commission_rate,
          priority: link.priority || 0,
          is_active: true,
          status: 'active',
          created_at: new Date().toISOString(),
        });
        imported++;
      } catch (error) {
        console.error('Error importing link:', error);
        failed++;
      }
    }

    return { success: failed === 0, imported, failed };
  }

  /**
   * Get EPC (Earnings Per Click) for a program
   */
  async getEPC(program: AffiliateProgram, days: number = 30): Promise<number> {
    try {
      const { data } = await supabase.rpc('calculate_program_epc', {
        p_program: program,
        p_days: days,
      });

      return data || 0;
    } catch (error) {
      console.error('Error calculating EPC:', error);
      return 0;
    }
  }

  /**
   * A/B test different affiliate programs
   */
  async runABTest(
    toolId: string,
    programA: AffiliateProgram,
    programB: AffiliateProgram,
    durationDays: number = 7
  ): Promise<{
    winner: AffiliateProgram;
    programA_epc: number;
    programB_epc: number;
    confidence: number;
  }> {
    const testId = `ab_${toolId}_${Date.now()}`;

    // Record test start
    await supabase.from('ab_tests').insert({
      id: testId,
      tool_id: toolId,
      program_a: programA,
      program_b: programB,
      duration_days: durationDays,
      started_at: new Date().toISOString(),
    });

    // Results would be calculated after duration
    // This is a placeholder for the structure
    return {
      winner: programA,
      programA_epc: 0,
      programB_epc: 0,
      confidence: 0,
    };
  }
}

// Export singleton instance
export const affiliateManager = AffiliateManager.getInstance();
