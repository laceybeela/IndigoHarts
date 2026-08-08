import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { smsLogId } = await req.json();
    if (!smsLogId) {
      return new Response(JSON.stringify({ error: 'smsLogId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch the SMS log entry
    const { data: smsLog, error: fetchError } = await supabaseAdmin
      .from('sms_log')
      .select('*')
      .eq('id', smsLogId)
      .single();

    if (fetchError || !smsLog) {
      return new Response(JSON.stringify({ error: 'SMS log entry not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Twilio credentials from Edge Function secrets
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!twilioSid || !twilioToken || !twilioPhone) {
      await supabaseAdmin
        .from('sms_log')
        .update({ status: 'failed' })
        .eq('id', smsLogId);

      return new Response(
        JSON.stringify({ error: 'Twilio credentials are not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Send SMS via Twilio API
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: smsLog.recipient_phone,
          From: twilioPhone,
          Body: smsLog.message_body,
        }),
      }
    );

    const twilioData = await twilioResponse.json();

    if (!twilioResponse.ok) {
      // Twilio returned an error - mark as failed
      await supabaseAdmin
        .from('sms_log')
        .update({ status: 'failed' })
        .eq('id', smsLogId);

      return new Response(
        JSON.stringify({
          error: 'Twilio API error',
          detail: twilioData.message ?? 'Unknown Twilio error',
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Update SMS log with success
    await supabaseAdmin
      .from('sms_log')
      .update({
        status: 'sent',
        twilio_sid: twilioData.sid,
      })
      .eq('id', smsLogId);

    return new Response(
      JSON.stringify({ message: 'SMS sent', twilio_sid: twilioData.sid }),
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
