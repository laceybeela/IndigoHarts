import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { templateId, stayId } = await req.json();

    if (!templateId || !stayId) {
      return new Response(
        JSON.stringify({ error: 'templateId and stayId are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch template
    const { data: template, error: templateError } = await supabaseAdmin
      .from('sms_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      return new Response(JSON.stringify({ error: 'Template not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch stay with relations
    const { data: stay, error: stayError } = await supabaseAdmin
      .from('stays')
      .select('*, property:properties(*), guest:guests(*)')
      .eq('id', stayId)
      .single();

    if (stayError || !stay) {
      return new Response(JSON.stringify({ error: 'Stay not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build variable map
    const guest = stay.guest as Record<string, string> | null;
    const property = stay.property as Record<string, string> | null;

    const variables: Record<string, string> = {
      guest_name: guest ? `${guest.first_name} ${guest.last_name}` : '',
      guest_first_name: guest?.first_name ?? '',
      guest_last_name: guest?.last_name ?? '',
      guest_phone: guest?.phone ?? '',
      guest_email: guest?.email ?? '',
      property_name: property?.name ?? '',
      property_address: property?.address ?? '',
      entry_code: property?.entry_code ?? '',
      lockbox_code: property?.lockbox_code ?? '',
      wifi_name: property?.wifi_name ?? '',
      wifi_password: property?.wifi_password ?? '',
      check_in_date: stay.check_in_date ?? '',
      check_out_date: stay.check_out_date ?? '',
    };

    // Replace template variables
    let resolvedMessage = template.message_body;
    for (const [key, value] of Object.entries(variables)) {
      resolvedMessage = resolvedMessage.replaceAll(`{{${key}}}`, value);
    }

    return new Response(
      JSON.stringify({
        resolved_message: resolvedMessage,
        recipient_phone: guest?.phone ?? '',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
