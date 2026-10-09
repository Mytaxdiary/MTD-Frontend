// Hand-maintained — reflects the agreed usage-pricing model (billing-stripe-plan.md).
// Calculator markup is wired up by the "PRICING: ESTIMATOR" block in public/site/site.js,
// which calls the public, no-auth GET /billing/public/estimate endpoint so the number
// shown here can never drift from Settings or the real quote.
const html = `<section class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">Pricing</div>
    <h1 class="reveal" style="--d:.06s">Simple, straightforward pricing</h1>
    <p class="reveal" style="--d:.12s">£50 a month covers your first 50 clients. After that, the rate per extra client drops automatically as your book grows. No packages, no feature paywalls: every firm gets the full product.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="plans" style="grid-template-columns:1fr;max-width:460px;margin:0 auto">
      <div class="plan featured reveal" style="--d:.0s">
        <span class="plan-tag">All firms, one price</span>
        <h3>Usage pricing</h3>
        <p class="who">Pay for the clients you manage. Nothing to configure, no plan to pick.</p>
        <div class="price"><b class="amount">&pound;50</b><span class="period">/month, up to 50 clients</span></div>
        <ul class="ticklist">
        <li>Agent dashboard with deadlines and liabilities</li>
        <li>HMRC connection for authorised clients</li>
        <li>Client portal and digital handshake</li>
        <li>Email chase templates</li>
        <li>Staff invites and permissions</li>
        <li>Email support</li>
        </ul>
        <div class="plan-actions">
        <a href="/register" class="btn btn-primary btn-block" id="start-trial">Start free trial</a>
        </div>
        <p style="font-size:12.5px;color:var(--muted);text-align:center;margin-top:12px">7 days free · no card required</p>
      </div>
    </div>
  </div>
</section>

<section class="sec-soft">
  <div class="wrap">
    <div class="sec-head reveal">
      <h2>How extra clients are priced</h2>
      <p>Past your first 50 clients, the per-client rate steps down every 50 clients, down to a 50p floor. You never pay more than this for an extra client.</p>
    </div>
    <div class="cmp-wrap reveal" style="--d:.08s;max-width:620px;margin:0 auto 48px">
      <table class="cmp">
        <thead>
          <tr><th scope="col">Clients (billable extras)</th><th scope="col">Rate per extra client / month</th></tr>
        </thead>
        <tbody>
          <tr><th scope="row">1&ndash;50</th><td class="yes">Included in base &pound;50</td></tr>
          <tr><th scope="row">51&ndash;100</th><td class="hl">&pound;0.90</td></tr>
          <tr><th scope="row">101&ndash;150</th><td class="hl">&pound;0.80</td></tr>
          <tr><th scope="row">151&ndash;200</th><td class="hl">&pound;0.70</td></tr>
          <tr><th scope="row">201&ndash;250</th><td class="hl">&pound;0.60</td></tr>
          <tr><th scope="row">251+</th><td class="hl">&pound;0.50 (floor)</td></tr>
        </tbody>
      </table>
    </div>

    <div class="calc-card reveal" style="--d:.12s" id="priceCalc">
      <h3>Estimate your monthly cost</h3>
      <p class="calc-sub">Tell us how many clients you manage and we will do the maths. This calls the same pricing engine as your account.</p>
      <div class="calc-row">
        <label for="priceCalcClients">Number of clients</label>
        <input type="number" id="priceCalcClients" min="0" max="100000" step="1" value="50" inputmode="numeric">
      </div>
      <div class="calc-result">
        <div class="calc-line"><span>Base (up to <b id="priceCalcAllowance">50</b> clients)</span><span id="priceCalcBase">&pound;50.00</span></div>
        <div class="calc-line"><span>Extra clients (<span id="priceCalcExtraCount">0</span>)</span><span id="priceCalcExtras">&pound;0.00</span></div>
        <div class="calc-line calc-total"><span>Monthly total</span><span id="priceCalcTotal">&pound;50.00</span></div>
      </div>
      <p class="calc-note" id="priceCalcNote">Billed monthly, no annual plan.</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head reveal">
      <h2>How pricing works</h2>
      <p>Three rules, no exceptions.</p>
    </div>
    <div class="grid-3">
      <div class="card reveal" style="--d:.0s">
        <div class="ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
        <h3>Pay for what you use</h3>
        <p>A client counts as soon as you add them, whether or not HMRC authorisation is complete yet.</p>
      </div>
      <div class="card reveal" style="--d:.08s">
        <div class="ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/></svg></div>
        <h3>Every client, same features</h3>
        <p>There is one plan. No feature paywalls, no staff-seat limits hidden behind a higher tier.</p>
      </div>
      <div class="card reveal" style="--d:.16s">
        <div class="ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 17l6-6 4 4 8-8"/></svg></div>
        <h3>The rate drops as you grow</h3>
        <p>The per-client rate steps down automatically every 50 clients, down to a 50p floor. No negotiating required.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec-soft">
  <div class="wrap-narrow" style="padding-left:0;padding-right:0;max-width:1180px">
    <div class="wrap">
      <h2 class="reveal" style="font-size:28px;letter-spacing:-.8px;margin-bottom:10px">Pricing questions</h2>
      <p class="reveal" style="--d:.06s;margin-bottom:26px">Short answers to the questions firms ask most.</p>
      <div class="faq reveal" style="--d:.12s">
      <details open>
        <summary>Are these the final prices?</summary>
        <div class="answer">Yes. &pound;50/month covers your first 50 clients. Past that, the per-client rate steps down automatically as your client count grows. See the table above.</div>
      </details>
      <details>
        <summary>How is a &ldquo;client&rdquo; counted?</summary>
        <div class="answer">As soon as you add them to My Tax Diary, whether or not HMRC authorisation is complete yet.</div>
      </details>
      <details>
        <summary>Is there a free trial?</summary>
        <div class="answer">Yes: every new firm gets a free 7-day trial with no card required. <a href="/register">Start your trial</a> to see the full product with your own clients.</div>
      </details>
      <details>
        <summary>What happens if I add or remove clients mid-month?</summary>
        <div class="answer">Your bill is prorated automatically within the current billing period. You only ever pay for what you actually used.</div>
      </details>
      <details>
        <summary>What happens when my trial ends?</summary>
        <div class="answer">You will need an active subscription to keep using the app. You can subscribe any time from Settings &rarr; Plan &amp; billing, and your data is kept safe while you decide.</div>
      </details>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta-plain reveal">
      <h2>Ready to get started?</h2>
      <p>Start your free 7-day trial today. No card required.</p>
      <div class="cta-actions">
        <a href="/register" class="btn btn-primary">Start your free trial</a>
        <a href="/site/contact" class="btn btn-ghost">Have questions? Enquire</a>
      </div>
    </div>
  </div>
</section>`
export default html
