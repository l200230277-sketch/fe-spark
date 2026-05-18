"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
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
  Filter,
  Loader2,
  ArrowLeft,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Activity,
  Lightbulb,
} from "lucide-react";
import {
  AnalysisResult,
  ClusterSummary,
  SuspiciousAccount,
} from "@/services/api";
import GaugeChart from "@/components/GaugeChart";
import NetworkGraph from "@/components/NetworkGraph";

const normalizeSpamLabel = (
  label?: string,
): "spam" | "suspicious" | "normal" => {
  const v = String(label || "")
    .trim()
    .toLowerCase();
  if (v.includes("spam")) return "spam";
  if (v.includes("suspicious") || v.includes("mencurigakan"))
    return "suspicious";
  return "normal";
};

const spamLabelDisplay = (label?: string): string => {
  const normalized = normalizeSpamLabel(label);
  if (normalized === "spam") return "SPAM";
  if (normalized === "suspicious") return "SUSPICIOUS";
  return "NORMAL";
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLabel, setFilterLabel] = useState<string>("all");
  const [accountFilter, setAccountFilter] = useState<string>("all");

  useEffect(() => {
    loadAnalysisResult();
  }, []);

  const loadAnalysisResult = () => {
    try {
      const cached = localStorage.getItem("latest_analysis");
      if (cached) {
        const data: AnalysisResult = JSON.parse(cached);
        setResult(data);
      } else {
        router.push("/beranda");
      }
    } catch (error) {
      console.error("Error loading analysis:", error);
      router.push("/beranda");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!result) return;

    const csvRows = [
      [
        "Username",
        "Risk Score",
        "Cluster Behavior",
        "Komentar",
        "Pattern Terdeteksi",
      ],
    ];

    result.suspicious_accounts?.forEach((account) => {
      csvRows.push([
        account.username,
        account.risk_score,
        account.cluster_behavior,
        account.comment_count.toString(),
        `"${account.pattern.replace(/"/g, '""')}"`,
      ]);
    });

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suspicious-accounts-${result?.post_id || "unknown"}.csv`;
    a.click();
  };

  const filteredClusters =
    result?.cluster_summaries?.filter((cluster) => {
      const matchesSearch =
        cluster.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cluster.cluster_id.toString().includes(searchTerm);

      const matchesFilter =
        filterLabel === "all" ||
        normalizeSpamLabel(cluster.spam_label) === filterLabel;

      return matchesSearch && matchesFilter;
    }) || [];

  const filteredAccounts =
    result?.suspicious_accounts?.filter((account) => {
      const matchesSearch = account.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        accountFilter === "all" || account.risk_score === accountFilter;
      return matchesSearch && matchesFilter;
    }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat hasil analisis...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Tidak ada data analisis</p>
          <button
            onClick={() => router.push("/beranda")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const cibScore = result?.cib_score ?? 0;
  const semanticSimilarity = (result?.semantic_similarity ?? 0) * 100;
  const temporalAnomaly = (result?.temporal_anomaly ?? 0) * 100;

  const spamClusters =
    result?.cluster_summaries?.filter(
      (c) => normalizeSpamLabel(c.spam_label) === "spam",
    ).length || 0;
  const clusterData =
    result?.cluster_summaries?.map((cluster, index) => ({
      cluster_id: cluster.cluster_id,
      label: `Klaster ${String.fromCharCode(65 + index)}`,
      count: cluster.stats.jumlah_data,
    })) || [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/beranda")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Post Info */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 mb-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Hasil Analisis CIB</h1>
          <div className="flex items-center gap-2 text-blue-100">
            <LinkIcon className="w-4 h-4" />
            <a
              href={result?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              {result?.url || "No URL"}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Top Row: CIB Score + Temporal Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* CIB Score Gauge */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Skor CIB</h2>
            <GaugeChart
              value={cibScore}
              label="Terdeteksi pola manipulasi yang signifikan"
            />
          </div>

          {/* Temporal Analysis Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Pola Temporal Komentar
              </h2>
              {result.temporal_insight && (
                <button className="text-sm px-3 py-1 bg-orange-100 text-orange-700 rounded-lg font-medium">
                  Lonjakan Terdeteksi
                </button>
              )}
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={result?.temporal_analysis || []}>
                <defs>
                  <linearGradient
                    id="colorComments"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="tanggal" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="jumlah_komentar"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorComments)"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Temporal Insight */}
            {result.temporal_insight && (
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-orange-900 mb-1">
                      Insight:
                    </p>
                    <p className="text-sm text-orange-800">
                      {result.temporal_insight.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Row: Breakdown + Network Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Breakdown Indikator */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Breakdown Indikator
            </h2>

            {/* Semantic Similarity */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Kesamaan Semantik
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {Math.round(semanticSimilarity)}%
                </span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-red-500 rounded-full transition-all duration-1000"
                  style={{ width: `${semanticSimilarity}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tingkat kemiripan narasi antar komentar
              </p>
            </div>

            {/* Temporal Anomaly */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Anomali Temporal
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {Math.round(temporalAnomaly)}%
                </span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-red-500 rounded-full transition-all duration-1000"
                  style={{ width: `${temporalAnomaly}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pola waktu posting yang tidak wajar
              </p>
            </div>
          </div>

          {/* Network Graph */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Network className="w-5 h-5" />
              Klaster Terkoordinasi
            </h2>
            <NetworkGraph clusters={clusterData} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={<MessageCircle className="w-6 h-6 text-blue-600" />}
            label="Total Komentar"
            value={(result?.comments_count || 0).toString()}
            bgColor="bg-blue-50"
          />
          <StatsCard
            icon={<Clock className="w-6 h-6 text-green-600" />}
            label="Komentar Dibersihkan"
            value={(result?.comments_cleaned_count || 0).toString()}
            bgColor="bg-green-50"
          />
          <StatsCard
            icon={<Network className="w-6 h-6 text-purple-600" />}
            label="Jumlah Cluster"
            value={(result?.cluster_summaries?.length || 0).toString()}
            bgColor="bg-purple-50"
          />
          <StatsCard
            icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
            label="Spam Terdeteksi"
            value={spamClusters.toString()}
            bgColor="bg-red-50"
          />
        </div>

        {/* Suspicious Accounts Table */}
        {result.suspicious_accounts &&
          result.suspicious_accounts.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Daftar Akun Mencurigakan
                  <span className="text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                    {result.suspicious_accounts.length} akun
                  </span>
                </h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={accountFilter}
                    onChange={(e) => setAccountFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Semua Level</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Username
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Risk Score
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Cluster Behavior
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Komentar
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Pattern Terdeteksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAccounts?.map((account, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors border-l-4"
                        style={{
                          borderLeftColor:
                            account.risk_score === "Tinggi"
                              ? "#EF4444"
                              : account.risk_score === "Sedang"
                                ? "#F59E0B"
                                : "#F97316",
                        }}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {account.username}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              account.risk_score === "Tinggi"
                                ? "bg-red-100 text-red-700"
                                : account.risk_score === "Sedang"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {account.risk_score}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-blue-600 font-medium">
                            {account.cluster_behavior}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                            {account.comment_count}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {account.pattern}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Catatan */}
              <div className="mt-4 bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                <p className="text-sm text-orange-800">
                  <span className="font-semibold">Catatan:</span> Risk Score
                  dihitung berdasarkan analisis perilaku klaster, kemiripan
                  semantik komentar, dan anomali temporal. Semakin tinggi skor,
                  semakin mencurigakan perilaku akun tersebut.
                </p>
              </div>
            </div>
          )}

        {/* Clusters List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Network className="w-6 h-6" />
              Detail Cluster ({filteredClusters?.length || 0})
            </h2>
            <select
              value={filterLabel}
              onChange={(e) => setFilterLabel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Label</option>
              <option value="spam">Spam</option>
              <option value="suspicious">Suspicious</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {filteredClusters?.map((cluster) => (
            <ClusterCard
              key={cluster.cluster_id}
              cluster={cluster}
              isExpanded={selectedCluster === cluster.cluster_id}
              onToggle={() =>
                setSelectedCluster(
                  selectedCluster === cluster.cluster_id
                    ? null
                    : cluster.cluster_id,
                )
              }
            />
          ))}

          {filteredClusters?.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              Data klaster belum tersedia dari backend. Scraping sudah masuk,
              tetapi proses clustering/summary belum dikirim oleh service
              analisis.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatsCard({ icon, label, value, bgColor }: any) {
  return (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-200`}>
      <div className="flex items-center justify-between mb-2">
        <div>{icon}</div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ClusterCard({
  cluster,
  isExpanded,
  onToggle,
}: {
  cluster: ClusterSummary;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const getSpamColor = (label: string) => {
    switch (normalizeSpamLabel(label)) {
      case "spam":
        return "bg-red-100 text-red-800 border-red-200";
      case "suspicious":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
                Cluster #{cluster.cluster_id}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full border font-semibold ${getSpamColor(cluster.spam_label)}`}
              >
                {spamLabelDisplay(cluster.spam_label)}
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="w-4 h-4" />
                {cluster.stats.jumlah_data} komentar
              </span>
            </div>
            <p className="text-gray-700 mb-4">{cluster.summary}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Spam Score</p>
                <p className="text-lg font-bold text-gray-900">
                  {(cluster.stats.spam_score * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Unique Ratio</p>
                <p className="text-lg font-bold text-gray-900">
                  {(cluster.stats.unique_ratio * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Repetition</p>
                <p className="text-lg font-bold text-gray-900">
                  {cluster.stats.repetition_score.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Avg Length</p>
                <p className="text-lg font-bold text-gray-900">
                  {cluster.stats.avg_comment_length.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
          <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Komentar dalam Cluster ({cluster.comments.length})
          </h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cluster.comments.map((comment, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-blue-600">
                    @{comment.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {comment.tanggal}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{comment.komentar}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
