# Verification record — frontend milestone 1

Verified on 23 October 2026 in the development environment.

## Automated project checks

- `npm run typecheck`: passed for API and frontend.
- `npm run lint`: passed, without remaining lint findings.
- `npm test`: 9 tests passed across 2 files.
- `npm run build`: API TypeScript build and Vite production build passed.
- `npm run format:check`: passed.
- `git diff --check`: passed before the frontend commit.

The unit tests cover cart variant merging, quantity limits, exact centavo totals, invalid saved data, removed products, duplicate lines, and booking-date validation across Manila/UTC date boundaries.

## Runtime and browser checks

The root development command started both services. The Vite proxy successfully returned the API health response. All five customer routes returned the application shell.

Browser interaction checks used Chromium 134.0.6998.35, a 1440 × 1000 desktop viewport, and a 390 × 844 mobile viewport:

- Home renders with featured menu items and local assets.
- Navigation opens the menu; categories, search, and the empty state work.
- Repeated additions merge identical options; hot and iced variants remain separate.
- Cart quantity changes, removal, and totals update correctly.
- Order preview explicitly states that the order was not submitted.
- Escape closes the cart dialog.
- A saved cart survives a page reload.
- Reservation preview appears with its not-sent notice; editing preserves entered values.
- Home, menu, reservations, Wi-Fi, FAQ, and the missing-page view have no horizontal overflow at the mobile viewport.
- Local images load, mobile navigation closes after choosing a route, and no browser runtime errors were recorded.

Desktop home, mobile home, and desktop reservation layouts were visually inspected. These checks do not establish live payment, booking availability, database, authentication, or MikroTik integration; those features are outside this milestone. Windows, Safari, and real captive-browser behavior remain to be tested on target devices.

The temporary browser runner and internal screenshots are not shipped in the source archive. Repeat the interaction checklist above after changes; the domain tests run with `npm test`.

## Admin frontend verification

The admin workspace addition was checked on 23 October 2026:

- Workspace type checking, lint, production build, formatting, and `git diff --check` passed.
- `npm test`: 22 tests passed across 3 files, including 13 new admin workflow cases.
- The new cases cover POS-to-completed-sales flow, historical price preservation, invalid quantities/variants, unavailable products, order transition constraints, cancellation totals, stock-in validation, overlapping booking approvals, CSV formula escaping, and resetting shared state.
- A temporary Vite SSR smoke check rendered all 11 admin routes and the admin missing-page route with their expected content and shared navigation.
- The development server returned the application shell for `/admin`.

The browser tools reported no available browser during this addition. Desktop/mobile visual inspection and end-to-end browser interactions for the admin area remain unverified; SSR rendering is not a substitute for those checks. The customer browser results above describe the earlier customer milestone.

For manual verification, open `/admin` at desktop and mobile widths, create a hot/iced POS order, advance it through the queue, and compare completed totals with reports. Change a product price and availability, restock a low ingredient, review a booking, toggle attendance, issue/revoke a voucher, export the sales CSV, create/publish a demo draft, and save/reset preferences. Confirm that the mobile navigation opens/closes, keyboard focus remains visible, unknown admin paths show the admin 404 page, and the customer footer links to the workspace.
