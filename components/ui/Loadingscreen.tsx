import { useEffect, useState } from "react";

const STATUS_MESSAGES = [
    "conectando ao servidor",
    "autenticando sessão",
    "sincronizando dados",
    "compilando módulos",
    "preparando ambiente",
    "preparando tudo pra você",
];

export default function LoadingScreen() {
    const [statusIndex, setStatusIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const statusTimer = setInterval(() => {
            setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
        }, 1800);
        return () => clearInterval(statusTimer);
    }, []);

    useEffect(() => {
        const progressTimer = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) return 0;
                const step = p < 70 ? Math.random() * 6 + 2 : Math.random() * 2 + 0.5;
                return Math.min(100, p + step);
            });
        }, 220);
        return () => clearInterval(progressTimer);
    }, []);

    return (
        <div className="ls-root">
            <style>{`
        .ls-root {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #02090f;
          color: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow: hidden;
          z-index: 9999;
        }

        .ls-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(circle at center, black 0%, transparent 75%);
          -webkit-mask-image: radial-gradient(circle at center, black 0%, transparent 75%);
        }

        .ls-glow {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%);
          animation: ls-breathe 4s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes ls-breathe {
          0%, 100% { transform: scale(0.92); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        .ls-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 36px;
        }

        .ls-mark {
          width: 96px;
          height: 96px;
          overflow: visible;
        }

        .ls-mark rect {
          fill: none;
          stroke: #ffffff;
          stroke-width: 1.4;
          stroke-linecap: round;
        }

        .ls-mark .layer-1 {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: ls-draw 1.4s cubic-bezier(0.65, 0, 0.35, 1) 0.1s forwards infinite;
          opacity: 0.35;
        }
        .ls-mark .layer-2 {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: ls-draw 1.4s cubic-bezier(0.65, 0, 0.35, 1) 0.35s forwards infinite;
          opacity: 0.65;
        }
        .ls-mark .layer-3 {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: ls-draw 1.4s cubic-bezier(0.65, 0, 0.35, 1) 0.6s forwards infinite;
          opacity: 1;
        }

        @keyframes ls-draw {
          0% { stroke-dashoffset: 220; }
          45%, 55% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -220; }
        }

        .ls-scanline {
          position: absolute;
          left: 4px;
          right: 4px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #ffffff, transparent);
          animation: ls-scan 2.1s ease-in-out infinite;
          opacity: 0.9;
        }

        @keyframes ls-scan {
          0% { top: 8px; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 88px; opacity: 0; }
        }

        .ls-wordmark {
          font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
          font-size: 13px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #ffffff;
          opacity: 0.9;
        }

        .ls-status {
          font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
          font-size: 12px;
          letter-spacing: 0.02em;
          color: #7a7a7a;
          height: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ls-status::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ffffff;
          animation: ls-pulse 1.2s ease-in-out infinite;
        }

        @keyframes ls-pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .ls-track {
          width: 220px;
          height: 1px;
          background: rgba(255,255,255,0.12);
          position: relative;
          overflow: hidden;
        }

        .ls-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: #ffffff;
          transition: width 0.25s ease-out;
        }

        .ls-percent {
          font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
          font-size: 11px;
          color: #4d4d4d;
          letter-spacing: 0.05em;
          font-variant-numeric: tabular-nums;
        }

        @media (prefers-reduced-motion: reduce) {
          .ls-mark .layer-1, .ls-mark .layer-2, .ls-mark .layer-3,
          .ls-scanline, .ls-glow, .ls-status::before {
            animation: none;
          }
        }
      `}</style>

           {/*  <div className="ls-grid" /> */}
            <div className="ls-glow" />

            <div className="ls-content">
                <svg className="ls-mark" viewBox="0 0 96 96">
                    <rect className="layer-1" x="10" y="16" width="76" height="18" rx="3" />
                    <rect className="layer-2" x="10" y="39" width="76" height="18" rx="3" />
                    <rect className="layer-3" x="10" y="62" width="76" height="18" rx="3" />
                    <foreignObject x="0" y="0" width="96" height="96">
                        <div style={{ position: "relative", width: "100%", height: "100%" }}>
                            <div className="ls-scanline" />
                        </div>
                    </foreignObject>
                </svg>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                    <div className="ls-wordmark">carregando</div>
                    <div className="ls-status">{STATUS_MESSAGES[statusIndex]}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div className="ls-track">
                        <div className="ls-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="ls-percent">{String(Math.round(progress)).padStart(2, "0")}%</div>
                </div>
            </div>
        </div>
    );
}