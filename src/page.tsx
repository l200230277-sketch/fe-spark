"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Users, Zap, Loader2 } from "lucide-react";
import { APIService } from "./services/api";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const router = useRouter();

  const handleAnalysis = async () => {
    if (!url.trim()) {
      setError("Masukkan URL Instagram terlebih dahulu");
      return;
    }

    if (!url.includes("instagram.com")) {
      setError(
        "URL harus berupa link Instagram yang valid (harus dari instagram.com)",
      );
      return;
    }

    setLoading(true);
    setError("");
    setProgress("🔄 Memulai scraping komentar Instagram...");

    try {
      const data = await APIService.analyzeInstagramPost(url.trim());

      // Simpan hasil untuk dashboard
      localStorage.setItem("latest_analysis", JSON.stringify(data));

      setProgress("✅ Analisis selesai! Mengalihkan ke dashboard...");

      // Tunggu sebentar lalu redirect ke dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat analisis");
      setLoading(false);
      setProgress("");
    }
  };

  const stats = [
    {
      number: "1.2M+",
      label: "Komentar Dianalisis",
      icon: Eye,
    },
    {
      number: "50K+",
      label: "Akun Terdeteksi",
      icon: Users,
    },
    {
      number: "89%",
      label: "Akurasi Model",
      icon: Zap,
    },
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-gray-900">
            Lindungi Ruang Digital
            <br />
            dari{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Manipulasi Opini
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
            Deteksi aktivitas Coordinated Inauthentic Behavior (CIB) pada kolom
            komentar Instagram menggunakan AI canggih.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  🔍
                </span>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !loading && handleAnalysis()
                  }
                  placeholder="Masukkan URL postingan Instagram..."
                  className="w-full pl-12 pr-6 py-3.5 rounded-lg border-2 border-gray-200 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-0 transition-colors disabled:bg-gray-100"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleAnalysis}
                disabled={loading}
                className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors whitespace-nowrap shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  "Analisis Sekarang"
                )}
              </button>
            </div>
          </div>

          {/* Loading Progress */}
          {loading && progress && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm font-medium">{progress}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm whitespace-pre-line">
                ❌ {error}
              </p>
            </div>
          )}

          {/* Example URL */}
          <p className="text-gray-600 text-sm">
            <span className="text-green-600 font-semibold">✓</span> Contoh:
            https://www.instagram.com/p/ABC123xyz/
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full">
                      <Icon className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {stat.number}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
