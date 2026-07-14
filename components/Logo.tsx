interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

/**
 * Logo
 *
 * Tamakken AI mark: an 8-point compass/flower emblem on a rounded emerald
 * square, echoing the brand reference. Original SVG (no external asset
 * exists to import), reused everywhere the brand appears.
 */
export default function Logo({ className = "", showWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <rect width="34" height="34" rx="9" fill="#0D5C4F" />
        <g transform="translate(17 17)">
          <path
            d="M0 -9 C1.6 -4 1.6 -1.6 6.4 -6.4 C1.6 -1.6 4 0 9 0 C4 0 1.6 1.6 6.4 6.4 C1.6 1.6 1.6 4 0 9 C-1.6 4 -1.6 1.6 -6.4 6.4 C-1.6 1.6 -4 0 -9 0 C-4 0 -1.6 -1.6 -6.4 -6.4 C-1.6 -1.6 -1.6 -4 0 -9 Z"
            fill="#F3EDE0"
          />
          <circle r="2.1" fill="#0D5C4F" />
        </g>
      </svg>
      {showWordmark ? (
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-wide text-brand-700">
            TAMAKKEN AI
          </p>
          <p className="text-[11px] font-medium text-slate-500">
            AI Interview Coach
          </p>
        </div>
      ) : null}
    </div>
  );
}
