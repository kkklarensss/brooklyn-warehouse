# Brooklyn Warehouse Coffee: React and Node.js Rebuild Plan

Prepared: 23 October 2026

## 1. Goal and planning assumptions

Rebuild the capstone as an integrated café management system using React, TypeScript, Vite, and Node.js. Preserve the documented business workflows while improving data integrity, maintainability, reliability, and deployment.

This is an implementation plan, not an audit of the existing code. The supplied PDF establishes the documented requirements; the actual repository, SQL export, router configuration, and payment account have not been inspected. Any proposed behavior beyond the PDF is identified below.

Assumptions: one café branch; one developer; responsive browser applications; PHP currency; Asia/Manila business dates; an online-first deployment; access to the existing system for comparison when implementation begins. Offline POS synchronization, a native mobile app, payroll calculation, delivery dispatch, and multi-branch operations are outside the initial rebuild.

Keep MySQL to limit migration work. Use one modular Node.js application and one database. Start with the complete sales workflow before expanding to the remaining modules. Reuse authorized images, menu content, business rules, and validated data; rebuild application code and review the schema instead of translating Laravel controllers line by line.

## 2. What the document establishes

Source: the uploaded capstone PDF, "Enhancing Customer Experience at Brooklyn Warehouse Coffee through Integrated Wi-Fi Authentication, Responsive Platforms with Smart Engagement (2).pdf."

| Source location, printed page | Documented behavior | Rebuild implication |
| --- | --- | --- |
| pp. 4-11: description, objectives, scope | POS, inventory, online dine-in/pickup ordering, Cash/GCash, VIP/activity reservations, attendance, marketing, roles, dashboard | These are the main feature baseline. |
| pp. 41-42: software architecture; p. 116: implementation | Laravel, Blade/HTML/JavaScript/Tailwind, MySQL, backend chatbot integration | Replace UI and backend layers; preserve valid business behavior and content. |
| pp. 64-76: ERD and data dictionary | Customers, admin users, staff, attendance, reservations, VIP rooms, activities, inventory, POS transactions, sales/items, payments, vouchers, Wi-Fi sessions | Use as a migration map, not a schema to copy unchanged. |
| pp. 80-81: Wi-Fi requirements | Unique staff/admin-issued credentials, limited duration, same-day use | Implement policy in backend and router, using Manila dates. |
| pp. 81-83: functional and nonfunctional requirements | Reservation approval/decline, attendance logs, chatbot, administrator email verification, backups, responsive UI | Include these in acceptance criteria and deployment work. |
| pp. 105-115: test procedures | Stock deduction after sale, stock alerts, customer reservations, predefined chatbot questions and fallback, menu/cart workflows | Convert these scenarios into a regression checklist. |

The PDF mentions loyalty in some development passages, but it does not define a complete loyalty ledger/redemption workflow in its principal scope or data dictionary. Treat loyalty as a later enhancement. Video conferencing is not established as a core module in the reviewed scope. The architecture mentions an AI integration, while the chatbot test cases focus on predefined queries: establish a reliable FAQ baseline and make a generative provider an optional extension.

## 3. Recommended stack

| Layer | Selection | Reason |
| --- | --- | --- |
| Main frontend | React + TypeScript + Vite | Requested stack; reusable components and explicit domain types. |
| Routing | React Router | Public, staff, and administrator layouts. |
| UI | Tailwind CSS + a small accessible component set | Consistent forms, dialogs, tables, and mobile layouts. |
| API data | TanStack Query | Server data fetching, pagination, cache refresh, and retry behavior. Disable blind retries for non-idempotent actions. |
| Forms and validation | React Hook Form + Zod | Shared validation shapes; backend always validates independently. |
| Backend | Node.js 24 LTS + TypeScript + Express 5 | One REST API, with business logic organized by module. |
| Database | Supported MySQL release, InnoDB tables | Retain relational data and enforce transactional updates. |
| Database access | Drizzle ORM + mysql2 | TypeScript schema and query layer with MySQL support. Pin compatible stable packages; review generated SQL migrations. |
| Authentication | Server-side sessions in MySQL; Secure, HttpOnly cookies | Revocable browser sessions; CSRF protection on state-changing requests. |
| Background work | MySQL outbox/jobs table + Node worker | Retry payment reconciliation, router provisioning, notifications, and expiry work. Add a dedicated queue only if needed. |
| Dashboard updates | Periodic query refresh initially | Simple initial delivery; add Server-Sent Events if measured freshness requirements justify it. |
| Tests | Vitest, React Testing Library, Supertest, Playwright | Cover domain rules, real database/API behavior, and critical user journeys. |
| Deployment | Static frontend + persistent Node API/worker + managed MySQL | Separate build artifacts, process lifecycle, backups, and health checks. |

Vite builds the frontend; it does not replace the backend. Build production assets and serve them through a static host or reverse proxy. Pin Node and dependency versions in the repository and commit the lockfile. Official references appear at the end.

## 4. Architecture and repository

Deliver three interfaces:

1. Customer web: menu, cart, checkout, order lookup, reservations, promotions, FAQ/chatbot, and Wi-Fi instructions.
2. Operations web: POS, order queue, inventory, bookings, staff, attendance, vouchers, reports, and settings. Customer and operations interfaces can share one React app initially, with separate route layouts.
3. Captive portal: a small, separately built page for voucher sign-in, remaining access status, and links to allowed café pages. Prefer minimal HTML/CSS/JavaScript for reliability in captive browsers; a full React application is unnecessary here.

All business actions go through the Node API. Browsers do not connect directly to MySQL or the router management interface. The API commits local business records; a worker handles external operations with retries and reconciliation.

| Repository path | Responsibility |
| --- | --- |
| `apps/web/src/features/` | Customer and operations features, pages, components, API hooks. |
| `apps/web/src/components/` | Shared UI components and layouts. |
| `apps/api/src/modules/` | Identity, catalog, orders, payments, inventory, reservations, attendance, Wi-Fi, promotions, reports, support. |
| `apps/api/src/modules/<module>/` | Routes, validation, services, repositories, authorization policies, and tests as needed. |
| `apps/api/src/jobs/` | Worker entry point, outbox handlers, scheduled reconciliation. |
| `apps/api/src/integrations/` | Payment, router, email, and optional chatbot adapters. |
| `apps/portal/` | Lightweight captive portal build. |
| `packages/contracts/` | API DTOs, shared Zod schemas, errors, and status types; no database secrets. |
| `packages/database/` | Drizzle schema, reviewed SQL migrations, seed scripts, connection setup. |
| `docs/` | Requirements matrix, ERD, OpenAPI contract, test checklist, deployment/runbook. |

Use npm workspaces initially. Each module owns its domain rules; integrations depend on adapter interfaces so development can use simulated providers.

## 5. Roles and access

These refined staff roles are proposed; the document broadly distinguishes admins, staff, and customers.

| Actor | Intended permissions |
| --- | --- |
| Guest/customer | Browse public content, order, submit bookings, access only their own order/booking through a secure session or high-entropy lookup token. |
| Cashier | POS, collect/verify permitted payments, receipts, operational order updates, issue eligible vouchers. |
| Barista/service staff | View preparation queue and change allowed fulfillment states. |
| Manager | Catalog, inventory, booking approvals, promotions, attendance review, reports, permitted refunds. |
| Administrator | User/role management, integrations, system settings, audit and operational access. |

Public customer account registration is optional: the document's customer model is largely session-based. Use guest checkout first and collect only necessary booking/contact details. Customer accounts and loyalty can be added later. Verify administrator email, support password reset and logout/revocation, and hash account passwords with an appropriate password-hashing function such as Argon2id.

Enforce permissions and record ownership on every API action. Hidden navigation and frontend route guards only control presentation. Privileged refunds, stock adjustments, booking decisions, voucher changes, attendance corrections, and role changes must create audit events.

## 6. Feature backlog and delivery sequence

| Module | Initial scope | Completion evidence |
| --- | --- | --- |
| Identity and administration | Admin/staff login, email verification/reset, roles, sessions, settings, audit log | Unauthorized API calls fail; staff access matches assigned permissions. |
| Catalog | Categories, menu items, images, prices, availability, optional variants | Customers see published items; old sales retain their original descriptions/prices. |
| POS and orders | Dine-in/pickup, cart, server pricing, cash checkout, receipt, preparation queue, customer lookup | One complete cash sale creates one order, payment, receipt, and stock effect. |
| Inventory | Stock items, units, balances, stock-in, consumption, waste/adjustments, thresholds | Sale deduction happens once; negative stock prevented where policy requires it. |
| Payments | Cash plus explicit manual GCash verification; gateway adapter and sandbox/live integration later | Unverified transfers remain pending; repeated events cannot produce duplicate payments. |
| Reservations | VIP rooms and activities, capacity, duration, schedule, approval/decline/cancel | Concurrent overlapping bookings for an exclusive resource cannot both become confirmed. |
| Wi-Fi | Staff-issued vouchers, same-day expiry, duration, provisioning, login, session logs, revocation | Real router disconnects/blocks expired users; app and router state reconcile. |
| Attendance | Staff records, manager-entered time-in/out, summaries, corrections | Only one open attendance session; corrections have reason and actor. |
| Marketing and support | Scheduled announcements/promotions, FAQ chatbot and fallback | Content shows only within its schedule; chatbot answers approved questions. |
| Dashboard and reports | Sales, payments/refunds, inventory, orders, bookings, attendance, Wi-Fi; basic aggregate page traffic | Totals reconcile to underlying records for the same Manila date range. |

Suggested release boundaries:

- Core release: identity + catalog + POS/online orders + cash/manual verification + basic stock + receipts. Target a fully working workflow by the end of phase 3.
- Full capstone parity: reservations + actual router-backed Wi-Fi + attendance + promotions + support + reporting.
- Enhancements: automated payment-provider integration if onboarding delays it, generative chatbot, loyalty ledger, recipe inventory, cash drawer shifts, richer real-time updates, multi-branch support, offline synchronization.

Recipe inventory is an optional extension, not a prerequisite for basic stock parity. If the café wants coffee sales to consume beans/milk rather than finished-product units, introduce recipes and standard base units before using ingredient-level deduction.

## 7. Database redesign

Keep legacy IDs in a migration mapping or dedicated `legacy_id` fields; do not import legacy ownership assumptions into the new schema.

| Domain | Proposed tables |
| --- | --- |
| Identity | `users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `sessions`, verification/reset tokens |
| Customers | `customers` or guest sessions, optional contact fields and consent records; account link nullable |
| Catalog | `categories`, `products`, optional `product_variants`, product media |
| Sales | `orders`, `order_items`, order status history, receipts |
| Payment | `payments`, `payment_events`, `refunds`, manual verification records |
| Inventory | `stock_items`, `stock_balances`, `stock_movements`, order stock allocations; optional recipes/ingredients |
| Reservations | `resources`, optional activity definitions, `reservations`, reservation history |
| Personnel | `staff_profiles`, `attendance_sessions`, attendance corrections |
| Network | `wifi_vouchers`, `wifi_sessions`, router operation/status records |
| Content/support | `promotions`, `announcements`, FAQ entries; limited support logs if needed |
| Operations | `audit_logs`, `outbox_jobs`, `idempotency_keys`, system settings |

Specific improvements over the PDF data dictionary:

- Separate menu products from stock items. The document links sale items directly to inventory; retain a simple one-to-one stock mapping initially if appropriate, while allowing later recipes.
- Unify POS and online ordering under `orders`, using `channel` and `fulfillment_type`; avoid several competing sales totals. Preserve legacy POS/sales references through import mapping.
- Store immutable order-line snapshots: product description, chosen options, quantity, unit price, discount, and totals. Calculate authoritative prices on the server.
- Use integer centavos for currency and exact decimal quantities for measured stock. Define discount and rounding rules once. Do not calculate money with uncontrolled floating-point arithmetic.
- Make attendance `time_out` and Wi-Fi `ended_at` nullable while sessions remain open. Store server timestamps in UTC; derive business dates in Asia/Manila.
- Add reservation `starts_at`, `ends_at`, status, resource, guest count, and decision history. Replace free-text activity duration with structured minutes.
- Replace voucher `is_used` alone with lifecycle state, expiry, time allowance, used duration, router identifiers, and provisioning status. Do not carry over the `plain_pass` field.
- Do not treat pseudonymous customer IDs as proof the whole database has no personal data: names, staff contacts, bookings, and device/network identifiers need appropriate access and retention.
- Replace blanket admin ownership of every record with explicit actors such as `created_by`, `verified_by`, and audited changes.
- Add unique order/receipt numbers, provider-event IDs, gateway payment IDs, and stock source-effect keys. Index order dates/status, booking resource/time, stock item/date, and voucher/session lookups.
- Archive products and deactivate staff accounts instead of deleting records needed for historical transactions.

## 8. Critical workflows and invariants

### Orders, stock, and payments

Maintain separate order, payment, and fulfillment statuses. An unpaid order is not a completed sale. Proposed fulfillment flow: submitted, accepted, preparing, ready, completed; cancellation is allowed only through defined transitions.

1. Customer/cashier submits product IDs, options, quantities, fulfillment details, and an idempotency key.
2. Backend validates availability, calculates prices, and creates the order. Reserve stock for accepted pending orders with a configurable hold expiry; a paid counter order can reserve and consume immediately.
3. Cashier records cash receipt or verifies an actual GCash transfer. A typed reference number or uploaded screenshot alone does not confirm payment.
4. In one local database transaction, commit the permitted payment transition, consume reserved stock, allocate a receipt number, and enqueue downstream work. Enforce unique source-effect keys.
5. Worker performs notifications and optional voucher provisioning after commit. Retry external failures without recreating the payment or sale.

For gateway payments, create the provider checkout after committing a pending payment attempt. Verify webhook authenticity using the provider's current rules; persist the unique event before processing. Validate order mapping, amount, currency, and permitted state transition. Reconcile unresolved attempts through server-side provider lookup. A successful browser redirect is only a user-interface signal.

If payment succeeds after stock hold expiry or cancellation, record the real payment and route it to an explicit resolution/refund workflow rather than silently fulfilling or discarding it. Refunds and restocking are separate decisions: prepared food need not return to stock. Keep history and compensating stock movements.

### Reservations

Baseline: a pending request does not guarantee availability. Confirm only after the manager's decision. Represent bookings as half-open intervals: `[start, end)` so back-to-back bookings can be permitted. For an exclusive resource, lock its resource row within a transaction, check existing confirmed/active overlaps, and insert/confirm through that same path. Every creation, approval, and reschedule must use it. Return a conflict response if unavailable.

Set capacity, opening hours, booking duration, cancellation rules, and any buffer time in settings. Proposed first release has no online reservation deposits; if deposits are required, add expiring holds and payment reconciliation as separate work. Attendance summaries do not calculate payroll.

### Wi-Fi

Baseline: staff/admin-issued unique credentials, same Manila day, limited duration. The reviewed requirements do not define an automatic purchase threshold or payment gate. An optional proposed policy is one voucher per eligible paid order; confirm this with the café during phase 1. Do not silently turn this proposal into an original requirement.

Generate secrets with Node cryptographic randomness, enforce a uniqueness constraint, rate-limit attempts, and avoid logging credentials. CSPRNG means secure random generation; it does not encrypt Wi-Fi traffic. HTTPS protects web traffic; the access point/router's supported security settings govern the wireless/network layers.

Use a router adapter with simulated and MikroTik implementations. For a first deployment, provision local HotSpot users through a private management connection and enforce duration/expiry there. Prove the chosen credential/login method on the actual RouterOS version during phase 1. Keep application login separate from network access.

Prefer backend voucher verification using a keyed verifier and short-lived router credentials. If the selected HotSpot protocol requires retrievable credential material, encrypt it using a managed key, restrict access, and remove it after provisioning/expiry as the protocol permits. Do not assume a one-way hash can support every router login protocol. Printed credentials should be revealed once; an admin can revoke/reissue them.

Same-day policy default: expire at the next Manila midnight. Proposed duration default: elapsed time from first successful activation, bounded by that midnight expiry. If the café requires cumulative connected minutes across reconnects instead, that is a policy change requiring authoritative router accounting. Model it explicitly before implementation.

The router enforces access. The browser timer is informational. Reconnects must not reset entitlement; duplicate activation requests must not allocate duplicate sessions. Reconcile provisioning, active sessions, disconnects, and revocations; expose pending/error states in operations UI. Test IPv4 and ensure IPv6 cannot bypass the access policy for the selected network configuration.

Allow the necessary café frontend/API/assets through the HotSpot walled garden before authentication. Keep payment checkout in a full browser and verify required domains experimentally; do not broadly whitelist internet access. Place the router management path behind a VPN or a café-side connector with authenticated outbound communication. Do not expose management ports publicly. An API-only mock is useful for development but is not proof of real network enforcement.

## 9. API and user interface plan

Use versioned JSON endpoints under `/api/v1`, consistent error codes, pagination, and an OpenAPI contract. Proposed examples:

| Endpoint group | Representative actions |
| --- | --- |
| `/auth` | Login/logout, current user, email verification, password reset |
| `/catalog` | Public menu and authorized catalog administration |
| `/orders` | Create, secure lookup/list, authorized status transitions, receipt |
| `/payments` | Cash collection, manual verification, provider checkout, refund request |
| `/webhooks/payments` | Authenticated provider events; excluded from session CSRF mechanism |
| `/inventory` | Balances, stock-in, adjustments, movement history |
| `/resources`, `/reservations` | Availability, request, approve/decline, reschedule/cancel |
| `/staff`, `/attendance` | Staff administration, time-in/out, audited corrections |
| `/wifi` | Issue/provision/redeem/revoke, session status and reconciliation |
| `/content`, `/support` | Promotions, announcements, approved FAQ/chatbot responses |
| `/reports` | Sales/refunds, payment reconciliation, stock, bookings, attendance, Wi-Fi |

Customer pages: home/promotions, menu, cart/checkout, order status/receipt, VIP/activity browsing, booking form/result, Wi-Fi help, FAQ. Operations pages: dashboard, POS, preparation queue, inventory/movements, reservations/calendar, staff/attendance, voucher/session management, reports, content, user/settings administration.

Design responsive loading, empty, validation, access-denied, conflict, offline/error, and retry states. POS should support keyboard use and receipt reprinting. Customer URLs must not expose other customers' records through sequential IDs. Show pending payment and pending Wi-Fi provisioning clearly.

## 10. Phased schedule

Planning estimate for one developer with 25-30 focused hours/week. This is an estimate, not a delivery commitment; repository complexity, hardware access, data condition, and payment onboarding can change it.

| Phase | Indicative weeks | Main work | Exit gate |
| --- | --- | --- | --- |
| 1. Validate and prototype | 1-2 | Requirements matrix, actual-code/schema inventory, screens, ERD, permission rules; early router login and payment sandbox feasibility | Policies documented; router protocol proven or integration blocker named; payment route selected. |
| 2. Foundation and catalog | 3-5 | Workspaces, CI, migrations/seeds, auth/email verification, authorization, catalog, UI layouts, API contract, job infrastructure | Admin manages a menu; public customer sees it; protected API tests pass. |
| 3. Core sales workflow | 6-8 | POS, online cart, order queue, cash/manual GCash, receipt, stock reservation/consumption, basic reports | Complete sale and cancellation/refund scenarios reconcile; concurrency and retry checks pass. |
| 4. Reservations | 9-10 | VIP/activity resources, customer requests, manager decisions, overlap/capacity rules | Concurrent approval and rescheduling cannot double-book an exclusive resource. |
| 5. Payments and Wi-Fi | 11-13 | Gateway sandbox integration where available, webhook reconciliation, actual MikroTik provisioning, portal, expiry/revocation/accounting | Payment events process once; router access expires correctly across reconnect/restarts. |
| 6. Operations and engagement | 14-15 | Attendance, promotions, FAQ chatbot, consolidated reports, aggregate traffic metrics | Attendance rules hold and dashboard totals reconcile; marketing schedules work. |
| 7. Migration and pilot | 16-18 | Import rehearsal, security/recovery checks, full regression/UAT, staff training, deployment, monitored café pilot | Signed-off workflows, verified restore, reconciled data, runbook, and rollback rehearsal. |
| Contingency | Up to 4 extra weeks | Hardware/provider delays, migration cleanup, UAT corrections | Material unresolved issues closed or explicitly scoped out. |

At lower weekly availability, plan by effort rather than keeping these calendar dates. Do not postpone the hardware feasibility check until phase 5. If automated payments are blocked by merchant onboarding, retain explicit manual verification and mark automation as unfinished.

## 11. Verification and acceptance targets

These are proposed measurable targets, not results already achieved.

- Core flow: menu to cash checkout to receipt to exact stock effect works for both POS and online orders.
- Concurrency: two buyers competing for the last stock unit cannot both consume it; retries cannot duplicate a payment, receipt, stock effect, or voucher.
- Booking integrity: overlapping exclusive-resource confirmations fail even when approved simultaneously.
- Payment integrity: invalid signatures, wrong amounts/currency, duplicate events, late events, provider timeouts, and refunds produce explicit recoverable states.
- Network behavior: voucher same-day expiry, duration, reuse, reconnect, router restart, disconnect, revocation, and unavailable-router behavior pass on physical equipment. Simulated tests are labeled separately.
- Attendance: no second time-in while already clocked in; overnight sessions and corrections report on the intended Manila business dates.
- Access: customers cannot read other orders/bookings; staff cannot exceed permissions; session revocation and CSRF defenses work.
- Reporting: sales, payments, and refunds have separately defined totals and reconcile; active Wi-Fi users come from reconciled router sessions, not issued-voucher counts.
- Performance target: p95 server response below 500 ms for ordinary local CRUD under a 30-concurrent-user pilot workload, excluding external providers. Validate on the chosen hosting/data size before accepting it. Set a separate end-user performance target after the first deployed baseline.
- Compatibility: main workflows work on current Chrome, Edge, Firefox, and mobile browsers; captive portal tested separately on Android, iOS, and Windows where available.
- Recovery target: daily automated backup, proposed maximum 24-hour data loss and four-hour service recovery; prove a restore into an isolated environment. Tighten the targets if business needs or hosting capabilities require it.

Use domain unit tests for status/pricing/expiry rules, integration tests against MySQL for constraints and transactions, Playwright for critical journeys, and a hardware checklist for Wi-Fi. CI runs type checking, linting, relevant tests, migration validation, and production builds. Avoid treating UI snapshots as evidence of financial or network correctness.

## 12. Deployment, migration, and rollout

Recommended topology: one HTTPS origin reverse-proxies `/api` to Node and serves the built web app. Run the worker as a separate managed process from the same backend codebase. Use managed MySQL and persistent media storage; keep connection pools small and documented. Host the lightweight portal where the router integration requires it, with its assets reachable before authentication.

Keep provider keys, database credentials, encryption keys, and router credentials server-side. Frontend environment variables are public after build. Apply request-size limits, validated uploads, rate limits, structured redacted logs, security headers, and least-privilege credentials. Provide liveness/readiness checks, error monitoring, worker heartbeat, failed-job alerts, and alerts for payment/router reconciliation failures.

Online-first means an internet or host outage may prevent POS writes. Provide a documented manual fallback and recovery/reconciliation procedure; a cached UI alone is not offline POS support. Building reliable local-first/offline operation is a separate project increment.

Migration sequence:

1. Back up source database and authorized assets. Inventory actual tables and compare them to the thesis dictionary.
2. Create a mapping for legacy admin/staff, customers, products/inventory, sales/items, payments, reservations, attendance, vouchers, and sessions. Decide whether historic data needs import or read-only archival.
3. Clean duplicate identifiers and inconsistent statuses. Check contact data, timestamps, stock units, payment references, and orphaned relations. Verify legacy timezone meaning before converting it.
4. Import into staging with deterministic mapping and reconciliation reports. Preserve original historical values; do not recompute old transactions using current prices.
5. Prefer reissuing active vouchers at cutover; importing plaintext legacy secrets is unnecessary. Force password reset where hash compatibility cannot be demonstrated.
6. Compare row counts plus sales/payment/refund totals, opening stock and movements, future bookings, and active attendance sessions. Rehearse a restore and a full cutover.
7. Pilot with test data, then controlled café use. At live cutover, stop old-system writes, import the final delta, reconcile, switch traffic, and monitor.
8. Roll back traffic only with a plan for transactions created after cutover. Preserve and reconcile new payments/orders; restoring an old backup alone can lose valid business transactions.

Use the PDF's quality areas as a UAT checklist. Privacy notices, data minimization, role access, retention, export/deletion handling, and provider agreements are design work; no framework switch by itself establishes legal compliance. Assess the café's applicable obligations with its responsible owner during rollout.

## 13. First implementation tasks

1. Create a requirement-to-screen/API/test matrix from the source pages listed above.
2. Obtain the authorized Laravel repository, SQL export, current menu/stock samples, and anonymized transaction examples.
3. Confirm staff roles, ordering flow, stock model, booking durations, and same-day Wi-Fi rules. Decide whether Wi-Fi eligibility requires an order and which payment state qualifies.
4. Prove router login/provisioning/expiry on actual hardware and confirm private backend connectivity.
5. Select manual GCash verification and/or an approved gateway; confirm merchant credentials and sandbox access.
6. Draft the ERD, order/payment/booking/voucher state rules, and OpenAPI contract.
7. Create workspaces, migrations, seeds, and the shared error/validation contracts.
8. Implement authentication and a menu CRUD feature end to end.
9. Deliver one vertical slice: customer places an order, cashier records cash, stock updates once, and a receipt appears.
10. Expand only after that flow passes its integrity and permission checks.

## 14. Official technical references

Checked on 23 October 2026. Verify versions again when implementation starts.

- Vite getting started and React/TypeScript templates: https://vite.dev/guide/
- Node release support; use a supported LTS branch: https://nodejs.org/en/about/previous-releases
- Express production security guidance: https://expressjs.com/en/advanced/best-practice-security/
- Drizzle MySQL and mysql2 integration: https://orm.drizzle.team/docs/mysql/get-started-mysql
- Drizzle transaction concepts: https://orm.drizzle.team/docs/transactions
- Node cryptographic randomness: https://nodejs.org/api/crypto.html
- MikroTik HotSpot authentication, accounting, and walled garden: https://help.mikrotik.com/docs/spaces/ROS/pages/56459266/HotSpot+-+Captive+portal (the page links to the newer documentation site; confirm settings for the target RouterOS release).
- Example payment-provider webhook behavior and recovery: https://docs.paymongo.com/reference/webhook-resource. PayMongo is an example integration candidate, not a confirmed provider for this café.

All architecture choices, schedule estimates, added roles, proposed targets, and workflow refinements in this plan are recommendations. Existing behavior must be validated against the running application and café policies during phase 1.
