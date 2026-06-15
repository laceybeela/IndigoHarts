import { SupabaseClient } from '@supabase/supabase-js';
import type { CreateChecklistTemplate } from '@indigo-harts/types';

// ==================== Templates ====================
export async function getChecklistTemplates(client: SupabaseClient, propertyId: string) {
  const { data, error } = await client
    .from('checklist_templates')
    .select('*, items:checklist_template_items(*)')
    .eq('property_id', propertyId)
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return data;
}

export async function createChecklistTemplate(
  client: SupabaseClient,
  template: CreateChecklistTemplate
) {
  const { items, ...templateData } = template;

  const { data: created, error } = await client
    .from('checklist_templates')
    .insert(templateData)
    .select()
    .single();
  if (error) throw error;

  if (items.length > 0) {
    const { error: itemsError } = await client
      .from('checklist_template_items')
      .insert(items.map((item) => ({ ...item, template_id: created.id })));
    if (itemsError) throw itemsError;
  }

  return created;
}

export async function updateChecklistTemplateItems(
  client: SupabaseClient,
  templateId: string,
  items: { task_name: string; display_order: number }[]
) {
  // Delete existing items and re-insert
  const { error: deleteError } = await client
    .from('checklist_template_items')
    .delete()
    .eq('template_id', templateId);
  if (deleteError) throw deleteError;

  if (items.length > 0) {
    const { error: insertError } = await client
      .from('checklist_template_items')
      .insert(items.map((item) => ({ ...item, template_id: templateId })));
    if (insertError) throw insertError;
  }
}

export async function deactivateChecklistTemplate(client: SupabaseClient, id: string) {
  const { error } = await client
    .from('checklist_templates')
    .update({ is_active: false })
    .eq('id', id);
  if (error) throw error;
}

// ==================== Job Checklist Items ====================
export async function getJobChecklists(client: SupabaseClient, jobId: string) {
  const { data, error } = await client
    .from('job_checklists')
    .select('*, items:job_checklist_items(*)')
    .eq('job_id', jobId)
    .order('checklist_name');
  if (error) throw error;
  return data;
}

export async function toggleChecklistItem(
  client: SupabaseClient,
  itemId: string,
  completed: boolean,
  userId: string
) {
  const { data, error } = await client
    .from('job_checklist_items')
    .update({
      is_completed: completed,
      completed_at: completed ? new Date().toISOString() : null,
      completed_by: completed ? userId : null,
    })
    .eq('id', itemId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
