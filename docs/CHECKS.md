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
