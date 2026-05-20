"use client";

import { useState, useRef, useEffect } from "react";

// ── Waitlist form (calls real /api/waitlist → Supabase + Resend) ──────────────

function WaitlistForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      setTimeout(() => setStatus("idle"), 2000);
      return;
    }
    setStatus("loading");
    setMessage("");
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
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="success-msg" style={dark ? { maxWidth: "440px", margin: "0 auto" } : {}}>
        <span className="check" style={dark ? { color: "var(--accent)" } : {}}>✓</span>
        {" "}You&apos;re on the list. We&apos;ll be in touch before launch.
      </div>
    );
  }

  const inputStyle = dark ? { color: "var(--black)" } : {};

  return (
    <>
      <div className={dark ? "cta-form" : "waitlist-form"}>
        <input
          type="email"
          name={dark ? "email-cta" : "email-hero"}
          id={dark ? "email-cta" : "email-hero"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={dark ? "Your email address" : "Enter your email address"}
          autoComplete={dark ? "off" : "email"}
          style={inputStyle}
        />
        <button onClick={handleSubmit} disabled={status === "loading"}>
          {status === "loading" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      {status === "error" && <p className="error-msg">{message}</p>}
      {dark
        ? <p className="cta-sub">Early access &amp; launch perks. No spam.</p>
        : <p className="form-sub">Early access &amp; launch perks. No spam.</p>
      }
    </>
  );
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────

const faqs = [
  { q: "Wait, what actually is Mealeo?", a: "Mealeo is a complete meal. In powder form. Mix it with water and you get a proper balance of protein, carbs, fats, fibre and 26 vitamins and minerals. Built for when life gets in the way of eating right." },
  { q: "Is this just another protein shake?", a: "No. A protein shake tops up one nutrient. Mealeo is a full meal. Everything your body needs to stay full and energised, not just protein." },
  { q: "Why drink a meal instead of just eating?", a: "You still can. Mealeo is for the days when cooking, planning or ordering food just isn’t happening. Busy days, lazy nights or when you just want to eat right without thinking about it." },
  { q: "Is it safe? What’s in it?", a: "Yes. We use high-quality, 100% vegan ingredients and undergo regular testing. No preservatives, no hidden blends. The full ingredient list will be shared before launch." },
  { q: "How much is it going to cost?", a: "Pricing drops at launch. The goal is to be more affordable than takeout without compromising on quality. Early waitlisters get special launch pricing." },
  { q: "What if I have dietary restrictions?", a: "Mealeo is free from animal products, soy, dairy, eggs and added sugar. The full ingredient list will be shared before launch so you can check it yourself." },
  { q: "How fast is it to make?", a: "Under 15 seconds. Scoop, shake, sip. Just a shaker bottle and water. That’s genuinely it." },
  { q: "Why join now and not later?", a: "Early access, launch pricing and insider updates before anyone else. The first batch won’t last, and waitlist members are first in line." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button className="faq-q" onClick={() => setOpen(!open)}>
        {q}
        <span className="faq-arrow">+</span>
      </button>
      <div className="faq-a"><p>{a}</p></div>
    </div>
  );
}

// ── Macro bars with IntersectionObserver ──────────────────────────────────────

const macros = [
  { label: "Protein", value: "30g", width: 0.72 },
  { label: "Healthy fats", value: "13g", width: 0.42 },
  { label: "Total Carbs", value: "45g", width: 0.84, segments: [
    { label: "Complex carbs", value: "35g", flex: 35, accent: false },
    { label: "Dietary fibre", value: "10g", flex: 10, accent: true },
  ]},
];

function MacroBars() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="macro-bars" ref={ref}>
      {macros.map(({ label, value, width, segments }) => (
        <div className="macro-bar-row" key={label}>
          <div className="macro-bar-header">
            <strong>{label}</strong><span>{value}</span>
          </div>
          <div className="macro-bar-track">
            {segments ? (
              <div
                className={`macro-bar-split${animated ? " animate" : ""}`}
                style={animated ? { transform: `scaleX(${width})` } : {}}
              >
                {segments.map(seg => (
                  <div
                    key={seg.label}
                    className={`macro-bar-segment${seg.accent ? " accent" : ""}`}
                    style={{ flex: seg.flex }}
                  />
                ))}
              </div>
            ) : (
              <div
                className={`macro-bar-fill${animated ? " animate" : ""}`}
                style={animated ? { transform: `scaleX(${width})` } : {}}
              />
            )}
          </div>
          {segments && (
            <div className="macro-bar-seg-labels" style={{ width: `${width * 100}%` }}>
              {segments.map(seg => (
                <div
                  key={seg.label}
                  className={`macro-bar-seg-label${seg.accent ? " accent" : ""}`}
                  style={{ flex: seg.flex }}
                >
                  {seg.label} {seg.value}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Ingredients scroll ────────────────────────────────────────────────────────

const ingredients = [
  { img: "/ingredients/oats.avif", name: "Oat Flour" },
  { img: "/ingredients/peas.avif", name: "Pea Protein" },
  { img: "/ingredients/flaxseeds.avif", name: "Flaxseeds" },
  { img: "/ingredients/coconut.avif", name: "Coconut" },
  { img: "/ingredients/Brown rice.avif", name: "Brown Rice Protein" },
  { img: "/ingredients/Sunflower seeds.avif", name: "Sunflower Seeds" },
  { img: "/ingredients/Tapioca.avif", name: "Tapioca" },
  { img: "/ingredients/yeast.avif", name: "Yeast Protein" },
];

function IngredientsScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = Math.max(0, Math.min(maxScroll, el.scrollLeft + (dir === "right" ? 260 : -260)));
    el.scrollTo({ left: target, behavior: "smooth" });
  };
  return (
    <div className="ing-scroll-wrap">
      <div className="ing-scroll-btns">
        <button className="ing-scroll-btn" onClick={() => scroll("left")} aria-label="Scroll left">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button className="ing-scroll-btn" onClick={() => scroll("right")} aria-label="Scroll right">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className="ingredients-scroll" ref={scrollRef}>
        {ingredients.map(({ img, name }) => (
          <div className="ing-item" key={name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={name} className="ing-img" loading="lazy" />
            <span className="ing-name">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Marquee items ─────────────────────────────────────────────────────────────

const marqueeItems = [
  { text: "Complete nutrition", accent: true },
  { text: "No calorie tracking", accent: false },
  { text: "Plant-based", accent: true },
  { text: "30g protein", accent: false },
  { text: "26 vitamins & minerals", accent: true },
  { text: "Ready in 15 seconds", accent: false },
  { text: "No cooking required", accent: true },
  { text: "100% vegan", accent: false },
  { text: "No added sugar", accent: true },
  { text: "No preservatives", accent: false },
  { text: "Non-GMO", accent: true },
  { text: "Soy-free", accent: false },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [benefitsPage, setBenefitsPage] = useState(0);

  useEffect(() => {
    // Prevent Safari from restoring scroll position on refresh when a hash is in the URL
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    const obs = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0 });
    if (heroRef.current) obs.observe(heroRef.current);
    const obs2 = new IntersectionObserver(([e]) => setCtaVisible(e.isIntersecting), { threshold: 0 });
    if (ctaRef.current) obs2.observe(ctaRef.current);
    return () => { obs.disconnect(); obs2.disconnect(); };
  }, []);

  const handleBenefitsScroll = () => {
    const el = benefitsRef.current;
    if (!el) return;
    setBenefitsPage(Math.round(el.scrollLeft / el.offsetWidth));
  };

  const showNavCta = !heroVisible && !ctaVisible;

  return (
    <>
      {/* NAV */}
      <nav>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a href="#"><img src="/web-logo.svg" alt="Mealeo" style={{ height: "4.608rem", width: "auto" }} /></a>
        <a
          href="#cta"
          className="nav-cta"
          style={{ opacity: showNavCta ? 1 : 0, pointerEvents: showNavCta ? "auto" : "none", transition: "opacity 0.3s ease" }}
          onClick={(e) => { e.preventDefault(); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" }); }}
        >Join waitlist</a>
      </nav>

      {/* HERO */}
      <section className="hero" id="waitlist" ref={heroRef}>
        <div className="container hero-layout">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Dropping soon in India
            </div>
            <div className="hero-title-row">
              <h1>Meals made<br /><em>easier.</em></h1>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/shaker.png" alt="Mealeo shaker" className="hero-image-mobile" />
            </div>
            <p className="hero-sub">For people who looked up and realized it&apos;s 3pm and they still haven&apos;t eaten.</p>
            <WaitlistForm />
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-num">30g</span>
                <span className="stat-label">Protein per serving</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">26</span>
                <span className="stat-label">Vitamins &amp; minerals</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">400</span>
                <span className="stat-label">Calories per serving</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">&lt;15s</span>
                <span className="stat-label">Prep time</span>
              </div>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/shaker-hand.svg" alt="Mealeo shaker" className="hero-image" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className={item.accent ? "accent" : ""}>{item.text}</span>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section className="problem-section">
        <div className="container problem-layout">
          <div className="problem-text">
            <h2>Real talk. Eating well is actually hard.</h2>
          </div>
          <div className="problem-list">
            {["Skipping meals and pretending it\u2019s fine", "Spending money on delivery, again", "Opening a calorie app and immediately giving up"].map((item) => (
              <div className="problem-list-item crossed" key={item}>
                <span className="problem-list-text">{item}</span>
              </div>
            ))}
            <div className="problem-list-item solution">
              <span className="problem-list-label">The fix</span>
              <span className="problem-list-text">Mealeo. A complete meal in 15 seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="benefits-heading">What you get</h2>
          <div className="benefits-slider" ref={benefitsRef} onScroll={handleBenefitsScroll}>
            <div className="benefits-page">
              {[
                { n: "01", title: "Complete Nutrition", desc: "Everything your body actually needs. In every serving." },
                { n: "02", title: "Ready in Seconds", desc: "No cooking. No prep. Scoop, shake, sip." },
                { n: "03", title: "Keeps you Full", desc: "30g protein and slow-release carbs. Keeps you full for real." },
              ].map(({ n, title, desc }) => (
                <div className="benefit-card" key={n}>
                  <span className="benefit-num">{n}</span>
                  <div className="benefit-title">{title}</div>
                  <div className="benefit-desc">{desc}</div>
                </div>
              ))}
            </div>
            <div className="benefits-page">
              {[
                { n: "04", title: "No Calorie Counting", desc: "We did the math so you don't have to." },
                { n: "05", title: "Taste", desc: "Smooth chocolate. Made with Indonesian cocoa." },
                { n: "06", title: "Plant-Based", desc: "100% vegan. Good for you, good for the planet." },
              ].map(({ n, title, desc }) => (
                <div className="benefit-card" key={n}>
                  <span className="benefit-num">{n}</span>
                  <div className="benefit-title">{title}</div>
                  <div className="benefit-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="benefits-dots">
            <span className={`benefits-dot${benefitsPage === 0 ? " active" : ""}`} />
            <span className={`benefits-dot${benefitsPage === 1 ? " active" : ""}`} />
          </div>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="ingredients-section">
        <div className="container">
          <div className="ingredients-header">
            <h2>Made with actual food.<br />Formulated by nutritionists.</h2>
            <p>Designed for your daily routine.</p>
          </div>
          <IngredientsScroll />
        </div>
      </section>

      {/* MACROS */}
      <section className="macro-section">
        <div className="container macro-layout">
          <div className="macro-text">
            <h2>The perfect balance,<br />pre-calculated.</h2>
            <p>We did the research so you don&apos;t have to. Every serving hits the right balance of protein, healthy fats and slow-release carbs, covering your daily nutritional needs with 26 essential vitamins and minerals.</p>
            <MacroBars />
            <div className="macro-vitamins">
              <span className="vitamins-badge">26</span>
              <span className="vitamins-text">Essential vitamins &amp; minerals for complete daily nutrition.</span>
            </div>
          </div>

          <div className="nutrition-card">
            <div className="nutrition-title">Nutrition Facts</div>
            <div className="nutrition-serving">Per serving (100g), Chocolate</div>
            <hr className="nutrition-divider" />
            <div className="nutrition-row">
              <span>Calories</span>
              <span className="nutrition-cal">400</span>
            </div>
            <hr style={{ border: "none", borderTop: "4px solid var(--black)", margin: "4px 0" }} />
            <div className="nutrition-row major"><span>Total Fat</span><span>13g</span></div>
            <hr className="nutrition-divider-thin" />
            <div className="nutrition-row major"><span>Total Carbohydrate</span><span>45g</span></div>
            <div className="nutrition-row sub"><span>Dietary fibre</span><span>10g</span></div>
            <div className="nutrition-row sub"><span>Added sugars</span><span>0g</span></div>
            <hr className="nutrition-divider-thin" />
            <div className="nutrition-row major"><span>Protein</span><span>30g</span></div>
            <hr className="nutrition-divider-thin" />
            <div className="nutrition-row" style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--warm-gray)" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Vitamins &amp; Minerals</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 500 }}>26 essential</span>
            </div>
            <div className="nutrition-row sub"><span>Vitamin D</span><span>39% RDA</span></div>
            <div className="nutrition-row sub"><span>Calcium</span><span>22% RDA</span></div>
            <div className="nutrition-row sub"><span>Vitamin B12</span><span>91% RDA</span></div>
            <div className="nutrition-row sub"><span>+ 23 more</span><span></span></div>
            <hr className="nutrition-divider-thin" style={{ marginTop: "1rem" }} />
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>
              *% Daily Values are based on Indian RDA. Nutritional values are per 100g serving.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container faq-layout">
          <div className="faq-sticky">
            <span className="section-label">FAQ</span>
            <h2>Questions,<br />answered.</h2>
          </div>
          <div className="faq-items">
            {faqs.map((faq) => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section" id="cta" ref={ctaRef}>
        <div className="container" style={{ maxWidth: 680, textAlign: "center" }}>
          <h2>Eating should be easier.</h2>
          <p>Early access, launch perks and first-batch pricing. Your future self will thank you.</p>
          <WaitlistForm dark />
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <span className="footer-copy">© 2025 Mealeo. All rights reserved.</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a href="#"><img src="/TM.png" alt="Mealeo" style={{ height: "4.48rem", width: "auto" }} /></a>
      </footer>
    </>
  );
}
