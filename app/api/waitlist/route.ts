import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiter: max 5 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0].trim();
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // Safe JSON parsing
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = (body as Record<string, unknown>)?.email;
  if (typeof raw !== "string") {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const email = raw.trim().toLowerCase();

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
            <td style="background:#fafaf8;padding:20px 40px;border-bottom:1px solid #e8e6e0;text-align:center;">
              <img src="https://mealeo.co/logo.png" alt="Mealeo" width="189" height="47" style="display:inline-block;border:0;margin:0 auto;" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;font-weight:700;color:#1A1A1A;line-height:1.3;">
                You're on the list.
              </h1>
              <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:16px;color:#555;line-height:1.7;">
                Welcome to the Mealeo waitlist. You're among the first to hear when we launch — and that comes with a few perks.
              </p>
              <table cellpadding="0" cellspacing="0" style="background:#FAF7F2;border-radius:8px;width:100%;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1A1A1A;text-transform:uppercase;letter-spacing:1px;">What to expect</p>
                    <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:15px;color:#444;line-height:1.6;">🎁 <strong>Early-bird pricing</strong> — exclusive launch pricing before we go public.</p>
                    <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:15px;color:#444;line-height:1.6;">📦 <strong>First batch access</strong> — secure your order before the first batch sells out.</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#444;line-height:1.6;">💌 <strong>Insider updates</strong> — behind-the-scenes product, nutrition, and launch news.</p>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;font-family:Arial,sans-serif;font-size:15px;color:#555;line-height:1.7;">
                Have questions? DM us on Instagram <a href="https://www.instagram.com/mealeo.co/" style="color:#1A1A1A;text-decoration:none;font-weight:700;">@mealeo.co</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 36px;border-top:1px solid #F0EBE3;text-align:center;">
              <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:13px;color:#999;">
                You're receiving this because you joined the Mealeo waitlist. No spam, ever.
              </p>
              <a href="https://www.instagram.com/mealeo.co/" style="display:inline-block;border:0;">
                <img src="https://mealeo.co/ig-icon.png" alt="Instagram" width="28" height="28" style="display:block;border:0;" />
              </a>
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
