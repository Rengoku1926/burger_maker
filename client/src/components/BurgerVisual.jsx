export default function BurgerVisual({ slices }) {
  const hasFillings = slices.length > 2

  return (
    <div className="burger-visual glass">
      <p className="burger-visual-title">Your Burger</p>

      {!hasFillings && (
        <div className="burger-empty">
          <span className="burger-empty-icon">🍔</span>
          <span>Add some fillings to get started</span>
        </div>
      )}

      {slices.map((slice, i) => {
        const isBread = slice.name === 'Bread'
        return (
          <div
            key={i}
            className={`burger-layer ${isBread ? 'bread-layer' : ''}`}
            style={{
              backgroundColor: slice.color,
              boxShadow: `0 3px 12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)`,
            }}
          >
            <div className="layer-shine" />
            <span className="layer-label">{slice.name}</span>
          </div>
        )
      })}
    </div>
  )
}
