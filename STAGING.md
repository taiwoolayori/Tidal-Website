# Isolated review workflow

From the development branch, run `node scripts/prepare-preview.mjs` to assemble only explicitly allowlisted public files into `staging-public/`.

Run `node scripts/check-preview.mjs` after preparation. This validates internal links, referenced assets, and exclusion of configuration files. Review the generated directory for sensitive content. For an authorized staging deploy only: `firebase hosting:channel:deploy modernization-review --project tidal-crest-group-website --config firebase.preview.json --expires 7d`.

This command uses a preview channel, never `hosting:channel:deploy live` or `firebase deploy`. The preview is a public URL, not access-controlled. The temporary staging artifact includes a robots exclusion and X-Robots-Tag, but neither is a security boundary. Do not publish private materials or source master plans.

No Firebase command should be run without verifying authenticated account, project permissions, channel target and explicit owner authorization for hosted staging.

The staging allowlist also retains the existing Olayori Central policy URLs and historical redirect pages (`privacy.html`, `data-deletion.html`, `olayori-central.html`, `investments.html`, and `leadership.html`) to avoid breaking already-public URL routes during review. These pages are existing public website content, not a grant to publish new private OLAYORI information.
