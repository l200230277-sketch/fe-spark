// API Service untuk komunikasi dengan backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface AnalyzeRequest {
  url: string;
}

export interface Comment {
  username: string;
  komentar: string;
  tanggal: string;
}

export interface ClusterStats {
  jumlah_data: number;
  avg_comment_length: number;
  unique_ratio: number;
  repetition_score: number;
  spam_score: number;
}

export interface ClusterSummary {
  cluster_id: number;
  summary: string;
  spam_label: string;
  stats: ClusterStats;
  comments: Comment[];
}

export interface TemporalData {
  tanggal: string;
  jumlah_komentar: number;
}

export interface SuspiciousAccount {
  username: string;
  risk_score: string; // "Tinggi" | "Sedang" | "Rendah"
  cluster_behavior: string;
  comment_count: number;
  pattern: string;
}

export interface TemporalInsight {
  message: string;
  peaks: Array<{ time: string; multiplier: number }>;
}

export interface AnalysisResult {
  status: string;
  message: string;
  post_id: string;
  url: string;
  comments_count: number;
  comments_cleaned_count: number;
  cluster_summaries: ClusterSummary[];
  temporal_analysis: TemporalData[];
  cib_score?: number; // 0-100
  semantic_similarity?: number; // 0-1
  temporal_anomaly?: number; // 0-1
  suspicious_accounts?: SuspiciousAccount[];
  temporal_insight?: TemporalInsight;
}

export class APIService {
  /**
   * Menganalisis postingan Instagram
   * @param url URL postingan Instagram
   * @returns Promise dengan hasil analisis
   */
  static async analyzeInstagramPost(url: string): Promise<AnalysisResult> {
    if (!url || !url.trim()) {
      throw new Error("URL Instagram harus diisi");
    }

    try {
      const fullUrl = `${API_BASE_URL}/analyze`;

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `HTTP ${response.status}`;

        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            if (Array.isArray(errorData.detail)) {
              const first = errorData.detail[0];
              errorMessage = first?.msg || errorData.message || errorMessage;
            } else if (typeof errorData.detail === "string") {
              errorMessage = errorData.detail;
            } else {
              errorMessage =
                errorData.error || errorData.message || errorMessage;
            }
          } else {
            const text = await response.text();
            errorMessage = `Backend error: ${text.substring(0, 100)}`;
          }
        } catch (e) {
          errorMessage = `${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data: AnalysisResult = await response.json();

      // Log for debugging — remove after resolved
      console.log("[api] raw data from backend:", JSON.stringify(data).substring(0, 300));

      // HTTP response.ok (checked above) is the authoritative success indicator.
      // We only throw if backend explicitly signals a processing error.
      const status = String(data?.status || "").toLowerCase();
      if (status === "error") {
        throw new Error(data?.message || "Proses analisis backend gagal.");
      }

      return data;
    } catch (error: any) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "Tidak dapat terhubung ke service analisis. Coba refresh halaman lalu ulangi.",
        );
      }

      console.error("Error during analysis:", error);
      throw new Error(
        error.message ||
          "Gagal menganalisis postingan Instagram. Silakan coba lagi.",
      );
    }
  }

  /**
   * Mengecek status kesehatan backend
   * @returns Promise dengan status backend
   */
  static async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);

      if (!response.ok) {
        throw new Error("Backend tidak dapat diakses");
      }

      return await response.json();
    } catch (error: any) {
      console.error("Error checking backend health:", error);
      throw new Error("Backend tidak dapat diakses.");
    }
  }
}
