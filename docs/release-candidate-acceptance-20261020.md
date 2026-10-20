# Tidal Crest Group — release candidate acceptance register

**Release candidate:** `website-modernization-2026`, commit `bdc400d5ff143c0c4cf1499d8edb538c17c1995a`.

## Verified technical acceptance

- GitHub Actions public-bundle validation #88: SUCCESS.
- GitHub Actions staging validation #115: SUCCESS.
- Downloaded public preview artifact `tidal-website-release-preview`, artifact ID `12243384492`.
- Independent ZIP inventory: **48 files**, **28 HTML pages**.
- `olayori-central.html`: ABSENT.
- Old `contact-bg-clean@2x.webp`: ABSENT.
- Development `tools/`, `docs/` and `.github/` directories: ABSENT.
- No bundled HTML/CSS/JS/TXT contains a reference to `olayori-central.html`.
- Existing corporate mailto routing remains. Unverified future dedicated addresses are not to be activated automatically.
- Publishing remains scoped to generated `dist-public`.

## Acceptance still outstanding

1. Owner reviews home/businesses/farms/governance/foundation/contact on desktop and mobile, including hero imagery and finalized company identity.
2. Safari and other real-device checks (Chromium CI is not a substitute for every browser).
3. Public content and legal/corporate registration details approved against current official records.
4. Any proposed business-specific email destinations verified for receipt and authorized reply before activation.
5. Explicit owner command authorizing the production merge/deployment and a documented rollback path.

## Release instruction

This candidate is **TECHNICALLY VALIDATED, NOT OWNER-ACCEPTED OR DEPLOYED**. Do not merge into `main` or deploy Firebase Hosting based on CI alone. No Living Master Plan work is in scope.
