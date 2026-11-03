const html = `<section class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">Features</div>
    <h1 class="reveal" style="--d:.06s">Everything you need to keep on top of MTD across your client book</h1>
    <p class="reveal" style="--d:.12s">See who has submitted, what each client owes and when, chase for figures, and give clients a simple portal. It works alongside the software you already file with.</p>
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
      <h2>Know who has submitted, across your whole client book</h2>
      <p>See every client's quarterly updates and final declaration in one place, with the status taken from HMRC. Use the kanban board when you want a visual overview of who is waiting and who is done. Switch to the list when you want to sort, filter and work through clients one by one.</p>
      <ul class="ticklist">
        <li>Status from HMRC, not a spreadsheet someone forgot to update</li>
        <li>Kanban board and list views of your whole client book</li>
        <li>Filters to find exactly who needs attention</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-status.png"
          alt="My Tax Diary dashboard in board view, showing each client's MTD submission status across the firm"
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
      <h2>Answer "what do I owe?" without logging in to HMRC</h2>
      <p>See each client's liability, payments on account, balancing payments and due dates on screen, so when a client rings you already have the answer. Figures are read from HMRC.</p>
      <ul class="ticklist">
        <li>What each client owes, and when it is due</li>
        <li>Payments on account and balancing payments</li>
        <li>Every connected client in one place</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel">
    <div class="panel-bar"><i></i><i></i><i></i></div>
    <div class="panel-body">
      <h5>Example</h5>
      <div class="panel-row">Payment on account &middot; due 31 Jan</div>
      <div class="panel-row">Balancing payment &middot; review</div>
      <div class="panel-row">Next quarterly deadline &middot; 12 days</div>
    </div>
  </div>
    </div>
  </div>

  <div class="frow">
    <div class="frow-copy reveal reveal-l">
      <div class="eyebrow">Client chasers</div>
      <h2>Stop chasing for figures from your own inbox</h2>
      <p>Set up your chase templates once, then email clients before each quarterly deadline to ask for their figures. Replies come straight to your inbox, so you can get on with preparing the update. Every chaser is logged, so you can see what went out and when.</p>
      <ul class="ticklist">
        <li>Templates you choose, sent when you need them</li>
        <li>A log of every chaser sent and when</li>
        <li>Replies go straight to your own inbox</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-chase.png"
          alt="My Tax Diary chaser manager showing chase templates and clients to email"
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
      <div class="eyebrow">Team and permissions</div>
      <h2>Share the workload with your team</h2>
      <p>Add your staff, assign clients to each person, and let them chase and manage the clients they are responsible for. The chaser log keeps a record of what went out and when, so nothing falls between the cracks.</p>
      <ul class="ticklist">
        <li>Invite staff from Settings</li>
        <li>Assign clients to the right member of your team</li>
        <li>Staff chase and manage the clients assigned to them</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-staff.png"
          alt="My Tax Diary team settings page showing the owner and staff members with their roles and permissions"
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

  <div class="frow">
    <div class="frow-copy reveal reveal-l">
      <div class="eyebrow">Client portal</div>
      <h2>A simple portal for every client</h2>
      <p>Every connected client gets their own login to a clear, jargon-free dashboard. It shows their quarterly submissions, their latest liability and how to pay. It is a better service for them, and fewer "where do I stand?" calls for you.</p>
      <ul class="ticklist">
        <li>Their submissions and what they owe, with dates and amounts</li>
        <li>Payments on account and balancing payments</li>
        <li>Clear guidance on how to pay</li>
      </ul>
      <p class="frow-note">Figures shown are as reported by HMRC.</p>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-handshake.png"
          alt="My Tax Diary client portal showing a client's submissions, what they owe and how to pay"
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

  <div class="frow flip">
    <div class="frow-copy reveal reveal-r">
      <div class="eyebrow">HMRC connection</div>
      <h2>Connected to HMRC, with read-only access</h2>
      <p>Connect your firm once, then add each client's name, UTR and National Insurance number. We send them a link to authorise you through HMRC. From then on, their submission status, obligations and balances are refreshed from HMRC daily.</p>
      <p>You keep filing with the software you use today, and My Tax Diary picks up the new status afterwards.</p>
      <ul class="ticklist">
        <li>One connection for your firm</li>
        <li>Clients authorise you through a link we send them</li>
        <li>Self-employment and UK property income</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-hmrc.png"
          alt="My Tax Diary settings page showing the firm connected to HMRC and reading data from it"
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
