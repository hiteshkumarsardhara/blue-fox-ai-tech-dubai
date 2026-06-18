# Blue Fox Dubai — Platform Planning Document (v2)

> **Model changed (2026-06-18):** Blue Fox is **not** an EA shop. It is a **managed robot-investment platform** — clients deposit funds, "rent" a forex robot under an 18/24-month contract, and receive a **monthly return (fixed floor + variable upside)** in a wallet they can withdraw from. This v2 supersedes the earlier "sell licences" plan.
>
> ⚠️ **Compliance note (not legal advice):** Pooling client funds and paying monthly returns is a **regulated financial activity** in the UAE (CMA — formerly SCA; possibly Central Bank for deposit-taking; VARA for crypto). "Fixed/guaranteed return" language is high-risk. Blue Fox must obtain proper licensing and engage a UAE fintech lawyer before going live. The platform is built with **KYC/AML, an immutable money ledger, and risk disclaimers** baked in.

---

## 1. Business Model

| Element | Detail |
|---|---|
| **What clients buy** | The *use* of a Blue Fox forex robot (rental), not the software. Robots stay with Blue Fox. |
| **Registration fee** | **$20 one-time**, paid at signup (before depositing). |
| **Contracts** | Per robot, **18 or 24 months**. Capital is committed for the term (per-robot configurable). |
| **Returns** | **Monthly %** per package — a **fixed floor + variable upside** — credited to the client wallet each month. |
| **Deposits** | Crypto (USDT/USDC), bank transfer (manual), or admin-credited. **Admin confirms every deposit.** |
| **Withdrawals** | Crypto, bank, **or cash** (client enters the area/location they want cash in). **Admin approves & fulfils every withdrawal.** |
| **Revenue** | Blue Fox earns the spread between real robot trading profit and the fixed % paid to clients. |

**Client journey:** Register ($20) → KYC → Deposit funds → Choose robot + 18/24-mo term → Funds allocated → Earn monthly % (shown on dashboard) → Withdraw from wallet.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) + **TypeScript** |
| Styling | **Tailwind v4** with brand CSS variables (dark fintech theme) |
| **Animation** | **Framer Motion** — page transitions, scroll reveals, animated counters, micro-interactions |
| **Charts** | Recharts (or visx) — wallet/earnings/portfolio graphs |
| Database | **PostgreSQL + Prisma ORM** |
| Auth | **Auth.js** for clients; separate staff auth + RBAC (admin/finance/support) + 2FA |
| Money | **Immutable double-entry ledger** in Postgres; all balances derived from the ledger |
| Payments | Manual-first (admin-confirmed crypto/bank), gateway abstraction for later automation |
| Files | S3 / Cloudflare R2 (KYC docs, deposit proofs) — private, signed URLs |
| Email/Notif | Resend/SES + WhatsApp/Telegram for deposit/withdrawal/payout alerts |
| Hosting | Vercel (app) + managed Postgres; UAE/ME-adjacent region |

---

## 3. System Architecture

One Next.js app renders three role-gated surfaces — **public website**, **client portal**, **admin panel** — over a shared API + Postgres. The **money ledger** is the backbone: deposits, investments, monthly earnings, fees and withdrawals are all ledger entries; wallet balances are computed from them (never edited directly). Admin actions (confirm deposit, credit monthly return, approve withdrawal) write ledger rows + audit-log rows. KYC docs and deposit proofs live in private object storage. Notifications fire on every money event.

---

## 4. Data Model (core entities)

**Identity & KYC**
- `User` (client) — email, password/OAuth, name, phone, country, **referralCode**, referredById, status, createdAt.
- `KycRecord` — userId, docType, docNumber, fileUrls[], status (pending/approved/rejected), reviewedBy.
- `StaffUser` / `Role` — admin / finance / support, permissions[], 2FA.

**Money core**
- `Wallet` — userId, **availableBalance**, **investedBalance**, **totalEarnings**, **totalDeposited**, **totalWithdrawn**, currency. *(Derived/cached from ledger.)*
- `LedgerEntry` *(immutable)* — userId, type (registration_fee / deposit / investment_hold / earning / withdrawal / fee / bonus / referral_commission / adjustment), amount, direction (credit/debit), balanceAfter, refType, refId, createdAt.
- `Deposit` — userId, amount, currency, method (usdt/usdc/bank/manual), status (pending/confirmed/rejected), txnRef, proofUrl, network/walletAddress, confirmedBy, createdAt, confirmedAt.
- `Withdrawal` — userId, amount, method (crypto/bank/**cash**), destination (crypto address / bank details / **cashArea + contact**), status (pending/approved/processing/paid/rejected), fee, requestedAt, processedBy, processedAt, note.

**Robots & contracts**
- `Robot` (rental product/package) — slug, name, tagline, description, image, riskLevel, **monthlyReturnFloorPct**, **monthlyReturnUpsidePct**, **termOptionsMonths** (e.g. [18,24]), minDeposit, maxDeposit, capacity, status, performance history.
- `Contract` (investment) — userId, robotId, principal, **termMonths** (18/24), monthlyReturnFloorPct/upsidePct (snapshot), status (active/completed/cancelled), startDate, endDate, nextPayoutAt, totalPaidOut.
- `Earning` (monthly payout) — contractId, userId, periodMonth, pct, amount, status (scheduled/credited), creditedAt. *(This is what the dashboard shows each month.)*

**Engagement & ops**
- `Referral` / `Commission` — referrerId, refereeId, level, pct, amount, status.
- `SupportTicket` / `TicketMessage`, `Notification`, `Setting`, `AuditLog` (immutable).

Headline relationship: `User → Wallet`; `User → Deposit/Withdrawal`; `User → Contract(robot, term) → Earning (monthly)`; every money movement → `LedgerEntry` + `AuditLog`.

---

## 5. Money Mechanics

1. **Registration fee** — $20 charged at signup; recorded as a ledger entry; account activates on confirmation.
2. **Deposit** — client submits deposit (crypto/bank) with proof → status `pending` → **admin confirms** → ledger credit → wallet `availableBalance` rises. Manual/admin-credited supported.
3. **Rent a robot (contract)** — client picks robot + term (18/24mo) + amount ≥ minDeposit → funds move from `availableBalance` to `investedBalance` (ledger `investment_hold`) → `Contract` created with `nextPayoutAt`.
4. **Monthly returns** — each period, admin (or scheduled job) **credits earnings** per active contract = principal × monthly % (floor, plus optional variable upside) → `Earning` + ledger credit → appears on the client dashboard; added to `availableBalance`.
5. **Withdrawal** — client requests from `availableBalance`, choosing **crypto / bank / cash** (cash → enters **area/location + contact**) → status `pending` → **admin approves & fulfils** → ledger debit → status `paid`.
6. **Term completion** — at `endDate`, principal is released back to `availableBalance` (or auto-renew, configurable).
7. **Everything is admin-controlled and audited** — deposits confirmed, returns credited, withdrawals approved by staff, each with an audit-log entry.

---

## 6. Feature Set

### 🌐 Public Website
Animated hero · **robot/package showcase** (monthly % range, term, min deposit, risk) · "How it works" (Register $20 → Deposit → Rent → Earn → Withdraw) · live results/performance · why-us / trust · about (Dubai registration) · FAQ · testimonials · register/login · **legal pages** (risk, terms, privacy, refund, AML) · persistent risk banner.

### 👤 Client Portal
Animated **dashboard** (wallet cards + earnings chart + animated counters) · **Deposit** (crypto/bank, upload proof) · **Withdraw** (crypto/bank/cash-by-area) · **Robots** (browse + rent with term) · **My contracts** (principal, term progress, monthly earnings timeline) · **Transactions/ledger** · **Earnings history** · **Referrals** · **KYC** · **Support** · **Profile/security**.

### ⚙️ Admin Panel
**Dashboard/KPIs** (AUM, active contracts, pending deposits/withdrawals, monthly payout liability) · **Robots/packages** CRUD (set monthly %, term options, limits) · **Users & KYC** review · **Deposits** queue (confirm/reject) · **Withdrawals** queue (approve/pay, incl. cash-by-area) · **Monthly returns** run (credit earnings per contract, bulk) · **Contracts** management · **Money ledger** + reporting · **Referrals/commissions** · **Support desk** · **Staff roles** · **Settings** · **Audit log**.

---

## 7. Design & Animation

Dark fintech theme (brand blue + gold on near-black) with a **modern, animated** feel: Framer-Motion scroll reveals, staggered card entrances, animated number count-ups on the dashboard, smooth route transitions, glassmorphism panels, gradient mesh backdrops, hover micro-interactions, and animated charts for wallet/earnings. Fully responsive, mobile-first.

---

## 8. Phased Roadmap

**Phase 1 — Foundation & money core (now)**
1. ✅ Scaffold + theme + design system (done).
2. Rework public website to the rental/returns model + add animations.
3. Prisma schema (users, wallet, ledger, robots, contracts, deposits, withdrawals, earnings, KYC, referrals, audit).
4. Auth (client register w/ $20 fee + staff RBAC).
5. Client portal core: dashboard, deposit, withdraw, rent robot, transactions.
6. Admin core: deposits/withdrawals queues, credit monthly returns, robots CRUD, users/KYC.

**Phase 2 — Automation & growth**
Referral program, notifications (email/WhatsApp), automated monthly payout job, payment-gateway automation, reporting/exports, support desk, KYC automation.

**Phase 3 — Scale & polish**
Advanced dashboards/analytics, 2FA everywhere, Arabic/RTL (if needed), anti-fraud, performance hardening, audit/compliance tooling.

---

## 9. Open Items
- Licensing/legal sign-off (UAE CMA / Central Bank / VARA) — **blocking for go-live**.
- Exact package list: robot names, monthly % (floor/upside), min deposits, capacity.
- Crypto networks (TRC20/ERC20) + receiving wallet addresses; bank details.
- Referral commission structure (if any).
- Currencies displayed (USD primary; AED?), languages (English; +Arabic later?).
- Branding: official logo + colors (user has these — to be supplied).
