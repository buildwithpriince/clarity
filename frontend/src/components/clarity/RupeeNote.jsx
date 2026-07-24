export default function RupeeNote() {
  return (
    <svg
      className="floating-note"
      width="280"
      height="140"
      viewBox="0 0 280 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-testid="rupee-note-svg"
    >
      <defs>
        <pattern id="grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.3" fill="rgba(47,143,91,0.35)" />
        </pattern>
      </defs>
      <rect x="1" y="1" width="278" height="138" rx="6" stroke="#2F8F5B" strokeWidth="1.2" fill="url(#grain)" />
      <rect x="10" y="10" width="260" height="120" rx="4" stroke="rgba(47,143,91,0.35)" strokeWidth="0.6" fill="none" />

      {/* Denomination */}
      <text x="26" y="52" fontFamily="Fraunces, serif" fontSize="42" fontStyle="italic" fill="#2F8F5B" fontWeight="500">₹500</text>
      <text x="26" y="72" fontFamily="IBM Plex Mono, monospace" fontSize="8" letterSpacing="2" fill="rgba(247,243,233,0.7)">FIVE HUNDRED RUPEES</text>

      {/* Watermark seal */}
      <circle cx="220" cy="70" r="30" stroke="rgba(47,143,91,0.5)" strokeWidth="0.8" fill="none" />
      <circle cx="220" cy="70" r="20" stroke="rgba(47,143,91,0.3)" strokeWidth="0.6" fill="none" />
      <text x="220" y="74" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontSize="18" fill="#2F8F5B">c.</text>

      {/* Bottom line */}
      <line x1="26" y1="98" x2="180" y2="98" stroke="rgba(47,143,91,0.4)" strokeWidth="0.6" />
      <text x="26" y="118" fontFamily="IBM Plex Mono, monospace" fontSize="7" letterSpacing="2" fill="rgba(247,243,233,0.5)">CLARITY · TREASURY NOTE · 00.500</text>
    </svg>
  );
}
