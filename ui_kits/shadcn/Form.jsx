// Input + Label + Textarea + small form primitives.
function Label({ children, htmlFor, style }) {
  return <label htmlFor={htmlFor} style={{
    fontFamily:'Inter, sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '20px',
    color: 'rgb(250,250,250)', ...style,
  }}>{children}</label>;
}

function Input({ type = 'text', placeholder, value, onChange, style, invalid, ...rest }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        height: 36, padding: '4px 12px', width: '100%', boxSizing: 'border-box',
        borderRadius: 8, background:'rgba(255,255,255,0.05)',
        border: `1px solid ${invalid ? 'rgb(248,113,113)' : (focused ? 'rgb(5,122,85)' : 'rgb(75,85,99)')}`,
        boxShadow: focused ? '0 0 0 3px rgba(5,122,85,0.30)' : 'none',
        color: 'rgb(249,250,251)', fontFamily:'Inter, sans-serif', fontSize: 14,
        outline: 'none', ...style,
      }}
      {...rest}
    />
  );
}

function Textarea({ placeholder, value, onChange, rows = 3, style }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <textarea
      placeholder={placeholder} value={value} onChange={onChange} rows={rows}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        padding: '8px 12px', width: '100%', boxSizing: 'border-box', resize: 'vertical',
        borderRadius: 8, background:'rgba(255,255,255,0.05)',
        border: `1px solid ${focused ? 'rgb(5,122,85)' : 'rgb(75,85,99)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(5,122,85,0.30)' : 'none',
        color: 'rgb(249,250,251)', fontFamily:'Inter, sans-serif', fontSize: 14,
        outline: 'none', ...style,
      }}
    />
  );
}

function Field({ label, children, hint, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <Label>{label}</Label>}
      {children}
      {error ? <span style={{ fontSize: 12, color: 'rgb(248,113,113)', fontFamily:'Inter' }}>{error}</span>
       : hint ? <span style={{ fontSize: 12, color: 'rgb(163,163,163)', fontFamily:'Inter' }}>{hint}</span> : null}
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{ display:'inline-flex', alignItems:'center', gap:8, cursor:'pointer', color:'rgb(249,250,251)', fontFamily:'Inter', fontSize:14 }}>
      <span style={{
        width: 16, height: 16, borderRadius: 4,
        border: `1px solid ${checked ? 'rgb(5,122,85)' : 'rgb(75,85,99)'}`,
        background: checked ? 'rgb(5,122,85)' : 'transparent',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked && <span style={{
          width: 8, height: 4, borderLeft: '2px solid #fff', borderBottom: '2px solid #fff',
          transform: 'rotate(-45deg) translate(1px,-1px)'
        }} />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display:'none' }} />
      {label}
    </label>
  );
}

Object.assign(window, { Label, Input, Textarea, Field, Checkbox });
