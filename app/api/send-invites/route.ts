import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { invites } = await req.json();
    if (!invites || !Array.isArray(invites)) {
      return NextResponse.json({ error: 'Invalid invites array' }, { status: 400 });
    }

    const results = await Promise.all(invites.map(async (invite: any) => {
      const link = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/survey/respond/${invite.invite_token}`;
      try {
        await resend.emails.send({
          from: 'noreply@yourdomain.com',
          to: invite.team_member_email,
          subject: 'You have been invited to complete a Leadership Feedback Survey',
          html: `<p>Hello ${invite.team_member_name},</p>
            <p>You have been invited to complete a leadership feedback survey. Please use the link below:</p>
            <p><a href="${link}">${link}</a></p>
            <p>This link is unique to you and your feedback will be anonymous.</p>`
        });
        return { email: invite.team_member_email, status: 'sent' };
      } catch (e) {
        return { email: invite.team_member_email, status: 'error', error: e.message };
      }
    }));

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 