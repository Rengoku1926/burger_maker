import { useState } from 'react'

const PAYMENT_OPTIONS = [
  { value: 'upi', label: '📲 UPI' },
  { value: 'cash', label: '💵 Cash' },
  { value: 'cod', label: '📦 COD' },
  { value: 'netbanking', label: '🏦 Net Banking' },
]

export default function CheckoutForm({ onSubmit, onBack }) {
  const [form, setForm] = useState({ customerName: '', mobile: '', address: '', paymentMethod: '' })
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!form.customerName.trim()) errs.customerName = 'Name is required'
    if (!/^\d{10}$/.test(form.mobile)) errs.mobile = 'Enter a valid 10-digit number'
    if (!form.address.trim()) errs.address = 'Address is required'
    if (!form.paymentMethod) errs.paymentMethod = 'Pick a payment method'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit(form)
  }

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }))
  }

  return (
    <div className="checkout-form-wrap">
      <div className="form-header">
        <h2>Delivery Details</h2>
        <p>Almost there — just tell us where to send it</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="field">
          <label>Your Name</label>
          <input
            type="text"
            value={form.customerName}
            onChange={e => set('customerName', e.target.value)}
            placeholder="Full name"
          />
          {errors.customerName && <span className="field-error">{errors.customerName}</span>}
        </div>

        <div className="field">
          <label>Mobile Number</label>
          <input
            type="tel"
            value={form.mobile}
            onChange={e => set('mobile', e.target.value)}
            placeholder="10-digit number"
            maxLength={10}
          />
          {errors.mobile && <span className="field-error">{errors.mobile}</span>}
        </div>

        <div className="field">
          <label>Delivery Address</label>
          <textarea
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="House / flat, street, city"
            rows={3}
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="field">
          <label>Payment Method</label>
          <div className="payment-options">
            {PAYMENT_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className={`payment-chip ${form.paymentMethod === opt.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  onChange={() => set('paymentMethod', opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.paymentMethod && <span className="field-error">{errors.paymentMethod}</span>}
        </div>

        <div className="form-actions">
          <button type="button" className="back-btn" onClick={onBack}>← Back</button>
          <button type="submit" className="primary-btn">Review Order →</button>
        </div>
      </form>
    </div>
  )
}
