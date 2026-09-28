export default function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-linear-to-b from-[#0a0f16] to-[#02090f] px-6 py-5 transition-colors hover:border-[#555]">
      <span className={`text-3xl font-semibold ${color}`}>{value}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">{label}</span>
      </div>
    </div>
  );
}
