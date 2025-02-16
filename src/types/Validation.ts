export const iconMap = {
  success: "✔️",
  error: "❌",
  warning: "⚠️",
};

export type ValidationCardProps = {
  type: "success" | "error" | "warning";
  message: string;
};
