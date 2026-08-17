interface Props {
  headline: string
  subtext: string
}

/**
 * Right-hand visual panel for the auth screens.
 *
 * This is a self-contained abstract SVG illustration (floating request/response
 * cards + connecting nodes) so the page looks finished today. To swap in a real
 * screenshot or custom artwork later, just replace the <svg>...</svg> block
 * below with an <img src="/your-image.png" .../> or <Image /> — the
 * surrounding gradient panel, headline, and layout can stay exactly as is.
 */
export default function AuthVisual({ headline, subtext }: Props) {
  return (
    <div className="auth-visual">
      <div className="auth-visual-glow auth-visual-glow-1" />
      <div className="auth-visual-glow auth-visual-glow-2" />

      <svg
        viewBox="0 0 480 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="auth-visual-svg"
      >
        <defs>
          <linearGradient id="cardGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#e879f9" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* connecting lines */}
        <path d="M110 210 C170 210 170 120 235 120" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 6" />
        <path d="M110 210 C170 210 170 300 235 300" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 6" />
        <path d="M345 120 C400 120 400 210 345 210" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 6" />
        <path d="M345 300 C400 300 400 210 345 210" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 6" />

        {/* center node */}
        <circle cx="240" cy="210" r="34" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <circle cx="240" cy="210" r="8" fill="#e9d5ff" />

        {/* GET request card */}
        <g transform="translate(20, 180)">
          <rect width="120" height="60" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
          <rect x="14" y="16" width="34" height="16" rx="6" fill="#34d399" fillOpacity="0.9" />
          <text x="20" y="27" fontSize="10" fontWeight="700" fill="#052e1f" fontFamily="monospace">GET</text>
          <rect x="14" y="40" width="92" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
        </g>

        {/* POST response card */}
        <g transform="translate(235, 60)">
          <rect width="120" height="60" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
          <rect x="14" y="16" width="40" height="16" rx="6" fill="#60a5fa" fillOpacity="0.9" />
          <text x="20" y="27" fontSize="10" fontWeight="700" fill="#0c2340" fontFamily="monospace">POST</text>
          <rect x="14" y="40" width="92" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
        </g>

        {/* status card */}
        <g transform="translate(20, 20)">
          <rect width="130" height="56" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
          <circle cx="24" cy="20" r="5" fill="#34d399" />
          <text x="38" y="24" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="monospace">200 OK</text>
          <rect x="14" y="34" width="100" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
        </g>

        {/* DELETE card */}
        <g transform="translate(235, 260)">
          <rect width="120" height="60" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
          <rect x="14" y="16" width="52" height="16" rx="6" fill="#f87171" fillOpacity="0.9" />
          <text x="20" y="27" fontSize="10" fontWeight="700" fill="#3a0a0a" fontFamily="monospace">DELETE</text>
          <rect x="14" y="40" width="92" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
        </g>

        {/* small floating dots */}
        <circle cx="60" cy="130" r="3" fill="#e9d5ff" fillOpacity="0.6" />
        <circle cx="420" cy="150" r="3" fill="#e9d5ff" fillOpacity="0.6" />
        <circle cx="400" cy="340" r="3" fill="#e9d5ff" fillOpacity="0.6" />
      </svg>

      <div className="auth-visual-text">
        <h3>{headline}</h3>
        <p>{subtext}</p>
      </div>
    </div>
  )
}
