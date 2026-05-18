"use client";

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

const terracotta = "#A54141";
const warmClay = "#C4876B";
const sandBeige = "#D9C49D";
const softIvory = "#E7E4BE";

function SeverityRow({ label, filled }: { label: string; filled: number }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4" style={{ borderColor: `${sandBeige}99` }}>
      <span
        className="text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: terracotta }}
      >
        {label}
      </span>
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: i < filled ? terracotta : `${sandBeige}`,
            }}
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
    { step: 1, title: "Input URL Instagram", icon: ScanSearch },
    { step: 2, title: "Scraping Komentar", icon: MessageCircle },
    { step: 3, title: "Analisis Hibrida (Semantik + Temporal)", icon: Brain },
    { step: 4, title: "Skor CIB & Visualisasi Hasil", icon: Shield },
  ];

  const contribution = [
    {
      n: "01",
      title: "Transparansi Informasi",
      desc: "Data yang dapat diverifikasi secara mandiri oleh masyarakat, jurnalis, dan peneliti sosial.",
      icon: ScanSearch,
    },
    {
      n: "02",
      title: "Literasi Digital",
      desc: "Memberdayakan masyarakat dengan daya pikir kritis agar tidak mudah terpolarisasi oleh narasi buatan.",
      icon: Users,
    },
    {
      n: "03",
      title: "Demokrasi Informasi",
      desc: "Menjaga ruang digital Indonesia tetap sehat dan mendukung lingkungan media sosial yang lebih jujur.",
      icon: Landmark,
    },
  ];

  const techCards = [
    {
      title: "Detection Engine",
      items: [
        { icon: Link2, text: "TF-IDF + K-Means (Clustering)" },
        { icon: Code2, text: "Python (Core Engine)" },
      ],
    },
    {
      title: "Backend Infrastructure",
      items: [
        { icon: Flame, text: "Flask (Backend API)" },
        { icon: FileJson, text: "JSON (Data Format)" },
      ],
    },
    {
      title: "Frontend Intelligence",
      items: [{ icon: Code2, text: "React.js (Frontend Framework)" }],
    },
    {
      title: "Data Visualization",
      items: [{ icon: BarChart3, text: "Recharts (Visualization)" }],
    },
  ];

  return (
    <main
      className="min-h-screen text-neutral-900 antialiased"
      style={{ backgroundColor: softIvory }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 70% 20%, ${warmClay}33, transparent 55%), linear-gradient(180deg, ${softIvory} 0%, rgba(217,196,157,0.25) 100%)`,
          }}
        />
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-[#C4876B]"
          aria-hidden
        >
          <defs>
            <pattern id="tentang-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1.2" fill="currentColor" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tentang-dots)" opacity="0.5" />
          <path
            d="M0,120 Q200,80 400,130 T800,100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.15"
          />
          <path
            d="M0,180 Q320,220 640,160 T960,200"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.12"
          />
        </svg>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-16">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {["Ethical AI", "Social Defense", "Digital Trust"].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 shadow-sm"
                  style={{
                    borderColor: sandBeige,
                    backgroundColor: "rgba(255,255,255,0.7)",
                  }}
                >
                  <Diamond className="h-3 w-3 shrink-0" style={{ color: terracotta }} />
                  {t}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-[2.5rem] lg:leading-[1.12]">
              Membangun Ruang Digital yang{" "}
              <span style={{ color: terracotta }}>Lebih Jujur</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-700 md:text-base">
              CIB Detector adalah platform verifikasi berbasis web untuk membantu
              mendeteksi aktivitas Coordinated Inauthentic Behavior (CIB) pada
              kolom komentar Instagram—agar narasi publik tetap dapat
              dipertanggungjawabkan.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { label: "Berbasis Riset", icon: BookOpen },
                { label: "Transparansi Informasi", icon: Target },
                { label: "Untuk Ruang Publik Sehat", icon: Users },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <span
                    key={p.label}
                    className="inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-xs font-medium text-neutral-800 shadow-sm md:text-sm"
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
            <div
              className="relative flex h-[240px] w-[240px] items-center justify-center rounded-full shadow-xl md:h-[280px] md:w-[280px]"
              style={{
                background: `radial-gradient(circle at 30% 25%, #fff 0%, ${softIvory} 50%, rgba(196,135,107,0.3) 100%)`,
                border: `1px solid rgba(165,65,65,0.1)`,
              }}
            >
              <div
                className="absolute inset-5 rounded-full border border-dashed opacity-35"
                style={{ borderColor: warmClay }}
              />
              <div
                className="relative flex h-32 w-32 items-center justify-center rounded-3xl shadow-lg md:h-36 md:w-36"
                style={{
                  background: `linear-gradient(145deg, ${terracotta}, #8a3535)`,
                }}
              >
                <Shield className="h-14 w-14 text-white md:h-16 md:w-16" strokeWidth={1.2} />
                <Activity
                  className="absolute bottom-7 h-9 w-9 text-white/95 md:bottom-8 md:h-10 md:w-10"
                  strokeWidth={2}
                />
              </div>
              <Users
                className="absolute left-2 top-12 h-8 w-8 opacity-75"
                style={{ color: warmClay }}
              />
              <MessageCircle
                className="absolute bottom-10 right-4 h-7 w-7 opacity-65"
                style={{ color: terracotta }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latar belakang masalah */}
      <section className="border-t py-16 md:py-20" style={{ borderColor: `${sandBeige}aa` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 shrink-0 md:h-9 md:w-9" style={{ color: terracotta }} />
            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">Latar Belakang Masalah</h2>
          </div>
          <p className="mb-12 max-w-3xl text-sm leading-relaxed text-neutral-700 md:text-base">
            Di era digital, ruang publik media sosial menjadi arena pertarungan narasi.
            Jaringan terorganisir memanipulasi kolom komentar postingan viral untuk
            membentuk opini sesuai agenda tertentu.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {problems.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl border bg-white/90 p-6 shadow-md backdrop-blur-sm"
                  style={{ borderColor: `${sandBeige}aa` }}
                >
                  <div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${sandBeige}66` }}
                  >
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

      {/* Solusi kami */}
      <section className="px-5 pb-16 md:px-8 md:pb-20">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-8 shadow-md md:p-10"
          style={{
            borderColor: `${warmClay}44`,
            backgroundColor: `${sandBeige}`,
            backgroundImage: `radial-gradient(circle at 100% 40%, rgba(165,65,65,0.06) 0%, transparent 45%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-8 top-0 h-48 w-48 rounded-full opacity-30"
            style={{
              backgroundImage: `radial-gradient(${warmClay} 1px, transparent 1px)`,
              backgroundSize: "10px 10px",
            }}
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-sm"
              style={{ color: terracotta }}
            >
              <Lightbulb className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 md:text-2xl">Solusi Kami</h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-800 md:text-base">
                Sistem ini bukan untuk menghapus konten atau melakukan takedown akun
                secara paksa, melainkan berfungsi sebagai{" "}
                <strong className="font-bold" style={{ color: terracotta }}>
                  alat transparansi informasi
                </strong>{" "}
                yang memberikan skor dan visualisasi pada pola kolom komentar.
                Dengan data berbasis fakta, kami mendukung mitigasi sosial dan
                daya pikir kritis masyarakat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metodologi */}
      <section
        className="border-t py-16 md:py-20"
        style={{ borderColor: `${sandBeige}aa`, backgroundColor: `${softIvory}ee` }}
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="h-8 w-8 shrink-0 md:h-9 md:w-9" style={{ color: terracotta }} />
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: terracotta }}>
              Metodologi Deteksi
            </h2>
          </div>
          <p className="mb-10 max-w-3xl text-sm text-neutral-700 md:text-base">
            Mesin pemrosesan hibrida menggabungkan analisis isi (semantik/leksikal)
            dan analisis waktu (temporal) tanpa ketergantungan pada model deep
            learning atau basis data eksternal.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {methodology.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="rounded-2xl border bg-white p-6 shadow-md md:p-8"
                  style={{ borderColor: `${sandBeige}aa` }}
                >
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
                    style={{ backgroundColor: m.bgIcon }}
                  >
                    <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 md:text-xl">{m.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {m.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-sm text-neutral-700 md:text-[15px]">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${m.accent}18`, color: m.accent }}
                        >
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

      {/* Alur kerja */}
      <section className="border-t py-16 md:py-20" style={{ borderColor: `${sandBeige}aa` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="mb-12 text-center text-2xl font-bold text-neutral-900 md:text-3xl">
            Alur Kerja Sistem
          </h2>

          <div className="hidden items-start md:flex">
            {workflow.map((w, idx) => {
              const Icon = w.icon;
              return (
                <Fragment key={w.step}>
                  <div className="flex min-w-0 flex-1 flex-col items-center px-1 text-center">
                    <span
                      className="mb-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow"
                      style={{ backgroundColor: terracotta }}
                    >
                      {w.step}
                    </span>
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-full shadow-md"
                      style={{
                        background: `linear-gradient(160deg, ${sandBeige}cc, ${softIvory})`,
                        border: `1px solid ${sandBeige}`,
                      }}
                    >
                      <Icon className="h-9 w-9" style={{ color: terracotta }} strokeWidth={1.5} />
                    </div>
                    <p className="mt-4 max-w-[11rem] text-xs font-semibold leading-snug text-neutral-900 md:text-sm">
                      {w.title}
                    </p>
                  </div>
                  {idx < workflow.length - 1 && (
                    <div
                      className="flex w-6 shrink-0 items-center self-stretch pt-[2.85rem]"
                      aria-hidden
                    >
                      <div
                        className="h-0 w-full border-t-2 border-dashed"
                        style={{ borderColor: `${warmClay}aa` }}
                      />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          <div className="flex flex-col md:hidden">
            {workflow.map((w, idx) => {
              const Icon = w.icon;
              return (
                <div key={w.step} className="flex flex-col items-center text-center">
                  <span
                    className="mb-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow"
                    style={{ backgroundColor: terracotta }}
                  >
                    {w.step}
                  </span>
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full shadow-md"
                    style={{
                      background: `linear-gradient(160deg, ${sandBeige}cc, ${softIvory})`,
                      border: `1px solid ${sandBeige}`,
                    }}
                  >
                    <Icon className="h-9 w-9" style={{ color: terracotta }} strokeWidth={1.5} />
                  </div>
                  <p className="mt-4 max-w-xs text-xs font-semibold leading-snug text-neutral-900">
                    {w.title}
                  </p>
                  {idx < workflow.length - 1 && (
                    <div className="flex justify-center py-3">
                      <ArrowRight className="h-5 w-5 rotate-90" style={{ color: warmClay }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kontribusi sosial */}
      <section
        className="border-t py-16 md:py-20"
        style={{ borderColor: `${sandBeige}aa`, backgroundColor: `${softIvory}dd` }}
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-4 flex items-center gap-3">
            <Target className="h-8 w-8 shrink-0 md:h-9 md:w-9" style={{ color: terracotta }} />
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: terracotta }}>
              Kontribusi Sosial
            </h2>
          </div>
          <p className="mb-10 max-w-3xl text-sm text-neutral-700 md:text-base">
            Komitmen kami terhadap ekosistem digital Indonesia: memperkuat
            transparansi, literasi, dan partisipasi informasi yang sehat.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {contribution.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.n}
                  className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-white to-white/80 p-6 shadow-md"
                  style={{ borderColor: `${sandBeige}aa` }}
                >
                  <span
                    className="mb-4 inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-2 text-sm font-bold text-white"
                    style={{ backgroundColor: terracotta }}
                  >
                    {c.n}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{c.desc}</p>
                  <div
                    className="mt-6 flex h-24 items-center justify-center rounded-xl border"
                    style={{ borderColor: `${sandBeige}88`, backgroundColor: `${softIvory}99` }}
                  >
                    <Icon className="h-12 w-12 opacity-80" style={{ color: warmClay }} strokeWidth={1.25} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teknologi */}
      <section className="border-t py-16 md:py-20" style={{ borderColor: `${sandBeige}aa` }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 shrink-0" style={{ color: terracotta }} strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">Teknologi yang Digunakan</h2>
            </div>
          </div>
          <p className="mb-10 max-w-2xl text-sm text-neutral-600 md:text-base">
            Stack yang dipilih untuk kecepatan iterasi, transparansi algoritma, dan
            visualisasi hasil yang mudah dibaca.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {techCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border bg-white/95 p-5 shadow-sm"
                style={{ borderColor: `${sandBeige}aa` }}
              >
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

      {/* CTA */}
      <section className="px-5 pb-16 md:px-8 md:pb-20">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-12 shadow-xl md:px-12 md:py-14"
          style={{
            background: `linear-gradient(110deg, ${terracotta} 0%, ${warmClay} 55%, #c96f5a 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20"
            style={{
              backgroundImage: `linear-gradient(${softIvory}33 1px, transparent 1px), linear-gradient(90deg, ${softIvory}33 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-5">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm md:h-20 md:w-20"
              >
                <ShieldCheck className="h-9 w-9 text-white md:h-10 md:w-10" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  Lindungi Diskursus Digital Bersama
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                  Mulai analisis pada URL postingan Instagram dan lihat ringkasan
                  pola yang membantu Anda menilai kredibilitas kolom komentar.
                </p>
              </div>
            </div>
            <Link
              href="/beranda#analisis"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-neutral-900 shadow-lg transition hover:brightness-105 md:text-base"
              style={{ backgroundColor: softIvory }}
            >
              Mulai Analisis Sekarang
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-14" style={{ borderColor: `${warmClay}33`, backgroundColor: sandBeige }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:gap-8">
          <div>
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full shadow-md"
              style={{ background: `linear-gradient(145deg, ${terracotta}, ${warmClay})` }}
            >
              <Activity className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <p className="text-sm leading-relaxed text-neutral-800">
              Menciptakan ekosistem digital yang lebih sehat melalui transparansi
              sinyal perilaku dan etika penggunaan AI.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Transparansi Data</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Metodologi berbasis statistik yang dapat diaudit; kami memprioritaskan
              etika machine learning dan interpretabilitas hasil.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Keamanan & Privasi</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Analisis berjalan tanpa menyimpan komentar Anda secara permanen;
              fokus pada pola agregat, bukan identitas individu.
            </p>
          </div>
          <div
            className="rounded-2xl border p-5 shadow-sm"
            style={{
              borderColor: `${terracotta}33`,
              backgroundColor: `${softIvory}cc`,
            }}
          >
            <p className="text-sm font-bold" style={{ color: terracotta }}>
              AI for Good
            </p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-700">
              Digital Discourse Protection — mempertahankan ruang diskusi publik
              yang konstruktif.
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
