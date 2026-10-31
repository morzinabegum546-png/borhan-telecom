export default function OpLogo({ op, size = 40 }) {
  return <span className="inline-grid place-items-center rounded-full bg-white shadow-sm shrink-0 ring-1 ring-black/5" style={{ width: size, height: size }}>
    {op && <img src={op.logo} alt={op.name} loading="lazy" className="object-contain" style={{ width: size * 0.66, height: size * 0.66 }} />}</span>
}
