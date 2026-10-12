const html = `<section class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">Features</div>
    <h1 class="reveal" style="--d:.06s">MTD monitoring tools for your practice</h1>
    <p class="reveal" style="--d:.12s">See who has submitted, what is owed and when, run automatic chasers, and give clients a simple dashboard. Read from HMRC. File where you already file.</p>
    <div class="hero-actions reveal" style="--d:.18s">
      <a href="/register" class="btn btn-primary">Start your 7-day free trial</a>
      <a href="/site/contact" class="btn btn-ghost">Book a demo</a>
    </div>
  </div>
</section>

<section style="padding-top:24px;padding-bottom:24px">
  <div class="wrap">
  <div class="frow">
    <div class="frow-copy reveal reveal-l">
      <div class="eyebrow">Submission status</div>
      <h2>Know who has submitted across your whole book</h2>
      <p>One view of quarterly updates and final declarations, with status pulled from HMRC. Flip between board and list so the team sees who is waiting, who is done, and who needs a call.</p>
      <ul class="ticklist">
        <li>Status from HMRC, not a forgotten spreadsheet</li>
        <li>Board and list views for the full client book</li>
        <li>Deadlines beside each client's position</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-status.png"
          alt="Dashboard showing client MTD submission status across the firm"
          class="panel-shot-img"
          width="1280"
          height="800"
        >
      </div>
      <!-- OLD MOCK (kept for now — do not delete)
      <div class="panel">
        <div class="panel-bar"><i></i><i></i><i></i></div>
        <div class="panel-body">
          <h5>Jobs board</h5>
          <div class="panel-row">Waiting on records &middot; 4</div>
          <div class="panel-row">Ready to submit &middot; 2</div>
          <div class="panel-row">Submitted this week &middot; 6</div>
        </div>
      </div>
      -->
    </div>
  </div>

  <div class="frow flip">
    <div class="frow-copy reveal reveal-r">
      <div class="eyebrow">Liabilities and due dates</div>
      <h2>Answer "how much do I owe?" without logging into HMRC</h2>
      <p>Liabilities, balancing payments and payment dates for every client, already on screen when they ring. The numbers stay current because they are read from HMRC.</p>
      <ul class="ticklist">
        <li>What is owed, and when it is due</li>
        <li>Payments on account and balancing payments</li>
        <li>A live picture for every connected client</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel">
    <div class="panel-bar"><i></i><i></i><i></i></div>
    <div class="panel-body">
      <h5>Client liabilities</h5>
      <div class="panel-row">Payment on account &middot; due 31 Jan</div>
      <div class="panel-row">Balancing payment &middot; review</div>
      <div class="panel-row">Next quarterly deadline &middot; 12 days</div>
    </div>
  </div>
    </div>
  </div>

  <div class="frow">
    <div class="frow-copy reveal reveal-l">
      <div class="eyebrow">Automatic chasers</div>
      <h2>Stop chasing manually before every deadline</h2>
      <p>Set the schedule once. My Tax Diary sends reminders before each deadline and shows who has responded. You keep the awkward follow-ups for the few who still need a call.</p>
      <ul class="ticklist">
        <li>Reminders on a schedule you control</li>
        <li>Clear history of what was sent</li>
        <li>See who replied and who still needs you</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-chase.png"
          alt="Chase manager with automatic client reminders before deadlines"
          class="panel-shot-img"
          width="1280"
          height="800"
        >
      </div>
      <!-- OLD MOCK (kept for now — do not delete)
      <div class="panel">
        <div class="panel-bar"><i></i><i></i><i></i></div>
        <div class="panel-body">
          <h5>Email chases</h5>
          <div class="panel-row">Q3 bank statements &middot; sent</div>
          <div class="panel-row">Receipts follow-up &middot; due Fri</div>
          <div class="panel-row">Template: quarterly pack</div>
        </div>
      </div>
      -->
    </div>
  </div>

  <div class="frow flip">
    <div class="frow-copy reveal reveal-r">
      <div class="eyebrow">Client dashboard</div>
      <h2>A view your clients will actually use</h2>
      <p>Every connected client gets a simple login that shows what they owe HMRC and when. Payments on account, balancing payments and quarterly deadlines, each with a date, an amount, and a reminder before it is due.</p>
      <ul class="ticklist">
        <li>Clear amounts and due dates</li>
        <li>Reminders before payments on account</li>
        <li>No bookkeeping, no jargon to configure</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-handshake.png"
          alt="Client connection and portal access for the client dashboard"
          class="panel-shot-img"
          width="1280"
          height="800"
        >
      </div>
      <!-- OLD MOCK (kept for now — do not delete)
      <div class="panel">
        <div class="panel-bar"><i></i><i></i><i></i></div>
        <div class="panel-body">
          <h5>Handshake</h5>
          <div class="panel-row">Invite sent &middot; Harris Ltd</div>
          <div class="panel-row">Awaiting client confirm</div>
          <div class="panel-row">Portal access unlocked</div>
        </div>
      </div>
      -->
    </div>
  </div>

  <div class="frow">
    <div class="frow-copy reveal reveal-l">
      <div class="eyebrow">HMRC connection</div>
      <h2>Read-only from HMRC. Always current.</h2>
      <p>Connect your firm, invite clients to authorise, and keep submission status, obligations and balances in one workspace. We do not file returns here. Your existing software does that. We pick up the new status afterwards.</p>
      <ul class="ticklist">
        <li>Firm HMRC connection</li>
        <li>Authorised clients in your dashboard</li>
        <li>Self-employment and UK property support</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-hmrc.png"
          alt="Settings HMRC connection showing firm linked and reading data from HMRC"
          class="panel-shot-img"
          width="1280"
          height="800"
        >
      </div>
      <!-- OLD MOCK (kept for now — do not delete)
      <div class="panel">
        <div class="panel-bar"><i></i><i></i><i></i></div>
        <div class="panel-body">
          <h5>Connection</h5>
          <div class="panel-row">Firm linked &middot; ready</div>
          <div class="panel-row">Clients authorised</div>
          <div class="panel-row">Journeys in sync</div>
        </div>
      </div>
      -->
    </div>
  </div>

  <div class="frow flip">
    <div class="frow-copy reveal reveal-r">
      <div class="eyebrow">Staff and permissions</div>
      <h2>Invite your team without opening everything</h2>
      <p>Add staff, set permissions, and assign clients so each person only sees the monitoring work they should handle.</p>
      <ul class="ticklist">
        <li>Staff invites from Settings</li>
        <li>Permission-based access</li>
        <li>Assigned-client scoping</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-staff.png"
          alt="Settings Team page showing owner and staff with roles and permissions"
          class="panel-shot-img"
          width="1280"
          height="800"
        >
      </div>
      <!-- OLD MOCK (kept for now — do not delete)
      <div class="panel">
        <div class="panel-bar"><i></i><i></i><i></i></div>
        <div class="panel-body">
          <h5>Team</h5>
          <div class="panel-row">Sara &middot; clients assigned</div>
          <div class="panel-row">Omar &middot; chase + portal</div>
          <div class="panel-row">Owner &middot; full access</div>
        </div>
      </div>
      -->
    </div>
  </div>
  </div>
</section>

<section class="sec-soft">
  <div class="wrap">
    <div class="cta-plain reveal">
      <h2>See your whole client book in one place</h2>
      <p>Try My Tax Diary free for 7 days. No card needed. If you would rather see it first, book a 20-minute walkthrough.</p>
      <div class="cta-actions">
        <a href="/register" class="btn btn-primary">Start your 7-day free trial</a>
        <a href="/site/contact" class="btn btn-ghost">Book a demo</a>
        <a href="/site/pricing" class="btn btn-ghost">View pricing</a>
      </div>
    </div>
  </div>
</section>`
export default html
