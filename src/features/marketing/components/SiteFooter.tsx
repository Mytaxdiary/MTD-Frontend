import Link from 'next/link'
import BrandLogo from '@/components/ui/BrandLogo'
import SiteContainer from './SiteContainer'
import { SITE_APP_LOGIN, SITE_APP_REGISTER, SITE_NAV } from '../nav'

export default function SiteFooter() {
  return (
    <footer className="mtd-site-footer">
      <SiteContainer>
        <div className="mtd-site-footer__grid">
          <div className="mtd-site-footer__brand">
            <BrandLogo width={160} />
            <p>MTD ITSA software for UK accountants. Agent portal, client portal, HMRC, chase, and staff.</p>
          </div>

          <div className="mtd-site-footer__col">
            <h4>Product</h4>
            {SITE_NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mtd-site-footer__col">
            <h4>Account</h4>
            <Link href={SITE_APP_LOGIN}>Sign in</Link>
            <Link href={SITE_APP_REGISTER}>Get started</Link>
          </div>

          <div className="mtd-site-footer__col">
            <h4>Legal</h4>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy-policy">Privacy</Link>
          </div>
        </div>

        <div className="mtd-site-footer__bottom">
          <span>© {new Date().getFullYear()} My Tax Diary Ltd</span>
          <span>Company No. 17312332 · Preview at /site</span>
        </div>
      </SiteContainer>
    </footer>
  )
}
