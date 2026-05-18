"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
} from "lucide-react";
import { AnalysisResult, ClusterSummary } from "@/services/api";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLabel, setFilterLabel] = useState<string>("all");

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
        // Redirect ke beranda jika tidak ada data
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
      ["Cluster ID", "Label", "Jumlah Komentar", "Spam Score", "Summary"],
    ];

    result.cluster_summaries.forEach((cluster) => {
      csvRows.push([
        cluster.cluster_id.toString(),
        cluster.spam_label,
        cluster.stats.jumlah_data.toString(),
        cluster.stats.spam_score.toFixed(2),
        `"${cluster.summary.replace(/"/g, '""')}"`,
      ]);
    });

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cib-analysis-${result.post_id}.csv`;
    a.click();
  };

  const filteredClusters = result?.cluster_summaries.filter((cluster) => {
    const matchesSearch =
      cluster.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cluster.cluster_id.toString().includes(searchTerm);

    const matchesFilter =
      filterLabel === "all" || cluster.spam_label === filterLabel;

    return matchesSearch && matchesFilter;
  });

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

  const spamClusters = result.cluster_summaries.filter(
    (c) => c.spam_label === "spam",
  ).length;
  const suspiciousClusters = result.cluster_summaries.filter(
    (c) => c.spam_label === "suspicious",
  ).length;
  const normalClusters = result.cluster_summaries.filter(
    (c) => c.spam_label === "normal",
  ).length;

  const clusterDistribution = [
    { name: "Spam", value: spamClusters, color: "#ef4444" },
    { name: "Suspicious", value: suspiciousClusters, color: "#f59e0b" },
    { name: "Normal", value: normalClusters, color: "#10b981" },
  ];

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
              <span>Unduh CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Post Info */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Hasil Analisis CIB</h1>
              <div className="flex items-center gap-2 text-blue-100">
                <LinkIcon className="w-4 h-4" />
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  {result.url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-blue-100 text-sm mt-1">
                Post ID: {result.post_id}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Komentar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.comments_count.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Filter className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Komentar Bersih</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.comments_cleaned_count.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Network className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Cluster</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.cluster_summaries.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Spam Terdeteksi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {spamClusters + suspiciousClusters}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Temporal Analysis Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Analisis Temporal
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={result.temporal_analysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="tanggal"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="jumlah_komentar"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                  name="Jumlah Komentar"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cluster Distribution Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Distribusi Cluster
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clusterDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                  }: {
                    cx?: number;
                    cy?: number;
                    midAngle?: number;
                    innerRadius?: number;
                    outerRadius?: number;
                    percent?: number;
                  }) => {
                    if (
                      !cx ||
                      !cy ||
                      midAngle === undefined ||
                      !innerRadius ||
                      !outerRadius ||
                      !percent
                    ) {
                      return null;
                    }
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x =
                      cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y =
                      cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={14}
                        fontWeight="bold"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  outerRadius={100}
                  dataKey="value"
                >
                  {clusterDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cluster Filter & Search */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari cluster berdasarkan ID atau summary..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {["all", "spam", "suspicious", "normal"].map((label) => (
                <button
                  key={label}
                  onClick={() => setFilterLabel(label)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterLabel === label
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label === "all"
                    ? "Semua"
                    : label.charAt(0).toUpperCase() + label.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clusters List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Network className="w-6 h-6" />
            Detail Cluster ({filteredClusters?.length || 0})
          </h2>

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
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Tidak ada cluster yang ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </main>
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
    switch (label) {
      case "spam":
        return "bg-red-100 text-red-800 border-red-200";
      case "suspicious":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getSpamIcon = (label: string) => {
    switch (label) {
      case "spam":
        return "🚫";
      case "suspicious":
        return "⚠️";
      default:
        return "✓";
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
                className={`text-xs px-3 py-1 rounded-full border font-semibold ${getSpamColor(
                  cluster.spam_label,
                )}`}
              >
                {getSpamIcon(cluster.spam_label)}{" "}
                {cluster.spam_label.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="w-4 h-4" />
                {cluster.stats.jumlah_data} komentar
              </span>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {cluster.summary}
            </p>

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
                <p className="text-xs text-gray-600 mb-1">Repetition Score</p>
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
