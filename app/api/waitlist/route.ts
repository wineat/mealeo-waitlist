import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  // Initialise clients at request time so env vars are available
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const resend = new Resend(process.env.RESEND_API_KEY!);

  // Save to Supabase
  const { error: dbError } = await supabase
    .from("waitlist")
    .insert([{ email, joined_at: new Date().toISOString() }]);

  if (dbError) {
    if (dbError.code === "23505") {
      return NextResponse.json(
        { error: "You're already on the waitlist!" },
        { status: 409 }
      );
    }
    console.error("Supabase error:", dbError);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  // Send confirmation email
  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "You're on the Mealeo waitlist 🎉",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Mealeo</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF7F2;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF7F2;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:#fafaf8;padding:20px 40px;border-bottom:1px solid #e8e6e0;">
              <img src="data:image/png;base64,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" alt="Mealeo" width="141" height="35" style="display:block;border:0;" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;font-weight:700;color:#1A1A1A;line-height:1.3;">
                You're on the list.
              </h1>
              <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:16px;color:#555;line-height:1.7;">
                Welcome to the Mealeo waitlist. You're among the first to know when we launch — and that comes with perks.
              </p>
              <table cellpadding="0" cellspacing="0" style="background:#FAF7F2;border-radius:8px;width:100%;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1A1A1A;text-transform:uppercase;letter-spacing:1px;">What to expect</p>
                    <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:15px;color:#444;line-height:1.6;">🎁 <strong>Early-bird pricing</strong> — exclusive launch discounts before we go public.</p>
                    <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:15px;color:#444;line-height:1.6;">📦 <strong>First batch access</strong> — secure your order before stock runs out.</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#444;line-height:1.6;">💌 <strong>Insider updates</strong> — behind-the-scenes nutrition & launch news.</p>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.7;">
                In the meantime, if you have questions you can reply to this email. We read every one.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #F0EBE3;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#999;">
                You're receiving this because you joined the Mealeo waitlist. No spam, ever.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });

  if (emailError) {
    console.error("Resend error:", emailError);
    // Email failure is non-fatal — record is saved, log the issue
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
