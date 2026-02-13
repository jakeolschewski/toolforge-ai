'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import WorkflowEditor from '@/components/admin/vault/WorkflowEditor';
import type { VaultWorkflow } from '@/types';

export default function EditWorkflowPage() {
  const router = useRouter();
  const params = useParams();
  const workflowId = params.id as string;

  const [workflow, setWorkflow] = useState<VaultWorkflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (workflowId) {
      loadWorkflow();
    }
  }, [workflowId]);

  const loadWorkflow = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/vault/workflows/${workflowId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load workflow');
      }

      const data = await response.json();
      if (data.success) {
        setWorkflow(data.data);
      } else {
        toast.error('Workflow not found');
        router.push('/admin/vault/workflows');
      }
    } catch (error) {
      console.error('Failed to load workflow:', error);
      toast.error('Failed to load workflow');
      router.push('/admin/vault/workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedWorkflow: Partial<VaultWorkflow>) => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/vault/workflows/${workflowId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWorkflow),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Workflow updated successfully');
        router.push('/admin/vault/workflows');
      } else {
        toast.error(data.error || 'Failed to update workflow');
      }
    } catch (error) {
      toast.error('Failed to update workflow');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/vault/workflows');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Workflow not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Workflow</h1>
        <p className="text-gray-600 mt-2">Update workflow information</p>
      </div>

      <WorkflowEditor
        workflow={workflow}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
    </div>
  );
}
