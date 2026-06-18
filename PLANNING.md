# Blue Fox Dubai — Platform Planning Document

*Prepared for the Blue Fox Dubai forex-robot (Expert Advisor) platform. Version 1.0. This document is the architectural source of truth for the build. Legal/compliance notes herein are research-based guidance, NOT legal advice — a UAE-qualified financial-services lawyer must validate the regulatory posture before launch.*

---

## 1. Executive Summary

**What we're building:** A complete, modern, multi-surface platform for **Blue Fox Dubai**, a Dubai/UAE-based company that sells **forex robots** — automated Expert Advisors (EAs) for MetaTrader 4 and MetaTrader 5. The platform spans four surfaces sharing one database and API:

1. **Public marketing website** — conversion-focused, trust-heavy, with verified live performance, transparent pricing, and prominent risk disclaimers.
2. **Client portal** — self-service post-purchase hub: license keys, account binding, robot downloads, invoices, renewals, support, VPS requests.
3. **CRM** — leads, clients, pipeline, communication log, follow-ups.
4. **Admin panel** — products/versions, plans, subscriptions, licenses, billing, refunds, support desk, roles, dashboards, audit log.

**The core value model — selling software, not advice.** Blue Fox sells a *compiled, encrypted bot file* (`.ex4` for MT4, `.ex5` for MT5 — never source `.mq4`/`.mq5`). The customer downloads it, installs it into their own MetaTrader terminal on their own broker account (typically on a 24/5 VPS), and the bot trades autonomously. **We never execute trades, place orders, or touch customer money** — the EA runs entirely client-side on the customer's account. Our role is **software delivery + license lifecycle management.** Keeping this boundary sharp is both an architectural principle and a regulatory risk-reduction strategy.

**The central object is the LICENSE, not the order.** The defining domain mechanic is *license-to-MT4/MT5-account binding with cloud activation and expiry*. Every time a customer's EA runs, it calls our **license-validation API**, which checks the broker account number against an active, unexpired, unrevoked license and returns allow/deny. This single service protects our IP and enables refunds, renewals, transfers, and instant remote deactivation. Everything else is built around it.

**Monetization:** Industry norm is a **one-time "lifetime" license** ($79–$499, avg ~$287, with free updates + support) — this is our primary model. We also support **monthly/annual subscriptions** and **prop-firm / "x1 / x2+VPS" bundle SKUs** from day one, with per-SKU configurable activation rules (number of live + demo accounts, account-vs-machine locking, expiry).

**Trust is the business.** This niche is heavily scrutinized (Forex Peace Army, ForexRobotNation, MQL5 forums). Self-reported screenshots read as scam. The top conversion driver is **independently verified LIVE performance** via embedded MyFXBook / FXBlue widgets (profit, drawdown, broker, time span). We pair this with a **30-day money-back guarantee** (the de-facto industry standard) wired to instant server-side license deactivation.

---

## 2. Recommended Tech Stack

**Decision: a single Next.js (App Router) + TypeScript monorepo, PostgreSQL via Prisma, with a separate, lightweight license-validation service.** This is the default recommendation and it is the right one here. Reasoning per layer:

| Layer | Choice | Why |
|---|---|---|
| **Frontend & SSR/SSG** | **Next.js 15 (App Router) + TypeScript + React** | One framework serves the fast, SEO-optimized public marketing site (Server Components + ISR/SSG for blog/product pages) *and* the data-heavy authenticated dashboards (CRM, admin, portal). A small team maintains one codebase, one deploy. SEO matters a lot for this niche (broker/VPS/setup guides drive organic leads). |
| **UI components** | **shadcn/ui + Tailwind CSS + Radix primitives** | Dark-themed fintech UI is the conventional look for trading products. shadcn gives copy-in, fully-owned components (no lock-in), accessible Radix behavior, and rapid table/form/dialog building for the admin-heavy surfaces. Tailwind keeps a small team productive. |
| **Backend / API** | **Next.js Route Handlers + Server Actions for app logic; a separate, isolated service for license validation** | Co-located API keeps DX high. The **license-validation endpoint is split out** (own deployment, own scaling, own fast cache) because it is high-write, high-availability, latency-sensitive, and must NOT be coupled to or slowed by CRM queries. See §3. |
| **Database** | **PostgreSQL + Prisma ORM** | Relational integrity is essential (License → AccountBinding → ValidationLog, Invoice → Payment → Refund). Prisma gives type-safe queries end-to-end in TypeScript, painless migrations, and a small-team-friendly schema workflow. Put high-write validation logs in their own table/partition. |
| **Validation-log store / cache** | **Redis (or Upstash) for the license cache; Postgres (partitioned) for the audit-grade validation log** | The validation API reads license status from a fast cache that admin actions (revoke/extend) invalidate; raw heartbeat logs append to a partitioned Postgres table so they don't bloat CRM queries. |
| **Auth** | **Auth.js (NextAuth) for portal customers; separate staff auth with mandatory 2FA + RBAC** | Customers: email/password + magic link/OAuth. Staff: enforced 2FA, role-scoped (admin/sales/support/finance). Keep staff and customer auth in distinct realms. |
| **Payments** | **Gateway-abstraction layer** with adapters: launch **Stripe** (or **Checkout.com**) for international cards + one **UAE-local rail** (**Telr** or **Network International N-Genius**) for AED settlement + **manual bank/wire** (admin-reconciled). Fast-follow: **PayPal**, **crypto via NOWPayments** (pending VARA review). | Forex EAs are a high-risk/high-chargeback MCC; some processors restrict the category. A clean abstraction (charge / tokenize / refund / verify-webhook) lets us swap or add gateways without touching business logic. **All state changes are webhook-driven and idempotent.** |
| **File storage / robot delivery** | **S3-compatible object storage (AWS S3 / Cloudflare R2)** with **entitlement-gated, short-lived signed URLs** | `.ex4`/`.ex5` binaries + set files are private objects. Downloads are gated by an active license, logged per download, and served via expiring signed URLs — never public links. R2 has no egress fees, a plus. |
| **Email / notifications** | **Resend (or AWS SES)** for transactional email + a queue for sequences (license key delivery, onboarding, expiry/renewal reminders, dunning). **WhatsApp/Telegram** integration for this niche's preferred channels. | Lifecycle automation is core (see §6). Use React Email templates for consistency. |
| **Hosting** | **Vercel for the Next.js app** (fastest DX, global edge, ISR) **+ a containerized validation service** on a provider with a **UAE/Middle-East-adjacent region** (e.g., AWS me-central-1 Bahrain/UAE, or a VPS in a low-latency region). Postgres on a managed host (Neon / RDS) near the validation service. | Public site benefits from edge/CDN. The validation service should sit close to where customers' VPSes run for low latency and high availability. Decoupling hosting lets each scale independently. |
| **Background jobs** | **A queue (e.g., BullMQ on Redis, or Inngest)** | Dunning, renewal reminders, webhook retries, email sequences, scheduled license-expiry sweeps. |
| **Observability** | **Sentry + uptime monitoring + a public status page** for the validation API | A validation outage stops *all* customers' EAs from trading — this must be monitored aggressively with a status page. |

**Why not a separate marketing-site CMS or a different admin framework?** A small team is best served by *one* TypeScript codebase. Next.js handles both SSG marketing pages and SPA-like dashboards well; adding a second stack (e.g., separate WordPress site + Laravel admin) multiplies maintenance and fractures the data model. We keep the marketing-site content in code/MDX (or a lightweight headless CMS like Sanity *only if* non-technical staff must edit the blog frequently — flagged as an open question).

---

## 3. System Architecture

```
                          ┌──────────────────────────────────────────────┐
                          │                  CUSTOMERS                    │
        ┌─────────────────┤  Web browsers          MT4/MT5 terminals      ├───────────────┐
        │                 │  (marketing, portal)   (running .ex4/.ex5)    │               │
        ▼                 └──────────────────────────────────────────────┘               ▼
┌──────────────────┐                                                          ┌────────────────────────┐
│  NEXT.JS APP      │                                                          │ LICENSE-VALIDATION SVC │
│  (Vercel/edge)    │                                                          │ (isolated, HA, low-lat)│
│                   │                                                          │                        │
│  • Public site    │      ┌──────────────────────────┐                        │  POST /validate        │
│  • Client portal  │◄────►│   APPLICATION API LAYER   │◄──── reads cache ─────►│  {account_no,platform, │
│  • CRM            │      │  (Route Handlers / Server │      (Redis)           │   product_id,key,      │
│  • Admin panel    │      │   Actions, RBAC-guarded)  │                        │   broker} → allow/deny │
└─────────┬─────────┘      └────────────┬─────────────┘                        │  + append heartbeat log│
          │                             │                                      └───────────┬────────────┘
          │                             ▼                                                  │
          │                   ┌───────────────────┐         admin revoke/extend            │
          │                   │   PostgreSQL       │◄────── invalidates cache ──────────────┘
          │                   │   (Prisma)         │
          │                   │  + partitioned     │
          │                   │   validation log   │
          │                   └─────────┬─────────┘
          │                             │
   ┌──────┴──────┐   ┌──────────────────┼───────────────────┬──────────────────┬───────────────┐
   ▼             ▼   ▼                  ▼                   ▼                  ▼               ▼
┌────────┐ ┌─────────────┐ ┌────────────────┐ ┌──────────────────┐ ┌──────────────┐ ┌─────────────────┐
│ Auth   │ │ Object store│ │ Payment gateway │ │ Email / WhatsApp │ │ Job queue    │ │ MyFXBook/FXBlue │
│(Auth.js│ │ S3/R2       │ │ abstraction +   │ │ (Resend/SES +    │ │ (BullMQ/     │ │ embedded       │
│ + 2FA) │ │ signed URLs │ │ webhooks (Stripe│ │ WhatsApp API)    │ │ Inngest)     │ │ widgets (3rd-  │
│        │ │ .ex4/.ex5   │ │ Telr, N-Genius, │ │ lifecycle autom. │ │ dunning,     │ │ party verify)  │
│        │ │             │ │ bank, crypto)   │ │                  │ │ reminders    │ │                │
└────────┘ └─────────────┘ └────────────────┘ └──────────────────┘ └──────────────┘ └─────────────────┘
```

**How the pieces fit:**

- **Public site, client portal, CRM, and admin** are all rendered by the one Next.js app, gated by role. Public pages are mostly static/ISR for speed + SEO; authenticated areas are dynamic and RBAC-protected.
- **Application API layer** (inside Next.js) handles all CRUD, checkout, portal actions, and admin operations against PostgreSQL via Prisma.
- **License-validation service is deliberately separate.** The EA pings it at chart-attach and on a heartbeat interval. It reads license status from a **fast Redis cache** (admin revoke/extend invalidates the cache instantly), returns `valid / expired / revoked / wrong_account / not_found`, and appends to a **high-write partitioned validation log**. It is deployed for **high availability** with an **offline grace window** policy so a transient outage doesn't kill live trades.
- **Payment gateway abstraction** exposes one interface (charge, tokenize, refund, verify-webhook) with per-gateway adapters. **License activation never happens on a client-side redirect** — only after a verified, idempotent gateway webhook reconciles the invoice.
- **Object storage** holds robot binaries + set files; the app issues **short-lived signed download URLs** only to entitled (active-license) customers and logs every download.
- **Email/WhatsApp + job queue** drive the full lifecycle: key delivery on payment, onboarding sequence, expiry/renewal reminders (T-14/T-7/T-1), dunning, update announcements.
- **MyFXBook/FXBlue widgets** are embedded third-party verification components rendered on marketing + product + results pages.

---

## 4. Data Model

Core entities, key fields, and relationships. (Prisma/PostgreSQL.) Sensitive fields (VPS credentials, payment tokens, KYC docs) are **field-level encrypted at rest**.

### Identity & CRM

| Entity | Key fields | Relationships |
|---|---|---|
| **User (staff)** | id, name, email (unique), role (admin/sales/support/finance), permissions[], status, last_login_at, 2fa_enabled | 1—N FollowUpTask (assigned), CommunicationLog, Ticket, AuditLog |
| **Role/Permission** | role, scoped_permissions[] (field-level) | referenced by User |
| **Lead** | id, full_name, email, phone, whatsapp, country, source, status_stage (New→Contacted→Qualified→Demo/Trial→Negotiation→Won/Lost), lead_score, assigned_to (user_id), interested_product_id, notes, last_contacted_at, converted_client_id, created_at | N—1 User; converts to Client |
| **Client/Contact** | id, lead_id, full_name, email (unique), phone, whatsapp, country, company, timezone, kyc_status, tags[], lifetime_value, default_currency, trn (optional), status (active/inactive), created_at | 1—N Subscription, License, Invoice, Ticket, CommunicationLog, AccountBinding (via license) |
| **CommunicationLog** | id, client_id, user_id, channel (email/whatsapp/call/note), direction (in/out), subject, body, attachment_url, occurred_at | N—1 Client, User |
| **FollowUpTask** | id, client_id, assigned_to, type, due_at, status (open/done/overdue), reminder_at, notes | N—1 Client, User |

### Product & Licensing (the core)

| Entity | Key fields | Relationships |
|---|---|---|
| **Product (Robot/EA)** | id, name, slug, description, category, status (active/retired), thumbnail, supported_platform (MT4/MT5/both), supported_pairs, min_deposit, current_version_id, created_at | 1—N ProductVersion, Plan |
| **ProductVersion** | id, product_id, version_no, file_url (.ex4/.ex5), file_hash, changelog, min_terminal_build, supported_platform, broker_compatibility, released_at, is_latest | N—1 Product; referenced by Download |
| **Plan** | id, product_id, name, billing_period (monthly/quarterly/yearly/lifetime), price, currency, max_accounts, live_demo_split, trial_days, grace_days, activation_rules (account-vs-machine lock, pair/balance/backtest restrictions), features[], is_active | N—1 Product; 1—N Subscription |
| **Subscription** | id, client_id, plan_id, status (trial/active/past_due/suspended/expired/cancelled/refunded), start_date, end_date, renewal_mode (auto/manual), next_renewal_at, payment_method_id, coupon_id, created_at | N—1 Client, Plan; 1—1/1—N License |
| **License** | id, subscription_id, client_id, license_key (unique), product_id, status (active/suspended/revoked/expired), max_accounts, activation_quota, used_count, issued_at, expires_at, revoked_reason | N—1 Client, Subscription; 1—N AccountBinding, ValidationLog, Download |
| **AccountBinding** | id, license_id, mt_account_number, platform (MT4/MT5), broker_name, broker_server, machine_id (optional), is_demo, activated_at, last_validated_at, status (active/inactive/swapped) | N—1 License |
| **LicenseValidationLog** | id, license_id, mt_account_number, platform, ip, ea_version, result (valid/expired/revoked/wrong_account/not_found), responded_at | N—1 License *(partitioned, high-write)* |

### Billing

| Entity | Key fields | Relationships |
|---|---|---|
| **Invoice** | id, client_id, subscription_id, invoice_no, status (draft/sent/paid/overdue/refunded/void), currency, subtotal, vat_rate, vat_amount, total, fx_rate_snapshot, trn, issued_at, due_at, pdf_url | N—1 Client, Subscription; 1—N Payment |
| **Payment/Transaction** | id, invoice_id, client_id, gateway (stripe/checkout/telr/ngenius/paytabs/tap/paypal/bank_transfer/crypto), gateway_txn_id, method, amount, currency, status (pending/succeeded/failed/refunded/disputed), risk_flag, paid_at, raw_webhook_json | N—1 Invoice, Client; 1—N Refund |
| **Refund** | id, payment_id, amount, reason, status, processed_by (user_id), processed_at | N—1 Payment, User |
| **PaymentMethod** | id, client_id, gateway, token (card-on-file, encrypted), brand_last4, exp, is_default | N—1 Client |
| **Coupon** | id, code, type (percent/fixed), value, max_redemptions, redeemed_count, valid_from, valid_to, applicable_plan_ids[] | M—N Plan |

### Support & Operations

| Entity | Key fields | Relationships |
|---|---|---|
| **Ticket** | id, client_id, subject, category (general/billing/technical/vps/download), priority, status (open/pending/resolved/closed), assigned_to, sla_due_at, created_at | N—1 Client, User; 1—N TicketMessage |
| **TicketMessage** | id, ticket_id, sender (client/agent), body, attachment_url, sent_at | N—1 Ticket |
| **VPSRequest** | id, client_id, subscription_id, broker_name, mt_account_number, vps_provider, status (requested/in_progress/provisioned/closed), encrypted_credentials, checklist_state, assigned_to, notes | N—1 Client, Subscription |
| **Download** | id, client_id, product_version_id, license_id, downloaded_at, ip | N—1 Client, ProductVersion, License *(entitlement-gated log)* |
| **AuditLog** | id, actor_user_id, action, entity_type, entity_id, before_json, after_json, ip, created_at | *append-only / immutable* |

**Headline relationship to remember:** `Client → Subscription → License → AccountBinding (1..max_accounts)`, with `LicenseValidationLog` recording every EA ping. `max_accounts` is enforced at the binding layer; an explicit **account-swap/transfer flow** (with cooldown + audit entry) lets legitimate broker changes be self-service while `wrong_account` validation hits surface abuse.

---

## 5. Feature Set

### (a) Public Website

- **Home / landing** — value proposition, hero with a **verified live-performance snippet** + 4-metric stat block (profit, drawdown, win rate, time span), primary CTA (*Start free trial* / *Get the robot*), social-proof strip, **persistent site-wide risk-warning banner**.
- **Products / Robots catalog** — filterable grid (name, rating, 4 stats, price, badges, sort/filter), then per-robot **detail pages**: strategy summary, supported pairs/timeframes, MT4/MT5 compatibility, recommended broker/leverage/min capital, risk modes (low/med/high), **embedded MyFXBook/FXBlue live widget**, backtests, FAQ, related robots, buy box.
- **Live Performance / Results** — dedicated page with embedded MyFXBook + FXBlue widgets (equity curve, drawdown, win rate, broker, time span), **demo-vs-live labeling**, links out to source verification accounts.
- **Pricing** — tiers (lifetime vs monthly), exactly what's included (updates, support, # of licensed accounts), **30-day money-back guarantee badge**, multi-currency display, billing FAQ, anchor prices, bundle SKUs (x1 / x2+VPS / prop-firm).
- **Free trial / Demo robot** *(primary lead magnet)* — trial download, demo set files, install + VPS guide, gated behind a short email opt-in.
- **About** — company/team, **Dubai/UAE registration details + physical address**, mission, contact.
- **FAQ** — installation, VPS, supported brokers, license activation, # of accounts, refunds, risk, expectations.
- **Blog / Education (SEO)** — EA explainers, MT4/MT5 setup guides, broker/VPS guides, strategy education, comparison articles; paired with newsletter opt-in.
- **Testimonials / Reviews** — quotes, **video/screen-recordings of the EA running**, links to Trustpilot / Forex Peace Army / MQL5.
- **Contact** — form, email, **WhatsApp/Telegram**, live chat, support hours, address.
- **Account** — Register / Login entry to the portal.
- **Legal pages** — Risk Disclaimer, Terms of Service, Privacy Policy, Refund Policy, Cookie Policy, Earnings/Performance Disclaimer, (optional) Affiliate page.
- **Lead-capture / qualification forms** — email-first, optionally collecting broker/platform/capital/VPS status; exit-intent/incentive offers.
- **UX baseline** — dark-theme fintech UI, mobile-first, fast, sticky CTAs, minimal high-density layout, progressive disclosure, minimal signup fields.

### (b) Client Portal

- **Dashboard** of owned robots with license keys, bound accounts, and **expiry countdown**.
- **License management** — view status/expiry, **self-service MT4/MT5 account binding + swap/transfer** (within `max_accounts`, with cooldown), activation/demo quotas.
- **Download center** — entitlement-gated latest `.ex4`/`.ex5` + set files via signed URLs, version history, changelog.
- **Billing** — invoices/receipts (PDF, VAT/TRN), payment-method management, **one-click renew / upgrade**.
- **Support** — raise/track tickets, knowledge base, install/VPS guides.
- **VPS request** — guided VPS provisioning request with onboarding checklist (install MetaTrader, copy EA, enable AutoTrading).
- **Profile** — contact details, KYC-lite, timezone, currency, notification preferences.

### (c) CRM

- **Leads & pipeline** — kanban (New → Contacted → Qualified → Demo/Trial → Negotiation → Won/Lost), lead source tracking, lead scoring, assignment to sales rep, bulk import, **convert Lead → Client + Subscription**.
- **Client 360 view** — profile, KYC-lite, linked subscriptions/licenses, bound MT4/MT5 accounts, invoice history, ticket history, communication timeline, lifetime value, tags/segments.
- **Communication log & follow-ups** — logged emails/WhatsApp/calls/notes per contact, templated email/WhatsApp, scheduled follow-up tasks with reminders, activity feed, optional inbound capture.
- **Segmentation & tasks** — tag-based segments, follow-up queues, overdue-task surfacing.

### (d) Admin Panel

- **Product/Robot management** — catalog + **version management** (upload `.ex4`/`.ex5`, file hash, changelog, min build, broker compatibility), plan-to-product mapping, marketing assets.
- **Plan & pricing config** — plans (period, price, currency, max_accounts, live/demo split, trial/grace days, activation rules), bundle SKUs, **coupon/promo engine**.
- **Subscription & license management** — license-key generation, **MT4/MT5 account binding + transfer**, activation, expiry tracking, **suspend/revoke/reactivate (kill-switch)**, renewals, trial issuance, grace/dunning automation, **reset activations**, bulk actions.
- **License-validation oversight** — view validation/heartbeat logs, anomaly/abuse detection (one key → many accounts/IPs), remote enable/disable.
- **Billing & payments** — invoice generation (VAT/TRN, multi-currency, FX snapshot), **multi-gateway management**, card-on-file/auto-renew, **refunds & disputes** (wired to instant license deactivation), transaction ledger, **webhook reconciliation**.
- **Support desk** — ticketing (SLA, priority, assignment, canned replies), gated downloads center, **VPS setup workflow** (encrypted broker-credential handoff + provisioning checklist), knowledge base.
- **Users, roles & settings** — user/role/permission management (field-level scoping), gateway & tax config, email/WhatsApp templates, system settings.
- **Dashboards & reporting** — MRR/ARR + one-time revenue, active vs expired licenses, **expiring-soon (30-day) widget**, churn, renewal rate, refund rate, revenue by gateway/plan/country, lead-to-customer conversion, support SLA, activation usage; exportable reports.
- **Audit log** — immutable record of every license issue/revoke/extend, payment, refund, role/permission change, login, config edit.
- *(Phase 3)* **Affiliate/referral program** — attribution + payouts.

---

## 6. Forex-Robot-Specific Mechanics

This is the heart of the system. Architect around the **license** as the central object.

**1. License issuance.** On a *verified* successful payment (gateway webhook, not client redirect), the system auto-generates a **unique license key**, creates the `Subscription` + `License`, sets `max_accounts`, `activation_quota` (e.g., "15 activations: 5 live + 10 demo"), and `expires_at` (or lifetime), then **emails the key** and kicks off the onboarding sequence.

**2. Account binding / activation.** The customer enters their key in the portal (or the EA collects it) and binds it to specific **MT4/MT5 broker account number(s)**. Activation rules are **per-SKU configurable**: account-number locking (most common for direct vendors), optional machine/VPS locking, live+demo split, expiry, and optional pair/timeframe/balance/backtest restrictions. **Unlimited demo accounts** is a near-universal selling point — support it as a configurable rule. After first activation, the account number is saved server-side so reinstalls don't require re-entering the key.

**3. Runtime validation (the critical service).** On **every EA run** (chart-attach + heartbeat interval), the EA pings the **license-validation API** with `{account_number, platform (MT4/MT5), product_id, license_key, broker_name, ea_version, ip}`. The service checks the bound account number against an **active, unexpired, unrevoked** license and returns `valid / expired / revoked / wrong_account / not_found`. If invalid, the EA **stops trading immediately**. Every call appends to `LicenseValidationLog`.

**4. High availability + offline grace.** Because a validation outage would stop *all* customers' live EAs, the service is HA, monitored, fronted by a status page, and the **EA caches a short offline grace window** so a transient blip doesn't kill live trades. This grace policy must be a deliberate, documented decision.

**5. Robot file downloads.** Only **active-license** customers can download, and only the **latest** `.ex4`/`.ex5` + set files for their product/version. Files live in private object storage; downloads use **short-lived signed URLs** and are **logged** (`Download` entity). We **never ship source** (`.mq4`/`.mq5`).

**6. Account transfer / swap.** Legitimate users change brokers, accounts, PCs, or VPSes. The portal offers **self-service transfer within `max_accounts`**, with a **cooldown** and an audit entry; admins can additionally **reset activations** remotely. This is essential — "out of activations" with no self-service is a top forum complaint.

**7. Renewals & expiry (for subscription/expiring SKUs).** Lifecycle states: `trial → active → past_due/grace → suspended → expired → cancelled/refunded`. Renewals are **auto** (card-on-file token) or **manual** (bank/crypto). Automation: **dunning + reminders at T-14 / T-7 / T-1**, a **configurable grace period** during which the EA still validates (`past_due`), then **auto-suspend** flips validation to `expired`. One-click renew in the portal; admin "expiring in 30 days" dashboard.

**8. Refunds (30-day guarantee).** A refund **instantly deactivates the license server-side** (validation flips to `revoked`/`expired`) and triggers the gateway refund — wired together so refunded users lose access immediately. Surfaced prominently as a trust signal.

**9. Admin remote actions.** Create / extend / suspend / deactivate / reset-activations — for refunds, renewals, hardware/VPS changes, and abuse. Backed by a fast cache the validation API reads, so changes take effect immediately, and written to the audit log.

**10. Abuse detection.** Anomaly checks on `LicenseValidationLog` (same key hitting many account numbers / IPs, demo↔live swapping, VPS cloning), `max_accounts` limits, swap cooldowns, and a remote **kill-switch**.

**11. VPS onboarding.** VPS is an integral upsell/operational step (~$10–$30/mo). Offer bundles ("1 month free VPS"), a guided onboarding checklist (install MetaTrader → copy `.ex4`/`.ex5` → enable AutoTrading), and a knowledge base to cut support tickets.

**12. Distribution boundary.** Direct-sale-first (own site + CRM = higher margin, full data, license control). Optionally keep an **MQL5 Market** listing as top-of-funnel — but note MQL5 auto-encrypts per buyer with ~3 machine activations and **buyers can't be migrated to our CRM**, so don't make it the sole channel; reconcile the two licensing schemes in admin.

> **Architectural advice:** if Blue Fox's `.ex4`/`.ex5` doesn't already embed a license wrapper, consider integrating/white-labeling an existing EA-side system (MQL Secure, 4xpip, EAL/Signal Magician) rather than reinventing the MQL5 wrapper — while our server hosts the validation API + CRM.

---

## 7. Trust, Legal & Compliance

> **This section is research-based guidance, NOT legal advice. UAE financial-promotion rules are strict and changing. A UAE-qualified financial-services lawyer MUST validate licensing posture, claims, and all disclaimers before any marketing goes live.**

**Performance reporting (the trust engine).**
- Lead with **independently verified LIVE results** via embedded **MyFXBook + FXBlue** widgets (profit, drawdown, broker, time span) on home, each robot page, and a dedicated Results page. These connect read-only to the broker server so data can't be faked — exactly why customers demand them.
- **Always label demo vs live** and prefer live real-money accounts; demo "verified" results can be manipulated. Link out to source verification accounts for independent checking.
- Show backtests honestly, including **drawdown/risk** (some verified accounts show 40–50% drawdowns). Set expectations to limit refund disputes/chargebacks.

**Required disclaimers (conspicuous + repeated).**
- A **site-wide leveraged-products risk banner/footer**: e.g., *"Forex/CFDs are leveraged products carrying a high degree of risk to your capital; you can lose more than your initial investment."*
- *"Past performance is not an indication of future results"* placed **adjacent to every performance figure**.
- Consider a **quantified honesty statement** about typical retail losses.
- **Earnings/performance disclaimer** on testimonials — never imply typical or expected returns.
- **No prohibited language**: no "guaranteed profit", "risk-free", "get rich", or implied/false "regulated"/"approved" claims (regulators actively warn against and pursue this).

**Required legal pages** (separate, lawyer-reviewed — do **not** copy competitors, many of whom are offshore-incorporated, e.g., Dominica, with different exposure): Risk Disclaimer / Risk Disclosure, Terms of Service, Privacy Policy, Refund Policy, Cookie Policy, Earnings/Performance Disclaimer. The **Refund Policy and Terms must match the advertised 30-day guarantee exactly** or risk chargebacks/disputes.

**UAE regulatory flags (verify with counsel — do not rely on this doc):**
- **SCA → CMA change:** Effective **1 Jan 2026**, the UAE's **Securities & Commodities Authority (SCA) was replaced by the Capital Market Authority (CMA)** (Federal Decree-Laws 32 & 33 of 2025). **All "SCA-regulated" references are outdated** — use CMA, and never claim licensing you don't hold.
- **Marketing/promotion authorization:** Promoting financial products (incl. forex) to UAE residents historically required the SCA **"Category 5" Marketing & Promotions license** (now under the CMA), with substantive requirements (reported ~AED 500,000 paid-up capital, approved compliance officer, promotion manager, fit-and-proper directors). **Confirm whether this applies to an EA *software* seller specifically.**
- **Data protection:** Storing VPS broker credentials and any KYC data triggers **UAE PDPL** (and **GDPR** for EU expat clients). Use field-level encryption, least-privilege access, retention limits, and consent capture.
- **AML/KYC:** Selling financial-adjacent software + collecting customer data triggers AML/KYC considerations — confirm obligations and processor T&C requirements.
- **Crypto payments:** Watch the maturing **Dubai VARA** framework; if enabled, use a regulated processor with instant fiat conversion and lock the FX/crypto rate at invoice time.
- **Tax:** **5% UAE VAT** calculated, shown on invoices with a **TRN field**, and reported; configurable per-country tax rules so non-UAE B2C can be handled correctly; **FX snapshot stored per invoice**.

**Operational compliance principles baked into the system:**
- **Never** execute trades or move customer money on our servers — software delivery + licensing only (also reduces regulatory exposure).
- **Append-only audit log** on every license issue/revoke/extend, payment, refund, role change, config edit — essential given the high-chargeback category and dispute defense.
- Capture strong **KYC-lite data + gateway risk/fraud flags + delivery evidence** for dispute defense.

---

## 8. Phased Build Roadmap

**Principle:** ship the **licensing-and-billing core first** so we have something real to demo quickly; defer full CRM pipeline, multi-gateway, affiliate, and advanced reporting. Avoid an over-built v1 across three surfaces.

### Phase 1 — MVP (the sellable core; build & demo quickly)
*Goal: a customer can buy a robot, get a license, bind an MT4/MT5 account, download the EA, and have it validate at runtime.*
1. **Foundations** — Next.js + TS monorepo, Prisma + PostgreSQL schema, shadcn/Tailwind dark theme, staff + customer auth (RBAC + staff 2FA).
2. **Products + Versions + Plans** — admin catalog, version upload (`.ex4`/`.ex5` to S3/R2), plan/pricing config.
3. **License core** — license-key generation, `Subscription → License → AccountBinding`, account-number locking with configurable rules, expiry.
4. **License-validation service** — separate HA endpoint with Redis cache + partitioned log + offline-grace policy + kill-switch. *(This is the single most important service.)*
5. **Billing (minimal)** — Stripe (or Checkout.com) + **manual bank transfer**, webhook-driven idempotent activation, invoices with **VAT/TRN + multi-currency + FX snapshot**.
6. **Client Portal (core)** — license keys, account binding, **entitlement-gated downloads (signed URLs)**, invoices.
7. **Public site (lean)** — home, robot detail page(s) with **embedded MyFXBook/FXBlue widget**, pricing, free-trial lead capture, **all legal pages + risk banners**.
8. **Lifecycle basics** — auto key-email on payment, onboarding email, **30-day refund → instant deactivation**.
9. **Audit log** + a basic admin dashboard (active vs expired licenses, revenue).

### Phase 2 — Growth (CRM, payments breadth, automation, support)
1. **Full CRM** — leads kanban pipeline, lead scoring/assignment, Client 360, communication log + WhatsApp templates, follow-up tasks, lead→client conversion, bulk import.
2. **Multi-gateway billing** — add UAE-local rail (Telr / N-Genius), **PayPal**, **crypto (NOWPayments)**; card-on-file auto-renew; refunds/disputes workflow; transaction ledger + reconciliation.
3. **Subscription lifecycle automation** — trial/grace states, **dunning + reminders (T-14/T-7/T-1)**, auto-suspend, one-click renew/upgrade, "expiring in 30 days" widget.
4. **Support desk** — ticketing (SLA/priority/canned replies), knowledge base, **VPS setup workflow** (encrypted credentials + checklist).
5. **Account-swap/transfer self-service** (cooldown + audit) + admin reset-activations + abuse anomaly detection.
6. **Coupon/promo engine**, richer marketing site (blog/SEO, testimonials, results page), WhatsApp/Telegram + live chat.

### Phase 3 — Scale (intelligence, programs, polish)
1. **Dashboards & KPIs** — MRR/ARR, churn, renewal/refund rates, revenue by gateway/plan/country, lead-to-customer conversion, support SLA; exportable reports.
2. **Affiliate / referral program** — attribution + payouts.
3. **Advanced reporting & segmentation**, marketing automation, A/B-tested conversion pages, MQL5 Market channel reconciliation.
4. **Localization (Arabic / RTL)** if validated, advanced anti-abuse, performance hardening of the validation service, status page maturity.

---

## 9. Open Questions (decisions needed from the business owner)

**Before Phase 1:**
1. **Monetization mix** — Confirm primary model: lifetime one-time (recommended primary) vs subscription vs both, and the exact starting SKUs/price bands (and currency shown by default).
2. **EA license wrapper** — Does Blue Fox's `.ex4`/`.ex5` *already* contain a license-check that calls a server, or do we need to integrate/white-label one (MQL Secure / 4xpip / EAL/Signal Magician)? This gates the validation-API contract.
3. **Activation rules** — Default `max_accounts`, live/demo split, account-number vs machine locking, and whether unlimited demo is offered.
4. **Primary payment gateway** — Stripe vs Checkout.com for launch, and which **UAE-local rail** (Telr vs Network International N-Genius vs PayTabs vs Tap). Confirm a processor that *accepts the forex-software MCC*. Include manual bank transfer? Crypto later?
5. **Currencies** — Which to support at invoice (AED / USD / EUR), and the default display currency.
6. **Hosting region** — Confirm acceptable hosting/data-residency region for the validation service + DB (UAE/Bahrain me-central vs EU/US), balancing latency to customer VPSes and any PDPL data-residency preference.
7. **Refund guarantee window** — 30 days (recommended) vs 7 days; must match Terms exactly.
8. **Brand & domain** — Logo, color palette (dark fintech), domain(s), company name/registration details + physical Dubai address to display.
9. **Legal counsel** — Engage a UAE financial-services lawyer to confirm CMA (ex-SCA Category 5) applicability to an *EA software* seller and to review all disclaimers/legal pages. **Blocking for go-live marketing.**

**Before/at Phase 2:**
10. **Languages** — English only at launch, or **English + Arabic (RTL)**? Affects component/layout decisions early if Arabic is near-term.
11. **WhatsApp/Telegram** — Which is the primary support/comms channel, and is an official WhatsApp Business API account available?
12. **VPS strategy** — Resell/partner (which provider) vs "1 month free" bundle vs referral-only.
13. **CMS need** — Will non-technical staff edit the blog/marketing copy often enough to justify a headless CMS (Sanity), or is MDX-in-repo sufficient?
14. **MQL5 Market** — Do we list there as a top-of-funnel channel (accepting we can't migrate those buyers to our CRM)?

**Before/at Phase 3:**
15. **Affiliate program** — Commission structure, attribution window, payout method/threshold.
16. **Crypto/VARA** — Final decision on enabling crypto payments pending Dubai VARA posture.
17. **Reporting depth** — Which KPIs are board-level must-haves vs nice-to-have.
