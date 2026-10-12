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
      <a href="/register" class="btn btn-primary btn-sm">Start free trial</a>
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
        <a href="/register" class="btn btn-primary">Start free trial</a>
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
          <div class="eyebrow">Built by accountants, for accountants</div>
          <h1>See every client's MTD position<br>in one place</h1>
          <p class="lead">Who has submitted and who has not. What each client owes and when. Automatic chasers so you are not sending them. My Tax Diary reads directly from HMRC, so the picture is always current.</p>
          <p class="lead-note">We do not make submissions to HMRC. Your existing software does that. We make sure nothing gets missed. Everyone is talking about how to submit MTD ITSA returns, but nobody is mentioning how you monitor it. We are not a submission software. We let others deal with that. We help you stay on top of your clients and manage your internal workflows.</p>

          <div class="hero-actions">
            <a href="/register" class="btn btn-primary btn-lg">Start your 7-day free trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="/site/contact" class="btn btn-ghost btn-lg">Book a demo</a>
          </div>

          <div class="ticks">
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Who has submitted</div>
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              What is owed, and when</div>
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Automatic chasers</div>
          </div>

          <div class="scribble" id="scribble">
            <svg width="66" height="58" viewBox="0 0 66 58" fill="none" stroke="var(--navy)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2C-1 14 2 32 14 42c9 8 22 12 34 12"/>
              <path d="M41 47l9 7-8 4"/>
            </svg>
            <div class="scribble-text">Monitor MTD.<br>Do not file it<br>here.</div>
          </div>
        </div>

        <!-- DASHBOARD SCREENSHOT -->
        <div class="hero-visual-wrap">
          <div class="hero-visual" id="heroVisual">
            <div class="mock-inner">
              <div class="mock mock-shot" id="mockCard">
                <img
                  src="/site/dashboard-hero.png"
                  alt="My Tax Diary dashboard showing client MTD status, liabilities, and chase"
                  class="mock-shot-img"
                  width="1280"
                  height="800"
                >
              </div>

              <div class="mock-float">
                <div class="ok">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22b07d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <b>Connected to HMRC</b>
                  <small>Read-only, always up to date</small>
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
      <div class="eyebrow reveal">Why firms use My Tax Diary</div>
      <h2 class="reveal" style="--d:.06s">Five things you stop doing by hand</h2>
      <p class="reveal" style="--d:.12s">Monitoring built for accounting firms. Status from HMRC, chasers on schedule, and a clear answer when a client asks what they owe.</p>
    </div>

    <div class="grid-benefits">
      <div class="card reveal">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <h3>Know who has submitted</h3>
        <p>One dashboard across your whole client book. Each client's quarterly updates and final declaration, with status pulled from HMRC, not from a spreadsheet someone forgot to update.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.08s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <h3>Stop chasing manually</h3>
        <p>Automatic chasers go out before each deadline. You set the schedule once; My Tax Diary sends the reminders and shows you who has responded.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.16s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <h3>Answer "how much do I owe?" instantly</h3>
        <p>Liabilities and payment dates for every client, visible without logging into HMRC. When a client rings, the answer is already on screen.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.24s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h3>Give every client their own view</h3>
        <p>Each client gets a simple dashboard showing what they owe and when. A better service for them, fewer calls for you.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.32s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <h3>No more missed payments on account</h3>
        <p>Clients forget payments on account and get penalised. Their dashboard shows every due date and amount, with a reminder before each one.</p>
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
      <h2 class="reveal" style="--d:.06s">Four steps, none of them filing</h2>
      <p class="reveal" style="--d:.12s">Connect, monitor, chase, and keep filing where you already file today.</p>
    </div>

    <div class="steps" id="steps"><span class="spark" id="spark"></span>
      <div class="step reveal">
        <div class="step-n">1</div>
        <h4>Connect your clients</h4>
        <p>Invite each client from inside My Tax Diary. Once they authorise, their HMRC data appears in your dashboard.</p>
      </div>
      <div class="step reveal" style="--d:.12s">
        <div class="step-n">2</div>
        <h4>See the full picture</h4>
        <p>Submission status, liabilities and due dates for every client, refreshed from HMRC.</p>
      </div>
      <div class="step reveal" style="--d:.24s">
        <div class="step-n">3</div>
        <h4>Let the chasers run</h4>
        <p>Automatic reminders go to clients before each deadline. You see who has responded and who needs a call.</p>
      </div>
      <div class="step reveal" style="--d:.36s">
        <div class="step-n">4</div>
        <h4>File where you file today</h4>
        <p>Submit through your existing software. My Tax Diary picks up the new status from HMRC and the next quarter begins.</p>
      </div>
    </div>
  </div>
</section>

<!-- ===== CLIENT VIEW ===== -->
<section class="sec-tint2">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow reveal">What your clients see</div>
      <h2 class="reveal" style="--d:.06s">A dashboard your clients will actually use</h2>
      <p class="reveal" style="--d:.12s">Every client you connect gets their own login. It shows one thing clearly: what they owe HMRC, and when. Payments on account, balancing payments and quarterly deadlines, each with a date and an amount. A reminder arrives before each one.</p>
      <p class="reveal" style="--d:.18s;max-width:640px;margin:16px auto 0;color:var(--muted);font-size:15px;line-height:1.6">No bookkeeping, no jargon, nothing to configure. It is the view they would get from HMRC if HMRC had built one.</p>
    </div>
  </div>
</section>

<!-- ===== BENEFITS ===== -->
<section style="padding-top:48px">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow reveal">What changes for your practice</div>
      <h2 class="reveal" style="--d:.06s">Outcomes you can feel in the week</h2>
      <p class="reveal" style="--d:.12s">Less manual chasing, clearer answers, fewer awkward conversations.</p>
    </div>

    <div class="benefits" style="max-width:720px;margin:0 auto">
      <div class="benefit reveal" style="--d:.05s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Every client's MTD status in one view, pulled from HMRC</div>
      <div class="benefit reveal" style="--d:.13s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Chasers sent automatically, not from your inbox</div>
      <div class="benefit reveal" style="--d:.21s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Liabilities and due dates answered without logging into HMRC</div>
      <div class="benefit reveal" style="--d:.29s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>A client dashboard you can offer as part of your service</div>
      <div class="benefit reveal" style="--d:.37s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Fewer penalties for your clients, fewer awkward conversations for you</div>
    </div>
  </div>
</section>

<!-- ===== CTA ===== -->
<section style="padding-top:20px" id="pricing">
  <div class="wrap">
    <div class="cta reveal">
      <div class="eyebrow">Ready when you are</div>
      <h2>See your whole client book in one place</h2>
      <p>Try My Tax Diary free for 7 days. No card needed. If you would rather see it first, book a 20-minute walkthrough.</p>
      <div class="cta-actions">
        <a href="/register" class="btn btn-primary btn-lg">Start your 7-day free trial
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <a href="/site/contact" class="btn btn-ghost btn-lg">Book a demo</a>
        <a href="/site/pricing" class="btn btn-ghost btn-lg">View pricing</a>
      </div>
      <div class="cta-note">
        We monitor.<br>Your software<br>files.
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
        <p>MTD Income Tax monitoring for accounting firms. See who has submitted, what is owed and when, and let the chasers do the chasing. We do not file; your software does.</p>
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
          <li><a href="/register">Start free trial</a></li>
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
