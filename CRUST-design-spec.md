# CRUST — Product Design Specification

Custom Pizza Ordering Platform · Oasis Infobyte Web Development Internship, Level 3

This is the locked reference document. Everything downstream (components, schema, endpoints, commits) should trace back to a decision made here — nothing new gets invented mid-build.

---

## 1. Brand

### Positioning

**CRUST — build the pizza you actually want.**

Not a "delivery app clone." CRUST is a build-tool for a specific object (your pizza) that happens to also deliver it. Every screen should feel like it's helping you *construct* something, not just checkout. The kitchen-ticket, stock-of-ingredients, and layered-build language should show up everywhere — in copy as much as in visuals.

### Voice

- **Direct, not cutesy.** "Add pepperoni" not "Why not spice things up? 😋" No exclamation-point food-blog voice.
- **Named by the ticket, not the system.** A status is "In the kitchen," never "processing." An error says what happened and what to do, never "oops!"
- **One job per line.** Labels label, prices state numbers, nothing does double duty.

### Color palette

Avoiding the two default AI palettes (cream-bg/terracotta-accent, and near-black/acid-accent) by grounding the palette in an actual pizzeria at night — charcoal oven brick, a cream dough base, and a true tomato red rather than a muted clay tone.

| Token | Hex | Use |
|---|---|---|
| `charcoal-ember` | `#1E1A17` | App shell background, admin dashboard base |
| `dough-cream` | `#F6EEDF` | Card surfaces, light-mode background, text-on-dark |
| `tomato` | `#E4572E` | Primary CTA, active states, price highlights |
| `basil` | `#456B4E` | Success, "veg," healthy-stock indicators |
| `mozzarella` | `#F2B705` | Warnings, low-stock badges, star ratings |
| `char-grey` | `#4A433C` | Borders, dividers, secondary text on dark |

Rule: tomato is spent on exactly one thing per screen (the primary action). It never becomes a background fill or a decorative accent — that's what keeps it feeling premium instead of like ketchup.

### Typography

| Role | Face | Why |
|---|---|---|
| Display | **Fraunces** (variable, wide optical size range) | A warm, slightly irregular serif — reads wood-fired and handmade rather than corporate-app-generic. Used only for H1/H2 and the hero. |
| Body / UI | **Inter** | Neutral, legible workhorse for everything people actually read and click. |
| Data / tickets | **IBM Plex Mono** | Order numbers, tracking codes, prices in the cart, timestamps. Gives receipts and kitchen tickets a genuine "printed slip" feel — this is the typographic signature, not a generic monospace-for-code choice. |

### Signature element — the Ticket Stub

Every order gets a visual "ticket": a cream card with a dashed perforation edge, the order code and price set in Plex Mono, and a circular rubber-stamp-style status badge. This same component is reused for:
- The cart summary
- The checkout confirmation
- The live order-tracking screen
- The admin's order queue card

Reusing one motif across four different screens (instead of four different card designs) is the throughline that makes the product feel designed rather than assembled from a component library.

### Logo direction

Wordmark only — no icon needed for an internship deliverable. Set **"CRUST"** in Fraunces, all caps, generous letter-spacing, dough-cream on charcoal-ember. Optionally underline with a single tomato rule the width of the text — evokes a scored pizza crust line, not a generic underline.

---

## 2. Complete page map

### Customer

| Route | Purpose | Auth |
|---|---|---|
| `/` | Home — hero, popular pizzas, build-your-own CTA, how it works | Public |
| `/menu` | Browse + filter pizzas | Public |
| `/pizza/:id` | Single pizza detail, "customize this" entry point | Public |
| `/build-your-pizza` | The pizza builder (size → sauce → cheese → toppings) | Public (cart requires login at checkout) |
| `/cart` | Cart review, quantity edit | Public |
| `/checkout` | Address + payment | Customer |
| `/order/:id` | Live order tracking for one order | Customer (owner only) |
| `/orders` | Order history | Customer |
| `/profile` | Account details, saved addresses | Customer |
| `/login`, `/register` | Auth | Public |
| `/forgot-password`, `/reset-password` | Password recovery | Public |
| `/verify-email` | Email verification landing | Public (token-gated) |

### Admin

| Route | Purpose | Auth |
|---|---|---|
| `/admin/login` | Separate admin auth entry point | Public |
| `/admin` | Dashboard — today's orders, revenue, low-stock count | Admin |
| `/admin/orders` | Order queue, filter by status | Admin |
| `/admin/orders/:id` | Single order detail + status control | Admin |
| `/admin/inventory` | Ingredient stock levels, thresholds | Admin |
| `/admin/pizzas` | Pizza + ingredient CRUD | Admin |
| `/admin/customers` | Customer list (read-only) | Admin |
| `/admin/settings` | Delivery fee, tax rate, low-stock thresholds | Admin |

Role check happens server-side on every `/admin/*` API call via JWT claim — the frontend route guard is a UX convenience only, never the actual gate.

---

## 3. UI system

### Tokens

```
Spacing scale (px):     4  8  12  16  24  32  48  64  96
Radius:                 card 20px · button 12px · pill 999px
Shadow (cards on dark): 0 8px 24px rgba(0,0,0,0.35)
Breakpoints:             sm 480 · md 768 · lg 1024 · xl 1280
```

Cards use the large 20px radius deliberately — echoes a pizza box lid, distinct from the tighter 8px radius most SaaS templates default to.

### Core components

- **Button** — `primary` (tomato fill, dough-cream text), `secondary` (char-grey outline), `ghost` (text-only, for admin tables). No more than one `primary` visible per screen.
- **StatusPill** — rounded mono-font badge: `Ordered` / `Kitchen` / `Out for delivery` / `Delivered` / `Cancelled`, each mapped to a fixed color (grey → mozzarella → tomato → basil → char-grey).
- **TicketCard** — the signature component described above; props: code, items, total, status, timestamp.
- **StockBadge** — `Healthy` (basil), `Low stock` (mozzarella), `Critical` (tomato), driven directly by `currentStock` vs `minimumStock`.
- **Toast** — bottom-right, 4s auto-dismiss, one line, active-voice copy ("Added to cart," not "Item added successfully!").
- **EmptyState** — icon + one line + one action. Cart empty → "Nothing here yet" + *Build a pizza* button, not a generic illustration.
- **Skeleton** — used for menu grid and order queue while loading; never a spinner for anything that takes longer than ~400ms.

### State patterns

| State | Rule |
|---|---|
| Loading | Skeleton matching final layout shape, not a centered spinner |
| Empty | One sentence + one clear action, in product voice |
| Error | States what happened + what to do next; never "Something went wrong" alone |
| Out of stock (topping) | Shown, not hidden — struck through with "Currently unavailable," disabled, backend-validated regardless of frontend state |

### The order tracker (numbered sequence — legitimate use of 01/02/03)

This is the one place a numbered/step marker is justified, because the content genuinely is an ordered sequence with real state: Ordered → Kitchen → Out for delivery → Delivered. Rendered vertically as a TicketCard variant with the current step as a filled mozzarella dot, future steps hollow, past steps a basil check. Updates via Socket.IO with no refresh and a brief (200ms) pulse on the newly-filled dot — the one place motion is intentional rather than decorative.

---

## 4. Database schema (MongoDB / Mongoose)

```
User
  name            String
  email           String   (unique, lowercase)
  passwordHash    String
  role            String   enum: 'customer' | 'admin'   default 'customer'
  isEmailVerified Boolean  default false
  addresses       [ { label, street, city, pin, isDefault } ]
  createdAt / updatedAt

Ingredient
  name            String
  unit            String   enum: 'g' | 'kg' | 'ml' | 'unit'
  currentStock    Number
  minimumStock    Number
  maximumStock    Number
  costPerUnit     Number   (optional, for future analytics)
  createdAt / updatedAt

Pizza
  name            String
  description     String
  basePrice       Number
  category        String   enum: 'veg' | 'non-veg'
  image           String   (URL)
  isAvailable     Boolean  default true   (derived/overridden when a required ingredient hits 0)
  defaultRecipe   [ { ingredient: ObjectId ref Ingredient, quantity: Number } ]
  createdAt / updatedAt

  # sizes, sauces, cheeses, toppings are modeled as a separate lightweight collection
  # or an embedded config doc — kept simple:
Option  (one collection, discriminated by `type`)
  type            String   enum: 'size' | 'sauce' | 'cheese' | 'topping'
  name            String
  priceModifier   Number
  ingredientUsage [ { ingredient: ObjectId ref Ingredient, quantity: Number } ]
  isAvailable     Boolean  default true

Cart
  user            ObjectId ref User
  items: [ {
    pizza          ObjectId ref Pizza
    size           ObjectId ref Option
    sauce          ObjectId ref Option
    cheese         ObjectId ref Option
    toppings       [ObjectId ref Option]
    quantity       Number
    unitPrice      Number   (server-calculated, never trusted from client)
  } ]
  updatedAt

Order
  orderCode       String   (e.g. CR-1048, unique)
  user            ObjectId ref User
  items           [ same shape as Cart.items, price-locked at order time ]
  subtotal        Number
  deliveryFee     Number
  tax             Number
  total           Number
  deliveryAddress { street, city, pin }
  paymentStatus   String   enum: 'pending' | 'paid' | 'failed'
  orderStatus     String   enum: 'pending_payment' | 'ordered' | 'kitchen' | 'out_for_delivery' | 'delivered' | 'cancelled'
  razorpayOrderId   String
  razorpayPaymentId String
  statusHistory   [ { status, changedAt } ]
  createdAt / updatedAt

PasswordResetToken
  user            ObjectId ref User
  tokenHash       String
  expiresAt       Date

EmailVerificationToken
  user            ObjectId ref User
  tokenHash       String
  expiresAt       Date

Notification   (internal, admin-facing only)
  type            String   enum: 'low_stock' | 'critical_stock'
  message         String
  ingredient      ObjectId ref Ingredient
  isRead          Boolean  default false
  createdAt
```

### Relationships

```
User ──< Order ──< OrderItem >── Pizza ──< Option >── Ingredient
 │
 └──< Cart
```

Stock deduction on order confirmation walks `Order.items → Option.ingredientUsage (+ Pizza.defaultRecipe) → Ingredient.currentStock`, always server-side, always inside the same transaction that flips `paymentStatus` to `paid`.

---

## 5. API architecture

All routes prefixed `/api`. Auth column: **Public**, **Customer** (valid JWT, any role), **Owner** (JWT + resource belongs to requester), **Admin** (JWT + role: admin).

### Auth

| Method | Path | Auth |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/verify-email` | Public (token) |
| POST | `/auth/forgot-password` | Public |
| POST | `/auth/reset-password` | Public (token) |
| POST | `/admin/auth/login` | Public — separate handler, still checks role before issuing token |

### Pizzas & options

| Method | Path | Auth |
|---|---|---|
| GET | `/pizzas` | Public |
| GET | `/pizzas/:id` | Public |
| GET | `/options?type=size\|sauce\|cheese\|topping` | Public |
| POST | `/pizzas` | Admin |
| PUT | `/pizzas/:id` | Admin |
| DELETE | `/pizzas/:id` | Admin |
| POST / PUT | `/options`, `/options/:id` | Admin |

### Cart

| Method | Path | Auth |
|---|---|---|
| GET | `/cart` | Customer |
| POST | `/cart/items` | Customer |
| PATCH | `/cart/items/:itemId` | Customer |
| DELETE | `/cart/items/:itemId` | Customer |

### Orders

| Method | Path | Auth |
|---|---|---|
| POST | `/orders` | Customer — recalculates every price server-side before creating |
| GET | `/orders` | Customer — own orders only |
| GET | `/orders/:id` | Owner or Admin |
| PATCH | `/orders/:id/status` | Admin — emits `orderStatusUpdated` over Socket.IO |
| GET | `/admin/orders` | Admin — full queue, filterable |

### Payments

| Method | Path | Auth |
|---|---|---|
| POST | `/payments/create-order` | Customer — creates Razorpay test order |
| POST | `/payments/verify` | Customer — verifies signature server-side, only then flips `paymentStatus` |

### Inventory

| Method | Path | Auth |
|---|---|---|
| GET | `/inventory` | Admin |
| PATCH | `/inventory/:id` | Admin — manual stock adjustment |
| GET | `/inventory/alerts` | Admin |

### Socket.IO events

| Event | Direction | Payload |
|---|---|---|
| `orderStatusUpdated` | server → customer room `order:{id}` | `{ orderId, status, changedAt }` |
| `newOrder` | server → admin room | `{ orderCode, total, itemCount }` |
| `lowStockAlert` | server → admin room | `{ ingredientId, name, currentStock, minimumStock }` |

---

## 6. Folder structure

```
client/src/
  components/
    ui/            Button, TicketCard, StatusPill, StockBadge, Toast, EmptyState, Skeleton
    navbar/
    pizza-builder/ SizeStep, SauceStep, CheeseStep, ToppingsStep, PizzaPreview
    cart/
    orders/        OrderTracker
  pages/
    Home, Menu, PizzaBuilder, Cart, Checkout, Orders, OrderDetail, Profile,
    Login, Register, ForgotPassword, ResetPassword, VerifyEmail
  admin/
    Dashboard, Orders, OrderDetail, Inventory, Pizzas, Customers, Settings
  hooks/           useCart, useSocket, useAuth
  services/        api.js (axios instance), socket.js
  store/           Zustand: cartStore, authStore
  utils/           price calculations mirrored for optimistic UI (server is still source of truth)
  App.jsx

server/src/
  config/          db.js, razorpay.js, env.js
  models/          User, Pizza, Option, Ingredient, Cart, Order, PasswordResetToken,
                    EmailVerificationToken, Notification
  controllers/
  routes/
  middleware/      auth.js (JWT), requireRole.js, validate.js, rateLimit.js
  services/        pricingService.js, stockService.js, emailService.js
  sockets/         index.js, orderEvents.js
  jobs/            lowStockCheck.js (node-cron)
  utils/
  server.js
.env.example
```

---

## 7. Development milestones

Each phase below is "done" only when its checklist is met — treat this as the actual project board.

**Phase 1 — Foundation**
- [ ] React + Vite and Express scaffolded, both running locally
- [ ] MongoDB Atlas connected, `.env.example` committed (real `.env` gitignored)
- [ ] Base router + base API client wired end to end (one round-trip "ping" route works)

**Phase 2 — Design skeleton**
- [ ] All customer + admin pages exist as routed components with static content
- [ ] Design tokens (colors, type, spacing) implemented as Tailwind config, not hardcoded per-component

**Phase 3 — Auth**
- [ ] Register → verify email → login → JWT → protected route works end to end
- [ ] Forgot/reset password works end to end
- [ ] Role check enforced server-side on at least one admin route (test with a forged customer token)

**Phase 4 — Products & inventory**
- [ ] Pizza + Option + Ingredient CRUD (admin) working
- [ ] Pizza builder produces a server-verified price, not just a client-side sum
- [ ] Out-of-stock option is disabled in UI **and** rejected by the API if forced

**Phase 5 — Cart & orders**
- [ ] Cart persists per user, quantity edits recalculate totals
- [ ] Order creation locks in prices at order time (changing a Pizza price later doesn't touch past orders)

**Phase 6 — Payments**
- [ ] Razorpay test-mode checkout completes
- [ ] Payment signature verified server-side before `paymentStatus` flips — test the failure path deliberately

**Phase 7 — Admin dashboard**
- [ ] Overview stats (orders, revenue, customers, low-stock count) pull from real aggregation queries
- [ ] Order queue supports status transitions with one click

**Phase 8 — Real-time**
- [ ] Admin status change reflects on the customer's tracking screen with no refresh
- [ ] Reconnect handling: refreshing the tracking page shows current state, not just future events

**Phase 9 — Automation**
- [ ] node-cron job checks stock on a schedule and writes Notification docs
- [ ] Order confirmation deducts ingredient stock inside the same transaction as payment verification

**Phase 10 — Polish**
- [ ] Every async view has a real loading skeleton, empty state, and error state (no bare spinners, no unhandled rejections)
- [ ] Mobile pass at 375px width on every customer page

**Phase 11 — Deployment**
- [ ] Frontend on Vercel, backend on Render/Railway, DB on Atlas, all env vars set in host dashboards (not committed)

**Phase 12 — Submission**
- [ ] README covers overview, features, stack, architecture, schema, API docs, install, screenshots
- [ ] Demo video follows the 12-step walkthrough (home → build → cart → checkout → payment → tracking → admin → status change → live update → inventory → stock deduction)
- [ ] LinkedIn posts at start, mid-build (builder + real-time), and completion
