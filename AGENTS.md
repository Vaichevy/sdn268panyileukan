<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public CMS content uses an `is_public` publication flag enforced by row-level access rules, so drafts remain admin-only.
- Reels share the existing reel_items CMS and its legacy instagram_url field for social links; detect the platform with validated URL helpers to preserve existing content and publication rules.
- TikTok links use the official iframe player with full numeric video URLs; do not download clips or loosen CSP for embedding.
- Keep the `google-site-verification` meta tag in the root route's head metadata; it proves Search Console ownership, so removing it un-verifies the published site.
