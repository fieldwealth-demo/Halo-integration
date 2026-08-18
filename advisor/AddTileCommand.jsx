// AddTileCommand — ⌘K command palette + LLM tile builder.
// Lives on top of the dashboard. Posts a 'tile:add' event when a tile is created.

const TC_BRAND = 'rgb(5,122,85)';
const TC_BRAND_SOFT = 'rgba(5,122,85,0.18)';
const TC_BORDER = 'rgb(75,85,99)';
const TC_BORDER_SOFT = 'rgba(75,85,99,0.5)';
const TC_INK = 'rgb(249,250,251)';
const TC_MUTED = 'rgb(163,163,163)';

const menuItem = {
  display:'flex', alignItems:'center', gap:10, width:'100%', textAlign:'left',
  padding:'8px 10px', border:'none', borderRadius:7, cursor:'pointer',
  background:'transparent', color:TC_INK, fontFamily:'Inter', fontSize:13, fontWeight:500,
};

const TC_EXAMPLE_PROMPTS = [
  { icon:'arrow-trend-up',     prompt:"Show me clients whose portfolios drifted >5% from target this month" },
  { icon:'bullseye',           prompt:"Pipeline of prospects by stage with expected close date" },
  { icon:'envelope',           prompt:"Recent client emails I haven't replied to" },
  { icon:'percent',            prompt:"Tax-loss harvesting opportunities across taxable accounts" },
  { icon:'calendar',           prompt:"Clients with birthdays in the next 30 days" },
  { icon:'briefcase',          prompt:"My biggest position changes this week, top 10" },
];

/* Heuristic mock LLM: pattern-matches a prompt to a synthesized tile spec. */
function tcSynthesizeTile(prompt) {
  const p = prompt.toLowerCase();
  const pickIcon = () => {
    if (/(drift|rebalanc)/.test(p)) return 'triangle-exclamation';
    if (/(pipeline|prospect|lead)/.test(p)) return 'bullseye';
    if (/(email|inbox|message)/.test(p)) return 'envelope';
    if (/(tax|harvest)/.test(p)) return 'percent';
    if (/(birthday|anniversary|milestone)/.test(p)) return 'calendar';
    if (/(holding|position|stock|equity)/.test(p)) return 'briefcase';
    if (/(cash|flow|deposit)/.test(p)) return 'arrow-trend-up';
    if (/(rmd|distribution)/.test(p)) return 'calendar';
    if (/(meeting|calendar)/.test(p)) return 'calendar';
    if (/(task|todo|follow)/.test(p)) return 'square-check';
    if (/(market|news)/.test(p)) return 'arrow-trend-up';
    return 'sparkles';
  };
  const pickKind = () => {
    if (/(chart|trend|over time|monthly|weekly|history)/.test(p)) return 'chart';
    if (/(stat|number|total|count|how many|kpi)/.test(p)) return 'stat';
    return 'list';
  };
  const titleFromPrompt = (s) => {
    const cleaned = s.replace(/^(show me|build me|add (a|the)?|create (a|the)?|i want|can you|please|give me)\s+/i, '');
    const t = cleaned.replace(/\?+$/,'').trim();
    if (!t) return 'Custom Tile';
    return t.charAt(0).toUpperCase() + t.slice(1, 60) + (t.length > 60 ? '…' : '');
  };
  const kind = pickKind();
  const icon = pickIcon();
  const title = titleFromPrompt(prompt);
  // Generate plausible mock data per kind
  const data = (() => {
    if (kind === 'stat') {
      return {
        primary: { label:'Total', value: ['$2.4M','42','$845K','18.2%','7'][Math.floor(Math.random()*5)] },
        delta: ['+12% vs last week','+3 this month','+$120K MTD','-1.2% WoW','+5 new'][Math.floor(Math.random()*5)],
        rows: [
          { l:'This week',  v:'7' },
          { l:'This month', v:'24' },
          { l:'YTD',        v:'186' },
        ],
      };
    }
    if (kind === 'chart') {
      const pts = Array.from({length:8}, () => 30 + Math.random()*70);
      return { points: pts, axisLabel: 'Last 8 weeks' };
    }
    // list
    const names = ['Maria Workman','David Young','Zaire Herwitz','Ryan Korsgaard','Mira Aminoff','Chance Curtis','Alfonso Mango','John Smith'];
    return {
      rows: names.slice(0, 5).map((n, i) => ({
        title: n,
        meta: ['Drift +6.2%','New email · 2h ago','RMD due Dec 12','Tax-loss $14K','Pipeline · Proposal'][i % 5],
        value: ['$2.1M','$1.4M','$3.2M','$890K','$2.7M'][i % 5],
      })),
    };
  })();
  return { id: 'ai-' + Date.now(), prompt, title, icon, kind, data, size: kind === 'list' ? 'col-6' : 'col-4' };
}

/* Render a generated tile inline in the grid */
function AddedTile({ tile, onRemove, onEdit }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef();
  React.useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const menuNode = (
    <div ref={menuRef} style={{ position:'relative' }}>
      <button onClick={() => setMenuOpen(o => !o)} title="More" style={{
        width:24, height:24, borderRadius:6, background: menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent', border:'none',
        color:TC_MUTED, cursor:'pointer',
      }}>
        <i className="fa-solid fa-ellipsis" style={{ fontSize:14 }} />
      </button>
      {menuOpen && (
        <div style={{
          position:'absolute', top:28, right:0, zIndex:30, minWidth:150, padding:5,
          background:'rgb(20,28,42)', border:`1px solid ${TC_BORDER}`, borderRadius:10,
          boxShadow:'0 18px 40px -12px rgba(0,0,0,0.7)',
        }}>
          <button onClick={() => { setMenuOpen(false); onEdit && onEdit(tile); }} style={menuItem}>
            <i className="fa-solid fa-pen-to-square" style={{ fontSize:12, width:16, color:TC_MUTED }} /> Edit tile
          </button>
          <button onClick={() => { setMenuOpen(false); onRemove && onRemove(); }} style={menuItem}>
            <i className="fa-solid fa-trash-can" style={{ fontSize:12, width:16, color:TC_MUTED }} /> Remove
          </button>
        </div>
      )}
    </div>
  );

  // Preferred path: render with the SAME component the builder previews, so
  // the placed tile is pixel-identical to what was configured.
  if (tile._state && window.TBPreview) {
    const Preview = window.TBPreview;
    const editLink = (
      <span style={{ display:'inline-flex', alignItems:'center', gap:4, color:TC_BRAND, cursor:'pointer' }} onClick={() => onEdit && onEdit(tile)}>
        Edit <i className="fa-solid fa-chevron-right" style={{ fontSize:10 }} />
      </span>
    );
    return (
      <div data-screen-label={`Custom Tile · ${tile.title}`} style={{ height:'100%', minHeight:'var(--tile-min-height, 440px)', position:'relative' }}>
        <Preview s={tile._state} live={true} menu={menuNode} footerSlot={editLink} />
      </div>
    );
  }

  return (
    <div data-screen-label={`AI Tile · ${tile.title}`} style={{
      background:'rgba(255,255,255,0.05)', border:`1px solid ${TC_BORDER}`,
      borderRadius:14, padding:0, color:TC_INK, display:'flex', flexDirection:'column',
      height:'100%', minHeight:'var(--tile-min-height, 440px)', overflow:'hidden',
      position:'relative',
    }}>
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:3,
        background:`linear-gradient(90deg, ${TC_BRAND} 0%, rgba(94,214,164,0.6) 100%)`,
      }} />
      <div style={{ display:'flex', alignItems:'center', padding:'14px 16px 10px', gap:10 }}>
        <div style={{
          width:28, height:28, borderRadius:7, background:TC_BRAND_SOFT,
          border:`1px solid rgba(5,122,85,0.4)`,
          display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}>
          <i className={`fa-solid fa-${tile.icon}`} style={{ color:TC_BRAND, fontSize:12 }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'Inter', fontWeight:600, fontSize:14, color:TC_INK, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {tile.title}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
            <span style={{
              fontFamily:'Inter', fontSize:9.5, fontWeight:700, padding:'1px 6px', borderRadius:9999,
              background:TC_BRAND_SOFT, color:'rgb(134,239,172)', letterSpacing:'0.04em',
            }}>AI · NEW</span>
            <span style={{ fontFamily:'Inter', fontSize:10.5, color:TC_MUTED }}>just now</span>
          </div>
        </div>
        <div ref={menuRef} style={{ position:'relative' }}>
          <button onClick={() => setMenuOpen(o => !o)} title="More" style={{
            width:24, height:24, borderRadius:6, background: menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent', border:'none',
            color:TC_MUTED, cursor:'pointer',
          }}>
            <i className="fa-solid fa-ellipsis" style={{ fontSize:14 }} />
          </button>
          {menuOpen && (
            <div style={{
              position:'absolute', top:28, right:0, zIndex:30, minWidth:150, padding:5,
              background:'rgb(20,28,42)', border:`1px solid ${TC_BORDER}`, borderRadius:10,
              boxShadow:'0 18px 40px -12px rgba(0,0,0,0.7)',
            }}>
              <button onClick={() => { setMenuOpen(false); onEdit && onEdit(tile); }} style={menuItem}>
                <i className="fa-solid fa-pen-to-square" style={{ fontSize:12, width:16, color:TC_MUTED }} /> Edit tile
              </button>
              <button onClick={() => { setMenuOpen(false); onRemove && onRemove(); }} style={menuItem}>
                <i className="fa-solid fa-trash-can" style={{ fontSize:12, width:16, color:TC_MUTED }} /> Remove
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ flex:1, padding:'4px 16px 12px', minHeight:0, overflow:'auto' }}>
        {tile.kind === 'stat' && <AddedStat data={tile.data} />}
        {tile.kind === 'chart' && <AddedChart data={tile.data} />}
        {tile.kind === 'list' && <AddedList data={tile.data} />}
      </div>
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'10px 16px', borderTop:`1px solid ${TC_BORDER_SOFT}`,
        fontFamily:'Inter', fontSize:11.5, color:TC_MUTED,
      }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: TC_BRAND, fontSize:10 }} />
          From your prompt
        </span>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, color:TC_BRAND, cursor:'pointer' }} onClick={() => onEdit && onEdit(tile)}>
          Edit <i className="fa-solid fa-chevron-right" style={{ width:11, height:11 }} />
        </span>
      </div>
    </div>
  );
}

function AddedStat({ data }) {
  return (
    <div>
      <div style={{ fontFamily:'Inter', fontSize:11, color:TC_MUTED, marginBottom:4 }}>{data.primary.label}</div>
      <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:36, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums', marginBottom:6 }}>
        {data.primary.value}
      </div>
      <div style={{ fontFamily:'Inter', fontSize:12, color:TC_BRAND, marginBottom:18, display:'inline-flex', alignItems:'center', gap:6 }}>
        <i className="fa-solid fa-arrow-up" style={{ fontSize:9 }} /> {data.delta}
      </div>
      <div style={{ borderTop:`1px solid ${TC_BORDER_SOFT}`, paddingTop:12, display:'flex', flexDirection:'column', gap:10 }}>
        {data.rows.map((r,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:'Inter', fontSize:12.5, color:TC_MUTED }}>{r.l}</span>
            <span style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddedChart({ data }) {
  const max = Math.max(...data.points);
  const min = Math.min(...data.points);
  const w = 280, h = 140;
  const sx = (i) => (i / (data.points.length - 1)) * w;
  const sy = (v) => h - ((v - min) / (max - min || 1)) * h;
  const path = data.points.map((v,i) => `${i?'L':'M'}${sx(i)},${sy(v)}`).join(' ');
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <div style={{ paddingTop:8 }}>
      <div style={{ fontFamily:'Inter', fontSize:11, color:TC_MUTED, marginBottom:8 }}>{data.axisLabel}</div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width:'100%', height:'auto', display:'block' }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="tc-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(5,122,85)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(5,122,85)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#tc-grad)" />
        <path d={path} fill="none" stroke="rgb(5,122,85)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {data.points.map((v,i) => (
          <circle key={i} cx={sx(i)} cy={sy(v)} r="2.5" fill="rgb(10,10,10)" stroke="rgb(5,122,85)" strokeWidth="1.5" />
        ))}
      </svg>
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, marginTop:18,
        paddingTop:12, borderTop:`1px solid ${TC_BORDER_SOFT}`,
      }}>
        <div>
          <div style={{ fontFamily:'Inter', fontSize:10.5, color:TC_MUTED }}>Latest</div>
          <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{Math.round(data.points[data.points.length-1])}</div>
        </div>
        <div>
          <div style={{ fontFamily:'Inter', fontSize:10.5, color:TC_MUTED }}>Avg</div>
          <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{Math.round(data.points.reduce((a,b)=>a+b,0)/data.points.length)}</div>
        </div>
        <div>
          <div style={{ fontFamily:'Inter', fontSize:10.5, color:TC_MUTED }}>Peak</div>
          <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{Math.round(max)}</div>
        </div>
      </div>
    </div>
  );
}

function AddedList({ data }) {
  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      {data.rows.map((r,i) => (
        <div key={i} style={{
          display:'grid', gridTemplateColumns:'1fr auto', gap:12, padding:'10px 0',
          borderTop:i?`1px solid ${TC_BORDER_SOFT}`:'none', alignItems:'center',
        }}>
          <div style={{ minWidth:0 }}>
            <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:TC_INK, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.title}</div>
            <div style={{ fontFamily:'Inter', fontSize:11, color:TC_MUTED, marginTop:2 }}>{r.meta}</div>
          </div>
          <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{r.value}</div>
        </div>
      ))}
    </div>
  );
}

/* The command palette / generator overlay */
function AddTileCommand({ open, onClose, onAdd }) {
  const [prompt, setPrompt] = React.useState('');
  const [phase, setPhase] = React.useState('input'); // 'input' | 'thinking' | 'preview'
  const [tile, setTile] = React.useState(null);
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (open) {
      setPhase('input'); setTile(null); setPrompt('');
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    }
  }, [open]);

  const submit = () => {
    if (!prompt.trim()) return;
    setPhase('thinking');
    setTimeout(() => {
      setTile(tcSynthesizeTile(prompt));
      setPhase('preview');
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    }, 1200);
  };

  const accept = () => {
    if (tile) onAdd(tile);
    onClose();
  };

  const useExample = (p) => {
    setPrompt(p);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
  };

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:100,
        background:'rgba(5,10,20,0.65)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
        display:'flex', alignItems:'flex-start', justifyContent:'center',
        padding:'48px 24px 24px',
      }}
    >
      <div onClick={(e)=>e.stopPropagation()} style={{
        width: phase === 'preview' ? 'min(820px, 100%)' : 'min(680px, 100%)',
        height: phase === 'preview' ? 'calc(100vh - 96px)' : 'auto',
        maxHeight:'calc(100vh - 96px)', borderRadius:16,
        background:'rgba(20,28,42,0.92)', border:`1px solid ${TC_BORDER}`,
        backdropFilter:'blur(16px) saturate(140%)', WebkitBackdropFilter:'blur(16px) saturate(140%)',
        boxShadow:'0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(5,122,85,0.1)',
        overflow:'hidden', display:'flex', flexDirection:'column',
      }}>
        {/* Input — only in input/thinking; preview gets a bottom bar instead */}
        {phase !== 'preview' && (
        <div style={{
          display:'flex', alignItems:'center', gap:12, padding:'14px 14px 14px 20px',
          borderBottom: `1px solid ${TC_BORDER_SOFT}`,
          flexShrink:0,
        }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: TC_BRAND, fontSize:18, flexShrink:0 }} />
          <input
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose(); }}
            placeholder={phase === 'preview' ? 'Tweak your prompt and press ↵ to regenerate…' : 'Describe a tile in plain English… e.g. clients with cash >5%'}
            style={{
              flex:1, minWidth:0, background:'transparent', border:'none', outline:'none',
              color:TC_INK, fontFamily:'Inter', fontSize:15, fontWeight:500,
            }}
          />
          <button
            onClick={submit}
            disabled={!prompt.trim() || phase === 'thinking'}
            title="Generate (↵)"
            style={{
              height:36, width:36, borderRadius:9, border:'none', flexShrink:0,
              background: prompt.trim() && phase !== 'thinking' ? TC_BRAND : 'rgba(5,122,85,0.25)',
              color:'#fff', cursor: prompt.trim() && phase !== 'thinking' ? 'pointer' : 'not-allowed',
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              boxShadow: prompt.trim() && phase !== 'thinking' ? '0 2px 8px -2px rgba(5,122,85,0.5)' : 'none',
              transition:'background 120ms ease',
            }}
          >
            {phase === 'thinking'
              ? <i className="fa-solid fa-spinner fa-spin" style={{ fontSize:13 }} />
              : <i className="fa-solid fa-arrow-up" style={{ fontSize:13 }} />}
          </button>
          <kbd style={{
            fontFamily:'Geist Mono, monospace', fontSize:11, padding:'3px 7px', borderRadius:5,
            background:'rgba(255,255,255,0.06)', border:`1px solid ${TC_BORDER}`, color:TC_MUTED, flexShrink:0,
          }}>esc</kbd>
        </div>
        )}

        {/* Body */}
        {phase === 'input' && (
          <div style={{ padding:'14px 14px 16px', overflowY:'auto', flex:'1 1 auto', minHeight:0 }}>
            <div style={{
              fontFamily:'Inter', fontSize:11, fontWeight:600, color:TC_MUTED,
              letterSpacing:'0.06em', padding:'6px 8px 10px',
            }}>EXAMPLES</div>
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {TC_EXAMPLE_PROMPTS.map((ex, i) => (
                <button key={i} onClick={() => useExample(ex.prompt)} style={{
                  display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
                  background:'transparent', border:'none', borderRadius:8, cursor:'pointer',
                  textAlign:'left', color:TC_INK, fontFamily:'Inter', fontSize:13.5,
                  transition:'background 100ms ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <i className={`fa-solid fa-${ex.icon}`} style={{ color:TC_MUTED, fontSize:13, width:16 }} />
                  <span style={{ flex:1 }}>{ex.prompt}</span>
                  <i className="fa-solid fa-arrow-up" style={{ color:TC_MUTED, fontSize:11, transform:'rotate(45deg)' }} />
                </button>
              ))}
            </div>
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'14px 8px 4px', marginTop:8, borderTop:`1px solid ${TC_BORDER_SOFT}`,
              fontFamily:'Inter', fontSize:11.5, color:TC_MUTED,
            }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                <i className="fa-solid fa-circle-check" style={{ color:TC_BRAND, fontSize:11 }} />
                Connected to your book · {1247} clients · {18} datasets
              </span>
              <span>
                <kbd style={{
                  fontFamily:'Geist Mono, monospace', fontSize:10.5, padding:'2px 6px', borderRadius:5,
                  background:'rgba(255,255,255,0.06)', border:`1px solid ${TC_BORDER}`, color:TC_MUTED,
                }}>↵</kbd> to generate
              </span>
            </div>
          </div>
        )}

        {phase === 'thinking' && (
          <div style={{ padding:'48px 24px', textAlign:'center', flex:'1 1 auto', minHeight:0, overflowY:'auto' }}>
            <div style={{ position:'relative', width:48, height:48, margin:'0 auto 20px' }}>
              <div style={{ position:'absolute', inset:0, borderRadius:9999, border:`3px solid rgba(5,122,85,0.2)` }} />
              <div style={{
                position:'absolute', inset:0, borderRadius:9999,
                border:`3px solid transparent`, borderTopColor:TC_BRAND,
                animation:'spin 1.1s linear infinite',
              }} />
            </div>
            <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:TC_INK, marginBottom:6 }}>
              Designing your tile
            </div>
            <div style={{ fontFamily:'Inter', fontSize:12.5, color:TC_MUTED }}>
              Reading data sources, picking a layout, fetching values…
            </div>
          </div>
        )}

        {phase === 'preview' && tile && (
          <React.Fragment>
            {/* Preview header strip */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'14px 20px', borderBottom:`1px solid ${TC_BORDER_SOFT}`, flexShrink:0,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <i className="fa-solid fa-wand-magic-sparkles" style={{ color:TC_BRAND, fontSize:14 }} />
                <div style={{ fontFamily:'Inter', fontSize:11, fontWeight:600, color:TC_MUTED, letterSpacing:'0.06em' }}>
                  PREVIEW · {tile.kind.toUpperCase()} TILE
                </div>
              </div>
              <button onClick={onClose} title="Close" style={{
                width:28, height:28, borderRadius:8, border:'none', background:'transparent',
                color:TC_MUTED, cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center',
              }}
                onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}
                onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                <i className="fa-solid fa-xmark" style={{ fontSize:14 }} />
              </button>
            </div>

            {/* Tile preview — fills available space */}
            <div style={{
              flex:'1 1 auto', minHeight:0, padding:'18px',
              display:'flex', alignItems:'stretch', justifyContent:'stretch',
              background:'radial-gradient(circle at 50% 0%, rgba(5,122,85,0.06), transparent 60%)',
            }}>
              <div style={{ flex:1, minHeight:0, minWidth:0, display:'flex' }}>
                <div style={{ flex:1, minHeight:0, minWidth:0, '--tile-min-height':'0px' }}>
                  <AddedTile tile={tile} onRemove={() => {}} />
                </div>
              </div>
            </div>

            {/* Bottom edit bar */}
            <div style={{
              borderTop:`1px solid ${TC_BORDER_SOFT}`, padding:'12px 14px',
              background:'rgba(15,22,34,0.7)', flexShrink:0,
              display:'flex', flexDirection:'column', gap:10,
            }}>
              <div style={{
                display:'flex', alignItems:'center', gap:10, padding:'8px 8px 8px 14px',
                background:'rgba(255,255,255,0.04)', border:`1px solid ${TC_BORDER}`, borderRadius:12,
              }}>
                <i className="fa-solid fa-pen-to-square" style={{ color:TC_BRAND, fontSize:14, flexShrink:0 }} />
                <input
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose(); }}
                  placeholder="Edit the tile… e.g. ‘group by household’, ‘sort by AUM’, ‘add last contact’"
                  style={{
                    flex:1, minWidth:0, background:'transparent', border:'none', outline:'none',
                    color:TC_INK, fontFamily:'Inter', fontSize:14, fontWeight:500,
                  }}
                />
                <button
                  onClick={submit}
                  disabled={!prompt.trim() || phase === 'thinking'}
                  title="Update tile (↵)"
                  style={{
                    height:32, width:32, borderRadius:8, border:'none', flexShrink:0,
                    background: prompt.trim() ? TC_BRAND : 'rgba(5,122,85,0.25)',
                    color:'#fff', cursor: prompt.trim() ? 'pointer' : 'not-allowed',
                    display:'inline-flex', alignItems:'center', justifyContent:'center',
                    boxShadow: prompt.trim() ? '0 2px 8px -2px rgba(5,122,85,0.5)' : 'none',
                  }}
                >
                  <i className="fa-solid fa-arrow-up" style={{ fontSize:12 }} />
                </button>
              </div>
              <div style={{ display:'flex', gap:8, justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {['Make it smaller','Group by household','Sort by AUM','Show last contact'].map((q) => (
                    <button key={q} onClick={() => { setPrompt(q); setTimeout(()=>inputRef.current && inputRef.current.focus(),0); }} style={{
                      height:26, padding:'0 10px', borderRadius:999, border:`1px solid ${TC_BORDER}`,
                      background:'transparent', color:TC_MUTED, fontFamily:'Inter', fontSize:11.5, fontWeight:500,
                      cursor:'pointer',
                    }}
                      onMouseEnter={(e)=>{e.currentTarget.style.color=TC_INK; e.currentTarget.style.borderColor='rgba(5,122,85,0.5)';}}
                      onMouseLeave={(e)=>{e.currentTarget.style.color=TC_MUTED; e.currentTarget.style.borderColor=TC_BORDER;}}>
                      {q}
                    </button>
                  ))}
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button onClick={() => { setTile(tcSynthesizeTile(prompt)); }} style={{
                    height:36, padding:'0 14px', borderRadius:9, border:`1px solid ${TC_BORDER}`,
                    background:'transparent', color:TC_INK, fontFamily:'Inter', fontWeight:500, fontSize:12.5,
                    cursor:'pointer',
                  }}>
                    Regenerate
                  </button>
                  <button onClick={accept} style={{
                    height:36, padding:'0 16px', borderRadius:9, border:'none',
                    background:TC_BRAND, color:'#fff', fontFamily:'Inter', fontWeight:600, fontSize:12.5,
                    cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6,
                    boxShadow:'0 4px 14px -4px rgba(5,122,85,0.6)',
                  }}>
                    <i className="fa-solid fa-plus" style={{ width:11, height:11 }} />
                    Add to dashboard
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

/* Trigger button — sits next to the existing FAB. */
function AddTileTrigger({ onOpen }) {
  return (
    <button onClick={onOpen} title="Add a tile (⌘K)" style={{
      position:'fixed', right:24, bottom:96, zIndex:50,
      height:44, padding:'0 18px', borderRadius:9999,
      background:'rgba(20,28,42,0.85)', border:`1px solid ${TC_BORDER}`,
      backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
      color:TC_INK, fontFamily:'Inter', fontWeight:600, fontSize:13,
      cursor:'pointer', display:'inline-flex', alignItems:'center', gap:10,
      boxShadow:'0 10px 30px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(5,122,85,0.15)',
    }}>
      <i className="fa-solid fa-wand-magic-sparkles" style={{ color:TC_BRAND, width:13, height:13 }} />
      Add a tile
      <kbd style={{
        fontFamily:'Geist Mono, monospace', fontSize:10.5, padding:'2px 6px', borderRadius:5,
        background:'rgba(255,255,255,0.08)', border:`1px solid ${TC_BORDER_SOFT}`, color:TC_MUTED, marginLeft:4,
      }}>⌘K</kbd>
    </button>
  );
}

Object.assign(window, { AddTileCommand, AddTileTrigger, AddedTile, tcSynthesizeTile });
