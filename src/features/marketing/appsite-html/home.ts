const html = `<!-- ===== HEADER ===== -->
<header id="hdr">
  <div class="wrap nav">
      <a href="/site" class="logo">
        <img src="/site/logo.png" alt="My Tax Diary" class="company-logo">
      </a>

    <nav class="nav-links">
      <a href="/site" class="active">Home</a>
      <a href="/site/features">Features</a>
      <a href="/site/pricing">Pricing</a>
      <a href="/site/contact">Contact</a>
    </nav>

    <div class="nav-cta">
      <a href="/login" class="btn btn-ghost btn-sm">Sign in</a>
      <a href="/register" class="btn btn-primary btn-sm">Get started</a>
      <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span><span></span></button>
    </div>
  </div>

  <div class="mobile-menu" id="mobileMenu">
    <div class="wrap">
      <nav>
        <a href="/site" class="active">Home</a>
        <a href="/site/features">Features</a>
        <a href="/site/pricing">Pricing</a>
        <a href="/site/contact">Contact</a>
      </nav>
      <div class="m-cta">
        <a href="/login" class="btn btn-ghost">Sign in</a>
        <a href="/register" class="btn btn-primary">Get started</a>
      </div>
    </div>
  </div>
</header>

<!-- ===== HERO ===== -->
<div class="hero-scroll" id="heroScroll">
  <div class="hero-sticky">
    <div class="wrap">
      <div class="hero-grid">

        <!-- COPY -->
        <div class="hero-copy" id="heroCopy">
          <div class="eyebrow">Built by accountants</div>
          <h1><span class="light">My Tax Diary</span><br>Keep every client journey<br>on track for MTD</h1>
          <p class="lead">Track deadlines and liabilities, see submission status in kanban or list view, and request client access with a simple digital handshake. Developed by accountants to cut the chase around Making Tax Digital for Income Tax.</p>

          <div class="hero-actions">
            <a href="/register" class="btn btn-primary btn-lg">Get started free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="/site/contact" class="btn btn-ghost btn-lg">Book a demo</a>
          </div>

          <div class="ticks">
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Deadlines &amp; liabilities</div>
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Kanban &amp; list views</div>
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Digital handshake</div>
          </div>

          <div class="scribble" id="scribble">
            <svg width="66" height="58" viewBox="0 0 66 58" fill="none" stroke="var(--navy)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2C-1 14 2 32 14 42c9 8 22 12 34 12"/>
              <path d="M41 47l9 7-8 4"/>
            </svg>
            <div class="scribble-text">Less chasing<br>Clearer client<br>journeys.</div>
          </div>
        </div>

        <!-- DASHBOARD MOCK -->
        <div class="hero-visual-wrap">
          <div class="hero-visual" id="heroVisual">
            <div class="mock-inner">
              <div class="mock" id="mockCard">
                <div class="mock-top">
                <div class="mock-logo">
                  <img
                    src="/site/logo.png"
                    alt="My Tax Diary"
                    class="mock-logo-img"
                  >
                </div>
                  <div class="mock-user">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9fb2c0" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>
                    <div class="avatar">JD</div>
                    <div>
                      <b>James Parker</b>
                      <small>ABC Accountants</small>
                    </div>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9fb2c0" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>

                <div class="mock-body">
                  <aside class="mock-side">
                    <div class="side-item on"><span class="dot"></span>Dashboard</div>
                    <div class="side-item"><span class="dot"></span>Clients</div>
                    <div class="side-item"><span class="dot"></span>Chase</div>
                    <div class="side-item"><span class="dot"></span>Portal</div>
                    <div class="side-item"><span class="dot"></span>Settings</div>
                  </aside>

                  <div class="mock-main">
                    <div class="mock-greet" id="greet">Good morning, James! <span class="wave">👋</span></div>

                    <div class="stats">
                      <div class="stat"><b data-count="23">0</b><span>Active clients</span></div>
                      <div class="stat"><b data-count="8">0</b><span>Due this quarter</span></div>
                      <div class="stat red"><b data-count="2">0</b><span>Need chasing</span></div>
                      <div class="stat green"><b data-count="14">0</b><span>On track</span></div>
                    </div>

                    <div class="mock-head">
                      <h5>Upcoming deadlines</h5>
                      <a href="/site/features">View all</a>
                    </div>

                    <div class="dl">
                      <span class="bullet" style="background:#ef5a5a"></span>
                      <span class="txt">Q1 jobs board <em>3 clients waiting on records</em></span>
                      <span class="pill p-red">Due soon</span>
                    </div>
                    <div class="dl">
                      <span class="bullet" style="background:#f0b429"></span>
                      <span class="txt">Harris Ltd <em>Digital handshake pending</em></span>
                      <span class="pill p-amber">Access</span>
                    </div>
                    <div class="dl">
                      <span class="bullet" style="background:#12b8bd"></span>
                      <span class="txt">Walker &amp; Co <em>Liabilities reviewed</em></span>
                      <span class="pill p-teal">On track</span>
                    </div>
                    <div class="dl">
                      <span class="bullet" style="background:#12b8bd"></span>
                      <span class="txt">Green &amp; Co. <em>Ready for quarterly update</em></span>
                      <span class="pill p-teal">Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mock-float">
                <div class="ok">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22b07d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <b>HMRC connected</b>
                  <small>Client journeys stay in sync</small>
                </div>
                <span class="live"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ===== VALUE ===== -->
<section class="sec-tint">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow reveal">Why firms choose My Tax Diary</div>
      <h2 class="reveal" style="--d:.06s">Client journeys, not just onboarding</h2>
      <p class="reveal" style="--d:.12s">See who needs records, what is due, and what is owed — then nudge clients and keep quarterly work moving.</p>
    </div>

    <div class="grid-3">
      <div class="card reveal">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <h3>Deadlines &amp; liabilities</h3>
        <p>Keep quarterly dates and balances visible so nothing slips between clients and HMRC.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.1s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        </div>
        <h3>Kanban &amp; list views</h3>
        <p>Switch between board and list to see submission status across your whole client book.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.2s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M19 8v4"/><path d="M17 10h4"/></svg>
        </div>
        <h3>Digital handshake</h3>
        <p>Request client access inside the product — invite, authorise, and open the portal without awkward email chains.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>
    </div>
  </div>
</section>

<!-- ===== STEPS ===== -->
<section id="features">
  <div class="wrap">
    <div class="sec-head" style="margin-bottom:0">
      <div class="eyebrow reveal">How it works</div>
      <h2 class="reveal" style="--d:.06s">From first connection to steady quarterly rhythm</h2>
      <p class="reveal" style="--d:.12s">Focus on the client journey after they are on your books.</p>
    </div>

    <div class="steps" id="steps"><span class="spark" id="spark"></span>
      <div class="step reveal">
        <div class="step-n">1</div>
        <h4>Connect with a digital handshake</h4>
        <p>Invite the client and complete access so you can work their MTD journey in one place.</p>
      </div>
      <div class="step reveal" style="--d:.12s">
        <div class="step-n">2</div>
        <h4>Track deadlines and liabilities</h4>
        <p>See what is due and what is owed without rebuilding the picture in spreadsheets.</p>
      </div>
      <div class="step reveal" style="--d:.24s">
        <div class="step-n">3</div>
        <h4>Chase records, then move status</h4>
        <p>Send reminders, update kanban or list status, and keep every client moving toward submission.</p>
      </div>
      <div class="step reveal" style="--d:.36s">
        <div class="step-n">4</div>
        <h4>Submit and stay ready</h4>
        <p>Complete the quarterly update with HMRC when the journey is ready — then start the next cycle clean.</p>
      </div>
    </div>
  </div>
</section>

<!-- ===== BENEFITS ===== -->
<section class="sec-tint2" style="padding-top:48px">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow reveal">Practice outcomes</div>
      <h2 class="reveal" style="--d:.06s">What changes for your team</h2>
      <p class="reveal" style="--d:.12s">Clearer ownership of each client journey — less inbox noise, fewer missed dates.</p>
    </div>

    <div class="benefits" style="max-width:640px;margin:0 auto">
      <div class="benefit reveal" style="--d:.05s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Deadlines and liabilities in one view</div>
      <div class="benefit reveal" style="--d:.13s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Kanban and list status for submissions</div>
      <div class="benefit reveal" style="--d:.21s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Digital handshake for client access</div>
      <div class="benefit reveal" style="--d:.29s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Structured chase before deadlines slip</div>
      <div class="benefit reveal" style="--d:.37s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Built by accountants for real practice work</div>
    </div>
  </div>
</section>

<!-- ===== CTA ===== -->
<section style="padding-top:20px" id="pricing">
  <div class="wrap">
    <div class="cta reveal">
      <div class="eyebrow">Simple. Clear. Ready for MTD.</div>
      <h2>Ready to manage client journeys with less chase?</h2>
      <p>See deadlines, liabilities, and status in one place — then book a demo if you want a walkthrough.</p>
      <div class="cta-actions">
        <a href="/register" class="btn btn-primary btn-lg">Get started free
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a href="/site/contact" class="btn btn-ghost btn-lg">Book a demo</a>
        <a href="/site/pricing" class="btn btn-ghost btn-lg">View pricing</a>
      </div>
      <div class="cta-note">
        Built for the<br>client journey<br>after signup.
        <svg width="62" height="34" viewBox="0 0 62 34" fill="none" stroke="var(--navy)" stroke-width="1.6" stroke-linecap="round" style="margin-top:6px">
          <path d="M2 4c4 14 16 24 34 24 8 0 16-3 22-8"/>
          <path d="M52 24l6-4 1 8"/>
        </svg>
      </div>
    </div>
  </div>
</section>

<!-- ===== FOOTER ===== -->
<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-about reveal">
        <a href="/site" class="logo" aria-label="My Tax Diary home">
        <img src="/site/logo.png" alt="My Tax Diary" class="company-logo">
        </a> 
        <p>MTD Income Tax software for accounting firms. Track client journeys, deadlines, liabilities, chase, and portal access.</p>
      </div>

      <div class="foot-col reveal" style="--d:.08s">
        <h5>Product</h5>
        <ul>
          <li><a href="/site">Home</a></li>
          <li><a href="/site/features">Features</a></li>
          <li><a href="/site/pricing">Pricing</a></li>
          <li><a href="/site/contact">Contact</a></li>
        </ul>
      </div>

      <div class="foot-col reveal" style="--d:.16s">
        <h5>Account</h5>
        <ul>
          <li><a href="/login">Sign in</a></li>
          <li><a href="/register">Get started</a></li>
          <li><a href="mailto:info@mytaxdiary.co.uk">Contact email</a></li>
        </ul>
      </div>

      <div class="foot-col reveal" style="--d:.24s">
        <h5>Legal</h5>
        <ul>
          <li><a href="/site/terms">Terms</a></li>
          <li><a href="/site/privacy">Privacy</a></li>
          <li><a href="/site/cookies">Cookies</a></li>
        </ul>
      </div>
    </div>

    <div class="foot-bottom">
      <span>&copy; 2026 My Tax Diary Ltd</span>
      <span>Company No. 17312332 &middot; ICO ZC190729</span>
    </div>
  </div>
</footer>`
export default html
