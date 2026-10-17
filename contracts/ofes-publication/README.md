# OFES to Tidal Crest Website: Draft Publication Compatibility (v0.1)

**Status:** Non-deploying technical proposal. Not a functioning OFES integration, not owner approval for publishing. 
**Authority:** The OFES handoff `OFES-TCG-RESPONSE-20261017-003`; canonical mapping remains unresolved pending FAMILY-CANON-001 reconciliation.

## Boundary
Private OFES data -> fact check -> editorial review -> privacy and rights clearance -> explicit authorization -> approved public release -> static manifest -> website. Authorization is NOT publication. Public releases are separate from media production records and underlying operational projects. MOIRAI cannot independently approve releases.

This directory holds ONLY schemas and synthetic examples. The Firebase staging allowlist does not include it. Never put private OFES records or confidential IDs in this repository.

## Proposed static manifest
- Schema file: `publication-manifest.schema.json`; manifest family is `tidal.publications` at version `0.1.0-draft`.
- Stable public identifiers are distinct from private canonical identifiers.
- The generator uses an *allowlist*, not a blacklist. Do not serialize entire database records.
- Entry types: `entity`, `project-update`, `farm-journal`, `media`, `challenge`, `foundation`.
- Publishing rule: ONLY records with independent authorization, fact verification, rights/privacy clearance and state `published` may be exported. Candidate state machine: Draft -> Submitted for Review -> Fact Checked -> Privacy/Rights Cleared -> Authorized -> Published; Returned for Revision, Rejected, Withdrawn, Superseded, Archived are separate states.
- Rights and decision evidence remain private. Only an externally safe rights clearance *flag* may be exported, never identities, decision logs, credentials, private URLs or internal source keys.
- The website must gracefully handle zero releases, never invent text or silently substitute draft content.

## Takedown and version behavior
- Superseded versions do not appear in active manifests. The approved current version takes their place.
- Withdrawn records must be removed from active manifests; a generator should emit removal instructions for previously deployed paths, media and link references. CDN/browser caches may retain material and require separate operational controls.
- A correction creates a new approved version and preserves revision history privately. Public historic access follows disclosure policy.
- Deterministic output, integrity digests, removal instructions and cache strategy require design and operational acceptance prior to activation.

## Media & Farms
The eight existing farm HTML journals have Vision, Design, Challenge, Build, Operations, Lessons chapters. Each public chapter is a **publication** referencing approved public project references, not the operational project itself. Tidal Crest Media's production file, footage rights and editorial history remain separate from a public release.

## Inbound (separate, deferred)
Current contact links use `mailto:`; no validated form service was observed. Any future enquiry interface needs independent approval and server-side validation, consent/retention, abuse controls, attachment scanning, and least-privilege routing to OFES. Never post user submissions directly to a public manifest.

## Current acceptance
Run `node contracts/ofes-publication/test-contract.mjs` to test mock export behavior only. This is *not* an OFES API test, Firebase deployment or a claim of legal/operational identity verification.

## Open decisions
1. Approve public opaque IDs mapped privately to FAMILY-CANON-001. No permanent IDs assigned here.
2. Determine canonical public labels for Logistics vs Cold Chain, Supply Chain, and Processing.
3. Approve publication state transitions, reviewer authority and release evidence contract.
4. Agree public media URL host/rights policy and approved location granularity.
5. Define immutable release checksum and deletion/rollback channel protocols.
6. Complete security tests against real adapter in a private environment when integration is authorized.
