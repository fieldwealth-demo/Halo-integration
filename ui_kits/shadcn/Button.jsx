// Button — shadcn-style, tuned to the Field Shadcn Figma source.
// Props: variant ('primary'|'secondary'|'destructive'|'outline'|'ghost'|'link'),
//         size ('sm'|'md'|'lg'|'icon'), icon (lucide name), loading, children
function Button({
  variant = 'primary', size = 'md', icon, iconRight, loading,
  children, onClick, disabled, style, className = '',
}) {
  const base = {
    position: 'relative',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 6,
    fontFamily:'Inter, sans-serif',
    fontWeight: 500,
    borderRadius: 10,
    border: '1px solid transparent',
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
    opacity: loading || disabled ? 0.6 : 1,
    transition: 'background .15s ease-out, border-color .15s ease-out, opacity .15s ease-out',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.10)',
    whiteSpace: 'nowrap',
  };
  const sizes = {
    sm:   { height: 32, padding: '0 12px', fontSize: 13 },
    md:   { height: 36, padding: '0 16px', fontSize: 14 },
    lg:   { height: 40, padding: '0 20px', fontSize: 14 },
    icon: { height: 36, width: 36, padding: 0, fontSize: 14 },
  }[size];
  const variants = {
    primary: { background: 'rgb(5,122,85)', color: 'rgb(249,250,251)' },
    secondary: { background: 'rgba(255,255,255,0.05)', color: 'rgb(249,250,251)', borderColor: 'rgb(75,85,99)' },
    destructive: { background: 'rgb(220,38,38)', color: '#fff' },
    outline: { background: 'transparent', color: 'rgb(249,250,251)', borderColor: 'rgb(75,85,99)' },
    ghost:   { background: 'transparent', color: 'rgb(249,250,251)', borderColor: 'transparent', boxShadow: 'none' },
    link:    { background: 'transparent', color: 'rgb(5,122,85)', borderColor: 'transparent', boxShadow: 'none', textDecoration: 'underline', textUnderlineOffset: '2px' },
  }[variant];

  const ref = React.useRef();

  return (
    <button
      ref={ref}
      onClick={disabled || loading ? undefined : onClick}
      className={className}
      style={{ ...base, ...sizes, ...variants, ...style }}
    >
      {loading && <i className="fa-solid fa-spinner fa-spin" style={{ width:14, height:14, animation:'spin 1s linear infinite' }} />}
      {!loading && icon && <i className={faCls(icon)} style={{ width:16, height:16 }} />}
      {children}
      {!loading && iconRight && <i className={faCls(iconRight)} style={{ width:16, height:16 }} />}
    </button>
  );
}

Object.assign(window, { Button });
