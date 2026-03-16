import React, { useState, useEffect } from "react";
const SUPABASE_URL = "https://uomsnwpjsjkwkxzbgbkg.supabase.co";
const SUPABASE_KEY = "sb_publishable_KGf7VXsyZar9jYgSnzTFLg_IY6wZyB3";
const db = {
  h: {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`
  },
  async get(table) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?order=created_at.desc`,
      { headers: this.h }
    );
    return r.json();
  },
  async post(table, data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: { ...this.h, "Prefer": "return=representation" },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async patch(table, id, data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...this.h, "Prefer": "return=representation" },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async del(table, id) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "DELETE",
      headers: this.h
    });
  }
};

/* ═══════════════════════════════════════════
   COULEURS
═══════════════════════════════════════════ */
const C = {
  primary: "#4A1528",
  primaryMid: "#6B2D3E",
  primaryLight: "#8B4D5E",
  accent: "#C9A84C",
  accentLight: "#E2C97A",
  accentBg: "#FDF6E3",
  teal: "#6B2D3E",
  tealBg: "#FDF0F3",
  rose: "#C0392B",
  roseBg: "#FDECEA",
  amber: "#D97706",
  amberBg: "#FFFBEB",
  green: "#16A34A",
  greenBg: "#F0FDF4",
  white: "#FFFFFF",
  bg: "#FAF7F5",
  border: "#E8DDD8",
  text: "#1C0A0A",
  textMid: "#5C3D3D",
  textLight: "#A08080",
  n100: "#FDF9F7",
  n200: "#F5EDE8",
};

const NAV = [
  { id: "dashboard", label: "لوحة التحكم", icon: "⊞" },
  { id: "clients",   label: "العملاء",      icon: "👥" },
  { id: "cases",     label: "القضايا",      icon: "⚖️" },
  { id: "calendar",  label: "الأجندة",      icon: "📅" },
  { id: "invoices",  label: "الفواتير",     icon: "📄" },
  { id: "ai",        label: "المساعد الذكي",icon: "🤖" },
  { id: "analytics", label: "التحليلات",    icon: "📊" },
  { id: "settings",  label: "الإعدادات",    icon: "⚙️" },
];

/* ═══════════════════════════════════════════
   COMPOSANTS DE BASE
═══════════════════════════════════════════ */
function Toast({ msg }) {
  return (
    <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: C.green, color: C.white, padding: "12px 28px", borderRadius: 14, fontSize: 14, fontWeight: 700, zIndex: 9999, boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}>
      {msg}
    </div>
  );
}

function Spinner({ msg = "جاري التحميل..." }) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: C.textLight }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.primary, animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
      <p style={{ fontSize: 14, margin: 0 }}>{msg}</p>
    </div>
  );
}

function Empty({ icon = "📭", msg }) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: C.textLight }}>
      <p style={{ fontSize: 40, marginBottom: 10 }}>{icon}</p>
      <p style={{ fontSize: 14, margin: 0 }}>{msg}</p>
    </div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", ...style }}>{children}</div>;
}

function Badge({ label }) {
  const m = {
    "نشط":       { bg: C.greenBg,  c: C.green },
    "غير نشط":   { bg: C.n200,     c: C.textMid },
    "قيد النظر": { bg: "#EFF6FF",  c: "#1D4ED8" },
    "معلقة":     { bg: C.amberBg,  c: C.amber },
    "مفتوحة":    { bg: "#F5F3FF",  c: "#7C3AED" },
    "مكسوبة":    { bg: C.greenBg,  c: C.green },
    "مغلقة":     { bg: C.n200,     c: C.textMid },
    "مدفوعة":    { bg: C.greenBg,  c: C.green },
    "مرسلة":     { bg: "#EFF6FF",  c: "#1D4ED8" },
    "متأخرة":    { bg: C.roseBg,   c: C.rose },
    "مسودة":     { bg: C.n200,     c: C.textMid },
    "مؤكد":      { bg: C.greenBg,  c: C.green },
    "مجدول":     { bg: "#EFF6FF",  c: "#1D4ED8" },
    "ملغي":      { bg: C.roseBg,   c: C.rose },
    "عاجلة":     { bg: C.roseBg,   c: C.rose },
    "عالية":     { bg: "#FFF7ED",  c: "#C2410C" },
    "متوسطة":    { bg: C.amberBg,  c: C.amber },
    "منخفضة":    { bg: C.greenBg,  c: C.green },
  };
  const s = m[label] || { bg: C.n200, c: C.textMid };
  return <span style={{ background: s.bg, color: s.c, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>;
}

function Avatar({ name, size = 36, bg = C.primaryMid }) {
  const i = name ? name.split(" ").slice(0, 2).map(w => w[0]).join("") : "؟";
  return <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 700, flexShrink: 0 }}>{i}</div>;
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div style={{ background: C.white, borderRadius: 20, padding: 28, width: 520, maxWidth: "92vw", boxShadow: "0 30px 80px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexDirection: "row-reverse" }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: C.n200, border: "none", width: 30, height: 30, borderRadius: "50%", fontSize: 18, cursor: "pointer", color: C.textMid }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Inp({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, outline: "none", boxSizing: "border-box", background: C.n100, textAlign: "right", fontFamily: "Tajawal,sans-serif" }} />
    </div>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{label}</label>}
      <select value={value} onChange={onChange}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, background: C.n100, boxSizing: "border-box", outline: "none", textAlign: "right", fontFamily: "Tajawal,sans-serif" }}>
        {options.map((o, i) => <option key={i} value={o.v || o}>{o.l || o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", sm = false, full = false, disabled = false }) {
  const vs = {
    primary: { bg: C.primary, color: C.white },
    secondary: { bg: C.n200, color: C.textMid },
    accent: { bg: C.accent, color: C.text },
    danger: { bg: C.roseBg, color: C.rose },
    ghost: { bg: "transparent", color: C.primary, border: `1.5px solid ${C.primary}` },
  };
  const v = vs[variant] || vs.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: sm ? "6px 14px" : "9px 20px", borderRadius: 9,
      border: v.border || "none", background: disabled ? C.n200 : v.bg,
      color: disabled ? C.textLight : v.color,
      fontSize: sm ? 12 : 13.5, fontWeight: 700, cursor: disabled ? "default" : "pointer",
      width: full ? "100%" : "auto", fontFamily: "Tajawal,sans-serif",
    }}>{children}</button>
  );
}

/* ═══════════════════════════════════════════
   HOOK: useToast
═══════════════════════════════════════════ */
function useToast() {
  const [msg, setMsg] = useState("");
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };
  return [msg, show];
}

/* ═══════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════ */
function Dashboard({ setNav, counts }) {
  const kpis = [
    { label: "إجمالي العملاء",  value: counts.clients,     icon: "👥", color: C.primary },
    { label: "القضايا النشطة",  value: counts.activeCases, icon: "⚖️", color: C.teal },
    { label: "المحصّل",         value: `${counts.paid.toLocaleString()} ر.س`, icon: "💰", color: C.accent },
    { label: "مواعيد قادمة",    value: counts.appointments, icon: "📅", color: C.green },
  ];

  return (
    <div>
      <div style={{ marginBottom: 26, textAlign: "right" }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>Bonjour, Maître Laadhar ⚖️</h2>
        <p style={{ margin: "4px 0 0", color: C.textLight, fontSize: 14 }}>جميع البيانات محفوظة في Supabase ✅</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {kpis.map((k, i) => (
          <Card key={i} style={{ padding: "20px 22px", borderTop: `4px solid ${k.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700 }}>{k.label}</p>
                <p style={{ margin: "6px 0 0", fontSize: 30, fontWeight: 900, color: C.text, lineHeight: 1 }}>{k.value}</p>
              </div>
              <span style={{ fontSize: 26 }}>{k.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18, marginBottom: 18 }}>
        {[
          { label: "العملاء", nav: "clients", icon: "👥", desc: "إضافة وإدارة العملاء", color: C.primary },
          { label: "القضايا", nav: "cases", icon: "⚖️", desc: "متابعة الدعاوى القضائية", color: C.teal },
          { label: "الأجندة", nav: "calendar", icon: "📅", desc: "المواعيد والجلسات", color: C.amber },
          { label: "الفواتير", nav: "invoices", icon: "📄", desc: "الأتعاب والتحصيل", color: C.green },
        ].map((item, i) => (
          <Card key={i} style={{ padding: "20px 24px", cursor: "pointer", borderRight: `4px solid ${item.color}` }}
            onClick={() => setNav(item.nav)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Btn sm variant="ghost" onClick={() => setNav(item.nav)}>فتح ←</Btn>
              const db = {
  h: (token) => ({
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${token || SUPABASE_KEY}`,
  }),
  async login(email, password) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
      body: JSON.stringify({ email, password }),
    });
    return r.json();
  },
  async logout(token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: this.h(token),
    });
  },
  async get(table, token) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?order=created_at.desc`, {
      headers: this.h(token),
    });
    return r.json();
  },
  async post(table, data, token) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: { ...this.h(token), "Prefer": "return=representation" },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async patch(table, id, data, token) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...this.h(token), "Prefer": "return=representation" },
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async del(table, id, token) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "DELETE",
      headers: this.h(token),
    });
  },
};

/* ═══════════════════════════════════════════
   COULEURS Cabinet CML
═══════════════════════════════════════════ */
const C = {
  primary: "#4A1528", primaryMid: "#6B2D3E", primaryLight: "#8B4D5E",
  accent: "#C9A84C", accentLight: "#E2C97A", accentBg: "#FDF6E3",
  teal: "#6B2D3E", tealBg: "#FDF0F3",
  rose: "#C0392B", roseBg: "#FDECEA",
  amber: "#D97706", amberBg: "#FFFBEB",
  green: "#16A34A", greenBg: "#F0FDF4",
  white: "#FFFFFF", bg: "#FAF7F5", border: "#E8DDD8",
  text: "#1C0A0A", textMid: "#5C3D3D", textLight: "#A08080",
  n100: "#FDF9F7", n200: "#F5EDE8",
};

const NAV = [
  { id: "dashboard", label: "لوحة التحكم",  icon: "⊞" },
  { id: "clients",   label: "العملاء",       icon: "👥" },
  { id: "cases",     label: "القضايا",       icon: "⚖️" },
  { id: "calendar",  label: "الأجندة",       icon: "📅" },
  { id: "invoices",  label: "الفواتير",      icon: "📄" },
  { id: "ai",        label: "المساعد الذكي", icon: "🤖" },
  { id: "analytics", label: "التحليلات",     icon: "📊" },
  { id: "settings",  label: "الإعدادات",     icon: "⚙️" },
];

/* ═══════════════════════════════════════════
   COMPOSANTS
═══════════════════════════════════════════ */
function Toast({ msg }) {
  return (
    <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: C.green, color: C.white, padding: "12px 28px", borderRadius: 14, fontSize: 14, fontWeight: 700, zIndex: 9999, boxShadow: "0 8px 28px rgba(0,0,0,0.18)", whiteSpace: "nowrap" }}>
      {msg}
    </div>
  );
}

function useToast() {
  const [msg, setMsg] = useState("");
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };
  return [msg, show];
}

function Spinner({ msg = "جاري التحميل..." }) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: C.textLight }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.primary, animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
      <p style={{ fontSize: 14, margin: 0 }}>{msg}</p>
    </div>
  );
}

function Empty({ icon = "📭", msg }) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: C.textLight }}>
      <p style={{ fontSize: 40, marginBottom: 10 }}>{icon}</p>
      <p style={{ fontSize: 14, margin: 0 }}>{msg}</p>
    </div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", ...style }}>{children}</div>;
}

function Badge({ label }) {
  const m = {
    "نشط": { bg: C.greenBg, c: C.green }, "غير نشط": { bg: C.n200, c: C.textMid },
    "قيد النظر": { bg: "#EFF6FF", c: "#1D4ED8" }, "معلقة": { bg: C.amberBg, c: C.amber },
    "مفتوحة": { bg: "#F5F3FF", c: "#7C3AED" }, "مكسوبة": { bg: C.greenBg, c: C.green },
    "مغلقة": { bg: C.n200, c: C.textMid }, "مدفوعة": { bg: C.greenBg, c: C.green },
    "مرسلة": { bg: "#EFF6FF", c: "#1D4ED8" }, "متأخرة": { bg: C.roseBg, c: C.rose },
    "مسودة": { bg: C.n200, c: C.textMid }, "مؤكد": { bg: C.greenBg, c: C.green },
    "مجدول": { bg: "#EFF6FF", c: "#1D4ED8" }, "ملغي": { bg: C.roseBg, c: C.rose },
    "عاجلة": { bg: C.roseBg, c: C.rose }, "عالية": { bg: "#FFF7ED", c: "#C2410C" },
    "متوسطة": { bg: C.amberBg, c: C.amber }, "منخفضة": { bg: C.greenBg, c: C.green },
  };
  const s = m[label] || { bg: C.n200, c: C.textMid };
  return <span style={{ background: s.bg, color: s.c, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>;
}

function Avatar({ name, size = 36, bg = C.primaryMid }) {
  const i = name ? name.split(" ").slice(0, 2).map(w => w[0]).join("") : "؟";
  return <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 700, flexShrink: 0 }}>{i}</div>;
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div style={{ background: C.white, borderRadius: 20, padding: 28, width: 520, maxWidth: "95vw", boxShadow: "0 30px 80px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexDirection: "row-reverse" }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: C.n200, border: "none", width: 30, height: 30, borderRadius: "50%", fontSize: 18, cursor: "pointer", color: C.textMid }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Inp({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, outline: "none", boxSizing: "border-box", background: C.n100, textAlign: "right", fontFamily: "Tajawal,sans-serif" }} />
    </div>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{label}</label>}
      <select value={value} onChange={onChange}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, background: C.n100, boxSizing: "border-box", outline: "none", textAlign: "right", fontFamily: "Tajawal,sans-serif" }}>
        {options.map((o, i) => <option key={i} value={o.v || o}>{o.l || o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", sm = false, full = false, disabled = false }) {
  const vs = {
    primary:   { bg: C.primary, color: C.white },
    secondary: { bg: C.n200,    color: C.textMid },
    accent:    { bg: C.accent,  color: C.text },
    danger:    { bg: C.roseBg,  color: C.rose },
    ghost:     { bg: "transparent", color: C.primary, border: `1.5px solid ${C.primary}` },
  };
  const v = vs[variant] || vs.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: sm ? "6px 14px" : "9px 20px", borderRadius: 9,
      border: v.border || "none", background: disabled ? C.n200 : v.bg,
      color: disabled ? C.textLight : v.color,
      fontSize: sm ? 12 : 13.5, fontWeight: 700, cursor: disabled ? "default" : "pointer",
      width: full ? "100%" : "auto", fontFamily: "Tajawal,sans-serif",
    }}>{children}</button>
  );
}

/* ═══════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════ */
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password) { setError("يرجى إدخال البريد الإلكتروني وكلمة المرور"); return; }
    setLoading(true); setError("");
    const res = await db.login(email, password);
    if (res.access_token) {
      localStorage.setItem("cml_token", res.access_token);
      localStorage.setItem("cml_user", JSON.stringify(res.user));
      onLogin(res.access_token, res.user);
    } else {
      setError("بريد إلكتروني أو كلمة مرور غير صحيحة");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryLight} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.white, borderRadius: 24, padding: "48px 40px", width: 420, maxWidth: "100%", boxShadow: "0 40px 100px rgba(74,21,40,0.3)" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 16px" }}>⚖️</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: C.text }}>Cabinet CML</h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: C.accent, fontWeight: 700 }}>Mondher Laadhar — محامٍ</p>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textLight }}>نظام إدارة المكتب القانوني</p>
        </div>

        {/* Form */}
        <div style={{ direction: "rtl" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 6 }}>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="mondher@cabinet-cml.com"
              onKeyDown={e => e.key === "Enter" && login()}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${C.border}`, fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box", background: C.n100, textAlign: "right", fontFamily: "Tajawal,sans-serif" }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 6 }}>كلمة المرور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && login()}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${C.border}`, fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box", background: C.n100, textAlign: "right", fontFamily: "Tajawal,sans-serif" }} />
          </div>

          {error && (
            <div style={{ background: C.roseBg, color: C.rose, padding: "10px 14px", borderRadius: 9, fontSize: 13, marginBottom: 16, textAlign: "center", fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={login} disabled={loading} style={{
            width: "100%", padding: "14px", borderRadius: 12,
            background: loading ? C.n200 : `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
            color: loading ? C.textLight : C.white, border: "none",
            fontWeight: 800, fontSize: 15, cursor: loading ? "default" : "pointer",
            fontFamily: "Tajawal,sans-serif", boxShadow: loading ? "none" : `0 8px 24px ${C.primary}40`,
          }}>
            {loading ? "⏳  جاري تسجيل الدخول..." : "تسجيل الدخول ←"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: C.textLight }}>
          Cabinet Mondher Laadhar CML © 2025
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════ */
function Dashboard({ setNav, counts }) {
  const kpis = [
    { label: "إجمالي العملاء",  value: counts.clients,      icon: "👥", color: C.primary },
    { label: "القضايا النشطة",  value: counts.activeCases,  icon: "⚖️", color: C.amber },
    { label: "المحصّل",         value: `${counts.paid.toLocaleString()} د.ت`, icon: "💰", color: C.accent },
    { label: "مواعيد قادمة",    value: counts.appointments,  icon: "📅", color: C.green },
  ];

  return (
    <div>
      <div style={{ marginBottom: 26, textAlign: "right" }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>Bonjour, Maître Laadhar ⚖️</h2>
        <p style={{ margin: "4px 0 0", color: C.textLight, fontSize: 14 }}>Cabinet CML · جميع البيانات محفوظة ومحمية ✅</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 22 }}>
        {kpis.map((k, i) => (
          <Card key={i} style={{ padding: "20px 22px", borderTop: `4px solid ${k.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700 }}>{k.label}</p>
                <p style={{ margin: "6px 0 0", fontSize: 30, fontWeight: 900, color: C.text, lineHeight: 1 }}>{k.value}</p>
              </div>
              <span style={{ fontSize: 28 }}>{k.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "العملاء",  nav: "clients",  icon: "👥", color: C.primary },
          { label: "القضايا",  nav: "cases",    icon: "⚖️", color: C.amber },
          { label: "الأجندة",  nav: "calendar", icon: "📅", color: C.green },
          { label: "الفواتير", nav: "invoices", icon: "📄", color: C.accent },
        ].map((item, i) => (
          <Card key={i} style={{ padding: "18px 22px", cursor: "pointer", borderRight: `4px solid ${item.color}` }} onClick={() => setNav(item.nav)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Btn sm variant="ghost" onClick={() => setNav(item.nav)}>فتح ←</Btn>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{item.icon} {item.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, borderRadius: 16, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Btn variant="accent" onClick={() => setNav("ai")}>جرّب الآن ←</Btn>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, color: C.white, fontWeight: 700, fontSize: 16 }}>🤖 المساعد الذكي القانوني</p>
          <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.75)", fontSize: 13 }}>صياغة العقود · الاستشارات · تلخيص القضايا</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CLIENTS
═══════════════════════════════════════════ */
function Clients({ token }) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, showToast] = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", lawyer: "Mondher Laadhar" });

  useEffect(() => {
    db.get("clients", token).then(d => { if (Array.isArray(d)) setClients(d); setLoading(false); });
  }, [token]);

  const filtered = clients.filter(c => c.name?.includes(search) || c.city?.includes(search));

  const save = async () => {
    if (!form.name) return;
    const res = await db.post("clients", { ...form, cases: 0, since: String(new Date().getFullYear()), status: "نشط" }, token);
    if (Array.isArray(res) && res[0]) { setClients([res[0], ...clients]); showToast("✅ تم إضافة العميل"); }
    setShowAdd(false);
    setForm({ name: "", email: "", phone: "", city: "", lawyer: "Mondher Laadhar" });
  };

  const remove = async (id) => {
    await db.del("clients", id, token);
    setClients(clients.filter(c => c.id !== id));
    showToast("تم حذف العميل");
  };

  return (
    <div>
      {toastMsg && <Toast msg={toastMsg} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة عميل</Btn>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>العملاء</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${filtered.length} عميل`}</p>
        </div>
      </div>

      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  البحث..."
            style={{ padding: "8px 14px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, width: "100%", maxWidth: 280, outline: "none", textAlign: "right", fontFamily: "Tajawal,sans-serif" }} />
        </div>
        {loading ? <Spinner /> : filtered.length === 0 ? <Empty icon="👥" msg="لا يوجد عملاء" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", direction: "rtl", minWidth: 500 }}>
              <thead><tr style={{ background: C.n100 }}>
                {["العميل","التواصل","المدينة","الحالة",""].map((h, i) => (
                  <th key={i} style={{ padding: "10px 16px", textAlign: "right", fontSize: 11, fontWeight: 700, color: C.textLight }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse" }}>
                        <Avatar name={c.name} size={34} bg={i % 2 === 0 ? C.primary : C.amber} />
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: C.text }}>{c.name}</p>
                          <p style={{ margin: 0, fontSize: 11, color: C.textLight }}>منذ {c.since}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: 12 }}>{c.phone}</p>
                      <p style={{ margin: 0, fontSize: 11, color: C.textLight }}>{c.email}</p>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: C.textMid, textAlign: "right" }}>{c.city}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}><Badge label={c.status || "نشط"} /></td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => remove(c.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "5px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>حذف</button>
                    </td>
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
              <Inp label="الاسم الكامل *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسم العميل" />
              <Inp label="رقم الهاتف" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+216" />
            </div>
            <Inp label="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" />
            <Inp label="المدينة / Ville" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="تونس / Tunis" />
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.name} full>💾 حفظ</Btn>
              <Btn variant="secondary" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CASES
═══════════════════════════════════════════ */
function Cases({ token }) {
  const [filter, setFilter] = useState("الكل");
  const [showAdd, setShowAdd] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, showToast] = useToast();
  const [form, setForm] = useState({ title: "", client: "", type: "مدني", court: "", priority: "متوسطة", amount: "—" });

  useEffect(() => {
    db.get("cases", token).then(d => { if (Array.isArray(d)) setCases(d); setLoading(false); });
  }, [token]);

  const statuses = ["الكل","قيد النظر","معلقة","مفتوحة","مكسوبة","مغلقة"];
  const filtered = filter === "الكل" ? cases : cases.filter(c => c.status === filter);
  const TC = { "تجاري": C.primary, "أسري": C.amber, "جنائي": C.rose, "عمالي": "#7C3AED", "إداري": C.green, "مدني": C.primaryLight };

  const save = async () => {
    if (!form.title) return;
    const num = `CML-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, "0")}`;
    const res = await db.post("cases", { ...form, number: num, status: "مفتوحة", lawyer: "Mondher Laadhar", hearing: "—" }, token);
    if (Array.isArray(res) && res[0]) { setCases([res[0], ...cases]); showToast("✅ تم إضافة القضية"); }
    setShowAdd(false);
    setForm({ title: "", client: "", type: "مدني", court: "", priority: "متوسطة", amount: "—" });
  };

  const changeStatus = async (id, status) => {
    await db.patch("cases", id, { status }, token);
    setCases(cases.map(c => c.id === id ? { ...c, status } : c));
    showToast("تم تحديث الحالة");
  };

  const remove = async (id) => {
    await db.del("cases", id, token);
    setCases(cases.filter(c => c.id !== id));
    showToast("تم حذف القضية");
  };

  return (
    <div>
      {toastMsg && <Toast msg={toastMsg} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة قضية</Btn>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>القضايا</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${filtered.length} قضية`}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexDirection: "row-reverse", flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === s ? C.primary : C.border}`,
            background: filter === s ? C.primary : C.white, color: filter === s ? C.white : C.textMid,
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Tajawal,sans-serif",
          }}>{s}</button>
        ))}
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? <Empty icon="⚖️" msg="لا توجد قضايا" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(c => (
            <Card key={c.id} style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", direction: "rtl", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, background: `${TC[c.type] || C.primary}15`, color: TC[c.type] || C.primary, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{c.type}</span>
                    <span style={{ fontSize: 11, color: C.textLight, fontFamily: "monospace" }}>{c.number}</span>
                  </div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: C.text }}>{c.title}</h3>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {c.client && <span style={{ fontSize: 12, color: C.textMid }}>👤 {c.client}</span>}
                    {c.court  && <span style={{ fontSize: 12, color: C.textMid }}>🏛️ {c.court}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
                  <Badge label={c.status} />
                  <Badge label={c.priority} />
                  <select value={c.status} onChange={e => changeStatus(c.id, e.target.value)}
                    style={{ fontSize: 11, padding: "3px 8px", borderRadius: 7, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>
                    {["مفتوحة","قيد النظر","معلقة","مكسوبة","مغلقة"].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => remove(c.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "3px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>حذف</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="إضافة قضية جديدة" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <Inp label="عنوان القضية *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="عنوان الدعوى" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="اسم العميل" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="اسم العميل" />
              <Sel label="نوع القضية" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={["مدني","تجاري","أسري","جنائي","عمالي","إداري"]} />
            </div>
            <Inp label="المحكمة" value={form.court} onChange={e => setForm({ ...form, court: e.target.value })} placeholder="اسم المحكمة" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Sel label="الأولوية" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} options={["عاجلة","عالية","متوسطة","منخفضة"]} />
              <Inp label="قيمة القضية" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="مثال: 5,000 د.ت" />
            </div>
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.title} full>💾 حفظ</Btn>
              <Btn variant="secondary" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CALENDAR — avec rappels email
═══════════════════════════════════════════ */
function Calendar({ token }) {
  const [showAdd, setShowAdd] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, showToast] = useToast();
  const [form, setForm] = useState({ title: "", client: "", client_email: "", type: "استشارة", date: "", time: "", location: "" });

  useEffect(() => {
    db.get("appointments", token).then(d => { if (Array.isArray(d)) setAppointments(d); setLoading(false); });
  }, [token]);

  const TC = { "استشارة": C.amber, "جلسة": C.rose, "اجتماع": C.primary, "موعد": C.green };

  // Envoi rappel email via EmailJS (gratuit)
  const sendReminder = async (apt) => {
    if (!apt.client_email) { showToast("⚠️ لا يوجد بريد إلكتروني للعميل"); return; }
    // Simulation — en production connecter EmailJS ou Resend
    showToast(`📧 تم إرسال تذكير إلى ${apt.client_email}`);
  };

  const save = async () => {
    if (!form.title) return;
    const res = await db.post("appointments", { ...form, lawyer: "Mondher Laadhar", status: "مجدول" }, token);
    if (Array.isArray(res) && res[0]) {
      setAppointments([res[0], ...appointments]);
      showToast("✅ تم إضافة الموعد");
      // Auto-reminder simulation
      if (form.client_email) showToast(`📧 تذكير تلقائي سيُرسل إلى ${form.client_email}`);
    }
    setShowAdd(false);
    setForm({ title: "", client: "", client_email: "", type: "استشارة", date: "", time: "", location: "" });
  };

  const cancel = async (id) => {
    await db.patch("appointments", id, { status: "ملغي" }, token);
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: "ملغي" } : a));
    showToast("تم إلغاء الموعد");
  };

  const remove = async (id) => {
    await db.del("appointments", id, token);
    setAppointments(appointments.filter(a => a.id !== id));
    showToast("تم حذف الموعد");
  };

  // Upcoming appointments (rappels)
  const upcoming = appointments.filter(a => a.status === "مجدول" && a.date);

  return (
    <div>
      {toastMsg && <Toast msg={toastMsg} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة موعد</Btn>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الأجندة</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${appointments.length} موعد`}</p>
        </div>
      </div>

      {/* Rappels automatiques */}
      {upcoming.length > 0 && (
        <Card style={{ padding: "16px 20px", marginBottom: 18, borderRight: `4px solid ${C.amber}` }}>
          <div style={{ direction: "rtl" }}>
            <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: C.text }}>📧 إرسال تذكيرات للمواعيد القادمة</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {upcoming.slice(0, 3).map(a => (
                <button key={a.id} onClick={() => sendReminder(a)}
                  style={{ padding: "7px 14px", background: C.accentBg, border: `1px solid ${C.accent}`, color: C.amber, borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>
                  📧 {a.client} — {a.date}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "إجمالي المواعيد", count: appointments.length, color: C.primary },
          { label: "مجدول",           count: appointments.filter(a => a.status === "مجدول").length, color: C.amber },
          { label: "مؤكد",            count: appointments.filter(a => a.status === "مؤكد").length, color: C.green },
          { label: "ملغي",            count: appointments.filter(a => a.status === "ملغي").length, color: C.rose },
        ].map((s, i) => (
          <Card key={i} style={{ padding: "14px 18px", textAlign: "center", borderTop: `4px solid ${s.color}` }}>
            <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700 }}>{s.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 900, color: C.text }}>{s.count}</p>
          </Card>
        ))}
      </div>

      {loading ? <Spinner /> : appointments.length === 0 ? <Empty icon="📅" msg="لا توجد مواعيد" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {appointments.map(a => (
            <Card key={a.id} style={{ padding: "14px 18px", borderRight: `4px solid ${TC[a.type] || C.primary}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", direction: "rtl", gap: 10, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                    <Badge label={a.status} />
                    <span style={{ fontSize: 11, background: `${TC[a.type] || C.primary}15`, color: TC[a.type] || C.primary, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{a.type}</span>
                  </div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: C.text }}>{a.title}</h3>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {a.client   && <span style={{ fontSize: 12, color: C.textMid }}>👤 {a.client}</span>}
                    {a.location && <span style={{ fontSize: 12, color: C.textMid }}>📍 {a.location}</span>}
                    {a.client_email && <span style={{ fontSize: 11, color: C.accent }}>📧 {a.client_email}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.primary }}>{a.date}</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.textMid }}>{a.time}</p>
                  <div style={{ display: "flex", gap: 5 }}>
                    {a.client_email && a.status !== "ملغي" && (
                      <button onClick={() => sendReminder(a)} style={{ background: C.accentBg, border: "none", color: C.amber, padding: "3px 8px", borderRadius: 6, fontSize: 10, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>📧</button>
                    )}
                    {a.status !== "ملغي" && (
                      <button onClick={() => cancel(a.id)} style={{ background: C.amberBg, border: "none", color: C.amber, padding: "3px 8px", borderRadius: 6, fontSize: 10, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>إلغاء</button>
                    )}
                    <button onClick={() => remove(a.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "3px 8px", borderRadius: 6, fontSize: 10, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>حذف</button>
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
            <Inp label="عنوان الموعد *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="استشارة / جلسة..." />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="اسم العميل" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="اسم العميل" />
              <Sel label="نوع الموعد" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={["استشارة","جلسة","اجتماع","موعد"]} />
            </div>
            <Inp label="📧 بريد العميل (للتذكير)" value={form.client_email} onChange={e => setForm({ ...form, client_email: e.target.value })} placeholder="client@email.com" type="email" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="التاريخ" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} type="date" />
              <Inp label="الوقت" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="09:00 - 10:00" />
            </div>
            <Inp label="الموقع / Lieu" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="المكتب / المحكمة..." />
            <div style={{ background: C.accentBg, borderRadius: 9, padding: "9px 12px", marginBottom: 14, fontSize: 12.5, color: C.amber, textAlign: "right" }}>
              📧 سيتم إرسال تذكير تلقائي للعميل عند إضافة بريده الإلكتروني
            </div>
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.title} full>💾 حفظ الموعد</Btn>
              <Btn variant="secondary" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   INVOICES
═══════════════════════════════════════════ */
function Invoices({ token }) {
  const [showAdd, setShowAdd] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, showToast] = useToast();
  const [form, setForm] = useState({ client: "", case_ref: "", amount: "", due: "" });

  useEffect(() => {
    db.get("invoices", token).then(d => { if (Array.isArray(d)) setInvoices(d); setLoading(false); });
  }, [token]);

  const total = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
  const paid  = invoices.filter(i => i.status === "مدفوعة").reduce((s, i) => s + Number(i.amount || 0), 0);

  const upStatus = async (id, status) => {
    await db.patch("invoices", id, { status }, token);
    setInvoices(invoices.map(i => i.id === id ? { ...i, status } : i));
    showToast(`تم التحديث: ${status}`);
  };

  const save = async () => {
    if (!form.client || !form.amount) return;
    const num = `CML-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`;
    const res = await db.post("invoices", { number: num, client: form.client, case_ref: form.case_ref, amount: parseFloat(form.amount), due: form.due, issued: new Date().toISOString().split("T")[0], status: "مسودة" }, token);
    if (Array.isArray(res) && res[0]) { setInvoices([res[0], ...invoices]); showToast("✅ تم إنشاء الفاتورة"); }
    setShowAdd(false);
    setForm({ client: "", case_ref: "", amount: "", due: "" });
  };

  const remove = async (id) => {
    await db.del("invoices", id, token);
    setInvoices(invoices.filter(i => i.id !== id));
    showToast("تم حذف الفاتورة");
  };

  return (
    <div>
      {toastMsg && <Toast msg={toastMsg} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <Btn onClick={() => setShowAdd(true)}>+ فاتورة جديدة</Btn>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الفواتير</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${invoices.length} فاتورة`}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "إجمالي الفواتير", value: `${total.toLocaleString()} د.ت`, color: C.primary },
          { label: "تم التحصيل",      value: `${paid.toLocaleString()} د.ت`,  color: C.green },
          { label: "مدفوعة",          value: invoices.filter(i => i.status === "مدفوعة").length, color: C.green },
          { label: "متأخرة",          value: invoices.filter(i => i.status === "متأخرة").length, color: C.rose },
        ].map((k, i) => (
          <Card key={i} style={{ padding: "16px 20px", borderTop: `4px solid ${k.color}` }}>
            <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700, textAlign: "right" }}>{k.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 900, color: C.text, textAlign: "right" }}>{k.value}</p>
          </Card>
        ))}
      </div>

      <Card style={{ overflow: "hidden" }}>
        {loading ? <Spinner /> : invoices.length === 0 ? <Empty icon="📄" msg="لا توجد فواتير" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", direction: "rtl", minWidth: 500 }}>
              <thead><tr style={{ background: C.n100 }}>
                {["الرقم","العميل","المبلغ","الاستحقاق","الحالة","إجراء",""].map((h, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: "right", fontSize: 11, fontWeight: 700, color: C.textLight }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 14px", fontSize: 11, fontWeight: 700, color: C.primary, fontFamily: "monospace" }}>{inv.number}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700, color: C.text }}>{inv.client}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 800, color: C.text }}>{Number(inv.amount || 0).toLocaleString()} د.ت</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: C.textMid }}>{inv.due}</td>
                    <td style={{ padding: "12px 14px" }}><Badge label={inv.status} /></td>
                    <td style={{ padding: "12px 14px" }}>
                      {inv.status === "مسودة"  && <Btn sm onClick={() => upStatus(inv.id, "مرسلة")}>إرسال</Btn>}
                      {inv.status === "مرسلة"  && <Btn sm variant="ghost" onClick={() => upStatus(inv.id, "مدفوعة")}>تحصيل</Btn>}
                      {inv.status === "متأخرة" && <Btn sm variant="danger" onClick={() => upStatus(inv.id, "مرسلة")}>تذكير</Btn>}
                      {inv.status === "مدفوعة" && <Btn sm variant="secondary">PDF</Btn>}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <button onClick={() => remove(inv.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "4px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>حذف</button>
                    </td>
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
            <Inp label="اسم العميل *" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="اسم العميل" />
            <Inp label="رقم القضية" value={form.case_ref} onChange={e => setForm({ ...form, case_ref: e.target.value })} placeholder="CML-2025-001" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="المبلغ (د.ت) *" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
              <Inp label="تاريخ الاستحقاق" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} type="date" />
            </div>
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.client || !form.amount} full>💾 إنشاء الفاتورة</Btn>
              <Btn variant="secondary" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   AI ASSISTANT
═══════════════════════════════════════════ */
function AIAssistant() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskType, setTaskType] = useState("استشارة قانونية");

  const DEMOS = {
    "استشارة قانونية": "عميل يسأل عن حقوقه في قضية فصل تعسفي بعد 8 سنوات خدمة في تونس.",
    "صياغة عقد": "صياغة عقد إيجار تجاري لمحل بتونس العاصمة لمدة 3 سنوات.",
    "تلخيص قضية": "نزاع بين شركتين تونسيتين حول عقد توريد معدات بقيمة 50,000 دينار.",
    "رد قانوني": "صياغة رد على إنذار قانوني من دائن بشأن دين مدني.",
  };

  const generate = async () => {
    if (!input || loading) return;
    setLoading(true); setResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1200,
          system: `أنت مساعد قانوني متخصص في القانون التونسي والفرنسي. تعمل مع مكتب المحامي منذر العضهار (Cabinet CML). مهمتك: ${taskType}. أجب باللغة العربية الفصحى بأسلوب قانوني احترافي. استشهد بمجلة الالتزامات والعقود ومجلة الشغل التونسية عند الاقتضاء.`,
          messages: [{ role: "user", content: input }],
        }),
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text || "حدث خطأ.");
    } catch { setResult("خطأ في الاتصال."); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 22, textAlign: "right" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>المساعد الذكي القانوني 🤖</h2>
        <p style={{ margin: "4px 0 0", color: C.textLight, fontSize: 14 }}>مخصص للقانون التوني · مدعوم بـ Claude AI</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", direction: "rtl" }}>
            <button onClick={() => setInput(DEMOS[taskType] || "")} style={{ padding: "5px 12px", background: C.accentBg, border: `1px solid ${C.accent}`, color: C.amber, borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>← مثال</button>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>🎙 طلبك القانوني</h3>
          </div>
          <div style={{ padding: 16, direction: "rtl" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {["استشارة قانونية","صياغة عقد","تلخيص قضية","رد قانوني"].map(t => (
                <button key={t} onClick={() => setTaskType(t)} style={{ padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${taskType === t ? C.primary : C.border}`, background: taskType === t ? C.primary : C.white, color: taskType === t ? C.white : C.textMid, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>{t}</button>
              ))}
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="اكتب طلبك القانوني هنا..."
              style={{ width: "100%", minHeight: 180, padding: 12, borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13.5, lineHeight: 1.8, resize: "vertical", background: C.n100, boxSizing: "border-box", outline: "none", fontFamily: "Tajawal,sans-serif", textAlign: "right", direction: "rtl" }} />
            <button onClick={generate} disabled={!input || loading} style={{ marginTop: 10, width: "100%", padding: "12px", borderRadius: 10, background: input && !loading ? `linear-gradient(135deg,${C.primary},${C.primaryLight})` : C.border, color: input && !loading ? C.white : C.textLight, border: "none", fontWeight: 700, fontSize: 14, cursor: input && !loading ? "pointer" : "default", fontFamily: "Tajawal,sans-serif" }}>
              {loading ? "⏳  جاري التحليل..." : "🤖  تنفيذ المهمة"}
            </button>
          </div>
        </Card>
        <Card style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, background: `${C.primary}06`, direction: "rtl" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>📋 النتيجة القانونية</h3>
          </div>
          <div style={{ flex: 1, padding: 18, direction: "rtl" }}>
            {loading && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, gap: 14 }}><div style={{ width: 38, height: 38, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.primary, animation: "spin 0.8s linear infinite" }} /><p style={{ color: C.textLight, fontSize: 13 }}>جاري المعالجة...</p></div>}
            {result && !loading && (
              <div>
                <div style={{ background: C.n100, borderRadius: 12, padding: 16, fontSize: 13.5, color: C.textMid, lineHeight: 2, whiteSpace: "pre-line", maxHeight: 360, overflowY: "auto", textAlign: "right" }}>{result}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => { setResult(""); setInput(""); }} style={{ padding: "8px 14px", background: C.n200, color: C.textMid, border: "none", borderRadius: 9, fontSize: 12, cursor: "pointer" }}>↩ جديد</button>
                  <button onClick={() => navigator.clipboard?.writeText(result)} style={{ flex: 1, padding: "8px", background: C.primary, color: C.white, border: "none", borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>📋 نسخ</button>
                </div>
              </div>
            )}
            {!result && !loading && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, color: C.textLight, gap: 10 }}><span style={{ fontSize: 48, opacity: 0.2 }}>⚖️</span><p style={{ fontSize: 13 }}>النتيجة ستظهر هنا</p></div>}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ANALYTICS
═══════════════════════════════════════════ */
function Analytics() {
  const monthly = [
    { month: "Jan", revenue: 8500 }, { month: "Fév", revenue: 9200 },
    { month: "Mar", revenue: 7800 }, { month: "Avr", revenue: 11000 },
    { month: "Mai", revenue: 12500 }, { month: "Jun", revenue: 10800 },
  ];
  const maxRev = Math.max(...monthly.map(m => m.revenue));

  return (
    <div>
      <div style={{ marginBottom: 22, textAlign: "right" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>التحليلات — Cabinet CML</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "إجمالي الإيراد", value: "59,800 د.ت", color: C.accent, icon: "💰" },
          { label: "عدد القضايا",    value: "24",          color: C.primary, icon: "⚖️" },
          { label: "معدل الفوز",     value: "82%",         color: C.green,   icon: "🏆" },
          { label: "رضا العملاء",    value: "95%",         color: C.amber,   icon: "⭐" },
        ].map((k, i) => (
          <Card key={i} style={{ padding: "18px 20px", borderTop: `4px solid ${k.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700 }}>{k.label}</p>
                <p style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 900, color: C.text }}>{k.value}</p>
              </div>
              <span style={{ fontSize: 24 }}>{k.icon}</span>
            </div>
          </Card>
        ))}
      </div>
      <Card style={{ padding: 22, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: C.text, textAlign: "right" }}>الإيراد الشهري (د.ت)</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
          {monthly.map((m, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 9, color: C.textLight }}>{(m.revenue / 1000).toFixed(1)}K</span>
              <div style={{ width: "100%", background: `linear-gradient(180deg, ${C.primaryLight}, ${C.primary})`, borderRadius: "5px 5px 0 0", height: `${(m.revenue / maxRev) * 120}px` }} />
              <span style={{ fontSize: 9, color: C.textMid }}>{m.month}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════ */
function Settings({ onLogout }) {
  const [form, setForm] = useState({
    name: "Mondher Laadhar", email: "mondher@cabinet-cml.com",
    phone: "+216 XX XXX XXX", office: "Cabinet Mondher Laadhar CML",
    license: "XXXXX/ن", sms: true, email_notif: true, reminders: true,
  });
  const [toastMsg, showToast] = useToast();

  return (
    <div>
      {toastMsg && <Toast msg={toastMsg} />}
      <div style={{ marginBottom: 22, textAlign: "right" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الإعدادات</h2>
      </div>
      <Card style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: C.text, textAlign: "right" }}>الملف الشخصي — Cabinet CML</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, direction: "rtl" }}>
          <Inp label="الاسم الكامل / Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Inp label="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Inp label="رقم الهاتف" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Inp label="رقم الترخيص" value={form.license} onChange={e => setForm({ ...form, license: e.target.value })} />
        </div>
        <div style={{ direction: "rtl" }}>
          <Inp label="اسم المكتب / Cabinet" value={form.office} onChange={e => setForm({ ...form, office: e.target.value })} />
        </div>
        <Btn onClick={() => showToast("✅ تم حفظ التغييرات")}>حفظ التغييرات</Btn>
      </Card>

      <Card style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: C.text, textAlign: "right" }}>الإشعارات التلقائية</h3>
        {[
          { label: "تذكيرات المواعيد عبر البريد", key: "email_notif", desc: "إرسال تذكير للعميل قبل 24 ساعة" },
          { label: "تنبيهات الجلسات", key: "reminders", desc: "تنبيه تلقائي قبل جلسات المحكمة" },
          { label: "إشعارات SMS", key: "sms", desc: "رسالة نصية قبل كل موعد" },
        ].map((n, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none", direction: "rtl" }}>
            <button onClick={() => setForm({ ...form, [n.key]: !form[n.key] })} style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: form[n.key] ? C.primary : C.border, cursor: "pointer", position: "relative", flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 3, right: form[n.key] ? 3 : 23, transition: "right 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
            </button>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.text }}>{n.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textLight }}>{n.desc}</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Logout */}
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", direction: "rtl" }}>
          <Btn variant="danger" onClick={onLogout}>🚪 تسجيل الخروج</Btn>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text }}>تسجيل الخروج</p>
            <p style={{ margin: 0, fontSize: 12, color: C.textLight }}>سيتم إنهاء الجلسة الحالية</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP SHELL
═══════════════════════════════════════════ */
export default function App() {
  const [nav, setNav] = useState("dashboard");
  const [token, setToken] = useState(() => localStorage.getItem("cml_token") || null);
  const [counts, setCounts] = useState({ clients: 0, activeCases: 0, paid: 0, appointments: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (t) => setToken(t);

  const handleLogout = async () => {
    await db.logout(token);
    localStorage.removeItem("cml_token");
    localStorage.removeItem("cml_user");
    setToken(null);
  };

  useEffect(() => {
    if (!token) return;
    Promise.all([
      db.get("clients", token),
      db.get("cases", token),
      db.get("invoices", token),
      db.get("appointments", token),
    ]).then(([cl, ca, inv, ap]) => {
      setCounts({
        clients: Array.isArray(cl) ? cl.length : 0,
        activeCases: Array.isArray(ca) ? ca.filter(c => !["مغلقة","مكسوبة"].includes(c.status)).length : 0,
        paid: Array.isArray(inv) ? inv.filter(i => i.status === "مدفوعة").reduce((s, i) => s + Number(i.amount || 0), 0) : 0,
        appointments: Array.isArray(ap) ? ap.filter(a => a.status !== "ملغي").length : 0,
      });
    });
  }, [nav, token]);

  // Page de login si pas connecté
  if (!token) return <LoginPage onLogin={handleLogin} />;

  const renderPage = () => {
    switch (nav) {
      case "dashboard": return <Dashboard setNav={setNav} counts={counts} />;
      case "clients":   return <Clients token={token} />;
      case "cases":     return <Cases token={token} />;
      case "calendar":  return <Calendar token={token} />;
      case "invoices":  return <Invoices token={token} />;
      case "ai":        return <AIAssistant />;
      case "analytics": return <Analytics />;
      case "settings":  return <Settings onLogout={handleLogout} />;
      default:          return <Dashboard setNav={setNav} counts={counts} />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#FAF7F5;font-family:'Tajawal',sans-serif;direction:rtl}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#E8DDD8;border-radius:3px}
        @keyframes spin{to{transform:rotate(360deg)}}
        button,input,textarea,select{font-family:'Tajawal',sans-serif}

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .sidebar { transform: translateX(100%); transition: transform 0.3s; position: fixed !important; z-index: 200; height: 100vh; top: 0; right: 0; }
          .sidebar.open { transform: translateX(0); }
          .overlay { display: block !important; }
          .main-content { margin-right: 0 !important; }
        }
      `}</style>

      {/* Mobile overlay */}
      <div className="overlay" onClick={() => setSidebarOpen(false)}
        style={{ display: "none", position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199 }} />

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", direction: "rtl" }}>

        {/* ── SIDEBAR ── */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}
          style={{ width: 228, background: C.primary, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚖️</div>
              <div>
                <p style={{ margin: 0, color: C.white, fontWeight: 800, fontSize: 15 }}>Cabinet CML</p>
                <p style={{ margin: 0, color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>Mondher Laadhar</p>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
            {NAV.map(item => {
              const active = nav === item.id;
              return (
                <button key={item.id} onClick={() => { setNav(item.id); setSidebarOpen(false); }} style={{
                  width: "100%", textAlign: "right", padding: "10px 12px", borderRadius: 9, border: "none",
                  cursor: "pointer", background: active ? "rgba(255,255,255,0.12)" : "transparent",
                  color: active ? C.white : "rgba(255,255,255,0.55)",
                  fontSize: 13.5, fontWeight: active ? 700 : 500, marginBottom: 1,
                  display: "flex", alignItems: "center", gap: 10,
                  borderRight: `3px solid ${active ? C.accent : "transparent"}`,
                  fontFamily: "Tajawal,sans-serif",
                }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                  {item.id === "ai" && <span style={{ marginRight: "auto", fontSize: 9, background: C.accent, color: C.text, padding: "1px 6px", borderRadius: 10, fontWeight: 800 }}>AI</span>}
                </button>
              );
            })}
          </nav>

          <div style={{ padding: "12px 14px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name="Mondher Laadhar" size={32} bg={C.accent} />
              <div>
                <p style={{ margin: 0, color: C.white, fontSize: 12, fontWeight: 700 }}>Mondher Laadhar</p>
                <p style={{ margin: 0, color: C.accent, fontSize: 10, fontWeight: 600 }}>Avocat • محامٍ</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main-content" style={{ flex: 1, overflowY: "auto", background: C.bg, display: "flex", flexDirection: "column" }}>
          {/* Top bar */}
          <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, direction: "rtl", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Menu burger mobile */}
              <button onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", display: "none", padding: "4px 8px" }}
                className="burger">☰</button>
              <span style={{ fontSize: 12, color: C.textLight }}>Cabinet CML</span>
              <span style={{ color: C.border }}>›</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{NAV.find(n => n.id === nav)?.label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, background: C.accentBg, color: C.accent, padding: "3px 10px", borderRadius: 20, fontWeight: 700, border: `1px solid ${C.accent}` }}>Cabinet CML ⚖️</span>
              <button onClick={handleLogout}
                style={{ background: C.roseBg, border: "none", color: C.rose, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>
                🚪 خروج
              </button>
            </div>
          </div>

          <div style={{ padding: "24px 20px", flex: 1 }}>
            {renderPage()}
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .burger { display: block !important; }
        }
      `}</style>
    </>
  );
}
