// Card primitives — shadcn pattern: Card > CardHeader (title/desc) > CardContent > CardFooter
// Glassmorphic surface — translucent white + backdrop blur lets the page
// gradient bloom through every tile. No opaque fill.
function Card({ children, style, padding = 24, className = '' }) {
  return (
    <div className={'glass ' + className} style={{
      borderRadius: 14,
      padding,
      color: 'rgb(249,250,251)',
      display: 'flex', flexDirection: 'column', gap: 16,
      ...style,
    }}>{children}</div>
  );
}

function CardHeader({ title, description, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {title && <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:24, lineHeight: 1 }}>{title}</div>}
        {description && <div style={{ fontFamily:'Inter', fontSize:14, color:'rgb(163,163,163)', lineHeight: 1.4 }}>{description}</div>}
      </div>
      {action}
    </div>
  );
}

function StatCard({ title, value, delta, icon }) {
  const ref = React.useRef();
  React.useEffect(() => { }, [icon]);
  return (
    <Card style={{ gap: 8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:'Inter', fontSize: 14, color:'rgb(163,163,163)' }}>{title}</div>
        {icon && <i className={faCls(icon)} style={{ width:16, height:16, color:'rgb(163,163,163)' }} />}
      </div>
      <div style={{ fontFamily:'Inter', fontSize:30, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric:'tabular-nums' }}>
        {value}
      </div>
      {delta && (
        <div style={{
          fontFamily:'Inter', fontSize:12,
          color: delta.startsWith('-') ? 'rgb(248,113,113)' : 'rgb(134,239,172)',
        }}>
          {delta.startsWith('-') ? '▼ ' : '▲ '}{delta.replace(/^-/, '')}
        </div>
      )}
    </Card>
  );
}

function Badge({ children, variant = 'default' }) {
  const v = {
    default: { background:'rgb(249,250,251)', color:'rgb(10,10,10)', border: '1px solid transparent' },
    secondary: { background:'rgba(255,255,255,0.08)', color:'rgb(249,250,251)', border: '1px solid rgb(75,85,99)' },
    success: { background:'rgba(5,122,85,0.18)', color:'rgb(134,239,172)', border: '1px solid rgba(5,122,85,0.35)' },
    info:    { background:'rgba(0,144,255,0.15)', color:'rgb(94,177,239)', border: '1px solid rgba(0,144,255,0.35)' },
    warning: { background:'rgba(234,179,8,0.18)', color:'rgb(234,179,8)', border: '1px solid rgba(234,179,8,0.35)' },
    danger:  { background:'rgba(220,38,38,0.18)', color:'rgb(248,113,113)', border: '1px solid rgba(248,113,113,0.35)' },
    outline: { background:'transparent', color:'rgb(249,250,251)', border: '1px solid rgb(75,85,99)' },
  }[variant];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6, height: 22, padding: '0 10px',
      borderRadius: 9999, fontFamily:'Inter', fontWeight:500, fontSize:12, ...v
    }}>{children}</span>
  );
}

Object.assign(window, { Card, CardHeader, StatCard, Badge });
