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

    // ==================== MOCK IMPLEMENTATION ====================
    // In production, replace this with actual Twilio API call:
    //
    // const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    // const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    // const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');
    //
    // const response = await fetch(
    //   `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     body: new URLSearchParams({
    //       To: smsLog.recipient_phone,
    //       From: twilioPhone,
    //       Body: smsLog.message_body,
    //     }),
    //   }
    // );

    console.log(`[MOCK SMS] To: ${smsLog.recipient_phone}`);
    console.log(`[MOCK SMS] Body: ${smsLog.message_body}`);

    // Simulate success
    const mockTwilioSid = `SM_MOCK_${Date.now()}`;

    // Update SMS log with result
    await supabaseAdmin
      .from('sms_log')
      .update({
        status: 'sent',
        twilio_sid: mockTwilioSid,
      })
      .eq('id', smsLogId);

    return new Response(
      JSON.stringify({ message: 'SMS sent (mock)', twilio_sid: mockTwilioSid }),
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
