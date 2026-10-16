# Isolated review workflow

From the development branch, run `node scripts/prepare-preview.mjs` to assemble only explicitly allowlisted public files into `staging-public/`.

Review the generated directory for sensitive content. For an authorized staging deploy only: `firebase hosting:channel:deploy modernization-review --project tidal-crest-group-website --config firebase.preview.json --expires 7d`.

This command uses a preview channel, never `hosting:channel:deploy live` or `firebase deploy`. The preview is a public URL, not access-controlled. The temporary staging artifact includes a robots exclusion and X-Robots-Tag, but neither is a security boundary. Do not publish private materials or source master plans.

No Firebase command should be run without verifying authenticated account, project permissions, channel target and explicit owner authorization for hosted staging.
