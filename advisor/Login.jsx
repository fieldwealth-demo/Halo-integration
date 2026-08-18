// Login screen — matches the Figma Card "Login to your account" pattern.
function Login({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="app-surface" style={{ minHeight: '100vh', display:'grid', placeItems:'center', padding: 24 }}>
      <Card style={{ width: 400, padding: 0, gap: 0 }}>
        {/* header */}
        <div style={{ padding: '24px 24px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            <div style={{ fontFamily:'Inter', fontWeight:700, fontSize:24, lineHeight: 1 }}>Login to your account</div>
            <div style={{ fontFamily:'Inter', fontSize: 14, color:'rgb(163,163,163)' }}>
              Enter your email below to login to your account
            </div>
          </div>
          <Button variant="link" size="sm">Sign up</Button>
        </div>

        {/* body */}
        <div style={{ padding: '24px', display:'flex', flexDirection:'column', gap: 16 }}>
          <Field label="Email">
            <Input type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </Field>
          <Field label={
            <span style={{ display:'flex', justifyContent:'space-between', width:'100%' }}>
              <span>Password</span>
              <a href="#" style={{ fontFamily:'Inter', fontSize:13, color:'rgb(249,250,251)', textDecoration:'none' }}>Forgot password?</a>
            </span>
          }>
            <Input type="password" value={pw} onChange={e => setPw(e.target.value)} />
          </Field>

          <Button variant="primary" loading={loading} onClick={() => {
            setLoading(true);
            setTimeout(() => { setLoading(false); onLogin && onLogin(); }, 650);
          }} style={{ width:'100%', background: email && pw ? 'rgb(249,250,251)' : 'rgb(5,122,85)', color: email && pw ? 'rgb(10,10,10)' : 'rgb(249,250,251)' }}>
            Login
          </Button>
          <Button variant="outline" icon="chrome" style={{ width:'100%', background:'transparent' }}>
            Login with Google
          </Button>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { Login });
