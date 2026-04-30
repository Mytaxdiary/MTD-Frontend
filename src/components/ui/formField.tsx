import B from "@/styles/theme";

type FormFieldProps = {
  label: string;
  error?: string;
  mb?: number;
  children: React.ReactNode;
};

export default function FormField({ label, error, mb = 18, children }: FormFieldProps) {
  return (
    <div style={{ marginBottom: mb }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: "block", marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {error && <div style={{ fontSize: 11, color: B.redText, marginTop: 4 }}>{error}</div>}
    </div>
  );
}
