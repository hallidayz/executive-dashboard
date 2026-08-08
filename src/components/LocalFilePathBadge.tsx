import React, { useState } from "react";
import { Folder, Copy, Check, ExternalLink } from "lucide-react";

interface LocalFilePathBadgeProps {
  path: string;
}

export const LocalFilePathBadge: React.FC<LocalFilePathBadgeProps> = ({
  path,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const cleanPath = path.replace(/^file:\/\/\//, "");

  return (
    <div className="relative group flex items-center gap-1.5 shrink-0">
      {/* Open Folder Link */}
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          // If in web browser, prevent standard navigation and copy path
          if (!path.startsWith("http")) {
            e.preventDefault();
            handleCopyPath(e as any);
          }
        }}
        className="px-2.5 py-1 rounded-lg brand-bg-soft border brand-border brand-text text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm"
        title={`Full Path: ${cleanPath} (Click to copy)`}
      >
        <Folder className="w-3.5 h-3.5 brand-text" />
        <span>Open Folder</span>
      </a>

      {/* Copy Path Button */}
      <button
        onClick={handleCopyPath}
        className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-[10px] transition-all"
        title="Copy full local path"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Hover Full Path Tooltip */}
      <div className="absolute right-0 top-7 z-50 hidden group-hover:block p-2 rounded-lg bg-obsidian-950 border border-slate-700 text-[10px] font-mono brand-text whitespace-nowrap shadow-xl max-w-md truncate">
        {cleanPath}
      </div>
    </div>
  );
};
