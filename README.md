This site is deployed at https://indiedevuse.com

## Adding yourself

If you want to add yourself, submit a [PR](https://github.com/hboon/indiedevuse.com/pulls):

- add to the end of the list in [developers.json](https://github.com/hboon/indiedevuse.com/blob/main/frontend/src/data/developers.json). Make up an `id` that is unique in the file — use hyphens and all lowercase, not periods or MixedCase.
- an avatar image file in [avatars/](https://github.com/hboon/indiedevuse.com/tree/main/frontend/public/avatars). Keep it to about 500x500. Run ImageOptim (or equivalent) on your avatar files. It's unlikely that the file would be bigger than 300kb.

Watch out for commas in `developers.json`.

I might make minor edits to the list of tools for consistency like for spelling/casing.

## Owner-curated profiles

I also add a small number of owner-curated profiles when the public evidence is strong enough.

For curated profiles, include:

- `provenance.sourceType`: `owner-curated`
- `provenance.confidence`: usually `high`; use `medium` only when the profile should be reviewed again before broad use
- `provenance.reviewedAt`: the review date in `YYYY-MM-DD`
- `provenance.sources`: public source links used for identity, product ownership, and stack/tool evidence
- `provenance.correctionURL`: usually the GitHub PR page
- `provenance.avatarSource`: where the avatar came from, or why a placeholder was used

Do not copy bios from source pages. Write a short original summary from verified facts. Curated profiles need a public personal identity, clear product ownership, and either an explicit uses/stack page or at least two public evidence points for tools/stacks.

Use `bun run generate-curated-avatars` for owner-curated profiles. It pulls configured public profile photos, resizes them to local 512px JPGs, runs ImageOptim, and updates avatar provenance.

## To run locally

```
git@github.com:hboon/indiedevuse.com.git
cd frontend
pnpm i
pnpm run dev
```

## To run in a Docker container

[Chris Shennan](https://bsky.app/profile/chrisshennan.bsky.social) kindly wrote up [instructions for running IndieDevUse.com in a Docker container](https://chrisshennan.com/blog/adding-myself-to-indiedevuse-without-installing-pnpm-using-docker).
