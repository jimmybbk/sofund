# Sofund — sofund.com.au

Single-page site for an Australian business-finance broker, built to mirror the
centryx.finance layout and interaction model with original Australian content.
Static HTML/CSS/JS — **no build step, no libraries** (verified: centryx itself
uses none). Deploy the folder as-is to any host.

## Structure (top to bottom)

1. **Nav** — fixed, transparent → white blur on scroll, pill CTA, sliding link underlines
2. **Hero** — sparse: "Funding for [rotating word]" + one CTA
3. **Stats band** — 200+ lenders / $5M / 48h / $0, hairline top+bottom
4. **Circle mask reveal** — 300vh black section; a white circle (clip-path) grows
   with scroll and reveals "What we fund"
5. **Fund slides (#products)** — 320vh sticky section; four product slides swap as
   you scroll (Business Loans, Asset & Equipment, Invoice Finance, Commercial
   Mortgages), each with huge two-line title, figure, animated line bars
6. **Process** — numbered ruled rows 01–05
7. **Why us** — 2×2 hairline grid
8. **How we work** — editorial copy
9. **Apply (dark)** — black section, translucent form card, FormSubmit endpoint
10. **Footer** — black, email, ABN/ACL legal

## "Plugins" needed: none for the site itself

The only external services, same as centryx:

- **Fontshare** — Satoshi font (free CDN, like Google Fonts)
- **FormSubmit.co** — free form backend. The form already posts to
  `https://formsubmit.co/hello@sofund.com.au`. To activate: change the email in
  `index.html` to the real inbox, then submit the form once and click the
  confirmation email FormSubmit sends. No account needed.
- Hosting: any static host (Netlify / Vercel / Cloudflare Pages drag-and-drop).

## Accessibility (kept on top of the centryx model)

- `prefers-reduced-motion`: sticky theatrics collapse to a static stacked layout,
  all four slides and the mask content fully visible
- No-JS fallback: all content renders; rotator hides cleanly
- Visible focus rings, skip link, keyboard nav, inline field errors with
  `aria-invalid`, form submits natively only when valid
- Mask/slide mechanics verified against real layout geometry via DOM probes;
  desktop/mobile/reduced-motion screenshots reviewed

## Before you go live — placeholders to replace

- **ABN / ACL** — footer (`ABN 00 000 000 000`, `ACL 000000`)
- **FormSubmit email** — form action in `index.html`
- **Stats and product figures** — panel size, LVRs, terms
- **Privacy / Terms / Credit Guide links** — currently `#`; an AU credit
  business must publish a Credit Guide
