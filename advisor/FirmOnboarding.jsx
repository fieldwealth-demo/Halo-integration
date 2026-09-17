/* FirmOnboarding — the three Journey 1 stages the product was missing.
 *
 * The existing OnboardingFlow sets up an ADVISOR (password, tiles, their own
 * tools). Journey 1 in the source text is a FIRM-level data story, and it is
 * the part that makes "the connected record of everything a household owns"
 * real rather than asserted:
 *
 *   Stage 2  Connect every system      → OnbSources
 *   Stage 3  Resolve the household     → OnbResolve
 *   Stage 4  Fill what no feed carries → OnbHeldAway
 *
 * Halo + tokens throughout, to match the product these screens hand off to.
 */

/* Injected once so the position rows can rise in as they are read. */
if (typeof document !== 'undefined' && !document.getElementById('fo-keyframes')) {
  const st = document.createElement('style');
  st.id = 'fo-keyframes';
  st.textContent = '@keyframes fo-rise { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:none; } }';
  document.head.appendChild(st);
}
const FO = {
  ink: 'rgb(249,250,251)',
  muted: 'rgb(163,163,163)',
  dim: 'rgb(107,114,128)',
  border: 'rgb(75,85,99)',
  borderSoft: 'rgba(75,85,99,0.5)',
  card: 'rgba(255,255,255,0.04)',
  green: 'rgb(35,89,255)',
  greenBr: 'rgb(150,178,255)',
  /* brand + CTAs */
  ok: 'rgb(35,89,255)',
  okBr: 'rgb(128,152,234)',
  /* success stays green */
  amber: 'rgb(245,200,90)',
  blue: 'rgb(118,169,250)'
};
const FO_SHELL = {
  fontFamily: 'Inter',
  color: FO.ink,
  maxWidth: 980,
  margin: '0 auto',
  padding: '8px 32px 40px'
};
const FO_H = {
  fontFamily: 'Inter',
  fontWeight: 700,
  fontSize: 30,
  letterSpacing: '-0.02em',
  marginBottom: 8
};
const FO_SUB = {
  fontFamily: 'Inter',
  fontSize: 14,
  color: FO.muted,
  lineHeight: 1.55,
  marginBottom: 26,
  maxWidth: 720
};
const FO_CARD = {
  background: FO.card,
  border: `1px solid ${FO.border}`,
  borderRadius: 12
};
const FO_EYEBROW = {
  fontFamily: 'Inter',
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: FO.greenBr,
  marginBottom: 10
};
function foBtn(primary) {
  return {
    height: 40,
    padding: '0 20px',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: 'Inter',
    fontSize: 13.5,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    background: primary ? FO.green : 'rgba(255,255,255,0.04)',
    border: `1px solid ${primary ? FO.greenBr : FO.border}`,
    color: primary ? '#fff' : 'rgb(209,213,219)',
    boxShadow: primary ? '0 4px 14px rgba(35,89,255,0.35)' : 'none'
  };
}
function FoNav({
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
  note
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 26
    }
  }, onBack && /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: foBtn(false)
  }, "Back"), note && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Inter',
      fontSize: 12,
      color: FO.dim
    }
  }, note), /*#__PURE__*/React.createElement("button", {
    onClick: nextDisabled ? undefined : onNext,
    disabled: nextDisabled,
    style: {
      ...foBtn(true),
      marginLeft: 'auto',
      opacity: nextDisabled ? 0.5 : 1,
      cursor: nextDisabled ? 'default' : 'pointer'
    }
  }, nextLabel || 'Continue', " ", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right",
    style: {
      width: 12,
      height: 12
    }
  })));
}

/* ------------------------------------------------------------------------ */
/* Stage 2 — Connect every system                                            */
/* ------------------------------------------------------------------------ */

const FO_SOURCES = [{
  id: 'schwab',
  name: 'Charles Schwab',
  cat: 'Custodian',
  cred: 'API key',
  carries: 'Positions, transactions, accounts',
  accounts: 214
}, {
  id: 'fidelity',
  name: 'Fidelity',
  cat: 'Custodian',
  cred: 'API key',
  carries: 'Positions, transactions, accounts',
  accounts: 96
}, {
  id: 'pershing',
  name: 'Pershing',
  cat: 'Custodian',
  cred: 'Flat file (SFTP)',
  carries: 'Positions, transactions',
  accounts: 41
}, {
  id: 'orion',
  name: 'Orion',
  cat: 'Portfolio accounting',
  cred: 'API key',
  carries: 'Performance, billing, households',
  accounts: 0
}, {
  id: 'redtail',
  name: 'Redtail',
  cat: 'CRM',
  cred: 'Username, password',
  carries: 'People, relationships, entities',
  accounts: 0
}, {
  id: 'emoney',
  name: 'eMoney',
  cat: 'Planning',
  cred: 'Username, password',
  carries: 'Plan, goals, horizon',
  accounts: 0
}];

/* Typing "Bl" should offer Black Diamond, BlackRock and Blackstone — the
   disambiguation moment from the journey text. */
const FO_SEARCH_POOL = FO_SOURCES.concat([{
  id: 'blackdiamond',
  name: 'Black Diamond',
  cat: 'Portfolio accounting',
  cred: 'API key',
  carries: 'Performance, reporting',
  accounts: 0
}, {
  id: 'blackrock',
  name: 'BlackRock',
  cat: 'Manufacturer',
  cred: 'API key',
  carries: 'Model portfolios, signals',
  accounts: 0
}, {
  id: 'blackstone',
  name: 'Blackstone',
  cat: 'Manufacturer',
  cred: 'API key',
  carries: 'Private funds, offerings',
  accounts: 0
}, {
  id: 'addepar',
  name: 'Addepar',
  cat: 'Portfolio accounting',
  cred: 'API key',
  carries: 'Positions, performance',
  accounts: 0
}, {
  id: 'salesforce',
  name: 'Salesforce',
  cat: 'CRM',
  cred: 'Username, password',
  carries: 'People, relationships',
  accounts: 0
}]);

/* Connecting a source is not an end in itself — it is what makes a tile
   buildable. Tile names are the real ONB_TILE_CATALOG entries. */
const FO_UNLOCKS = {
  schwab: ['Top Holdings', 'AUM by Allocation', 'Cash Flow'],
  fidelity: ['AUM Trend', 'Allocation Drift'],
  pershing: ['Top Clients'],
  orion: ['Billing Summary', 'Projected Fees'],
  redtail: ['Client Inbox', 'Prospect Pipeline', 'Open Tasks'],
  emoney: ['RMD Tracker']
};
const FO_ALL_TILES = Object.keys(FO_UNLOCKS).reduce(function (a, k) {
  return a.concat(FO_UNLOCKS[k].map(function (t) {
    return [t, k];
  }));
}, []);
function FoTileUnlocks({
  connections,
  sources
}) {
  const nameOf = React.useMemo(() => {
    const m = {};
    sources.forEach(s => {
      m[s.id] = s.name;
    });
    return m;
  }, [sources]);
  const rows = FO_ALL_TILES.map(function (pair) {
    return {
      tile: pair[0],
      src: pair[1],
      on: connections[pair[1]] === 'connected'
    };
  });
  const live = rows.filter(r => r.on).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...FO_CARD,
      padding: '16px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Inter',
      fontSize: 12.5,
      fontWeight: 600
    }
  }, "Tiles this makes available"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'Inter',
      fontSize: 11.5,
      color: FO.muted,
      fontVariantNumeric: 'tabular-nums'
    }
  }, live, " of ", rows.length, " buildable")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 7
    }
  }, rows.map(function (r, i) {
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      title: r.on ? '' : 'Needs ' + (nameOf[r.src] || r.src),
      style: {
        fontFamily: 'Inter',
        fontSize: 11.5,
        padding: '6px 10px',
        borderRadius: 8,
        border: `1px solid ${r.on ? 'rgba(35,89,255,0.45)' : FO.borderSoft}`,
        background: r.on ? 'rgba(35,89,255,0.12)' : 'transparent',
        color: r.on ? FO.okBr : FO.dim,
        transition: 'all 260ms ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid fa-${r.on ? 'circle-check' : 'lock'}`,
      style: {
        width: 9,
        height: 9
      }
    }), r.tile, !r.on && /*#__PURE__*/React.createElement("em", {
      style: {
        fontStyle: 'normal',
        color: FO.dim,
        opacity: .8
      }
    }, "\xB7 ", nameOf[r.src] || r.src));
  })));
}
function FoSourceRow({
  src,
  state,
  onConnect
}) {
  const connected = state === 'connected';
  const busy = state === 'connecting';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '13px 16px',
      borderTop: `1px solid ${FO.borderSoft}`,
      background: connected ? 'rgba(35,89,255,0.07)' : 'transparent',
      transition: 'background 240ms ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      flexShrink: 0,
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${FO.borderSoft}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: connected ? FO.okBr : FO.muted
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid fa-${connected ? 'check' : 'plug'}`,
    style: {
      width: 12,
      height: 12
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontSize: 13.5,
      fontWeight: 600
    }
  }, src.name, /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      fontSize: 11,
      fontWeight: 500,
      color: FO.dim
    }
  }, src.cat)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontSize: 11.5,
      color: FO.muted,
      marginTop: 2
    }
  }, src.carries, " \xB7 ", src.cred)), connected && src.accounts > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontSize: 11.5,
      color: FO.ink,
      fontVariantNumeric: 'tabular-nums',
      flexShrink: 0
    }
  }, src.accounts, " accounts"), /*#__PURE__*/React.createElement("button", {
    onClick: connected || busy ? undefined : () => onConnect(src.id),
    style: {
      flexShrink: 0,
      height: 30,
      padding: '0 13px',
      borderRadius: 7,
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: 600,
      cursor: connected || busy ? 'default' : 'pointer',
      background: connected ? 'transparent' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${connected ? 'rgba(35,89,255,0.5)' : FO.border}`,
      color: connected ? FO.okBr : 'rgb(209,213,219)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7
    }
  }, busy && /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-notch fa-spin",
    style: {
      width: 11,
      height: 11
    }
  }), connected ? 'Connected' : busy ? 'Connecting' : 'Connect'));
}
function OnbSources({
  connections,
  onConnect,
  onNext,
  onBack
}) {
  const [query, setQuery] = React.useState('');
  const matches = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return FO_SEARCH_POOL.filter(s => s.name.toLowerCase().indexOf(q) === 0).slice(0, 5);
  }, [query]);
  const [added, setAdded] = React.useState([]);
  const list = FO_SOURCES.concat(added);
  const connectedCount = list.filter(s => connections[s.id] === 'connected').length;
  const accounts = list.reduce((n, s) => n + (connections[s.id] === 'connected' ? s.accounts : 0), 0);
  return /*#__PURE__*/React.createElement("div", {
    style: FO_SHELL
  }, /*#__PURE__*/React.createElement("div", {
    style: FO_EYEBROW
  }, "Step 2 of 4 \xB7 The firm"), /*#__PURE__*/React.createElement("h1", {
    style: FO_H
  }, "Connect every system"), /*#__PURE__*/React.createElement("p", {
    style: FO_SUB
  }, "Custodians, portfolio accounting, the CRM and the planning tool. Each connection decides what the advisor can actually build \u2014 the tiles below unlock as the data arrives. Every integration is a reusable workflow built once, so the next firm on the same platform connects in minutes."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 42,
      padding: '0 14px',
      background: FO.card,
      border: `1px solid ${FO.border}`,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-magnifying-glass",
    style: {
      width: 13,
      height: 13,
      color: FO.dim
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Add a platform \u2014 start typing, e.g. \u201CBl\u201D",
    style: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontFamily: 'Inter',
      fontSize: 13.5,
      color: FO.ink
    }
  })), matches.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 46,
      zIndex: 5,
      background: 'rgb(17,24,39)',
      border: `1px solid ${FO.border}`,
      borderRadius: 10,
      boxShadow: '0 18px 40px -12px rgba(0,0,0,0.6)',
      overflow: 'hidden'
    }
  }, matches.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.id,
    onClick: () => {
      if (!list.some(s => s.id === m.id)) setAdded(a => a.concat(m));
      setQuery('');
      onConnect(m.id);
    },
    style: {
      padding: '10px 14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      borderBottom: `1px solid ${FO.borderSoft}`,
      fontFamily: 'Inter',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, m.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: FO.muted
    }
  }, m.cat), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 11,
      color: FO.dim
    }
  }, m.cred))))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...FO_CARD,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Inter',
      fontSize: 12.5,
      fontWeight: 600
    }
  }, "Sources"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'Inter',
      fontSize: 11.5,
      color: FO.muted,
      fontVariantNumeric: 'tabular-nums'
    }
  }, connectedCount, " of ", list.length, " connected \xB7 ", accounts, " accounts flowing")), list.map(s => /*#__PURE__*/React.createElement(FoSourceRow, {
    key: s.id,
    src: s,
    state: connections[s.id],
    onConnect: onConnect
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(FoTileUnlocks, {
    connections: connections,
    sources: list
  })), /*#__PURE__*/React.createElement(FoNav, {
    onBack: onBack,
    onNext: onNext,
    nextDisabled: connectedCount === 0,
    nextLabel: "Resolve households",
    note: connectedCount === 0 ? 'Connect at least one source to continue' : null
  }));
}

/* ------------------------------------------------------------------------ */
/* Stage 3 — Resolve the household                                           */
/* ------------------------------------------------------------------------ */

const FO_PROPOSED = [{
  id: 'p1',
  household: 'Watson',
  people: 'John & Kristin Watson',
  confidence: 98,
  accounts: ['Joint taxable · Schwab', 'Family trust · Fidelity', 'Rollover IRA · Schwab'],
  note: 'Matched on tax ID and address'
}, {
  id: 'p2',
  household: 'Hawkins',
  people: 'Ricardo & Cameron Hawkins',
  confidence: 96,
  accounts: ['Joint taxable · Schwab', 'Roth IRA · Schwab', 'SEP IRA · Fidelity', '+4 more'],
  note: 'Matched on tax ID'
}, {
  id: 'p3',
  household: 'Edwards',
  people: 'Aubrey & Josh Edwards',
  confidence: 92,
  accounts: ['Joint taxable · Fidelity', 'Trust · Pershing', '+3 more'],
  note: 'CRM and custodian spell the surname differently'
}, {
  id: 'p4',
  household: 'Smith / Smith Trust',
  people: 'Keith & Asheley Smith',
  confidence: 71,
  accounts: ['Joint taxable · Schwab', 'Smith Family Trust · Fidelity'],
  note: 'Trust may be a separate household — confirm or split',
  flag: true
}];
function FoConfidence({
  v
}) {
  const color = v >= 90 ? FO.okBr : v >= 80 ? FO.blue : FO.amber;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 54,
      height: 4,
      borderRadius: 9999,
      background: 'rgba(255,255,255,0.1)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: v + '%',
      height: '100%',
      background: color,
      transition: 'width 400ms ease'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Inter',
      fontSize: 11.5,
      color: FO.ink,
      fontVariantNumeric: 'tabular-nums',
      width: 30
    }
  }, v, "%"));
}
function OnbResolve({
  resolved,
  onResolve,
  onNext,
  onBack
}) {
  const total = FO_PROPOSED.length;
  const doneCount = Object.keys(resolved).length;
  return /*#__PURE__*/React.createElement("div", {
    style: FO_SHELL
  }, /*#__PURE__*/React.createElement("div", {
    style: FO_EYEBROW
  }, "Step 3 of 4 \xB7 The firm"), /*#__PURE__*/React.createElement("h1", {
    style: FO_H
  }, "Resolve the household"), /*#__PURE__*/React.createElement("p", {
    style: FO_SUB
  }, "This is already done \u2014 351 accounts matched to people, and people to households, across every source. The advisor confirms what the record proposed and the handful it was unsure about wait in a queue. Nobody reconciles anything by hand."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
      marginBottom: 18
    }
  }, [['Accounts ingested', '351'], ['Households proposed', '142'], ['In the queue', String(total - doneCount)]].map(([l, v], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...FO_CARD,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontSize: 11,
      color: FO.muted,
      marginBottom: 5
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...FO_CARD,
      overflow: 'hidden'
    }
  }, FO_PROPOSED.map((p, i) => {
    const state = resolved[p.id];
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      style: {
        padding: '14px 16px',
        borderTop: i === 0 ? 'none' : `1px solid ${FO.borderSoft}`,
        background: state ? 'rgba(35,89,255,0.06)' : p.flag ? 'rgba(234,179,8,0.05)' : 'transparent',
        transition: 'background 240ms ease'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Inter',
        fontSize: 13.5,
        fontWeight: 600
      }
    }, p.household, /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 8,
        fontSize: 12,
        fontWeight: 400,
        color: FO.muted
      }
    }, p.people)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Inter',
        fontSize: 11.5,
        color: FO.muted,
        marginTop: 3
      }
    }, p.accounts.join('  ·  ')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Inter',
        fontSize: 11,
        color: p.flag ? FO.amber : FO.dim,
        marginTop: 4
      }
    }, p.flag && /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-triangle-exclamation",
      style: {
        width: 10,
        height: 10,
        marginRight: 5
      }
    }), p.note)), /*#__PURE__*/React.createElement(FoConfidence, {
      v: p.confidence
    }), state ? /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: 600,
        padding: '5px 11px',
        borderRadius: 9999,
        background: 'rgba(35,89,255,0.18)',
        color: FO.okBr,
        border: '1px solid rgba(35,89,255,0.5)'
      }
    }, state === 'split' ? 'Split' : 'Confirmed') : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 7,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onResolve(p.id, 'split'),
      style: {
        height: 30,
        padding: '0 12px',
        borderRadius: 7,
        cursor: 'pointer',
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 600,
        background: 'transparent',
        border: `1px solid ${FO.border}`,
        color: 'rgb(209,213,219)'
      }
    }, "Split"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onResolve(p.id, 'confirm'),
      style: {
        height: 30,
        padding: '0 12px',
        borderRadius: 7,
        cursor: 'pointer',
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 600,
        background: FO.ok,
        border: `1px solid ${FO.okBr}`,
        color: '#fff'
      }
    }, "Confirm"))));
  })), /*#__PURE__*/React.createElement(FoNav, {
    onBack: onBack,
    onNext: onNext,
    nextLabel: "Add held-away assets",
    note: doneCount < total ? `${total - doneCount} left in the queue — ops can finish these` : 'Queue clear'
  }));
}

/* ------------------------------------------------------------------------ */
/* Stage 4 — What no feed carries                                            */
/* ------------------------------------------------------------------------ */
/* Not an upload form. The record already knows something is missing — a
   transfer out with no matching account, a plan that references an asset no
   custodian reports — and it says so. Completing the picture is what makes
   the Journey 2 opportunity possible, which is the actual value of the step.
   No mention of Halo or Helm: this screen is about ingesting everyone else's
   data, and our own products being easy is not a proof of anything. */

const FO_GAPS = [{
  id: 'g1',
  what: 'Private fund position',
  who: 'Watson household',
  why: 'Plan references a capital commitment no custodian reports',
  route: 'Administrator feed',
  value: '$1,200,000',
  name: 'Tiger Global PE Fund VIII'
}, {
  id: 'g2',
  what: 'Outside retirement account',
  who: 'Watson household',
  why: 'Payroll deferrals leaving, no matching account on any feed',
  route: 'Statement read',
  value: '$612,000',
  name: 'Held-away 401(k)'
}, {
  id: 'g3',
  what: 'Insurance policy',
  who: 'Hawkins household',
  why: 'Premium debits recurring against a policy number we cannot see',
  route: 'Carrier feed',
  value: '$430,000',
  name: 'Whole life policy'
}, {
  id: 'g4',
  what: 'Structured note',
  who: 'Watson household',
  why: 'Coupon credits arriving from an issuer with no position on file',
  route: 'Issuer file',
  value: '$240,000',
  name: '5y SPX/RTY worst-of note'
}];
function OnbHeldAway({
  uploaded,
  onUpload,
  onNext,
  onBack
}) {
  const [busy, setBusy] = React.useState(false);
  const filled = !!uploaded;
  const resolveGaps = () => {
    if (busy || filled) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      onUpload();
    }, 1500);
  };
  const visible = filled ? 100 : 78;
  return /*#__PURE__*/React.createElement("div", {
    style: FO_SHELL
  }, /*#__PURE__*/React.createElement("div", {
    style: FO_EYEBROW
  }, "Step 4 of 4 \xB7 The firm"), /*#__PURE__*/React.createElement("h1", {
    style: FO_H
  }, "What no feed carries"), /*#__PURE__*/React.createElement("p", {
    style: FO_SUB
  }, "Custodians report what they hold. The record notices what they don\u2019t \u2014 a capital call with no fund on file, deferrals leaving for an account nobody reports, coupons arriving from an issuer with no position. Four gaps found across the book, each with a route to close it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
      marginBottom: 18
    }
  }, [['Balance sheet visible', visible + '%', filled ? 'Complete across every household' : '22% sits outside the feeds'], ['Gaps detected', filled ? '0' : String(FO_GAPS.length), filled ? 'All closed' : 'Inferred from cash movement and the plan'], ['Signals this unlocks', filled ? '3' : '0', filled ? 'Concentration and protection, now visible' : 'Needs the whole picture first']].map(([l, v, sub], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...FO_CARD,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontSize: 11,
      color: FO.muted,
      marginBottom: 5
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontVariantNumeric: 'tabular-nums',
      color: FO.ink,
      transition: 'color 300ms ease'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontSize: 11.5,
      color: FO.dim,
      marginTop: 4
    }
  }, sub)))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...FO_CARD,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Inter',
      fontSize: 12.5,
      fontWeight: 600
    }
  }, filled ? 'Closed — now in the record' : 'Detected gaps'), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'Inter',
      fontSize: 11.5,
      color: FO.muted
    }
  }, filled ? 'Each carries how it arrived' : 'Each with the evidence that found it')), FO_GAPS.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '13px 16px',
      borderTop: `1px solid ${FO.borderSoft}`,
      background: filled ? 'rgba(35,89,255,0.06)' : 'transparent',
      transition: 'background 300ms ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 7,
      flexShrink: 0,
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${FO.borderSoft}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: filled ? FO.okBr : FO.amber
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid fa-${filled ? 'check' : 'magnifying-glass'}`,
    style: {
      width: 11,
      height: 11
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontSize: 13,
      fontWeight: 600
    }
  }, filled ? g.name : g.what, /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      fontSize: 11.5,
      fontWeight: 400,
      color: FO.muted
    }
  }, g.who)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontSize: 11.5,
      color: filled ? FO.muted : FO.dim,
      marginTop: 2
    }
  }, filled ? g.route : g.why)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter',
      fontSize: 13,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      color: filled ? FO.ink : FO.dim
    }
  }, filled ? g.value : '—')))), !filled && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: resolveGaps,
    style: {
      ...foBtn(true),
      height: 38,
      opacity: busy ? 0.75 : 1
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-notch fa-spin",
    style: {
      width: 12,
      height: 12
    }
  }), " Closing the gaps\u2026") : 'Close all four'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Inter',
      fontSize: 11.5,
      color: FO.dim
    }
  }, "Administrator and carrier feeds where they exist; a statement read or keyed by ops where they do not")), /*#__PURE__*/React.createElement(FoNav, {
    onBack: onBack,
    onNext: onNext,
    nextLabel: "Finish",
    note: filled ? 'The whole balance sheet is in the record — including the positions the opportunity comes from' : 'You can close these later; the record keeps flagging them'
  }));
}
Object.assign(window, {
  OnbSources,
  OnbResolve,
  OnbHeldAway,
  FO_SOURCES,
  FO_PROPOSED,
  FO_GAPS
});
;