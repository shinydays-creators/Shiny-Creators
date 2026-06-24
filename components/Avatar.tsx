interface Props {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZES = {
  sm: { outer: "w-9 h-9", text: "text-sm font-bold" },
  md: { outer: "w-14 h-14", text: "text-xl font-bold" },
  lg: { outer: "w-20 h-20", text: "text-3xl font-black" },
};

export default function Avatar({ name, color, size = "md" }: Props) {
  const { outer, text } = SIZES[size];
  return (
    <div
      className={`${outer} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}
      style={{ backgroundColor: color }}
    >
      <span className={`font-poppins ${text} text-white`} style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>
        {getInitials(name)}
      </span>
    </div>
  );
}
