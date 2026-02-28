export default function DepChips({ names }: { names: string }) {
  const deps = (names || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  if (deps.length === 0) return <span className="text-muted">0</span>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {deps.map((d) => (
        <span
          key={d}
          style={{
            padding: "2px 8px",
            borderRadius: 999,
            border: "1px solid #d0d7de",
            fontSize: 12,
            background: "#f6f8fa",
            whiteSpace: "nowrap",
          }}
          title={d}
        >
          {d}
        </span>
      ))}
    </div>
  );
}
