import Link from 'next/link'
import { LegalBullets, LegalP, LegalSection } from './primitives'

type Props = {
  privacyHref: string
}

export default function TermsBody({ privacyHref }: Props) {
  return (
    <div className="mtd-legal-stack">
      <LegalSection num="1" title="About These Terms">
        <LegalP>
          These Terms and Conditions (&quot;Terms&quot;) govern access to and use of the My Tax Diary
          website and platform (the &quot;Service&quot;) provided by My Tax Diary Ltd (&quot;we&quot;,
          &quot;us&quot;, &quot;our&quot;), a company registered in England and Wales under company
          number <strong>17312332</strong> with its registered office at Suite 6, Earl Business
          Centre, Dowry St, Oldham OL8 2PF.
        </LegalP>
        <LegalP>
          The Service is provided to accountancy firms, tax agents, and similar professional
          practices (&quot;you&quot;, &quot;your firm&quot;, the &quot;Customer&quot;). By creating
          an account, accessing, or using the Service, you agree to these Terms on behalf of your
          firm. If you do not agree, you must not use the Service.
        </LegalP>
        <LegalP>
          These Terms apply together with our Privacy Policy and our Data Processing Agreement
          (&quot;DPA&quot;), which forms part of these Terms where we process Client Data on your
          behalf.
        </LegalP>
      </LegalSection>

      <LegalSection num="2" title="What the Service Does">
        <LegalP>
          My Tax Diary is a read-only visibility and monitoring platform. It connects to HM Revenue
          and Customs (&quot;HMRC&quot;) Making Tax Digital (&quot;MTD&quot;) Income Tax Self
          Assessment APIs to retrieve and display information relating to your clients, such as
          agent authorisation status, business details, obligations and deadlines, submission
          history, and liability information (&quot;Client Data&quot;), so that your firm can monitor
          its client base in one place.
        </LegalP>
      </LegalSection>

      <LegalSection num="3" title="What the Service Does Not Do">
        <LegalP>For the avoidance of doubt, the Service:</LegalP>
        <LegalBullets
          items={[
            'does not submit, file, amend, or transmit any information to HMRC on your behalf or on behalf of your clients. It performs read-only retrieval of information only;',
            "is not record-keeping, bookkeeping, or filing software, and does not by itself satisfy your clients' obligations under Making Tax Digital;",
            'does not provide tax, accounting, legal, or financial advice. Information displayed in the Service is not a substitute for professional judgement;',
            "does not verify, correct, or guarantee the accuracy, completeness, or timeliness of information held by HMRC. The Service displays information as provided by HMRC's systems at the time of retrieval;",
            'is not provided, approved, endorsed, or accredited by HMRC. My Tax Diary Ltd is an independent software provider.',
          ]}
        />
      </LegalSection>

      <LegalSection num="4" title="Your Firm's Responsibilities">
        <LegalP>You are responsible for:</LegalP>
        <LegalBullets
          items={[
            'holding and maintaining valid agent authorisations with HMRC for each client whose data you access through the Service, and using the Service only in respect of clients you are lawfully authorised to act for;',
            "the security and proper use of your HMRC credentials and agent services account, and complying with HMRC's terms and conditions applicable to agents;",
            'keeping your account login credentials confidential, and ensuring only authorised members of your firm access the Service;',
            "ensuring you have a lawful basis under UK GDPR to obtain and process your clients' data through the Service, and meeting your own obligations to your clients as data controller;",
            'your professional obligations to your clients, including any advice, filings, or deadlines. Decisions and actions taken in reliance on information shown in the Service remain your responsibility;',
            'providing accurate account and billing information and keeping it up to date;',
            'using the Service lawfully, and not attempting to interfere with, reverse engineer, resell, or misuse the Service or access it other than through the interfaces we provide.',
          ]}
        />
      </LegalSection>

      <LegalSection num="5" title="Our Responsibilities">
        <LegalP>We will:</LegalP>
        <LegalBullets
          items={[
            'provide the Service with reasonable skill and care;',
            "use commercially reasonable efforts to make the Service available, subject to planned maintenance and circumstances outside our control (including the availability of HMRC's APIs);",
            'implement appropriate technical and organisational measures to protect data processed through the Service, as described in our Privacy Policy and DPA;',
            'comply with our obligations under applicable data protection law, including transmitting fraud prevention header data to HMRC as required by the Delivery of Tax Information through Software (Ancillary Metadata) Regulations 2019.',
          ]}
        />
        <LegalP>
          The Service depends on HMRC&apos;s APIs and systems. We are not responsible for the
          availability, accuracy, or performance of HMRC&apos;s systems, for changes HMRC makes to
          its APIs, or for any decision HMRC takes in relation to your firm or your clients.
        </LegalP>
      </LegalSection>

      <LegalSection num="6" title="Fees and Payment">
        <LegalBullets
          items={[
            'Access to the Service is provided on a subscription basis. The applicable fees, billing frequency, and any usage limits are those set out on our pricing page or in your order at the time you subscribe.',
            'Fees are payable in advance by the payment methods we support and are processed by our payment provider, Stripe. You authorise us to charge your chosen payment method on each renewal date until your subscription is cancelled.',
            'Fees are stated exclusive of VAT, which will be added where applicable.',
            'If a payment fails or is overdue, we may suspend access to the Service until payment is received, having given you notice and a reasonable opportunity to pay.',
            "We may change our fees by giving you at least 30 days' notice; changes take effect from your next renewal. If you do not accept a fee change, you may cancel before the renewal takes effect.",
            'Except where required by law or expressly stated otherwise, fees are non-refundable, including for partly used subscription periods.',
          ]}
        />
      </LegalSection>

      <LegalSection num="7" title="Intellectual Property">
        <LegalP>
          We (and our licensors) own all intellectual property rights in the Service, including its
          software, design, and branding. We grant your firm a non-exclusive, non-transferable
          licence to use the Service for your internal business purposes during your subscription.
          Client Data and your firm&apos;s data remain yours; you grant us a licence to process them
          only as needed to provide the Service, as set out in the DPA.
        </LegalP>
      </LegalSection>

      <LegalSection num="8" title="Data Protection">
        <LegalP>
          Each party will comply with applicable data protection law, including UK GDPR and the Data
          Protection Act 2018. Our processing of personal data is described in our{' '}
          <Link href={privacyHref}>Privacy Policy</Link>. Where we process Client Data on your
          behalf, we do so as processor under the DPA, and your firm remains the controller.
        </LegalP>
      </LegalSection>

      <LegalSection num="9" title="Liability">
        <LegalP>
          Nothing in these Terms excludes or limits liability for death or personal injury caused by
          negligence, for fraud or fraudulent misrepresentation, or for any other liability that
          cannot be excluded or limited under the law of England and Wales.
        </LegalP>
        <LegalP>Subject to the paragraph above:</LegalP>
        <LegalBullets
          items={[
            'we will not be liable for any indirect or consequential loss, loss of profits, loss of revenue, loss of business or goodwill, or loss or corruption of data;',
            "we will not be liable for losses arising from inaccurate, incomplete, or delayed information originating from HMRC's systems, from the unavailability of HMRC's APIs, or from your reliance on information displayed in the Service without independent verification;",
            "we will not be liable for losses arising from missed deadlines, penalties, interest, or other consequences relating to your or your clients' tax affairs. Responsibility for meeting filing and payment obligations remains with your firm and your clients;",
            'our total aggregate liability to you arising out of or in connection with the Service in any 12-month period is limited to the fees paid by your firm for the Service in that period.',
          ]}
        />
      </LegalSection>

      <LegalSection num="10" title="Suspension">
        <LegalP>
          We may suspend access to the Service, in whole or in part, where reasonably necessary: for
          maintenance or security; where we reasonably believe your use breaches these Terms or
          applicable law; where required by HMRC or a regulator; or where fees are overdue as
          described in section 6. Where practicable, we will give you notice and an opportunity to
          remedy the issue before suspending.
        </LegalP>
      </LegalSection>

      <LegalSection num="11" title="Term and Termination">
        <LegalBullets
          items={[
            'Your subscription continues for the billing period selected and renews automatically until cancelled.',
            'You may cancel at any time via your account settings or by written notice to us; cancellation takes effect at the end of your current billing period.',
            "We may terminate these Terms on at least 30 days' written notice to the end of your current billing period.",
            'Either party may terminate immediately by written notice if the other commits a material breach of these Terms and (where remediable) fails to remedy it within 30 days of being notified, or becomes insolvent.',
            'On termination: your right to use the Service ends; any fees due remain payable; and Client Data will be deleted or returned within 30 days in accordance with the DPA and our Privacy Policy, unless you request otherwise or we are required by law to retain it.',
          ]}
        />
      </LegalSection>

      <LegalSection num="12" title="Changes to the Service and These Terms">
        <LegalP>
          We may improve or modify the Service, provided the changes do not materially reduce its
          core functionality during your paid subscription period. We may update these Terms from
          time to time; material changes will be notified to you by email or in-app notice at least
          30 days before they take effect. If you do not accept a material change, you may cancel
          before it takes effect.
        </LegalP>
      </LegalSection>

      <LegalSection num="13" title="General">
        <LegalBullets
          items={[
            'Force majeure: neither party is liable for delay or failure caused by events beyond its reasonable control.',
            'Assignment: you may not assign these Terms without our prior written consent; we may assign them to a successor of our business on notice to you.',
            'Entire agreement: these Terms, the Privacy Policy, the DPA, and your order form the entire agreement between the parties in relation to the Service.',
            'Severance: if any provision is found unenforceable, the remainder continues in effect.',
            'Waiver: a failure to enforce a right is not a waiver of it.',
            'Third party rights: no one other than the parties has any right to enforce these Terms.',
            'Notices: notices must be sent in writing to info@mytaxdiary.co.uk (for us) or to the email address on your account (for you).',
          ]}
        />
      </LegalSection>

      <LegalSection num="14" title="Governing Law and Jurisdiction">
        <LegalP>
          These Terms, and any dispute or claim arising out of or in connection with them or the
          Service (including non-contractual disputes or claims), are governed by the law of England
          and Wales, and the courts of England and Wales have exclusive jurisdiction.
        </LegalP>
      </LegalSection>

      <LegalSection num="15" title="Contact Us">
        <LegalP>
          For any questions about these Terms, contact us at{' '}
          <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>.
        </LegalP>
        <LegalP>
          To report a security risk or incident, email{' '}
          <a href="mailto:info@mytaxdiary.co.uk">info@mytaxdiary.co.uk</a>.
        </LegalP>
      </LegalSection>
    </div>
  )
}
