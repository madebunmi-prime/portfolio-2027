# Images

Drop your assets here and reference them from `content/portfolio.json` with a leading slash:

| Folder | Used by | Suggested size |
|---|---|---|
| `projects/` | `projects.items[].cover` | 1600 × 1000 (16:10) |
| `logos/` | `experience.items[].logo` | 128 × 128, transparent PNG/SVG |
| `testimonials/` | `testimonials.items[].avatar` | 160 × 160 |
| root | `site.ogImage`, `hero.poster` | 1200 × 630 / 1920 × 1080 |

Example: `"cover": "/images/projects/my-app.jpg"`
