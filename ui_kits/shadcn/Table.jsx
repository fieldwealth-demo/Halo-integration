// Table + Table Row primitives
function Table({ columns, rows }) {
  return (
    <div style={{ border: '1px solid rgb(75,85,99)', borderRadius: 12, overflow: 'hidden', background:'rgba(255,255,255,0.02)' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: columns.map(c => c.w || '1fr').join(' '),
        fontFamily: 'Inter', fontSize: 12, color: 'rgb(163,163,163)', fontWeight: 500,
        padding: '10px 16px', borderBottom: '1px solid rgb(75,85,99)', background: 'rgba(255,255,255,0.02)',
      }}>
        {columns.map(c => <div key={c.key} style={{ textAlign: c.align || 'left' }}>{c.title}</div>)}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: columns.map(c => c.w || '1fr').join(' '),
          fontFamily: 'Inter', fontSize: 13, color: 'rgb(249,250,251)',
          padding: '12px 16px', borderBottom: i < rows.length - 1 ? '1px solid rgba(75,85,99,0.5)' : 'none',
          alignItems: 'center',
        }}>
          {columns.map(c => (
            <div key={c.key} style={{ textAlign: c.align || 'left' }}>
              {c.render ? c.render(r) : r[c.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Table });
