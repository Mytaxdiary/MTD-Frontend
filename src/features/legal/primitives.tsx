import type { ReactNode } from 'react'

export function LegalSection({
  num,
  title,
  children,
}: {
  num: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="mtd-legal-section">
      <h2>
        <span>{num}.</span>
        {title}
      </h2>
      <div className="mtd-legal-section__body">{children}</div>
    </section>
  )
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p className="mtd-legal-p">{children}</p>
}

export function LegalBullets({ items }: { items: string[] }) {
  return (
    <ul className="mtd-legal-list">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}
