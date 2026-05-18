"use client";

import { useEffect, useRef } from "react";

interface NetworkGraphProps {
  clusters: Array<{
    cluster_id: number;
    label: string;
    count: number;
  }>;
}

export default function NetworkGraph({ clusters }: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = [
    "#6366F1", // indigo - Klaster A
    "#EF4444", // red - Klaster B
    "#F59E0B", // amber - Klaster C
    "#10B981", // emerald - Klaster D
    "#8B5CF6", // violet - Klaster E
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas dengan background putih
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // Calculate positions
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35; // Increased radius

    // Draw center node first
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#D1D5DB"; // gray center
    ctx.fill();
    ctx.strokeStyle = "#9CA3AF";
    ctx.lineWidth = 2;
    ctx.stroke();

    clusters.forEach((cluster, index) => {
      const angle = (index / clusters.length) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const color = colors[index % colors.length];

      // Draw connecting lines from center (THICKER & CLEARER)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = color + "80"; // 50% opacity
      ctx.lineWidth = 3; // Thicker line
      ctx.stroke();

      // Draw cluster node (NO satellites, just main node)
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw label ABOVE the node
      ctx.font =
        "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.fillStyle = "#4B5563";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";

      // Position label above node
      const labelY = y - 25;
      ctx.fillText(`Klaster ${String.fromCharCode(65 + index)}`, x, labelY);
    });
  }, [clusters]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="w-full h-auto"
      />

      {/* Legend - mirip screenshot */}
      <div className="mt-6 space-y-2">
        {clusters.map((cluster, index) => (
          <div key={cluster.cluster_id} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-700 font-medium">
              Klaster {String.fromCharCode(65 + index)} ({cluster.count} akun)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
