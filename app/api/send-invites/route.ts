import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  try {
    const {invites} = await req.json();

    if (!invites || !Array.isArray(invites)) {
      return NextResponse.json({ error: 'Invalid invites data' }, { status: 400 });
    }

    const results = await Promise.all(invites.map(async (invite: any) => {
      try {
        if (!invite.team_member_email || !invite.team_member_name || !invite.invite_token) {
          return { 
            email: invite.team_member_email, 
            status: 'error', 
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
          auth: {
            username: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
            password: process.env.EMAILJS_PRIVATE_KEY,
          },
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
              status: 'error', 
              error: 'Email service authentication failed. Please check your Mailtrap credentials.' 
            };
          }
          
          return { 
            email: invite.team_member_email, 
            status: 'error', 
            error: errorText || 'Failed to send email' 
          };
        }

        return { email: invite.team_member_email, status: 'sent' };
      } catch (e: any) {
        console.error('Error sending email:', e);
        return { 
          email: invite.team_member_email, 
          status: 'error', 
          error: e.message 
        };
      }
    }));

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Request processing error:', error);
    return NextResponse.json({ 
      error: 'Failed to process request', 
      details: error.message 
    }, { status: 500 });
  }
} 