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
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.text }}>{item.icon} {item.label}</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textLight }}>{item.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, borderRadius: 16, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Btn variant="accent" onClick={() => setNav("ai")}>جرّب الآن ←</Btn>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, color: C.white, fontWeight: 700, fontSize: 16 }}>🤖 المساعد الذكي للمحامين</p>
          <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.75)", fontSize: 13 }}>صياغة العقود · الاستشارات · تلخيص القضايا</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CLIENTS
═══════════════════════════════════════════ */
function Clients() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, showToast] = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", lawyer: "أحمد العلي" });

  useEffect(() => {
    db.get("clients").then(d => { if (Array.isArray(d)) setClients(d); setLoading(false); });
  }, []);

  const filtered = clients.filter(c => c.name?.includes(search) || c.city?.includes(search));

  const save = async () => {
    if (!form.name) return;
    const res = await db.post("clients", { ...form, cases: 0, since: String(new Date().getFullYear()), status: "نشط" });
    if (Array.isArray(res) && res[0]) { setClients([res[0], ...clients]); showToast("✅ تم إضافة العميل"); }
    setShowAdd(false);
    setForm({ name: "", email: "", phone: "", city: "", lawyer: "أحمد العلي" });
  };

  const remove = async (id) => {
    await db.del("clients", id);
    setClients(clients.filter(c => c.id !== id));
    showToast("تم حذف العميل");
  };

  return (
    <div>
      {toastMsg && <Toast msg={toastMsg} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة عميل</Btn>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>العملاء</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${filtered.length} عميل · Supabase ✅`}</p>
        </div>
      </div>

      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  البحث..."
            style={{ padding: "8px 14px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, width: 260, outline: "none", textAlign: "right", fontFamily: "Tajawal,sans-serif" }} />
        </div>

        {loading ? <Spinner msg="جاري تحميل العملاء..." /> :
         filtered.length === 0 ? <Empty icon="👥" msg="لا يوجد عملاء. أضف أول عميل!" /> : (
          <table style={{ width: "100%", borderCollapse: "collapse", direction: "rtl" }}>
            <thead><tr style={{ background: C.n100 }}>
              {["العميل","التواصل","المدينة","المحامي","الحالة",""].map((h, i) => (
                <th key={i} style={{ padding: "10px 18px", textAlign: "right", fontSize: 11, fontWeight: 700, color: C.textLight }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "13px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse" }}>
                      <Avatar name={c.name} size={36} bg={i % 2 === 0 ? C.primary : C.teal} />
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: C.text }}>{c.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: C.textLight }}>منذ {c.since}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 18px", textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 12.5 }}>{c.phone}</p>
                    <p style={{ margin: 0, fontSize: 11.5, color: C.textLight }}>{c.email}</p>
                  </td>
                  <td style={{ padding: "13px 18px", fontSize: 13, color: C.textMid, textAlign: "right" }}>{c.city}</td>
                  <td style={{ padding: "13px 18px", fontSize: 13, color: C.textMid, textAlign: "right" }}>{c.lawyer}</td>
                  <td style={{ padding: "13px 18px", textAlign: "right" }}><Badge label={c.status || "نشط"} /></td>
                  <td style={{ padding: "13px 18px" }}>
                    <button onClick={() => remove(c.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {showAdd && (
        <Modal title="إضافة عميل جديد" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#1D4ED8", textAlign: "right" }}>💾 سيتم الحفظ في Supabase</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="الاسم الكامل *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسم العميل" />
              <Inp label="رقم الهاتف" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+966" />
            </div>
            <Inp label="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="المدينة" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="الرياض" />
              <Sel label="المحامي" value={form.lawyer} onChange={e => setForm({ ...form, lawyer: e.target.value })} options={["أحمد العلي", "فاطمة السيد", "خالد العمري"]} />
            </div>
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.name} full>💾 حفظ في Supabase</Btn>
              <Btn variant="secondary" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CASES — connecté Supabase
═══════════════════════════════════════════ */
function Cases() {
  const [filter, setFilter] = useState("الكل");
  const [showAdd, setShowAdd] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, showToast] = useToast();
  const [form, setForm] = useState({ title: "", client: "", type: "تجاري", court: "", priority: "متوسطة", amount: "—" });

  useEffect(() => {
    db.get("cases").then(d => { if (Array.isArray(d)) setCases(d); setLoading(false); });
  }, []);

  const statuses = ["الكل", "قيد النظر", "معلقة", "مفتوحة", "مكسوبة", "مغلقة"];
  const filtered = filter === "الكل" ? cases : cases.filter(c => c.status === filter);
  const TC = { "تجاري": C.primary, "أسري": C.teal, "جنائي": C.rose, "عمالي": "#7C3AED", "إداري": C.amber, "مدني": C.green };

  const save = async () => {
    if (!form.title) return;
    const num = `COM-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, "0")}`;
    const res = await db.post("cases", { ...form, number: num, status: "مفتوحة", lawyer: "أحمد العلي", hearing: "—" });
    if (Array.isArray(res) && res[0]) { setCases([res[0], ...cases]); showToast("✅ تم إضافة القضية"); }
    setShowAdd(false);
    setForm({ title: "", client: "", type: "تجاري", court: "", priority: "متوسطة", amount: "—" });
  };

  const changeStatus = async (id, status) => {
    await db.patch("cases", id, { status });
    setCases(cases.map(c => c.id === id ? { ...c, status } : c));
    showToast("تم تحديث حالة القضية");
  };

  const remove = async (id) => {
    await db.del("cases", id);
    setCases(cases.filter(c => c.id !== id));
    showToast("تم حذف القضية");
  };

  return (
    <div>
      {toastMsg && <Toast msg={toastMsg} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة قضية</Btn>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>القضايا</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${filtered.length} قضية · Supabase ✅`}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexDirection: "row-reverse", flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 16px", borderRadius: 20, border: `1.5px solid ${filter === s ? C.primary : C.border}`,
            background: filter === s ? C.primary : C.white, color: filter === s ? C.white : C.textMid,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Tajawal,sans-serif",
          }}>{s}</button>
        ))}
      </div>

      {loading ? <Spinner msg="جاري تحميل القضايا..." /> :
       filtered.length === 0 ? <Empty icon="⚖️" msg="لا توجد قضايا. أضف أول قضية!" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(c => (
            <Card key={c.id} style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", direction: "rtl" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, background: `${TC[c.type] || C.primary}15`, color: TC[c.type] || C.primary, padding: "2px 10px", borderRadius: 10, fontWeight: 700 }}>{c.type}</span>
                    <span style={{ fontSize: 11, color: C.textLight, fontFamily: "monospace" }}>{c.number}</span>
                  </div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: C.text }}>{c.title}</h3>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {c.client && <span style={{ fontSize: 12.5, color: C.textMid }}>👤 {c.client}</span>}
                    {c.court  && <span style={{ fontSize: 12.5, color: C.textMid }}>🏛️ {c.court}</span>}
                    {c.lawyer && <span style={{ fontSize: 12.5, color: C.textMid }}>👨‍💼 {c.lawyer}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", marginRight: 16 }}>
                  <Badge label={c.status} />
                  <Badge label={c.priority} />
                  <select value={c.status} onChange={e => changeStatus(c.id, e.target.value)}
                    style={{ fontSize: 11, padding: "3px 8px", borderRadius: 7, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>
                    {["مفتوحة","قيد النظر","معلقة","مكسوبة","مغلقة"].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => remove(c.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>حذف</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="إضافة قضية جديدة" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#1D4ED8", textAlign: "right" }}>💾 سيتم الحفظ في Supabase</div>
            <Inp label="عنوان القضية *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: نزاع عقد توريد" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="اسم العميل" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="اسم العميل" />
              <Sel label="نوع القضية" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={["تجاري","أسري","جنائي","عمالي","إداري","مدني"]} />
            </div>
            <Inp label="المحكمة" value={form.court} onChange={e => setForm({ ...form, court: e.target.value })} placeholder="اسم المحكمة" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Sel label="الأولوية" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} options={["عاجلة","عالية","متوسطة","منخفضة"]} />
              <Inp label="قيمة القضية" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="مثال: 500,000 ر.س" />
            </div>
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.title} full>💾 حفظ في Supabase</Btn>
              <Btn variant="secondary" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CALENDAR — connecté Supabase
═══════════════════════════════════════════ */
function Calendar() {
  const [showAdd, setShowAdd] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, showToast] = useToast();
  const [form, setForm] = useState({ title: "", client: "", type: "استشارة", date: "", time: "", location: "" });

  useEffect(() => {
    db.get("appointments").then(d => { if (Array.isArray(d)) setAppointments(d); setLoading(false); });
  }, []);

  const TC = { "استشارة": C.teal, "جلسة": C.rose, "اجتماع": C.primary, "موعد": C.amber };

  const save = async () => {
    if (!form.title) return;
    const res = await db.post("appointments", { ...form, lawyer: "أحمد العلي", status: "مجدول" });
    if (Array.isArray(res) && res[0]) { setAppointments([res[0], ...appointments]); showToast("✅ تم إضافة الموعد"); }
    setShowAdd(false);
    setForm({ title: "", client: "", type: "استشارة", date: "", time: "", location: "" });
  };

  const cancel = async (id) => {
    await db.patch("appointments", id, { status: "ملغي" });
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: "ملغي" } : a));
    showToast("تم إلغاء الموعد");
  };

  const remove = async (id) => {
    await db.del("appointments", id);
    setAppointments(appointments.filter(a => a.id !== id));
    showToast("تم حذف الموعد");
  };

  return (
    <div>
      {toastMsg && <Toast msg={toastMsg} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة موعد</Btn>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الأجندة</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${appointments.length} موعد · Supabase ✅`}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "إجمالي المواعيد", count: appointments.length, color: C.primary },
          { label: "مجدول",           count: appointments.filter(a => a.status === "مجدول").length, color: C.teal },
          { label: "مؤكد",            count: appointments.filter(a => a.status === "مؤكد").length, color: C.green },
          { label: "ملغي",            count: appointments.filter(a => a.status === "ملغي").length, color: C.rose },
        ].map((s, i) => (
          <Card key={i} style={{ padding: "16px 20px", textAlign: "center", borderTop: `4px solid ${s.color}` }}>
            <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700 }}>{s.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: 30, fontWeight: 900, color: C.text }}>{s.count}</p>
          </Card>
        ))}
      </div>

      {loading ? <Spinner msg="جاري تحميل المواعيد..." /> :
       appointments.length === 0 ? <Empty icon="📅" msg="لا توجد مواعيد. أضف أول موعد!" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {appointments.map(a => (
            <Card key={a.id} style={{ padding: "16px 22px", borderRight: `4px solid ${TC[a.type] || C.primary}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", direction: "rtl" }}>
                <div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 5 }}>
                    <Badge label={a.status} />
                    <span style={{ fontSize: 11.5, background: `${TC[a.type] || C.primary}15`, color: TC[a.type] || C.primary, padding: "2px 10px", borderRadius: 10, fontWeight: 700 }}>{a.type}</span>
                  </div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: C.text }}>{a.title}</h3>
                  <div style={{ display: "flex", gap: 14 }}>
                    {a.client   && <span style={{ fontSize: 12.5, color: C.textMid }}>👤 {a.client}</span>}
                    {a.location && <span style={{ fontSize: 12.5, color: C.textMid }}>📍 {a.location}</span>}
                    {a.lawyer   && <span style={{ fontSize: 12.5, color: C.textMid }}>👨‍💼 {a.lawyer}</span>}
                  </div>
                </div>
                <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.primary }}>{a.date}</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.textMid }}>{a.time}</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    {a.status !== "ملغي" && (
                      <button onClick={() => cancel(a.id)} style={{ background: C.amberBg, border: "none", color: C.amber, padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>إلغاء</button>
                    )}
                    <button onClick={() => remove(a.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>حذف</button>
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
            <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#1D4ED8", textAlign: "right" }}>💾 سيتم الحفظ في Supabase</div>
            <Inp label="عنوان الموعد *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: استشارة قانونية" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="اسم العميل" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="اسم العميل" />
              <Sel label="نوع الموعد" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={["استشارة","جلسة","اجتماع","موعد"]} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="التاريخ" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} type="date" />
              <Inp label="الوقت" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="09:00 - 10:00" />
            </div>
            <Inp label="الموقع" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="المكتب / المحكمة / عبر الفيديو" />
            <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse" }}>
              <Btn onClick={save} disabled={!form.title} full>💾 حفظ في Supabase</Btn>
              <Btn variant="secondary" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   INVOICES — connecté Supabase
═══════════════════════════════════════════ */
function Invoices() {
  const [showAdd, setShowAdd] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, showToast] = useToast();
  const [form, setForm] = useState({ client: "", case_ref: "", amount: "", due: "" });

  useEffect(() => {
    db.get("invoices").then(d => { if (Array.isArray(d)) setInvoices(d); setLoading(false); });
  }, []);

  const total = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
  const paid  = invoices.filter(i => i.status === "مدفوعة").reduce((s, i) => s + Number(i.amount || 0), 0);

  const upStatus = async (id, status) => {
    await db.patch("invoices", id, { status });
    setInvoices(invoices.map(i => i.id === id ? { ...i, status } : i));
    showToast(`تم التحديث: ${status}`);
  };

  const save = async () => {
    if (!form.client || !form.amount) return;
    const num = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`;
    const res = await db.post("invoices", {
      number: num, client: form.client, case_ref: form.case_ref,
      amount: parseFloat(form.amount), due: form.due,
      issued: new Date().toISOString().split("T")[0], status: "مسودة"
    });
    if (Array.isArray(res) && res[0]) { setInvoices([res[0], ...invoices]); showToast("✅ تم إنشاء الفاتورة"); }
    setShowAdd(false);
    setForm({ client: "", case_ref: "", amount: "", due: "" });
  };

  const remove = async (id) => {
    await db.del("invoices", id);
    setInvoices(invoices.filter(i => i.id !== id));
    showToast("تم حذف الفاتورة");
  };

  return (
    <div>
      {toastMsg && <Toast msg={toastMsg} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <Btn onClick={() => setShowAdd(true)}>+ فاتورة جديدة</Btn>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الفواتير</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{loading ? "جاري التحميل..." : `${invoices.length} فاتورة · Supabase ✅`}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "إجمالي الفواتير", value: `${total.toLocaleString()} ر.س`, color: C.primary },
          { label: "تم التحصيل",      value: `${paid.toLocaleString()} ر.س`,  color: C.green },
          { label: "مدفوعة",          value: invoices.filter(i => i.status === "مدفوعة").length, color: C.green },
          { label: "متأخرة",          value: invoices.filter(i => i.status === "متأخرة").length, color: C.rose },
        ].map((k, i) => (
          <Card key={i} style={{ padding: "18px 20px", borderTop: `4px solid ${k.color}` }}>
            <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700, textAlign: "right" }}>{k.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 900, color: C.text, textAlign: "right" }}>{k.value}</p>
          </Card>
        ))}
      </div>

      <Card style={{ overflow: "hidden" }}>
        {loading ? <Spinner msg="جاري تحميل الفواتير..." /> :
         invoices.length === 0 ? <Empty icon="📄" msg="لا توجد فواتير. أنشئ أول فاتورة!" /> : (
          <table style={{ width: "100%", borderCollapse: "collapse", direction: "rtl" }}>
            <thead><tr style={{ background: C.n100 }}>
              {["الرقم","العميل","المبلغ","الاستحقاق","الحالة","إجراء",""].map((h, i) => (
                <th key={i} style={{ padding: "10px 18px", textAlign: "right", fontSize: 11, fontWeight: 700, color: C.textLight }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "13px 18px", fontSize: 12, fontWeight: 700, color: C.primary, fontFamily: "monospace" }}>{inv.number}</td>
                  <td style={{ padding: "13px 18px", fontSize: 13.5, fontWeight: 700, color: C.text }}>{inv.client}</td>
                  <td style={{ padding: "13px 18px", fontSize: 13.5, fontWeight: 800, color: C.text }}>{Number(inv.amount || 0).toLocaleString()} ر.س</td>
                  <td style={{ padding: "13px 18px", fontSize: 12.5, color: C.textMid }}>{inv.due}</td>
                  <td style={{ padding: "13px 18px" }}><Badge label={inv.status} /></td>
                  <td style={{ padding: "13px 18px" }}>
                    {inv.status === "مسودة"  && <Btn sm onClick={() => upStatus(inv.id, "مرسلة")}>إرسال</Btn>}
                    {inv.status === "مرسلة"  && <Btn sm variant="ghost" onClick={() => upStatus(inv.id, "مدفوعة")}>تحصيل</Btn>}
                    {inv.status === "متأخرة" && <Btn sm variant="danger" onClick={() => upStatus(inv.id, "مرسلة")}>تذكير</Btn>}
                    {inv.status === "مدفوعة" && <Btn sm variant="secondary">PDF</Btn>}
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <button onClick={() => remove(inv.id)} style={{ background: C.roseBg, border: "none", color: C.rose, padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {showAdd && (
        <Modal title="فاتورة جديدة" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#1D4ED8", textAlign: "right" }}>💾 سيتم الحفظ في Supabase</div>
            <Inp label="اسم العميل *" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="اسم العميل" />
            <Inp label="رقم القضية" value={form.case_ref} onChange={e => setForm({ ...form, case_ref: e.target.value })} placeholder="COM-2024-001" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="المبلغ (ر.س) *" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
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
    "استشارة قانونية": "عميل يسأل عن حقوقه في قضية فصل تعسفي بعد 10 سنوات خدمة.",
    "صياغة عقد": "صياغة عقد شراكة تجارية برأس مال 500,000 ريال.",
    "تلخيص قضية": "نزاع بين شركتين حول عقد توريد بقيمة مليوني ريال.",
    "رد قانوني": "صياغة رد على إنذار قانوني من شركة مقاولات.",
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
          system: `أنت مساعد قانوني متخصص للمحامين في المملكة العربية السعودية. مهمتك: ${taskType}. أجب باللغة العربية الفصحى بأسلوب قانوني احترافي.`,
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
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>المساعد الذكي للمحامين 🤖</h2>
        <p style={{ margin: "4px 0 0", color: C.textLight, fontSize: 14 }}>مدعوم بـ Claude AI</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "15px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", direction: "rtl" }}>
            <button onClick={() => setInput(DEMOS[taskType] || "")} style={{ padding: "5px 13px", background: `${C.primary}12`, color: C.primary, border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>← مثال</button>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>🎙 طلبك القانوني</h3>
          </div>
          <div style={{ padding: 16, direction: "rtl" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {["استشارة قانونية","صياغة عقد","تلخيص قضية","رد قانوني"].map(t => (
                <button key={t} onClick={() => setTaskType(t)} style={{ padding: "5px 13px", borderRadius: 20, border: `1.5px solid ${taskType === t ? C.primary : C.border}`, background: taskType === t ? C.primary : C.white, color: taskType === t ? C.white : C.textMid, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>{t}</button>
              ))}
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="اكتب طلبك القانوني هنا..."
              style={{ width: "100%", minHeight: 200, padding: 13, borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13.5, lineHeight: 1.8, resize: "vertical", background: C.n100, boxSizing: "border-box", outline: "none", fontFamily: "Tajawal,sans-serif", textAlign: "right", direction: "rtl" }} />
            <button onClick={generate} disabled={!input || loading} style={{ marginTop: 12, width: "100%", padding: "12px", borderRadius: 10, background: input && !loading ? `linear-gradient(135deg,${C.primary},${C.primaryLight})` : C.border, color: input && !loading ? C.white : C.textLight, border: "none", fontWeight: 700, fontSize: 14.5, cursor: input && !loading ? "pointer" : "default", fontFamily: "Tajawal,sans-serif" }}>
              {loading ? "⏳  جاري التحليل..." : "🤖  تنفيذ المهمة"}
            </button>
          </div>
        </Card>

        <Card style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "15px 20px", borderBottom: `1px solid ${C.border}`, background: `${C.primary}06`, direction: "rtl" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>📋 النتيجة القانونية</h3>
          </div>
          <div style={{ flex: 1, padding: 20, direction: "rtl" }}>
            {loading && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, gap: 16 }}><div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.primary, animation: "spin 0.8s linear infinite" }} /><p style={{ color: C.textLight, fontSize: 13 }}>جاري المعالجة...</p></div>}
            {result && !loading && (
              <div>
                <div style={{ background: C.n100, borderRadius: 12, padding: 18, fontSize: 13.5, color: C.textMid, lineHeight: 2, whiteSpace: "pre-line", maxHeight: 380, overflowY: "auto", textAlign: "right" }}>{result}</div>
                <div style={{ display: "flex", gap: 9, marginTop: 12 }}>
                  <button onClick={() => { setResult(""); setInput(""); }} style={{ padding: "9px 14px", background: C.n200, color: C.textMid, border: "none", borderRadius: 9, fontSize: 12, cursor: "pointer" }}>↩ جديد</button>
                  <button onClick={() => navigator.clipboard?.writeText(result)} style={{ flex: 1, padding: "9px", background: C.primary, color: C.white, border: "none", borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Tajawal,sans-serif" }}>📋 نسخ النتيجة</button>
                </div>
              </div>
            )}
            {!result && !loading && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, color: C.textLight, gap: 10 }}><span style={{ fontSize: 52, opacity: 0.2 }}>⚖️</span><p style={{ fontSize: 13 }}>النتيجة ستظهر هنا</p></div>}
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
    { month: "يناير", revenue: 145000 }, { month: "فبراير", revenue: 162000 },
    { month: "مارس",  revenue: 138000 }, { month: "أبريل",  revenue: 175000 },
    { month: "مايو",  revenue: 198000 }, { month: "يونيو",  revenue: 185000 },
  ];
  const maxRev = Math.max(...monthly.map(m => m.revenue));

  return (
    <div>
      <div style={{ marginBottom: 22, textAlign: "right" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>التحليلات والإحصاءات</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "إجمالي الإيراد", value: "1,003,000 ر.س", color: C.accent, icon: "💰" },
          { label: "عدد القضايا",    value: "62",            color: C.primary, icon: "⚖️" },
          { label: "معدل الفوز",     value: "78%",           color: C.green,   icon: "🏆" },
          { label: "رضا العملاء",    value: "92%",           color: C.teal,    icon: "⭐" },
        ].map((k, i) => (
          <Card key={i} style={{ padding: "20px 22px", borderTop: `4px solid ${k.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700 }}>{k.label}</p>
                <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 900, color: C.text }}>{k.value}</p>
              </div>
              <span style={{ fontSize: 26 }}>{k.icon}</span>
            </div>
          </Card>
        ))}
      </div>
      <Card style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: C.text, textAlign: "right" }}>الإيراد الشهري (ر.س)</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180, direction: "rtl" }}>
          {monthly.map((m, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: C.textLight }}>{(m.revenue / 1000).toFixed(0)}K</span>
              <div style={{ width: "100%", background: `linear-gradient(180deg, ${C.primaryLight}, ${C.primary})`, borderRadius: "6px 6px 0 0", height: `${(m.revenue / maxRev) * 140}px` }} />
              <span style={{ fontSize: 10.5, color: C.textMid }}>{m.month}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "15px 22px", borderBottom: `1px solid ${C.border}`, textAlign: "right" }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>مؤشرات الجودة</h3>
        </div>
        {[
          { name: "معدل الفوز في القضايا", target: 80, current: 78 },
          { name: "رضا العملاء",           target: 90, current: 92 },
          { name: "معدل تحصيل الفواتير",   target: 95, current: 88 },
          { name: "الالتزام بالمواعيد",    target: 98, current: 96 },
        ].map((ind, i) => (
          <div key={i} style={{ padding: "14px 22px", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", direction: "rtl" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: ind.current >= ind.target ? C.green : C.rose }}>{ind.current}%</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{ind.name}</span>
            </div>
            <div style={{ background: C.border, borderRadius: 4, height: 7 }}>
              <div style={{ width: `${Math.min(100, (ind.current / ind.target) * 100)}%`, height: "100%", background: ind.current >= ind.target ? C.green : C.rose, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════ */
function Settings() {
  const [form, setForm] = useState({
    name: "أحمد محمد العلي", email: "ahmed@mohami-pro.com",
    phone: "+966501234567", office: "مكتب العلي للمحاماة",
    license: "12345/ن", sms: true, email_notif: true, reminders: true,
  });
  const [toastMsg, showToast] = useToast();

  return (
    <div>
      {toastMsg && <Toast msg={toastMsg} />}
      <div style={{ marginBottom: 22, textAlign: "right" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الإعدادات</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <Card style={{ padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: C.text, textAlign: "right" }}>الملف الشخصي</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, direction: "rtl" }}>
            <Inp label="الاسم الكامل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Inp label="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Inp label="رقم الهاتف" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Inp label="رقم الترخيص" value={form.license} onChange={e => setForm({ ...form, license: e.target.value })} />
          </div>
          <div style={{ direction: "rtl" }}>
            <Inp label="اسم المكتب" value={form.office} onChange={e => setForm({ ...form, office: e.target.value })} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <Btn onClick={() => showToast("✅ تم حفظ التغييرات")}>حفظ التغييرات</Btn>
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: C.text, textAlign: "right" }}>الإشعارات</h3>
          {[
            { label: "إشعارات SMS للمواعيد", key: "sms", desc: "رسالة نصية قبل 24 ساعة من كل موعد" },
            { label: "إشعارات البريد الإلكتروني", key: "email_notif", desc: "ملخص يومي بالمواعيد والمهام" },
            { label: "تذكيرات الجلسات", key: "reminders", desc: "تنبيه تلقائي قبل مواعيد المحاكم" },
          ].map((n, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none", direction: "rtl" }}>
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
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP SHELL — charge tout depuis Supabase
═══════════════════════════════════════════ */
export default function App() {
  const [nav, setNav] = useState("dashboard");
  const [counts, setCounts] = useState({ clients: 0, activeCases: 0, paid: 0, appointments: 0 });

  useEffect(() => {
    Promise.all([
      db.get("clients"),
      db.get("cases"),
      db.get("invoices"),
      db.get("appointments"),
    ]).then(([cl, ca, inv, ap]) => {
      setCounts({
        clients: Array.isArray(cl) ? cl.length : 0,
        activeCases: Array.isArray(ca) ? ca.filter(c => !["مغلقة","مكسوبة"].includes(c.status)).length : 0,
        paid: Array.isArray(inv) ? inv.filter(i => i.status === "مدفوعة").reduce((s, i) => s + Number(i.amount || 0), 0) : 0,
        appointments: Array.isArray(ap) ? ap.filter(a => a.status !== "ملغي").length : 0,
      });
    });
  }, [nav]);

  const renderPage = () => {
    switch (nav) {
      case "dashboard": return <Dashboard setNav={setNav} counts={counts} />;
      case "clients":   return <Clients />;
      case "cases":     return <Cases />;
      case "calendar":  return <Calendar />;
      case "invoices":  return <Invoices />;
      case "ai":        return <AIAssistant />;
      case "analytics": return <Analytics />;
      case "settings":  return <Settings />;
      default:          return <Dashboard setNav={setNav} counts={counts} />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#F1F5F9;font-family:'Tajawal',sans-serif;direction:rtl}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px}
        @keyframes spin{to{transform:rotate(360deg)}}
        button,input,textarea,select{font-family:'Tajawal',sans-serif}
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", direction: "rtl" }}>
        <aside style={{ width: 228, background: C.primary, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚖️</div>
              <div>
                <p style={{ margin: 0, color: C.white, fontWeight: 800, fontSize: 15 }}>Cabinet CML</p>
                <p style={{ margin: 0, color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>Mondher Laadhar</p>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
            {NAV.map(item => {
              const active = nav === item.id;
              return (
                <button key={item.id} onClick={() => setNav(item.id)} style={{
                  width: "100%", textAlign: "right", padding: "10px 12px", borderRadius: 9, border: "none",
                  cursor: "pointer", background: active ? "rgba(255,255,255,0.12)" : "transparent",
                  color: active ? C.white : "rgba(255,255,255,0.55)",
                  fontSize: 14, fontWeight: active ? 700 : 500, marginBottom: 1,
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

          <div style={{ padding: "14px 16px 18px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name="أحمد العلي" size={34} bg={C.accent} />
              <div>
               <p style={{ margin: 0, color: C.white, fontSize: 13, fontWeight: 700 }}>Mondher Laadhar</p>
               <p style={{ margin: 0, color: C.accent, fontSize: 11, fontWeight: 600 }}>Avocat • محامٍ</p>
              </div>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, overflowY: "auto", background: C.bg }}>
          <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, direction: "rtl" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: C.textLight }}>محامي برو</span>
              <span style={{ color: C.border }}>›</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{NAV.find(n => n.id === nav)?.label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, background: C.accentBg, color: C.accent, padding: "3px 12px", borderRadius: 20, fontWeight: 700, border: `1px solid ${C.accent}` }}>Cabinet CML ⚖️</span>
              <Avatar name="أحمد العلي" size={34} bg={C.primary} />
            </div>
          </div>
          <div style={{ padding: "28px 32px" }}>{renderPage()}</div>
        </main>
      </div>
    </>
  );
}
