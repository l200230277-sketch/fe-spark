"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MessageCircle,
  AlertTriangle,
  Clock,
  Download,
  Link as LinkIcon,
  BarChart3,
  Network,
  Search,
  Loader2,
  Users,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Activity,
  Lightbulb,
} from "lucide-react";

interface AnalysisResult {
  post_id?: string;
  url?: string;
  cib_score: number;
  semantic_similarity: number;
  temporal_anomaly: number;
  comments_count: number;
  comments_cleaned_count: number;
  temporal_insight?: { message: string };
  temporal_analysis: Array<{ tanggal: string; jumlah_komentar: number }>;
  suspicious_accounts: Array<{
    username: string;
    risk_score: "Tinggi" | "Sedang" | "Rendah";
    cluster_behavior: string;
    comment_count: number;
    pattern: string;
  }>;
  cluster_summaries: Array<{
    cluster_id: number;
    spam_label: string;
    summary: string;
    stats: {
      jumlah_data: number;
      spam_score: number;
      unique_ratio: number;
      repetition_score: number;
      avg_comment_length: number;
    };
    comments: Array<{ username: string; tanggal: string; komentar: string }>;
  }>;
}

const NetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 0;
      canvas.height = canvas.parentElement?.offsetHeight || 0;
      drawNetwork();
    };

    const drawNetwork = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const numPoints = 28; 
      const points: Array<{ x: number; y: number; radius: number }> = [];
      
      let seed = 88;
      const random = () => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };

      for (let i = 0; i < numPoints; i++) {
        const x = canvas.width * 0.55 + random() * (canvas.width * 0.45);
        const progressX = (x - canvas.width * 0.55) / (canvas.width * 0.45);
        const minY = canvas.height * (1 - progressX) * 0.55;
        const y = minY + random() * (canvas.height - minY);

        points.push({
          x,
          y,
          radius: random() * 2 + 1.5,
        });
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);

          if (dist < canvas.width * 0.18) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.18 - dist / (canvas.width * 0.18) * 0.18})`;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
      });
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

const GaugeChart = ({ value, label }: { value: number; label: string }) => {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#D9C49D"
            strokeWidth="14"
            fill="transparent"
            className="opacity-40"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#A54141"
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-3xl font-extrabold text-stone-800">{value}%</span>
        </div>
      </div>
      <div className="mt-5 text-center">
        <span className="text-base px-4 py-1.5 bg-[#A54141]/10 text-[#A54141] rounded-full font-bold">
          Risiko Sedang
        </span>
        <p className="text-base text-stone-500 mt-4 max-w-[220px] leading-relaxed">{label}</p>
      </div>
    </div>
  );
};

  const NetworkGraph = ({
  clusters,
  showAllClusters,
  setShowAllClusters,
  onSelectCluster,
}: {
  clusters: any[];
  showAllClusters: boolean;
  setShowAllClusters: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectCluster: (id: number) => void;
}) => {
  const clusterConfigs = [
  {
    label: "Kluster A",
    color: "#A9471F",
    count: 29,
    center: { x: 130, y: 110 },
  },
  {
    label: "Kluster  B",
    color: "#FF6B81",
    count: 28,
    center: { x: 375, y: 90 },
  },
  {
    label: "Kluster C",
    color: "#E39B11",
    count: 27,
    center: { x: 70, y: 285 },
  },
  {
    label: "Kluster D",
    color: "#FFAE1A",
    count: 23,
    center: { x: 235, y: 320 },
  },
  {
    label: "Kluster E",
    color: "#DCC29E",
    count: 17,
    center: { x: 385, y: 270 },
  },
];

  const generateNodes = (
    centerX: number,
    centerY: number,
    total: number
  ) => {
    return Array.from({ length: total }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / total;

      const radius = 38 + Math.random() * 58;

      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });
  };

  return (
    <div className="rounded-2xl border border-[#E7D7C9] bg-gradient-to-b from-white to-[#FFF8F4] p-6 shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 items-center">

        <div className="flex-1 w-full">
          <svg
            viewBox="0 0 470 370"
            className="w-full h-[390px]"
          >
            {clusterConfigs.map((cluster, idx) =>
              clusterConfigs.slice(idx + 1).map((other, j) => (
                <line
                  key={`${idx}-${j}`}
                  x1={cluster.center.x}
                  y1={cluster.center.y}
                  x2={other.center.x}
                  y2={other.center.y}
                  stroke="#EAD8CC"
                  strokeWidth="1"
                  opacity="0.4"
                />
              ))
            )}
            {clusterConfigs.map((cluster, idx) => {
              const nodes = generateNodes(
                cluster.center.x,
                cluster.center.y,
                cluster.count
              );

              return (
                <g key={idx}>
                  <circle
                    cx={cluster.center.x}
                    cy={cluster.center.y}
                    r="20"
                    fill={cluster.color}
                    opacity="0.18"
                  />
                  {nodes.map((node, i) => (
                    <line
                      key={i}
                      x1={cluster.center.x}
                      y1={cluster.center.y}
                      x2={node.x}
                      y2={node.y}
                      stroke={cluster.color}
                      strokeOpacity="0.22"
                      strokeWidth="1.4"
                    />
                  ))}

                  {nodes.map((a, i) =>
                    nodes.slice(i + 1, i + 5).map((b, j) => (
                      <line
                        key={`${i}-${j}`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={cluster.color}
                        strokeOpacity="0.12"
                        strokeWidth="1"
                      />
                    ))
                  )}

                  <circle
                    cx={cluster.center.x}
                    cy={cluster.center.y}
                    r="13"
                    fill={cluster.color}
                    className="drop-shadow-lg"
                  />

                  {nodes.map((node, i) => (
                    <circle
                      key={i}
                      cx={node.x}
                      cy={node.y}
                      r={Math.random() > 0.7 ? 6.5 : 5}
                      fill={cluster.color}
                      opacity="0.95"
                    />
                  ))}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="w-full lg:w-[210px] space-y-5">
          {clusterConfigs.map((cluster, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: cluster.color,
                  }}
                />

                <span className="font-semibold text-stone-700">
                  {cluster.label}
                </span>
              </div>

              <span className="text-sm text-stone-400 font-medium">
                {cluster.count} akun
              </span>
            </div>
          ))}

          <button
            onClick={() => {
              onSelectCluster(1);

              document
                .getElementById("cluster-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
            className="w-full mt-6 border border-[#D7A98C] text-[#9A4B3B] font-semibold rounded-xl py-3 hover:bg-[#FFF4EC] transition-all duration-300"
          >
            Lihat Detail Kluster →
          </button>
        </div>
      </div>
    </div>
  );
};

const normalizeSpamLabel = (label?: string): "spam" | "suspicious" | "normal" => {
  const v = String(label || "").trim().toLowerCase();
  if (v.includes("spam")) return "spam";
  if (v.includes("suspicious") || v.includes("mencurigakan")) return "suspicious";
  return "normal";
};

const spamLabelDisplay = (label?: string): string => {
  const normalized = normalizeSpamLabel(label);
  if (normalized === "spam") return "SPAM";
  if (normalized === "suspicious") return "SUSPICIOUS";
  return "NORMAL";
};

const MOCK_DATA: AnalysisResult = {
  post_id: "12345",
  url: "https://instagram.com/p/DX1ZPxVkxZh/",
  cib_score: 46,
  semantic_similarity: 0.82,
  temporal_anomaly: 0.65,
  comments_count: 556,
  comments_cleaned_count: 525,
  temporal_insight: {
    message: "Terdeteksi lonjakan aktivitas komentar yang tidak biasa selama periode analisis. Pola ini mengindikasikan adanya gerakan terkoordinasi.",
  },
  temporal_analysis: [
    { tanggal: "3 Mei", jumlah_komentar: 0 },
    { tanggal: "5 Mei", jumlah_komentar: 1.0 },
    { tanggal: "8 Mei", jumlah_komentar: 0 },
    { tanggal: "12 Mei", jumlah_komentar: 2.0 },
  ],
  suspicious_accounts: [
    {
      username: "yafiimuhhammad",
      risk_score: "Tinggi",
      cluster_behavior: "Perilaku Tidak Otentik yang Terkoordinasi",
      comment_count: 1,
      pattern: "Frekuensi komentar yang diulang",
    },
    {
      username: "veinsby_bosshub",
      risk_score: "Rendah",
      cluster_behavior: "Perilaku Normal",
      comment_count: 2,
      pattern: "Pola komentar yang mencurigakan",
    },
    {
      username: "fynol_a",
      risk_score: "Rendah",
      cluster_behavior: "Perilaku Normal",
      comment_count: 2,
      pattern: "Pola komentar yang mencurigakan",
    },
  ],
cluster_summaries: [
  {
    cluster_id: 1,
    spam_label: "spam",
    summary:
      "Komentar didominasi pola promosi berulang dengan kata: gratis, cuan, saldo, link bio",
    stats: {
      jumlah_data: 42,
      spam_score: 0.91,
      unique_ratio: 0.32,
      repetition_score: 0.88,
      avg_comment_length: 18,
    },
    comments: [
      {
        username: "promo_cepat",
        tanggal: "08:12",
        komentar: "gratis saldo sekarang cek link bio",
      },
      {
        username: "cuaninstan",
        tanggal: "08:13",
        komentar: "link bio buat dapet saldo gratis",
      },
      {
        username: "viral.money",
        tanggal: "08:14",
        komentar: "ayo cuan cepat sebelum ditutup",
      },
    ],
  },

  {
    cluster_id: 2,
    spam_label: "normal",
    summary:
      "Pola komentar natural dengan kata dominan: wajiibbb, bener, poko, nih, aja",
    stats: {
      jumlah_data: 25,
      spam_score: 0.114,
      unique_ratio: 1.0,
      repetition_score: 0.0,
      avg_comment_length: 34,
    },
    comments: [
      {
        username: "user_1",
        tanggal: "14:02",
        komentar: "wajiibbb dicoba ini mah beneran bagus",
      },
      {
        username: "user_2",
        tanggal: "14:04",
        komentar: "poko wajib sih ini",
      },
      {
        username: "user_3",
        tanggal: "14:08",
        komentar: "bener banget setuju",
      },
    ],
  },

  {
    cluster_id: 3,
    spam_label: "suspicious",
    summary:
      "Ditemukan kemiripan struktur komentar dengan pola engagement boosting.",
    stats: {
      jumlah_data: 31,
      spam_score: 0.58,
      unique_ratio: 0.61,
      repetition_score: 0.47,
      avg_comment_length: 21,
    },
    comments: [
      {
        username: "boost.id",
        tanggal: "10:11",
        komentar: "mantap banget support terus",
      },
      {
        username: "akunaktif",
        tanggal: "10:12",
        komentar: "keren banget support selalu",
      },
      {
        username: "real.user",
        tanggal: "10:13",
        komentar: "bagus banget lanjut terus",
      },
    ],
  },

  {
    cluster_id: 4,
    spam_label: "normal",
    summary:
      "Cluster berisi diskusi normal dengan variasi komentar tinggi.",
    stats: {
      jumlah_data: 18,
      spam_score: 0.09,
      unique_ratio: 0.92,
      repetition_score: 0.1,
      avg_comment_length: 22,
    },
    comments: [
      {
        username: "andika",
        tanggal: "15:20",
        komentar: "mantap banget ini serius",
      },
      {
        username: "rian",
        tanggal: "15:24",
        komentar: "suka konsep kontennya",
      },
      {
        username: "fahmi",
        tanggal: "15:30",
        komentar: "editingnya clean banget",
      },
    ],
  },

  {
    cluster_id: 5,
    spam_label: "spam",
    summary:
      "Aktivitas komentar massal terdeteksi dalam interval waktu sangat singkat.",
    stats: {
      jumlah_data: 53,
      spam_score: 0.97,
      unique_ratio: 0.21,
      repetition_score: 0.93,
      avg_comment_length: 14,
    },
    comments: [
      {
        username: "moneydrop",
        tanggal: "09:01",
        komentar: "cek bio sekarang juga",
      },
      {
        username: "moneydrop2",
        tanggal: "09:01",
        komentar: "cek bio sekarang juga",
      },
      {
        username: "moneydrop3",
        tanggal: "09:02",
        komentar: "cek bio sekarang juga",
      },
    ],
  },

  {
    cluster_id: 6,
    spam_label: "suspicious",
    summary:
      "Komentar terlihat dibuat untuk meningkatkan persepsi engagement secara artifisial.",
    stats: {
      jumlah_data: 27,
      spam_score: 0.66,
      unique_ratio: 0.54,
      repetition_score: 0.51,
      avg_comment_length: 19,
    },
    comments: [
      {
        username: "viewer_real",
        tanggal: "18:02",
        komentar: "keren parah sih",
      },
      {
        username: "supporting.id",
        tanggal: "18:03",
        komentar: "keren banget support",
      },
      {
        username: "dailyboost",
        tanggal: "18:03",
        komentar: "support terus kontennya",
      },
    ],
  },

  {
    cluster_id: 7,
    spam_label: "normal",
    summary:
      "Komentar organik dengan variasi topik dan gaya bahasa berbeda.",
    stats: {
      jumlah_data: 15,
      spam_score: 0.05,
      unique_ratio: 0.96,
      repetition_score: 0.03,
      avg_comment_length: 29,
    },
    comments: [
      {
        username: "lina",
        tanggal: "20:11",
        komentar: "aku baru tau ternyata bisa kayak gini",
      },
      {
        username: "siska",
        tanggal: "20:15",
        komentar: "penasaran pengen coba juga",
      },
      {
        username: "bayu",
        tanggal: "20:19",
        komentar: "informasinya membantu banget",
      },
    ],
  },
],};


export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [accountSearch, setAccountSearch] = useState("");
  const [clusterSearch, setClusterSearch] = useState("");
  const [filterLabel, setFilterLabel] = useState<string>("all");
  const [accountFilter, setAccountFilter] = useState<string>("all");
  const [showAllClusters, setShowAllClusters] = useState(false);

  useEffect(() => {
    loadAnalysisResult();
  }, []);

  const loadAnalysisResult = () => {
    try {
      const cached = localStorage.getItem("latest_analysis");
      if (cached) {
        setResult(JSON.parse(cached));
      } else {
        setResult(MOCK_DATA);
      }
    } catch (error) {
      setResult(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };

  const filteredClusters =
    result?.cluster_summaries?.filter((cluster) => {
      const matchesSearch =
        cluster.summary.toLowerCase().includes(clusterSearch.toLowerCase()) ||
        cluster.cluster_id.toString().includes(clusterSearch);
      const matchesFilter =
        filterLabel === "all" || normalizeSpamLabel(cluster.spam_label) === filterLabel;
      return matchesSearch && matchesFilter;
    }) || [];

  const filteredAccounts =
    result?.suspicious_accounts?.filter((account) => {
      const keyword = accountSearch.toLowerCase();

      const matchesSearch =
        account.username.toLowerCase().includes(keyword) ||
        account.risk_score.toLowerCase().includes(keyword) ||
        account.cluster_behavior.toLowerCase().includes(keyword) ||
        account.pattern.toLowerCase().includes(keyword) ||
        account.comment_count.toString().includes(keyword);

      const matchesFilter =
        accountFilter === "all" ||
        account.risk_score.toLowerCase() === accountFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-14 h-14 animate-spin text-[#A54141] mx-auto mb-4" />
          <p className="text-stone-600 font-bold text-lg">Loading analysis results..</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const cibScore = result?.cib_score ?? 0;
  const semanticSimilarity = (result?.semantic_similarity ?? 0) * 100;
  const temporalAnomaly = (result?.temporal_anomaly ?? 0) * 100;
  const behavioralCoordination = result?.cib_score ?? 0;
  const spamClusters = result?.cluster_summaries?.filter((c) => normalizeSpamLabel(c.spam_label) === "spam").length || 0;
  const allClusterData =
    result?.cluster_summaries?.map((cluster, index) => ({
      cluster_id: cluster.cluster_id,
      label: `Cluster ${String.fromCharCode(65 + index)}`,
      count: cluster.stats.jumlah_data,
    })) || [];

  const clusterData = showAllClusters
    ? allClusterData
    : allClusterData.slice(0, 5);

  const handleDownloadCSV = () => {
    console.log("Downloading CSV file...");
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-stone-800 px-6 pt-32 pb-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex justify-end mb-1">
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2.5 bg-[#A54141] hover:bg-[#8B3535] text-white px-6 py-3 rounded-lg text-base font-bold transition-colors shadow-sm"
          >
            <Download className="w-5 h-5" />
            Download CSV
          </button>
        </div>

        <div 
          className="rounded-xl p-7 text-white shadow-md relative overflow-hidden"
          style={{
            background: "linear-gradient(101deg, #741D16 0%, #A54141 55%, #C4876B 100%)"
          }}
        >
          <NetworkBackground />

          <div className="relative z-10 flex items-center gap-3 sm:gap-5 -ml-4 sm:ml-0">
 
            <div className=" flex-shrink-0 shadow-inner">
              <img 
                src="/logo-cib.png" 
                alt="Logo" 
                className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-35 lg:h-35 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `<svg class="w-8 h-8 text-[#E7E4BE]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.886H3.878l4.954 3.598L6.92 18.37 12 14.772l5.08 3.598-1.912-5.886 4.954-3.598h-6.21L12 3z"/></svg>`;
                  }
                }}
              />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">Hasil Analisis CIB</h1>
              <div className="flex items-center gap-2 text-[#E7E4BE] bg-black/15 w-fit max-w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/10 overflow-hidden">
                <LinkIcon className="w-5 h-5" />
                <a
                  href={result?.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1 text-[11px] sm:text-sm md:text-base font-mono font-medium truncate"
                >
                  {result?.url || "No URL"}
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              <div className="text-sm bg-white/20 w-fit px-4 py-1.5 rounded font-bold tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Analisis Terverifikasi AI
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#D9C49D]/60 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 mb-4">
              <h2 className="text-lg font-bold text-stone-900">Skor CIB</h2>
              <span className="text-sm text-stone-400 hover:text-stone-600 cursor-help transition-colors font-medium" title="Coordinated Inauthentic Behavior Score">
                ⓘ
              </span>
            </div>
            <GaugeChart value={cibScore} label="Pola manipulasi yang signifikan telah terdeteksi." />
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-[#D9C49D]/60 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-[#A54141]" />
                Pola Komentar Temporal
              </h2>
              <span className="text-sm px-3 py-1 bg-[#E7E4BE]/40 text-[#A54141] rounded-full border border-[#D9C49D] font-bold">
                Terdeteksi 5 lonjakan
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={result?.temporal_analysis || []}>
                <defs>
                  <linearGradient id="colorWarmClay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A54141" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#A54141" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="tanggal" stroke="#78716C" fontSize={13} />
                <YAxis stroke="#78716C" fontSize={13} />
                <Tooltip />
                <Area type="monotone" dataKey="jumlah_komentar" stroke="#A54141" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWarmClay)" />
              </AreaChart>
            </ResponsiveContainer>

            {result.temporal_insight && (
              <div className="mt-6 bg-[#E7E4BE]/20 border border-[#D9C49D]/60 rounded-lg p-5 flex gap-3.5">
                <Lightbulb className="w-6 h-6 text-[#A54141] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-base font-bold text-[#A54141] mb-1">Insight Eksekutif:</p>
                  <p className="text-base text-stone-700 leading-relaxed font-medium">{result.temporal_insight.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#D9C49D]/60 p-6 space-y-6">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-[#A54141]" />
              Rincian Indikator
            </h2>

    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-base font-semibold text-stone-600">
              Kesamaan Semantik
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                semanticSimilarity >= 75
                  ? "text-[#C63B32] bg-[#C63B32]/10"
                  : semanticSimilarity >= 50
                  ? "text-[#D76B4F] bg-[#D76B4F]/10"
                  : "text-[#E08A3A] bg-[#E08A3A]/10"
              }`}
            >
              {semanticSimilarity >= 75
                ? "Tinggi"
                : semanticSimilarity >= 50
                ? "Sedang"
                : "Rendah"}
            </span>
            <span className="text-base font-extrabold text-stone-900">
              {Math.round(semanticSimilarity)}%
            </span>
          </div>

          <div className="h-3 bg-[#EEE8E3] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${semanticSimilarity}%`,
                background:
                  semanticSimilarity >= 75
                    ? "linear-gradient(90deg, #D9382C 0%, #C63B32 100%)"
                    : semanticSimilarity >= 50
                    ? "linear-gradient(90deg, #D76B4F 0%, #C85E46 100%)"
                    : "linear-gradient(90deg, #E08A3A 0%, #D97706 100%)",
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-base font-semibold text-stone-600">
              Anomali Waktu
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                temporalAnomaly >= 75
                  ? "text-[#C63B32] bg-[#C63B32]/10"
                  : temporalAnomaly >= 50
                  ? "text-[#D76B4F] bg-[#D76B4F]/10"
                  : "text-[#E08A3A] bg-[#E08A3A]/10"
              }`}
            >
              {temporalAnomaly >= 75
                ? "Tinggi"
                : temporalAnomaly >= 50
                ? "Sedang"
                : "Rendah"}
            </span>
            <span className="text-base font-extrabold text-stone-900">
              {Math.round(temporalAnomaly)}%
            </span>
          </div>

          <div className="h-3 bg-[#EEE8E3] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${temporalAnomaly}%`,
                background:
                  temporalAnomaly >= 75
                    ? "linear-gradient(90deg, #D9382C 0%, #C63B32 100%)"
                    : temporalAnomaly >= 50
                    ? "linear-gradient(90deg, #D76B4F 0%, #C85E46 100%)"
                    : "linear-gradient(90deg, #E08A3A 0%, #D97706 100%)",
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-base font-semibold text-stone-600">
              Koordinasi Perilaku
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                behavioralCoordination >= 75
                  ? "text-[#C63B32] bg-[#C63B32]/10"
                  : behavioralCoordination >= 50
                  ? "text-[#D76B4F] bg-[#D76B4F]/10"
                  : "text-[#E08A3A] bg-[#E08A3A]/10"
              }`}
            >
              {behavioralCoordination >= 75
                ? "Tinggi"
                : behavioralCoordination >= 50
                ? "Sedang"
                : "Rendah"}
            </span>
            <span className="text-base font-extrabold text-stone-900">
              {Math.round(behavioralCoordination)}%
            </span>
          </div>

          <div className="h-3 bg-[#EEE8E3] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${behavioralCoordination}%`,
                background:
                  behavioralCoordination >= 75
                    ? "linear-gradient(90deg, #D9382C 0%, #C63B32 100%)"
                    : behavioralCoordination >= 50
                    ? "linear-gradient(90deg, #D76B4F 0%, #C85E46 100%)"
                    : "linear-gradient(90deg, #E08A3A 0%, #D97706 100%)",
              }}
            />
          </div>
        </div>
      </div>
      </div>
      </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#D9C49D]/60 p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2.5">
              <Network className="w-5 h-5 text-[#A54141]" />
              Kelompok Terkoordinasi
            </h2>

            <NetworkGraph
              clusters={clusterData}
              showAllClusters={showAllClusters}
              setShowAllClusters={setShowAllClusters}
              onSelectCluster={(id) => setSelectedCluster(id)}
            />
          </div>
          </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard icon={<MessageCircle className="w-6 h-6 text-[#A54141]" />} label="Total Komentar" value={(result?.comments_count || 0).toString()} />
          <StatsCard icon={<Clock className="w-6 h-6 text-[#A54141]" />} label="Komentar yang Dibersihkan" value={(result?.comments_cleaned_count || 0).toString()} />
          <StatsCard icon={<Network className="w-6 h-6 text-[#A54141]" />} label="Jumlah Kelompok" value={(result?.cluster_summaries?.length || 0).toString()} />
          <StatsCard icon={<AlertTriangle className="w-6 h-6 text-[#A54141]" />} label="Spam Terdeteksi" value={spamClusters.toString()} />
        </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#D9C49D]/60 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2.5">
                 Daftar Akun Mencurigakan
                  <span className="text-sm px-3 py-1 bg-[#A54141]/10 text-[#A54141] rounded-full font-bold">
                    {result.suspicious_accounts.length} akun
                  </span>
                </h2>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Cari nama pengguna..."
                    value={accountSearch}
                    onChange={(e) => setAccountSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg text-base bg-stone-50 focus:outline-none focus:ring-1 focus:ring-[#A54141]"
                  />
                </div>
                <select
                  value={accountFilter}
                  onChange={(e) => setAccountFilter(e.target.value)}
                  className="px-4 py-2.5 border border-stone-200 rounded-lg text-base bg-stone-50 focus:outline-none text-stone-600 focus:ring-1 focus:ring-[#A54141] font-medium"
                >
                  <option value="all">Semua Tingkat</option>
                  <option value="Tinggi">Tinggi</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Rendah">Rendah</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-stone-100">
              <table className="w-full text-left text-base border-collapse">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-sm">
                  <tr>
                    <th className="py-5 px-4">Pengguna</th>
                    <th className="py-5 px-4">Skor Risk</th>
                    <th className="py-5 px-4">Perilaku Cluster</th>
                    <th className="py-5 px-4 text-center">Komentar</th>
                    <th className="py-5 px-4">Pattern Terdeteksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account, index) => (
                      <tr
                        key={index}
                        className="hover:bg-stone-50/50 transition-colors"
                      >
                        <td className="py-5 px-4 font-bold text-stone-700">
                          @{account.username}
                        </td>

                        <td className="py-5 px-4">
                          <span
                            className={`text-xs px-3 py-1 rounded-md font-extrabold ${
                              account.risk_score === "Tinggi"
                                ? "bg-[#A54141]/10 text-[#A54141]"
                                : account.risk_score === "Sedang"
                                ? "bg-[#C4876B]/10 text-[#C4876B]"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {account.risk_score}
                          </span>
                        </td>

                        <td
                          className={`py-5 px-4 font-semibold ${
                            account.cluster_behavior.includes("Coordinated")
                              ? "text-[#A54141]"
                              : "text-emerald-600"
                          }`}
                        >
                          {account.cluster_behavior}
                        </td>

                        <td className="py-5 px-4 text-center font-extrabold text-stone-700">
                          {account.comment_count}
                        </td>

                        <td className="py-5 px-4 text-stone-500 font-medium">
                          {account.pattern}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-stone-400 font-semibold"
                      >
                        Tidak menemukan data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        <div id="cluster-section" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2.5">
              <Network className="w-5 h-5 text-stone-700" />
              Detail Cluster ({filteredClusters.length})
            </h2>
            <select
              value={filterLabel}
              onChange={(e) => setFilterLabel(e.target.value)}
              className="px-4 py-2 border border-stone-200 rounded-lg text-base bg-stone-50 focus:outline-none focus:ring-1 focus:ring-[#A54141] font-medium"
            >
              <option value="all">Semua Kategori</option>
              <option value="spam">Spam</option>
              <option value="suspicious">Mencurigakan</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {filteredClusters.length > 0 ? (
            filteredClusters.map((cluster) => (
              <ClusterCard
                key={cluster.cluster_id}
                cluster={cluster}
                isExpanded={selectedCluster === cluster.cluster_id}
                onToggle={() =>
                  setSelectedCluster(
                    selectedCluster === cluster.cluster_id ? null : cluster.cluster_id
                  )
                }
              />
            ))
          ) : (
            <div className="bg-white border border-[#D9C49D]/60 rounded-xl p-10 text-center text-stone-400 font-semibold">
              No cluster data found for selected filter
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatsCard({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#D9C49D]/60 shadow-sm flex items-center gap-4">
      <div className="p-4 bg-[#E7E4BE]/30 rounded-xl flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-extrabold text-stone-800">{value}</p>
      </div>
    </div>
  );
}

function ClusterCard({
  cluster,
  isExpanded,
  onToggle,
}: {
  cluster: any;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#D9C49D]/60 overflow-hidden transition-all">
      <div
        className="p-6 cursor-pointer hover:bg-stone-50/50 flex items-start justify-between"
        onClick={onToggle}
      >
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <div className="flex-1 space-y-3">
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-mono bg-stone-100 px-2.5 py-0.5 rounded text-stone-600 font-extrabold">
                Cluster #{cluster.cluster_id}
              </span>

              <span className="text-xs px-3 py-1 rounded-full font-extrabold bg-[#E7E4BE]/60 text-stone-700 uppercase tracking-wider">
                {spamLabelDisplay(cluster.spam_label)}
              </span>

              <span className="text-base text-stone-400 font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                {cluster.stats.jumlah_data} komentar
              </span>
            </div>

            <p className="text-base text-stone-600 font-bold leading-relaxed">
              {cluster.summary}
            </p>
          </div>
          <div className="w-full lg:w-[420px] flex flex-row gap-4 justify-between">

            <div>
              <div className="text-xs text-stone-400 uppercase font-bold tracking-wide">
                Skor Spam 
              </div>
              <div className="text-base font-extrabold text-stone-800">
                {(cluster.stats.spam_score * 100).toFixed(1)}%
              </div>
            </div>

            <div>
              <div className="text-xs text-stone-400 uppercase font-bold tracking-wide">
                Rasio Unik
              </div>
              <div className="text-base font-extrabold text-stone-800">
                {(cluster.stats.unique_ratio * 100).toFixed(1)}%
              </div>
            </div>

            <div>
              <div className="text-xs text-stone-400 uppercase font-bold tracking-wide">
                Pengulangan
              </div>
              <div className="text-base font-extrabold text-stone-800">
                {cluster.stats.repetition_score.toFixed(1)}
              </div>
            </div>

            <div>
              <div className="text-xs text-stone-400 uppercase font-bold tracking-wide">
                Rata-rata Panjang
              </div>
              <div className="text-base font-extrabold text-stone-800">
                {cluster.stats.avg_comment_length}
              </div>
            </div>

          </div>
        </div>
        <div className="ml-4 p-1 text-stone-400">
          {isExpanded ? (
            <ChevronUp className="w-6 h-6" />
          ) : (
            <ChevronDown className="w-6 h-6" />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-stone-100 bg-stone-50/50 p-6">
          <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5" />
            Sample Conversation Cluster
          </h4>

          <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-stone-100 text-stone-600 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-bold">Username</th>
                  <th className="px-4 py-3 font-bold">Time</th>
                  <th className="px-4 py-3 font-bold">Comment</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {cluster.comments.map((comment: any, idx: number) => (
                  <tr key={idx} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#A54141]">
                      @{comment.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-500">
                      {comment.tanggal}
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {comment.komentar}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}