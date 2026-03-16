"use client";

import { useState } from "react";


const faqs = [
  {
    q: "What is Mealeo, exactly?",
    a: "Mealeo is a nutritionally complete powdered food that contains all the proteins, carbs, and fats your body needs, plus at least 100% of the Indian Recommended Dietary Allowances (RDA) for 26 essential vitamins and minerals. So you know you won't be deficient in any essential nutrients.",
  },
  {
    q: "Is this just another protein shake?",
    a: "No. Mealeo isn't a supplement; it's a complete meal. It delivers all the macronutrients to keep you full and energized.",
  },
  {
    q: "Why would I drink my meals instead of eating real food?",
    a: "You still can. Mealeo is simply a convenient, healthy option for when cooking, planning, or ordering food isn't possible. It's made for busy days, lazy nights, or any time you want balanced nutrition without the hassle.",
  },
  {
    q: "Is it safe? What's in it?",
    a: "Yes. We use high-quality, 100% vegan ingredients and undergo regular testing. All ingredients are carefully selected for quality and nutrition, with no preservatives or hidden blends.",
  },
  {
    q: "How much will it cost?",
    a: "Final pricing will be announced at launch. Mealeo is designed to be more affordable than most takeout meals or nutrition packs, without compromising on quality. Early waitlisters will receive special launch offers.",
  },
  {
    q: "What if I have dietary restrictions?",
    a: "Mealeo is free from animal products, soy, dairy, eggs, and added sugar, making it suitable even for those with complex dietary requirements. The full ingredient list will be shared before launch so you can review it easily.",
  },
  {
    q: "How long does it take to make?",
    a: "Less than 15 seconds. Scoop, shake, and sip. No blender or prep needed.",
  },
  {
    q: "Why should I join the waitlist now?",
    a: "The waitlist gives you front-row access to Mealeo's launch, early-bird pricing, and insider updates as we reveal the next evolution of nutrition. It's the easiest way to secure your spot before the first batch sells out.",
  },
];

function WaitlistForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        setMessage("You're on the list! Check your inbox for a confirmation.");
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

  return (
    <div>
      {status === "success" ? (
        <div
          className={`text-sm font-medium py-3 px-4 rounded-full ${
            dark
              ? "bg-white/10 text-[#C8E88A]"
              : "bg-[#ECEAE6] text-[#4A6E1A]"
          }`}
        >
          ✓ {message}
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`flex-1 px-5 py-3 rounded-full text-sm outline-none border transition-all
                ${
                  dark
                    ? "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:bg-white/15"
                    : "bg-white border-[#E5E2DE] text-[#1A1A1A] placeholder:text-[#ADADAD] focus:border-[#1A1A1A]"
                }`}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 justify-center
                ${
                  dark
                    ? "bg-white text-[#1A1A1A] hover:bg-[#F5F0E8] active:scale-95"
                    : "bg-[#1A1A1A] text-white hover:bg-[#333] active:scale-95"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {status === "loading" ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join the waitlist
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 7h12M7 1l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
          {status === "error" && (
            <p className="mt-2 text-xs text-red-500 pl-1">{message}</p>
          )}
          <div className={`mt-2.5 flex items-center gap-3 pl-4 text-xs ${dark ? "text-white/40" : "text-[#ADADAD]"}`}>
            <span>No spam. Just early access and launch perks.</span>
          </div>
        </>
      )}
    </div>
  );
}

function FAQItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E5E2DE] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-start justify-between text-left gap-4 group cursor-pointer"
      >
        <span className="text-[16px] font-semibold text-[#1A1A1A] group-hover:text-[#4A6E1A] transition-colors leading-snug">
          {q}
        </span>
        <span
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border border-[#D4D0CB] flex items-center justify-center transition-transform duration-200 ${
            open ? "rotate-45 border-[#4A6E1A]" : ""
          }`}
        >
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 1v8M1 5h8"
              stroke={open ? "#4A6E1A" : "#1A1A1A"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        <p className="pb-5 text-[16px] text-[#6B6B6B] leading-[1.45] pr-10">{a}</p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F4F1", color: "#1A1A1A" }}>
      {/* Nav + Hero wrapper with lighter bg */}
      <div style={{ backgroundColor: "#FAFAF8" }}>
      {/* Nav */}
      <nav className="px-4 md:px-8 py-3 flex items-center border-b border-[#E8E6E2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/web-logo.svg" alt="Mealeo" className="h-18 w-auto" />
      </nav>

      {/* Hero */}
      <section>
        <div className="px-6 md:px-12 pt-16 pb-0 grid md:grid-cols-2 gap-12 items-end max-w-6xl mx-auto">
          {/* Product visual */}
          <div className="hidden md:flex justify-start order-2 md:order-1 self-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/shaker-hand.svg" alt="Mealeo product" className="w-full max-w-sm h-auto block" />
          </div>

          {/* Copy */}
          <div className="order-1 md:order-2 pb-16">
            <div className="inline-flex items-center gap-2 bg-[#ECEAE6] rounded-full px-3 py-1 text-xs font-medium text-[#6B6B6B] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8BB04A] animate-pulse" />
              Launching soon · Join the waitlist
            </div>
            <h1
              className="text-[36px] md:text-[56px] font-bold leading-[1.15] mb-5"
            >
              This is a meal.
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#6B6B6B] leading-[1.45] mb-8 max-w-md">
              A complete meal in seconds, with 30g of protein, complex carbs, essential fats,
              fibre, and 26 vitamins and minerals. Just scoop, shake, and sip.
            </p>
            <div id="waitlist">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
      </div>{/* end lighter bg wrapper */}

      {/* Problem section */}
      <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-[28px] md:text-[45px] font-bold leading-[1.2] text-[#1A1A1A]">
            Busy days make eating well harder.
          </p>
          <div className="mt-4 space-y-1">
            <p className="text-[28px] md:text-[45px] font-bold leading-[1.2] text-[#ADADAD]">
              Meals get skipped.
            </p>
            <p className="text-[28px] md:text-[45px] font-bold leading-[1.2] text-[#ADADAD]">
              Takeout becomes the default.
            </p>
          </div>
          <p className="mt-8 text-[16px] md:text-[18px] text-[#6B6B6B] leading-[1.45] max-w-md border-l-2 border-[#E5E2DE] pl-5">
            We believe good nutrition shouldn&apos;t require so much effort.
          </p>
        </div>
      </section>

      {/* Why Mealeo */}
      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[260px_1fr] gap-10 items-start mb-12">
          <div>
            <h2 className="text-[28px] md:text-[45px] font-bold leading-[1.2]">
              Why Mealeo?
            </h2>
          </div>
          <div className="pt-3">
            <p className="text-[16px] md:text-[18px] text-[#6B6B6B] leading-[1.45]">
              More than a protein shake. It&apos;s a full meal — clean, convenient, and complete.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {/* Complete Nutrition */}
          <div className="rounded-2xl p-6 border border-white/70 hover:border-white/90 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-200 group backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.55)" }}>
            <div className="w-9 h-9 mb-4 text-[#4A4A4A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 3v9l5 3"/>
                <path d="M7.5 7.5l4.5 4.5"/>
              </svg>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2 text-[17px] leading-[1.2]">Complete Nutrition</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">Balanced macros and essential micronutrients.</p>
          </div>

          {/* Ready in Seconds */}
          <div className="rounded-2xl p-6 border border-white/70 hover:border-white/90 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-200 group backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.55)" }}>
            <div className="w-9 h-9 mb-4 text-[#4A4A4A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="13" r="8"/>
                <path d="M12 9v4l2.5 2.5"/>
                <path d="M9.5 2.5h5"/>
                <path d="M12 2.5v2"/>
              </svg>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2 text-[17px] leading-[1.2]">Ready in Seconds</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">No cooking. No preparation.</p>
          </div>

          {/* Actually Filling */}
          <div className="rounded-2xl p-6 border border-white/70 hover:border-white/90 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-200 group backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.55)" }}>
            <div className="w-9 h-9 mb-4 text-[#4A4A4A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3C8 3 5 6 5 10c0 3 1.5 5.5 4 7v2a1 1 0 001 1h4a1 1 0 001-1v-2c2.5-1.5 4-4 4-7 0-4-3-7-7-7z"/>
                <path d="M9 14c.8.8 1.8 1 3 1s2.2-.2 3-1"/>
              </svg>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2 text-[17px] leading-[1.2]">Actually Filling</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">Keeps you satisfied for hours.</p>
          </div>

          {/* No Calorie Counting */}
          <div className="rounded-2xl p-6 border border-white/70 hover:border-white/90 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-200 group backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.55)" }}>
            <div className="w-9 h-9 mb-4 text-[#4A4A4A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="18" rx="2"/>
                <path d="M9 7h6"/>
                <path d="M9 11h6"/>
                <path d="M9 15h4"/>
                <path d="M3 3l18 18"/>
              </svg>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2 text-[17px] leading-[1.2]">No Calorie Counting</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">Just shake and sip.</p>
          </div>

          {/* Actually Tastes Good */}
          <div className="rounded-2xl p-6 border border-white/70 hover:border-white/90 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-200 group backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.55)" }}>
            <div className="w-9 h-9 mb-4 text-[#4A4A4A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3c0 3-2 4-2 7a6 6 0 0012 0c0-3-2-4-2-7"/>
                <path d="M12 21v-4"/>
                <path d="M9 17.5c1 .5 2 .5 3 .5s2 0 3-.5"/>
                <path d="M10 3c0 2-1 3-1 5"/>
                <path d="M14 3c0 2 1 3 1 5"/>
              </svg>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2 text-[17px] leading-[1.2]">Actually Tastes Good</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">A smooth, rich chocolate shake.</p>
          </div>

          {/* Plant-Based */}
          <div className="rounded-2xl p-6 border border-white/70 hover:border-white/90 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-200 group backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.55)" }}>
            <div className="w-9 h-9 mb-4 text-[#4A4A4A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22V12"/>
                <path d="M12 12C12 7 16 3 21 3c0 5-4 9-9 9z"/>
                <path d="M12 12C12 7 8 3 3 3c0 5 4 9 9 9z"/>
                <path d="M12 16c0-2 2-4 5-4"/>
              </svg>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2 text-[17px] leading-[1.2]">Plant-Based</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">Better for animals and the planet.</p>
          </div>

        </div>
      </section>


      {/* Pre-Calculated section */}
      <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ADADAD] mb-4">
              The Perfect Balance
            </p>
            <h2 className="text-[28px] md:text-[45px] font-bold leading-[1.2] mb-6">
              Pre-Calculated.
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#6B6B6B] leading-[1.45]">
              We&apos;ve done the research so you don&apos;t have to. Every serving of
              Mealeo is a precision-engineered balance of 30g protein, healthy fats,
              and slow-release carbs — so you never have to think about it.
            </p>
          </div>

          {/* Nutrition label card */}
          <div className="bg-white rounded-2xl border border-[#E5E2DE] shadow-sm p-8 max-w-sm mx-auto w-full">
            <div className="border-b-4 border-[#1A1A1A] pb-2 mb-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#ADADAD]">
                Nutrition Facts
              </p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">Per 1 serving (100g)</p>
            </div>

            {[
              { label: "Calories", val: "400 kcal", pct: null, bold: true },
              { label: "Protein", val: "30g", pct: 95, bold: false },
              { label: "Carbohydrates", val: "40g", pct: 60, bold: false },
              { label: "of which sugars", val: "2g", pct: 20, bold: false, indent: true },
              { label: "Fat", val: "12g", pct: 50, bold: false },
              { label: "of which saturates", val: "2g", pct: 15, bold: false, indent: true },
              { label: "Fibre", val: "8g", pct: 70, bold: false },
            ].map((row) => (
              <div
                key={row.label}
                className={`py-2 ${row.indent ? "pl-4" : ""} ${row.bold ? "border-b border-[#E5E2DE]" : ""}`}
              >
                <div className="flex justify-between text-xs text-[#1A1A1A] mb-1">
                  <span className={row.bold ? "font-bold" : row.indent ? "text-[#ADADAD]" : "font-medium"}>
                    {row.label}
                  </span>
                  <span className={row.bold ? "font-bold" : "text-[#6B6B6B]"} style={{ fontFamily: "var(--font-dm-mono), monospace" }}>{row.val}</span>
                </div>
                {row.pct && (
                  <div className="h-1 rounded-full bg-[#ECEAE6] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${row.pct}%`,
                        background: "linear-gradient(90deg, #8BB04A, #A8CC6B)",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="mt-4 pt-4 border-t-2 border-[#1A1A1A]">
              <p className="text-[10px] text-[#ADADAD] leading-relaxed">
                ✓ 100% of Indian RDA for 26 essential vitamins & minerals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 py-16 max-w-3xl mx-auto">
        <h2 className="text-[28px] md:text-[45px] font-bold leading-[1.2] mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div className="bg-white rounded-2xl border border-[#E5E2DE] px-6 md:px-8 shadow-sm">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-12 py-24 text-center max-w-2xl mx-auto">
        <h2 className="text-[28px] md:text-[45px] font-bold leading-[1.2] mb-4">
          Ready to stop guessing?
        </h2>
        <p className="text-[16px] md:text-[18px] text-[#6B6B6B] mb-8 leading-[1.45]">
          Get early access and launch perks. The first batch won&apos;t last long.
        </p>
        <div className="max-w-md mx-auto">
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-10 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#E5E2DE]"
        style={{ backgroundColor: "#1A1A1A" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/web-logo.svg" alt="Mealeo" className="h-18 w-auto brightness-0 invert" />
        <p className="text-white/40 text-xs text-center">
          © {new Date().getFullYear()} Mealeo. All rights reserved.
        </p>
        <p className="text-white/40 text-xs">Made in India 🇮🇳</p>
      </footer>
    </div>
  );
}
