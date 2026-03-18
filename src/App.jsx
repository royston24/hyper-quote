
import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES = {
  branding: {
    label: "Branding & Strategy",
    icon: "◈",
    items: [
      { id: "b1", name: "Brand Naming", desc: "Concepts + rationale document", client: [1800,3500], agency: [1500,2800] },
      { id: "b2", name: "Brand Audit & Competitive Analysis", desc: "Landscape review + positioning gaps", client: [2500,4500], agency: [2000,3500] },
      { id: "b3", name: "Brand Strategy & Positioning", desc: "Full strategy, vision, mission & positioning", client: [4500,8000], agency: [3500,6500] },
      { id: "b4", name: "Logo Design", desc: "3 concepts + 2 rounds of revisions", client: [2500,5000], agency: [2000,4000] },
      { id: "b5", name: "Visual Identity System", desc: "Logo + typography + colour + usage rules", client: [5000,10000], agency: [4000,8000] },
      { id: "b6", name: "Full Brand Identity + Guidelines", desc: "Complete identity with guidelines document", client: [8000,18000], agency: [7000,14000] },
      { id: "b7", name: "Brand Guidelines (Existing Brand)", desc: "Codify rules for an existing brand", client: [2500,5000], agency: [2000,4000] },
      { id: "b8", name: "Messaging & Tone of Voice", desc: "Framework + writing examples", client: [2500,4500], agency: [2000,3800] },
      { id: "b9", name: "Full Rebranding", desc: "Audit through final delivery", client: [15000,30000], agency: [12000,25000] },
    ]
  },
  design: {
    label: "Design & Social Media",
    icon: "◎",
    items: [
      { id: "d1", name: "Social Media Strategy & Content Plan", desc: "Platform strategy + content architecture", client: [2500,5000], agency: [2000,4000] },
      { id: "d2", name: "Monthly Retainer — Starter", desc: "8 posts + strategy per month", client: [1800,2500], agency: [1500,2000], unit: "/ mth", retainer: true },
      { id: "d3", name: "Monthly Retainer — Standard", desc: "16 posts + strategy per month", client: [3000,4500], agency: [2500,3800], unit: "/ mth", retainer: true },
      { id: "d4", name: "Monthly Retainer — Premium", desc: "24 posts + stories + strategy", client: [5000,8000], agency: [4000,6500], unit: "/ mth", retainer: true },
      { id: "d5", name: "Campaign Concept & Key Visual", desc: "Up to 3 creative routes", client: [3500,7000], agency: [2800,5500] },
      { id: "d5a", name: "Standalone Key Visual", desc: "Single execution, no concept development", client: [2000,4000], agency: [1600,3200] },
      { id: "d5b", name: "Festive / Seasonal Key Visual", desc: "CNY, Christmas, Hari Raya, product launches", client: [1800,3500], agency: [1500,2800] },
      { id: "d6", name: "Key Visual Adaptations", desc: "Per format/size", client: [200,400], agency: [150,350], unit: "each", qty: true },
      { id: "d7", name: "Digital Banner Set", desc: "6 standard formats", client: [800,1500], agency: [600,1200] },
      { id: "d14", name: "Packaging Design — Single SKU", desc: "Concept through final artwork", client: [2500,5000], agency: [2000,4000] },
      { id: "d15", name: "Packaging Design System", desc: "3–5 SKUs, cohesive range", client: [6000,12000], agency: [5000,10000] },
      { id: "d16", name: "Packaging Artwork & Dieline", desc: "Per SKU, print-ready files", client: [600,1200], agency: [500,1000], unit: "per SKU", qty: true },
      { id: "d8", name: "EDM / Email Newsletter Design", desc: "Per EDM template", client: [600,1200], agency: [500,950] },
      { id: "d9", name: "Copywriting — Social Post", desc: "Per post", client: [80,150], agency: [60,120], unit: "each", qty: true },
      { id: "d10", name: "Copywriting — Long Form", desc: "Articles, whitepapers, scripts", client: [500,1200], agency: [400,1000], unit: "each", qty: true },
      { id: "d11", name: "Photography Art Direction", desc: "Per day, excl. production costs", client: [1500,2500], agency: [1200,2000], unit: "/ day", qty: true },
      { id: "d12", name: "Video Creative Direction", desc: "Concept + direction, excl. production", client: [2500,5000], agency: [2000,4000] },
      { id: "d13", name: "Presentation / Pitch Deck Design", desc: "Strategy decks, credential decks", client: [1500,3500], agency: [1200,2800] },
    ]
  },
  spaces: {
    label: "Spaces & Interiors",
    icon: "◻",
    items: [
      { id: "s1", name: "Space Branding & Concept Development", desc: "Environmental brand application", client: [3500,7000], agency: [3000,6000], partnership: true },
      { id: "s2", name: "Signage & Wayfinding Design", desc: "System design, not production", client: [3000,6000], agency: [2500,5000], partnership: true },
      { id: "s3", name: "Retail / F&B Visual Identity Application", desc: "Brand applied to physical space", client: [4000,8000], agency: [3500,7000], partnership: true },
      { id: "s4", name: "Interior Creative Direction", desc: "Consultation, moodboarding, direction", client: [1500,3000], agency: [1200,2500], partnership: true },
      { id: "s5", name: "Full Interior Design Project", desc: "Concept through project management", client: null, agency: null, partnership: true, custom: true },
    ]
  }
};

const fmt = (n) => n?.toLocaleString("en-SG", { minimumFractionDigits: 0 });

// ─── Sub-components ──────────────────────────────────────────────────────────

function ServiceRow({ item, mode, selected, qty, onToggle, onQty }) {
  const prices = mode === "client" ? item.client : item.agency;
  const isSelected = selected;

  return (
    <div
      onClick={() => !item.custom && onToggle(item.id)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        padding: "14px 16px",
        marginBottom: "6px",
        borderRadius: "10px",
        background: isSelected ? "rgba(200,169,110,0.10)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isSelected ? "rgba(200,169,110,0.45)" : "rgba(255,255,255,0.07)"}`,
        cursor: item.custom ? "default" : "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0, marginTop: "2px",
        border: `1.5px solid ${isSelected ? "#C8A96E" : "rgba(255,255,255,0.2)"}`,
        background: isSelected ? "#C8A96E" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s ease",
      }}>
        {isSelected && <span style={{ color: "#111", fontSize: "11px", fontWeight: 700 }}>✓</span>}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Pitagon Sans Mono', monospace", fontSize: "15px", fontWeight: 600, color: "#F5F0E8" }}>
            {item.name}
          </span>
          {item.partnership && (
            <span style={{
              fontSize: "9px", letterSpacing: "0.08em", padding: "2px 7px", borderRadius: "3px",
              background: "rgba(200,169,110,0.15)", color: "#C8A96E", fontFamily: "'Pitagon Sans Mono', monospace",
              border: "1px solid rgba(200,169,110,0.25)"
            }}>PARTNERSHIP</span>
          )}
          {item.retainer && (
            <span style={{
              fontSize: "9px", letterSpacing: "0.08em", padding: "2px 7px", borderRadius: "3px",
              background: "rgba(100,160,255,0.12)", color: "#80AAFF", fontFamily: "'Pitagon Sans Mono', monospace",
              border: "1px solid rgba(100,160,255,0.2)"
            }}>RETAINER</span>
          )}
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "3px", fontFamily: "'Pitagon Sans Mono', monospace" }}>
          {item.desc}
        </div>
        {/* Qty selector */}
        {item.qty && isSelected && (
          <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "'Pitagon Sans Mono', monospace" }}>QTY</span>
            {[1,2,3,5,10].map(n => (
              <button key={n} onClick={e => { e.stopPropagation(); onQty(item.id, n); }}
                style={{
                  width: "30px", height: "26px", borderRadius: "5px", border: "none",
                  background: qty === n ? "#C8A96E" : "rgba(255,255,255,0.08)",
                  color: qty === n ? "#111" : "rgba(255,255,255,0.5)",
                  fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  fontFamily: "'Pitagon Sans Mono', monospace"
                }}>{n}</button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        {item.custom ? (
          <span style={{ fontSize: "11px", color: "#C8A96E", fontFamily: "'Pitagon Sans Mono', monospace", letterSpacing: "0.05em" }}>
            CUSTOM QUOTE
          </span>
        ) : (
          <>
            <div style={{ fontFamily: "'Pitagon Sans Mono', monospace", fontSize: "12px", color: isSelected ? "#C8A96E" : "rgba(255,255,255,0.45)", letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
              SGD {fmt(prices?.[0])} – {fmt(prices?.[1])}
            </div>
            {item.unit && (
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'Pitagon Sans Mono', monospace", marginTop: "2px" }}>
                {item.unit}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState("client"); // "client" | "agency"
  const [activeTab, setActiveTab] = useState("branding");
  const [selected, setSelected] = useState({}); // id -> qty
  const [step, setStep] = useState("configure"); // "configure" | "summary"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const summaryRef = useRef(null);

  // ── WhatsApp notification via CallMeBot ──
  const WA_PHONE  = "6580446111";
  const WA_APIKEY = "5561574";

  const handleFormSubmit = async () => {
    if (!name || !email) return;
    setSubmitting(true);
    setSubmitError(false);

    const clientType = mode === "agency" ? "Agency Partner" : "Direct Client";

    const estimate = totalLow > 0
      ? `SGD ${totalLow.toLocaleString()} - ${totalHigh.toLocaleString()}${hasCustom ? "+" : ""}`
      : "Custom Quote";

    const serviceLines = selectedItems.map(item =>
      item.custom
        ? `- ${item.name}${item.qty > 1 ? " x" + item.qty : ""}: Custom Quote`
        : `- ${item.name}${item.qty > 1 ? " x" + item.qty : ""}: SGD ${item.low.toLocaleString()} - ${item.high.toLocaleString()}`
    ).join("\n");

    const rawMsg = [
      "New Brief - Hyper Creatives",
      "",
      "Name: " + name,
      "Email: " + email,
      "Company: " + (company || "Not provided"),
      "Type: " + clientType,
      "",
      "Selected Services:",
      serviceLines,
      "",
      "Estimated Total: " + estimate,
      "",
      "Reply to: " + email,
    ].join("\n");

    const encoded = encodeURIComponent(rawMsg);
    const url = "https://api.callmebot.com/whatsapp.php?phone=" + WA_PHONE + "&text=" + encoded + "&apikey=" + WA_APIKEY;

    try {
      await fetch(url, { method: "GET", mode: "no-cors" });
    } catch (err) {
      // no-cors fetch always resolves — this catch is a safeguard
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  // ── Agency password gate ──
  const AGENCY_PASSWORD = "Hypercreatives2026";
  const [agencyUnlocked, setAgencyUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [pwShake, setPwShake] = useState(false);

  const handleAgencyClick = () => {
    if (agencyUnlocked) {
      setMode("agency");
    } else {
      setPwInput("");
      setPwError(false);
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (pwInput === AGENCY_PASSWORD) {
      setAgencyUnlocked(true);
      setShowPasswordModal(false);
      setMode("agency");
      setPwError(false);
    } else {
      setPwError(true);
      setPwShake(true);
      setTimeout(() => setPwShake(false), 500);
    }
  };

  const toggle = (id) => {
    setSelected(prev => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });
  };

  const setQty = (id, qty) => {
    setSelected(prev => ({ ...prev, [id]: qty }));
  };

  // Build selected items list with computed totals
  const selectedItems = Object.entries(selected).map(([id, qty]) => {
    for (const cat of Object.values(SERVICES)) {
      const item = cat.items.find(i => i.id === id);
      if (item) {
        const prices = mode === "client" ? item.client : item.agency;
        return { ...item, qty, low: (prices?.[0] ?? 0) * qty, high: (prices?.[1] ?? 0) * qty };
      }
    }
    return null;
  }).filter(Boolean);

  const totalLow = selectedItems.reduce((s, i) => s + (i.low || 0), 0);
  const totalHigh = selectedItems.reduce((s, i) => s + (i.high || 0), 0);
  const hasCustom = selectedItems.some(i => i.custom);
  const count = Object.keys(selected).length;

  const tabs = Object.entries(SERVICES);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F0F0F",
      fontFamily: "'Pitagon Sans Mono', monospace",
      color: "#F5F0E8",
    }}>
      {/* Google Fonts */}
      <style>{`
        @font-face {
          font-family: 'Pitagon Sans Mono';
          src: url('https://cdn.jsdelivr.net/gh/pitagon/pitagon-sans-mono@main/fonts/PitagonSansMono-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'Pitagon Sans Mono';
          src: url('https://cdn.jsdelivr.net/gh/pitagon/pitagon-sans-mono@main/fonts/PitagonSansMono-Bold.woff2') format('woff2');
          font-weight: 700;
          font-style: normal;
        }
        @font-face {
          font-family: 'Pitagon Sans Mono';
          src: url('https://cdn.jsdelivr.net/gh/pitagon/pitagon-sans-mono@main/fonts/PitagonSansMono-Light.woff2') format('woff2');
          font-weight: 300;
          font-style: normal;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .mode-btn { transition: all 0.2s ease; }
        .mode-btn:hover { opacity: 0.85; }
        .tab-btn { transition: all 0.2s ease; }
        .tab-btn:hover { background: rgba(255,255,255,0.06) !important; }
        .cta-btn { transition: all 0.2s ease; }
        .cta-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .svc-row:hover { background: rgba(255,255,255,0.04) !important; }
        input { transition: border-color 0.2s; }
        input:focus { outline: none; border-color: #C8A96E !important; }
      `}</style>

      {/* ── Top Nav ── */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(15,15,15,0.95)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="data:image/png;base64,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"
            alt="Hyper Creatives"
            style={{ height: "28px", width: "auto", display: "block" }}
          />
          <span style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.15)" }} />
          <span style={{ fontSize: "11px", color: "#C8A96E", fontFamily: "'Pitagon Sans Mono', monospace", letterSpacing: "0.1em" }}>
            QUICK QUOTE
          </span>
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'Pitagon Sans Mono', monospace" }}>
          SGD · SINGAPORE
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{
        padding: "52px 32px 36px",
        maxWidth: "980px",
        margin: "0 auto",
      }}>
        <div style={{ marginBottom: "10px" }}>
          <span style={{ fontSize: "11px", color: "#C8A96E", fontFamily: "'Pitagon Sans Mono', monospace", letterSpacing: "0.12em" }}>
            BUILD YOUR BRIEF
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Pitagon Sans Mono', monospace",
          fontSize: "clamp(32px, 5vw, 50px)",
          fontWeight: 600,
          lineHeight: 1.15,
          color: "#F5F0E8",
          marginBottom: "16px",
          maxWidth: "600px",
        }}>
          GOT A PROJECT AND NEED SOME CLARITY?
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", maxWidth: "500px", lineHeight: 1.7 }}>
          Get an instant estimate for your project. Select the services you need and we'll generate a scoping estimate instantly! No forms, no waiting.
        </p>

        {/* ── Mode Toggle ── */}
        <div style={{
          display: "inline-flex",
          marginTop: "28px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "10px",
          padding: "4px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <button className="mode-btn" onClick={() => setMode("client")}
            style={{
              padding: "8px 22px",
              borderRadius: "7px",
              border: "none",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              cursor: "pointer",
              fontFamily: "'Pitagon Sans Mono', monospace",
              background: mode === "client" ? "#C8A96E" : "transparent",
              color: mode === "client" ? "#111111" : "rgba(255,255,255,0.5)",
            }}>
            Direct Client
          </button>
          <button className="mode-btn" onClick={handleAgencyClick}
            style={{
              padding: "8px 22px",
              borderRadius: "7px",
              border: "none",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              cursor: "pointer",
              fontFamily: "'Pitagon Sans Mono', monospace",
              background: mode === "agency" ? "#C8A96E" : "transparent",
              color: mode === "agency" ? "#111111" : "rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
            Agency Partner
            {!agencyUnlocked && (
              <span style={{ fontSize: "10px", opacity: 0.5 }}>🔒</span>
            )}
          </button>
        </div>

        {mode === "agency" && (
          <div style={{
            marginTop: "12px",
            padding: "10px 14px",
            background: "rgba(100,160,255,0.07)",
            border: "1px solid rgba(100,160,255,0.18)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "rgba(150,185,255,0.75)",
            maxWidth: "480px",
            fontFamily: "'Pitagon Sans Mono', monospace",
          }}>
            Agency rates are ~15–20% below direct client pricing. All deliverables are white-label ready.
          </div>
        )}
      </div>

      {/* ── Main Layout ── */}
      <div style={{
        maxWidth: "980px",
        margin: "0 auto",
        padding: "0 32px 80px",
        display: "grid",
        gridTemplateColumns: "1fr 310px",
        gap: "24px",
        alignItems: "start",
      }}>

        {/* LEFT: Service selector */}
        <div>
          {/* Category Tabs */}
          <div style={{
            display: "flex",
            gap: "6px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}>
            {tabs.map(([key, cat]) => {
              const catCount = cat.items.filter(i => selected[i.id]).length;
              return (
                <button key={key} className="tab-btn" onClick={() => setActiveTab(key)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    border: `1px solid ${activeTab === key ? "rgba(200,169,110,0.5)" : "rgba(255,255,255,0.08)"}`,
                    background: activeTab === key ? "rgba(200,169,110,0.1)" : "transparent",
                    color: activeTab === key ? "#C8A96E" : "rgba(255,255,255,0.45)",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    fontFamily: "'Pitagon Sans Mono', monospace",
                    fontWeight: 500,
                  }}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {catCount > 0 && (
                    <span style={{
                      background: "#C8A96E", color: "#111", borderRadius: "50%",
                      width: "16px", height: "16px", fontSize: "9px", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Pitagon Sans Mono', monospace"
                    }}>{catCount}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Service Rows */}
          <div>
            {SERVICES[activeTab]?.items.map(item => (
              <ServiceRow
                key={item.id}
                item={item}
                mode={mode}
                selected={!!selected[item.id]}
                qty={selected[item.id] || 1}
                onToggle={toggle}
                onQty={setQty}
              />
            ))}
          </div>

          {/* Spaces note */}
          {activeTab === "spaces" && (
            <div style={{
              marginTop: "16px",
              padding: "14px 16px",
              background: "rgba(200,169,110,0.06)",
              borderRadius: "10px",
              border: "1px solid rgba(200,169,110,0.2)",
              fontSize: "12px",
              color: "rgba(200,169,110,0.7)",
              lineHeight: 1.6,
            }}>
              <strong style={{ color: "#C8A96E" }}>Partnership note —</strong> Spaces & Interiors is delivered 
              through Hyper Creatives' dedicated interior design partnership. Creative direction remains 
              with our team. A site survey may be required for full project scopes.
            </div>
          )}
        </div>

        {/* RIGHT: Estimate panel */}
        <div ref={summaryRef} style={{
          position: "sticky",
          top: "76px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          overflow: "hidden",
        }}>
          {/* Panel header */}
          <div style={{
            padding: "18px 20px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: "10px", color: "#C8A96E", fontFamily: "'Pitagon Sans Mono', monospace", letterSpacing: "0.1em", marginBottom: "6px" }}>
              YOUR ESTIMATE
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'Pitagon Sans Mono', monospace" }}>
              {count === 0 ? "No services selected yet" : `${count} service${count !== 1 ? "s" : ""} selected`}
            </div>
          </div>

          {/* Items list */}
          <div style={{ padding: "14px 20px", maxHeight: "320px", overflowY: "auto" }}>
            {selectedItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.2)", fontSize: "12px", lineHeight: 1.7 }}>
                ← Select services<br />from the left
              </div>
            ) : (
              selectedItems.map(item => (
                <div key={item.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  paddingBottom: "12px",
                  marginBottom: "12px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  gap: "8px",
                }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#F5F0E8", fontFamily: "'Pitagon Sans Mono', monospace", lineHeight: 1.4 }}>
                      {item.name}
                      {item.qty > 1 && <span style={{ color: "#C8A96E", marginLeft: "5px" }}>×{item.qty}</span>}
                    </div>
                    {item.custom && (
                      <div style={{ fontSize: "10px", color: "#C8A96E", fontFamily: "'Pitagon Sans Mono', monospace", marginTop: "2px" }}>
                        Custom — contact us
                      </div>
                    )}
                  </div>
                  {!item.custom && (
                    <div style={{ textAlign: "right", flexShrink: 0, fontSize: "11px", color: "rgba(255,255,255,0.5)", fontFamily: "'Pitagon Sans Mono', monospace", whiteSpace: "nowrap" }}>
                      {fmt(item.low)} – {fmt(item.high)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Total */}
          {count > 0 && (
            <div style={{
              padding: "14px 20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(200,169,110,0.05)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "'Pitagon Sans Mono', monospace", letterSpacing: "0.05em" }}>
                  ESTIMATED RANGE
                </span>
              </div>
              <div style={{ fontFamily: "'Pitagon Sans Mono', monospace", fontSize: "22px", fontWeight: 600, color: "#C8A96E", letterSpacing: "0.02em" }}>
                SGD {fmt(totalLow)}{hasCustom ? "+" : ""}<br />
                <span style={{ fontSize: "16px", color: "rgba(200,169,110,0.6)" }}>— {fmt(totalHigh)}{hasCustom ? "+" : ""}</span>
              </div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: "6px", fontFamily: "'Pitagon Sans Mono', monospace", lineHeight: 1.5 }}>
                Indicative range only. Excl. GST & third-party costs.
                Final scope confirmed via proposal.
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ padding: "14px 20px" }}>
            {!submitted ? (
              step === "configure" ? (
                <button className="cta-btn" onClick={() => count > 0 && setStep("contact")}
                  style={{
                    width: "100%", padding: "13px", borderRadius: "9px", border: "none",
                    background: count > 0 ? "#C8A96E" : "rgba(255,255,255,0.07)",
                    color: count > 0 ? "#111111" : "rgba(255,255,255,0.2)",
                    fontSize: "12px", fontWeight: 600, cursor: count > 0 ? "pointer" : "default",
                    letterSpacing: "0.06em", fontFamily: "'Pitagon Sans Mono', monospace",
                  }}>
                  {count === 0 ? "SELECT SERVICES TO CONTINUE" : "REQUEST DETAILED PROPOSAL →"}
                </button>
              ) : (
                <div>
                  <button onClick={() => setStep("configure")} style={{
                    background: "none", border: "none", color: "rgba(255,255,255,0.35)",
                    fontSize: "11px", cursor: "pointer", marginBottom: "12px", fontFamily: "'Pitagon Sans Mono', monospace",
                    display: "flex", alignItems: "center", gap: "4px"
                  }}>← Back to services</button>
                  {[
                    ["Name", name, setName, "Your name"],
                    ["Email", email, setEmail, "your@email.com"],
                    ["Company", company, setCompany, "Company / Agency name"],
                  ].map(([label, val, setter, ph]) => (
                    <div key={label} style={{ marginBottom: "10px" }}>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: "4px", fontFamily: "'Pitagon Sans Mono', monospace", letterSpacing: "0.08em" }}>{label.toUpperCase()}</div>
                      <input value={val} onChange={e => setter(e.target.value)} placeholder={ph}
                        style={{
                          width: "100%", padding: "9px 12px", borderRadius: "7px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "#F5F0E8", fontSize: "12px", fontFamily: "'Pitagon Sans Mono', monospace",
                        }}
                      />
                    </div>
                  ))}
                  <button className="cta-btn" onClick={handleFormSubmit}
                    style={{
                      width: "100%", padding: "13px", borderRadius: "9px", border: "none",
                      background: name && email ? "#C8A96E" : "rgba(255,255,255,0.07)",
                      color: name && email ? "#111111" : "rgba(255,255,255,0.2)",
                      fontSize: "12px", fontWeight: 600, cursor: (name && email && !submitting) ? "pointer" : "default",
                      letterSpacing: "0.06em", fontFamily: "'Pitagon Sans Mono', monospace", marginTop: "4px", opacity: submitting ? 0.6 : 1,
                    }}>
                    {submitting ? "SENDING..." : "SEND MY BRIEF →"}
                  </button>
                </div>
              )
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>✦</div>
                <div style={{ fontFamily: "'Pitagon Sans Mono', monospace", fontSize: "17px", fontWeight: 600, color: "#C8A96E", marginBottom: "6px" }}>
                  Brief received.
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontFamily: "'Pitagon Sans Mono', monospace" }}>
                  Thank you! We'll follow up with you within 1-3 business day.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "980px",
        margin: "0 auto",
        fontSize: "11px",
        color: "rgba(255,255,255,0.25)",
        fontFamily: "'Pitagon Sans Mono', monospace",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        <span>© 2026 Hyper Creatives · Singapore</span>
        <span>hello@hypcreatives.agency · hypercreatives.agency</span>
        <span>All rates in SGD · Excl. GST · Indicative only</span>
      </div>

      {/* ── Password Modal ── */}
      {showPasswordModal && (
        <div
          onClick={() => setShowPasswordModal(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#181818",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "36px 32px 28px",
              width: "100%",
              maxWidth: "360px",
              animation: pwShake ? "shake 0.4s ease" : "fadeInUp 0.25s ease",
            }}>
            <style>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(16px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes shake {
                0%,100% { transform: translateX(0); }
                20%     { transform: translateX(-8px); }
                40%     { transform: translateX(8px); }
                60%     { transform: translateX(-6px); }
                80%     { transform: translateX(6px); }
              }
            `}</style>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: "rgba(200,169,110,0.12)",
                border: "1px solid rgba(200,169,110,0.25)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
              }}>🔒</div>
            </div>

            <div style={{ textAlign: "center", marginBottom: "6px", fontFamily: "'Pitagon Sans Mono', monospace", fontSize: "15px", fontWeight: 700, color: "#F5F0E8", letterSpacing: "0.04em" }}>
              Agency Partner Access
            </div>
            <div style={{ textAlign: "center", marginBottom: "24px", fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'Pitagon Sans Mono', monospace", lineHeight: 1.6 }}>
              This section is restricted to<br />verified agency partners.
            </div>

            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: "6px", fontFamily: "'Pitagon Sans Mono', monospace", letterSpacing: "0.1em" }}>
                ACCESS CODE
              </div>
              <input
                type="password"
                value={pwInput}
                onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                onKeyDown={e => e.key === "Enter" && handlePasswordSubmit()}
                placeholder="Enter your access code"
                autoFocus
                style={{
                  width: "100%", padding: "11px 14px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: pwError ? "1px solid rgba(255,90,90,0.6)" : "1px solid rgba(255,255,255,0.12)",
                  color: "#F5F0E8", fontSize: "13px",
                  fontFamily: "'Pitagon Sans Mono', monospace",
                  letterSpacing: "0.1em",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              {pwError && (
                <div style={{ marginTop: "6px", fontSize: "11px", color: "rgba(255,90,90,0.8)", fontFamily: "'Pitagon Sans Mono', monospace" }}>
                  Incorrect access code. Please try again.
                </div>
              )}
            </div>

            <button
              onClick={handlePasswordSubmit}
              style={{
                width: "100%", padding: "12px",
                borderRadius: "8px", border: "none",
                background: "#C8A96E", color: "#111111",
                fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: "pointer",
                fontFamily: "'Pitagon Sans Mono', monospace",
                marginTop: "6px",
                transition: "opacity 0.2s",
              }}
            >
              UNLOCK ACCESS →
            </button>

            <button
              onClick={() => setShowPasswordModal(false)}
              style={{
                width: "100%", padding: "10px",
                borderRadius: "8px", border: "none",
                background: "transparent", color: "rgba(255,255,255,0.3)",
                fontSize: "11px", cursor: "pointer",
                fontFamily: "'Pitagon Sans Mono', monospace",
                marginTop: "8px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
