export default function PriceSummary({ subtotal, discount, surcharge, platformFee, total, splitWarning, qty }) {
  return (
    <div className="price-summary glass">
      <p className="section-label">Price Breakdown</p>

      {splitWarning && (
        <div className="split-warning">
          <span>👨‍🍳</span>
          Chef suggests splitting this burger into two burgers
        </div>
      )}

      <div className="price-rows">
        <div className="price-row">
          <span>Subtotal (per burger)</span>
          <span>₹{subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="price-row discount">
            <span>Cheese + Paneer combo 🎉</span>
            <span>−₹{discount}</span>
          </div>
        )}

        {surcharge > 0 && (
          <div className="price-row surcharge">
            <span>Double Aloo Tikki charge</span>
            <span>+₹{surcharge}</span>
          </div>
        )}

        <div className="price-row">
          <span>Quantity</span>
          <span>× {qty}</span>
        </div>

        <div className="price-row">
          <span>Platform fee</span>
          <span>₹{platformFee}</span>
        </div>

        <div className="price-row total">
          <span>Total</span>
          <span className="price-val">₹{total}</span>
        </div>
      </div>
    </div>
  )
}
