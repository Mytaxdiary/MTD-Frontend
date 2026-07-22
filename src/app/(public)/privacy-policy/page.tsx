import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | My Tax Diary',
}

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" }}>
      {/* Top nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: 16, fontWeight: 800, color: '#1B2A4A', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          My Tax Diary
        </Link>
        <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
          <Link href="/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms &amp; Conditions</Link>
          <Link href="/login" style={{ color: '#1E3A5F', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            My Tax Diary Ltd, My Tax Diary Platform
          </p>
          <h1 style={{ margin: '0 0 12px', fontSize: 36, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            Privacy Policy
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: '#64748B' }}>
            Effective date: 20 July 2026
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

          <Section num="1" title="Who We Are">
            <P>
              This Privacy Policy explains how My Tax Diary Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a company registered in England and Wales under company number <strong>17312332</strong> with its registered office at Suite 6, Earl Business Centre, Dowry St, Oldham OL8 2PF, collects and uses personal data in connection with the My Tax Diary website and platform (the &quot;Service&quot;).
            </P>
            <P>
              We are registered with the Information Commissioner&apos;s Office (ICO) under registration number <strong>ZC190729</strong>.
            </P>
          </Section>

          <Section num="2" title="Two Roles We Play">
            <P>
              Because of how the Service works, we act in two different capacities under data protection law, and it matters which one applies to a given piece of data:
            </P>
            <P>
              <strong>As data controller:</strong> for data about you as our Customer or an Authorised User of your account (for example, your name, work email, and billing details), where we decide how and why that data is used. This is covered in sections 3 to 6 below.
            </P>
            <P>
              <strong>As data processor:</strong> for the Client Data your firm provides to the Service, or retrieves through the Service via the HMRC API, about your own clients. Here, your firm is the controller and we only process that data on your documented instructions, under a separate Data Processing Agreement. This is covered in section 7.
            </P>
          </Section>

          <Section num="3" title="Personal Data We Collect (as Controller)">
            <BulletList items={[
              'Account data: name, business/firm name, job role, email address, and login credentials.',
              'Billing data: billing name, address, and payment details, which are processed by our payment provider, Stripe; we do not store full card numbers ourselves.',
              'Usage data: how you interact with the Service, pages visited, and platform activity logs, collected in part via Google Analytics.',
              'Communications: correspondence you send us, including support requests.',
              'Technical data: IP address, browser type, and device information, collected automatically via cookies and similar technologies.',
              'HMRC fraud prevention data: where the Service connects to HMRC on your behalf, we are legally required under the Delivery of Tax Information through Software (Ancillary Metadata) Regulations 2019 to collect and transmit certain audit data to HMRC with each request, such as your IP address, device identifiers, timezone, screen and browser details, and operating system username. This data is sent to HMRC as fraud prevention headers and is used by HMRC to protect taxpayer data.',
            ]} />
          </Section>

          <Section num="4" title="How We Use This Data and Our Legal Basis">
            <BulletList items={[
              'To provide, maintain, and secure the Service, which is necessary for performance of our contract with you.',
              'To process payments and manage your Subscription, which is necessary for performance of our contract with you.',
              'To respond to support queries and communicate service updates, which is necessary for performance of our contract with you, or our legitimate interest in maintaining the relationship.',
              'To analyse and improve the Service via Google Analytics, based on your consent (managed via our cookie banner) or our legitimate interest in understanding platform usage, as applicable.',
              'To comply with legal and accounting obligations, such as retaining billing records, which is necessary for compliance with a legal obligation.',
              'To send you marketing communications about the Service, where you have opted in, based on your consent, which you may withdraw at any time.',
            ]} />
          </Section>

          <Section num="5" title="Cookies and Analytics">
            <P>
              We use essential cookies necessary for the Service to function (such as keeping you logged in) and analytics cookies via Google Analytics to understand how the site is used. Non-essential cookies are only set with your consent, which you can manage or withdraw via our cookie banner or your browser settings.
            </P>
            <P>
              Google Analytics may process data outside the UK; where it does, Google provides appropriate safeguards such as the UK International Data Transfer Addendum or equivalent standard contractual clauses.
            </P>
          </Section>

          <Section num="6" title="Who We Share Controller Data With">
            <BulletList items={[
              'Stripe, Inc., to process subscription payments.',
              'Google (Google Analytics), to analyse Service usage.',
              'Hetzner Online GmbH, our hosting and infrastructure provider, to host and operate the Service from data centres located in the European Economic Area (Germany and Finland).',
              'Professional advisers (such as accountants or lawyers) and regulators, where necessary.',
              'A buyer, in the event we sell or reorganise our business, subject to appropriate safeguards.',
            ]} />
            <P>We do not sell personal data to third parties.</P>
          </Section>

          <Section num="7" title="Client Data We Process on Your Instructions">
            <P>
              Where your firm uses the Service to retrieve or track information about your own clients via the HMRC API, such as agent authorisation status, submission history, or liability visibility, we process that data solely as a processor, on your documented instructions, for the purpose of providing the Service to you.
            </P>
            <P>
              We do not use Client Data for our own purposes, such as marketing, and do not share it other than with sub-processors necessary to deliver the Service (such as our hosting provider), as set out in our Data Processing Agreement. Your firm remains the controller responsible for the lawful basis on which Client Data is collected and processed, and for your own obligations to your clients under UK GDPR.
            </P>
          </Section>

          <Section num="8" title="International Transfers">
            <P>
              The Service is hosted by Hetzner Online GmbH in data centres located in the European Economic Area (Germany and Finland). Transfers of personal data from the UK to the EEA are made under the UK&apos;s adequacy regulations, which permit such transfers without additional safeguards.
            </P>
            <P>
              Where any other providers listed above process personal data outside the UK, we ensure appropriate safeguards are in place, such as adequacy regulations or standard contractual clauses/the UK International Data Transfer Addendum. We keep our transfer arrangements under review to reflect any changes in the UK&apos;s adequacy decisions.
            </P>
          </Section>

          <Section num="9" title="Data Retention">
            <P>
              We retain Customer account and billing data for as long as your Subscription is active, and for six years afterwards in line with standard UK accounting and tax record-keeping obligations. Client Data is retained in accordance with your instructions as controller and our Data Processing Agreement, and is deleted or returned within 30 days of contract termination unless you request otherwise or we are required by law to retain it longer.
            </P>
          </Section>

          <Section num="10" title="Security">
            <P>
              We use appropriate technical and organisational measures to protect personal data, including encryption in transit, access controls, and regular security review of our systems and those of our key sub-processors.
            </P>
          </Section>

          <Section num="11" title="Your Rights">
            <P>If you are an individual whose personal data we control (see section 2), you have the right to:</P>
            <BulletList items={[
              'access the personal data we hold about you;',
              'request correction of inaccurate data;',
              'request erasure, in certain circumstances;',
              'object to or restrict certain processing;',
              'request data portability;',
              'withdraw consent at any time, where processing is based on consent.',
            ]} />
            <P>
              To exercise these rights, contact us at <a href="mailto:info@mytaxdiary.co.uk" style={{ color: '#2563EB' }}>info@mytaxdiary.co.uk</a>. If you are not satisfied with our response, you have the right to complain to the ICO at <a href="https://ico.org.uk" target="_blank" rel="noreferrer" style={{ color: '#2563EB' }}>ico.org.uk</a>.
            </P>
            <P>
              If your personal data is processed by us as part of Client Data (i.e. you are a client of one of our Customer accountancy firms), please contact that firm directly, as they are the data controller for that data.
            </P>
          </Section>

          <Section num="12" title="Children">
            <P>The Service is intended for business use by professional firms and is not directed at, or intended for use by, children.</P>
          </Section>

          <Section num="13" title="Changes to This Policy">
            <P>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Material changes will be notified via email or in-app notice.</P>
          </Section>

          <Section num="14" title="Contact Us">
            <P>
              For any questions about this Privacy Policy or how we handle personal data, contact us at{' '}
              <a href="mailto:info@mytaxdiary.co.uk" style={{ color: '#2563EB' }}>info@mytaxdiary.co.uk</a>.
            </P>
            <P>
              To report a security risk or incident, email{' '}
              <a href="mailto:info@mytaxdiary.co.uk" style={{ color: '#2563EB' }}>info@mytaxdiary.co.uk</a>.
            </P>
          </Section>

        </div>

        {/* Bottom links */}
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13, color: '#64748B' }}>
          <Link href="/terms" style={{ color: '#2563EB', textDecoration: 'none' }}>Terms &amp; Conditions</Link>
          <Link href="/login" style={{ color: '#64748B', textDecoration: 'none' }}>Sign in</Link>
          <a href="mailto:info@mytaxdiary.co.uk" style={{ color: '#64748B', textDecoration: 'none' }}>info@mytaxdiary.co.uk</a>
          <span>My Tax Diary Ltd, Company No. 17312332</span>
        </div>
      </div>
    </div>
  )
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#2563EB', minWidth: 22 }}>{num}.</span>
        {title}
      </h2>
      <div style={{ paddingLeft: 32 }}>{children}</div>
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: '0 0 12px', fontSize: 14, color: '#374151', lineHeight: 1.75 }}>{children}</p>
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, marginBottom: 6 }}>{item}</li>
      ))}
    </ul>
  )
}
