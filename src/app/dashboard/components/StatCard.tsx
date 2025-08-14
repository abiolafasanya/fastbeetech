// components/admin/StatCard.tsx
export default function StatCard({
  title,
  value,
  caption,
}: {
  title: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {caption && (
        <div className="text-xs text-muted-foreground mt-1">{caption}</div>
      )}
    </div>
  );
}
