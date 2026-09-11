import SiteButton from '@/features/marketing/components/SiteButton'
import SiteContainer from '@/features/marketing/components/SiteContainer'
import { SITE_APP_REGISTER } from '@/features/marketing/nav'

const MODULES = [
  {
    id: 'agent',
    label: 'Agent dashboard',
    title: 'See every client and deadline in one workspace',
    body: 'Open your client list, jump into obligations and liabilities, and keep quarterly work moving without spreadsheet juggling.',
    points: [
      'Client list with clear status',
      'Obligations and quarterly progress',
      'Notes and chase history in context',
    ],
    mockTitle: 'Clients',
    mockRows: ['Walker & Co · SE + Property', 'Greenfield Ltd · Self-employment', 'A. Khan · UK property'],
  },
  {
    id: 'portal',
    label: 'Client portal',
    title: 'Give clients a simple place to stay informed',
    body: 'Clients can review liabilities, quarterly submissions, files, and messages without chasing your inbox.',
    points: [
      'Liabilities and payment guidance',
      'Quarterly submission visibility',
      'Two-way portal chat',
    ],
    mockTitle: 'Portal home',
    mockRows: ['Balance due 31 Jan', 'Q2 records requested', 'New message from your agent'],
  },
  {
    id: 'hmrc',
    label: 'HMRC MTD',
    title: 'Stay connected to Making Tax Digital',
    body: 'Authorise clients, pull live HMRC data, and work self-employment and UK property flows from the same product.',
    points: [
      'Agent HMRC connection',
      'Obligations and account balances',
      'Self-employment and UK property support',
    ],
    mockTitle: 'HMRC status',
    mockRows: ['Connected · sandbox / live ready', 'Obligations synced', 'Liabilities loaded'],
  },
  {
    id: 'chase',
    label: 'Chase manager',
    title: 'Chase missing records before deadlines slip',
    body: 'Send structured email reminders for the records you need, keep a clear history, and separate email chases from portal chat.',
    points: [
      'Reusable chase templates',
      'Per-client chase history',
      'Clear email vs portal messaging',
    ],
    mockTitle: 'Email chases',
    mockRows: ['Q3 bank statements · sent', 'Receipts follow-up · due Fri', 'Template: quarterly pack'],
  },
  {
    id: 'staff',
    label: 'Staff and permissions',
    title: 'Invite your team without opening everything',
    body: 'Add staff, set permissions, and assign clients so each person only sees the work they should handle.',
    points: [
      'Staff invites from Settings',
      'Permission-based access',
      'Assigned-client scoping',
    ],
    mockTitle: 'Team',
    mockRows: ['Sara · clients assigned', 'Omar · chase + portal', 'Owner · full access'],
  },
] as const

export const metadata = {
  title: 'Features',
  description:
    'Explore My Tax Diary features for UK accountants: agent dashboard, client portal, HMRC MTD, chase manager, and staff permissions.',
}

export default function MarketingFeaturesPage() {
  return (
    <>
      <section className="mtd-page-hero">
        <SiteContainer>
          <p className="mtd-page-hero__eyebrow">Features</p>
          <h1>Built for MTD ITSA practice work</h1>
          <p>
            Agent tools, client visibility, HMRC connection, chasing, and staff controls in one
            product designed for UK accountants.
          </p>
          <div className="mtd-page-hero__ctas">
            <SiteButton href={SITE_APP_REGISTER} variant="secondary">
              Get started
            </SiteButton>
            <SiteButton href="/site/pricing" variant="ghost">
              View pricing
            </SiteButton>
          </div>
        </SiteContainer>
      </section>

      {MODULES.map((mod, index) => (
        <section
          key={mod.id}
          id={mod.id}
          className={
            index % 2 === 1
              ? 'mtd-home-section mtd-home-section--surface mtd-feature-block'
              : 'mtd-home-section mtd-feature-block'
          }
        >
          <SiteContainer>
            <div
              className="mtd-feature-row"
              data-reverse={index % 2 === 1 ? 'true' : 'false'}
            >
              <div className="mtd-feature-copy">
                <span className="mtd-home-feature__label">{mod.label}</span>
                <h2>{mod.title}</h2>
                <p>{mod.body}</p>
                <ul className="mtd-feature-points">
                  {mod.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="mtd-feature-mock" aria-hidden>
                <div className="mtd-feature-mock__chrome">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="mtd-feature-mock__title">{mod.mockTitle}</div>
                <ul className="mtd-feature-mock__rows">
                  {mod.mockRows.map((row) => (
                    <li key={row}>{row}</li>
                  ))}
                </ul>
              </div>
            </div>
          </SiteContainer>
        </section>
      ))}

      <section className="mtd-home-cta">
        <SiteContainer>
          <h2>See the full workflow in your firm</h2>
          <p>Start a firm account, or ask us which package fits your client volume.</p>
          <div className="mtd-home-cta__actions">
            <SiteButton href={SITE_APP_REGISTER} variant="secondary">
              Get started
            </SiteButton>
            <SiteButton href="/site/contact" variant="ghost">
              Contact us
            </SiteButton>
          </div>
        </SiteContainer>
      </section>
    </>
  )
}
