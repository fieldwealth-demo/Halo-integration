// FormulaEditor — the Excel-style custom-formula bar for the Custom tile builder.
// fx bar + autocomplete (fields & functions) + live validation + result preview
// + clickable field/function reference + plain-English → formula fallback.
// Exposes: FIELD_SCHEMA, FN_SCHEMA, evalFormula, formatResult, FormulaEditor,
//          suggestFormulaFromText  (used by the AI builder handoff)

const FE_BRAND = 'rgb(5,122,85)';
const FE_BRAND_SOFT = 'rgba(5,122,85,0.18)';
const FE_BRAND_TXT = 'rgb(110,231,183)';
const FE_BORDER = 'rgb(75,85,99)';
const FE_BORDER_SOFT = 'rgba(75,85,99,0.55)';
const FE_INK = 'rgb(249,250,251)';
const FE_MUTED = 'rgb(163,163,163)';
const FE_DANGER = 'rgb(248,113,113)';
const FE_MONO = '"Geist Mono", "JetBrains Mono", ui-monospace, monospace';

/* ------------------------------------------------------------------ schema */
/* Canonical wealth-management fields a formula can reference. `agg` is the
   book-wide aggregate used to compute a live preview value. */
const FIELD_SCHEMA = [
  { name:'MarketValue',     type:'currency', agg: 248_500_000, desc:'Total market value of holdings' },
  { name:'CostBasis',       type:'currency', agg: 198_200_000, desc:'Aggregate cost basis' },
  { name:'AUM',             type:'currency', agg: 312_400_000, desc:'Assets under management' },
  { name:'Fees',            type:'currency', agg:   2_810_000, desc:'Billed advisory fees (period)' },
  { name:'Revenue',         type:'currency', agg:   3_450_000, desc:'Total revenue (period)' },
  { name:'NetFlows',        type:'currency', agg:  14_200_000, desc:'Net deposits − withdrawals' },
  { name:'CashBalance',     type:'currency', agg:  18_700_000, desc:'Uninvested cash' },
  { name:'UnrealizedGain',  type:'currency', agg:  50_300_000, desc:'Market value − cost basis' },
  { name:'Clients',         type:'count',    agg:        1247, desc:'Number of client households' },
  { name:'Accounts',        type:'count',    agg:        2680, desc:'Number of accounts' },
  { name:'CurrentWeight',   type:'percent',  agg:       0.642, desc:'Current allocation weight' },
  { name:'TargetWeight',    type:'percent',  agg:       0.600, desc:'Policy target weight' },
];
const FIELD_BY_LOWER = {};
FIELD_SCHEMA.forEach(f => { FIELD_BY_LOWER[f.name.toLowerCase()] = f; });

const FN_SCHEMA = [
  { name:'SUM',     sig:'SUM(field)',         desc:'Total across the book' },
  { name:'AVG',     sig:'AVG(field)',         desc:'Average value' },
  { name:'COUNT',   sig:'COUNT(field)',       desc:'Number of records' },
  { name:'MIN',     sig:'MIN(a, b, …)',       desc:'Smallest value' },
  { name:'MAX',     sig:'MAX(a, b, …)',       desc:'Largest value' },
  { name:'ABS',     sig:'ABS(x)',             desc:'Absolute value' },
  { name:'ROUND',   sig:'ROUND(x, digits)',   desc:'Round to digits' },
  { name:'IF',      sig:'IF(test, a, b)',     desc:'Conditional value' },
];
const FN_NAMES = FN_SCHEMA.map(f => f.name);

/* ------------------------------------------------------------- evaluation */
/* Mock-but-real: substitutes book aggregates for fields, maps spreadsheet
   functions to JS, then evaluates. Returns {ok, value} or {ok:false, error}. */
function evalFormula(raw) {
  let expr = String(raw || '').trim().replace(/^=/, '').trim();
  if (!expr) return { ok:false, error:'Start with = and a field or number', empty:true };

  // Balanced parens check (friendlier than a raw syntax error)
  let depth = 0;
  for (const ch of expr) {
    if (ch === '(') depth++;
    else if (ch === ')') { depth--; if (depth < 0) return { ok:false, error:'Unmatched )' }; }
  }
  if (depth > 0) return { ok:false, error:'Missing )' };

  // Validate identifiers: every word must be a known field or function
  const ids = expr.match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];
  for (const id of ids) {
    const low = id.toLowerCase();
    if (!FIELD_BY_LOWER[low] && !FN_NAMES.includes(id.toUpperCase())) {
      return { ok:false, error:`Unknown name: ${id}` };
    }
  }

  // Normalize: uppercase function calls, canonical-case fields
  let js = expr.replace(/[A-Za-z_][A-Za-z0-9_]*/g, (m) => {
    if (FIELD_BY_LOWER[m.toLowerCase()]) return '__F_' + FIELD_BY_LOWER[m.toLowerCase()].name;
    return m.toUpperCase();
  });

  const scope = {
    SUM: (x) => x, AVG: (x) => x, COUNT: (x) => x,        // fields are pre-aggregated
    MIN: (...a) => Math.min(...a), MAX: (...a) => Math.max(...a),
    ABS: Math.abs, ROUND: (x, d = 0) => { const p = Math.pow(10, d); return Math.round(x * p) / p; },
    IF: (c, a, b) => (c ? a : b),
  };
  FIELD_SCHEMA.forEach(f => { scope['__F_' + f.name] = f.agg; });

  try {
    const keys = Object.keys(scope);
    const fn = new Function(...keys, `"use strict"; return (${js});`);
    const val = fn(...keys.map(k => scope[k]));
    if (typeof val !== 'number' || !isFinite(val)) return { ok:false, error:'Result is not a number' };
    return { ok:true, value: val };
  } catch (e) {
    return { ok:false, error:'Check the syntax — operator or parenthesis missing' };
  }
}

/* Format a numeric result per the chosen output format. */
function formatResult(value, format) {
  if (value == null || !isFinite(value)) return '—';
  if (format === 'percent') return (value * 100).toFixed(2) + '%';
  if (format === 'number')  return value.toLocaleString('en-US', { maximumFractionDigits: value < 100 ? 2 : 0 });
  // currency (default) — compact for large magnitudes
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return '$' + (value / 1_000_000).toFixed(2) + 'M';
  if (abs >= 1_000)     return '$' + (value / 1_000).toFixed(1) + 'K';
  return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

/* Plain-English → formula heuristics (for the "describe it" fallback + AI). */
function suggestFormulaFromText(text) {
  const t = String(text || '').toLowerCase();
  const has = (...w) => w.some(x => t.includes(x));
  if (has('effective fee', 'fee rate', 'fee yield'))         return { formula:'=Fees / AUM', format:'percent', title:'Effective Fee Rate' };
  if (has('average account', 'avg account', 'account size')) return { formula:'=MarketValue / Accounts', format:'currency', title:'Average Account Size' };
  if (has('per client', 'average client', 'aum per'))        return { formula:'=AUM / Clients', format:'currency', title:'AUM per Client' };
  if (has('unrealized', 'gain'))                             return { formula:'=MarketValue - CostBasis', format:'currency', title:'Unrealized Gain' };
  if (has('return', 'roi', 'gain %'))                        return { formula:'=(MarketValue - CostBasis) / CostBasis', format:'percent', title:'Portfolio Return' };
  if (has('cash %', 'cash drag', 'cash ratio', 'idle cash')) return { formula:'=CashBalance / AUM', format:'percent', title:'Cash Ratio' };
  if (has('drift'))                                          return { formula:'=ABS(CurrentWeight - TargetWeight)', format:'percent', title:'Allocation Drift' };
  if (has('revenue per'))                                    return { formula:'=Revenue / Clients', format:'currency', title:'Revenue per Client' };
  if (has('margin', 'profitab'))                             return { formula:'=Revenue / AUM', format:'percent', title:'Revenue Margin' };
  return { formula:'=Fees / AUM', format:'percent', title:'Custom Metric' };
}

/* ------------------------------------------------------------ component */
function FormulaEditor({ value, onChange, format, onFormatChange }) {
  const inputRef = React.useRef();
  const [caret, setCaret] = React.useState((value || '').length);
  const [showSug, setShowSug] = React.useState(false);
  const [activeSug, setActiveSug] = React.useState(0);
  const [refTab, setRefTab] = React.useState('fields'); // 'fields' | 'functions'
  const [askOpen, setAskOpen] = React.useState(false);
  const [ask, setAsk] = React.useState('');

  const result = React.useMemo(() => evalFormula(value), [value]);

  // current word fragment left of caret (for autocomplete)
  const frag = React.useMemo(() => {
    const left = (value || '').slice(0, caret);
    const m = left.match(/[A-Za-z_][A-Za-z0-9_]*$/);
    return m ? { text:m[0], start: caret - m[0].length } : { text:'', start: caret };
  }, [value, caret]);

  const suggestions = React.useMemo(() => {
    if (!frag.text) return [];
    const q = frag.text.toLowerCase();
    const fields = FIELD_SCHEMA
      .filter(f => f.name.toLowerCase().startsWith(q))
      .map(f => ({ kind:'field', name:f.name, hint:f.desc }));
    const fns = FN_SCHEMA
      .filter(f => f.name.toLowerCase().startsWith(q))
      .map(f => ({ kind:'fn', name:f.name, hint:f.sig }));
    return [...fns, ...fields].slice(0, 6);
  }, [frag]);

  React.useEffect(() => { setActiveSug(0); }, [frag.text]);

  const setVal = (next, nextCaret) => {
    onChange(next);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el && nextCaret != null) { el.focus(); el.setSelectionRange(nextCaret, nextCaret); setCaret(nextCaret); }
    });
  };

  const acceptSuggestion = (s) => {
    const before = (value || '').slice(0, frag.start);
    const after = (value || '').slice(caret);
    const insert = s.kind === 'fn' ? s.name + '(' : s.name;
    const next = before + insert + after;
    setVal(next, (before + insert).length);
    setShowSug(false);
  };

  // insert text at the caret (used by the reference chips)
  const insertAtCaret = (text) => {
    const el = inputRef.current;
    const pos = el ? el.selectionStart : (value || '').length;
    let v = value || '';
    if (!v.trim()) v = '=';
    let p = pos;
    if (v && pos === 0) p = v.length; // if nothing focused, append
    const before = v.slice(0, Math.max(p, v.startsWith('=') && p === 0 ? 1 : p));
    const after = v.slice(before.length);
    const needsSpace = /[A-Za-z0-9_)%]$/.test(before.trim()) && /^[A-Za-z_]/.test(text);
    const ins = (needsSpace ? ' ' : '') + text;
    const next = before + ins + after;
    setVal(next, (before + ins).length);
  };

  const onKeyDown = (e) => {
    if (showSug && suggestions.length) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSug(i => (i + 1) % suggestions.length); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveSug(i => (i - 1 + suggestions.length) % suggestions.length); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); acceptSuggestion(suggestions[activeSug]); return; }
      if (e.key === 'Escape')    { setShowSug(false); return; }
    }
  };

  const runAsk = () => {
    if (!ask.trim()) return;
    const s = suggestFormulaFromText(ask);
    onChange(s.formula);
    if (onFormatChange) onFormatChange(s.format);
    setAsk(''); setAskOpen(false);
    requestAnimationFrame(() => inputRef.current && inputRef.current.focus());
  };

  const valid = result.ok;
  const stateColor = result.empty ? FE_MUTED : valid ? FE_BRAND_TXT : FE_DANGER;
  const stateBorder = result.empty ? FE_BORDER : valid ? 'rgba(5,122,85,0.55)' : 'rgba(248,113,113,0.5)';

  return (
    <div style={{ position:'relative' }}>
      {/* Formula bar */}
      <div style={{
        display:'flex', alignItems:'stretch', borderRadius:10, overflow:'hidden',
        border:`1px solid ${stateBorder}`, background:'rgba(10,15,24,0.6)',
        transition:'border-color 140ms ease',
      }}>
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'center', width:34, flexShrink:0,
          background:'rgba(255,255,255,0.04)', borderRight:`1px solid ${FE_BORDER_SOFT}`,
          fontFamily:FE_MONO, fontStyle:'italic', fontWeight:600, fontSize:14, color:FE_BRAND_TXT,
        }}>fx</div>
        <input
          ref={inputRef}
          value={value}
          spellCheck={false}
          onChange={(e) => { onChange(e.target.value); setCaret(e.target.selectionStart); setShowSug(true); }}
          onKeyUp={(e) => setCaret(e.target.selectionStart)}
          onClick={(e) => setCaret(e.target.selectionStart)}
          onFocus={() => setShowSug(true)}
          onBlur={() => setTimeout(() => setShowSug(false), 140)}
          onKeyDown={onKeyDown}
          placeholder="=  Fees / AUM"
          style={{
            flex:1, minWidth:0, background:'transparent', border:'none', outline:'none',
            color:FE_INK, fontFamily:FE_MONO, fontSize:13.5, padding:'11px 12px', letterSpacing:'0.01em',
          }}
        />
        {/* format selector */}
        <div style={{ display:'flex', alignItems:'center', borderLeft:`1px solid ${FE_BORDER_SOFT}`, paddingRight:4 }}>
          {[['currency','$'],['percent','%'],['number','#']].map(([f, sym]) => (
            <button key={f} onMouseDown={(e)=>e.preventDefault()} onClick={() => onFormatChange && onFormatChange(f)} title={f}
              style={{
                width:30, height:'100%', border:'none', cursor:'pointer', fontFamily:FE_MONO, fontSize:13, fontWeight:600,
                background: format === f ? FE_BRAND_SOFT : 'transparent',
                color: format === f ? FE_BRAND_TXT : FE_MUTED,
              }}>{sym}</button>
          ))}
        </div>
      </div>

      {/* Autocomplete dropdown */}
      {showSug && suggestions.length > 0 && (
        <div style={{
          position:'absolute', left:34, right:96, top:46, zIndex:20,
          background:'rgb(20,28,42)', border:`1px solid ${FE_BORDER}`, borderRadius:10,
          boxShadow:'0 18px 40px -12px rgba(0,0,0,0.7)', overflow:'hidden', padding:4,
        }}>
          {suggestions.map((s, i) => (
            <button key={s.name} onMouseDown={(e) => { e.preventDefault(); acceptSuggestion(s); }}
              onMouseEnter={() => setActiveSug(i)}
              style={{
                display:'flex', alignItems:'center', gap:10, width:'100%', textAlign:'left',
                padding:'7px 9px', border:'none', borderRadius:7, cursor:'pointer',
                background: i === activeSug ? 'rgba(255,255,255,0.06)' : 'transparent',
              }}>
              <span style={{
                fontFamily:FE_MONO, fontSize:9.5, fontWeight:700, padding:'2px 5px', borderRadius:4,
                background: s.kind === 'fn' ? 'rgba(0,144,255,0.16)' : FE_BRAND_SOFT,
                color: s.kind === 'fn' ? 'rgb(125,196,255)' : FE_BRAND_TXT, letterSpacing:'0.04em',
              }}>{s.kind === 'fn' ? 'ƒx' : 'FIELD'}</span>
              <span style={{ fontFamily:FE_MONO, fontSize:12.5, color:FE_INK, flexShrink:0 }}>{s.name}</span>
              <span style={{ fontFamily:'Inter', fontSize:11, color:FE_MUTED, marginLeft:'auto', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.hint}</span>
            </button>
          ))}
        </div>
      )}

      {/* Validation / result line */}
      <div style={{
        display:'flex', alignItems:'center', gap:8, marginTop:8, minHeight:20,
        fontFamily:'Inter', fontSize:12, color: stateColor,
      }}>
        <i className={`fa-solid ${result.empty ? 'fa-circle-info' : valid ? 'fa-circle-check' : 'fa-triangle-exclamation'}`} style={{ fontSize:11 }} />
        {result.empty ? (
          <span style={{ color:FE_MUTED }}>Reference fields and functions — autocomplete as you type.</span>
        ) : valid ? (
          <span>Valid · result preview <strong style={{ color:FE_INK, fontFamily:FE_MONO, fontWeight:600 }}>{formatResult(result.value, format)}</strong></span>
        ) : (
          <span>{result.error}</span>
        )}
        <button onClick={() => setAskOpen(o => !o)} style={{
          marginLeft:'auto', display:'inline-flex', alignItems:'center', gap:6, background:'transparent', border:'none',
          color:FE_BRAND_TXT, cursor:'pointer', fontFamily:'Inter', fontSize:12, fontWeight:500,
        }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize:11 }} /> Describe it instead
        </button>
      </div>

      {/* Plain-English → formula */}
      {askOpen && (
        <div style={{
          marginTop:10, display:'flex', alignItems:'center', gap:8, padding:'8px 8px 8px 12px',
          background:FE_BRAND_SOFT, border:`1px solid rgba(5,122,85,0.4)`, borderRadius:10,
        }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color:FE_BRAND_TXT, fontSize:13, flexShrink:0 }} />
          <input
            value={ask} autoFocus
            onChange={(e) => setAsk(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runAsk(); if (e.key === 'Escape') setAskOpen(false); }}
            placeholder="e.g. effective fee rate · average account size · cash drag"
            style={{ flex:1, minWidth:0, background:'transparent', border:'none', outline:'none', color:FE_INK, fontFamily:'Inter', fontSize:13 }}
          />
          <button onClick={runAsk} style={{
            height:30, padding:'0 12px', borderRadius:8, border:'none', background:FE_BRAND, color:'#fff',
            fontFamily:'Inter', fontSize:12, fontWeight:600, cursor:'pointer',
          }}>Write it</button>
        </div>
      )}

      {/* Field / function reference */}
      <div style={{ marginTop:12, border:`1px solid ${FE_BORDER_SOFT}`, borderRadius:10, overflow:'hidden' }}>
        <div style={{ display:'flex', borderBottom:`1px solid ${FE_BORDER_SOFT}` }}>
          {[['fields','Fields'],['functions','Functions']].map(([k, lbl]) => (
            <button key={k} onClick={() => setRefTab(k)} style={{
              flex:1, padding:'8px 10px', border:'none', cursor:'pointer', fontFamily:'Inter', fontSize:12, fontWeight:600,
              background: refTab === k ? 'rgba(255,255,255,0.04)' : 'transparent',
              color: refTab === k ? FE_INK : FE_MUTED,
              borderBottom: refTab === k ? `2px solid ${FE_BRAND}` : '2px solid transparent',
            }}>{lbl}</button>
          ))}
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:10, maxHeight:118, overflowY:'auto' }}>
          {refTab === 'fields'
            ? FIELD_SCHEMA.map(f => (
              <button key={f.name} onClick={() => insertAtCaret(f.name)} title={f.desc} style={refChip}>
                <span style={{ fontFamily:FE_MONO, color:FE_INK }}>{f.name}</span>
                <span style={{ fontFamily:'Inter', fontSize:9.5, color:FE_MUTED, marginLeft:6, textTransform:'uppercase', letterSpacing:'0.04em' }}>{f.type === 'count' ? '#' : f.type === 'percent' ? '%' : '$'}</span>
              </button>
            ))
            : FN_SCHEMA.map(f => (
              <button key={f.name} onClick={() => insertAtCaret(f.name + '(')} title={f.desc} style={refChip}>
                <span style={{ fontFamily:FE_MONO, color:'rgb(125,196,255)' }}>{f.sig}</span>
              </button>
            ))}
          {refTab === 'fields' && (
            <div style={{ display:'flex', gap:6, width:'100%', marginTop:2 }}>
              {['+','−','×','÷','( )'].map((op, i) => (
                <button key={op} onClick={() => insertAtCaret([' + ',' - ',' * ',' / ','()'][i])} style={{ ...refChip, minWidth:34, justifyContent:'center' }}>
                  <span style={{ fontFamily:FE_MONO, color:FE_MUTED }}>{op}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const refChip = {
  display:'inline-flex', alignItems:'center', padding:'5px 9px', borderRadius:7,
  background:'rgba(255,255,255,0.04)', border:`1px solid ${FE_BORDER_SOFT}`, cursor:'pointer',
  fontSize:12, lineHeight:1,
};

Object.assign(window, { FIELD_SCHEMA, FN_SCHEMA, evalFormula, formatResult, suggestFormulaFromText, FormulaEditor });
