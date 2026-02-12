// Dynamic Open Graph Image Generation
// NOTE: Install @vercel/og with: npm install @vercel/og

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'ToolForge AI';
    const category = searchParams.get('category');
    const rating = searchParams.get('rating');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              width: '100%',
              height: '100%',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
                marginBottom: 40,
                maxWidth: '90%',
                lineHeight: 1.2,
                textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              {title}
            </div>

            {/* Category Badge */}
            {category && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '12px 32px',
                  borderRadius: 50,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  {category}
                </div>
              </div>
            )}

            {/* Rating */}
            {rating && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    color: '#fbbf24',
                  }}
                >
                  ★
                </div>
                <div
                  style={{
                    fontSize: 36,
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  {parseFloat(rating).toFixed(1)} / 5.0
                </div>
              </div>
            )}

            {/* Bottom Logo */}
            <div
              style={{
                position: 'absolute',
                bottom: 60,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 'bold',
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}
              >
                ToolForge AI
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation failed:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
