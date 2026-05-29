import { useState } from 'react'
import { useBurger } from './hooks/useBurger'
import BurgerVisual from './components/BurgerVisual'
import SlicePanel from './components/SlicePanel'
import PriceSummary from './components/PriceSummary'
import CheckoutForm from './components/CheckoutForm'
import Cart from './components/Cart'

export default function App() {
  const burger = useBurger()
  const [step, setStep] = useState('builder') // 'builder' | 'checkout' | 'cart' | 'confirmed'
  const [formData, setFormData] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [placing, setPlacing] = useState(false)

  function handleCheckoutSubmit(data) {
    setFormData(data)
    setStep('cart')
  }

  async function placeOrder() {
    setPlacing(true)
    try {
      const payload = {
        customerName: formData.customerName,
        mobile: formData.mobile,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        slices: burger.slices,
        quantity: burger.qty,
        totalPrice: burger.total,
      }
      const base = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${base}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order failed')
      setOrderId(data._id)
      setStep('confirmed')
    } catch (err) {
      alert('Something went wrong: ' + err.message)
    } finally {
      setPlacing(false)
    }
  }

  if (step === 'confirmed') {
    return (
      <div className="confirmed-screen">
        <div className="confirmed-box glass">
          <div className="confirmed-icon">🍔</div>
          <h2>Order Placed!</h2>
          <p>Thanks, <strong>{formData.customerName}</strong>! Your burger is on its way.</p>
          {orderId && <p className="order-id">Order ID: {orderId}</p>}
          <p>Total paid: <strong>₹{burger.total}</strong></p>
          <button
            className="primary-btn"
            onClick={() => {
              burger.clearBurger()
              setFormData(null)
              setStep('builder')
            }}
          >
            Build Another Burger
          </button>
        </div>
      </div>
    )
  }

  if (step === 'cart') {
    return (
      <div className="app">
        <header className="app-header">
          <h1>🍔 <span className="header-text">Burger Maker</span></h1>
        </header>
        <Cart
          slices={burger.slices}
          qty={burger.qty}
          total={burger.total}
          formData={formData}
          onBack={() => setStep('checkout')}
          onPlace={placeOrder}
        />
        {placing && (
          <div className="placing-overlay">
            <div className="placing-spinner">
              <div className="spinner-ring" />
              <p>Placing your order...</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (step === 'checkout') {
    return (
      <div className="app">
        <header className="app-header">
          <h1>🍔 <span className="header-text">Burger Maker</span></h1>
        </header>
        <CheckoutForm
          onSubmit={handleCheckoutSubmit}
          onBack={() => setStep('builder')}
        />
      </div>
    )
  }

  // builder screen
  const canCheckout = burger.slices.length > 2

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍔 <span className="header-text">Burger Maker</span></h1>
        <p className="tagline">Stack it your way</p>
      </header>

      <div className="builder-layout">
        <div className="builder-left">
          <BurgerVisual slices={burger.slices} />
        </div>
        <div className="builder-right">
          <SlicePanel
            slices={burger.slices}
            qty={burger.qty}
            setQty={burger.setQty}
            addSlice={burger.addSlice}
            removeSlice={burger.removeSlice}
            moveSlice={burger.moveSlice}
            reorderSlice={burger.reorderSlice}
          />
          <PriceSummary
            subtotal={burger.subtotal}
            discount={burger.discount}
            surcharge={burger.surcharge}
            platformFee={burger.platformFee}
            total={burger.total}
            splitWarning={burger.splitWarning}
            qty={burger.qty}
          />
          <div className="builder-actions">
            <button className="clear-btn" onClick={burger.clearBurger}>Clear</button>
            <button
              className="primary-btn"
              onClick={() => setStep('checkout')}
              disabled={!canCheckout}
            >
              Checkout →
            </button>
          </div>
          {!canCheckout && <p className="add-hint">Add at least one filling to continue</p>}
        </div>
      </div>
    </div>
  )
}
