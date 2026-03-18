import React, { useState, useEffect } from "react";

/* ══════════════════════════════════════════
   CONFIG SUPABASE
══════════════════════════════════════════ */
const SB_URL = "https://uomsnwpjsjkwkxzbgbkg.supabase.co";
const SB_KEY = "sb_publishable_KGf7VXsyZar9jYgSnzTFLg_IY6wZyB3";

const h = (token) => ({
  "Content-Type": "application/json",
  "apikey": SB_KEY,
  "Authorization": `Bearer ${token || SB_KEY}`,
});

const db = {
  get: async (table, token, q = "") => {
    const r = await fetch(`${SB_URL}/rest/v1/${table}?order=created_at.desc${q}`, { headers: h(token) });
    return r.json();
  },
  post: async (table, data, token) => {
    const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
      method: "POST", headers: { ...h(token), "Prefer": "return=representation" },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  patch: async (table, id, data, token) => {
    const r = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH", headers: { ...h(token), "Prefer": "return=representation" },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  del: async (table, id, token) => {
    await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers: h(token) });
  },
  login: async (email, password) => {
    const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: { "Content-Type": "application/json", "apikey": SB_KEY },
      body: JSON.stringify({ email, password }),
    });
    return r.json();
  },
  logout: async (token) => {
    await fetch(`${SB_URL}/auth/v1/logout`, { method: "POST", headers: h(token) });
  },
};

/* ══════════════════════════════════════════
   RÔLES & PERMISSIONS
══════════════════════════════════════════ */
const ROLES = {
  admin:                 { label: "مدير", color: "#4A1528", pages: ["access", "assignments", "settings"] },
  lawyer:                { label: "محامٍ", color: "#C9A84C", pages: ["dashboard","clients","cases","calendar","invoices","ai","analytics","settings"] },
  collaborator:          { label: "متعاون", color: "#0D9488", pages: ["dashboard","clients","cases","calendar","invoices","ai","analytics","settings"] },
  secretary_lawyer:      { label: "سكرتير محامٍ", color: "#7C3AED", pages: ["dashboard","clients","cases","calendar","invoices"] },
  secretary_collaborator:{ label: "سكرتير متعاون", color: "#D97706", pages: ["dashboard","clients","cases","calendar","invoices"] },
};

const canAccess = (role, page) => ROLES[role]?.pages.includes(page) ?? false;

/* ══════════════════════════════════════════
   COULEURS
══════════════════════════════════════════ */
const C = {
  p: "#4A1528", pm: "#6B2D3E", pl: "#8B4D5E",
  a: "#C9A84C", al: "#E2C97A", ab: "#FDF6E3",
  rose: "#C0392B", roseBg: "#FDECEA",
  amber: "#D97706", amberBg: "#FFFBEB",
  green: "#16A34A", greenBg: "#F0FDF4",
  sky: "#0369A1", skyBg: "#EFF6FF",
  purple: "#7C3AED", purpleBg: "#F5F3FF",
  teal: "#0D9488", tealBg: "#F0FDFA",
  w: "#FFFFFF", bg: "#FAF7F5", border: "#E8DDD8",
  text: "#1C0A0A", textMid: "#5C3D3D", textLight: "#A08080",
  n100: "#FDF9F7", n200: "#F5EDE8",
};

/* ══════════════════════════════════════════
   COMPOSANTS UI
══════════════════════════════════════════ */
function useToast() {
  const [msg, setMsg] = useState(""); const [type, setType] = useState("ok");
  const show = (m, t = "ok") => { setMsg(m); setType(t); setTimeout(() => setMsg(""), 3500); };
  return [msg, type, show];
}
function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = type === "err" ? C.rose : type === "warn" ? C.amber : C.green;
  return <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: bg, color: C.w, padding: "11px 26px", borderRadius: 13, fontSize: 14, fontWeight: 700, zIndex: 9999, boxShadow: "0 8px 28px rgba(0,0,0,0.18)", whiteSpace: "nowrap" }}>{msg}</div>;
}
function Spinner() {
  return <div style={{ padding: 60, textAlign: "center", color: C.textLight }}><div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.p, animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} /><p style={{ fontSize: 13, margin: 0 }}>جاري التحميل...</p></div>;
}
function Empty({ icon = "📭", msg }) {
  return <div style={{ padding: 60, textAlign: "center", color: C.textLight }}><div style={{ fontSize: 40, marginBottom: 10, opacity: 0.4 }}>{icon}</div><p style={{ fontSize: 14, margin: 0 }}>{msg}</p></div>;
}
function Card({ children, style = {}, onClick }) {
  return <div onClick={onClick} style={{ background: C.w, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 8px rgba(74,21,40,0.06)", cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>;
}
function Badge({ label }) {
  const m = {
    "نشط":{ bg: C.greenBg, c: C.green },"غير نشط":{ bg: C.n200, c: C.textMid },
    "قيد النظر":{ bg: C.skyBg, c: C.sky },"معلقة":{ bg: C.amberBg, c: C.amber },
    "مفتوحة":{ bg: C.purpleBg, c: C.purple },"مكسوبة":{ bg: C.greenBg, c: C.green },
    "مغلقة":{ bg: C.n200, c: C.textMid },"مدفوعة":{ bg: C.greenBg, c: C.green },
    "مرسلة":{ bg: C.skyBg, c: C.sky },"متأخرة":{ bg: C.roseBg, c: C.rose },
    "مسودة":{ bg: C.n200, c: C.textMid },"مؤكد":{ bg: C.greenBg, c: C.green },
    "مجدول":{ bg: C.skyBg, c: C.sky },"ملغي":{ bg: C.roseBg, c: C.rose },
    "عاجلة":{ bg: C.roseBg, c: C.rose },"عالية":{ bg: "#FFF7ED", c: "#C2410C" },
    "متوسطة":{ bg: C.amberBg, c: C.amber },"منخفضة":{ bg: C.greenBg, c: C.green },
    "admin":{ bg: `${C.p}18`, c: C.p },"lawyer":{ bg: C.ab, c: C.a },
    "collaborator":{ bg: C.tealBg, c: C.teal },"secretary_lawyer":{ bg: C.purpleBg, c: C.purple },
    "secretary_collaborator":{ bg: C.amberBg, c: C.amber },
  };
  const s = m[label] || { bg: C.n200, c: C.textMid };
  return <span style={{ background: s.bg, color: s.c, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>;
}
function Av({ name, size = 36, bg = C.pm }) {
  const i = name ? name.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase() : "؟";
  return <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: C.w, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 700, flexShrink: 0 }}>{i}</div>;
}
function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(28,10,10,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" }}>
      <div style={{ background: C.w, borderRadius: 20, padding: 28, width: wide ? 700 : 520, maxWidth: "95vw", boxShadow: "0 40px 100px rgba(74,21,40,0.25)", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, direction: "rtl" }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: C.n200, border: "none", width: 30, height: 30, borderRadius: "50%", fontSize: 18, cursor: "pointer", color: C.textMid }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Inp({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{label}{required && <span style={{ color: C.rose }}> *</span>}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, outline: "none", boxSizing: "border-box", background: C.n100, textAlign: "right", fontFamily: "Tajawal,sans-serif", transition: "border 0.15s" }}
        onFocus={e => e.target.style.borderColor = C.p} onBlur={e => e.target.style.borderColor = C.border} />
    </div>
  );
}
function Sel({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{label}</label>}
      <select value={value} onChange={onChange} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, background: C.n100, boxSizing: "border-box", outline: "none", textAlign: "right", fontFamily: "Tajawal,sans-serif" }}>
        {options.map((o, i) => <option key={i} value={o.v ?? o}>{o.l ?? o}</option>)}
      </select>
    </div>
  );
}
function Btn({ children, onClick, v = "p", sm, full, disabled }) {
  const vs = { p: { bg: `linear-gradient(135deg,${C.p},${C.pl})`, c: C.w }, s: { bg: C.n200, c: C.textMid }, a: { bg: `linear-gradient(135deg,${C.a},${C.al})`, c: C.text }, d: { bg: C.roseBg, c: C.rose }, g: { bg: "transparent", c: C.p, border: `1.5px solid ${C.p}` }, teal: { bg: C.tealBg, c: C.teal } };
  const x = vs[v] || vs.p;
  return <button onClick={onClick} disabled={disabled} style={{ padding: sm ? "6px 13px" : "9px 20px", borderRadius: 9, border: x.border || "none", background: disabled ? C.n200 : x.bg, color: disabled ? C.textLight : x.c, fontSize: sm ? 12 : 13.5, fontWeight: 700, cursor: disabled ? "default" : "pointer", width: full ? "100%" : "auto", fontFamily: "Tajawal,sans-serif", opacity: disabled ? 0.7 : 1 }}>{children}</button>;
}
function Textarea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{label}</label>}
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, outline: "none", boxSizing: "border-box", background: C.n100, textAlign: "right", fontFamily: "Tajawal,sans-serif", resize: "vertical", lineHeight: 1.7, transition: "border 0.15s" }}
        onFocus={e => e.target.style.borderColor = C.p} onBlur={e => e.target.style.borderColor = C.border} />
    </div>
  );
}

/* ══════════════════════════════════════════
   LOGIN
══════════════════════════════════════════ */
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const login = async () => {
    if (!email || !pass) return;
    setLoading(true); setErr("");
    const res = await db.login(email, pass);
    if (res.access_token) { onLogin(res.access_token, res.user); }
    else setErr("بريد إلكتروني أو كلمة مرور غير صحيحة");
    setLoading(false);
  };
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(145deg,${C.p},${C.pm})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Tajawal,sans-serif" }}>
      <div style={{ background: C.w, borderRadius: 24, padding: "44px 40px", width: 420, maxWidth: "100%", boxShadow: "0 40px 100px rgba(74,21,40,0.4)" }}>
        <div style={{ textAlign: "center", marginBottom: 34 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg,${C.p},${C.pl})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 14px" }}>⚖️</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: C.p }}>Cabinet <span style={{ color: C.a }}>CML</span></h1>
          <p style={{ margin: "5px 0 2px", fontSize: 14, color: C.a, fontWeight: 700 }}>Mondher Laadhar</p>
          <p style={{ margin: 0, fontSize: 12, color: C.textLight }}>نظام إدارة المكتب القانوني</p>
        </div>
        <div style={{ direction: "rtl" }}>
          {[["البريد الإلكتروني","email",email,setEmail,"mondher@cabinet-cml.com"],["كلمة المرور","password",pass,setPass,"••••••••"]].map(([lbl,type,val,setter,ph]) => (
            <div key={lbl} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 6 }}>{lbl}</label>
              <input type={type} value={val} onChange={e => setter(e.target.value)} placeholder={ph}
                onKeyDown={e => e.key === "Enter" && login()}
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `2px solid ${C.border}`, fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box", background: C.n100, textAlign: "right", fontFamily: "Tajawal,sans-serif", transition: "border 0.15s" }}
                onFocus={e => e.target.style.borderColor = C.p} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          ))}
          {err && <div style={{ background: C.roseBg, color: C.rose, padding: "10px 14px", borderRadius: 9, fontSize: 13, marginBottom: 14, textAlign: "center", fontWeight: 600 }}>⚠️ {err}</div>}
          <button onClick={login} disabled={loading || !email || !pass}
            style={{ width: "100%", padding: "13px", borderRadius: 12, background: loading ? C.n200 : `linear-gradient(135deg,${C.p},${C.pl})`, color: loading ? C.textLight : C.w, border: "none", fontWeight: 800, fontSize: 15, cursor: loading ? "default" : "pointer", fontFamily: "Tajawal,sans-serif", boxShadow: loading ? "none" : `0 8px 24px ${C.p}40` }}>
            {loading ? "⏳ جاري الدخول..." : "تسجيل الدخول ←"}
          </button>
        </div>
        <p style={{ textAlign: "center", marginTop: 22, fontSize: 11, color: C.textLight }}>Cabinet CML © 2025</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
function Dashboard({ setNav, token }) {
  const [stats, setStats] = useState({ clients: 0, cases: 0, paid: 0, apts: 0 });
  const [recentCases, setRecentCases] = useState([]);
  const [upcomingApts, setUpcomingApts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([db.get("clients", token), db.get("cases", token), db.get("invoices", token), db.get("appointments", token)]).then(([cl, ca, inv, ap]) => {
      setStats({
        clients: Array.isArray(cl) ? cl.length : 0,
        cases: Array.isArray(ca) ? ca.filter(c => !["مغلقة","مكسوبة"].includes(c.status)).length : 0,
        paid: Array.isArray(inv) ? inv.filter(i => i.status === "مدفوعة").reduce((s, i) => s + Number(i.amount || 0), 0) : 0,
        apts: Array.isArray(ap) ? ap.filter(a => a.status !== "ملغي").length : 0,
      });
      setRecentCases(Array.isArray(ca) ? ca.slice(0, 5) : []);
      setUpcomingApts(Array.isArray(ap) ? ap.filter(a => a.status !== "ملغي").slice(0, 4) : []);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <Spinner />;

  return (
    <div style={{ direction: "rtl" }}>
      <div style={{ marginBottom: 26 }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>Bonjour, Maître Laadhar ⚖️</h2>
        <p style={{ margin: "4px 0 0", color: C.textLight, fontSize: 14 }}>Cabinet CML · البيانات محمية ومؤمّنة</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "إجمالي العملاء", value: stats.clients, icon: "👥", color: C.p },
          { label: "القضايا النشطة", value: stats.cases, icon: "⚖️", color: C.amber },
          { label: "المحصّل (د.ت)", value: stats.paid.toLocaleString(), icon: "💰", color: C.a },
          { label: "مواعيد قادمة", value: stats.apts, icon: "📅", color: C.green },
        ].map((k, i) => (
          <Card key={i} style={{ padding: "20px 22px", borderTop: `4px solid ${k.color}`, cursor: "pointer" }} onClick={() => setNav(["clients","cases","invoices","calendar"][i])}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700 }}>{k.label}</p>
                <p style={{ margin: "6px 0 0", fontSize: 30, fontWeight: 900, color: C.text, lineHeight: 1 }}>{k.value}</p>
              </div>
              <span style={{ fontSize: 26 }}>{k.icon}</span>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 18 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setNav("cases")} style={{ background: "none", border: "none", color: C.pl, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>← عرض الكل</button>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>أحدث القضايا</h3>
          </div>
          {recentCases.length === 0 ? <Empty icon="⚖️" msg="لا توجد قضايا" /> : recentCases.map((c, i) => (
            <div key={c.id} style={{ padding: "11px 20px", borderBottom: i < 4 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: C.text }}>{c.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: C.textLight }}>{c.client} {c.court ? `· ${c.court}` : ""}</p>
              </div>
              <Badge label={c.status} />
            </div>
          ))}
        </Card>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setNav("calendar")} style={{ background: "none", border: "none", color: C.pl, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>← عرض الكل</button>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>المواعيد القادمة</h3>
          </div>
          {upcomingApts.length === 0 ? <Empty icon="📅" msg="لا توجد مواعيد" /> : upcomingApts.map((a, i) => (
            <div key={a.id} style={{ padding: "11px 20px", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: C.text }}>{a.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: C.textLight }}>{a.client}</p>
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.p }}>{a.date}</p>
                <p style={{ margin: 0, fontSize: 11, color: C.textLight }}>{a.time}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
      <div style={{ background: `linear-gradient(135deg,${C.p},${C.pl})`, borderRadius: 16, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Btn v="a" onClick={() => setNav("ai")}>جرّب الآن ←</Btn>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, color: C.w, fontWeight: 700, fontSize: 16 }}>🤖 المساعد الذكي القانوني</p>
          <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.75)", fontSize: 13 }}>صياغة العقود · الاستشارات · تلخيص القضايا</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CLIENTS
══════════════════════════════════════════ */
function Clients({ token }) {
  const [search, setSearch] = useState(""); const [showAdd, setShowAdd] = useState(false);
  const [clients, setClients] = useState([]); const [loading, setLoading] = useState(true);
  const [tm, tt, show] = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", lawyer: "Mondher Laadhar" });

  useEffect(() => { db.get("clients", token).then(d => { if (Array.isArray(d)) setClients(d); setLoading(false); }); }, [token]);

  const filtered = clients.filter(c => c.name?.includes(search) || c.city?.includes(search));

  const save = async () => {
    if (!form.name) return;
    const res = await db.post("clients", { ...form, cases: 0, since: String(new Date().getFullYear()), status: "نشط" }, token);
    if (Array.isArray(res) && res[0]) { setClients([res[0], ...clients]); show("✅ تم إضافة العميل"); }
    setShowAdd(false); setForm({ name: "", email: "", phone: "", city: "", lawyer: "Mondher Laadhar" });
  };
  const remove = async (id) => { await db.del("clients", id, token); setClients(clients.filter(c => c.id !== id)); show("تم الحذف"); };

  return (
    <div style={{ direction: "rtl" }}>
      <Toast msg={tm} type={tt} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة عميل</Btn>
        <div><h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>العملاء</h2><p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${filtered.length} عميل`}</p></div>
      </div>
      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "13px 20px", borderBottom: `1px solid ${C.border}` }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  البحث عن عميل..."
            style={{ width: "100%", maxWidth: 280, padding: "8px 13px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, outline: "none", textAlign: "right", fontFamily: "Tajawal,sans-serif" }} />
        </div>
        {loading ? <Spinner /> : filtered.length === 0 ? <Empty icon="👥" msg="لا يوجد عملاء. أضف أول عميل!" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
              <thead><tr style={{ background: C.n100 }}>
                {["العميل","التواصل","المدينة","الحالة",""].map((h2, i) => <th key={i} style={{ padding: "10px 16px", textAlign: "right", fontSize: 11, fontWeight: 700, color: C.textLight }}>{h2}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse" }}>
                        <Av name={c.name} size={34} bg={i % 2 === 0 ? C.p : C.amber} />
                        <div style={{ textAlign: "right" }}><p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: C.text }}>{c.name}</p><p style={{ margin: 0, fontSize: 11, color: C.textLight }}>منذ {c.since}</p></div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}><p style={{ margin: 0, fontSize: 12 }}>{c.phone}</p><p style={{ margin: 0, fontSize: 11, color: C.textLight }}>{c.email}</p></td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: C.textMid, textAlign: "right" }}>{c.city}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}><Badge label={c.status || "نشط"} /></td>
                    <td style={{ padding: "12px 16px" }}><button onClick={() => remove(c.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>حذف</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {showAdd && (
        <Modal title="إضافة عميل جديد" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="الاسم الكامل" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Inp label="رقم الهاتف" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+216" />
            </div>
            <Inp label="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" />
            <Inp label="المدينة" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.name} full>💾 حفظ</Btn>
              <Btn v="s" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   CASES — avec édition complète
══════════════════════════════════════════ */
function Cases({ token }) {
  const [filter, setFilter] = useState("الكل");
  const [cases, setCases] = useState([]); const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editCase, setEditCase] = useState(null); // cas sélectionné pour détails
  const [tm, tt, show] = useToast();
  const [form, setForm] = useState({ title: "", client: "", type: "مدني", court: "", priority: "متوسطة", status: "مفتوحة", hearing_date: "", hearing_time: "", notes: "" });

  useEffect(() => {
    Promise.all([
      db.get("cases", token),
      db.get("clients", token),
    ]).then(([ca, cl]) => {
      if (Array.isArray(ca)) setCases(ca);
      if (Array.isArray(cl)) setClients(cl);
      setLoading(false);
    });
  }, [token]);

  const statuses = ["الكل","مفتوحة","قيد النظر","معلقة","مكسوبة","مغلقة"];
  const filtered = filter === "الكل" ? cases : cases.filter(c => c.status === filter);
  const TC = { "مدني": C.p, "تجاري": C.a, "أسري": C.amber, "جنائي": C.rose, "عمالي": C.purple, "إداري": C.green };

  const save = async () => {
    if (!form.title) return;
    const num = `CML-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3,"0")}`;
    const res = await db.post("cases", { ...form, number: num, lawyer: "Mondher Laadhar" }, token);
    if (Array.isArray(res) && res[0]) { setCases([res[0], ...cases]); show("✅ تم إضافة القضية"); }
    setShowAdd(false);
    setForm({ title: "", client: "", type: "مدني", court: "", priority: "متوسطة", status: "مفتوحة", hearing_date: "", hearing_time: "", notes: "" });
  };

  const updateCase = async (id, data) => {
    await db.patch("cases", id, data, token);
    setCases(cases.map(c => c.id === id ? { ...c, ...data } : c));
    if (editCase?.id === id) setEditCase(ec => ({ ...ec, ...data }));
    show("✅ تم التحديث");
  };

  const remove = async (id) => {
    await db.del("cases", id, token);
    setCases(cases.filter(c => c.id !== id));
    setEditCase(null);
    show("تم الحذف");
  };

  // Composant détail d'un cas
  const CaseDetail = ({ cas }) => {
    const [editForm, setEditForm] = useState({ ...cas });
    const [notes, setNotes] = useState(cas.notes || "");
    const [docs, setDocs] = useState([]);
    const [newDoc, setNewDoc] = useState({ name: "", url: "" });
    const [showDocForm, setShowDocForm] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      db.get("case_documents", token, `&case_id=eq.${cas.id}`).then(d => { if (Array.isArray(d)) setDocs(d); });
    }, [cas.id]);

    const saveChanges = async () => {
      setSaving(true);
      await updateCase(cas.id, { ...editForm, notes });
      setSaving(false);
    };

    const addDoc = async () => {
      if (!newDoc.name) return;
      const res = await db.post("case_documents", { case_id: cas.id, name: newDoc.name, url: newDoc.url }, token);
      if (Array.isArray(res) && res[0]) { setDocs([...docs, res[0]]); show("✅ تم إضافة المستند"); }
      setNewDoc({ name: "", url: "" }); setShowDocForm(false);
    };

    const removeDoc = async (id) => { await db.del("case_documents", id, token); setDocs(docs.filter(d => d.id !== id)); };

    return (
      <div style={{ direction: "rtl" }}>
        <button onClick={() => setEditCase(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.pl, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal,sans-serif", marginBottom: 16 }}>← العودة إلى القائمة</button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={saveChanges} disabled={saving}>{saving ? "⏳ جاري الحفظ..." : "💾 حفظ التغييرات"}</Btn>
            <Btn v="d" onClick={() => { if (window.confirm("حذف هذه القضية؟")) remove(cas.id); }}>🗑 حذف</Btn>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text }}>{cas.title}</h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: C.textLight, fontFamily: "monospace" }}>{cas.number}</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
          {/* Infos principales */}
          <Card style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.text }}>معلومات القضية</h3>
            <Inp label="عنوان القضية" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>اسم العميل</label>
              <select value={editForm.client || ""} onChange={e => setEditForm({ ...editForm, client: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, background: C.n100, outline: "none", textAlign: "right", fontFamily: "Tajawal,sans-serif" }}>
                <option value="">— اختر عميلاً —</option>
                {clients.map(cl => <option key={cl.id} value={cl.name}>{cl.name}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Sel label="نوع القضية" value={editForm.type || "مدني"} onChange={e => setEditForm({ ...editForm, type: e.target.value })} options={["مدني","تجاري","أسري","جنائي","عمالي","إداري"]} />
              <Sel label="الأولوية" value={editForm.priority || "متوسطة"} onChange={e => setEditForm({ ...editForm, priority: e.target.value })} options={["عاجلة","عالية","متوسطة","منخفضة"]} />
            </div>
            <Sel label="حالة القضية" value={editForm.status || "مفتوحة"} onChange={e => setEditForm({ ...editForm, status: e.target.value })} options={["مفتوحة","قيد النظر","معلقة","مكسوبة","مغلقة"]} />
            <Inp label="المحكمة" value={editForm.court || ""} onChange={e => setEditForm({ ...editForm, court: e.target.value })} />
          </Card>

          {/* Audience */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card style={{ padding: 20 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: C.text }}>📅 موعد الجلسة</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Inp label="تاريخ الجلسة" type="date" value={editForm.hearing_date || ""} onChange={e => setEditForm({ ...editForm, hearing_date: e.target.value })} />
                <Inp label="توقيت الجلسة" type="time" value={editForm.hearing_time || ""} onChange={e => setEditForm({ ...editForm, hearing_time: e.target.value })} />
              </div>
              {editForm.hearing_date && (
                <div style={{ background: C.amberBg, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.amber, fontWeight: 600 }}>
                  🗓 الجلسة القادمة: {editForm.hearing_date} {editForm.hearing_time ? `الساعة ${editForm.hearing_time}` : ""}
                </div>
              )}
            </Card>

            <Card style={{ padding: 20 }}>
              <h3 style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 700, color: C.text }}>📊 الحالة الحالية</h3>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <Badge label={editForm.status} /><Badge label={editForm.priority} />
                <span style={{ fontSize: 11, background: `${TC[editForm.type] || C.p}15`, color: TC[editForm.type] || C.p, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>{editForm.type}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Notes */}
        <Card style={{ padding: 20, marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: C.text }}>📝 الملاحظات والتعليقات</h3>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="أضف ملاحظاتك حول هذه القضية..." rows={5} />
        </Card>

        {/* Documents */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button onClick={() => setShowDocForm(!showDocForm)} style={{ background: `${C.p}12`, border: "none", color: C.p, padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>+ إضافة مستند</button>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>📎 المستندات والوثائق</h3>
          </div>
          {showDocForm && (
            <div style={{ background: C.n100, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Inp label="اسم المستند" value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} placeholder="مثال: عقد التوريد" />
                <Inp label="رابط المستند" value={newDoc.url} onChange={e => setNewDoc({ ...newDoc, url: e.target.value })} placeholder="https://..." />
              </div>
              <div style={{ display: "flex", gap: 8, flexDirection: "row-reverse" }}>
                <Btn onClick={addDoc} disabled={!newDoc.name}>إضافة</Btn>
                <Btn v="s" onClick={() => setShowDocForm(false)}>إلغاء</Btn>
              </div>
            </div>
          )}
          {docs.length === 0 ? <Empty icon="📎" msg="لا توجد مستندات مرفقة" /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {docs.map(doc => (
                <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.n100, borderRadius: 10 }}>
                  <button onClick={() => removeDoc(doc.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "4px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>حذف</button>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: C.text }}>📎 {doc.name}</p>
                    {doc.url && <a href={doc.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: C.pl }}>فتح الرابط ↗</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  if (editCase) return (
    <div>
      <Toast msg={tm} type={tt} />
      <CaseDetail cas={editCase} />
    </div>
  );

  return (
    <div style={{ direction: "rtl" }}>
      <Toast msg={tm} type={tt} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة قضية</Btn>
        <div><h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>القضايا</h2><p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${filtered.length} قضية`}</p></div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === s ? C.p : C.border}`, background: filter === s ? C.p : C.w, color: filter === s ? C.w : C.textMid, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>{s}</button>
        ))}
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? <Empty icon="⚖️" msg="لا توجد قضايا. أضف أول قضية!" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(c => (
            <Card key={c.id} style={{ padding: "16px 20px", cursor: "pointer", transition: "box-shadow 0.2s" }}
              onClick={() => setEditCase(c)}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(74,21,40,0.12)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 8px rgba(74,21,40,0.06)"}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, background: `${TC[c.type] || C.p}15`, color: TC[c.type] || C.p, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{c.type}</span>
                    <span style={{ fontSize: 11, color: C.textLight, fontFamily: "monospace" }}>{c.number}</span>
                    {c.hearing_date && <span style={{ fontSize: 11, background: C.amberBg, color: C.amber, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>🗓 {c.hearing_date}</span>}
                  </div>
                  <h3 style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 700, color: C.text }}>{c.title}</h3>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {c.client && <span style={{ fontSize: 12, color: C.textMid }}>👤 {c.client}</span>}
                    {c.court  && <span style={{ fontSize: 12, color: C.textMid }}>🏛️ {c.court}</span>}
                  </div>
                  {c.notes && <p style={{ margin: "6px 0 0", fontSize: 11.5, color: C.textLight, fontStyle: "italic" }}>📝 {c.notes.substring(0, 80)}{c.notes.length > 80 ? "..." : ""}</p>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
                  <Badge label={c.status} /><Badge label={c.priority} />
                  <span style={{ fontSize: 11, color: C.pl, fontWeight: 600 }}>← فتح التفاصيل</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="إضافة قضية جديدة" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <Inp label="عنوان القضية" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>اسم العميل</label>
              <select value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, background: C.n100, outline: "none", textAlign: "right", fontFamily: "Tajawal,sans-serif" }}>
                <option value="">— اختر عميلاً —</option>
                {clients.map(cl => <option key={cl.id} value={cl.name}>{cl.name}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Sel label="نوع القضية" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={["مدني","تجاري","أسري","جنائي","عمالي","إداري"]} />
              <Sel label="الأولوية" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} options={["عاجلة","عالية","متوسطة","منخفضة"]} />
            </div>
            <Inp label="المحكمة" value={form.court} onChange={e => setForm({ ...form, court: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="تاريخ الجلسة" type="date" value={form.hearing_date} onChange={e => setForm({ ...form, hearing_date: e.target.value })} />
              <Inp label="توقيت الجلسة" type="time" value={form.hearing_time} onChange={e => setForm({ ...form, hearing_time: e.target.value })} />
            </div>
            <Textarea label="ملاحظات" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="ملاحظات حول هذه القضية..." rows={3} />
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.title} full>💾 حفظ القضية</Btn>
              <Btn v="s" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   CALENDAR
══════════════════════════════════════════ */
function Calendar({ token }) {
  const [showAdd, setShowAdd] = useState(false);
  const [appointments, setAppointments] = useState([]); const [loading, setLoading] = useState(true);
  const [tm, tt, show] = useToast();
  const [form, setForm] = useState({ title: "", client: "", client_email: "", type: "استشارة", date: "", time: "", location: "" });
  const TC = { "استشارة": C.amber, "جلسة": C.rose, "اجتماع": C.p, "موعد": C.green };

  useEffect(() => { db.get("appointments", token).then(d => { if (Array.isArray(d)) setAppointments(d); setLoading(false); }); }, [token]);

  const save = async () => {
    if (!form.title) return;
    const res = await db.post("appointments", { ...form, lawyer: "Mondher Laadhar", status: "مجدول" }, token);
    if (Array.isArray(res) && res[0]) { setAppointments([res[0], ...appointments]); show("✅ تم إضافة الموعد"); }
    setShowAdd(false);
    setForm({ title: "", client: "", client_email: "", type: "استشارة", date: "", time: "", location: "" });
  };
  const cancel = async (id) => { await db.patch("appointments", id, { status: "ملغي" }, token); setAppointments(appointments.map(a => a.id === id ? { ...a, status: "ملغي" } : a)); show("تم الإلغاء"); };
  const remove = async (id) => { await db.del("appointments", id, token); setAppointments(appointments.filter(a => a.id !== id)); show("تم الحذف"); };

  return (
    <div style={{ direction: "rtl" }}>
      <Toast msg={tm} type={tt} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة موعد</Btn>
        <div><h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الأجندة</h2><p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${appointments.length} موعد`}</p></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[{l:"الكل",f:()=>appointments},{l:"مجدول",f:()=>appointments.filter(a=>a.status==="مجدول")},{l:"مؤكد",f:()=>appointments.filter(a=>a.status==="مؤكد")},{l:"ملغي",f:()=>appointments.filter(a=>a.status==="ملغي")}].map((s,i)=>(<Card key={i} style={{padding:"13px 18px",textAlign:"center",borderTop:`4px solid ${[C.p,C.sky,C.green,C.rose][i]}`}}><p style={{margin:0,fontSize:11,color:C.textLight,fontWeight:700}}>{s.l}</p><p style={{margin:"5px 0 0",fontSize:24,fontWeight:900,color:C.text}}>{s.f().length}</p></Card>))}
      </div>
      {loading ? <Spinner /> : appointments.length === 0 ? <Empty icon="📅" msg="لا توجد مواعيد. أضف أول موعد!" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {appointments.map(a => (
            <Card key={a.id} style={{ padding: "14px 18px", borderRight: `4px solid ${TC[a.type] || C.p}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 5, flexWrap: "wrap" }}><Badge label={a.status} /><span style={{ fontSize: 11, background: `${TC[a.type] || C.p}15`, color: TC[a.type] || C.p, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{a.type}</span></div>
                  <h3 style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 700, color: C.text }}>{a.title}</h3>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {a.client && <span style={{ fontSize: 12, color: C.textMid }}>👤 {a.client}</span>}
                    {a.location && <span style={{ fontSize: 12, color: C.textMid }}>📍 {a.location}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end", flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.p }}>{a.date}</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.textMid }}>{a.time}</p>
                  <div style={{ display: "flex", gap: 5 }}>
                    {a.status !== "ملغي" && <button onClick={() => cancel(a.id)} style={{ background: C.amberBg, border: "none", color: C.amber, padding: "3px 8px", borderRadius: 6, fontSize: 10, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>إلغاء</button>}
                    <button onClick={() => remove(a.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "3px 8px", borderRadius: 6, fontSize: 10, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>🗑</button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {showAdd && (
        <Modal title="إضافة موعد جديد" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <Inp label="عنوان الموعد" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="اسم العميل" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
              <Sel label="نوع الموعد" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={["استشارة","جلسة","اجتماع","موعد"]} />
            </div>
            <Inp label="📧 بريد العميل (للتذكير)" value={form.client_email} onChange={e => setForm({ ...form, client_email: e.target.value })} type="email" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="التاريخ" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} type="date" />
              <Inp label="الوقت" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="09:00 - 10:00" />
            </div>
            <Inp label="الموقع" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.title} full>💾 حفظ الموعد</Btn>
              <Btn v="s" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   INVOICES
══════════════════════════════════════════ */
function Invoices({ token }) {
  const [showAdd, setShowAdd] = useState(false);
  const [invoices, setInvoices] = useState([]); const [loading, setLoading] = useState(true);
  const [tm, tt, show] = useToast();
  const [form, setForm] = useState({ client: "", case_ref: "", amount: "", due: "" });

  useEffect(() => { db.get("invoices", token).then(d => { if (Array.isArray(d)) setInvoices(d); setLoading(false); }); }, [token]);

  const total = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
  const paid  = invoices.filter(i => i.status === "مدفوعة").reduce((s, i) => s + Number(i.amount || 0), 0);

  const upStatus = async (id, status) => { await db.patch("invoices", id, { status }, token); setInvoices(invoices.map(i => i.id === id ? { ...i, status } : i)); show(`تم التحديث: ${status}`); };
  const save = async () => {
    if (!form.client || !form.amount) return;
    const num = `CML-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3,"0")}`;
    const res = await db.post("invoices", { number: num, client: form.client, case_ref: form.case_ref, amount: parseFloat(form.amount), due: form.due, issued: new Date().toISOString().split("T")[0], status: "مسودة" }, token);
    if (Array.isArray(res) && res[0]) { setInvoices([res[0], ...invoices]); show("✅ تم إنشاء الفاتورة"); }
    setShowAdd(false); setForm({ client: "", case_ref: "", amount: "", due: "" });
  };
  const remove = async (id) => { await db.del("invoices", id, token); setInvoices(invoices.filter(i => i.id !== id)); show("تم الحذف"); };

  return (
    <div style={{ direction: "rtl" }}>
      <Toast msg={tm} type={tt} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <Btn onClick={() => setShowAdd(true)}>+ فاتورة جديدة</Btn>
        <div><h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الفواتير</h2><p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${invoices.length} فاتورة`}</p></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
        {[{l:"إجمالي الفواتير",v:`${total.toLocaleString()} د.ت`,color:C.p},{l:"تم التحصيل",v:`${paid.toLocaleString()} د.ت`,color:C.green},{l:"مدفوعة",v:invoices.filter(i=>i.status==="مدفوعة").length,color:C.green},{l:"متأخرة",v:invoices.filter(i=>i.status==="متأخرة").length,color:C.rose}].map((k,i)=>(<Card key={i} style={{padding:"16px 18px",borderTop:`4px solid ${k.color}`}}><p style={{margin:0,fontSize:11,color:C.textLight,fontWeight:700,textAlign:"right"}}>{k.l}</p><p style={{margin:"6px 0 0",fontSize:22,fontWeight:900,color:C.text,textAlign:"right"}}>{k.v}</p></Card>))}
      </div>
      <Card style={{ overflow: "hidden" }}>
        {loading ? <Spinner /> : invoices.length === 0 ? <Empty icon="📄" msg="لا توجد فواتير. أنشئ أول فاتورة!" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead><tr style={{ background: C.n100 }}>{["الرقم","العميل","المبلغ","الاستحقاق","الحالة","إجراء",""].map((h2,i)=><th key={i} style={{padding:"10px 14px",textAlign:"right",fontSize:11,fontWeight:700,color:C.textLight}}>{h2}</th>)}</tr></thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{padding:"12px 14px",fontSize:11,fontWeight:700,color:C.p,fontFamily:"monospace"}}>{inv.number}</td>
                    <td style={{padding:"12px 14px",fontSize:13,fontWeight:700,color:C.text}}>{inv.client}</td>
                    <td style={{padding:"12px 14px",fontSize:13,fontWeight:800,color:C.text}}>{Number(inv.amount||0).toLocaleString()} د.ت</td>
                    <td style={{padding:"12px 14px",fontSize:12,color:C.textMid}}>{inv.due}</td>
                    <td style={{padding:"12px 14px"}}><Badge label={inv.status}/></td>
                    <td style={{padding:"12px 14px"}}>
                      {inv.status==="مسودة" && <Btn sm onClick={()=>upStatus(inv.id,"مرسلة")}>إرسال</Btn>}
                      {inv.status==="مرسلة" && <Btn sm v="g" onClick={()=>upStatus(inv.id,"مدفوعة")}>تحصيل</Btn>}
                      {inv.status==="متأخرة" && <Btn sm v="d" onClick={()=>upStatus(inv.id,"مرسلة")}>تذكير</Btn>}
                      {inv.status==="مدفوعة" && <Btn sm v="s">PDF</Btn>}
                    </td>
                    <td style={{padding:"12px 14px"}}><button onClick={()=>remove(inv.id)} style={{background:C.roseBg,border:"none",color:C.rose,padding:"4px 8px",borderRadius:6,fontSize:10,cursor:"pointer",fontFamily:"Tajawal,sans-serif"}}>🗑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {showAdd && (
        <Modal title="فاتورة جديدة" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <Inp label="اسم العميل" required value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
            <Inp label="رقم القضية" value={form.case_ref} onChange={e => setForm({ ...form, case_ref: e.target.value })} placeholder="CML-2025-001" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="المبلغ (د.ت)" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
              <Inp label="تاريخ الاستحقاق" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} type="date" />
            </div>
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.client || !form.amount} full>💾 إنشاء الفاتورة</Btn>
              <Btn v="s" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   AI ASSISTANT
══════════════════════════════════════════ */
function AIAssistant() {
  const [input, setInput] = useState(""); const [result, setResult] = useState(""); const [loading, setLoading] = useState(false); const [taskIdx, setTaskIdx] = useState(0);
  const tasks = ["استشارة قانونية","صياغة عقد","تلخيص قضية","رد قانوني"];
  const demos = ["عميل يسأل عن حقوقه في فصل تعسفي بعد 8 سنوات.","صياغة عقد إيجار تجاري لمدة 3 سنوات بتونس.","نزاع بين شركتين تونسيتين حول عقد توريد بقيمة 50,000 د.ت.","رد على إنذار قانوني من دائن."];
  const generate = async () => {
    if (!input || loading) return;
    setLoading(true); setResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, system: `أنت مساعد قانوني متخصص في القانون التونسي. Cabinet CML (Mondher Laadhar). مهمتك: ${tasks[taskIdx]}. أجب بالعربية الفصحى، استشهد بمجلة الالتزامات والعقود.`, messages: [{ role: "user", content: input }] }) });
      const d = await res.json(); setResult(d.content?.[0]?.text || "خطأ.");
    } catch { setResult("خطأ في الاتصال."); }
    setLoading(false);
  };
  return (
    <div style={{ direction: "rtl" }}>
      <div style={{ marginBottom: 22 }}><h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>المساعد الذكي القانوني 🤖</h2><p style={{ margin: "4px 0 0", color: C.textLight, fontSize: 14 }}>مخصص للقانون التونسي · Claude AI</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setInput(demos[taskIdx])} style={{ padding: "5px 12px", background: C.ab, border: `1px solid ${C.a}`, color: C.amber, borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>← مثال</button>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>🎙 طلبك القانوني</h3>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {tasks.map((t, i) => <button key={i} onClick={() => setTaskIdx(i)} style={{ padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${taskIdx === i ? C.p : C.border}`, background: taskIdx === i ? C.p : C.w, color: taskIdx === i ? C.w : C.textMid, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>{t}</button>)}
            </div>
            <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="اكتب طلبك القانوني هنا..." rows={7} />
            <button onClick={generate} disabled={!input || loading} style={{ width: "100%", padding: "11px", borderRadius: 10, background: input && !loading ? `linear-gradient(135deg,${C.p},${C.pl})` : C.border, color: input && !loading ? C.w : C.textLight, border: "none", fontWeight: 700, fontSize: 14, cursor: input && !loading ? "pointer" : "default", fontFamily: "Tajawal,sans-serif" }}>
              {loading ? "⏳ جاري التحليل..." : "🤖 تنفيذ المهمة"}
            </button>
          </div>
        </Card>
        <Card style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, background: `${C.p}06`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>📋 النتيجة القانونية</h3>
            {result && !loading && <button onClick={() => navigator.clipboard?.writeText(result)} style={{ padding: "4px 10px", background: C.ab, border: "none", color: C.amber, borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>📋 نسخ</button>}
          </div>
          <div style={{ flex: 1, padding: 18 }}>
            {loading && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, gap: 14 }}><div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.p, animation: "spin 0.8s linear infinite" }} /><p style={{ color: C.textLight, fontSize: 13, margin: 0 }}>جاري المعالجة...</p></div>}
            {result && !loading && (<div><div style={{ background: C.n100, borderRadius: 12, padding: 16, fontSize: 13.5, color: C.textMid, lineHeight: 2, whiteSpace: "pre-line", maxHeight: 360, overflowY: "auto", textAlign: "right" }}>{result}</div><button onClick={() => { setResult(""); setInput(""); }} style={{ marginTop: 10, padding: "7px 14px", background: C.n200, color: C.textMid, border: "none", borderRadius: 9, fontSize: 12, cursor: "pointer" }}>↩ طلب جديد</button></div>)}
            {!result && !loading && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, color: C.textLight, gap: 10 }}><span style={{ fontSize: 48, opacity: 0.2 }}>⚖️</span><p style={{ fontSize: 13, margin: 0 }}>النتيجة ستظهر هنا</p></div>}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ANALYTICS
══════════════════════════════════════════ */
function Analytics({ token }) {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([db.get("clients", token), db.get("cases", token), db.get("invoices", token)]).then(([cl, ca, inv]) => {
      const clients = Array.isArray(cl) ? cl : []; const cases = Array.isArray(ca) ? ca : []; const invoices = Array.isArray(inv) ? inv : [];
      const now = new Date();
      const monthly = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const val = invoices.filter(iv => { if (!iv.created_at) return false; const id = new Date(iv.created_at); return id.getMonth() === d.getMonth() && id.getFullYear() === d.getFullYear() && iv.status === "مدفوعة"; }).reduce((s, x) => s + Number(x.amount || 0), 0);
        return { month: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"][d.getMonth()], val };
      });
      const maxVal = Math.max(...monthly.map(m => m.val), 1);
      setData({ clients: clients.length, cases: cases.length, won: cases.filter(c => c.status === "مكسوبة").length, totalPaid: invoices.filter(i => i.status === "مدفوعة").reduce((s, i) => s + Number(i.amount || 0), 0), monthly, maxVal });
      setLoading(false);
    });
  }, [token]);
  if (loading) return <Spinner />;
  if (!data) return null;
  const winRate = data.cases > 0 ? Math.round(data.won / data.cases * 100) : 0;
  return (
    <div style={{ direction: "rtl" }}>
      <div style={{ marginBottom: 22 }}><h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>التحليلات — Cabinet CML</h2></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[{l:"إجمالي العملاء",v:data.clients,color:C.p,icon:"👥"},{l:"القضايا",v:data.cases,color:C.amber,icon:"⚖️"},{l:"تم التحصيل",v:`${data.totalPaid.toLocaleString()} د.ت`,color:C.a,icon:"💰"},{l:"معدل الفوز",v:`${winRate}%`,color:C.green,icon:"🏆"}].map((k,i)=>(
          <Card key={i} style={{padding:"18px 20px",borderTop:`4px solid ${k.color}`}}><div style={{display:"flex",justifyContent:"space-between"}}><div><p style={{margin:0,fontSize:11,color:C.textLight,fontWeight:700}}>{k.l}</p><p style={{margin:"6px 0 0",fontSize:26,fontWeight:900,color:C.text}}>{k.v}</p></div><span style={{fontSize:24}}>{k.icon}</span></div></Card>
        ))}
      </div>
      <Card style={{ padding: 24 }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: C.text }}>الإيراد الشهري (د.ت)</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
          {data.monthly.map((m, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 9, color: C.textLight }}>{m.val > 0 ? `${(m.val/1000).toFixed(1)}K` : ""}</span>
              <div style={{ width: "100%", background: `linear-gradient(180deg,${C.pl},${C.p})`, borderRadius: "5px 5px 0 0", height: `${(m.val / data.maxVal) * 120}px`, minHeight: m.val > 0 ? 4 : 0 }} />
              <span style={{ fontSize: 9, color: C.textMid }}>{m.month}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   GESTION DES ACCÈS — page admin
══════════════════════════════════════════ */
function AccessPage({ token }) {
  const [users, setUsers] = useState([]); const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [tm, tt, show] = useToast();
  const [form, setForm] = useState({ email: "", name: "", role: "lawyer" });

  useEffect(() => { db.get("user_roles", token).then(d => { if (Array.isArray(d)) setUsers(d); setLoading(false); }); }, [token]);

  const save = async () => {
    if (!form.email || !form.name) return;
    const res = await db.post("user_roles", { ...form }, token);
    if (Array.isArray(res) && res[0]) { setUsers([res[0], ...users]); show("✅ تم إضافة المستخدم"); }
    setShowAdd(false); setForm({ email: "", name: "", role: "lawyer" });
  };

  const updateRole = async (id, role) => {
    await db.patch("user_roles", id, { role }, token);
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
    setEditUser(null);
    show("✅ تم تحديث الدور");
  };

  const remove = async (id) => { await db.del("user_roles", id, token); setUsers(users.filter(u => u.id !== id)); show("تم الحذف"); };

  const roleColors = { admin: C.p, lawyer: C.amber, collaborator: C.teal, secretary_lawyer: C.purple, secretary_collaborator: C.amber };

  return (
    <div style={{ direction: "rtl" }}>
      <Toast msg={tm} type={tt} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة مستخدم</Btn>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>🔐 إدارة الوصول والأدوار</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${users.length} مستخدم`}</p>
        </div>
      </div>

      {/* Légende des rôles */}
      <Card style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: C.text }}>الأدوار والصلاحيات</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {Object.entries(ROLES).map(([key, val]) => (
            <div key={key} style={{ background: `${roleColors[key]}10`, borderRadius: 12, padding: "12px 14px", border: `1.5px solid ${roleColors[key]}30` }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: roleColors[key] }}>{val.label}</p>
              <p style={{ margin: 0, fontSize: 11, color: C.textMid, lineHeight: 1.5 }}>
                {val.pages.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {loading ? <Spinner /> : users.length === 0 ? <Empty icon="👤" msg="لا يوجد مستخدمون" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {users.map((u, i) => (
            <Card key={u.id} style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexDirection: "row-reverse" }}>
                <Av name={u.name || u.email} size={44} bg={roleColors[u.role] || C.pm} />
                <div style={{ flex: 1, textAlign: "right" }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: C.text }}>{u.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textLight }}>{u.email}</p>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => remove(u.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "5px 10px", borderRadius: 7, fontSize: 11, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>حذف</button>
                  <button onClick={() => setEditUser(u)} style={{ background: `${C.p}12`, border: "none", color: C.p, padding: "5px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>تعديل الدور</button>
                  <Badge label={u.role} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="إضافة مستخدم جديد" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <div style={{ background: C.ab, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: C.amber }}>
              ℹ️ أضف المستخدم في Supabase > Authentication > Users أولاً، ثم سجّله هنا لتحديد دوره.
            </div>
            <Inp label="الاسم الكامل" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Inp label="البريد الإلكتروني" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" />
            <Sel label="الدور" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              options={Object.entries(ROLES).map(([k, v]) => ({ v: k, l: v.label }))} />
            <div style={{ background: C.n100, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12.5, color: C.textMid }}>
              <strong>صلاحيات الدور المختار:</strong> {ROLES[form.role]?.pages.join("، ")}
            </div>
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.name || !form.email} full>💾 إضافة</Btn>
              <Btn v="s" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

      {editUser && (
        <Modal title={`تعديل دور: ${editUser.name}`} onClose={() => setEditUser(null)}>
          <div style={{ direction: "rtl" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}><Av name={editUser.name} size={60} bg={roleColors[editUser.role] || C.pm} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {Object.entries(ROLES).map(([key, val]) => (
                <button key={key} onClick={() => updateRole(editUser.id, key)}
                  style={{ padding: "14px", borderRadius: 12, border: `2px solid ${editUser.role === key ? roleColors[key] : C.border}`, background: editUser.role === key ? `${roleColors[key]}12` : C.w, cursor: "pointer", textAlign: "right", fontFamily: "Tajawal,sans-serif", transition: "all 0.15s" }}>
                  <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 13, color: roleColors[key] }}>{val.label}</p>
                  <p style={{ margin: 0, fontSize: 10, color: C.textLight }}>{val.pages.slice(0, 3).join("، ")}{val.pages.length > 3 ? "..." : ""}</p>
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   GESTION DES AFFECTATIONS — page admin
══════════════════════════════════════════ */
function AssignmentsPage({ token }) {
  const [assignments, setAssignments] = useState([]); const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); const [showAdd, setShowAdd] = useState(false);
  const [tm, tt, show] = useToast();
  const [form, setForm] = useState({ secretary_id: "", secretary_email: "", assigned_to_id: "", assigned_to_email: "" });

  useEffect(() => {
    Promise.all([db.get("assignments", token), db.get("user_roles", token)]).then(([as, ur]) => {
      if (Array.isArray(as)) setAssignments(as);
      if (Array.isArray(ur)) setUsers(ur);
      setLoading(false);
    });
  }, [token]);

  const secretaries = users.filter(u => u.role === "secretary_lawyer" || u.role === "secretary_collaborator");
  const lawyers = users.filter(u => u.role === "lawyer" || u.role === "collaborator");

  const save = async () => {
    if (!form.secretary_id || !form.assigned_to_id) return;
    const res = await db.post("assignments", { ...form }, token);
    if (Array.isArray(res) && res[0]) { setAssignments([res[0], ...assignments]); show("✅ تم إنشاء الإسناد"); }
    setShowAdd(false); setForm({ secretary_id: "", secretary_email: "", assigned_to_id: "", assigned_to_email: "" });
  };

  const remove = async (id) => { await db.del("assignments", id, token); setAssignments(assignments.filter(a => a.id !== id)); show("تم حذف الإسناد"); };

  const getName = (email) => users.find(u => u.email === email)?.name || email;
  const getRole = (email) => users.find(u => u.email === email)?.role || "";

  return (
    <div style={{ direction: "rtl" }}>
      <Toast msg={tm} type={tt} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إنشاء إسناد</Btn>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>📋 إدارة الإسناد</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>ربط السكرتير بالمحامي أو المتعاون</p>
        </div>
      </div>

      <Card style={{ padding: 18, marginBottom: 18, borderRight: `4px solid ${C.amber}` }}>
        <p style={{ margin: 0, fontSize: 13.5, color: C.text, lineHeight: 1.7 }}>
          <strong>كيفية عمل الإسناد:</strong><br />
          🔹 سكرتير محامٍ ← يرى فقط بيانات المحامي المسند إليه<br />
          🔹 سكرتير متعاون ← يرى فقط بيانات المتعاون المسند إليه<br />
          🔹 فقط المدير يمكنه تعديل أو حذف الإسناد
        </p>
      </Card>

      {loading ? <Spinner /> : assignments.length === 0 ? <Empty icon="🔗" msg="لا توجد إسنادات. أنشئ أول إسناد!" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {assignments.map(a => {
            const secRole = getRole(a.secretary_email);
            const asRole = getRole(a.assigned_to_email);
            return (
              <Card key={a.id} style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexDirection: "row-reverse" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    {/* Secretary */}
                    <div style={{ background: C.purpleBg, borderRadius: 12, padding: "10px 16px", textAlign: "right", flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 11, color: C.purple, fontWeight: 700 }}>السكرتير</p>
                      <p style={{ margin: "3px 0 0", fontWeight: 700, fontSize: 13.5, color: C.text }}>{getName(a.secretary_email)}</p>
                      <p style={{ margin: "1px 0 0", fontSize: 11, color: C.textLight }}>{a.secretary_email}</p>
                      <Badge label={secRole} />
                    </div>
                    <div style={{ fontSize: 22, color: C.textLight, flexShrink: 0 }}>←</div>
                    {/* Assigned to */}
                    <div style={{ background: C.ab, borderRadius: 12, padding: "10px 16px", textAlign: "right", flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 11, color: C.amber, fontWeight: 700 }}>المسند إليه</p>
                      <p style={{ margin: "3px 0 0", fontWeight: 700, fontSize: 13.5, color: C.text }}>{getName(a.assigned_to_email)}</p>
                      <p style={{ margin: "1px 0 0", fontSize: 11, color: C.textLight }}>{a.assigned_to_email}</p>
                      <Badge label={asRole} />
                    </div>
                  </div>
                  <button onClick={() => remove(a.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "Tajawal,sans-serif", flexShrink: 0 }}>حذف الإسناد</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showAdd && (
        <Modal title="إنشاء إسناد جديد" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>السكرتير <span style={{ color: C.rose }}>*</span></label>
              <select value={form.secretary_email} onChange={e => { const u = users.find(u => u.email === e.target.value); setForm({ ...form, secretary_email: e.target.value, secretary_id: u?.id || "" }); }}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, background: C.n100, outline: "none", textAlign: "right", fontFamily: "Tajawal,sans-serif" }}>
                <option value="">— اختر السكرتير —</option>
                {secretaries.map(u => <option key={u.id} value={u.email}>{u.name} ({ROLES[u.role]?.label})</option>)}
              </select>
              {secretaries.length === 0 && <p style={{ margin: "5px 0 0", fontSize: 12, color: C.rose }}>لا يوجد سكرتير. أضف مستخدمين بدور سكرتير أولاً.</p>}
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>المسند إليه (محامٍ / متعاون) <span style={{ color: C.rose }}>*</span></label>
              <select value={form.assigned_to_email} onChange={e => { const u = users.find(u => u.email === e.target.value); setForm({ ...form, assigned_to_email: e.target.value, assigned_to_id: u?.id || "" }); }}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, background: C.n100, outline: "none", textAlign: "right", fontFamily: "Tajawal,sans-serif" }}>
                <option value="">— اختر المحامي أو المتعاون —</option>
                {lawyers.map(u => <option key={u.id} value={u.email}>{u.name} ({ROLES[u.role]?.label})</option>)}
              </select>
            </div>
            {form.secretary_email && form.assigned_to_email && (
              <div style={{ background: C.greenBg, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: C.green }}>
                ✅ سيتمكن {users.find(u => u.email === form.secretary_email)?.name} من رؤية بيانات {users.find(u => u.email === form.assigned_to_email)?.name} فقط
              </div>
            )}
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.secretary_id || !form.assigned_to_id} full>💾 إنشاء الإسناد</Btn>
              <Btn v="s" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════ */
function Settings({ onLogout }) {
  const [form, setForm] = useState({ name: "Mondher Laadhar", email: "mondher@cabinet-cml.com", phone: "+216 XX XXX XXX", office: "Cabinet Mondher Laadhar CML", license: "XXXXX/ن", sms: true, email_notif: true, reminders: true });
  const [tm, tt, show] = useToast();
  return (
    <div style={{ direction: "rtl" }}>
      <Toast msg={tm} type={tt} />
      <div style={{ marginBottom: 22 }}><h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الإعدادات</h2></div>
      <Card style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: C.text }}>الملف الشخصي — Cabinet CML</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Inp label="الاسم الكامل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Inp label="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Inp label="رقم الهاتف" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Inp label="رقم الترخيص" value={form.license} onChange={e => setForm({ ...form, license: e.target.value })} />
        </div>
        <Inp label="اسم المكتب" value={form.office} onChange={e => setForm({ ...form, office: e.target.value })} />
        <Btn onClick={() => show("✅ تم حفظ التغييرات")}>حفظ التغييرات</Btn>
      </Card>
      <Card style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: C.text }}>الإشعارات التلقائية</h3>
        {[{label:"تذكيرات المواعيد",key:"email_notif"},{label:"تنبيهات الجلسات",key:"reminders"},{label:"إشعارات SMS",key:"sms"}].map((n,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
            <button onClick={()=>setForm({...form,[n.key]:!form[n.key]})} style={{width:44,height:24,borderRadius:12,border:"none",background:form[n.key]?C.p:C.border,cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s"}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:C.w,position:"absolute",top:3,right:form[n.key]?3:23,transition:"right 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
            </button>
            <p style={{margin:0,fontSize:13.5,fontWeight:600,color:C.text}}>{n.label}</p>
          </div>
        ))}
      </Card>
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Btn v="d" onClick={onLogout}>🚪 تسجيل الخروج</Btn>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text }}>تسجيل الخروج</p>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   APP SHELL — avec gestion des rôles
══════════════════════════════════════════ */
export default function App() {
  const [nav, setNav] = useState("dashboard");
  const [token, setToken] = useState(() => localStorage.getItem("cml_token") || null);
  const [userRole, setUserRole] = useState("lawyer"); // rôle de l'utilisateur connecté
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingRole, setLoadingRole] = useState(false);

  const handleLogin = async (t, user) => {
    localStorage.setItem("cml_token", t);
    setToken(t);
    // Charger le rôle depuis user_roles
    setLoadingRole(true);
    const roles = await db.get("user_roles", t, `&email=eq.${encodeURIComponent(user.email)}`);
    if (Array.isArray(roles) && roles[0]) {
      setUserRole(roles[0].role);
      // Redirect admin to access page
      if (roles[0].role === "admin") setNav("access");
    } else {
      setUserRole("lawyer"); // par défaut
    }
    setLoadingRole(false);
  };

  const handleLogout = async () => {
    if (token) await db.logout(token);
    localStorage.removeItem("cml_token");
    setToken(null); setUserRole("lawyer"); setNav("dashboard");
  };

  // Définir les pages visibles selon le rôle
  const rolePages = ROLES[userRole]?.pages || ROLES.lawyer.pages;

  // Navigation items filtrés par rôle
  const ALL_NAV = [
    { id: "dashboard", label: "لوحة التحكم", icon: "⊞", adminOnly: false },
    { id: "clients",   label: "العملاء",      icon: "👥", adminOnly: false },
    { id: "cases",     label: "القضايا",      icon: "⚖️", adminOnly: false },
    { id: "calendar",  label: "الأجندة",      icon: "📅", adminOnly: false },
    { id: "invoices",  label: "الفواتير",     icon: "📄", adminOnly: false },
    { id: "ai",        label: "المساعد الذكي",icon: "🤖", adminOnly: false },
    { id: "analytics", label: "التحليلات",    icon: "📊", adminOnly: false },
    { id: "access",    label: "إدارة الوصول", icon: "🔐", adminOnly: true },
    { id: "assignments",label:"إدارة الإسناد",icon: "📋", adminOnly: true },
    { id: "settings",  label: "الإعدادات",    icon: "⚙️", adminOnly: false },
  ];

  const visibleNav = ALL_NAV.filter(item => {
    if (item.adminOnly) return userRole === "admin";
    return rolePages.includes(item.id);
  });

  // Redirection si page non autorisée
  useEffect(() => {
    if (token && !rolePages.includes(nav) && !(userRole === "admin" && ["access","assignments","settings"].includes(nav))) {
      setNav(rolePages[0] || "dashboard");
    }
  }, [nav, rolePages, userRole, token]);

  if (!token) return <LoginPage onLogin={handleLogin} />;
  if (loadingRole) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "Tajawal,sans-serif" }}><div style={{ textAlign: "center" }}><div style={{ width: 44, height: 44, borderRadius: "50%", border: `3px solid #E8DDD8`, borderTopColor: "#4A1528", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} /><p style={{ color: "#A08080", fontSize: 13 }}>جاري تحميل صلاحياتك...</p></div></div>;

  const renderPage = () => {
    switch (nav) {
      case "dashboard":   return <Dashboard setNav={setNav} token={token} />;
      case "clients":     return <Clients token={token} />;
      case "cases":       return <Cases token={token} />;
      case "calendar":    return <Calendar token={token} />;
      case "invoices":    return <Invoices token={token} />;
      case "ai":          return <AIAssistant />;
      case "analytics":   return <Analytics token={token} />;
      case "access":      return <AccessPage token={token} />;
      case "assignments":  return <AssignmentsPage token={token} />;
      case "settings":    return <Settings onLogout={handleLogout} />;
      default:            return <Dashboard setNav={setNav} token={token} />;
    }
  };

  const roleBadgeColor = { admin: C.p, lawyer: C.amber, collaborator: C.teal, secretary_lawyer: C.purple, secretary_collaborator: C.amber };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#FAF7F5;font-family:'Tajawal',sans-serif;direction:rtl}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#E8DDD8;border-radius:3px}
        @keyframes spin{to{transform:rotate(360deg)}}
        button,input,textarea,select{font-family:inherit}
        @media(max-width:768px){
          .sidebar{position:fixed!important;z-index:200;height:100vh;top:0;transform:translateX(100%);transition:transform 0.3s}
          .sidebar.open{transform:translateX(0);box-shadow:-8px 0 32px rgba(74,21,40,0.3)}
          .overlay{display:block!important}
          .page-pad{padding:16px!important}
          .grid-4{grid-template-columns:1fr 1fr!important}
          .grid-2{grid-template-columns:1fr!important}
        }
      `}</style>

      <div className="overlay" onClick={() => setSidebarOpen(false)}
        style={{ display: "none", position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199 }} />

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", direction: "rtl" }}>

        {/* SIDEBAR */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}
          style={{ width: 232, background: `linear-gradient(180deg,${C.p},${C.pm})`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${C.a},${C.al})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚖️</div>
              <div><p style={{ margin: 0, color: C.w, fontWeight: 900, fontSize: 15 }}>Cabinet <span style={{ color: C.a }}>CML</span></p><p style={{ margin: 0, color: C.a, fontSize: 10, fontWeight: 700 }}>Mondher Laadhar</p></div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
            {/* Indicateur de rôle */}
            <div style={{ padding: "6px 12px", marginBottom: 8 }}>
              <span style={{ fontSize: 10, background: `${roleBadgeColor[userRole] || C.a}30`, color: roleBadgeColor[userRole] || C.a, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>
                {ROLES[userRole]?.label || "محامٍ"}
              </span>
            </div>
            {visibleNav.map(item => {
              const active = nav === item.id;
              return (
                <button key={item.id} onClick={() => { setNav(item.id); setSidebarOpen(false); }}
                  style={{ width: "100%", textAlign: "right", padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? "rgba(255,255,255,0.13)" : "transparent", color: active ? C.w : "rgba(255,255,255,0.55)", fontSize: 13.5, fontWeight: active ? 700 : 500, marginBottom: 1, display: "flex", alignItems: "center", gap: 10, borderRight: `3px solid ${active ? C.a : "transparent"}`, fontFamily: "Tajawal,sans-serif", transition: "all 0.15s" }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                  {item.id === "ai" && <span style={{ marginRight: "auto", fontSize: 9, background: C.a, color: C.text, padding: "1px 6px", borderRadius: 10, fontWeight: 800 }}>AI</span>}
                  {item.adminOnly && <span style={{ marginRight: item.id === "access" ? "auto" : 0, fontSize: 9, background: "rgba(255,255,255,0.2)", color: C.w, padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>Admin</span>}
                </button>
              );
            })}
          </nav>

          <div style={{ padding: "12px 14px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Av name="Mondher Laadhar" size={32} bg={C.a} />
              <div><p style={{ margin: 0, color: C.w, fontSize: 12, fontWeight: 700 }}>Mondher Laadhar</p><p style={{ margin: 0, color: C.a, fontSize: 10, fontWeight: 600 }}>Avocat · محامٍ</p></div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, overflowY: "auto", background: C.bg, display: "flex", flexDirection: "column" }}>
          <div style={{ background: C.w, borderBottom: `1px solid ${C.border}`, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: "4px 8px", color: C.textMid, display: "none" }} className="burger" id="burgerBtn">☰</button>
              <span style={{ fontSize: 12, color: C.textLight }}>Cabinet CML</span>
              <span style={{ color: C.border }}>›</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{visibleNav.find(n => n.id === nav)?.label || "لوحة التحكم"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, background: C.ab, color: C.a, padding: "3px 10px", borderRadius: 20, fontWeight: 700, border: `1px solid ${C.a}` }}>Cabinet CML ⚖️</span>
              <button onClick={handleLogout} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>🚪 خروج</button>
            </div>
          </div>
          <div className="page-pad" style={{ padding: "24px 28px", flex: 1 }}>{renderPage()}</div>
        </main>
      </div>
      <style>{`@media(max-width:768px){#burgerBtn{display:block!important}}`}</style>
    </>
  );
}
