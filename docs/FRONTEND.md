# Frontend milestone 1

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

## Design foundation

Warm cream, espresso, muted olive, and terracotta; editorial serif headlines with readable sans-serif interface text. Brand mark and menu/room illustrations are new code-native artwork for this preview, not verified café brand assets. Tailwind is configured alongside semantic CSS and design tokens in `apps/web/src/index.css`.

## Demonstration limits

All menu items, prices, room capacity, and durations are illustrative. The café address comes from the supplied capstone and should be verified before a real launch. No claim is made about current operating hours. The hero is a generic stock photograph, not a photograph of Brooklyn Warehouse Coffee.

This milestone has no authentication, staff dashboard, live availability, order submission, email delivery, database, payment collection, or router access. The API serves only `/api/v1/health`. The help page is a static FAQ; it is not an AI chatbot.

Only cart item IDs, temperatures, and quantities are stored in local storage. Reservation data is held in component memory and is not transmitted or persisted. Use test information in the form. Frontend prices are for previews only; authoritative prices must be calculated in the backend.

## Integration order

1. Replace `menuService` with an asynchronous, validated API adapter; introduce query loading/error states and TanStack Query when server data arrives.
2. Define the authoritative order schema and submission/payment status contract before enabling checkout.
3. Connect booking availability and staff approval; retain the distinction between a submitted request and a confirmed booking.
4. Implement authentication, permission checks, and separate staff route layouts.
5. Connect actual voucher provisioning/login through a private router adapter.

React Hook Form and shared Zod request validation will be introduced alongside the final request schemas; this initial form uses browser validation plus a tested schedule rule. Do not treat client-side checks as API security.

## Image attribution

The generic pour-over photograph is sourced from Unsplash and saved locally so runtime rendering does not depend on a third-party image host:

https://images.unsplash.com/photo-1442512595331-e89e73853f31

Menu SVG illustrations, room artwork, and the temporary brand/favicon were created for this project. Replace sample content and verify permissions for actual café branding before public launch.

## Next frontend work

Customer order-status screens and staff/admin shell, followed by POS, order queue, inventory, and booking management. These should use the same domain contracts and replaceable data services.
