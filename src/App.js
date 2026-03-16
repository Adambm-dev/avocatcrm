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
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}`,
      {
        method: "POST",
        headers: { ...this.h, "Prefer": "return=representation" },
        body: JSON.stringify(data)
      }
    );
    return r.json();
  },
  async del(table, id) {
    await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`,
      { method: "DELETE", headers: this.h }
    );
  }
};

/* ═══════════════════════════════════════════
   COULEURS & DESIGN
═══════════════════════════════════════════ */
const C = {
  primary: "#1E3A5F",
  primaryMid: "#2D5282",
  primaryLight: "#3B6CB0",
  accent: "#C9A84C",
  accentLight: "#E2C97A",
  accentBg: "#FDF6E3",
  teal: "#0D9488",
  tealBg: "#F0FDFA",
  rose: "#DC2626",
  roseBg: "#FEF2F2",
  amber: "#D97706",
  amberBg: "#FFFBEB",
  green: "#16A34A",
  greenBg: "#F0FDF4",
  white: "#FFFFFF",
  bg: "#F1F5F9",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  textMid: "#475569",
  textLight: "#94A3B8",
  n100: "#F8FAFC",
  n200: "#F1F5F9",
};

/* ═══════════════════════════════════════════
   DONNÉES MOCK
═══════════════════════════════════════════ */
const CLIENTS = [
  { id: 1, name: "محمد عبدالله الفهد", email: "mohammed@email.com", phone: "+966551234567", city: "الرياض", status: "نشط", cases: 3, lawyer: "أحمد العلي", since: "يناير 2024" },
  { id: 2, name: "سارة أحمد المطيري", email: "sara@email.com", phone: "+966552345678", city: "جدة", status: "نشط", cases: 1, lawyer: "فاطمة السيد", since: "فبراير 2024" },
  { id: 3, name: "عبدالرحمن الشهري", email: "abdulrahman@email.com", phone: "+966553456789", city: "الدمام", status: "نشط", cases: 2, lawyer: "أحمد العلي", since: "مارس 2024" },
  { id: 4, name: "نورة القحطاني", email: "noura@email.com", phone: "+966554567890", city: "الرياض", status: "نشط", cases: 1, lawyer: "خالد العمري", since: "مارس 2024" },
  { id: 5, name: "فيصل الدوسري", email: "faisal@email.com", phone: "+966555678901", city: "الخبر", status: "غير نشط", cases: 4, lawyer: "أحمد العلي", since: "يونيو 2023" },
  { id: 6, name: "ريم العتيبي", email: "reem@email.com", phone: "+966556789012", city: "مكة", status: "نشط", cases: 2, lawyer: "فاطمة السيد", since: "أبريل 2024" },
];

const CASES = [
  { id: 1, number: "COM-2024-001", title: "نزاع عقد توريد", client: "محمد الفهد", type: "تجاري", status: "قيد النظر", priority: "عالية", court: "المحكمة التجارية بالرياض", lawyer: "أحمد العلي", date: "2024-01-15", hearing: "2024-12-20", amount: "2,000,000 ر.س" },
  { id: 2, number: "FAM-2024-002", title: "قضية حضانة أطفال", client: "سارة المطيري", type: "أسري", status: "قيد النظر", priority: "عاجلة", court: "محكمة الأحوال الشخصية بجدة", lawyer: "فاطمة السيد", date: "2024-02-01", hearing: "2024-12-15", amount: "—" },
  { id: 3, number: "COM-2024-003", title: "فسخ شراكة تجارية", client: "عبدالرحمن الشهري", type: "تجاري", status: "معلقة", priority: "متوسطة", court: "المحكمة التجارية بالدمام", lawyer: "أحمد العلي", date: "2024-02-20", hearing: "2024-12-25", amount: "500,000 ر.س" },
  { id: 4, number: "LAB-2024-004", title: "مطالبة بمستحقات عمالية", client: "نورة القحطاني", type: "عمالي", status: "مفتوحة", priority: "عالية", court: "المحكمة العمالية بالرياض", lawyer: "خالد العمري", date: "2024-03-01", hearing: "2024-12-18", amount: "120,000 ر.س" },
  { id: 5, number: "COM-2024-005", title: "تحصيل ديون تجارية", client: "فيصل الدوسري", type: "تجاري", status: "مكسوبة", priority: "منخفضة", court: "المحكمة التجارية بالخبر", lawyer: "أحمد العلي", date: "2023-08-15", hearing: "—", amount: "500,000 ر.س" },
  { id: 6, number: "CRI-2024-006", title: "قضية جنائية دفاع", client: "ريم العتيبي", type: "جنائي", status: "قيد النظر", priority: "عاجلة", court: "المحكمة الجزائية بمكة", lawyer: "فاطمة السيد", date: "2024-04-10", hearing: "2024-12-22", amount: "—" },
];

const APPOINTMENTS = [
  { id: 1, title: "استشارة قانونية", client: "محمد الفهد", lawyer: "أحمد العلي", date: "اليوم", time: "09:00 - 10:00", type: "استشارة", status: "مؤكد", location: "المكتب الرئيسي" },
  { id: 2, title: "جلسة محكمة - حضانة", client: "سارة المطيري", lawyer: "فاطمة السيد", date: "غداً", time: "11:00 - 12:30", type: "جلسة", status: "مجدول", location: "محكمة جدة" },
  { id: 3, title: "اجتماع مراجعة قضية", client: "عبدالرحمن الشهري", lawyer: "أحمد العلي", date: "20/12/2024", time: "14:00 - 15:00", type: "اجتماع", status: "مجدول", location: "عبر الفيديو" },
  { id: 4, title: "تسليم مستندات", client: "نورة القحطاني", lawyer: "خالد العمري", date: "21/12/2024", time: "10:00 - 10:30", type: "موعد", status: "مجدول", location: "المكتب الرئيسي" },
  { id: 5, title: "جلسة محكمة تجارية", client: "محمد الفهد", lawyer: "أحمد العلي", date: "22/12/2024", time: "09:30 - 11:00", type: "جلسة", status: "مجدول", location: "المحكمة التجارية" },
];

const INVOICES = [
  { id: 1, number: "INV-2024-001", client: "محمد الفهد", case: "COM-2024-001", amount: 22425, status: "مدفوعة", due: "2024-02-15", issued: "2024-01-20" },
  { id: 2, number: "INV-2024-002", client: "سارة المطيري", case: "FAM-2024-002", amount: 24725, status: "مرسلة", due: "2024-03-15", issued: "2024-02-15" },
  { id: 3, number: "INV-2024-003", client: "عبدالرحمن الشهري", case: "COM-2024-003", amount: 28750, status: "متأخرة", due: "2024-02-28", issued: "2024-02-01" },
  { id: 4, number: "INV-2024-004", client: "نورة القحطاني", case: "LAB-2024-004", amount: 15000, status: "مسودة", due: "2024-04-01", issued: "2024-03-10" },
  { id: 5, number: "INV-2024-005", client: "فيصل الدوسري", case: "COM-2024-005", amount: 35000, status: "مدفوعة", due: "2024-02-01", issued: "2024-01-05" },
];

const NAV = [
  { id: "dashboard", label: "لوحة التحكم", icon: "⊞" },
  { id: "clients", label: "العملاء", icon: "👥" },
  { id: "cases", label: "القضايا", icon: "⚖️" },
  { id: "calendar", label: "الأجندة", icon: "📅" },
  { id: "invoices", label: "الفواتير", icon: "📄" },
  { id: "ai", label: "المساعد الذكي", icon: "🤖" },
  { id: "analytics", label: "التحليلات", icon: "📊" },
  { id: "settings", label: "الإعدادات", icon: "⚙️" },
];

/* ═══════════════════════════════════════════
   COMPOSANTS DE BASE
═══════════════════════════════════════════ */
function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", ...style }}>
      {children}
    </div>
  );
}

function Badge({ label }) {
  const map = {
    "نشط":       { bg: C.greenBg, c: C.green },
    "غير نشط":   { bg: C.n200, c: C.textMid },
    "قيد النظر": { bg: "#EFF6FF", c: "#1D4ED8" },
    "معلقة":     { bg: C.amberBg, c: C.amber },
    "مفتوحة":    { bg: "#F5F3FF", c: "#7C3AED" },
    "مكسوبة":    { bg: C.greenBg, c: C.green },
    "خسارة":     { bg: C.roseBg, c: C.rose },
    "مغلقة":     { bg: C.n200, c: C.textMid },
    "مدفوعة":    { bg: C.greenBg, c: C.green },
    "مرسلة":     { bg: "#EFF6FF", c: "#1D4ED8" },
    "متأخرة":    { bg: C.roseBg, c: C.rose },
    "مسودة":     { bg: C.n200, c: C.textMid },
    "مؤكد":      { bg: C.greenBg, c: C.green },
    "مجدول":     { bg: "#EFF6FF", c: "#1D4ED8" },
    "ملغي":      { bg: C.roseBg, c: C.rose },
    "عاجلة":     { bg: C.roseBg, c: C.rose },
    "عالية":     { bg: "#FFF7ED", c: "#C2410C" },
    "متوسطة":    { bg: C.amberBg, c: C.amber },
    "منخفضة":    { bg: C.greenBg, c: C.green },
  };
  const s = map[label] || { bg: C.n200, c: C.textMid };
  return (
    <span style={{ background: s.bg, color: s.c, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function Avatar({ name, size = 36, bg = C.primaryMid }) {
  const initials = name ? name.split(" ").slice(0, 2).map(w => w[0]).join("") : "؟";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function StatCard({ label, value, icon, color, sub, trend }) {
  return (
    <Card style={{ padding: "20px 22px", borderTop: `4px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</p>
          <p style={{ margin: "6px 0 4px", fontSize: 30, fontWeight: 900, color: C.text, lineHeight: 1 }}>{value}</p>
          {trend && <p style={{ margin: 0, fontSize: 12, color: C.green, fontWeight: 600 }}>↑ {trend}</p>}
        </div>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
      </div>
      {sub && <p style={{ margin: "10px 0 0", fontSize: 12, color: C.textLight, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>{sub}</p>}
    </Card>
  );
}

function Modal({ title, onClose, children, width = 500 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(3px)" }}>
      <div style={{ background: C.white, borderRadius: 20, padding: 28, width, maxWidth: "92vw", boxShadow: "0 30px 80px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexDirection: "row-reverse" }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: C.n200, border: "none", width: 30, height: 30, borderRadius: "50%", fontSize: 16, cursor: "pointer", color: C.textMid }}>×</button>
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
        style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, outline: "none", boxSizing: "border-box", background: C.n100, textAlign: "right" }} />
    </div>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 5 }}>{label}</label>}
      <select value={value} onChange={onChange}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, background: C.n100, boxSizing: "border-box", outline: "none", textAlign: "right" }}>
        {options.map((o, i) => <option key={i} value={o.v || o}>{o.l || o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", sm = false, full = false }) {
  const vs = {
    primary: { bg: C.primary, color: C.white },
    secondary: { bg: C.n200, color: C.textMid },
    accent: { bg: C.accent, color: C.text },
    danger: { bg: C.roseBg, color: C.rose },
    ghost: { bg: "transparent", color: C.primary, border: `1.5px solid ${C.primary}` },
  };
  const v = vs[variant] || vs.primary;
  return (
    <button onClick={onClick} style={{
      padding: sm ? "6px 14px" : "9px 20px", borderRadius: 9,
      border: v.border || "none", background: v.bg, color: v.color,
      fontSize: sm ? 12 : 13.5, fontWeight: 700, cursor: "pointer",
      width: full ? "100%" : "auto", fontFamily: "Tajawal, sans-serif",
    }}>{children}</button>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════ */
function Dashboard({ setNav }) {
  const kpis = [
    { label: "إجمالي العملاء", value: "45", icon: "👥", color: C.primary, trend: "+8% هذا الشهر", sub: "12 عميل جديد هذا الشهر" },
    { label: "القضايا النشطة", value: "28", icon: "⚖️", color: C.teal, trend: "+3 هذا الأسبوع", sub: "5 مواعيد استماع قادمة" },
    { label: "الإيراد الشهري", value: "185,000 ر.س", icon: "💰", color: C.accent, trend: "+12% مقارنة بالشهر الماضي", sub: "62% تم تحصيله" },
    { label: "معدل الفوز", value: "78%", icon: "🏆", color: C.green, trend: "+5% هذا الربع", sub: "من 50 قضية منتهية" },
  ];

  const typeColors = { "تجاري": C.primary, "أسري": C.teal, "جنائي": C.rose, "عمالي": "#7C3AED", "إداري": C.amber };

  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>مرحباً، المحامي أحمد 👋</h2>
        <p style={{ margin: "4px 0 0", color: C.textLight, fontSize: 14 }}>الثلاثاء 17 ديسمبر 2024 · 5 مواعيد اليوم</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {kpis.map((k, i) => <StatCard key={i} {...k} />)}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginBottom: 18 }}>
        {/* Recent cases */}
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "15px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setNav("cases")} style={{ background: "none", border: "none", color: C.primaryLight, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>← عرض الكل</button>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>أحدث القضايا</h3>
          </div>
          {CASES.slice(0, 5).map((c, i) => (
            <div key={c.id} style={{ padding: "12px 20px", borderBottom: i < 4 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, textAlign: "right" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: C.text }}>{c.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.textLight }}>{c.client} · {c.court}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                <Badge label={c.status} />
                <Badge label={c.priority} />
              </div>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeColors[c.type] || C.primary, flexShrink: 0 }} />
            </div>
          ))}
        </Card>

        {/* Upcoming appointments */}
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "15px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setNav("calendar")} style={{ background: "none", border: "none", color: C.primaryLight, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>← عرض الكل</button>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>المواعيد القادمة</h3>
          </div>
          {APPOINTMENTS.slice(0, 4).map((a, i) => (
            <div key={a.id} style={{ padding: "11px 20px", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, textAlign: "right" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: C.text }}>{a.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: C.textLight }}>{a.client} · {a.time}</p>
              </div>
              <div style={{ textAlign: "center", minWidth: 50 }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.primary }}>{a.date}</p>
              </div>
              <div style={{ width: 3, height: 36, borderRadius: 2, background: i === 0 ? C.rose : C.teal, flexShrink: 0 }} />
            </div>
          ))}
        </Card>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 20 }}>
        {/* Invoices summary */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: C.text, textAlign: "right" }}>ملخص الفواتير</h3>
          {[
            { label: "مدفوعة", count: 2, amount: "57,425", color: C.green },
            { label: "مرسلة", count: 1, amount: "24,725", color: "#1D4ED8" },
            { label: "متأخرة", count: 1, amount: "28,750", color: C.rose },
            { label: "مسودة", count: 1, amount: "15,000", color: C.textLight },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: f.color }}>{f.amount} ر.س</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: C.textLight }}>({f.count})</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.label}</span>
              </div>
            </div>
          ))}
        </Card>

        {/* Case types */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: C.text, textAlign: "right" }}>القضايا حسب النوع</h3>
          {[
            { type: "تجاري", pct: 35, color: C.primary },
            { type: "أسري", pct: 25, color: C.teal },
            { type: "جنائي", pct: 15, color: C.rose },
            { type: "عمالي", pct: 15, color: "#7C3AED" },
            { type: "إداري", pct: 10, color: C.amber },
          ].map((t, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.pct}%</span>
                <span style={{ fontSize: 13, color: C.text }}>{t.type}</span>
              </div>
              <div style={{ background: C.border, borderRadius: 3, height: 5 }}>
                <div style={{ width: `${t.pct}%`, height: "100%", background: t.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Alerts */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: C.text, textAlign: "right" }}>التنبيهات</h3>
          {[
            { icon: "⚠️", msg: "جلسة استماع غداً - قضية حضانة", type: "warning" },
            { icon: "💰", msg: "فاتورة متأخرة - عبدالرحمن الشهري", type: "danger" },
            { icon: "📅", msg: "موعد تسليم مستندات خلال 3 أيام", type: "info" },
            { icon: "✅", msg: "تم استلام دفعة - 22,425 ر.س", type: "success" },
          ].map((a, i) => {
            const bg = { warning: C.amberBg, danger: C.roseBg, info: "#EFF6FF", success: C.greenBg };
            const co = { warning: C.amber, danger: C.rose, info: "#1D4ED8", success: C.green };
            return (
              <div key={i} style={{ background: bg[a.type], borderRadius: 8, padding: "8px 12px", marginBottom: 7, fontSize: 12.5, color: co[a.type], textAlign: "right" }}>
                {a.msg} {a.icon}
              </div>
            );
          })}
        </Card>
      </div>

      {/* CTA */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, borderRadius: 16, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setNav("ai")} style={{ padding: "10px 24px", background: C.accent, color: C.text, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "Tajawal, sans-serif", flexShrink: 0 }}>جرّب الآن ←</button>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, color: C.white, fontWeight: 700, fontSize: 16 }}>🤖 المساعد الذكي للمحامين</p>
          <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.75)", fontSize: 13 }}>صياغة العقود، تلخيص القضايا، الردود القانونية — كل ذلك في ثوانٍ</p>
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", lawyer: "أحمد العلي" });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  // Charger les clients depuis Supabase au démarrage
  useEffect(() => {
    db.get("clients").then(data => {
      if (Array.isArray(data)) setClients(data);
      setLoading(false);
    });
  }, []);

  const filtered = clients.filter(c =>
    c.name?.includes(search) || c.city?.includes(search)
  );

  const add = async () => {
    if (!form.name) return;
    const result = await db.post("clients", {
      ...form,
      cases: 0,
      since: new Date().getFullYear().toString()
    });
    if (Array.isArray(result) && result[0]) {
      setClients([result[0], ...clients]);
      setToast("✅ تم إضافة العميل بنجاح");
      setTimeout(() => setToast(""), 3000);
    }
    setShowAdd(false);
    setForm({ name: "", email: "", phone: "", city: "", lawyer: "أحمد العلي" });
  };

  const remove = async (id) => {
    await db.del("clients", id);
    setClients(clients.filter(c => c.id !== id));
    setToast("تم حذف العميل");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div>
      {/* Toast notification */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#16A34A", color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, zIndex: 9999 }}>
          {toast}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة عميل</Btn>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>العملاء</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>
            {loading ? "جاري التحميل..." : `${filtered.length} عميل · محفوظ في Supabase`}
          </p>
        </div>
      </div>

      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍  البحث عن عميل..."
            style={{ padding: "8px 14px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13.5, width: 280, outline: "none", textAlign: "right", fontFamily: "Tajawal, sans-serif" }} />
        </div>

        {loading ? (
          <div style={{ padding: 50, textAlign: "center", color: C.textLight }}>
            <p style={{ fontSize: 32 }}>⏳</p>
            <p style={{ fontSize: 14 }}>جاري تحميل العملاء من Supabase...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 50, textAlign: "center", color: C.textLight }}>
            <p style={{ fontSize: 32 }}>👥</p>
            <p style={{ fontSize: 14 }}>لا يوجد عملاء. أضف أول عميل!</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", direction: "rtl" }}>
            <thead>
              <tr style={{ background: C.n100 }}>
                {["العميل", "التواصل", "المدينة", "المحامي المكلف", "الحالة", ""].map((h, i) => (
                  <th key={i} style={{ padding: "10px 18px", textAlign: "right", fontSize: 11, fontWeight: 700, color: C.textLight }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "13px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse" }}>
                      <Avatar name={c.name} size={36} bg={i % 2 === 0 ? C.primary : C.teal} />
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: C.text }}>{c.name}</p>
                        <p style={{ margin: 0, fontSize: 11.5, color: C.textLight }}>منذ {c.since}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 18px", textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 12.5 }}>{c.phone}</p>
                    <p style={{ margin: 0, fontSize: 11.5, color: C.textLight }}>{c.email}</p>
                  </td>
                  <td style={{ padding: "13px 18px", fontSize: 13, color: C.textMid, textAlign: "right" }}>{c.city}</td>
                  <td style={{ padding: "13px 18px", fontSize: 13, color: C.textMid, textAlign: "right" }}>{c.lawyer}</td>
                  <td style={{ padding: "13px 18px", textAlign: "right" }}><Badge label={c.status} /></td>
                  <td style={{ padding: "13px 18px" }}>
                    <button onClick={() => remove(c.id)}
                      style={{ background: "#FEF2F2", border: "none", color: "#DC2626", padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
                      حذف
                    </button>
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
            <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#1D4ED8", textAlign: "right" }}>
              💾 سيتم الحفظ مباشرة في قاعدة بيانات Supabase
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="الاسم الكامل *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسم العميل" />
              <Inp label="رقم الهاتف" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+966" />
            </div>
            <Inp label="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="المدينة" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="الرياض" />
              <Sel label="المحامي المكلف" value={form.lawyer} onChange={e => setForm({ ...form, lawyer: e.target.value })} options={["أحمد العلي", "فاطمة السيد", "خالد العمري"]} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8, flexDirection: "row-reverse" }}>
              <Btn onClick={add} full>💾 حفظ في Supabase</Btn>
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
function Cases() {
  const [filter, setFilter] = useState("الكل");
  const [showAdd, setShowAdd] = useState(false);
  const [cases, setCases] = useState(CASES);
  const [form, setForm] = useState({ title: "", client: "", type: "تجاري", court: "", priority: "متوسطة" });

  const statuses = ["الكل", "قيد النظر", "معلقة", "مفتوحة", "مكسوبة", "مغلقة"];
  const filtered = filter === "الكل" ? cases : cases.filter(c => c.status === filter);

  const add = () => {
    if (!form.title) return;
    setCases([...cases, { id: Date.now(), number: `COM-2024-00${cases.length + 1}`, ...form, status: "مفتوحة", lawyer: "أحمد العلي", date: "2024-12-17", hearing: "—", amount: "—" }]);
    setShowAdd(false);
    setForm({ title: "", client: "", type: "تجاري", court: "", priority: "متوسطة" });
  };

  const typeColors = { "تجاري": C.primary, "أسري": C.teal, "جنائي": C.rose, "عمالي": "#7C3AED", "إداري": C.amber, "مدني": C.green };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة قضية</Btn>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>القضايا</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{filtered.length} قضية</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexDirection: "row-reverse", flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 16px", borderRadius: 20, border: `1.5px solid ${filter === s ? C.primary : C.border}`,
            background: filter === s ? C.primary : C.white, color: filter === s ? C.white : C.textMid,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Tajawal, sans-serif",
          }}>{s}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((c) => (
          <Card key={c.id} style={{ padding: "18px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", direction: "rtl" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, background: `${typeColors[c.type] || C.primary}15`, color: typeColors[c.type] || C.primary, padding: "2px 10px", borderRadius: 10, fontWeight: 700 }}>{c.type}</span>
                  <span style={{ fontSize: 11.5, color: C.textLight, fontFamily: "monospace" }}>{c.number}</span>
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: C.text }}>{c.title}</h3>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12.5, color: C.textMid }}>👤 {c.client}</span>
                  <span style={{ fontSize: 12.5, color: C.textMid }}>🏛️ {c.court}</span>
                  <span style={{ fontSize: 12.5, color: C.textMid }}>👨‍💼 {c.lawyer}</span>
                  {c.hearing !== "—" && <span style={{ fontSize: 12.5, color: C.primary, fontWeight: 600 }}>📅 الجلسة: {c.hearing}</span>}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", marginRight: 20 }}>
                <Badge label={c.status} />
                <Badge label={c.priority} />
                {c.amount !== "—" && <span style={{ fontSize: 12, color: C.textLight }}>{c.amount}</span>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showAdd && (
        <Modal title="إضافة قضية جديدة" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <Inp label="عنوان القضية" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: نزاع عقد توريد" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="اسم العميل" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="اسم العميل" />
              <Sel label="نوع القضية" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={["تجاري", "أسري", "جنائي", "عمالي", "إداري", "مدني"]} />
            </div>
            <Inp label="المحكمة" value={form.court} onChange={e => setForm({ ...form, court: e.target.value })} placeholder="اسم المحكمة" />
            <Sel label="الأولوية" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} options={["عاجلة", "عالية", "متوسطة", "منخفضة"]} />
            <div style={{ display: "flex", gap: 10, marginTop: 8, flexDirection: "row-reverse" }}>
              <Btn onClick={add} full>حفظ القضية</Btn>
              <Btn variant="secondary" onClick={() => setShowAdd(false)} full>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CALENDAR
═══════════════════════════════════════════ */
function Calendar() {
  const [showAdd, setShowAdd] = useState(false);
  const [appointments, setAppointments] = useState(APPOINTMENTS);
  const [form, setForm] = useState({ title: "", client: "", type: "استشارة", date: "", time: "", location: "" });

  const add = () => {
    if (!form.title) return;
    setAppointments([...appointments, { id: Date.now(), ...form, lawyer: "أحمد العلي", status: "مجدول" }]);
    setShowAdd(false);
    setForm({ title: "", client: "", type: "استشارة", date: "", time: "", location: "" });
  };

  const typeColors = { "استشارة": C.teal, "جلسة": C.rose, "اجتماع": C.primary, "موعد": C.amber };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <Btn onClick={() => setShowAdd(true)}>+ إضافة موعد</Btn>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الأجندة</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>ديسمبر 2024</p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "اليوم", count: 2, color: C.primary },
          { label: "هذا الأسبوع", count: 5, color: C.teal },
          { label: "جلسات المحكمة", count: 3, color: C.rose },
          { label: "استشارات", count: 4, color: C.accent },
        ].map((s, i) => (
          <Card key={i} style={{ padding: "16px 20px", textAlign: "center", borderTop: `4px solid ${s.color}` }}>
            <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700 }}>{s.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: 32, fontWeight: 900, color: C.text }}>{s.count}</p>
          </Card>
        ))}
      </div>

      {/* Appointment list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {appointments.map((a) => (
          <Card key={a.id} style={{ padding: "16px 22px", borderRight: `4px solid ${typeColors[a.type] || C.primary}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", direction: "rtl" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                  <Badge label={a.status} />
                  <span style={{ fontSize: 11.5, background: `${typeColors[a.type] || C.primary}15`, color: typeColors[a.type] || C.primary, padding: "2px 10px", borderRadius: 10, fontWeight: 700 }}>{a.type}</span>
                </div>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: C.text }}>{a.title}</h3>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 12.5, color: C.textMid }}>👤 {a.client}</span>
                  <span style={{ fontSize: 12.5, color: C.textMid }}>📍 {a.location}</span>
                  <span style={{ fontSize: 12.5, color: C.textMid }}>👨‍💼 {a.lawyer}</span>
                </div>
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.primary }}>{a.date}</p>
                <p style={{ margin: "3px 0 0", fontSize: 13, color: C.textMid }}>{a.time}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showAdd && (
        <Modal title="إضافة موعد جديد" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <Inp label="عنوان الموعد" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: استشارة قانونية" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="اسم العميل" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="اسم العميل" />
              <Sel label="نوع الموعد" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={["استشارة", "جلسة", "اجتماع", "موعد"]} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="التاريخ" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} type="date" />
              <Inp label="الوقت" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="09:00 - 10:00" />
            </div>
            <Inp label="الموقع" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="المكتب / المحكمة / عبر الفيديو" />
            <div style={{ display: "flex", gap: 10, marginTop: 8, flexDirection: "row-reverse" }}>
              <Btn onClick={add} full>حفظ الموعد</Btn>
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
function Invoices() {
  const [invoices, setInvoices] = useState(INVOICES);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ client: "", case: "", amount: "", due: "" });

  const transmit = (id) => setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: "مرسلة" } : inv));
  const markPaid = (id) => setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: "مدفوعة" } : inv));

  const total = invoices.reduce((s, i) => s + i.amount, 0);
  const paid = invoices.filter(i => i.status === "مدفوعة").reduce((s, i) => s + i.amount, 0);

  const add = () => {
    if (!form.client || !form.amount) return;
    setInvoices([...invoices, { id: Date.now(), number: `INV-2024-00${invoices.length + 1}`, ...form, amount: parseFloat(form.amount), status: "مسودة", issued: "2024-12-17" }]);
    setShowAdd(false);
    setForm({ client: "", case: "", amount: "", due: "" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <Btn onClick={() => setShowAdd(true)}>+ فاتورة جديدة</Btn>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الفواتير</h2>
          <p style={{ margin: "3px 0 0", color: C.textLight, fontSize: 13 }}>{invoices.length} فاتورة</p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "إجمالي الفواتير", value: `${total.toLocaleString()} ر.س`, color: C.primary },
          { label: "تم التحصيل", value: `${paid.toLocaleString()} ر.س`, color: C.green },
          { label: "مدفوعة", value: invoices.filter(i => i.status === "مدفوعة").length, color: C.green },
          { label: "متأخرة", value: invoices.filter(i => i.status === "متأخرة").length, color: C.rose },
        ].map((k, i) => (
          <Card key={i} style={{ padding: "18px 20px", borderTop: `4px solid ${k.color}` }}>
            <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontWeight: 700, textAlign: "right" }}>{k.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 900, color: C.text, textAlign: "right" }}>{k.value}</p>
          </Card>
        ))}
      </div>

      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", direction: "rtl" }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>قائمة الفواتير</h3>
          <button onClick={() => setInvoices(invoices.map(inv => inv.status === "مسودة" ? { ...inv, status: "مرسلة" } : inv))}
            style={{ padding: "6px 14px", background: `${C.primary}15`, color: C.primary, border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>
            📤 إرسال الكل
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", direction: "rtl" }}>
          <thead>
            <tr style={{ background: C.n100 }}>
              {["رقم الفاتورة", "العميل", "القضية", "المبلغ", "تاريخ الاستحقاق", "الحالة", "إجراء"].map((h, i) => (
                <th key={i} style={{ padding: "10px 18px", textAlign: "right", fontSize: 11, fontWeight: 700, color: C.textLight }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={inv.id} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: "13px 18px", fontSize: 12, fontWeight: 700, color: C.primary, fontFamily: "monospace" }}>{inv.number}</td>
                <td style={{ padding: "13px 18px", fontSize: 13.5, fontWeight: 700, color: C.text }}>{inv.client}</td>
                <td style={{ padding: "13px 18px", fontSize: 12, color: C.textLight, fontFamily: "monospace" }}>{inv.case}</td>
                <td style={{ padding: "13px 18px", fontSize: 13.5, fontWeight: 800, color: C.text }}>{inv.amount.toLocaleString()} ر.س</td>
                <td style={{ padding: "13px 18px", fontSize: 12.5, color: C.textMid }}>{inv.due}</td>
                <td style={{ padding: "13px 18px" }}><Badge label={inv.status} /></td>
                <td style={{ padding: "13px 18px" }}>
                  {inv.status === "مسودة" && <Btn sm onClick={() => transmit(inv.id)}>إرسال</Btn>}
                  {inv.status === "مرسلة" && <Btn sm variant="ghost" onClick={() => markPaid(inv.id)}>تحصيل</Btn>}
                  {inv.status === "متأخرة" && <Btn sm variant="danger" onClick={() => transmit(inv.id)}>تذكير</Btn>}
                  {inv.status === "مدفوعة" && <Btn sm variant="secondary">PDF</Btn>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showAdd && (
        <Modal title="فاتورة جديدة" onClose={() => setShowAdd(false)}>
          <div style={{ direction: "rtl" }}>
            <Inp label="اسم العميل" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="اسم العميل" />
            <Inp label="رقم القضية" value={form.case} onChange={e => setForm({ ...form, case: e.target.value })} placeholder="مثال: COM-2024-001" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="المبلغ الإجمالي (ر.س)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
              <Inp label="تاريخ الاستحقاق" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} type="date" />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8, flexDirection: "row-reverse" }}>
              <Btn onClick={add} full>إنشاء الفاتورة</Btn>
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
  const [saved, setSaved] = useState(false);
  const [taskType, setTaskType] = useState("استشارة قانونية");

  const DEMOS = {
    "استشارة قانونية": "عميل يسأل عن حقوقه في قضية فصل تعسفي من العمل بعد 10 سنوات خدمة، ولم يتسلم مستحقاته كاملة من نهاية الخدمة وإجازاته المتراكمة.",
    "صياغة عقد": "صياغة عقد شراكة تجارية بين طرفين لإنشاء شركة توزيع مواد غذائية برأس مال 500,000 ريال، مع تحديد نسب الأرباح والخسائر وآلية اتخاذ القرارات.",
    "تلخيص قضية": "القضية رقم COM-2024-001: نزاع بين شركتين حول عقد توريد معدات صناعية بقيمة مليوني ريال. الطرف الأول يدّعي عدم التسليم في الموعد المحدد، والطرف الثاني يؤكد وجود قوة قاهرة بسبب ظروف استثنائية.",
  };

  const generate = async () => {
    if (!input || loading) return;
    setLoading(true); setResult(""); setSaved(false);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          system: `أنت مساعد قانوني متخصص للمحامين في المملكة العربية السعودية. مهمتك هي ${taskType} بأسلوب قانوني احترافي باللغة العربية الفصحى. كن دقيقاً ومنظماً في إجابتك مع الاستشهاد بالأنظمة والقوانين السعودية عند الاقتضاء.`,
          messages: [{ role: "user", content: input }],
        }),
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text || "حدث خطأ أثناء المعالجة.");
    } catch {
      setResult("خطأ في الاتصال بالخادم.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24, textAlign: "right" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>المساعد الذكي للمحامين 🤖</h2>
        <p style={{ margin: "4px 0 0", color: C.textLight, fontSize: 14 }}>صياغة العقود · الاستشارات · تلخيص القضايا · الردود القانونية</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Input */}
        <div>
          <Card style={{ overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "15px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", direction: "rtl" }}>
              <button onClick={() => setInput(DEMOS[taskType])} style={{ padding: "5px 13px", background: `${C.primary}12`, color: C.primary, border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>← مثال تجريبي</button>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>🎙 طلبك القانوني</h3>
            </div>
            <div style={{ padding: 16, direction: "rtl" }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 6 }}>نوع المهمة</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["استشارة قانونية", "صياغة عقد", "تلخيص قضية", "رد قانوني"].map(t => (
                    <button key={t} onClick={() => setTaskType(t)} style={{
                      padding: "5px 13px", borderRadius: 20, border: `1.5px solid ${taskType === t ? C.primary : C.border}`,
                      background: taskType === t ? C.primary : C.white, color: taskType === t ? C.white : C.textMid,
                      fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Tajawal, sans-serif",
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="اكتب طلبك القانوني هنا... مثال: أريد صياغة عقد إيجار تجاري..."
                style={{ width: "100%", minHeight: 180, padding: 13, borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, lineHeight: 1.8, resize: "vertical", background: C.n100, boxSizing: "border-box", outline: "none", fontFamily: "Tajawal, sans-serif", textAlign: "right", direction: "rtl" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0 12px" }}>
                <button onClick={() => { setInput(""); setResult(""); }} style={{ background: "none", border: "none", color: C.textLight, fontSize: 12, cursor: "pointer" }}>مسح</button>
                <span style={{ fontSize: 11.5, color: C.textLight }}>{input.length} حرف</span>
              </div>
              <button onClick={generate} disabled={!input || loading} style={{
                width: "100%", padding: "12px", borderRadius: 10,
                background: input && !loading ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` : C.border,
                color: input && !loading ? C.white : C.textLight,
                border: "none", fontWeight: 700, fontSize: 14.5, cursor: input && !loading ? "pointer" : "default",
                fontFamily: "Tajawal, sans-serif",
              }}>
                {loading ? "⏳  جاري التحليل..." : "🤖  تنفيذ المهمة القانونية"}
              </button>
            </div>
          </Card>

          <Card style={{ padding: 18 }}>
            <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: C.textMid, textAlign: "right" }}>الميزات المتاحة</p>
            {[
              { icon: "📝", label: "صياغة العقود والاتفاقيات", ok: true },
              { icon: "⚖️", label: "الاستشارات القانونية الفورية", ok: true },
              { icon: "📋", label: "تلخيص وتحليل القضايا", ok: true },
              { icon: "💬", label: "صياغة الردود على المراسلات", ok: true },
              { icon: "📊", label: "تحليل المخاطر القانونية", ok: false },
              { icon: "🔍", label: "البحث في الأنظمة والتشريعات", ok: false },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 5 ? `1px solid ${C.border}` : "none", direction: "rtl" }}>
                <span style={{ fontSize: 11, background: f.ok ? C.greenBg : C.amberBg, color: f.ok ? C.green : C.amber, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{f.ok ? "متاح" : "قريباً"}</span>
                <span style={{ fontSize: 13, color: C.textMid }}>{f.label} {f.icon}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Output */}
        <Card style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "15px 20px", borderBottom: `1px solid ${C.border}`, background: `${C.primary}06`, display: "flex", justifyContent: "space-between", alignItems: "center", direction: "rtl" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>📋 النتيجة القانونية</h3>
            {result && !loading && <span style={{ fontSize: 11, background: C.greenBg, color: C.green, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>✓ مكتمل</span>}
          </div>
          <div style={{ flex: 1, padding: 20, direction: "rtl" }}>
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.primary, animation: "spin 0.8s linear infinite" }} />
                <p style={{ margin: 0, fontSize: 14, color: C.textLight }}>جاري معالجة طلبك القانوني...</p>
              </div>
            )}
            {result && !loading && (
              <div>
                <div style={{ background: C.n100, borderRadius: 12, padding: 18, fontSize: 13.5, color: C.textMid, lineHeight: 2, whiteSpace: "pre-line", maxHeight: 380, overflowY: "auto", textAlign: "right" }}>
                  {result}
                </div>
                {saved && <div style={{ marginTop: 10, padding: "9px 14px", background: C.greenBg, borderRadius: 8, fontSize: 13, color: C.green, fontWeight: 600, textAlign: "right" }}>✓ تم حفظ النتيجة في ملف القضية</div>}
                <div style={{ display: "flex", gap: 9, marginTop: 12 }}>
                  <button onClick={() => setSaved(true)} style={{ flex: 1, padding: "10px", background: C.primary, color: C.white, border: "none", borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Tajawal, sans-serif" }}>✓ حفظ في الملف</button>
                  <button onClick={() => { setResult(""); setInput(""); }} style={{ padding: "10px 14px", background: C.n200, color: C.textMid, border: "none", borderRadius: 9, fontSize: 12, cursor: "pointer" }}>↩</button>
                  <button style={{ padding: "10px 14px", background: C.n200, color: C.textMid, border: "none", borderRadius: 9, fontSize: 12, cursor: "pointer" }}>📋 نسخ</button>
                  <button style={{ padding: "10px 14px", background: C.n200, color: C.textMid, border: "none", borderRadius: 9, fontSize: 12, cursor: "pointer" }}>📤 PDF</button>
                </div>
              </div>
            )}
            {!result && !loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, color: C.textLight, gap: 12 }}>
                <span style={{ fontSize: 56, opacity: 0.2 }}>⚖️</span>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>النتيجة ستظهر هنا</p>
                <p style={{ margin: 0, fontSize: 12 }}>اكتب طلبك أو جرّب المثال التجريبي</p>
              </div>
            )}
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
    { month: "يناير", revenue: 145000, cases: 8 },
    { month: "فبراير", revenue: 162000, cases: 10 },
    { month: "مارس", revenue: 138000, cases: 7 },
    { month: "أبريل", revenue: 175000, cases: 12 },
    { month: "مايو", revenue: 198000, cases: 14 },
    { month: "يونيو", revenue: 185000, cases: 11 },
  ];
  const maxRev = Math.max(...monthly.map(m => m.revenue));

  const indicators = [
    { name: "معدل الفوز في القضايا", target: 80, current: 78, unit: "%", trend: "↑" },
    { name: "رضا العملاء", target: 90, current: 92, unit: "%", trend: "↑" },
    { name: "متوسط الرد على العملاء", target: 24, current: 18, unit: "ساعة", trend: "↑" },
    { name: "معدل تحصيل الفواتير", target: 95, current: 88, unit: "%", trend: "↓" },
    { name: "الالتزام بالمواعيد", target: 98, current: 96, unit: "%", trend: "→" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 22, textAlign: "right" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>التحليلات والإحصاءات</h2>
        <p style={{ margin: "4px 0 0", color: C.textLight, fontSize: 14 }}>النصف الأول من 2024</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        <StatCard label="إجمالي الإيراد" value="1,003,000 ر.س" icon="💰" color={C.accent} />
        <StatCard label="عدد القضايا" value="62" icon="⚖️" color={C.primary} />
        <StatCard label="معدل الفوز" value="78%" icon="🏆" color={C.green} />
        <StatCard label="رضا العملاء" value="92%" icon="⭐" color={C.teal} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginBottom: 18 }}>
        {/* Revenue chart */}
        <Card style={{ padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: C.text, textAlign: "right" }}>الإيراد الشهري (ر.س)</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180, direction: "rtl" }}>
            {monthly.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, color: C.textLight, fontWeight: 700 }}>{(m.revenue / 1000).toFixed(0)}K</span>
                <div style={{ width: "100%", background: `linear-gradient(180deg, ${C.primaryLight}, ${C.primary})`, borderRadius: "6px 6px 0 0", height: `${(m.revenue / maxRev) * 140}px`, position: "relative", cursor: "pointer" }}>
                  <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: C.textLight, whiteSpace: "nowrap" }}>{m.cases} ق</div>
                </div>
                <span style={{ fontSize: 10.5, color: C.textMid, textAlign: "center" }}>{m.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Case types */}
        <Card style={{ padding: 24 }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: C.text, textAlign: "right" }}>توزيع القضايا</h3>
          {[
            { type: "تجاري", pct: 35, color: C.primary },
            { type: "أسري", pct: 25, color: C.teal },
            { type: "جنائي", pct: 15, color: C.rose },
            { type: "عمالي", pct: 15, color: "#7C3AED" },
            { type: "إداري", pct: 10, color: C.amber },
          ].map((t, i) => (
            <div key={i} style={{ marginBottom: 14, direction: "rtl" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.pct}%</span>
                <span style={{ fontSize: 13.5, color: C.text }}>{t.type}</span>
              </div>
              <div style={{ background: C.border, borderRadius: 4, height: 8 }}>
                <div style={{ width: `${t.pct}%`, height: "100%", background: t.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Quality indicators */}
      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "15px 22px", borderBottom: `1px solid ${C.border}`, textAlign: "right" }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>مؤشرات الجودة</h3>
        </div>
        {indicators.map((ind, i) => (
          <div key={i} style={{ padding: "16px 22px", borderBottom: i < indicators.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 16, direction: "rtl" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: ind.current >= ind.target ? C.green : C.rose }}>
                  {ind.current}{ind.unit} <span style={{ fontWeight: 400, color: C.textLight, fontSize: 12 }}>/ هدف {ind.target}{ind.unit}</span>
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{ind.name}</span>
              </div>
              <div style={{ background: C.border, borderRadius: 4, height: 7 }}>
                <div style={{ width: `${Math.min(100, (ind.current / ind.target) * 100)}%`, height: "100%", background: ind.current >= ind.target ? C.green : C.rose, borderRadius: 4 }} />
              </div>
            </div>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{ind.trend === "↑" ? "✅" : ind.trend === "↓" ? "⚠️" : "➡️"}</span>
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
    name: "أحمد محمد العلي",
    email: "ahmed@mohami-pro.com",
    phone: "+966501234567",
    office: "مكتب العلي للمحاماة والاستشارات القانونية",
    license: "12345/ن",
    city: "الرياض",
    sms: true,
    email_notif: true,
    reminders: true,
  });

  return (
    <div>
      <div style={{ marginBottom: 22, textAlign: "right" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>الإعدادات</h2>
        <p style={{ margin: "4px 0 0", color: C.textLight, fontSize: 14 }}>إدارة الحساب والتفضيلات</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, direction: "rtl" }}>
        {/* Sidebar settings */}
        <Card style={{ padding: 16 }}>
          {["الملف الشخصي", "المكتب", "الإشعارات", "الأمان", "الفواتير", "المساعدون"].map((s, i) => (
            <button key={i} style={{
              display: "block", width: "100%", textAlign: "right", padding: "10px 12px", borderRadius: 9,
              border: "none", background: i === 0 ? `${C.primary}12` : "transparent",
              color: i === 0 ? C.primary : C.textMid, fontSize: 13.5, fontWeight: i === 0 ? 700 : 500,
              cursor: "pointer", marginBottom: 2, fontFamily: "Tajawal, sans-serif",
            }}>{s}</button>
          ))}
        </Card>

        <div>
          <Card style={{ padding: 24, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: C.text, textAlign: "right" }}>الملف الشخصي</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="الاسم الكامل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Inp label="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="رقم الهاتف" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <Inp label="رقم ترخيص المحاماة" value={form.license} onChange={e => setForm({ ...form, license: e.target.value })} />
            </div>
            <Inp label="اسم المكتب" value={form.office} onChange={e => setForm({ ...form, office: e.target.value })} />
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Btn>حفظ التغييرات</Btn>
            </div>
          </Card>

          <Card style={{ padding: 24 }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: C.text, textAlign: "right" }}>الإشعارات والتنبيهات</h3>
            {[
              { label: "إشعارات SMS للمواعيد", key: "sms", desc: "إرسال رسالة نصية قبل 24 ساعة من كل موعد" },
              { label: "إشعارات البريد الإلكتروني", key: "email_notif", desc: "تلقي ملخص يومي بالمواعيد والمهام" },
              { label: "تذكيرات الجلسات", key: "reminders", desc: "تنبيه تلقائي قبل مواعيد المحاكم" },
            ].map((n, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none", direction: "rtl" }}>
                <button onClick={() => setForm({ ...form, [n.key]: !form[n.key] })} style={{
                  width: 44, height: 24, borderRadius: 12, border: "none",
                  background: form[n.key] ? C.primary : C.border,
                  cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
                }}>
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
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP SHELL
═══════════════════════════════════════════ */
export default function App() {
  const [nav, setNav] = useState("dashboard");

  const renderPage = () => {
    switch (nav) {
      case "dashboard":  return <Dashboard setNav={setNav} />;
      case "clients":    return <Clients />;
      case "cases":      return <Cases />;
      case "calendar":   return <Calendar />;
      case "invoices":   return <Invoices />;
      case "ai":         return <AIAssistant />;
      case "analytics":  return <Analytics />;
      case "settings":   return <Settings />;
      default:           return <Dashboard setNav={setNav} />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F1F5F9; font-family: 'Tajawal', sans-serif; direction: rtl; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        button { font-family: 'Tajawal', sans-serif; }
        input, textarea, select { font-family: 'Tajawal', sans-serif; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", direction: "rtl" }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: 230, background: C.primary, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
          {/* Logo */}
          <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚖️</div>
              <div>
                <p style={{ margin: 0, color: C.white, fontWeight: 800, fontSize: 16 }}>محامي برو</p>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 600, letterSpacing: 0.5 }}>نظام إدارة المكاتب</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "14px 10px" }}>
            <p style={{ margin: "0 10px 8px", fontSize: 9.5, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>القائمة الرئيسية</p>
            {NAV.map(item => {
              const active = nav === item.id;
              return (
                <button key={item.id} onClick={() => setNav(item.id)} style={{
                  width: "100%", textAlign: "right", padding: "10px 12px", borderRadius: 9,
                  border: "none", cursor: "pointer",
                  background: active ? "rgba(255,255,255,0.12)" : "transparent",
                  color: active ? C.white : "rgba(255,255,255,0.55)",
                  fontSize: 14, fontWeight: active ? 700 : 500, marginBottom: 1,
                  display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-start",
                  borderRight: `3px solid ${active ? C.accent : "transparent"}`,
                  transition: "all 0.1s", fontFamily: "Tajawal, sans-serif",
                }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                  {item.id === "ai" && <span style={{ marginRight: "auto", fontSize: 9, background: C.accent, color: C.text, padding: "1px 6px", borderRadius: 10, fontWeight: 800 }}>جديد</span>}
                </button>
              );
            })}
          </nav>

          {/* User */}
          <div style={{ padding: "14px 16px 18px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name="أحمد العلي" size={34} bg={C.accent} />
              <div>
                <p style={{ margin: 0, color: C.white, fontSize: 13, fontWeight: 700 }}>أحمد محمد العلي</p>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 11 }}>المحامي الرئيسي</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, overflowY: "auto", background: C.bg }}>
          {/* Top bar */}
          <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, direction: "rtl" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: C.textLight }}>محامي برو</span>
              <span style={{ color: C.border }}>›</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{NAV.find(n => n.id === nav)?.label || "لوحة التحكم"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12.5, color: C.textLight }}>الثلاثاء 17 ديسمبر 2024</span>
              <div style={{ position: "relative" }}>
                <button style={{ background: C.n100, border: "none", width: 36, height: 36, borderRadius: "50%", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>🔔</button>
                <div style={{ position: "absolute", top: 0, left: 0, width: 10, height: 10, borderRadius: "50%", background: C.rose, border: "2px solid white" }} />
              </div>
              <Avatar name="أحمد العلي" size={36} bg={C.primary} />
            </div>
          </div>

          {/* Page content */}
          <div style={{ padding: "28px 32px" }}>
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}
