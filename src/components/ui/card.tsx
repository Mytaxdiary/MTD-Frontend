import B from "@/styles/theme";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
      {children}
    </div>
  );
}

type CardHeaderProps = {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  titleSize?: number;
  padding?: string;
};

export function CardHeader({ title, sub, right, titleSize = 14, padding = "14px 20px" }: CardHeaderProps) {
  if (right) {
    return (
      <div style={{ padding, borderBottom: `1px solid ${B.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: titleSize, fontWeight: 700 }}>{title}</div>
        {right}
      </div>
    );
  }
  return (
    <div style={{ padding, borderBottom: `1px solid ${B.border}` }}>
      <div style={{ fontSize: titleSize, fontWeight: 700 }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: B.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
