# Customer and admin frontend previews

## Implemented

- Responsive customer home page and reusable header/footer.
- Routes: `/`, `/menu`, `/reservations`, `/wifi`, `/help`, and a catch-all page.
- Searchable menu with category filters, hot/iced options, and illustrated demo products.
- Accessible native-dialog cart with item variants, quantity limits, removal, totals in integer centavos, and dine-in/pickup selection.
- Browser-local cart persistence with validation of restored data. Storage failures fall back to memory.
- Order summary preview with an explicit not-submitted notice.
- Reservation form with native field validation, future-time validation in Asia/Manila, and local summary.
- Informational Wi-Fi page and expandable FAQ answers.
- Shared domain contracts, an API health endpoint, workspace scripts, and GitHub CI configuration.

## Frontend folders

```text
apps/web/src/
├── modules/
│   ├── admin/
│   │   ├── AdminApp.tsx
│   │   ├── components/
│   │   ├── layouts/
│   │   └── pages/
│   └── public/
│       ├── PublicApp.tsx
│       ├── components/
│       ├── features/
│       │   ├── cart/
│       │   └── reservations/
│       ├── layouts/
│       ├── pages/
│       └── services/
├── shared/
│   ├── data/
│   └── lib/
├── App.tsx
├── index.css
└── main.tsx
```

Each module owns its pages, layout, components, and route declarations. The admin module also holds its demo state, reporting helpers, tests, and stylesheet. Shared menu fixtures and formatting/date helpers live in `shared`, so neither module imports from the other. `App.tsx` composes the public and admin routers, page effects, and app providers; the customer cart provider keeps its existing lifetime across navigation. Global styles and the entry point remain at the source root. Public URLs and `/admin/*` URLs are unchanged.

## Admin workspace

Open `/admin` directly or follow the **Admin demo workspace** link in the customer footer. The admin area has its own sidebar, mobile navigation, page titles, and not-found page. Its JavaScript and CSS load separately from the customer interface.

| Page               | Route                 | Demo interactions                                                                            |
| ------------------ | --------------------- | -------------------------------------------------------------------------------------------- |
| Overview           | `/admin`              | Shared sales, queue, reservation, staffing, and stock summaries                              |
| Orders             | `/admin/orders`       | Search, status filters, prepare, ready, complete, cancel                                     |
| Point of sale      | `/admin/pos`          | Search/category filter, hot/iced variants, quantities, guest, fulfillment, create demo order |
| Menu               | `/admin/menu`         | Search, edit PHP price, toggle availability for the admin POS                                |
| Inventory          | `/admin/inventory`    | Search, low-stock filter, stock-in quantities, movement history                              |
| Reservations       | `/admin/reservations` | Search, filters, approve/decline, reject overlapping approvals                               |
| Staff & attendance | `/admin/staff`        | Directory search, demo clock-in/out, on-shift count                                          |
| Wi-Fi vouchers     | `/admin/wifi`         | Issue sample codes, select duration, filter, revoke                                          |
| Reports            | `/admin/reports`      | Completed-sales totals, hourly chart, top products, fulfillment breakdown, CSV export        |
| Content            | `/admin/content`      | Create announcement drafts and toggle demo publication status                                |
| Settings           | `/admin/settings`     | Session preferences, checklist reminder, reset sample data                                   |

State is shared across admin pages and resets on refresh or when leaving the admin area. POS orders appear in the queue; completed orders feed the dashboard and reports. Prices are stored with each order so subsequent catalog edits do not rewrite historical totals. Sales figures use completed demo orders only; completion does not verify payment. Inventory is independent and is not automatically consumed by orders.

Sample reservation dates use the Manila date at workspace initialization. The sample order book represents a demonstration business day, not live transactions. Chart captions identify the displayed hourly window. Sample vouchers are issued records, not active router sessions. Admin catalog/content edits do not update the customer website. The settings contact email is a placeholder; no messages are sent.

## Design foundation

Warm cream, espresso, muted olive, and terracotta; editorial serif headlines with readable sans-serif interface text. Brand mark and menu/room illustrations are new code-native artwork for this preview, not verified café brand assets. Tailwind is configured alongside semantic CSS and design tokens in `apps/web/src/index.css`.

## Demonstration limits

All menu items, prices, room capacity, and durations are illustrative. The café address comes from the supplied capstone and should be verified before a real launch. No claim is made about current operating hours. The hero is a generic stock photograph, not a photograph of Brooklyn Warehouse Coffee.

This milestone has no authentication, authorization, live availability, real order submission, email delivery, database, payment collection, or router access. The admin workspace is openly accessible demo UI, not a protected staff system. The API serves only `/api/v1/health`. The help page is a static FAQ; it is not an AI chatbot.

Only cart item IDs, temperatures, and quantities are stored in local storage. Reservation data is held in component memory and is not transmitted or persisted. Use test information in the form. Frontend prices are for previews only; authoritative prices must be calculated in the backend.

## Integration order

1. Replace `menuService` with an asynchronous, validated API adapter; introduce query loading/error states and TanStack Query when server data arrives.
2. Define the authoritative order schema and submission/payment status contract before enabling checkout.
3. Connect booking availability and staff approval; retain the distinction between a submitted request and a confirmed booking.
4. Connect the admin layout to authentication, permission checks, and authoritative management APIs.
5. Connect actual voucher provisioning/login through a private router adapter.

React Hook Form and shared Zod request validation will be introduced alongside the final request schemas; this initial form uses browser validation plus a tested schedule rule. Do not treat client-side checks as API security.

## Image attribution

The generic pour-over photograph is sourced from Unsplash and saved locally so runtime rendering does not depend on a third-party image host:

https://images.unsplash.com/photo-1442512595331-e89e73853f31

Menu SVG illustrations, room artwork, and the temporary brand/favicon were created for this project. Replace sample content and verify permissions for actual café branding before public launch.

## Next frontend work

Connect the admin demos to authenticated APIs, add authoritative payment and inventory workflows, and build customer order-status screens. Customer requests and admin decisions should share backend records rather than independent demonstration data.
