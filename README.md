This site is deployed at https://indiedevuse.com

## Adding yourself

If you want to add yourself, submit a [PR](https://github.com/hboon/indiedevuse.com/pulls):

* add to the end of the list in [developers.json](https://github.com/hboon/indiedevuse.com/blob/main/frontend/src/data/developers.json). Make up an `id` that is unique in the file — use hyphens and all lowercase, not periods or MixedCase.
* an avatar image file in [avatars/](https://github.com/hboon/indiedevuse.com/tree/main/frontend/public/avatars). Run ImageOptim (or equivalent) on your avatar files

Watch out for commas in `developers.json`.

I might make minor edits to the list of tools for consistency like for spelling/casing.

## To run locally

```
git@github.com:hboon/indiedevuse.com.git
cd frontend
pnpm i
pnpm run dev
```
