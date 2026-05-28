# Burger Maker — Technical Write-up

## What I built

A burger builder app where you pick your fillings, see the burger stack update live, and place an order. The React frontend lives inside the Node project so the whole thing runs with a single `npm start`.

---

## Tech used

- **Frontend** — React 18 with Vite. No component library, all CSS written by hand.
- **Backend** — Node.js + Express
- **Database** — MongoDB Atlas via Mongoose
- **Other** — `concurrently` to run both servers from one command

---

## How it's structured

```
burger_maker/
├── client/        # React app (Vite)
├── server/
│   ├── models/    # Mongoose schema
│   ├── routes/    # API endpoints
│   └── index.js   # Express entry
└── package.json   # root — runs everything
```

The React app proxies `/api` requests to Express during development. In production you'd run `npm run prod` which builds the React app and serves it as static files from Express.

---

## Features

**Burger builder**
- Add fillings from a list of 6 ingredients (Aloo Tikki, Paneer, Cheese, Tomato, Onion, Lettuce)
- Bread is auto-added at top and bottom — you can't remove it or put it in the middle
- Max 10 slices total
- Drag and drop to reorder fillings in the stack
- Live burger visualization updates as you build

**Pricing**
- Price = (sum of slice prices × quantity) + ₹5 platform fee
- Cheese + Paneer together gives a ₹3 discount
- Two consecutive Aloo Tikki slices add a ₹2 surcharge
- If the burger has more than 6 slices, a warning shows suggesting you split it into two

**Checkout**
- Form collects name, mobile (validated to 10 digits), address, payment method (UPI / Cash / COD / Net Banking)
- Order review screen before final submit
- On confirm, order gets saved to MongoDB and a success screen is shown

---

## How to run

1. Clone the repo
2. Copy `.env.example` to `.env` and add your MongoDB Atlas URI
3. `npm install` from root
4. `npm install` inside `client/`
5. `npm start`

Frontend on `http://localhost:5173`, backend on `http://localhost:8000`.

---

## A few decisions worth mentioning

**All burger logic in one hook** — `useBurger.js` holds all the state (slices, quantity, pricing). Components just call functions from it. Keeps the components clean and the logic easy to follow in one place.

**Pricing as a pure function** — `utils/pricing.js` takes the slices array and returns a breakdown object. No side effects, easy to reason about.

**Drag and drop without a library** — used the native HTML5 drag API. Keeps the bundle small and it works fine for this use case.
