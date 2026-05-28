# Burger Maker — Architecture

## Quick Overview

This is a full-stack burger builder app. Users pick their slices, see a live visual
of the burger stacking up, and place an order which gets saved to MongoDB. The React
app lives inside the Node project so the whole thing ships as one unit.

---

## Folder Layout

```
burger_maker/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── BurgerVisual.jsx      # the stacked slice display
│   │   │   ├── SlicePanel.jsx        # add/remove/reorder controls
│   │   │   ├── PriceSummary.jsx      # live price + warnings
│   │   │   ├── CheckoutForm.jsx      # name, address, payment
│   │   │   └── Cart.jsx              # order review before submit
│   │   ├── hooks/
│   │   │   └── useBurger.js          # all burger state logic lives here
│   │   ├── utils/
│   │   │   └── pricing.js            # price calc + conditional rules
│   │   ├── constants.js              # slice definitions, platform fee
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── models/
│   │   └── Order.js                  # Mongoose schema
│   ├── routes/
│   │   └── orders.js                 # POST /api/orders, GET /api/orders
│   └── index.js                      # Express entry point
│
├── package.json                      # root — has "start" script using concurrently
├── .env.example
└── architecture.md
```

---

## How it Runs

Single command from root: `npm start`

This uses `concurrently` to spin up:
- Express on port 5000
- Vite dev server on port 5173 (proxies `/api` to Express)

In production you'd run `npm run build` first, which builds the React app into
`client/dist`, and Express serves those static files directly.

---

## Frontend Design

### State (useBurger hook)

All the burger logic is in one custom hook so components stay clean. The hook
holds:
- `slices` — ordered array of slice objects the user has added
- `quantity` — how many burgers
- `computed price` — recalculated on every slice/qty change

Components just call `addSlice`, `removeSlice`, `moveSlice` from the hook.

### Burger Visualization

`BurgerVisual.jsx` renders the slice stack top-to-bottom. Each slice type gets a
distinct background color and pattern. Bread is always shown at top and bottom
(locked in place visually). The middle slices are what the user controls.

### Pricing Logic (utils/pricing.js)

```
base = sum of each slice's price
conditional adjustments:
  - cheese + paneer both present → subtract 3
  - two aloo tikki in a row → add 2 per consecutive pair
total = (base × quantity) + platform_fee (₹5)
```

The pricing util is pure — takes slices array, returns { subtotal, discount, surcharge, total }.
Makes it easy to test and reason about.

### Validation / Structural Rules

Enforced in the hook before any slice is added:
1. First and last slice must always be bread (auto-added, can't remove if at boundary)
2. Bread can't be added to the middle — the add button for bread is disabled mid-stack
3. Hard cap of 10 slices including the two bread slices (so 8 fillings max)

The ">6 slices" warning is shown in PriceSummary but doesn't block the user.

---

## Backend Design

### Express Server

Minimal setup — just two endpoints:

```
POST /api/orders    — save a new order
GET  /api/orders    — list all orders (useful for debugging/admin)
```

The server also serves the built React app in production mode.

### Order Schema (MongoDB)

```js
{
  customerName: String,
  mobile: String,
  address: String,
  paymentMethod: String,       // 'upi' | 'cash' | 'cod' | 'netbanking'
  slices: [{ name, price }],
  quantity: Number,
  totalPrice: Number,
  placedAt: Date
}
```

Orders are stored in MongoDB Atlas. Connection string comes from `.env`.

---

## Data Flow (placing an order)

```
User fills checkout form
       ↓
CheckoutForm validates inputs (name, 10-digit mobile, address, payment)
       ↓
POST /api/orders with { customerName, mobile, address, paymentMethod, slices, quantity, totalPrice }
       ↓
Express validates + saves to MongoDB
       ↓
Success response → show confirmation screen
```

---

## Things I kept simple on purpose

- No auth. This is a demo app, not a real store.
- No drag-and-drop for reordering — just up/down buttons. Simpler and works fine.
- Platform fee is hardcoded at ₹5. Could be config but no need here.
- No tests. Would add Jest + React Testing Library if this were going to prod.

---

## Env Variables

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/burger_maker
PORT=5000
```
