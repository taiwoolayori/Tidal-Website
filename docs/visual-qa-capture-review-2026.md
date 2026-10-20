# Website visual QA — first capture review

## Evidence

GitHub Actions run #44 on commit `5744307` succeeded and produced the `website-visual-qa` artifact with 18 full-page Chromium captures: Home, Businesses, Farms, Governance, Foundation and Contact at 375, 768 and 1440 px.

The screenshots were inspected as an overview montage. This establishes screenshot generation and permits preliminary visual review; it **does not constitute final visual or accessibility acceptance**.

## Preliminary observations

- The black, ivory and bronze editorial styling is consistent across the six captured pages.
- Home and Farms are especially long on mobile. Long scrolling is not automatically a defect; prioritize readability and spacing in focused viewports.
- Some text and buttons become difficult to assess when entire tall mobile pages are reduced to overview scale.
- The first-screen capture is now added to the CI artifact to allow useful inspection of hero/title placement, contrast, header height and top-of-page CTAs without shrinking the full-page image.
- Automated Chromium smoke tests are not a substitute for Safari acceptance, screen-reader testing or owner's visual approval.

## Remaining release gates

1. Inspect the first-screen crops, and correct any confirmed clipped text, contrast, overlap or navigation defects.
2. Accept responsive layouts on Safari and Chromium, including keyboard navigation and motion preferences.
3. Confirm all official images and branding assets are approved.
4. Keep the proposed future email addresses inactive until provisioned and delivery-tested.
5. Confirm staging preview, owner approval and rollback before any merge or Firebase production deployment.

**Development branch only. No production release authorization.**
