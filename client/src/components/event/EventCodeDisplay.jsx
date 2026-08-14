/**
 * EventCodeDisplay Component
 * Prominently displays the 6-digit event join code with a copy-to-clipboard button.
 * Designed for high visibility so hosts can easily project/share it.
 */
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function EventCodeDisplay({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
          Audience Join Code
        </p>
        <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-indigo-400">
          {code || "------"}
        </div>
      </div>

      <button
        onClick={handleCopy}
        disabled={!code}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 font-medium text-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-slate-400" />
            <span>Copy Code</span>
          </>
        )}
      </button>
    </div>
  );
}
