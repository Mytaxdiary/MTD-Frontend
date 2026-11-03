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
          <h1>See where every MTD client stands,<br>at a glance</h1>
          <p class="lead">My Tax Diary shows you which sole trader and landlord clients have submitted their quarterly updates, what each one owes HMRC and when it is due. It also emails clients to ask for their figures, so the chasing does not all land on you.</p>
          <p class="lead-note">It works alongside the software you already file with, so there is nothing to switch and nothing to re-enter.</p>

          <div class="hero-actions">
            <a href="/register" class="btn btn-primary btn-lg">Start your 7-day free trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="/site/contact" class="btn btn-ghost btn-lg">Book a demo</a>
          </div>
          <p class="trial-micro">No card needed.</p>

          <div class="ticks">
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Read-only access to HMRC data</div>
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Status and balances from HMRC</div>
            <div class="tick">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#12b8bd"><circle cx="12" cy="12" r="12"/><polyline points="7 12.5 10.5 16 17 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Built for sole trader and landlord clients</div>
          </div>
        </div>

        <!-- DASHBOARD SCREENSHOT -->
        <div class="hero-visual-wrap">
          <div class="hero-visual" id="heroVisual">
            <div class="mock-inner">
              <div class="mock mock-shot" id="mockCard">
                <img
                  src="/site/dashboard-hero.png"
                  alt="My Tax Diary dashboard showing each client's quarterly submission status, what they owe and when it is due"
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
                  <small>Read-only · from HMRC</small>
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

<!-- ===== WHY NOW ===== -->
<section class="why-now">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="reveal">MTD for Income Tax is live, and your client list is about to grow</h2>
      <p class="reveal" style="--d:.06s">Since 6 April 2026, sole traders and landlords with qualifying income over £50,000 have had to keep digital records and send HMRC four quarterly updates a year. The threshold drops to £30,000 in April 2027 and £20,000 in April 2028, so more of your clients are on their way.</p>
      <p class="reveal" style="--d:.12s">Every one of them has their own deadlines, their own figures and their own tax to pay. That is where things slip.</p>
    </div>
    <div class="fact-row">
      <div class="fact-card reveal">
        <b>4 quarterly updates a year</b>
        <span>Due on 7 August, 7 November, 7 February and 7 May</span>
      </div>
      <div class="fact-card reveal" style="--d:.08s">
        <b>£50k, then £30k, then £20k</b>
        <span>Thresholds from April 2026, 2027 and 2028</span>
      </div>
      <div class="fact-card reveal" style="--d:.16s">
        <b>A final declaration</b>
        <span>After the tax year ends</span>
      </div>
    </div>
  </div>
</section>

<!-- ===== THE PROBLEM ===== -->
<section class="sec-tint">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="reveal">Right now, a client's MTD position lives in three different places</h2>
      <p class="reveal" style="--d:.06s">Most practices file in one system, track who has submitted in a spreadsheet or CRM, and keep an eye on what clients owe somewhere else again. When a client rings and asks "where do I stand?", someone has to piece the answer together.</p>
      <p class="reveal" style="--d:.12s">My Tax Diary puts it all in one place. Your filing software files the update. My Tax Diary shows you what happened next.</p>
    </div>
    <div class="problem-table reveal" style="--d:.16s">
      <div class="problem-head">
        <span>Today</span>
        <span>What it costs you</span>
        <span>With My Tax Diary</span>
      </div>
      <div class="problem-row">
        <span>A spreadsheet or CRM for who has submitted</span>
        <span>Out of date the moment someone forgets to update it</span>
        <span>Status comes from HMRC and refreshes daily</span>
      </div>
      <div class="problem-row">
        <span>Another tool, or a login to HMRC, for what is owed</span>
        <span>A slow answer when a client rings</span>
        <span>Liability and due dates on screen</span>
      </div>
      <div class="problem-row">
        <span>Chasing clients from your own inbox</span>
        <span>Hours of follow-up each quarter</span>
        <span>Emails go out for you, and replies come straight to your inbox</span>
      </div>
    </div>
  </div>
</section>

<!-- ===== VALUE ===== -->
<section>
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow reveal">Why practices use My Tax Diary</div>
      <h2 class="reveal" style="--d:.06s">Five jobs you can stop doing by hand</h2>
      <p class="reveal" style="--d:.12s">Built for practices with plenty of sole trader and landlord clients.</p>
    </div>

    <div class="grid-benefits">
      <div class="card reveal">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <h3>Know who has submitted</h3>
        <p>One dashboard for your whole client book. See each client's quarterly updates and final declaration, with the status taken from HMRC, not from a spreadsheet someone forgot to update.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.08s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <h3>Stop chasing from your own inbox</h3>
        <p>My Tax Diary emails clients to ask for their quarterly figures, using templates you choose. Their replies come straight to your inbox, so you can get on with the update.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.16s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <h3>Answer "what do I owe?" in seconds</h3>
        <p>See each client's liability and due dates without logging in to HMRC. When a client rings, the answer is already on your screen.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.24s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h3>Give every client their own view</h3>
        <p>Each client gets a simple portal showing their submissions, what they owe and how to pay it. A better service for them, and fewer calls for you.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>

      <div class="card reveal" style="--d:.32s">
        <div class="ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7fb8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <h3>See payments coming before they land</h3>
        <p>Keep track of payments on account and balancing payments across your whole book, with the amounts and dates in one place.</p>
        <a href="/site/features" class="link">Learn more →</a>
      </div>
    </div>
  </div>
</section>

<!-- ===== STEPS ===== -->
<section id="features" class="sec-tint2">
  <div class="wrap">
    <div class="sec-head" style="margin-bottom:0">
      <div class="eyebrow reveal">How it works</div>
      <h2 class="reveal" style="--d:.06s">Four simple steps, and you keep filing where you file today</h2>
    </div>

    <div class="steps" id="steps"><span class="spark" id="spark"></span>
      <div class="step reveal">
        <div class="step-n">1</div>
        <h4>Add your client</h4>
        <p>Enter their name, UTR and National Insurance number. My Tax Diary sends them a link to authorise you through HMRC.</p>
      </div>
      <div class="step reveal" style="--d:.12s">
        <div class="step-n">2</div>
        <h4>They approve the request</h4>
        <p>Once they do, their HMRC data appears in your dashboard.</p>
      </div>
      <div class="step reveal" style="--d:.24s">
        <div class="step-n">3</div>
        <h4>See the full picture</h4>
        <p>Check each client's submission status, liability and due dates, pulled from HMRC.</p>
      </div>
      <div class="step reveal" style="--d:.36s">
        <div class="step-n">4</div>
        <h4>File as you do now</h4>
        <p>Submit through your usual software. My Tax Diary picks up the new status on its next refresh, ready for the next quarter.</p>
      </div>
    </div>
    <p class="steps-note reveal">You will need your firm's HMRC Agent Services Account, which you will already have.</p>
  </div>
</section>

<!-- ===== CLIENT VIEW ===== -->
<section>
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow reveal">What your clients see</div>
      <h2 class="reveal" style="--d:.06s">A client portal that answers the questions they keep ringing you about</h2>
      <p class="reveal" style="--d:.12s">Every client you connect gets their own login to a simple, jargon-free dashboard. It shows them:</p>
    </div>
    <div class="portal-ticks reveal" style="--d:.16s">
      <div class="benefit"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Which quarterly updates have been submitted</div>
      <div class="benefit"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>What they owe HMRC right now</div>
      <div class="benefit"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>When each payment is due, including payments on account and balancing payments</div>
      <div class="benefit"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>How to pay</div>
    </div>
    <p class="portal-close reveal" style="--d:.2s">There is nothing for them to set up and no bookkeeping to wade through. It is a clear answer to "what do I owe, and when?", and you can offer it as part of your service.</p>
    <p class="portal-small reveal" style="--d:.24s">Figures shown are as reported by HMRC.</p>
  </div>
</section>

<!-- ===== BENEFITS ===== -->
<section class="sec-tint" style="padding-top:48px">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow reveal">What changes for your practice</div>
      <h2 class="reveal" style="--d:.06s">Less tracking, quicker answers</h2>
      <p class="reveal" style="--d:.12s">More of your week goes on advice, and less on keeping tabs.</p>
    </div>

    <div class="benefits" style="max-width:720px;margin:0 auto">
      <div class="benefit reveal" style="--d:.05s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Every client's MTD status in one view, taken from HMRC</div>
      <div class="benefit reveal" style="--d:.13s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Client chasers sent for you, instead of from your inbox</div>
      <div class="benefit reveal" style="--d:.21s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Liabilities and due dates without logging in to HMRC</div>
      <div class="benefit reveal" style="--d:.29s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>A client portal you can offer as part of your service</div>
      <div class="benefit reveal" style="--d:.37s"><span class="check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#12b8bd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Fewer "where do I stand?" phone calls</div>
    </div>
  </div>
</section>

<!-- ===== FAQ ===== -->
<section>
  <div class="wrap" style="max-width:820px;margin:0 auto">
    <div class="sec-head">
      <h2 class="reveal">Questions practices ask us</h2>
    </div>
    <div class="faq reveal" style="--d:.08s">
      <details>
        <summary>Does My Tax Diary replace my filing software?</summary>
        <div class="answer">No. We do not submit anything to HMRC, so you carry on filing with the software you use today. My Tax Diary shows you what has been submitted and what is owed.</div>
      </details>
      <details>
        <summary>Does it work for both sole traders and landlords?</summary>
        <div class="answer">Yes. It covers clients with self-employment income, property income or both.</div>
      </details>
      <details>
        <summary>Can it change anything on my clients' HMRC records?</summary>
        <div class="answer">No. Access is read-only. My Tax Diary reads submission status, liabilities and due dates, and does not file or amend anything.</div>
      </details>
      <details>
        <summary>How up to date is the information?</summary>
        <div class="answer">It is read from HMRC when you open a client or refresh the dashboard.</div>
      </details>
      <details>
        <summary>What do I need to get started?</summary>
        <div class="answer">Your firm's HMRC Agent Services Account, which you will already have. You add each client's details and they approve the request through a link we send them.</div>
      </details>
      <details>
        <summary>What do the client chasers do?</summary>
        <div class="answer">They ask your clients for their quarterly figures when you send a chase from the app. Replies go straight to your inbox, so you can prepare the update.</div>
      </details>
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
        Know where every<br>client stands.
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
        <p>MTD Income Tax monitoring for accounting practices. See who has submitted, what is owed and when, all in one dashboard.</p>
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
          <li><a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a></li>
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
