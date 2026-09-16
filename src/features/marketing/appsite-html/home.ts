// AUTO-GENERATED from MTD-AppSite/*.html by scripts/gen-appsite.mjs. Do not edit by hand.
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

        <!-- COPY (animates in on the left) -->
        <div class="hero-copy" id="heroCopy">
          <div class="eyebrow" data-anim>Simple software. Real impact.</div>
          <h1 data-anim><span class="light">My Tax Diary</span><br>MTD ITSA software<br>for UK accountants</h1>
          <p class="lead" data-anim>The complete MTD for Income Tax solution built for a digital future. Save time, stay compliant and give your clients a better experience. Make Tax Digital simpler, for a brighter tomorrow.</p>

          <div class="hero-actions" data-anim>
            <a href="/register" class="btn btn-primary btn-lg">Get started free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="/site/contact" class="btn btn-ghost btn-lg">Book a demo</a>
          </div>

          <div class="ticks" data-anim>
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              HMRC ready</div>
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              UK based</div>
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Built for accountants</div>
          </div>

          <div class="scribble" id="scribble" data-anim>
            <svg width="66" height="58" viewBox="0 0 66 58" fill="none" stroke="var(--navy)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2C-1 14 2 32 14 42c9 8 22 12 34 12"/>
              <path d="M41 47l9 7-8 4"/>
            </svg>
            <div class="scribble-text">Less admin<br>More time for what<br>matters.</div>
          </div>
        </div>

        <!-- DASHBOARD (enters wide & face-on, settles right + tilted) -->
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
                    <div class="side-item"><span class="dot"></span>Transactions</div>
                    <div class="side-item"><span class="dot"></span>Income</div>
                    <div class="side-item"><span class="dot"></span>Expenses</div>
                    <div class="side-item"><span class="dot"></span>Reports</div>
                    <div class="side-item"><span class="dot"></span>Settings</div>
                  </aside>

                  <div class="mock-main">
                    <div class="mock-greet" id="greet">Good morning, James! <span class="wave">👋</span></div>

                    <div class="stats">
                      <div class="stat"><b data-count="23">0</b><span>Active clients</span></div>
                      <div class="stat"><b data-count="142">0</b><span>Transactions</span></div>
                      <div class="stat red"><b data-count="2">0</b><span>Pending items</span></div>
                      <div class="stat green"><b data-count="98" data-suffix="%">0</b><span>MTD ready</span></div>
                    </div>

                    <div class="mock-head">
                      <h5>Upcoming deadlines</h5>
                      <a href="/site/features">View all</a>
                    </div>

                    <div class="dl">
                      <span class="bullet" style="background:#ef5a5a"></span>
                      <span class="txt">Q1 2024/25 <em>ITSA submission due 4 Apr 2026</em></span>
                      <span class="pill p-red">6 Apr 2025</span>
                    </div>
                    <div class="dl">
                      <span class="bullet" style="background:#f0b429"></span>
                      <span class="txt">Client review – Harris Ltd <em>Documents pending</em></span>
                      <span class="pill p-amber">12 Apr 2025</span>
                    </div>
                    <div class="dl">
                      <span class="bullet" style="background:#12b8bd"></span>
                      <span class="txt">Q2 2024/25 <em>ITSA submission due 6 Jul 2025</em></span>
                      <span class="pill p-teal">6 Jul 2025</span>
                    </div>
                    <div class="dl">
                      <span class="bullet" style="background:#12b8bd"></span>
                      <span class="txt">VAT return – Green &amp; Co. <em>Review and submit</em></span>
                      <span class="pill p-teal">14 Jul 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mock-float">
                <div class="ok">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22b07d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <b>HMRC connection active</b>
                  <small>Your data is syncing securely</small>
                </div>
                <span class="live"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll-cue" id="cue">
      <span class="mouse"></span>
      Scroll
    </div>
  </div>
</div>

<!-- ===== TRUSTED ===== -->
<section class="sec-tint">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow reveal">Trusted by UK accountants</div>
      <h2 class="reveal" style="--d:.06s">Built around how practices actually work</h2>
      <p class="reveal" style="--d:.12s">My Tax Diary helps you manage clients, submissions and deadlines in one simple place. Designed for UK accountants, it's MTD-ready and built for real life.</p>
    </div>

    <div class="grid-3">
      <div class="card reveal">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h3>For all firm sizes</h3>
        <p>From individual practices to multi-office firms, My Tax Diary scales with you.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.1s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <h3>For your clients</h3>
        <p>Give your clients a simpler, smoother digital tax experience. Less hassle, happier clients.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.2s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M10 22v-4h4v4"/></svg>
        </div>
        <h3>For MTD ITSA.</h3>
        <p>Built specifically for Making Tax Digital for Income Tax Self Assessment. Stay ahead with confidence.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>
    </div>
  </div>
</section>

<!-- ===== FEATURES ===== -->
<section class="sec-tint2" id="features">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow reveal">Powerful features</div>
      <h2 class="reveal" style="--d:.06s">Everything your practice needs for MTD</h2>
      <p class="reveal" style="--d:.12s">Our simple, intuitive software gives you the tools to work smarter, not harder.</p>
    </div>

    <div class="grid-3" style="row-gap:24px">
      <div class="card reveal">
        <div class="arrow-tr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
        <div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
        <h3>Agent portal</h3>
        <p>Securely collaborate with clients, share documents and keep everyone informed in real time.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.08s">
        <div class="arrow-tr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
        <div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></div>
        <h3>Client syncing</h3>
        <p>Pull client data from banks and accounting software. Save time and reduce manual entry.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.16s">
        <div class="arrow-tr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
        <div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="20" x2="6" y2="13"/><line x1="12" y1="20" x2="12" y2="5"/><line x1="18" y1="20" x2="18" y2="10"/></svg></div>
        <h3>Insightful reports</h3>
        <p>Get a clear view of your practice with live dashboards and MTD-ready reports.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal">
        <div class="arrow-tr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
        <div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
        <h3>Receipt capture</h3>
        <p>Allow clients to capture and upload receipts on the go. Keep records organised and compliant.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.08s">
        <div class="arrow-tr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
        <div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
        <h3>MTD submissions</h3>
        <p>Submit directly to HMRC with complete confidence. Track status and view submission history.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.16s">
        <div class="arrow-tr"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
        <div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6h.09A1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
        <h3>Practice tools</h3>
        <p>Manage workflows, set reminders and keep your team on track. Built by accountants, for accountants.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>
    </div>
  </div>
</section>

<!-- ===== STEPS ===== -->
<section>
  <div class="wrap">
    <div class="sec-head" style="margin-bottom:0">
      <div class="eyebrow reveal">A clearer way forward</div>
      <h2 class="reveal" style="--d:.06s">From signup to steady quarterly rhythm</h2>
      <p class="reveal" style="--d:.12s">Get up and running in four simple steps.</p>
    </div>

    <div class="steps" id="steps"><span class="spark" id="spark"></span>
      <div class="step reveal">
        <div class="step-n">1</div>
        <h4>Create your free account</h4>
        <p>Sign up in minutes and get instant access. No long setup, no hassle.</p>
      </div>
      <div class="step reveal" style="--d:.12s">
        <div class="step-n">2</div>
        <h4>Connect with your clients</h4>
        <p>Invite clients and link their accounts. Pull in their data securely.</p>
      </div>
      <div class="step reveal" style="--d:.24s">
        <div class="step-n">3</div>
        <h4>Share, review and submit with confidence</h4>
        <p>Check the data, make adjustments and submit directly to HMRC.</p>
      </div>
      <div class="step reveal" style="--d:.36s">
        <div class="step-n">4</div>
        <h4>Stay on track all year</h4>
        <p>Use reminders, reports and dashboards to keep everything moving smoothly.</p>
      </div>
    </div>
  </div>
</section>

<!-- ===== TESTIMONIAL + STATS ===== -->
<section style="padding-top:0">
  <div class="wrap">
    <div class="quote-grid">
      <div class="quote-card reveal-l reveal">
        <div class="qmark">“</div>
        <p>“My Tax Diary has transformed the way we work. It's simple to use, saves us hours every month and gives our clients a much better experience.”</p>
        <div class="author">
          <div>
            <b>James Wilson</b>
            <small>Director, Wilson &amp; Co Accountants</small>
          </div>
        </div>
      </div>

      <div class="benefits">
        <div class="benefit reveal" style="--d:.05s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Save hours of admin time</div>
        <div class="benefit reveal" style="--d:.13s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Keep clients happy and compliant</div>
        <div class="benefit reveal" style="--d:.21s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Built specifically for UK accountants</div>
        <div class="benefit reveal" style="--d:.29s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Regular updates and expert support</div>
        <div class="benefit reveal" style="--d:.37s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>HMRC recognised</div>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-b reveal"><b data-count="4000" data-suffix="+" data-sep="1">0</b><span>Active accountants</span></div>
      <div class="stat-b reveal" style="--d:.1s"><b data-count="120000" data-suffix="+" data-sep="1">0</b><span>Clients managed</span></div>
      <div class="stat-b reveal" style="--d:.2s"><b data-count="99.9" data-suffix="%" data-dec="1">0</b><span>Uptime</span></div>
      <div class="stat-b reveal" style="--d:.3s"><b>UK based</b><span>Support team</span></div>
    </div>
  </div>
</section>

<!-- ===== CTA ===== -->
<section style="padding-top:20px" id="pricing">
  <div class="wrap">
    <div class="cta reveal">
      <div class="eyebrow">Simple. Compliant. Confident.</div>
      <h2>Ready to simplify MTD for your firm?</h2>
      <p>Join thousands of UK accountants already using My Tax Diary.</p>
      <div class="cta-actions">
        <a href="/register" class="btn btn-primary btn-lg">Get started free
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a href="/site/contact" class="btn btn-ghost btn-lg">Book a demo</a>
        <a href="/site/pricing" class="btn btn-ghost btn-lg">View pricing</a>
      </div>
      <div class="cta-note">
        A brighter<br>tomorrow for<br>UK accountants.
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
        <p>MTD ITSA software for UK accountants. Agent portal, client portal, HMRC, chase, and staff.</p>
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
