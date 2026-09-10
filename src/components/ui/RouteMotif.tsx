/**
 * Abstract origin -> destinations line motif (not a literal map) used in the
 * hero and markets sections to visualize "Indonesia to global buyers"
 * without implying verified trade lanes to specific countries.
 */
export function RouteMotif({ className }: { className?: string }) {
  const destinations = [
    { x: 420, y: 30 },
    { x: 460, y: 90 },
    { x: 440, y: 150 },
    { x: 470, y: 210 },
    { x: 430, y: 270 },
  ];

  return (
    <svg
      viewBox="0 0 500 300"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      {destinations.map((d, i) => (
        <path
          key={i}
          d={`M60 150 C 200 ${150 + (d.y - 150) * 0.3}, 300 ${d.y}, ${d.x} ${d.y}`}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth="1.5"
          strokeDasharray="2 6"
          strokeLinecap="round"
        />
      ))}
      {destinations.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="4" fill="currentColor" fillOpacity={0.6} />
      ))}
      <circle cx="60" cy="150" r="9" fill="currentColor" />
      <circle cx="60" cy="150" r="16" stroke="currentColor" strokeWidth="1.5" strokeOpacity={0.5} />
    </svg>
  );
}
