"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  Crosshair,
  Instagram,
  Loader2,
  MessageCircle,
  Network,
  Scale,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { APIService } from "@/services/api";

const terracotta = "#A54141";
const warmClay = "#C4876B";
const sandBeige = "#D9C49D";
const softIvory = "#F5F0DC";

// ── Hook: trigger once when element enters viewport ───────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Hook: count-up from 0 to target ──────────────────────────────────────────
function useCountUp(target: number, duration = 1100, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return value;
}

// ── Types ─────────────────────────────────────────────────────────────────────
type StatItem = {
  numericValue: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ElementType;
};

type TechItem = { icon: React.ElementType; title: string; description: string };

// ── Helper: format large numbers ──────────────────────────────────────────────
function fmtCount(raw: number, suffix: string): string {
  if (suffix === "+") {
    if (raw >= 1_000_000) return `${(raw / 1_000_000).toFixed(1)}M`;
    if (raw >= 1_000) return `${Math.floor(raw / 1_000)}K`;
  }
  return raw.toString();
}

// ── Stat card (float-up + count-up) ──────────────────────────────────────────
function StatCard({ stat, index, active }: { stat: StatItem; index: number; active: boolean }) {
  const count = useCountUp(stat.numericValue, 1100, active);
  const Icon = stat.icon;
  return (
    <div
      className="
        rounded-2xl
        border
        bg-white
        p-4
        shadow-sm
        transition-shadow
        hover:shadow-md
        flex
        flex-col
        items-center
        text-center
        md:p-6
      "
      style={{
        borderColor: `${sandBeige}66`,
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0px)" : "translateY(32px)",
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s`,
      }}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full md:mb-5 md:h-12 md:w-12" style={{ backgroundColor: terracotta }}>
        <Icon className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2} />
      </div>
      <p className="text-2xl font-extrabold text-neutral-900 md:text-3xl">
        {fmtCount(count, stat.suffix)}{stat.suffix}
      </p>
      <p className="mt-1 text-[13px] font-semibold text-neutral-800 md:text-base">{stat.label}</p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-500 md:mt-2 md:text-sm">{stat.description}</p>
    </div>
  );
}

// ── Tech step card (float-up) ─────────────────────────────────────────────────
function TechStepCard({ step, index, isLast, active }: { step: TechItem; index: number; isLast: boolean; active: boolean }) {
  const Icon = step.icon;
  return (
    <div
      className="relative flex flex-col items-center text-center"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0px)" : "translateY(28px)",
        transition: `opacity 0.55s ease ${index * 0.12}s, transform 0.55s ease ${index * 0.12}s`,
      }}
    >
      {!isLast && (
        <div
          className="absolute left-[calc(50%+2rem)] top-6 hidden h-px w-[calc(100%-1rem)] md:block"
          style={{ backgroundColor: `${warmClay}55` }}
        />
      )}
      <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full md:h-14 md:w-14" style={{ backgroundColor: `${sandBeige}cc` }}>
        <Icon className="h-5 w-5 md:h-6 md:w-6" style={{ color: warmClay }} strokeWidth={1.75} />
      </div>
      <p className="mt-2 text-[12px] font-semibold text-neutral-900 md:mt-3 md:text-sm">{step.title}</p>
      <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500 md:mt-1 md:text-[12px]">{step.description}</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { ref: statsRef, inView: statsInView } = useInView(0.2);
  const { ref: techRef, inView: techInView } = useInView(0.2);

  const handleAnalysis = async () => {
    if (!url.trim()) {
      setError("Please enter a valid Instagram URL.");
      return;
    }
    const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/p\/[\w-]+\/?/;
    if (!instagramUrlPattern.test(url)) {
      setError("The URL format is not valid. For example: https://www.instagram.com/p/ABC123xyz/");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await APIService.analyzeInstagramPost(url);
      localStorage.setItem("latest_analysis", JSON.stringify(result));
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while analyzing. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const stats: StatItem[] = [
    { numericValue: 1200000, suffix: "+", label: "Comments Analyzed", description: "From thousands of public Instagram posts.", icon: MessageCircle },
    { numericValue: 50000, suffix: "+", label: "Accounts Detected", description: "Potential accounts involved in CIB activities.", icon: Users },
    { numericValue: 89, suffix: "%", label: "Model Accuracy", description: "Our AI model is trained on high-quality data.", icon: Crosshair },
  ];

  const techSteps: TechItem[] = [
    { icon: Network, title: "Behavioral Analysis", description: "Detecting unusual behavioral patterns in comments." },
    { icon: Clock, title: "Temporal Analysis", description: "Analyzing the timing and frequency of comments in depth." },
    { icon: Brain, title: "Machine Learning", description: "Adaptive AI model with continuous learning for accurate results." },
    { icon: ShieldCheck, title: "Coordination Detection", description: "Identifying networks of accounts that work together." },
  ];

  return (
    <main className="min-h-screen text-neutral-900 antialiased">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#F6EBDD",
          backgroundImage: `
            radial-gradient(
              circle at top left,
              rgba(176, 73, 66, 0.95) 0%,
              rgba(196, 110, 92, 0.72) 18%,
              rgba(223, 170, 145, 0.38) 32%,
              rgba(246, 235, 221, 0) 52%
            )
          `,
        }} >
        <div className="pointer-events-none absolute bottom-0 right-0 h-full w-1/2"
          style={{
            background: `
              radial-gradient(
                ellipse 95% 85% at 100% 50%,
                rgba(255,250,242,0.98) 0%,
                rgba(248,240,228,0.92) 38%,
                rgba(245,235,220,0.55) 58%,
                transparent 78%
              )
            `,
          }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />

        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-28 md:px-8 md:pb-20 md:pt-32">
          <div className="grid items-center gap-6 lg:grid-cols-[1.4fr_0.6fr]">

            {/* Left copy */}
            <div className="max-w-[900px] pt-2">
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full border px-5 py-2 shadow-sm"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  background: `
                    linear-gradient(
                      135deg,
                      rgba(196,80,74,0.95) 0%,
                      rgba(165,65,65,0.88) 100%
                    )
                  `,
                  boxShadow: "0 6px 18px rgba(165,65,65,0.18)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span
                  className="
                    text-[8px]
                    tracking-[0.16em]
                    font-bold
                    uppercase
                    text-[#FFF4EC]

                    sm:text-[9px]
                    md:text-[10px]
                    md:tracking-[0.22em]
                  "
                >
                  AI-Powered · Ethical · Trusted
                </span>
              </div>
              <h1
                className="
                  max-w-[320px]
                  text-[1.65rem]
                  leading-[1.02]
                  font-bold
                  tracking-[-0.04em]
                  text-[#2A1715]
                  sm:max-w-[780px]
                  sm:text-[2.6rem]
                  md:text-[3.4rem]
                  lg:text-[3.6rem]
                "
              >
                Protect the Digital Space
                <br />
                from{" "}
                <span className="text-[#C85245]">
                  Opinion Manipulation
                </span>
              </h1>
              <p
                className="
                  mt-5
                  max-w-[620px]
                  text-[13px]
                  leading-[1.7]
                  text-[#5F4A45]
                  sm:text-[14px]
                  md:text-[16px]
                  lg:text-[18px]
                "
              >
                INDOBUZZTRA uses artificial intelligence and temporal analysis 
                to accurately and responsibly detect Coordinated Inauthentic Behavior 
                (CIB) activity in Instagram comments.
              </p>
            </div>

            {/* Right shield illustration */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative h-[300px] w-[300px] md:h-[360px] md:w-[360px]">
                <div className="absolute inset-0 rounded-full opacity-20 blur-2xl"
                  style={{ background: `radial-gradient(circle, ${terracotta}, transparent 70%)` }} />

                {/* Bubble left */}
                <div className="absolute left-0 top-14 flex items-center gap-2 rounded-xl border bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm"
                  style={{ borderColor: `${sandBeige}88` }}>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${sandBeige}99` }}>
                    <UserRound className="h-4 w-4" style={{ color: warmClay }} />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-20 rounded-full bg-neutral-200" />
                    <div className="h-1.5 w-14 rounded-full bg-neutral-100" />
                  </div>
                </div>

                {/* Bubble top-right */}
                <div className="absolute right-4 top-6 flex items-center gap-2 rounded-xl border bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm"
                  style={{ borderColor: `${sandBeige}88` }}>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${sandBeige}99` }}>
                    <UserRound className="h-4 w-4" style={{ color: warmClay }} />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-16 rounded-full bg-neutral-200" />
                    <div className="h-1.5 w-10 rounded-full bg-neutral-100" />
                  </div>
                </div>

                {/* Bubble bottom-right */}
                <div className="absolute bottom-20 right-0 flex items-center gap-2 rounded-xl border bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm"
                  style={{ borderColor: `${sandBeige}88` }}>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${sandBeige}99` }}>
                    <UserRound className="h-4 w-4" style={{ color: warmClay }} />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-12 rounded-full bg-neutral-200" />
                    <div className="h-1.5 w-8 rounded-full bg-neutral-100" />
                  </div>
                </div>

                {/* Center shield */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="absolute bottom-12 h-20 w-40 rounded-full opacity-40 blur-2xl"
                    style={{
                      background: "rgba(165,65,65,0.55)",
                    }}
                  />
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      filter: "drop-shadow(0 20px 45px rgba(165,65,65,0.35))",
                    }}
                  >
                    <Image
                      src="/logo.png"
                      alt="CIB Detector Logo"
                      width={198}
                      height={198}
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>

                {/* Dots */}
                {[
                  { top: "12%", left: "8%", size: 4, opacity: 0.25 },
                  { top: "18%", left: "20%", size: 6, opacity: 0.4 },
                  { top: "28%", left: "5%", size: 5, opacity: 0.35 },

                  { top: "14%", right: "12%", size: 7, opacity: 0.3 },
                  { top: "26%", right: "4%", size: 5, opacity: 0.45 },
                  { top: "36%", right: "14%", size: 4, opacity: 0.25 },

                  { top: "44%", left: "2%", size: 6, opacity: 0.35 },
                  { top: "52%", left: "12%", size: 3, opacity: 0.2 },
                  { top: "60%", left: "6%", size: 5, opacity: 0.3 },

                  { top: "48%", right: "2%", size: 6, opacity: 0.4 },
                  { top: "58%", right: "10%", size: 4, opacity: 0.25 },
                  { top: "68%", right: "6%", size: 7, opacity: 0.35 },

                  { bottom: "18%", left: "18%", size: 5, opacity: 0.25 },
                  { bottom: "10%", left: "30%", size: 8, opacity: 0.2 },
                  { bottom: "22%", left: "42%", size: 4, opacity: 0.35 },

                  { bottom: "14%", right: "18%", size: 5, opacity: 0.3 },
                  { bottom: "8%", right: "30%", size: 3, opacity: 0.2 },
                  { bottom: "20%", right: "40%", size: 6, opacity: 0.4 },

                  { top: "40%", left: "26%", size: 3, opacity: 0.25 },
                  { top: "34%", right: "28%", size: 5, opacity: 0.3 },
                  { bottom: "34%", left: "24%", size: 7, opacity: 0.2 },
                  { bottom: "30%", right: "22%", size: 4, opacity: 0.35 },
                ].map((dot, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      ...dot,
                      width: dot.size,
                      height: dot.size,
                      background: `
                        radial-gradient(
                          circle,
                          rgba(165,65,65,0.9) 0%,
                          rgba(196,135,107,0.7) 60%,
                          transparent 100%
                        )
                      `,
                      opacity: dot.opacity,
                      filter: "blur(0.3px)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div id="analisis" className="mx-auto mt-12 max-w-3xl scroll-mt-28">
            <div
              className="flex flex-col gap-3 rounded-2xl border bg-white/95 p-3 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:py-2 sm:pl-5 sm:pr-2"
              style={{ borderColor: sandBeige }}
            >
              <div className="flex flex-1 items-center gap-3">
                <Instagram className="h-6 w-6 shrink-0" style={{ color: warmClay }} />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && !loading && handleAnalysis()}
                  placeholder="Paste an Instagram URL to analyze..."
                  disabled={loading}
                  className="min-w-0 flex-1 bg-transparent py-2 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:opacity-50 md:text-[15px]"
                />
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:pr-0.5">
                <button
                  type="button"
                  onClick={handleAnalysis}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:rounded-full sm:px-6 sm:py-2.5 sm:text-sm"
                  style={{ background: `linear-gradient(135deg, #C4504A, #8e3030)`, boxShadow: `0 4px 16px rgba(165,65,65,0.4)` }}
                >
                  {loading
                    ? <><Loader2 className="h-5 w-5 animate-spin" />“Analyzing...</>
                    : <><Search className="h-5 w-5" />Start Analysis</>
                  }
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border bg-white/90 p-4 text-sm" style={{ borderColor: `${terracotta}55` }}>
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: terracotta }} />
                <p style={{ color: "#6b2a2a" }}>{error}</p>
              </div>
            )}
            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[#5F4A45] md:text-sm">
              <ShieldCheck className="h-4 w-4 text-[#9E3D3D]" />
              Secure, Private, and We Don’t Store Your Comments.
            </p>
          </div>

          {/* ── Feature bar ───────────────────────────────────── */}
            <div
              className="
                mx-auto
                mt-8
                max-w-5xl
                rounded-2xl
                border
                bg-white/75
                px-4
                py-4
                shadow-md
                backdrop-blur-sm
                md:mt-10
                md:flex
                md:flex-row
                md:items-center
                md:justify-between
                md:rounded-[26px]
                md:px-10
                md:py-7
              "
              style={{
                borderColor: "rgba(217,196,157,0.45)",
              }}
            >
              {/* Item utama */}
              <div className="flex items-center gap-3 md:min-w-[320px] md:gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl md:h-14 md:w-14 md:rounded-2xl"
                  style={{
                    background: "rgba(217,196,157,0.28)",
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={24}
                    height={24}
                    className="object-contain md:hidden"
                  />
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="hidden object-contain md:block"
                  />
                </div>

                <div className="min-w-0 leading-snug">
                  <p className="text-[12px] text-[#7A6A63] md:text-[15px]">
                    Built for
                  </p>
                  <p className="text-[14px] font-semibold text-[#4A2D29] md:text-[18px]">
                    a Healthy Digital Space
                  </p>
                </div>
              </div>

              {/* MOBILE: satu paragraf ringkas */}
              <p className="mt-3 border-t pt-3 text-[12px] text-center leading-[1.65] text-[#7A6A63] md:hidden"
                style={{ borderColor: "rgba(217,196,157,0.45)" }}>
                Research &amp; Academic-Based · Transparent &amp; Accountable · User Privacy Prioritized
              </p>

              {/* DESKTOP: layout horizontal */}
              <div className="hidden md:flex md:items-center md:gap-10">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-[#B84E43]" />
                  <div className="leading-snug">
                    <p className="text-[14px] text-[#7A6A63]">
                      Research <br />
                      &amp; Academic-Based
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Scale className="h-5 w-5 text-[#B84E43]" />
                  <div className="leading-snug">
                    <p className="text-[14px] text-[#7A6A63]">
                      Transparent <br />
                      &amp; Accountable
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-[#B84E43]" />
                  <div className="leading-snug">
                    <p className="text-[14px] text-[#7A6A63]">
                      User Privacy <br />
                      Prioritized
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* ── DAMPAK NYATA — ANIMASI 2: float-up + count-up ────── */}
      <section className="border-t py-12 md:py-24" style={{ backgroundColor: softIvory, borderColor: `${sandBeige}77` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p
            className="text-center font-bold uppercase text-[10px] tracking-[0.18em] sm:text-[11px] md:text-base md:tracking-[0.28em]" style={{ color: terracotta }}>
            Real Impact
          </p>
          <h2 className="relative mt-3 text-center text-[1.1rem] font-bold leading-[1.25] text-neutral-900 sm:text-[1.4rem] md:text-[2rem] lg:text-4xl">
            <span className="whitespace-nowrap">
              Numbers that Reflect Trust
            </span>

            <span
              className="
                absolute
                left-1/2
                -bottom-3
                h-1
                w-20
                -translate-x-1/2
                rounded-full
                md:w-28
              "
              style={{ backgroundColor: terracotta }}
            />
          </h2>
          <div
            ref={statsRef}
            className="
              mt-8
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              max-w-5xl
              mx-auto
              md:mt-14
              md:gap-5
            "
          >
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} active={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TEKNOLOGI — ANIMASI 3: float-up cards ────────────── */}
      <section className="py-12 md:py-24" style={{ backgroundColor: sandBeige }}>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 md:gap-12 md:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] md:text-xs md:tracking-[0.28em]" style={{ color: terracotta }}>
              The Technology Behind It
            </p>
            <h2 className="mt-2 text-[1.1rem] font-extrabold leading-tight text-neutral-900 sm:text-[1.4rem] md:mt-3 md:text-4xl">
              AI that Works<br />with Integrity
            </h2>
            <p className="mt-4 max-w-md text-[13px] leading-[1.7] text-neutral-700 md:mt-5 md:text-[15px]">
              INDOBUZZTRA combines machine learning, behavioral analysis, 
              and temporal patterns to intelligently identify opinion manipulation.
            </p>
            <Link
              href="/tentang"
              className="mt-6 inline-flex items-center gap-1.5 rounded-xl border-2 px-5 py-2.5 text-[13px] font-semibold transition hover:bg-white/50 md:mt-8 md:px-6 md:py-3 md:text-sm"
              style={{ borderColor: terracotta, color: terracotta }}
            >
              Learn More
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-lg md:p-8" style={{ borderColor: `${warmClay}33` }}>
            <div ref={techRef} className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {techSteps.map((step, i) => (
                <TechStepCard
                  key={step.title}
                  step={step}
                  index={i}
                  isLast={i === techSteps.length - 1}
                  active={techInView}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-1.5 md:hidden">
              {techSteps.map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: i === 0 ? terracotta : `${warmClay}88` }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}