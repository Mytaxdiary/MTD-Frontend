import B from "@/styles/theme";

export const authInputStyle = (hasError?: string): React.CSSProperties => ({
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: `1px solid ${hasError ? "#FECACA" : B.border}`,
  fontSize: 13,
  outline: "none",
  background: B.white,
  color: B.text,
  boxSizing: "border-box",
});
