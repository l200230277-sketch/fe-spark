"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
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
  Shield,
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

type FeatureItem = { icon: React.ElementType; title: string; highlight: string };
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
      className="rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      style={{
        borderColor: `${sandBeige}66`,
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0px)" : "translateY(32px)",
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s`,
      }}
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: terracotta }}>
        <Icon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      <p className="text-3xl font-extrabold text-neutral-900">
        {fmtCount(count, stat.suffix)}{stat.suffix}
      </p>
      <p className="mt-1 font-semibold text-neutral-800">{stat.label}</p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500">{stat.description}</p>
    </div>
  );
}

// ── Feature card (float-up) ───────────────────────────────────────────────────
function FeatureCard({ item, index, active }: { item: FeatureItem; index: number; active: boolean }) {
  const Icon = item.icon;
  return (
    <div
      className="flex items-center gap-3 px-5 py-4 md:flex-col md:items-start md:py-5 lg:items-center lg:text-center"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0px)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
      }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${sandBeige}66` }}>
        <Icon className="h-5 w-5" style={{ color: terracotta }} strokeWidth={1.75} />
      </div>
      <div className="text-sm leading-snug">
        <span className="text-neutral-500">{item.title} </span>
        <span className="font-semibold text-neutral-900">{item.highlight}</span>
      </div>
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
      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${sandBeige}cc` }}>
        <Icon className="h-6 w-6" style={{ color: warmClay }} strokeWidth={1.75} />
      </div>
      <p className="mt-3 text-sm font-semibold text-neutral-900">{step.title}</p>
      <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">{step.description}</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { ref: featuresRef, inView: featuresInView } = useInView(0.2);
  const { ref: statsRef, inView: statsInView } = useInView(0.2);
  const { ref: techRef, inView: techInView } = useInView(0.2);

  const handleAnalysis = async () => {
    if (!url.trim()) {
      setError("Mohon masukkan URL Instagram yang valid");
      return;
    }
    const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/p\/[\w-]+\/?/;
    if (!instagramUrlPattern.test(url)) {
      setError("Format URL tidak valid. Contoh: https://www.instagram.com/p/ABC123xyz/");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await APIService.analyzeInstagramPost(url);
      localStorage.setItem("latest_analysis", JSON.stringify(result));
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat menganalisis. Silakan coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const stats: StatItem[] = [
    { numericValue: 1200000, suffix: "+", label: "Komentar Dianalisis", description: "Dari ribuan postingan publik Instagram.", icon: MessageCircle },
    { numericValue: 50000, suffix: "+", label: "Akun Terdeteksi", description: "Potensi akun yang terlibat dalam aktivitas CIB.", icon: Users },
    { numericValue: 89, suffix: "%", label: "Akurasi Model", description: "Model AI kami dilatih dengan data berkualitas tinggi.", icon: Crosshair },
    { numericValue: 24, suffix: "/7", label: "Monitoring Cerdas", description: "Sistem bekerja tanpa henti melindungi ruang diskusi.", icon: ShieldCheck },
  ];

  const features: FeatureItem[] = [
    { icon: Shield, title: "Dibangun untuk", highlight: "Ruang Digital yang Sehat" },
    { icon: BookOpen, title: "Berbasis", highlight: "Riset & Akademik" },
    { icon: Scale, title: "Transparan &", highlight: "Akuntabel" },
    { icon: UserRound, title: "Privasi Pengguna", highlight: "Diutamakan" },
  ];

  const techSteps: TechItem[] = [
    { icon: Network, title: "Analisis Perilaku", description: "Mendeteksi pola perilaku tidak wajar dalam komentar." },
    { icon: Clock, title: "Analisis Temporal", description: "Menganalisis waktu dan frekuensi komentar secara mendalam." },
    { icon: Brain, title: "Machine Learning", description: "Model AI adaptif dengan pembelajaran berkelanjutan untuk hasil akurat." },
    { icon: ShieldCheck, title: "Deteksi Koordinasi", description: "Menemukan jaringan akun yang bekerja secara terkoordinasi." },
  ];

  return (
    <main className="min-h-screen text-neutral-900 antialiased">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `
            linear-gradient(
              135deg,
              #8F2F2F 0%,
              #A54141 16%,
              #B85C4B 34%,
              #C4876B 52%,
              #D9B89C 68%,
              #E7D8BE 84%,
              #F5F0DC 100%
            )`,
        }}
      >
        <div className="pointer-events-none absolute bottom-0 right-0 h-full w-1/2"
          style={{ background: `
            radial-gradient(
              ellipse 85% 75% at 100% 55%,
              rgba(255,248,235,0.95) 0%,
              rgba(245,240,220,0.72) 38%,
              rgba(231,228,190,0.28) 58%,
              transparent 78%
            )`, }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />

        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-28 md:px-8 md:pb-20 md:pt-32">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,460px)]">

            {/* Left copy */}
            <div>
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
                style={{ borderColor: "rgba(255,255,255,0.35)", backgroundColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
              >
                <Shield className="h-3.5 w-3.5 text-white/90" strokeWidth={2} />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
                  AI-Powered · Ethical · Trusted
                </span>
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white md:text-5xl lg:text-[3.2rem]">
                Lindungi Ruang Digital
                <br />
                <span className="text-white/80">dari Manipulasi Opini</span>
              </h1>
              <p className="mt-5 max-w-[520px] text-sm leading-relaxed text-white/75 md:text-[15px]">
                CIB Detector menggunakan kecerdasan buatan dan analisis temporal untuk mendeteksi
                aktivitas Coordinated Inauthentic Behavior (CIB) pada komentar Instagram secara
                akurat dan bertanggung jawab.
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
                <div className="absolute bottom-10 right-0 flex items-center gap-2 rounded-xl border bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm"
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
                  <div className="absolute bottom-12 h-16 w-36 rounded-full opacity-30 blur-xl" style={{ background: terracotta }} />
                  <div
                    className="relative flex h-44 w-44 items-center justify-center rounded-[2.5rem] shadow-2xl md:h-52 md:w-52"
                    style={{
                      background: `linear-gradient(145deg, #C4504A 0%, ${terracotta} 40%, #8a3030 100%)`,
                      boxShadow: `0 20px 60px rgba(165,65,65,0.45), 0 4px 20px rgba(165,65,65,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
                    }}
                  >
                    <div className="absolute inset-0 rounded-[2.5rem] opacity-30"
                      style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)` }} />
                    <Shield className="relative z-10 h-20 w-20 text-white/95 md:h-24 md:w-24" strokeWidth={1.25} />
                    <Activity className="absolute bottom-10 z-10 h-10 w-10 text-white md:bottom-12 md:h-12 md:w-12" strokeWidth={2} />
                  </div>
                </div>

                {/* Dots */}
                {[
                  { top: "38%", left: "4%", size: 6, opacity: 0.5 },
                  { top: "55%", left: "10%", size: 4, opacity: 0.35 },
                  { top: "25%", right: "6%", size: 5, opacity: 0.4 },
                  { bottom: "30%", right: "12%", size: 7, opacity: 0.3 },
                ].map((dot, i) => (
                  <div key={i} className="absolute rounded-full"
                    style={{ ...dot, width: dot.size, height: dot.size, backgroundColor: terracotta, opacity: dot.opacity }} />
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
                  placeholder="Masukkan URL postingan Instagram..."
                  disabled={loading}
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:opacity-50 md:text-[15px]"
                />
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:pr-0.5">
                <Shield className="hidden h-5 w-5 sm:block" style={{ color: terracotta }} />
                <button
                  type="button"
                  onClick={handleAnalysis}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:rounded-full sm:py-2.5"
                  style={{ background: `linear-gradient(135deg, #C4504A, #8e3030)`, boxShadow: `0 4px 16px rgba(165,65,65,0.4)` }}
                >
                  {loading
                    ? <><Loader2 className="h-5 w-5 animate-spin" />Menganalisis...</>
                    : <><Search className="h-5 w-5" />Analisis Sekarang</>
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
            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-white/75 md:text-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Aman, Privat, dan Tidak Menyimpan Data Komentar Anda.
            </p>
          </div>

          {/* ── ANIMASI 1: Feature bar — float-up saat scroll ── */}
          <div
            ref={featuresRef}
            className="mx-auto mt-10 grid max-w-5xl grid-cols-2 divide-x divide-y rounded-2xl border bg-white/80 shadow-md backdrop-blur-sm md:grid-cols-4 md:divide-y-0"
            style={{ borderColor: sandBeige }}
          >
            {features.map((item, i) => (
              <FeatureCard key={i} item={item} index={i} active={featuresInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DAMPAK NYATA — ANIMASI 2: float-up + count-up ────── */}
      <section className="border-t py-16 md:py-24" style={{ backgroundColor: softIvory, borderColor: `${sandBeige}77` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.28em] md:text-xs" style={{ color: terracotta }}>
            Dampak Nyata
          </p>
          <h2 className="mx-auto mt-3 max-w-xl text-center text-2xl font-bold text-neutral-900 md:text-3xl lg:text-4xl">
            Angka yang{" "}
            <span className="relative inline-block">
              Mencerminkan
              <span className="absolute -bottom-1 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full" style={{ backgroundColor: terracotta }} />
            </span>{" "}
            Kepercayaan
          </h2>
          <div ref={statsRef} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} active={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TEKNOLOGI — ANIMASI 3: float-up cards ────────────── */}
      <section className="py-16 md:py-24" style={{ backgroundColor: sandBeige }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] md:text-xs" style={{ color: terracotta }}>
              Teknologi di Baliknya
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-neutral-900 md:text-4xl">
              AI yang Bekerja<br />dengan Integritas
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-700 md:text-[15px]">
              CIB Detector menggabungkan machine learning, analisis perilaku, dan pola temporal untuk
              mengidentifikasi manipulasi opini secara cerdas.
            </p>
            <Link
              href="/tentang"
              className="mt-8 inline-flex items-center gap-1.5 rounded-xl border-2 px-6 py-3 text-sm font-semibold transition hover:bg-white/50"
              style={{ borderColor: terracotta, color: terracotta }}
            >
              Pelajari Lebih Lanjut
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-lg md:p-8" style={{ borderColor: `${warmClay}33` }}>
            <div ref={techRef} className="grid grid-cols-2 gap-6 md:grid-cols-4">
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