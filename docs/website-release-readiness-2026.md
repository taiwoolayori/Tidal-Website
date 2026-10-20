# Tidal Crest Group website — release readiness gate

This checklist applies to the development branch only. **No merge to main, production Firebase deployment, or DNS action is authorized.**

## Verified source-level finding

The current `firebase.json` uses `"public": "."`, meaning Firebase Hosting serves from the repository root, subject to its ignore rules. That is broader than the intended public page and asset set. A final release must first isolate a clean publish directory (or explicitly verify a complete allowlist equivalent), without bundling internal documentation, source scripts, credentials, CI configuration, or development notes.

Do not change the production Hosting target until the revised staging package has been reviewed.

## Execution plan

1. Create a reviewed, generated public-only directory containing only website HTML/CSS/JS, images, manifest and other intentionally public assets.
2. Point the development Firebase Hosting configuration at that directory and ensure all relative paths work.
3. Verify all navigation routes, hero text, keyboard-accessible menus, image references, mobile layouts and metadata.
4. Check that proposed business capabilities are labeled as developing, not as incorporated entities or launched operating companies.
5. Leave official social-media URLs absent until the owner confirms each official account.
6. Preserve existing verified enquiry addresses. Future `foods@`, `processing@`, `supplychain@`, `logistics@`, `technology@`, `infrastructure@`, `media@`, `hospitality@`, `research@`, `projects@`, `partnerships@`, and `suppliers@` must not become public mailto targets until Google Workspace provisioning and live receipt/reply tests are complete.
7. Test the isolated build in a preview environment, then request owner approval before merging/deploying.

## Local audit

Run `node tools/website-release-check.mjs` from the repository root. An expected `RELEASE_BLOCKED` result documents outstanding concerns, not a test malfunction.

The Living Master Plan and its Firebase/Cloud Run infrastructure remain out of scope.
