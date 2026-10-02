const html = `<section class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">Features</div>
    <h1 class="reveal" style="--d:.06s">Tools for the full client journey</h1>
    <p class="reveal" style="--d:.12s">Deadlines, liabilities, status boards, digital handshake, chasing, and portal access, built by accountants for Making Tax Digital for Income Tax.</p>
    <div class="hero-actions reveal" style="--d:.18s">
      <a href="/register" class="btn btn-primary">Get started</a>
      <a href="/site/pricing" class="btn btn-ghost">View pricing</a>
    </div>
  </div>
</section>

<section style="padding-top:24px;padding-bottom:24px">
  <div class="wrap">
  <div class="frow">
    <div class="frow-copy reveal reveal-l">
      <div class="eyebrow">Status views</div>
      <h2>Kanban and list views for every client</h2>
      <p>See submission progress across your book. Flip between board and list so the whole team knows what is waiting, ready, or done.</p>
      <ul class="ticklist">
        <li>Kanban for journey stages</li>
        <li>List view for fast scanning</li>
        <li>Deadlines and liability context</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-status.png"
          alt="Dashboard kanban showing client journey status columns"
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
      <div class="eyebrow">Digital handshake</div>
      <h2>Request client access inside the product</h2>
      <p>Invite clients, complete authorisation, and open portal access without long email threads. The handshake starts the journey cleanly.</p>
      <ul class="ticklist">
        <li>Client invite from your firm</li>
        <li>Access request in-product</li>
        <li>Portal ready when connected</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-handshake.png"
          alt="Add client invitations panel showing pending and resend states"
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
      <div class="eyebrow">Deadlines &amp; liabilities</div>
      <h2>Know what is due and what is owed</h2>
      <p>Keep quarterly dates and balances visible so chase and submission work stay grounded in the numbers that matter.</p>
      <ul class="ticklist">
        <li>Upcoming obligation dates</li>
        <li>Liability and balance visibility</li>
        <li>Notes beside the live picture</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel">
    <div class="panel-bar"><i></i><i></i><i></i></div>
    <div class="panel-body">
      <h5>Client snapshot</h5>
      <div class="panel-row">Next deadline &middot; 4 days</div>
      <div class="panel-row">Balance due &middot; review</div>
      <div class="panel-row">Chase history open</div>
    </div>
  </div>
    </div>
  </div>

  <div class="frow flip">
    <div class="frow-copy reveal reveal-r">
      <div class="eyebrow">Chase manager</div>
      <h2>Chase missing records before deadlines slip</h2>
      <p>Send structured reminders for the packs you need, keep a clear history, and keep email chase separate from portal chat.</p>
      <ul class="ticklist">
        <li>Reusable chase templates</li>
        <li>Per-client chase history</li>
        <li>Clear email vs portal messaging</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-chase.png"
          alt="Chase manager with client list and email chase templates"
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

  <div class="frow">
    <div class="frow-copy reveal reveal-l">
      <div class="eyebrow">HMRC connection</div>
      <h2>Stay connected for Making Tax Digital</h2>
      <p>Connect your firm, work authorised clients, and keep obligations and balances in the same workspace, without exposing low-level integration detail on the marketing site.</p>
      <ul class="ticklist">
        <li>Firm HMRC connection</li>
        <li>Authorised client journeys</li>
        <li>Self-employment and property support</li>
      </ul>
    </div>
    <div class="frow-mock reveal" style="--d:.12s">
      <div class="panel panel-shot">
        <img
          src="/site/feature-hmrc.png"
          alt="Settings HMRC connection page showing firm connected with ARN"
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
      <p>Add staff, set permissions, and assign clients so each person only sees the journeys they should handle.</p>
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
      <h2>See the client journey in your firm</h2>
      <p>Start a firm account, or ask which package fits how you manage deadlines and capacity.</p>
      <div class="cta-actions">
        <a href="/register" class="btn btn-primary">Get started</a>
        <a href="/site/contact" class="btn btn-ghost">Contact us</a>
      </div>
    </div>
  </div>
</section>`
export default html
