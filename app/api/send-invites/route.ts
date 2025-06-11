import { NextResponse } from 'next/server';

interface InviteData {
  team_member_email: string;
  team_member_name: string;
  invite_token: string;
}


export async function POST(req: Request) {
  try {
    const {invites} = await req.json();

    if (!invites || !Array.isArray(invites)) {
      return NextResponse.json({ error: 'Invalid invites data' }, { status: 400 });
    }

    const results = await Promise.all(invites.map(async (invite: InviteData) => {
      try {
        if (!invite.team_member_email || !invite.team_member_name || !invite.invite_token) {
          return { 
            email: invite.team_member_email, 
            status: 'error' as const, 
            error: 'Missing required fields' 
          };
        }

        const link = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/survey/respond/${invite.invite_token}`;
        
        const templateParams = {
          to_email: invite.team_member_email,
          to_name: invite.team_member_name,
          survey_link: link,
        };

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
            template_params: templateParams,
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('EmailJS error:', errorText);
          
          // Handle specific SMTP authentication errors
          if (errorText.includes('Authentication failed')) {
            return { 
              email: invite.team_member_email, 
              status: 'error' as const, 
              error: 'Email service authentication failed. Please check your Mailtrap credentials.' 
            };
          }
          
          return { 
            email: invite.team_member_email, 
            status: 'error' as const, 
            error: errorText || 'Failed to send email' 
          };
        }

        return { email: invite.team_member_email, status: 'sent' as const };
      } catch (e: unknown) {
        console.error('Error sending email:', e);
        return { 
          email: invite.team_member_email, 
          status: 'error' as const, 
          error: e instanceof Error ? e.message : 'Unknown error occurred'
        };
      }
    }));

    return NextResponse.json({ results });
  } catch (error: unknown) {
    console.error('Request processing error:', error);
    return NextResponse.json({ 
      error: 'Failed to process request', 
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 