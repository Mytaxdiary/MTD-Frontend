import Image from 'next/image'
import logoSrc from '@/assets/mtd-logo.jpeg'

type BrandLogoProps = {
  /** Overall width of the lockup. Height scales with the asset aspect ratio. */
  width?: number
  /** Optional height override. Defaults to auto from the asset. */
  height?: number
  priority?: boolean
  style?: React.CSSProperties
}

/**
 * Official My Tax Diary brand lockup (MTD monogram + product name + tagline).
 * Use this anywhere the old NewEffect "NE" mark used to appear.
 */
export default function BrandLogo({
  width = 200,
  height,
  priority = false,
  style,
}: BrandLogoProps) {
  // Source asset is roughly 3.2:1 — keep that ratio unless height is forced.
  const resolvedHeight = height ?? Math.round(width / 3.2)

  return (
    <Image
      src={logoSrc}
      alt="My Tax Diary"
      width={width}
      height={resolvedHeight}
      priority={priority}
      style={{
        display: 'block',
        width,
        height: resolvedHeight,
        objectFit: 'contain',
        ...style,
      }}
    />
  )
}

export { logoSrc }
