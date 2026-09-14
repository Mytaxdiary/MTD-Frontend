import Link from 'next/link'
import { LegalBullets, LegalP, LegalSection } from './primitives'

type Props = {
  termsHref: string
  cookiesHref: string
}

export default function PrivacyBody({ termsHref, cookiesHref }: Props) {
  return (
    <div className="mtd-legal-stack">
      <LegalSection num="1" title="Who We Are">
        <LegalP>
          This Privacy Policy explains how My Tax Diary Ltd (&quot;we&quot;, &quot;us&quot;,
          &quot;our&quot;), a company registered in England and Wales under company number{' '}
          <strong>17312332</strong> with its registered office at Suite 6, Earl Business Centre,
          Dowry St, Oldham OL8 2PF, collects and uses personal data in connection with the My Tax
          Diary website and platform (the &quot;Service&quot;).
        </LegalP>
        <LegalP>
          We are registered with the Information Commissioner&apos;s Office (ICO) under registration
          number <strong>ZC190729</strong>.
        </LegalP>
      </LegalSection>

      <LegalSection num="2" title="Two Roles We Play">
        <LegalP>
          Because of how the Service works, we act in two different capacities under data protection
          law, and it matters which one applies to a given piece of data:
        </LegalP>
        <LegalP>
          <strong>As data controller:</strong> for data about you as our Customer or an Authorised
          User of your account (for example, your name, work email, and billing details), where we
          decide how and why that data is used. This is covered in sections 3 to 6 below.
        </LegalP>
        <LegalP>
          <strong>As data processor:</strong> for the Client Data your firm provides to the Service,
          or retrieves through the Service via the HMRC API, about your own clients. Here, your firm
          is the controller and we only process that data on your documented instructions, under a
          separate Data Processing Agreement. This is covered in section 7.
        </LegalP>
      </LegalSection>

      <LegalSection num="3" title="Personal Data We Collect (as Controller)">
        <LegalBullets
          items={[
            'Account data: name, business/firm name, job role, email address, and login credentials.',
            'Billing data: billing name, address, and payment details, which are processed by our payment provider, Stripe; we do not store full card numbers ourselves.',
            'Usage data: how you interact with the Service, pages visited, and platform activity logs, collected in part via Google Analytics.',
            'Communications: correspondence you send us, including support requests.',
            'Technical data: IP address, browser type, and device information, collected automatically via cookies and similar technologies.',
            'HMRC fraud prevention data: where the Service connects to HMRC on your behalf, we are legally required under the Delivery of Tax Information through Software (Ancillary Metadata) Regulations 2019 to collect and transmit certain audit data to HMRC with each request, such as your IP address, device identifiers, timezone, screen and browser details, and operating system username. This data is sent to HMRC as fraud prevention headers and is used by HMRC to protect taxpayer data.',
          ]}
        />
      </LegalSection>

      <LegalSection num="4" title="How We Use This Data and Our Legal Basis">
        <LegalBullets
          items={[
            'To provide, maintain, and secure the Service, which is necessary for performance of our contract with you.',
            'To process payments and manage your Subscription, which is necessary for performance of our contract with you.',
            'To respond to support queries and communicate service updates, which is necessary for performance of our contract with you, or our legitimate interest in maintaining the relationship.',
            'To analyse and improve the Service via Google Analytics, based on your consent (managed via our cookie banner) or our legitimate interest in understanding platform usage, as applicable.',
            'To comply with legal and accounting obligations, such as retaining billing records, which is necessary for compliance with a legal obligation.',
            'To send you marketing communications about the Service, where you have opted in, based on your consent, which you may withdraw at any time.',
          ]}
        />
      </LegalSection>

      <LegalSection num="5" title="Cookies and Analytics">
        <LegalP>
          We use essential cookies necessary for the Service to function (such as keeping you logged
          in) and analytics cookies via Google Analytics to understand how the site is used.
          Non-essential cookies are only set with your consent, which you can manage or withdraw via
          our cookie banner or your browser settings. See our{' '}
          <Link href={cookiesHref}>Cookies Policy</Link> for more detail.
        </LegalP>
        <LegalP>
          Google Analytics may process data outside the UK; where it does, Google provides
          appropriate safeguards such as the UK International Data Transfer Addendum or equivalent
          standard contractual clauses.
        </LegalP>
      </LegalSection>

      <LegalSection num="6" title="Who We Share Controller Data With">
        <LegalBullets
          items={[
            'Stripe, Inc., to process subscription payments.',
            'Google (Google Analytics), to analyse Service usage.',
            'Hetzner Online GmbH, our hosting and infrastructure provider, to host and operate the Service from data centres located in the European Economic Area (Germany and Finland).',
            'Professional advisers (such as accountants or lawyers) and regulators, where necessary.',
            'A buyer, in the event we sell or reorganise our business, subject to appropriate safeguards.',
          ]}
        />
        <LegalP>We do not sell personal data to third parties.</LegalP>
      </LegalSection>

      <LegalSection num="7" title="Client Data We Process on Your Instructions">
        <LegalP>
          Where your firm uses the Service to retrieve or track information about your own clients
          via the HMRC API, such as agent authorisation status, submission history, or liability
          visibility, we process that data solely as a processor, on your documented instructions,
          for the purpose of providing the Service to you.
        </LegalP>
        <LegalP>
          We do not use Client Data for our own purposes, such as marketing, and do not share it
          other than with sub-processors necessary to deliver the Service (such as our hosting
          provider), as set out in our Data Processing Agreement. Your firm remains the controller
          responsible for the lawful basis on which Client Data is collected and processed, and for
          your own obligations to your clients under UK GDPR.
        </LegalP>
      </LegalSection>

      <LegalSection num="8" title="International Transfers">
        <LegalP>
          The Service is hosted by Hetzner Online GmbH in data centres located in the European
          Economic Area (Germany and Finland). Transfers of personal data from the UK to the EEA are
          made under the UK&apos;s adequacy regulations, which permit such transfers without
          additional safeguards.
        </LegalP>
        <LegalP>
          Where any other providers listed above process personal data outside the UK, we ensure
          appropriate safeguards are in place, such as adequacy regulations or standard contractual
          clauses/the UK International Data Transfer Addendum. We keep our transfer arrangements
          under review to reflect any changes in the UK&apos;s adequacy decisions.
        </LegalP>
      </LegalSection>

      <LegalSection num="9" title="Data Retention">
        <LegalP>
          We retain Customer account and billing data for as long as your Subscription is active, and
          for six years afterwards in line with standard UK accounting and tax record-keeping
          obligations. Client Data is retained in accordance with your instructions as controller and
          our Data Processing Agreement, and is deleted or returned within 30 days of contract
          termination unless you request otherwise or we are required by law to retain it longer.
        </LegalP>
      </LegalSection>

      <LegalSection num="10" title="Security">
        <LegalP>
          We use appropriate technical and organisational measures to protect personal data,
          including encryption in transit, access controls, and regular security review of our
          systems and those of our key sub-processors.
        </LegalP>
      </LegalSection>

      <LegalSection num="11" title="Your Rights">
        <LegalP>
          If you are an individual whose personal data we control (see section 2), you have the right
          to:
        </LegalP>
        <LegalBullets
          items={[
            'access the personal data we hold about you;',
            'request correction of inaccurate data;',
            'request erasure, in certain circumstances;',
            'object to or restrict certain processing;',
            'request data portability;',
            'withdraw consent at any time, where processing is based on consent.',
          ]}
        />
        <LegalP>
          To exercise these rights, contact us at{' '}
          <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>. If you are not satisfied
          with our response, you have the right to complain to the ICO at{' '}
          <a href="https://ico.org.uk" target="_blank" rel="noreferrer">
            ico.org.uk
          </a>
          .
        </LegalP>
        <LegalP>
          If your personal data is processed by us as part of Client Data (i.e. you are a client of
          one of our Customer accountancy firms), please contact that firm directly, as they are the
          data controller for that data.
        </LegalP>
      </LegalSection>

      <LegalSection num="12" title="Children">
        <LegalP>
          The Service is intended for business use by professional firms and is not directed at, or
          intended for use by, children.
        </LegalP>
      </LegalSection>

      <LegalSection num="13" title="Changes to This Policy">
        <LegalP>
          We may update this Privacy Policy from time to time to reflect changes in our practices or
          legal requirements. Material changes will be notified via email or in-app notice.
        </LegalP>
      </LegalSection>

      <LegalSection num="14" title="Contact Us">
        <LegalP>
          For any questions about this Privacy Policy or how we handle personal data, contact us at{' '}
          <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>.
        </LegalP>
        <LegalP>
          To report a security risk or incident, email{' '}
          <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>.
        </LegalP>
        <LegalP>
          Related: <Link href={termsHref}>Terms and Conditions</Link> ·{' '}
          <Link href={cookiesHref}>Cookies Policy</Link>
        </LegalP>
      </LegalSection>
    </div>
  )
}
