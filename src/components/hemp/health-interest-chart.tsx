"use client";
import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronDown } from "lucide-react";

interface HealthInterestData {
  area: string;
  count: number;
}

interface HealthInterestChartProps {
  data: HealthInterestData[];
  totalParticipants: number;
  filterOptions?: string[];
  filterValue?: string;
  onFilterChange?: (v: string) => void;
  title?: string;
}

const BRAND = "#14306B";
const BRAND_DK = "#0C447C";
const PRIMARY_COLOR = "#122B5E";
const LIGHT_COLOR = "#9FB4E0";
const LIGHT_BORDER = "rgba(16, 44, 94, 0.12)";

export default function HealthInterestChart({
  data,
  totalParticipants,
  filterOptions,
  filterValue,
  onFilterChange,
  title = "Participants by Health Interest Area",
}: HealthInterestChartProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.count - a.count);
    return sorted.map((item, idx) => ({
      ...item,
      percentage: totalParticipants > 0 ? Math.round((item.count / totalParticipants) * 100) : 0,
      isTop3: idx < 3,
    }));
  }, [data, totalParticipants]);

  const top3Areas = chartData
    .slice(0, 3)
    .map(d => d.area)
    .join(", ");

  const subtitle = chartData.length > 0
    ? `${chartData[0].area} and ${chartData[1]?.area || "others"} draw the most interest`
    : "Distribution across health specializations";

  const maxValue = Math.max(...chartData.map(d => d.count), 0);
  const axisMax = Math.ceil(maxValue * 1.15);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: "white",
          border: `1px solid ${LIGHT_BORDER}`,
          borderRadius: 6,
          padding: "8px 12px",
          fontSize: 11,
          color: BRAND_DK,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{data.area}</p>
          <p style={{ margin: "4px 0 0 0" }}>
            {data.count} participants · {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, width, height, value, payload } = props;
    if (!value) return null;

    const labelText = `${payload.count} · ${payload.percentage}%`;
    const labelX = x + width + 8;
    const labelY = y + height / 2;

    return (
      <text
        x={labelX}
        y={labelY}
        fill={BRAND_DK}
        fontSize={10}
        fontWeight={700}
        textAnchor="start"
        dominantBaseline="middle"
      >
        {labelText}
      </text>
    );
  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: 10, border: `1px solid ${LIGHT_BORDER}`, overflow: "hidden" }}>
      <div style={{ backgroundColor: BRAND, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2.5, minWidth: 0, flex: 1 }}>
          <div style={{ width: 3, height: 15, borderRadius: 999, backgroundColor: "#479BD6", flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "white", lineHeight: 1.2, margin: 0 }}>
              {title}
            </p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", marginTop: 4, margin: 0 }}>
              {subtitle}
            </p>
          </div>
        </div>

        {filterOptions && filterValue && onFilterChange && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "5px 10px",
                borderRadius: 10,
                border: `1px solid ${LIGHT_BORDER}`,
                borderLeft: `5px solid ${BRAND}`,
                backgroundColor: "white",
                color: BRAND_DK,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {filterValue} <ChevronDown size={12} />
            </button>
            {filterOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                right: 0,
                zIndex: 50,
                minWidth: 140,
                backgroundColor: "white",
                borderRadius: 10,
                border: `1px solid ${LIGHT_BORDER}`,
                borderLeft: `5px solid ${BRAND}`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.14)",
                overflow: "hidden",
              }}>
                {filterOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      onFilterChange(opt);
                      setFilterOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      fontSize: 11,
                      fontWeight: opt === filterValue ? 700 : 500,
                      backgroundColor: opt === filterValue ? BRAND : "white",
                      color: opt === filterValue ? "white" : BRAND_DK,
                      border: `1px solid ${LIGHT_BORDER}`,
                      borderLeft: `5px solid ${BRAND}`,
                      cursor: "pointer",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Fixed-width label column */}
          <div style={{ width: 220, flexShrink: 0 }}>
            {chartData.map((item, idx) => (
              <div
                key={idx}
                style={{
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  paddingRight: 12,
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#374151",
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: idx < chartData.length - 1 ? 12 : 0,
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {item.area}
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 44)}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 120, bottom: 0, left: 0 }}
                barCategoryGap={12}
              >
                <XAxis type="number" hide domain={[0, axisMax]} />
                <YAxis dataKey="area" type="category" hide width={0} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(18, 43, 94, 0.05)" }} />
                <Bar
                  dataKey="count"
                  radius={[0, 4, 4, 0]}
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        hoveredIndex !== null
                          ? index === hoveredIndex
                            ? entry.isTop3
                              ? PRIMARY_COLOR
                              : LIGHT_COLOR
                            : entry.isTop3
                            ? PRIMARY_COLOR
                            : LIGHT_COLOR
                          : entry.isTop3
                          ? PRIMARY_COLOR
                          : LIGHT_COLOR
                      }
                      opacity={hoveredIndex !== null && index !== hoveredIndex ? 0.4 : 1}
                    />
                  ))}
                  <CustomLabel />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Accessibility aria-label */}
      <div style={{ display: "none" }} role="img" aria-label={`Top health interest areas: ${top3Areas}`} />
    </div>
  );
}
