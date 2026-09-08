import SiteButton from '@/features/marketing/components/SiteButton'
import SiteContainer from '@/features/marketing/components/SiteContainer'
import { SITE_APP_REGISTER } from '@/features/marketing/nav'

const FEATURES = [
  {
    label: 'Agent portal',
    title: 'Run your client list in one place',
    body: 'See obligations, submissions, and client status without jumping between spreadsheets and HMRC screens.',
  },
  {
    label: 'Client portal',
    title: 'Give clients a clear view',
    body: 'Clients can check liabilities, quarterly updates, and message your firm without chasing email threads.',
  },
  {
    label: 'HMRC MTD',
    title: 'Stay connected to HMRC',
    body: 'Authorise clients, pull live obligations and liabilities, and keep Self Assessment MTD work moving.',
  },
  {
    label: 'Email chase',
    title: 'Chase records on time',
    body: 'Send structured email reminders for missing records so quarterly deadlines do not slip.',
  },
  {
    label: 'Staff access',
    title: 'Invite your team safely',
    body: 'Add staff with permissions and assigned clients so juniors only see what they should.',
  },
  {
    label: 'Practice ops',
    title: 'Built for accountants',
    body: 'Designed around UK agent workflows for Making Tax Digital for Income Tax Self Assessment.',
  },
] as const

const STEPS = [
  {
    title: 'Create your firm account',
    body: 'Register My Tax Diary, invite your team, and set permissions for how work is shared.',
  },
  {
    title: 'Connect HMRC and add clients',
    body: 'Link your agent credentials, authorise clients, and bring obligations into the dashboard.',
  },
  {
    title: 'Chase, review, and keep clients informed',
    body: 'Use email chases and the client portal so records arrive on time and clients always know where they stand.',
  },
  {
    title: 'Work each quarter with confidence',
    body: 'Track deadlines, liabilities, and progress in one workspace instead of scattered tools.',
  },
] as const

export const metadata = {
  title: 'Home',
  description:
    'My Tax Diary is MTD ITSA software for UK accountants — agent portal, client portal, HMRC connection, chase, and staff permissions.',
}

export default function MarketingHomePage() {
  return (
    <>
      <section className="mtd-home-hero" aria-label="My Tax Diary introduction">
        <div className="mtd-home-hero__glow" aria-hidden />
        <SiteContainer>
          <div className="mtd-home-hero__inner">
            <p className="mtd-home-hero__brand">My Tax Diary</p>
            <h1>MTD ITSA software for UK accountants</h1>
            <p className="mtd-home-hero__lead">
              One place for your firm to manage clients, HMRC Making Tax Digital work, chasing, and
              client updates.
            </p>
            <div className="mtd-home-hero__ctas">
              <SiteButton href={SITE_APP_REGISTER} variant="secondary">
                Get started
              </SiteButton>
              <SiteButton href="/site/features" variant="on-dark">
                See how it works
              </SiteButton>
            </div>
          </div>
        </SiteContainer>
      </section>

      <section className="mtd-home-section mtd-home-section--surface">
        <SiteContainer>
          <div className="mtd-home-section__head">
            <h2>Built around how practices actually work</h2>
            <p>
              My Tax Diary brings agent work, client visibility, and HMRC data together so quarterly
              MTD ITSA does not rely on scattered tools.
            </p>
          </div>
          <div className="mtd-home-overview">
            <article className="mtd-home-overview__item">
              <h3>For the firm</h3>
              <p>Dashboard, client detail, staff roles, and email chase in one agent workspace.</p>
            </article>
            <article className="mtd-home-overview__item">
              <h3>For your clients</h3>
              <p>A simple portal for liabilities, quarterly progress, files, and messages.</p>
            </article>
            <article className="mtd-home-overview__item">
              <h3>For MTD ITSA</h3>
              <p>HMRC connection for obligations, self-employment, UK property, and account balances.</p>
            </article>
          </div>
        </SiteContainer>
      </section>

      <section className="mtd-home-section">
        <SiteContainer>
          <div className="mtd-home-section__head">
            <h2>Everything your practice needs for MTD</h2>
            <p>Core modules that cover day-to-day agent work without bloating the product.</p>
          </div>
          <div className="mtd-home-features">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="mtd-home-feature">
                <span className="mtd-home-feature__label">{feature.label}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </SiteContainer>
      </section>

      <section className="mtd-home-section mtd-home-section--navy">
        <SiteContainer>
          <div className="mtd-home-section__head">
            <h2>How it works</h2>
            <p>From signup to steady quarterly rhythm in four clear steps.</p>
          </div>
          <div className="mtd-home-steps">
            {STEPS.map((step) => (
              <article key={step.title} className="mtd-home-step">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </SiteContainer>
      </section>

      <section className="mtd-home-section mtd-home-section--surface">
        <SiteContainer>
          <div className="mtd-home-trust">
            <div>
              <blockquote>
                “We needed one system our team and clients could both use for Making Tax Digital -
                without teaching everyone a new maze of tools.”
              </blockquote>
              <div className="mtd-home-trust__meta">
                <strong>Practice feedback</strong>
                UK accountants evaluating My Tax Diary for MTD ITSA rollout
              </div>
            </div>
            <ul className="mtd-home-trust__points">
              <li>Designed for UK agent firms, not generic bookkeeping software</li>
              <li>Client portal and email chase included alongside HMRC workflows</li>
              <li>Staff permissions so access stays controlled as the team grows</li>
            </ul>
          </div>
        </SiteContainer>
      </section>

      <section className="mtd-home-cta">
        <SiteContainer>
          <h2>Ready to simplify MTD for your firm?</h2>
          <p>Create your account, or talk to us about packages and onboarding.</p>
          <div className="mtd-home-cta__actions">
            <SiteButton href={SITE_APP_REGISTER} variant="secondary">
              Get started
            </SiteButton>
            <SiteButton href="/site/contact" variant="ghost">
              Contact us
            </SiteButton>
            <SiteButton href="/site/pricing" variant="ghost">
              View pricing
            </SiteButton>
          </div>
        </SiteContainer>
      </section>
    </>
  )
}
