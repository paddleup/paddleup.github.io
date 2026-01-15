import React from "react";

interface DetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ icon, label, value, className }) => (
  <div className={`flex items-center gap-3 p-3 bg-surface-alt/50 rounded-xl ${className || ""}`}>
    {icon}
    <div className="text-left">
      <div className="text-xs text-text-muted uppercase">{label}</div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  </div>
);

export default DetailCard;
