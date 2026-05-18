"use client";

interface GaugeChartProps {
  value: number; // 0-100
  label?: string;
  size?: number;
}

export default function GaugeChart({
  value,
  label,
  size = 200,
}: GaugeChartProps) {
  const percentage = Math.min(Math.max(value, 0), 100);
  const angle = (percentage / 100) * 180;

  // Determine color based on value
  const getColor = () => {
    if (percentage >= 70) return "#EF4444"; // red
    if (percentage >= 40) return "#F59E0B"; // yellow
    return "#10B981"; // green
  };

  const getRiskLevel = () => {
    if (percentage >= 70) return "Risiko Tinggi";
    if (percentage >= 40) return "Risiko Sedang";
    return "Risiko Rendah";
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        {/* Background Arc */}
        <svg
          width={size}
          height={size / 2 + 20}
          viewBox={`0 0 ${size} ${size / 2 + 20}`}
          className="transform"
        >
          {/* Background track */}
          <path
            d={`M ${size * 0.1} ${size / 2} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.9} ${size / 2}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={size * 0.08}
            strokeLinecap="round"
          />

          {/* Colored arc */}
          <path
            d={`M ${size * 0.1} ${size / 2} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.9} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.08}
            strokeLinecap="round"
            strokeDasharray={`${(angle / 180) * Math.PI * size * 0.4} ${Math.PI * size * 0.4}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <div className="text-5xl font-bold" style={{ color }}>
            {Math.round(percentage)}%
          </div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div
        className={`mt-4 px-4 py-2 rounded-full flex items-center gap-2 ${
          percentage >= 70
            ? "bg-red-50 text-red-700 border border-red-200"
            : percentage >= 40
              ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
              : "bg-green-50 text-green-700 border border-green-200"
        }`}
      >
        <span className="text-xl">
          {percentage >= 70 ? "⚠️" : percentage >= 40 ? "⚡" : "✓"}
        </span>
        <span className="font-semibold text-sm">{getRiskLevel()}</span>
      </div>

      {label && (
        <p className="mt-3 text-sm text-gray-600 text-center max-w-xs">
          {label}
        </p>
      )}
    </div>
  );
}
