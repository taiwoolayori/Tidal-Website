# Release candidate visual asset exception — Contact hero

Visual evidence source: GitHub Actions public-bundle validation run #48 (commit `f0e621a`), first-screen screenshots, 375 px mobile and 1440 px desktop.

**Observed:** The Contact hero background artwork visibly contains the older wording **“Tidal Crest Capital Limited”**, which conflicts with the current canonical company name **Tidal Crest Group Limited**. This is artwork, not website copy; do not retouch, replace or redesign it without owner-approved corrected imagery.

**Source:** `assets/contact-bg-clean@2x.webp` (as referenced from the Contact hero CSS).

**Status:** BLOCKING BRAND ASSET ACCEPTANCE. The approved site content can continue independently, but production release should use a reviewed updated Contact image or a neutral already-approved image without outdated lettering.

**Responsive fix:** Mobile Contact heading typography has been adjusted in `lean.css` so “START A CONVERSATION.” does not split awkwardly at the 375 px target width. Screenshot recapture and review required.

**Not authorized:** No production branch merge, Firebase deployment or final logo/crest redesign.

## Approved temporary mitigation (Oct 20, 2026)
Owner authorized using an existing architectural asset in place of obsolete seal artwork. Development CSS now references `assets/developments-bg-hq@2x.webp` for Contact. Both CI workflows passed at commit `ec1a277`. **Old-asset publication blocker is mitigated for Contact; updated image composition still needs visual owner acceptance.** The old asset remains in the repository and may still be used elsewhere, requiring separate inventory before publication.
