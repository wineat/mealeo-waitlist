"use client";

import { useState } from "react";

const marqueeItems = [
  "Designed for momentum.", "This is a meal.",
  "Designed to be complete.", "This is a meal.",
  "Designed to be effortless.", "This is a meal.",
];

function useWaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setEmail("");
        setNote("You’re on the list. We’ll be in touch before launch.");
      } else {
        setStatus("error");
        setNote(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setNote("Network error. Please try again.");
    }
  };

  const resetEmail = (v: string) => {
    setEmail(v);
    if (status !== "idle") { setStatus("idle"); setNote(""); }
  };

  const btnLabel = status === "success" ? "You’re in!" : status === "loading" ? "Joining…" : "Join the waitlist";

  return { email, note, status, btnLabel, handleSubmit, resetEmail };
}

function SocialIcons() {
  return (
    <>
      <a href="#" aria-label="Instagram">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.7">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="#141414" stroke="none" />
        </svg>
      </a>
      <a href="#" aria-label="Facebook">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#141414">
          <path d="M13.5 22v-7.4h2.5l.4-2.9h-2.9V9.85c0-.84.23-1.41 1.44-1.41h1.54V5.85a20.6 20.6 0 0 0-2.24-.11c-2.22 0-3.74 1.35-3.74 3.84v2.14H8v2.9h2.5V22Z" />
        </svg>
      </a>
      <a href="#" aria-label="X">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="#141414">
          <path d="M17.6 3h3l-6.5 7.5L21.8 21h-5.9l-4.3-5.6L6.5 21H3.4l7-8L2.6 3h6l3.9 5.2L17.6 3Zm-1 16h1.6L8.1 4.6H6.4L16.6 19Z" />
        </svg>
      </a>
    </>
  );
}

export default function Home() {
  const heroForm = useWaitlistForm();
  const footerForm = useWaitlistForm();

  return (
    <div className="page-wrap">

      {/* ── NAV ─────────────────────────────────────── */}
      <nav className="main-nav">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/design-logo.png" alt="Mealeo" className="nav-logo" />
      </nav>

      {/* ── MOBILE-ONLY: full-bleed hero image with headline overlay ── */}
      <div className="mobile-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero.png" alt="Person holding a Mealeo shaker on a metro platform" className="hero-img-mob" />
        <div className="mob-hero-gradient">
          <h1 className="headline-mob">Never<br />skip a<br />meal again!</h1>
        </div>
      </div>

      {/* ── HERO SECTION ─────────────────────────────── */}
      {/* Mobile: copy + form below hero image     */}
      {/* Desktop: split — image left, copy right  */}
      <section className="hero-section">

        {/* Desktop-only left image pane */}
        <div className="hero-img-pane">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero.png" alt="Person holding a Mealeo shaker on a metro platform" className="hero-img-desk" />
        </div>

        {/* Right / mobile copy pane */}
        <div className="hero-copy-pane">
          {/* Desktop-only headline (dark, in copy column) */}
          <h1 className="headline-desk">Never<br />skip a<br />meal again!</h1>

          <p className="hero-desc">
            <span className="desk-only">Some days demand more from you.<br /></span>
            A complete meal ready in 30 seconds.<br />Just scoop, shake &amp; go.
          </p>

          <form onSubmit={heroForm.handleSubmit} className="hero-form">
            <input
              type="email"
              value={heroForm.email}
              onChange={(e) => heroForm.resetEmail(e.target.value)}
              placeholder="Your email*"
              aria-label="Your email"
            />
            <button type="submit" disabled={heroForm.status === "loading"}>
              {heroForm.btnLabel}
            </button>
          </form>

          <div className="hero-note">
            {heroForm.note
              ? heroForm.note
              : <span className="mob-idle-note">Get early access, launch perks and first-batch pricing.</span>
            }
          </div>

          {/* Desktop-only powder accent */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/powder.png" alt="" aria-hidden="true" className="powder-img" />
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────── */}
      <section className="marquee-wrap">
        <div className="marquee-track">
          <div className="marquee-set">
            {marqueeItems.map((item, i) => <span key={i}>{item}</span>)}
          </div>
          <div className="marquee-set" aria-hidden="true">
            {marqueeItems.map((item, i) => <span key={`b-${i}`}>{item}</span>)}
          </div>
        </div>
      </section>

      {/* ── MOBILE FOOTER ───────────────────────────── */}
      <footer className="footer-mobile">
        <h2 className="footer-tagline-mob">Built<br />for<br />big<br />days.</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/design-logo.png" alt="Mealeo" className="footer-logo-mob" />
        <div className="footer-social-mob"><SocialIcons /></div>
        <div className="footer-copy-mob">© 2026 MEALEO<br />All rights reserved.</div>
      </footer>

      {/* ── DESKTOP FOOTER ──────────────────────────── */}
      <footer className="footer-desktop">
        <div className="footer-top">
          <h2 className="footer-tagline-desk">Built<br />for<br />big<br />days.</h2>

          <div className="footer-form-col">
            <div className="footer-heading">Eating well should be easier.</div>
            <p className="footer-sub">Get early access, launch perks and first-batch pricing.</p>
            <form onSubmit={footerForm.handleSubmit} className="footer-form">
              <input
                type="email"
                value={footerForm.email}
                onChange={(e) => footerForm.resetEmail(e.target.value)}
                placeholder="Email address"
                aria-label="Email address"
              />
              <button type="submit" disabled={footerForm.status === "loading"}>
                {footerForm.btnLabel}
              </button>
            </form>
            <div className="footer-note">{footerForm.note}</div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy-desk">© 2026 MEALEO<br />All rights reserved.</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/design-logo.png" alt="Mealeo" className="footer-logo-desk" />
          <div className="footer-social-desk"><SocialIcons /></div>
        </div>
      </footer>

    </div>
  );
}
