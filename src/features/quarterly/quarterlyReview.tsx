'use client'
import { useState } from "react";
import {
  mockIncomeData as incomeData,
  mockExpenseRows as expenseRows,
  mockReviewChecks as checks,
  mockYtdIncome as ytdIncome,
} from "@/mocks/quarterlyReview/quarterlyReviewData";

import B from "@/styles/theme";



export default function QuarterlyReview({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalQ4Exp = expenseRows.reduce((s, r) => s + r.q4, 0);
  const totalYtdExp = expenseRows.reduce((s, r) => s + r.ytd, 0);
  const totalPriorExp = expenseRows.reduce((s, r) => s + r.prior, 0);
  const netProfit = ytdIncome - totalYtdExp;

  return (
    <>
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Breadcrumb */}
        <div style={{ padding: "12px 32px", background: B.white, borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", gap: 8, fontSize: 13, flexShrink: 0 }}>
          <span style={{ color: B.primary, cursor: "pointer", fontWeight: 500 }} onClick={() => navigate("clients")}>Clients</span>
          <span style={{ color: B.xlight }}>/</span>
          <span style={{ color: B.primary, cursor: "pointer", fontWeight: 500 }} onClick={() => navigate("client-detail")}>Priya Sharma</span>
          <span style={{ color: B.xlight }}>/</span>
          <span style={{ fontWeight: 600 }}>Q4 quarterly update review</span>
        </div>

        {/* Header */}
        <div style={{ padding: "20px 32px", background: B.white, borderBottom: `1px solid ${B.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Review quarterly update</div>
              <div style={{ fontSize: 13, color: B.muted, marginTop: 3 }}>Priya Sharma — Sharma Design Studio — Q4 (6 Jan – 5 Apr 2026) — Due 7 May 2026</div>
            </div>
            {!submitted && (
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 13, fontWeight: 500, cursor: "pointer", color: B.text }}>Save draft</button>
                <button onClick={() => setShowConfirm(true)} style={{ padding: "8px 24px", borderRadius: 8, border: "none", background: B.green, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, letterSpacing: "0.01em" }}>
                  Submit to HMRC
                </button>
              </div>
            )}
            {submitted && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 8, background: B.greenBg, border: "1px solid #A7F3D0" }}>
                <span style={{ fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: B.greenText }}>Submitted successfully</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px 32px", flex: 1 }}>
          {/* HMRC preview banner */}
          <div style={{ padding: "14px 20px", background: B.blueBg, borderRadius: 10, border: "1px solid #BAE6FD", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: B.blueText }}>i</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: B.blueText }}>This is what HMRC will receive</div>
              <div style={{ fontSize: 12, color: "#0369A1" }}>Cumulative year-to-date totals for self-employment income source XAIS12345678901. This submission replaces all prior quarterly updates for 2025-26.</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
            {/* Left — main tables */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Income */}
              <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${B.border}`, fontSize: 14, fontWeight: 700 }}>Income</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${B.border}` }}>
                      <th style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: B.light, letterSpacing: "0.04em" }}>Category</th>
                      <th style={{ padding: "10px 20px", textAlign: "right", fontSize: 11, fontWeight: 600, color: B.light }}>Q4 period</th>
                      <th style={{ padding: "10px 20px", textAlign: "right", fontSize: 11, fontWeight: 600, color: B.light }}>YTD cumulative</th>
                      <th style={{ padding: "10px 20px", textAlign: "right", fontSize: 11, fontWeight: 600, color: B.light }}>Q3 comparison</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${B.borderLight}` }}>
                      <td style={{ padding: "12px 20px", fontWeight: 500 }}>Turnover</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>£{incomeData.turnover.toLocaleString()}</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>£{ytdIncome.toLocaleString()}</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: B.muted }}>£11,200</td>
                    </tr>
                    <tr style={{ background: B.surface }}>
                      <td style={{ padding: "12px 20px", fontWeight: 700 }}>Total income</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>£{incomeData.turnover.toLocaleString()}</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>£{ytdIncome.toLocaleString()}</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: B.muted }}>£11,200</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Expenses */}
              <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${B.border}`, fontSize: 14, fontWeight: 700 }}>Expenses</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${B.border}` }}>
                      <th style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: B.light, letterSpacing: "0.04em" }}>Category</th>
                      <th style={{ padding: "10px 20px", textAlign: "right", fontSize: 11, fontWeight: 600, color: B.light }}>Q4 period</th>
                      <th style={{ padding: "10px 20px", textAlign: "right", fontSize: 11, fontWeight: 600, color: B.light }}>YTD cumulative</th>
                      <th style={{ padding: "10px 20px", textAlign: "right", fontSize: 11, fontWeight: 600, color: B.light }}>Q3 comparison</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseRows.map((r, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${B.borderLight}`, background: i % 2 === 1 ? "#FAFBFC" : "transparent" }}>
                        <td style={{ padding: "10px 20px", color: r.q4 > 0 ? B.text : B.light }}>{r.cat}</td>
                        <td style={{ padding: "10px 20px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: r.q4 > 0 ? B.text : B.light }}>{r.q4 > 0 ? `£${r.q4.toLocaleString()}` : "—"}</td>
                        <td style={{ padding: "10px 20px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: r.ytd > 0 ? B.text : B.light }}>{r.ytd > 0 ? `£${r.ytd.toLocaleString()}` : "—"}</td>
                        <td style={{ padding: "10px 20px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: B.muted }}>
                          {r.prior > 0 ? `£${r.prior.toLocaleString()}` : "—"}
                          {r.q4 > 0 && r.prior > 0 && (
                            <span style={{ fontSize: 10, marginLeft: 6, color: r.q4 > r.prior ? B.greenText : r.q4 < r.prior ? B.amberText : B.light, fontWeight: 600 }}>
                              {r.q4 > r.prior ? `+${Math.round((r.q4 - r.prior) / r.prior * 100)}%` : r.q4 < r.prior ? `${Math.round((r.q4 - r.prior) / r.prior * 100)}%` : ""}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: B.surface, borderTop: `2px solid ${B.border}` }}>
                      <td style={{ padding: "12px 20px", fontWeight: 700 }}>Total expenses</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>£{totalQ4Exp.toLocaleString()}</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>£{totalYtdExp.toLocaleString()}</td>
                      <td style={{ padding: "12px 20px", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: B.muted }}>£{totalPriorExp.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net profit summary */}
              <div style={{ background: B.navy, borderRadius: 12, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.02em" }}>YTD NET PROFIT — SENT TO HMRC</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginTop: 4 }}>£{netProfit.toLocaleString()}</div>
                </div>
                <div style={{ display: "flex", gap: 32 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Income</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", fontVariantNumeric: "tabular-nums" }}>£{ytdIncome.toLocaleString()}</div>
                  </div>
                  <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Expenses</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", fontVariantNumeric: "tabular-nums" }}>£{totalYtdExp.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — validation + API details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Validation checks */}
              <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${B.border}`, fontSize: 14, fontWeight: 700 }}>Pre-submission checks</div>
                <div style={{ padding: "8px 20px 14px" }}>
                  {checks.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < checks.length - 1 ? `1px solid ${B.borderLight}` : "none", alignItems: "flex-start" }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 10, flexShrink: 0, marginTop: 1,
                        background: c.ok && !c.warn ? B.greenBg : B.amberBg,
                        border: `1px solid ${c.ok && !c.warn ? "#A7F3D0" : "#FDE68A"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, color: c.ok && !c.warn ? B.greenText : B.amberText
                      }}>{c.ok && !c.warn ? "✓" : "!"}</div>
                      <span style={{ fontSize: 12, color: c.warn ? B.amberText : B.text, lineHeight: 1.5 }}>{c.msg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submission details */}
              <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${B.border}`, fontSize: 14, fontWeight: 700 }}>Submission details</div>
                <div style={{ padding: "12px 20px" }}>
                  {[
                    ["API endpoint", "Self-Employment Business v4.0"],
                    ["Method", "PUT cumulative"],
                    ["NINO", "QQ 12 34 56 C"],
                    ["Business ID", "XAIS12345678901"],
                    ["Tax year", "2025-26"],
                    ["Obligation period", "6 Jan – 5 Apr 2026"],
                    ["Submission type", "Cumulative YTD"],
                  ].map(([k, v], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 6 ? `1px solid ${B.borderLight}` : "none" }}>
                      <span style={{ fontSize: 11, color: B.muted }}>{k}</span>
                      <span style={{ fontSize: 11, fontWeight: 500, fontFamily: k === "NINO" || k === "Business ID" ? "monospace" : "inherit" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{ padding: "14px 16px", background: B.amberBg, borderRadius: 10, border: "1px solid #FDE68A" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: B.amberText, marginBottom: 4 }}>HMRC disclaimer</div>
                <div style={{ fontSize: 11, color: "#78350F", lineHeight: 1.6 }}>This submission will fulfil the Q4 2025-26 quarterly update obligation. Once submitted, figures can be amended by submitting a new cumulative update. You are responsible for the accuracy of the data submitted.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: B.white, borderRadius: 16, width: 440, padding: 0, overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}>
            <div style={{ padding: "24px 28px 0" }}>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Confirm HMRC submission</div>
              <div style={{ fontSize: 13, color: B.muted, marginTop: 8, lineHeight: 1.6 }}>
                You are about to submit the Q4 cumulative update for <b>Priya Sharma</b> (Sharma Design Studio) to HMRC. This will fulfil the Q4 2025-26 obligation.
              </div>

              <div style={{ marginTop: 16, padding: 16, background: B.surface, borderRadius: 10, border: `1px solid ${B.borderLight}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: B.muted }}>YTD income</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>£52,000</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: B.muted }}>YTD expenses</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>£{totalYtdExp.toLocaleString()}</span>
                </div>
                <div style={{ borderTop: `1px solid ${B.border}`, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>YTD net profit</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: B.greenText }}>£{netProfit.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ marginTop: 16, padding: 12, background: B.amberBg, borderRadius: 8, border: "1px solid #FDE68A", fontSize: 11, color: B.amberText, lineHeight: 1.5 }}>
                This action submits data to HMRC and fulfils a legal obligation. Ensure the figures are correct before proceeding. Amendments can be made by submitting a revised cumulative update.
              </div>
            </div>

            <div style={{ padding: "20px 28px", display: "flex", gap: 10, justifyContent: "flex-end", borderTop: `1px solid ${B.border}`, marginTop: 20 }}>
              <button onClick={() => setShowConfirm(false)} style={{ padding: "10px 20px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 13, fontWeight: 500, cursor: "pointer", color: B.text }}>Cancel</button>
              <button onClick={() => { setSubmitted(true); setShowConfirm(false); }} style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: B.green, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em" }}>
                Confirm &amp; submit to HMRC
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
