"use client";

import Image from "next/image";
import { Fragment } from "react";
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
  Diamond,
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
// All section backgrounds pull from the same warm-cream family as the Beranda hero
const pageBg     = "#F6EBDD"; // base — matches Beranda hero background
const sectionAlt = "#F0E4CF"; // slightly deeper warm cream for alternating sections

function SeverityRow({ label, filled }: { label: string; filled: number }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4" style={{ borderColor: `${sandBeige}99` }}>
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
  const methodology = [
    {
      icon: Brain,
      title: "Analisis Semantik (Leksikal/Semantik)",
      accent: terracotta,
      bgIcon: terracotta,
      points: [
        "Pemrosesan bahasa natural untuk memahami konteks komentar",
        "Memahami nuansa kontekstual, bahasa gaul, dan sarkasme",
        "Mendeteksi kesamaan narasi (skrip) antar komentar",
        "Mengidentifikasi pola copy-paste dengan variasi minor",
      ],
    },
    {
      icon: Clock,
      title: "Analisis Temporal (Pola Waktu)",
      accent: warmClay,
      bgIcon: warmClay,
      points: [
        "Forensik metadata waktu komentar",
        "Deteksi lonjakan aktivitas tidak wajar (burstiness)",
        "Analisis sinkronisasi waktu posting antar akun",
        "Identifikasi pola serangan terkoordinasi",
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
    { step: 1, title: "Input URL Instagram",                    icon: ScanSearch    },
    { step: 2, title: "Scraping Komentar",                      icon: MessageCircle },
    { step: 3, title: "Analisis Hibrida (Semantik + Temporal)", icon: Brain         },
    { step: 4, title: "Skor CIB & Visualisasi Hasil",           icon: Shield        },
  ];

  const contribution = [
    { n: "01", title: "Transparansi Informasi", desc: "Data yang dapat diverifikasi secara mandiri oleh masyarakat, jurnalis, dan peneliti sosial.", icon: ScanSearch },
    { n: "02", title: "Literasi Digital",        desc: "Memberdayakan masyarakat dengan daya pikir kritis agar tidak mudah terpolarisasi oleh narasi buatan.", icon: Users },
    { n: "03", title: "Demokrasi Informasi",     desc: "Menjaga ruang digital Indonesia tetap sehat dan mendukung lingkungan media sosial yang lebih jujur.", icon: Landmark },
  ];

  const techCards = [
    { title: "Detection Engine",       items: [{ icon: Link2,     text: "TF-IDF + K-Means (Clustering)" }, { icon: Code2,    text: "Python (Core Engine)" }] },
    { title: "Backend Infrastructure", items: [{ icon: Flame,     text: "Flask (Backend API)" },           { icon: FileJson, text: "JSON (Data Format)" }] },
    { title: "Frontend Intelligence",  items: [{ icon: Code2,     text: "React.js (Frontend Framework)" }] },
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
        className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24"
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

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-16">
          <div>
            <div
              className="mb-6 inline-flex flex-wrap items-center gap-3 rounded-full border px-5 py-3 shadow-sm"
              style={{
                borderColor: sandBeige,
                backgroundColor: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(8px)",
              }}
            >
              {["ETHICAL AI", "SOCIAL DEFENSE", "DIGITAL TRUST"].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 text-xs font-bold tracking-wide text-neutral-800"
                >
                  <Diamond
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: terracotta }}
                  />
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
              Membangun <br /> Ruang Digital <br /> yang{" "}
              <span style={{ color: terracotta }}>Lebih Jujur</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-700 md:text-base">
              CIB Detector adalah platform verifikasi berbasis web untuk membantu mendeteksi aktivitas
              Coordinated Inauthentic Behavior (CIB) pada kolom komentar Instagram—agar narasi publik
              tetap dapat dipertanggungjawabkan.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { label: "Berbasis Riset",           icon: BookOpen },
                { label: "Transparansi Informasi",   icon: Target   },
                { label: "Untuk Ruang Publik Sehat", icon: Users    },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <span
                    key={p.label}
                    className="inline-flex items-center gap-2 rounded-xl border bg-white/80 px-4 py-2 text-xs font-medium text-neutral-800 shadow-sm md:text-sm"
                    style={{ borderColor: sandBeige }}
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: terracotta }} />
                    {p.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="relative mx-auto flex justify-center lg:mx-0 lg:justify-end">
            <div className="relative h-[300px] w-[300px] md:h-[360px] md:w-[360px]">
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
      <section className="border-t py-16 md:py-20" style={{ backgroundColor: pageBg, borderColor: `${sandBeige}88` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 shrink-0 md:h-9 md:w-9" style={{ color: terracotta }} />
            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">Latar Belakang Masalah</h2>
          </div>
          <p className="mb-12 max-w-3xl text-sm leading-relaxed text-neutral-700 md:text-base">
            Di era digital, ruang publik media sosial menjadi arena pertarungan narasi.
            Jaringan terorganisir memanipulasi kolom komentar postingan viral untuk membentuk opini sesuai agenda tertentu.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {problems.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="rounded-2xl border bg-white/60 p-6 shadow-md backdrop-blur-sm"
                  style={{ borderColor: `${sandBeige}aa` }}>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(217,196,157,0.35)" }}>
                    <Icon className="h-5 w-5" style={{ color: terracotta }} strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 md:text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{p.desc}</p>
                  <SeverityRow label={p.severityLabel} filled={p.severityFilled} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SOLUSI KAMI ── */}
      <section className="px-5 py-16 md:px-8 md:py-20" style={{ backgroundColor: sectionAlt }}>
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-8 shadow-md md:p-10"
          style={{
            borderColor: `${warmClay}44`,
            backgroundColor: "rgba(255,255,255,0.5)",
            backgroundImage: `radial-gradient(circle at 100% 40%,rgba(165,65,65,0.06) 0%,transparent 45%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-8 top-0 h-48 w-48 rounded-full opacity-30"
            style={{ backgroundImage: `radial-gradient(${warmClay} 1px,transparent 1px)`, backgroundSize: "10px 10px" }}
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-sm"
              style={{ color: terracotta }}>
              <Lightbulb className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 md:text-2xl">Solusi Kami</h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-800 md:text-base">
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
      <section className="border-t py-16 md:py-20" style={{ backgroundColor: pageBg, borderColor: `${sandBeige}88` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="h-8 w-8 shrink-0 md:h-9 md:w-9" style={{ color: terracotta }} />
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: terracotta }}>Metodologi Deteksi</h2>
          </div>
          <p className="mb-10 max-w-3xl text-sm text-neutral-700 md:text-base">
            Mesin pemrosesan hibrida menggabungkan analisis isi (semantik/leksikal) dan analisis waktu (temporal)
            tanpa ketergantungan pada model deep learning atau basis data eksternal.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {methodology.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="rounded-2xl border bg-white/60 p-6 shadow-md md:p-8"
                  style={{ borderColor: `${sandBeige}aa` }}>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
                    style={{ backgroundColor: m.bgIcon }}>
                    <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 md:text-xl">{m.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {m.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-sm text-neutral-700 md:text-[15px]">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${m.accent}18`, color: m.accent }}>
                          <Check className="h-3 w-3" strokeWidth={3} />
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
      <section className="border-t py-16 md:py-20" style={{ backgroundColor: sectionAlt, borderColor: `${sandBeige}88` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="mb-12 text-center text-2xl font-bold text-neutral-900 md:text-3xl">Alur Kerja Sistem</h2>

          {/* Desktop */}
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

          {/* Mobile */}
          <div className="flex flex-col md:hidden">
            {workflow.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.step} className="flex flex-col items-center text-center">
                  <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow"
                    style={{ backgroundColor: terracotta }}>
                    {w.step}
                  </span>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full shadow-md"
                    style={{ background: `linear-gradient(160deg,rgba(217,196,157,0.45),rgba(246,235,221,0.9))`, border: `1px solid ${sandBeige}` }}>
                    <Icon className="h-9 w-9" style={{ color: terracotta }} strokeWidth={1.5} />
                  </div>
                  <p className="mt-4 max-w-xs text-xs font-semibold leading-snug text-neutral-900">{w.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── KONTRIBUSI SOSIAL ── */}
      <section className="border-t py-16 md:py-20" style={{ backgroundColor: pageBg, borderColor: `${sandBeige}88` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-4 flex items-center gap-3">
            <Target className="h-8 w-8 shrink-0 md:h-9 md:w-9" style={{ color: terracotta }} />
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: terracotta }}>Kontribusi Sosial</h2>
          </div>
          <p className="mb-10 max-w-3xl text-sm text-neutral-700 md:text-base">
            Komitmen kami terhadap ekosistem digital Indonesia: memperkuat transparansi, literasi, dan partisipasi informasi yang sehat.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {contribution.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.n} className="relative overflow-hidden rounded-2xl border bg-white/60 p-6 shadow-md"
                  style={{ borderColor: `${sandBeige}aa` }}>
                  <span className="mb-4 inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-2 text-sm font-bold text-white"
                    style={{ backgroundColor: terracotta }}>
                    {c.n}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{c.desc}</p>
                  <div className="mt-6 flex h-24 items-center justify-center rounded-xl border"
                    style={{ borderColor: `${sandBeige}88`, backgroundColor: "rgba(246,235,221,0.6)" }}>
                    <Icon className="h-12 w-12 opacity-80" style={{ color: warmClay }} strokeWidth={1.25} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEKNOLOGI ── */}
      <section className="border-t py-16 md:py-20" style={{ backgroundColor: sectionAlt, borderColor: `${sandBeige}88` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="h-8 w-8 shrink-0" style={{ color: terracotta }} strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">Teknologi yang Digunakan</h2>
          </div>
          <p className="mb-10 max-w-2xl text-sm text-neutral-600 md:text-base">
            Stack yang dipilih untuk kecepatan iterasi, transparansi algoritma, dan visualisasi hasil yang mudah dibaca.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {techCards.map((card) => (
              <div key={card.title} className="rounded-2xl border bg-white/60 p-5 shadow-sm"
                style={{ borderColor: `${sandBeige}aa` }}>
                <p className="text-sm font-bold text-neutral-900">{card.title}</p>
                <ul className="mt-4 space-y-3">
                  {card.items.map((it) => {
                    const Ic = it.icon;
                    return (
                      <li key={it.text} className="flex items-start gap-2.5 text-sm text-neutral-700">
                        <Ic className="mt-0.5 h-4 w-4 shrink-0" style={{ color: terracotta }} />
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
      <section className="px-5 py-16 md:px-8 md:py-20" style={{ backgroundColor: pageBg }}>
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-12 shadow-xl md:px-12 md:py-14"
          style={{ background: `linear-gradient(110deg,${terracotta} 0%,${warmClay} 55%,#c96f5a 100%)` }}
        >
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(246,235,221,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(246,235,221,0.3) 1px,transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm md:h-20 md:w-20">
                <ShieldCheck className="h-9 w-9 text-white md:h-10 md:w-10" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white md:text-3xl">Lindungi Diskursus Digital Bersama</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                  Mulai analisis pada URL postingan Instagram dan lihat ringkasan pola
                  yang membantu Anda menilai kredibilitas kolom komentar.
                </p>
              </div>
            </div>
            <Link
              href="/beranda#analisis"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-neutral-900 shadow-lg transition hover:brightness-105 md:text-base"
              style={{ backgroundColor: pageBg }}
            >
              Mulai Analisis Sekarang
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER (intentionally different — sandBeige) ── */}
      <footer className="border-t py-14" style={{ borderColor: `${warmClay}33`, backgroundColor: sandBeige }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:gap-8">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full shadow-md"
              style={{ background: `linear-gradient(145deg,${terracotta},${warmClay})` }}>
              <Activity className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <p className="text-sm leading-relaxed text-neutral-800">
              Menciptakan ekosistem digital yang lebih sehat melalui transparansi sinyal perilaku dan etika penggunaan AI.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Transparansi Data</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Metodologi berbasis statistik yang dapat diaudit; kami memprioritaskan etika machine learning dan interpretabilitas hasil.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Keamanan & Privasi</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Analisis berjalan tanpa menyimpan komentar Anda secara permanen; fokus pada pola agregat, bukan identitas individu.
            </p>
          </div>
          <div className="rounded-2xl border p-5 shadow-sm"
            style={{ borderColor: `${terracotta}33`, backgroundColor: "rgba(246,235,221,0.8)" }}>
            <p className="text-sm font-bold" style={{ color: terracotta }}>AI for Good</p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-700">
              Digital Discourse Protection — mempertahankan ruang diskusi publik yang konstruktif.
            </p>
          </div>
        </div>
        <p className="mt-12 text-center text-xs text-neutral-600 md:text-sm">
          © 2026 CIB Detector. All rights reserved.
        </p>
      </footer>
    </main>
  );
}