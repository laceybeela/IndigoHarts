import { SupabaseClient } from '@supabase/supabase-js';
import type { CreateSmsTemplate, UpdateSmsTemplate, SendSms } from '@indigo-harts/types';

// ==================== SMS Templates ====================
export async function getSmsTemplates(client: SupabaseClient, propertyId?: string) {
  let query = client.from('sms_templates').select('*').order('template_name');
  if (propertyId) query = query.eq('property_id', propertyId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createSmsTemplate(client: SupabaseClient, template: CreateSmsTemplate) {
  const { data, error } = await client
    .from('sms_templates')
    .insert(template)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSmsTemplate(client: SupabaseClient, id: string, updates: UpdateSmsTemplate) {
  const { data, error } = await client
    .from('sms_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSmsTemplate(client: SupabaseClient, id: string) {
  const { error } = await client
    .from('sms_templates')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ==================== SMS Log ====================
export async function getSmsLog(client: SupabaseClient, filters?: { stayId?: string; guestId?: string }) {
  let query = client
    .from('sms_log')
    .select('*, guest:guests(*), stay:stays(*), template:sms_templates(*)')
    .order('created_at', { ascending: false });

  if (filters?.stayId) query = query.eq('stay_id', filters.stayId);
  if (filters?.guestId) query = query.eq('guest_id', filters.guestId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function sendSms(client: SupabaseClient, sms: SendSms, userId: string) {
  const { data, error } = await client
    .from('sms_log')
    .insert({ ...sms, sent_by: userId, status: 'pending' })
    .select()
    .single();
  if (error) throw error;

  // Invoke the send-sms Edge Function
  const { error: fnError } = await client.functions.invoke('send-sms', {
    body: { smsLogId: data.id },
  });
  if (fnError) console.error('SMS send failed:', fnError);

  return data;
}
