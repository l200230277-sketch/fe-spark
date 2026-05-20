"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Check,
  Clock,
  FileJson,
  Flame,
  Landmark,
  Lightbulb,
  Link2,
  MessageCircle,
  ScanSearch,
  Shield,
  ShieldCheck,
  Target,
  Users,
  Code2,
} from "lucide-react";

// ── Unified warm palette (same tone as Beranda hero throughout) ──
const terracotta = "#A54141";
const warmClay   = "#C4876B";
const sandBeige  = "#D9C49D";
const pageBg     = "#F6EBDD";

function useInView(threshold = 0.15) {
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
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const PROBLEM_ANIMS = ["card-anim-left", "card-anim-rise", "card-anim-right"] as const;
const METHOD_ANIMS = ["card-anim-scale", "card-anim-tilt"] as const;
const CONTRIB_ANIMS = ["card-anim-left", "card-anim-rise", "card-anim-right"] as const;

const sectionAlt = "#F0E4CF";

function SeverityRow({ label, filled }: { label: string; filled: number }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3 md:mt-5 md:gap-3 md:pt-4" style={{ borderColor: `${sandBeige}99` }}>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: terracotta }}>
        {label}
      </span>
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-xl"
            style={{ backgroundColor: i < filled ? terracotta : sandBeige }}
          />
        ))}
      </div>
    </div>
  );
}

export default function TentangPage() {
  const { ref: problemsRef, inView: problemsInView } = useInView(0.12);
  const { ref: methodRef, inView: methodInView } = useInView(0.12);
  const { ref: contribRef, inView: contribInView } = useInView(0.12);

  const methodology = [
    {
      icon: Brain,
      title: "Semantic Analysis (Lexical/Semantic)",
      accent: terracotta,
      bgIcon: terracotta,
      points: [
        "Natural language processing to understand the context of comments",
        "Understanding contextual nuances, slang, and sarcasm",
        "Detecting narrative similarities (scripts) across comments",
        "Identifying copy-paste patterns with minor variations",
      ],
    },
    {
      icon: Clock,
      title: "Temporal Analysis (Time Patterns)",
      accent: warmClay,
      bgIcon: warmClay,
      points: [
        "Forensic analysis of comment time metadata",
        "Detecting irregular activity spikes (burstiness)",
        "Analyzing posting time synchronization across accounts",
        "Identifying coordinated attack patterns",
      ],
    },
  ];

  const problems = [
    {
      icon: AlertTriangle,
      title: "Manipulasi Opini Publik",
      desc: "Jaringan buzzer menyebarkan narasi buatan secara sistematis untuk mempengaruhi persepsi masyarakat pada postingan viral.",
      severityLabel: "Dampak Tinggi",
      severityFilled: 3,
    },
    {
      icon: Users,
      title: "Coordinated Inauthentic Behavior",
      desc: "Perilaku tidak otentik yang terkoordinasi sulit dikenali pengguna awam, namun merusak legitimasi diskusi publik.",
      severityLabel: "Risiko Aktif",
      severityFilled: 3,
    },
    {
      icon: Target,
      title: "Polarisasi Masyarakat",
      desc: "Konten manipulatif memecah belah opini dan mengurangi ruang bagi dialog berbasis fakta di media sosial.",
      severityLabel: "Dampak Struktural",
      severityFilled: 2,
    },
  ];

  const workflow = [
    { step: 1, title: "Input Instagram URL",                    icon: ScanSearch    },
    { step: 2, title: "Scraping Comments",                      icon: MessageCircle },
    { step: 3, title: "Hybrid Analysis (Semantic + Temporal)", icon: Brain         },
    { step: 4, title: "CIB Score & Result Visualization",           icon: Shield        },
  ];

  const contribution = [
    { n: "01", title: "Transparansi Informasi", desc: "Data yang dapat diverifikasi secara mandiri oleh masyarakat, jurnalis, dan peneliti sosial.", icon: ScanSearch },
    { n: "02", title: "Literasi Digital",        desc: "Memberdayakan masyarakat dengan daya pikir kritis agar tidak mudah terpolarisasi oleh narasi buatan.", icon: Users },
    { n: "03", title: "Demokrasi Informasi",     desc: "Menjaga ruang digital Indonesia tetap sehat dan mendukung lingkungan media sosial yang lebih jujur.", icon: Landmark },
  ];

  const techCards = [
    { title: "Detection Engine",       items: [{ icon: Link2,     text: "TF-IDF + K-Means (Clustering)" }, { icon: Code2,    text: "Python (Core Engine)" }] },
    { title: "Backend Infrastructure", items: [{ icon: Flame,     text: "Flask (Backend API)" },           { icon: FileJson, text: "JSON (Data Format)" }] },
    { title: "Frontend Intelligence",  items: [{ icon: Code2,     text: "Next.js (Frontend Framework)" }] },
    { title: "Data Visualization",     items: [{ icon: BarChart3, text: "Recharts (Visualization)" }] },
  ];

  type DotItem = { size: number; opacity: number; top?: string; left?: string; right?: string; bottom?: string };
  const dots: DotItem[] = [
    { top: "12%",    left: "8%",   size: 4, opacity: 0.25 },
    { top: "18%",    left: "20%",  size: 6, opacity: 0.4  },
    { top: "28%",    left: "5%",   size: 5, opacity: 0.35 },
    { top: "14%",    right: "12%", size: 7, opacity: 0.3  },
    { top: "26%",    right: "4%",  size: 5, opacity: 0.45 },
    { top: "36%",    right: "14%", size: 4, opacity: 0.25 },
    { top: "44%",    left: "2%",   size: 6, opacity: 0.35 },
    { top: "52%",    left: "12%",  size: 3, opacity: 0.2  },
    { top: "60%",    left: "6%",   size: 5, opacity: 0.3  },
    { top: "48%",    right: "2%",  size: 6, opacity: 0.4  },
    { top: "58%",    right: "10%", size: 4, opacity: 0.25 },
    { top: "68%",    right: "6%",  size: 7, opacity: 0.35 },
    { bottom: "18%", left: "18%",  size: 5, opacity: 0.25 },
    { bottom: "10%", left: "30%",  size: 8, opacity: 0.2  },
    { bottom: "22%", left: "42%",  size: 4, opacity: 0.35 },
    { bottom: "14%", right: "18%", size: 5, opacity: 0.3  },
    { bottom: "8%",  right: "30%", size: 3, opacity: 0.2  },
    { bottom: "20%", right: "40%", size: 6, opacity: 0.4  },
    { top: "40%",    left: "26%",  size: 3, opacity: 0.25 },
    { top: "34%",    right: "28%", size: 5, opacity: 0.3  },
    { bottom: "34%", left: "24%",  size: 7, opacity: 0.2  },
    { bottom: "30%", right: "22%", size: 4, opacity: 0.35 },
  ];

  return (
    <main className="min-h-screen text-neutral-900 antialiased" style={{ backgroundColor: pageBg }}>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden pt-28 pb-12 md:pt-40 md:pb-24"
        style={{
          backgroundColor: pageBg,
          backgroundImage: `
            radial-gradient(
              circle at top left,
              rgba(176,73,66,0.95)   0%,
              rgba(196,110,92,0.72)  18%,
              rgba(223,170,145,0.38) 32%,
              rgba(246,235,221,0)    52%
            )
          `,
        }}
      >
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-full w-1/2"
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
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: `radial-gradient(circle,#fff 1px,transparent 1px)`, backgroundSize: "32px 32px" }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 md:gap-12 md:px-8 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-16">
          <div>
            {/* Desktop: pill tags */}
            <div
              className="mb-6 hidden flex-wrap items-center gap-1.5 rounded-full border px-4 py-2 shadow-sm md:inline-flex"
              style={{
                borderColor: sandBeige,
                backgroundColor: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(8px)",
              }}
            >
              {["ETHICAL AI", "SOCIAL DEFENSE", "DIGITAL TRUST"].map((t, i) => (
                <Fragment key={t}>
                  {i > 0 && (
                    <span
                      className="mx-0.5 rotate-45"
                      style={{
                        width: "5px",
                        height: "5px",
                        backgroundColor: warmClay,
                        display: "inline-block",
                        borderRadius: "1px",
                        opacity: 0.9,
                      }}
                    />
                  )}
                  <span className="text-xs font-bold tracking-wide text-neutral-800">{t}</span>
                </Fragment>
              ))}
            </div>
            {/* Mobile: satu paragraf */}
            <p
              className="mb-4 text-[10px] font-bold text-center uppercase tracking-[0.16em] md:hidden"
              style={{ color: terracotta }}
            >
              Ethical AI · Social Defense · Digital Trust
            </p>

            <h1 className="text-[1.9rem] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-900 sm:text-[2.4rem] md:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
              Building a More Honest Digital{" "}
              <span style={{ color: terracotta }}>Space</span>
            </h1>
            <p className="mt-4 max-w-xl text-[13px] leading-[1.7] text-neutral-700 md:mt-5 md:text-base">
              INDOBUZZTRA is a web-based verification platform designed to help 
              detect Coordinated Inauthentic Behavior (CIB) activity in Instagram 
              comment sections so that public narratives remain accountable.
            </p>

            {/* Desktop: pills */}
            <div className="mt-8 hidden flex-wrap gap-2 md:flex">
              {[
                { label: "Research-Based", icon: BookOpen },
                { label: "Information Transparency", icon: Target },
                { label: "For a Healthy Public Space", icon: Users },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <span
                    key={p.label}
                    className="inline-flex items-center gap-2 rounded-xl border bg-white/80 px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm"
                    style={{ borderColor: sandBeige }}
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: terracotta }} />
                    {p.label}
                  </span>
                );
              })}
            </div>
            {/* Mobile: satu paragraf */}
            <p className="mt-4 text-[12px] leading-[1.65] text-center text-neutral-600 md:hidden">
              Research-Based · Information Transparency · For a Healthy Public Space
            </p>
          </div>

          <div className="relative mx-auto flex justify-center lg:mx-0 lg:justify-end">
            <div className="relative h-[220px] w-[220px] sm:h-[260px] sm:w-[260px] md:h-[360px] md:w-[360px]">
              <div className="absolute inset-0 rounded-full opacity-20 blur-2xl"
                style={{ background: `radial-gradient(circle,${terracotta},transparent 70%)` }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute bottom-12 h-20 w-40 rounded-full opacity-40 blur-2xl"
                  style={{ background: "rgba(165,65,65,0.55)" }} />
                <div className="relative flex items-center justify-center"
                  style={{ filter: "drop-shadow(0 20px 45px rgba(165,65,65,0.35))" }}>
                  <Image src="/logo.png" alt="CIB Detector Logo" width={198} height={198} className="object-contain" priority />
                </div>
              </div>
              {dots.map((dot, i) => (
                <div key={i} className="absolute rounded-full" style={{
                  top: dot.top, left: dot.left, right: dot.right, bottom: dot.bottom,
                  width: dot.size, height: dot.size,
                  background: `radial-gradient(circle,rgba(165,65,65,0.9) 0%,rgba(196,135,107,0.7) 60%,transparent 100%)`,
                  opacity: dot.opacity, filter: "blur(0.3px)",
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LATAR BELAKANG MASALAH ── */}
      <section className="border-t py-12 md:py-20" style={{ backgroundColor: pageBg, borderColor: `${sandBeige}88` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-3 flex items-center gap-2.5 md:mb-4 md:gap-3">
            <BookOpen className="h-6 w-6 shrink-0 md:h-9 md:w-9" style={{ color: terracotta }} />
            <h2 className="text-[1.1rem] font-bold text-neutral-900 sm:text-[1.4rem] md:text-3xl">Latar Belakang Masalah</h2>
          </div>
          <p className="mb-8 max-w-3xl text-[13px] leading-[1.7] text-neutral-700 md:mb-12 md:text-base">
            Di era digital, ruang publik media sosial menjadi arena pertarungan narasi.
            Jaringan terorganisir memanipulasi kolom komentar postingan viral untuk membentuk opini sesuai agenda tertentu.
          </p>
          <div ref={problemsRef} className="grid gap-4 md:grid-cols-3 md:gap-6">
            {problems.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className={`rounded-2xl border bg-white/60 p-4 shadow-md backdrop-blur-sm md:p-6 ${problemsInView ? PROBLEM_ANIMS[i] : "opacity-0"}`}
                  style={{
                    borderColor: `${sandBeige}aa`,
                    animationDelay: problemsInView ? `${i * 0.12}s` : "0s",
                  }}
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full md:mb-4 md:h-11 md:w-11"
                    style={{ backgroundColor: "rgba(217,196,157,0.35)" }}>
                    <Icon className="h-4 w-4 md:h-5 md:w-5" style={{ color: terracotta }} strokeWidth={2} />
                  </div>
                  <h3 className="text-[13px] font-bold text-neutral-900 md:text-lg">{p.title}</h3>
                  <p className="mt-1.5 text-[12px] leading-[1.65] text-neutral-600 md:mt-2 md:text-sm">{p.desc}</p>
                  <SeverityRow label={p.severityLabel} filled={p.severityFilled} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SOLUSI KAMI ── */}
      <section className="px-5 py-10 md:px-8 md:py-20" style={{ backgroundColor: sectionAlt }}>
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-5 shadow-md md:p-10"
          style={{
            borderColor: `${warmClay}44`,
            backgroundColor: "rgba(255,255,255,0.5)",
            backgroundImage: `radial-gradient(circle at 100% 40%,rgba(165,65,65,0.06) 0%,transparent 45%)`,
          }}
        >
          <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-sm md:h-14 md:w-14"
              style={{ color: terracotta }}>
              <Lightbulb className="h-5 w-5 md:h-7 md:w-7" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-[1.1rem] font-bold text-neutral-900 md:text-2xl">Solusi Kami</h2>
              <p className="mt-3 max-w-3xl text-[13px] leading-[1.7] text-neutral-800 md:mt-4 md:text-base">
                Sistem ini bukan untuk menghapus konten atau melakukan takedown akun secara paksa,
                melainkan berfungsi sebagai{" "}
                <strong className="font-bold" style={{ color: terracotta }}>alat transparansi informasi</strong>{" "}
                yang memberikan skor dan visualisasi pada pola kolom komentar.
                Dengan data berbasis fakta, kami mendukung mitigasi sosial dan daya pikir kritis masyarakat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── METODOLOGI ── */}
      <section className="border-t py-12 md:py-20" style={{ backgroundColor: pageBg, borderColor: `${sandBeige}88` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-3 flex items-center gap-2.5 md:mb-4 md:gap-3">
            <Shield className="h-6 w-6 shrink-0 md:h-9 md:w-9" style={{ color: terracotta }} />
            <h2 className="text-[1.1rem] font-bold sm:text-[1.4rem] md:text-3xl" style={{ color: terracotta }}>Detection Methodology</h2>
          </div>
          <p className="mb-8 max-w-3xl text-[13px] leading-[1.7] text-neutral-700 md:mb-10 md:text-base">
            The hybrid processing engine combines content analysis (semantic/lexical) 
            and time analysis (temporal) without relying on deep learning models or external databases.
          </p>
          <div ref={methodRef} className="grid gap-4 md:grid-cols-2 md:gap-6">
            {methodology.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className={`rounded-2xl border bg-white/60 p-4 shadow-md md:p-8 ${methodInView ? METHOD_ANIMS[i] : "opacity-0"}`}
                  style={{
                    borderColor: `${sandBeige}aa`,
                    animationDelay: methodInView ? `${i * 0.15}s` : "0s",
                  }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl shadow-sm md:mb-5 md:h-12 md:w-12"
                    style={{ backgroundColor: m.bgIcon }}>
                    <Icon className="h-5 w-5 text-white md:h-6 md:w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-[13px] font-bold text-neutral-900 md:text-xl">{m.title}</h3>
                  <ul className="mt-4 space-y-2.5 md:mt-5 md:space-y-3">
                    {m.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-[12px] text-neutral-700 md:gap-3 md:text-[15px]">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full md:h-5 md:w-5"
                          style={{ backgroundColor: `${m.accent}18`, color: m.accent }}>
                          <Check className="h-2.5 w-2.5 md:h-3 md:w-3" strokeWidth={3} />
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ALUR KERJA ── */}
      <section className="border-t py-12 md:py-20" style={{ backgroundColor: sectionAlt, borderColor: `${sandBeige}88` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="mb-8 text-center text-[1.1rem] font-bold text-neutral-900 sm:text-[1.4rem] md:mb-12 md:text-3xl">
            System Workflow
          </h2>

          {/* Mobile: satu paragraf alur */}
          <div className="mx-auto flex max-w-xs flex-col gap-3 text-center md:hidden">
            {workflow.map((w) => (
              <div
                key={w.step}
                className="rounded-xl border bg-white/60 px-4 py-3 shadow-sm"
                style={{ borderColor: `${sandBeige}88` }}
              >
                <p className="text-[11px] font-bold text-[#A54141]">
                  Step {w.step}
                </p>

                <p className="mt-1 text-[12px] font-medium leading-[1.6] text-neutral-800">
                  {w.title}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: ikon horizontal */}
          <div className="hidden items-start md:flex">
            {workflow.map((w) => {
              const Icon = w.icon;
              return (
                <Fragment key={w.step}>
                  <div className="flex min-w-0 flex-1 flex-col items-center px-1 text-center">
                    <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow"
                      style={{ backgroundColor: terracotta }}>
                      {w.step}
                    </span>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full shadow-md"
                      style={{ background: `linear-gradient(160deg,rgba(217,196,157,0.45),rgba(246,235,221,0.9))`, border: `1px solid ${sandBeige}` }}>
                      <Icon className="h-9 w-9" style={{ color: terracotta }} strokeWidth={1.5} />
                    </div>
                    <p className="mt-4 max-w-[11rem] text-xs font-semibold leading-snug text-neutral-900 md:text-sm">{w.title}</p>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── KONTRIBUSI SOSIAL ── */}
      <section className="border-t py-12 md:py-20" style={{ backgroundColor: pageBg, borderColor: `${sandBeige}88` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-3 flex items-center gap-2.5 md:mb-4 md:gap-3">
            <Target className="h-6 w-6 shrink-0 md:h-9 md:w-9" style={{ color: terracotta }} />
            <h2 className="text-[1.1rem] font-bold sm:text-[1.4rem] md:text-3xl" style={{ color: terracotta }}>Kontribusi Sosial</h2>
          </div>
          <p className="mb-8 max-w-3xl text-[13px] leading-[1.7] text-neutral-700 md:mb-10 md:text-base">
            Komitmen kami terhadap ekosistem digital Indonesia: memperkuat transparansi, literasi, dan partisipasi informasi yang sehat.
          </p>
          <div ref={contribRef} className="grid gap-4 md:grid-cols-3 md:gap-6">
            {contribution.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.n}
                  className={`relative overflow-hidden rounded-2xl border bg-white/60 p-4 shadow-md md:p-6 ${contribInView ? CONTRIB_ANIMS[i] : "opacity-0"}`}
                  style={{
                    borderColor: `${sandBeige}aa`,
                    animationDelay: contribInView ? `${i * 0.12}s` : "0s",
                  }}
                >
                  <span className="mb-3 inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full px-2 text-[11px] font-bold text-white md:mb-4 md:h-9 md:text-sm"
                    style={{ backgroundColor: terracotta }}>
                    {c.n}
                  </span>
                  <h3 className="text-[13px] font-bold text-neutral-900 md:text-lg">{c.title}</h3>
                  <p className="mt-1.5 text-[12px] leading-[1.65] text-neutral-600 md:mt-2 md:text-sm">{c.desc}</p>
                  <div className="mt-4 flex h-16 items-center justify-center rounded-xl border md:mt-6 md:h-24"
                    style={{ borderColor: `${sandBeige}88`, backgroundColor: "rgba(246,235,221,0.6)" }}>
                    <Icon className="h-8 w-8 opacity-80 md:h-12 md:w-12" style={{ color: warmClay }} strokeWidth={1.25} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEKNOLOGI ── */}
      <section className="border-t py-12 md:py-20" style={{ backgroundColor: sectionAlt, borderColor: `${sandBeige}88` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-3 flex items-center gap-2.5 md:mb-4 md:gap-3">
            <Shield className="h-6 w-6 shrink-0 md:h-8 md:w-8" style={{ color: terracotta }} strokeWidth={1.5} />
            <h2 className="text-[1.1rem] font-bold text-neutral-900 sm:text-[1.4rem] md:text-3xl">Technology Used</h2>
          </div>
          <p className="mb-6 max-w-2xl text-[13px] leading-[1.7] text-neutral-600 md:mb-10 md:text-base">
            Stack that is chosen for fast iteration, algorithm transparency, and easy-to-read result visualization.
          </p>
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {techCards.map((card) => (
              <div key={card.title} className="rounded-xl border bg-white/60 p-3 shadow-sm md:rounded-2xl md:p-5"
                style={{ borderColor: `${sandBeige}aa` }}>
                <p className="text-[12px] font-bold text-neutral-900 md:text-sm">{card.title}</p>
                <ul className="mt-2 space-y-2 md:mt-4 md:space-y-3">
                  {card.items.map((it) => {
                    const Ic = it.icon;
                    return (
                      <li key={it.text} className="flex items-start gap-2 text-[11px] text-neutral-700 md:gap-2.5 md:text-sm">
                        <Ic className="mt-0.5 h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" style={{ color: terracotta }} />
                        <span>{it.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 py-10 md:px-8 md:py-20" style={{ backgroundColor: pageBg }}>
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl px-5 py-8 shadow-xl md:rounded-3xl md:px-12 md:py-14"
          style={{ background: `linear-gradient(110deg,${terracotta} 0%,${warmClay} 55%,#c96f5a 100%)` }}
        >
          <div className="relative flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm md:h-20 md:w-20">
                <ShieldCheck className="h-7 w-7 text-white md:h-10 md:w-10" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-[1.1rem] font-bold text-white sm:text-[1.4rem] md:text-3xl">Protect Digital Discourse Together</h2>
                <p className="mt-2 max-w-xl text-[12px] leading-[1.65] text-white/90 md:mt-3 md:text-base">
                  Start analyzing an Instagram post URL and view pattern 
                  summaries that help you assess the credibility of the comment section.
                </p>
              </div>
            </div>
            <Link
              href="/home#analisis"
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-neutral-900 shadow-lg transition hover:brightness-105 sm:w-auto md:px-7 md:py-3.5 md:text-base"
              style={{ backgroundColor: pageBg }}
            >
              Start Analysis Now
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-6 md:py-10" style={{ borderColor: `${warmClay}33`, backgroundColor: sandBeige }}>
        <div className="mx-auto grid max-w-6xl gap-5 px-5 sm:grid-cols-2 md:px-8 lg:grid-cols-4 lg:gap-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full shadow-md md:mb-3 md:h-10 md:w-10"
              style={{ background: `linear-gradient(145deg,${terracotta},${warmClay})` }}>
              <Activity className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={2} />
            </div>
            <p className="text-[11px] leading-[1.6] text-neutral-800 md:text-xs">
              A healthier digital ecosystem through behavioral signal transparency and AI ethics.
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-neutral-900 md:text-xs">Data Transparency</h3>
            <p className="mt-1 text-[11px] leading-[1.55] text-neutral-700 md:text-xs">
              Audit-friendly statistical methodology; ML ethics &amp; result interpretability.
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-neutral-900 md:text-xs">Security &amp; Privacy</h3>
            <p className="mt-1 text-[11px] leading-[1.55] text-neutral-700 md:text-xs">
              Without storing permanent comments; focusing on aggregate patterns, not identities.
            </p>
          </div>
          <div className="rounded-xl border p-3 sm:col-span-2 lg:col-span-1 lg:p-4"
            style={{ borderColor: `${terracotta}33`, backgroundColor: "rgba(246,235,221,0.8)" }}>
            <p className="text-[11px] font-bold md:text-xs" style={{ color: terracotta }}>AI for Good</p>
            <p className="mt-1 text-[10px] leading-[1.5] text-neutral-700 md:text-[11px]">
              Digital Discourse Protection — a constructive public discussion space.
            </p>
          </div>
        </div>
        <p className="mt-5 text-center text-[10px] text-neutral-600 md:mt-8 md:text-xs">
          © 2026 CIB Detector. All rights reserved.
        </p>
      </footer>
    </main>
  );
}