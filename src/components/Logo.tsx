import React from "react";
import { BusFront } from "lucide-react";

export function Logo({
  className = "",
  iconClassName = "",
  textClassName = "",
  showText = true,
}: {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {imgError ? (
        <div
          className={`w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-inner ${iconClassName}`}
        >
          <BusFront size={24} />
        </div>
      ) : (
        <img
          src="/logo.png"
          alt="مسارات للنقل"
          className={`w-10 h-10 object-contain ${iconClassName}`}
          onError={() => setImgError(true)}
        />
      )}
      {showText && (
        <span className={`text-xl font-bold tracking-tight ${textClassName}`}>
          مسارات للنقل
        </span>
      )}
    </div>
  );
}
