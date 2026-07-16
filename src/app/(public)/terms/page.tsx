import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions | My Tax Diary',
}

const PENDING_STYLE: React.CSSProperties = {
  display: 'inline-block',
  background: '#FEF3C7',
  color: '#92400E',
  border: '1px solid #FDE68A',
  borderRadius: 4,
  padding: '1px 6px',
  fontSize: 12,
  fontWeight: 600,
}

function Pending({ label }: { label: string }) {
  return <span style={PENDING_STYLE}>{label}</span>
}

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" }}>
      {/* Top nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: 16, fontWeight: 800, color: '#1B2A4A', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          My Tax Diary
        </Link>
        <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
          <Link href="/privacy-policy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</Link>
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
            Terms and Conditions
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: '#64748B' }}>
            Effective date: <Pending label="[Effective date to be inserted]" />
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

          <Section num="1" title="About These Terms">
            <P>
              These Terms and Conditions (&quot;Terms&quot;) govern access to and use of the My Tax Diary website and platform (the &quot;Service&quot;) provided by My Tax Diary Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a company registered in England and Wales under company number <strong>17312332</strong> with its registered office at <Pending label="[Registered office address to be inserted]" />.
            </P>
            <P>
              The Service is provided to accountancy firms, tax agents, and similar professional practices (&quot;you&quot;, &quot;your firm&quot;, the &quot;Customer&quot;). By creating an account, accessing, or using the Service, you agree to these Terms on behalf of your firm. If you do not agree, you must not use the Service.
            </P>
            <P>
              These Terms apply together with our Privacy Policy and our Data Processing Agreement (&quot;DPA&quot;), which forms part of these Terms where we process Client Data on your behalf.
            </P>
          </Section>

          <Section num="2" title="What the Service Does">
            <P>
              My Tax Diary is a read-only visibility and monitoring platform. It connects to HM Revenue and Customs (&quot;HMRC&quot;) Making Tax Digital (&quot;MTD&quot;) Income Tax Self Assessment APIs to retrieve and display information relating to your clients, such as agent authorisation status, business details, obligations and deadlines, submission history, and liability information (&quot;Client Data&quot;), so that your firm can monitor its client base in one place.
            </P>
          </Section>

          <Section num="3" title="What the Service Does Not Do">
            <P>For the avoidance of doubt, the Service:</P>
            <BulletList items={[
              'does not submit, file, amend, or transmit any information to HMRC on your behalf or on behalf of your clients. It performs read-only retrieval of information only;',
              'is not record-keeping, bookkeeping, or filing software, and does not by itself satisfy your clients\' obligations under Making Tax Digital;',
              'does not provide tax, accounting, legal, or financial advice. Information displayed in the Service is not a substitute for professional judgement;',
              'does not verify, correct, or guarantee the accuracy, completeness, or timeliness of information held by HMRC. The Service displays information as provided by HMRC\'s systems at the time of retrieval;',
              'is not provided, approved, endorsed, or accredited by HMRC. My Tax Diary Ltd is an independent software provider.',
            ]} />
          </Section>

          <Section num="4" title="Your Firm's Responsibilities">
            <P>You are responsible for:</P>
            <BulletList items={[
              'holding and maintaining valid agent authorisations with HMRC for each client whose data you access through the Service, and using the Service only in respect of clients you are lawfully authorised to act for;',
              'the security and proper use of your HMRC credentials and agent services account, and complying with HMRC\'s terms and conditions applicable to agents;',
              'keeping your account login credentials confidential, and ensuring only authorised members of your firm access the Service;',
              'ensuring you have a lawful basis under UK GDPR to obtain and process your clients\' data through the Service, and meeting your own obligations to your clients as data controller;',
              'your professional obligations to your clients, including any advice, filings, or deadlines. Decisions and actions taken in reliance on information shown in the Service remain your responsibility;',
              'providing accurate account and billing information and keeping it up to date;',
              'using the Service lawfully, and not attempting to interfere with, reverse engineer, resell, or misuse the Service or access it other than through the interfaces we provide.',
            ]} />
          </Section>

          <Section num="5" title="Our Responsibilities">
            <P>We will:</P>
            <BulletList items={[
              'provide the Service with reasonable skill and care;',
              'use commercially reasonable efforts to make the Service available, subject to planned maintenance and circumstances outside our control (including the availability of HMRC\'s APIs);',
              'implement appropriate technical and organisational measures to protect data processed through the Service, as described in our Privacy Policy and DPA;',
              'comply with our obligations under applicable data protection law, including transmitting fraud prevention header data to HMRC as required by the Delivery of Tax Information through Software (Ancillary Metadata) Regulations 2019.',
            ]} />
            <P>
              The Service depends on HMRC&apos;s APIs and systems. We are not responsible for the availability, accuracy, or performance of HMRC&apos;s systems, for changes HMRC makes to its APIs, or for any decision HMRC takes in relation to your firm or your clients.
            </P>
          </Section>

          <Section num="6" title="Fees and Payment">
            <BulletList items={[
              'Access to the Service is provided on a subscription basis. The applicable fees, billing frequency, and any usage limits are those set out on our pricing page or in your order at the time you subscribe.',
              'Fees are payable in advance by the payment methods we support and are processed by our payment provider, Stripe. You authorise us to charge your chosen payment method on each renewal date until your subscription is cancelled.',
              'Fees are stated exclusive of VAT, which will be added where applicable.',
              'If a payment fails or is overdue, we may suspend access to the Service until payment is received, having given you notice and a reasonable opportunity to pay.',
              'We may change our fees by giving you at least 30 days\' notice; changes take effect from your next renewal. If you do not accept a fee change, you may cancel before the renewal takes effect.',
              'Except where required by law or expressly stated otherwise, fees are non-refundable, including for partly used subscription periods.',
            ]} />
          </Section>

          <Section num="7" title="Intellectual Property">
            <P>
              We (and our licensors) own all intellectual property rights in the Service, including its software, design, and branding. We grant your firm a non-exclusive, non-transferable licence to use the Service for your internal business purposes during your subscription. Client Data and your firm&apos;s data remain yours; you grant us a licence to process them only as needed to provide the Service, as set out in the DPA.
            </P>
          </Section>

          <Section num="8" title="Data Protection">
            <P>
              Each party will comply with applicable data protection law, including UK GDPR and the Data Protection Act 2018. Our processing of personal data is described in our{' '}
              <Link href="/privacy-policy" style={{ color: '#2563EB' }}>Privacy Policy</Link>. Where we process Client Data on your behalf, we do so as processor under the DPA, and your firm remains the controller.
            </P>
          </Section>

          <Section num="9" title="Liability">
            <P>
              Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or for any other liability that cannot be excluded or limited under the law of England and Wales.
            </P>
            <P>Subject to the paragraph above:</P>
            <BulletList items={[
              'we will not be liable for any indirect or consequential loss, loss of profits, loss of revenue, loss of business or goodwill, or loss or corruption of data;',
              'we will not be liable for losses arising from inaccurate, incomplete, or delayed information originating from HMRC\'s systems, from the unavailability of HMRC\'s APIs, or from your reliance on information displayed in the Service without independent verification;',
              'we will not be liable for losses arising from missed deadlines, penalties, interest, or other consequences relating to your or your clients\' tax affairs. Responsibility for meeting filing and payment obligations remains with your firm and your clients;',
              'our total aggregate liability to you arising out of or in connection with the Service in any 12-month period is limited to the fees paid by your firm for the Service in that period.',
            ]} />
          </Section>

          <Section num="10" title="Suspension">
            <P>
              We may suspend access to the Service, in whole or in part, where reasonably necessary: for maintenance or security; where we reasonably believe your use breaches these Terms or applicable law; where required by HMRC or a regulator; or where fees are overdue as described in section 6. Where practicable, we will give you notice and an opportunity to remedy the issue before suspending.
            </P>
          </Section>

          <Section num="11" title="Term and Termination">
            <BulletList items={[
              'Your subscription continues for the billing period selected and renews automatically until cancelled.',
              'You may cancel at any time via your account settings or by written notice to us; cancellation takes effect at the end of your current billing period.',
              'We may terminate these Terms on at least 30 days\' written notice to the end of your current billing period.',
              'Either party may terminate immediately by written notice if the other commits a material breach of these Terms and (where remediable) fails to remedy it within 30 days of being notified, or becomes insolvent.',
              'On termination: your right to use the Service ends; any fees due remain payable; and Client Data will be deleted or returned within 30 days in accordance with the DPA and our Privacy Policy, unless you request otherwise or we are required by law to retain it.',
            ]} />
          </Section>

          <Section num="12" title="Changes to the Service and These Terms">
            <P>
              We may improve or modify the Service, provided the changes do not materially reduce its core functionality during your paid subscription period. We may update these Terms from time to time; material changes will be notified to you by email or in-app notice at least 30 days before they take effect. If you do not accept a material change, you may cancel before it takes effect.
            </P>
          </Section>

          <Section num="13" title="General">
            <BulletList items={[
              'Force majeure: neither party is liable for delay or failure caused by events beyond its reasonable control.',
              'Assignment: you may not assign these Terms without our prior written consent; we may assign them to a successor of our business on notice to you.',
              'Entire agreement: these Terms, the Privacy Policy, the DPA, and your order form the entire agreement between the parties in relation to the Service.',
              'Severance: if any provision is found unenforceable, the remainder continues in effect.',
              'Waiver: a failure to enforce a right is not a waiver of it.',
              'Third party rights: no one other than the parties has any right to enforce these Terms.',
              'Notices: notices must be sent in writing to info@mytaxdiary.co.uk (for us) or to the email address on your account (for you).',
            ]} />
          </Section>

          <Section num="14" title="Governing Law and Jurisdiction">
            <P>
              These Terms, and any dispute or claim arising out of or in connection with them or the Service (including non-contractual disputes or claims), are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.
            </P>
          </Section>

          <Section num="15" title="Contact Us">
            <P>
              For any questions about these Terms, contact us at{' '}
              <a href="mailto:info@mytaxdiary.co.uk" style={{ color: '#2563EB' }}>info@mytaxdiary.co.uk</a>.
            </P>
          </Section>

        </div>

        {/* Bottom links */}
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13, color: '#64748B' }}>
          <Link href="/privacy-policy" style={{ color: '#2563EB', textDecoration: 'none' }}>Privacy Policy</Link>
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
