type WatercolorNodeKind = 'topic' | 'institution'

export function WatercolorNodeDefs({ id }: { id: string }) {
  return (
    <filter
      id={id}
      x="-35%"
      y="-35%"
      width="170%"
      height="170%"
      colorInterpolationFilters="sRGB"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.045 0.075"
        numOctaves="2"
        seed="7"
        result="paper-noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="paper-noise"
        scale="0.7"
        xChannelSelector="R"
        yChannelSelector="G"
        result="displaced"
      />
      <feGaussianBlur in="displaced" stdDeviation="0.22" />
    </filter>
  )
}

export function WatercolorNode({
  cx,
  cy,
  radius,
  filterId,
  kind = 'topic',
  selected = false,
  hitRadius,
}: {
  cx: number
  cy: number
  radius: number
  filterId: string
  kind?: WatercolorNodeKind
  selected?: boolean
  hitRadius?: number
}) {
  return (
    <>
      {selected ? (
        <circle
          className="watercolor-node-bloom"
          cx={cx}
          cy={cy}
          r={radius * 1.42}
        />
      ) : null}
      <circle
        className="watercolor-node-wash"
        cx={cx}
        cy={cy}
        r={radius * 1.16}
        filter={`url(#${filterId})`}
      />
      <circle
        className="watercolor-node-body"
        cx={cx}
        cy={cy}
        r={radius}
        filter={`url(#${filterId})`}
      />
      <circle
        className={`watercolor-node-rim is-${kind}`}
        cx={cx}
        cy={cy}
        r={radius * 0.96}
      />
      <circle
        className="watercolor-node-core"
        cx={cx - radius * 0.12}
        cy={cy - radius * 0.1}
        r={Math.max(radius * 0.24, 0.72)}
        filter={`url(#${filterId})`}
      />
      {hitRadius ? (
        <circle
          className="watercolor-node-hit"
          cx={cx}
          cy={cy}
          r={hitRadius}
        />
      ) : null}
    </>
  )
}
