import { NextRequest, NextResponse } from "next/server";

const NGROK_API_URL =
  process.env.NGROK_API_URL || "https://annie-plushed-mayme.ngrok-free.dev";

type JsonMap = Record<string, any>;

function isObject(value: any): value is JsonMap {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function asArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value) as T[];
  return [];
}

function parseIfJsonString(value: any): any {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }
  return value;
}

function findArrayByKeys(source: any, keys: string[], depth = 0): any[] {
  if (depth > 6 || source == null) return [];

  if (Array.isArray(source)) {
    if (
      source.length > 0 &&
      source.some(
        (item) =>
          isObject(item) && keys.some((key) => key in (item as JsonMap)),
      )
    ) {
      return source;
    }

    for (const item of source) {
      const found = findArrayByKeys(item, keys, depth + 1);
      if (found.length > 0) return found;
    }
    return [];
  }

  if (isObject(source)) {
    for (const value of Object.values(source)) {
      const found = findArrayByKeys(value, keys, depth + 1);
      if (found.length > 0) return found;
    }
  }

  return [];
}

function findObjectByKey(
  source: any,
  targetKeys: string[],
  depth = 0,
): JsonMap {
  if (depth > 6 || !isObject(source)) return {};

  for (const key of targetKeys) {
    if (isObject(source[key])) return source[key] as JsonMap;
  }

  for (const value of Object.values(source)) {
    if (isObject(value)) {
      const found = findObjectByKey(value, targetKeys, depth + 1);
      if (Object.keys(found).length > 0) return found;
    }
  }

  return {};
}

function num(value: any, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeText(text: string): string {
  return String(text || "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((w) => w.length >= 3)
    .slice(0, 20);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function buildFallbackAnalytics(base: JsonMap): JsonMap {
  const temporal = asArray(base.temporal_analysis || base.temporalAnalysis);

  const comments = temporal.flatMap((bucket: any) => {
    const tanggal = bucket?.tanggal || bucket?.date || bucket?.time || "";
    return asArray(bucket?.data || bucket?.comments).map((c: any) => ({
      username: c?.username || c?.user || c?.author || "unknown",
      komentar: c?.komentar || c?.comment || c?.text || "",
      tanggal,
    }));
  });

  if (comments.length === 0) return base;

  type ClusterAcc = {
    cluster_id: number;
    comments: any[];
    tokenSet: Set<string>;
    tokenFreq: Record<string, number>;
  };

  const clusters: ClusterAcc[] = [];
  const threshold = 0.2;
  const maxClusters = 8;

  for (const c of comments) {
    const tokens = tokenize(c.komentar);
    const tokenSet = new Set(tokens);

    let bestIdx = -1;
    let bestScore = 0;
    for (let i = 0; i < clusters.length; i++) {
      const score = jaccard(tokenSet, clusters[i].tokenSet);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    if (
      bestIdx === -1 ||
      (bestScore < threshold && clusters.length < maxClusters)
    ) {
      const freq: Record<string, number> = {};
      for (const t of tokens) freq[t] = (freq[t] || 0) + 1;
      clusters.push({
        cluster_id: clusters.length,
        comments: [c],
        tokenSet: new Set(tokens),
        tokenFreq: freq,
      });
    } else {
      const target = clusters[bestIdx];
      target.comments.push(c);
      for (const t of tokens) {
        target.tokenSet.add(t);
        target.tokenFreq[t] = (target.tokenFreq[t] || 0) + 1;
      }
    }
  }

  const clusterSummaries = clusters
    .filter((cl) => cl.comments.length > 0)
    .map((cl) => {
      const total = cl.comments.length;
      const normalized = cl.comments.map((x) => normalizeText(x.komentar));
      const uniqueRatio =
        total > 0 ? new Set(normalized).size / Math.max(total, 1) : 0;
      const repetition = 1 - uniqueRatio;
      const avgLen =
        total > 0
          ? cl.comments.reduce(
              (acc, x) => acc + String(x.komentar || "").length,
              0,
            ) / total
          : 0;
      const shortRatio =
        total > 0
          ? cl.comments.filter((x) => String(x.komentar || "").length < 20)
              .length / total
          : 0;
      const spamScore = clamp(0.7 * repetition + 0.3 * shortRatio, 0, 1);
      const spamLabel =
        spamScore >= 0.7 ? "spam" : spamScore >= 0.4 ? "suspicious" : "normal";

      const topTokens = Object.entries(cl.tokenFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([k]) => k)
        .join(", ");

      return {
        cluster_id: cl.cluster_id,
        summary:
          topTokens.length > 0
            ? `Pola komentar dominan: ${topTokens}`
            : `Cluster ${cl.cluster_id} hasil pengelompokan komentar.`,
        spam_label: spamLabel,
        stats: {
          jumlah_data: total,
          avg_comment_length: Number(avgLen.toFixed(2)),
          unique_ratio: Number(uniqueRatio.toFixed(3)),
          repetition_score: Number(repetition.toFixed(3)),
          spam_score: Number(spamScore.toFixed(3)),
        },
        comments: cl.comments.slice(0, 40),
      };
    })
    .sort((a, b) => b.stats.jumlah_data - a.stats.jumlah_data);

  const accountMap: Record<
    string,
    { count: number; cluster: string; spamScore: number }
  > = {};
  for (const cl of clusterSummaries) {
    for (const cm of cl.comments) {
      const u = cm.username || "unknown";
      if (!accountMap[u]) {
        accountMap[u] = {
          count: 0,
          cluster: cl.spam_label,
          spamScore: cl.stats.spam_score,
        };
      }
      accountMap[u].count += 1;
      accountMap[u].spamScore = Math.max(
        accountMap[u].spamScore,
        cl.stats.spam_score,
      );
      if (cl.spam_label === "spam") accountMap[u].cluster = "spam";
      else if (
        cl.spam_label === "suspicious" &&
        accountMap[u].cluster !== "spam"
      ) {
        accountMap[u].cluster = "suspicious";
      }
    }
  }

  const suspiciousAccounts = Object.entries(accountMap)
    .filter(([, v]) => v.count >= 2 || v.spamScore >= 0.55)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20)
    .map(([username, v]) => ({
      username,
      risk_score:
        v.spamScore >= 0.7
          ? "Tinggi"
          : v.spamScore >= 0.5
            ? "Sedang"
            : "Rendah",
      cluster_behavior:
        v.cluster === "spam"
          ? "Coordinated Inauthentic Behavior"
          : v.cluster === "suspicious"
            ? "Suspicious behavior"
            : "Normal behavior",
      comment_count: v.count,
      pattern:
        v.count >= 3
          ? "Frekuensi komentar berulang"
          : "Pola komentar mencurigakan",
    }));

  const semanticSimilarity = clamp(
    clusterSummaries.length > 0
      ? clusterSummaries.reduce(
          (acc, c) => acc + c.stats.repetition_score * c.stats.jumlah_data,
          0,
        ) /
          Math.max(
            clusterSummaries.reduce((acc, c) => acc + c.stats.jumlah_data, 0),
            1,
          )
      : 0,
    0,
    1,
  );

  const counts = temporal
    .map((t: any) => num(t?.jumlah_komentar ?? t?.count, 0))
    .filter((n) => n > 0);
  const mean =
    counts.length > 0 ? counts.reduce((a, b) => a + b, 0) / counts.length : 0;
  const variance =
    counts.length > 0
      ? counts.reduce((a, b) => a + (b - mean) * (b - mean), 0) / counts.length
      : 0;
  const std = Math.sqrt(variance);
  const peaks = temporal
    .map((t: any) => ({
      time: t?.tanggal || t?.date || "",
      value: num(t?.jumlah_komentar ?? t?.count, 0),
    }))
    .filter((x) => x.value > mean + 2 * std)
    .slice(0, 5)
    .map((x) => ({
      time: x.time,
      multiplier: mean > 0 ? Number((x.value / mean).toFixed(2)) : 1,
    }));

  const temporalAnomaly = clamp(peaks.length / 5, 0, 1);
  const spamClusters = clusterSummaries.filter(
    (c) => c.spam_label === "spam",
  ).length;
  const cibScore = Math.round(
    clamp(
      0.35 * semanticSimilarity +
        0.25 * temporalAnomaly +
        0.2 * clamp(spamClusters / Math.max(clusterSummaries.length, 1), 0, 1) +
        0.2 * clamp(suspiciousAccounts.length / 10, 0, 1),
      0,
      1,
    ) * 100,
  );

  return {
    ...base,
    cluster_summaries: clusterSummaries,
    suspicious_accounts: suspiciousAccounts,
    semantic_similarity: Number(semanticSimilarity.toFixed(3)),
    temporal_anomaly: Number(temporalAnomaly.toFixed(3)),
    cib_score:
      base?.cib_score && Number(base.cib_score) > 0 ? base.cib_score : cibScore,
    temporal_insight: base?.temporal_insight || {
      message:
        peaks.length > 0
          ? `Terdeteksi ${peaks.length} lonjakan aktivitas komentar.`
          : "Tidak ada lonjakan temporal ekstrem.",
      peaks,
    },
  };
}

function normalizeClusterSummaries(raw: JsonMap): any[] {
  const direct = asArray(
    raw.cluster_summaries ||
      raw.clusterSummaries ||
      raw.cluster_summary ||
      raw.summaries,
  );
  if (direct.length > 0) return direct;

  const discovered = findArrayByKeys(raw, [
    "cluster_id",
    "spam_label",
    "summary",
    "stats",
    "comments",
  ]);
  if (discovered.length > 0) {
    return discovered.map((item: any, idx: number) => ({
      cluster_id: num(item?.cluster_id ?? item?.id, idx),
      summary: item?.summary || item?.deskripsi || `Cluster ${idx}`,
      spam_label: item?.spam_label || item?.label || "normal",
      stats: {
        jumlah_data: num(item?.stats?.jumlah_data ?? item?.jumlah_data ?? 0, 0),
        avg_comment_length: num(
          item?.stats?.avg_comment_length ?? item?.avg_comment_length ?? 0,
          0,
        ),
        unique_ratio: num(
          item?.stats?.unique_ratio ?? item?.unique_ratio ?? 0,
          0,
        ),
        repetition_score: num(
          item?.stats?.repetition_score ?? item?.repetition_score ?? 0,
          0,
        ),
        spam_score: num(item?.stats?.spam_score ?? item?.spam_score ?? 0, 0),
      },
      comments: asArray(item?.comments).map((c: any) => ({
        username: c?.username || c?.user || c?.author || "unknown",
        komentar: c?.komentar || c?.comment || c?.text || "",
        tanggal: c?.tanggal || c?.date || c?.created_at || "",
      })),
    }));
  }

  // Fallback: build from `clusters` + `cluster_stats`
  const clusters =
    raw.clusters ||
    raw.cluster_map ||
    raw.grouped_clusters ||
    raw.clustered_comments ||
    findObjectByKey(raw, [
      "clusters",
      "cluster_map",
      "grouped_clusters",
      "clustered_comments",
    ]);
  const clusterStats =
    raw.cluster_stats ||
    raw.clusterStats ||
    raw.stats_per_cluster ||
    findObjectByKey(raw, [
      "cluster_stats",
      "clusterStats",
      "stats_per_cluster",
    ]);

  if (!clusters || typeof clusters !== "object") {
    if (clusterStats && typeof clusterStats === "object") {
      return Object.entries(clusterStats).map(
        ([clusterId, stats]: [string, any]) => ({
          cluster_id: num(clusterId, 0),
          summary: stats?.summary || `Cluster ${clusterId} hasil analisis`,
          spam_label: stats?.spam_label || "normal",
          stats: {
            jumlah_data: num(stats?.jumlah_data, 0),
            avg_comment_length: num(stats?.avg_comment_length, 0),
            unique_ratio: num(stats?.unique_ratio, 0),
            repetition_score: num(stats?.repetition_score, 0),
            spam_score: num(stats?.spam_score, 0),
          },
          comments: [],
        }),
      );
    }
    return [];
  }

  const entries = Array.isArray(clusters)
    ? clusters.map((c: any, idx: number) => [c?.cluster_id ?? idx, c])
    : Object.entries(clusters);

  return entries.map(([clusterId, clusterValue]) => {
    const commentsRaw = Array.isArray(clusterValue)
      ? clusterValue
      : asArray(
          clusterValue?.comments ||
            clusterValue?.items ||
            clusterValue?.data ||
            clusterValue,
        );
    const stats = clusterStats?.[clusterId] || {};

    const comments = commentsRaw.map((c: any) => ({
      username: c?.username || c?.user || c?.author || "unknown",
      komentar: c?.komentar || c?.comment || c?.text || "",
      tanggal: c?.tanggal || c?.date || c?.created_at || "",
    }));

    return {
      cluster_id: num(clusterId, 0),
      summary:
        clusterValue?.summary ||
        stats?.summary ||
        `Cluster ${clusterId} hasil analisis`,
      spam_label: clusterValue?.spam_label || stats?.spam_label || "normal",
      stats: {
        jumlah_data: num(stats?.jumlah_data, comments.length),
        avg_comment_length: num(stats?.avg_comment_length, 0),
        unique_ratio: num(stats?.unique_ratio, 0),
        repetition_score: num(stats?.repetition_score, 0),
        spam_score: num(stats?.spam_score, 0),
      },
      comments,
    };
  });
}

function normalizeTemporalAnalysis(raw: JsonMap): any[] {
  const direct = asArray(raw.temporal_analysis || raw.temporalAnalysis);
  if (direct.length > 0) return direct;

  const discovered = findArrayByKeys(raw, [
    "tanggal",
    "jumlah_komentar",
    "time",
    "count",
  ]);
  if (discovered.length > 0) {
    return discovered.map((t: any) => ({
      tanggal: t?.tanggal || t?.date || t?.time || "",
      jumlah_komentar: num(t?.jumlah_komentar ?? t?.count ?? t?.comments, 0),
    }));
  }

  const temporalData = asArray(raw.temporal_data || raw.temporalData);
  return temporalData.map((t: any) => ({
    tanggal: t?.tanggal || t?.date || t?.time || "",
    jumlah_komentar: num(t?.jumlah_komentar ?? t?.count ?? t?.comments, 0),
  }));
}

function normalizeSuspiciousAccounts(raw: JsonMap): any[] {
  const direct = asArray(raw.suspicious_accounts || raw.suspiciousAccounts);
  if (direct.length > 0) return direct;

  const discovered = findArrayByKeys(raw, [
    "risk_score",
    "cluster_behavior",
    "comment_count",
    "pattern",
    "username",
  ]);
  if (discovered.length > 0) {
    return discovered.map((a: any) => ({
      username: a?.username || a?.user || "unknown",
      risk_score: a?.risk_score || a?.risk || "Sedang",
      cluster_behavior:
        a?.cluster_behavior || a?.behavior || "Suspicious behavior",
      comment_count: num(a?.comment_count ?? a?.count, 0),
      pattern: a?.pattern || a?.reason || "-",
    }));
  }

  const fallback = asArray(
    raw.suspicious || raw.flagged_accounts || raw.flaggedAccounts,
  );
  return fallback.map((a: any) => ({
    username: a?.username || a?.user || "unknown",
    risk_score: a?.risk_score || a?.risk || "Sedang",
    cluster_behavior:
      a?.cluster_behavior || a?.behavior || "Suspicious behavior",
    comment_count: num(a?.comment_count ?? a?.count, 0),
    pattern: a?.pattern || a?.reason || "-",
  }));
}

function normalizeResult(payload: JsonMap): JsonMap {
  const rawCandidate =
    payload?.result || payload?.data || payload?.analysis || payload;
  const parsedRaw = parseIfJsonString(rawCandidate);
  const raw = (isObject(parsedRaw) ? parsedRaw : payload) as JsonMap;

  const rawStatus = String(raw?.status || "").toLowerCase();
  const isError = rawStatus === "error" || rawStatus === "failed";

  // Log for debugging — remove after issue is resolved
  console.log("[route] normalizeResult → status:", rawStatus, "| message:", raw?.message);

  // Short-circuit: if backend returned an error, preserve the original message
  // without overwriting it with the success default "Analisis selesai"
  if (isError) {
    return {
      status: raw?.status || "error",
      message: raw?.message || "Terjadi kesalahan pada proses analisis di backend.",
    };
  }

  const clusterSummaries = normalizeClusterSummaries(raw);
  const suspiciousAccounts = normalizeSuspiciousAccounts(raw);
  const temporalAnalysis = normalizeTemporalAnalysis(raw);
  const base = {
    status: raw?.status || "success",
    message: raw?.message || "Analisis selesai",
    post_id: raw?.post_id || raw?.postId || "unknown",
    url: raw?.url || "",
    comments_count: num(
      raw?.comments_count ?? raw?.original_count ?? raw?.total_comments,
      0,
    ),
    comments_cleaned_count: num(
      raw?.comments_cleaned_count ??
        raw?.cleaned_count ??
        raw?.cleaned_comments,
      0,
    ),
    cib_score: num(raw?.cib_score ?? raw?.cibScore, 0),
    semantic_similarity: num(
      raw?.semantic_similarity ?? raw?.semantic_sim ?? raw?.semanticScore,
      0,
    ),
    temporal_anomaly: num(
      raw?.temporal_anomaly ?? raw?.temporal_score ?? raw?.temporalScore,
      0,
    ),
    temporal_insight: raw?.temporal_insight || raw?.temporalInsight || null,
    suspicious_accounts: suspiciousAccounts,
    cluster_summaries: clusterSummaries,
    temporal_analysis: temporalAnalysis,
  };

  const needFallbackAnalytics =
    (base.cluster_summaries?.length || 0) === 0 ||
    num(base.semantic_similarity, 0) === 0 ||
    num(base.temporal_anomaly, 0) === 0;

  return needFallbackAnalytics ? buildFallbackAnalytics(base) : base;
}

export async function POST(request: NextRequest) {
  console.log(`[analyze] NGROK_API_URL = ${NGROK_API_URL}`);
  try {
    const body = await request.json();
    const url = body?.url;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { message: "URL Instagram harus diisi" },
        { status: 400 },
      );
    }

    const targetUrl = `${NGROK_API_URL}/analyze`;
    console.log(`[analyze] Fetching upstream: ${targetUrl}`);

    let upstream: Response;
    try {
      upstream = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ url: url.trim() }),
        cache: "no-store",
      });
    } catch (fetchErr: any) {
      console.error("[analyze] fetch() threw an error:", fetchErr);
      return NextResponse.json(
        {
          message: `Tidak dapat terhubung ke backend (${NGROK_API_URL}). Pastikan server Python sudah berjalan. Detail: ${fetchErr?.message}`,
        },
        { status: 503 },
      );
    }

    const text = await upstream.text();
    const contentType = upstream.headers.get("content-type") || "";
    console.log(`[analyze] upstream status: ${upstream.status}, content-type: ${contentType}`);

    // Forward JSON responses directly
    if (contentType.includes("application/json")) {
      const payload = JSON.parse(text || "{}");
      const normalized = normalizeResult(payload);
      return NextResponse.json(normalized, { status: upstream.status });
    }

    // Normalize non-JSON responses into JSON for frontend
    return NextResponse.json(
      {
        message:
          "Backend mengembalikan respons non-JSON. Periksa status Colab/ngrok.",
        raw: text.substring(0, 400),
      },
      { status: upstream.ok ? 502 : upstream.status },
    );
  } catch (error: any) {
    console.error("[analyze] Unhandled error:", error);
    return NextResponse.json(
      {
        message: error?.message || "Gagal menghubungi backend ngrok",
      },
      { status: 500 },
    );
  }
}
