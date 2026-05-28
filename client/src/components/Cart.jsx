import BurgerVisual from './BurgerVisual'

export default function Cart({ slices, qty, total, formData, onBack, onPlace }) {
  return (
    <div className="cart-wrap">
      <div className="cart-header">
        <h2>Review Your Order</h2>
        <p>Looks good? Place the order and we'll get cooking.</p>
      </div>

      <div className="cart-layout">
        <div>
          <BurgerVisual slices={slices} />
        </div>

        <div className="cart-details-card glass">
          <ul className="cart-slice-list">
            {slices.map((s, i) => (
              <li key={i} className="cart-slice-item">
                <span className="slice-color-dot" style={{ background: s.color }} />
                {s.name}
                {s.price > 0 && <span className="slice-price">₹{s.price}</span>}
              </li>
            ))}
          </ul>

          <div className="cart-meta-row">
            <div className="meta-item">
              <span className="meta-label">Quantity</span>
              <span className="meta-value">{qty} burger{qty > 1 ? 's' : ''}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Payment</span>
              <span className="meta-value">{formData.paymentMethod.toUpperCase()}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Deliver to</span>
              <span className="meta-value">{formData.customerName} · {formData.mobile}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Address</span>
              <span className="meta-value">{formData.address}</span>
            </div>
          </div>

          <div className="cart-total-row">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="cart-actions">
            <button className="back-btn" onClick={onBack}>← Edit</button>
            <button className="primary-btn" onClick={onPlace}>Place Order 🍔</button>
          </div>
        </div>
      </div>
    </div>
  )
}
