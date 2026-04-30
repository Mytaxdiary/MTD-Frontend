type TypePillsProps = {
  types: string[];
  compact?: boolean;
};

export default function TypePills({ types, compact = false }: TypePillsProps) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {types.map((type) => (
        <span
          key={type}
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 7px",
            borderRadius: 10,
            background: type === "SE" ? "#F0F9FF" : "#F5F3FF",
            color: type === "SE" ? "#0C4A6E" : "#5B21B6",
            border: `1px solid ${type === "SE" ? "#BAE6FD" : "#DDD6FE"}`,
            whiteSpace: "nowrap",
          }}
        >
          {type === "SE"
            ? compact
              ? "Self-emp"
              : "Self-employment"
            : compact
              ? "Property"
              : "UK Property"}
        </span>
      ))}
    </div>
  );
}
