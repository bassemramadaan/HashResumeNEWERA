# Project Guidelines & Rules

## Vercel Deployments (Hobby Plan Constraints)
- **Do NOT add `"regions"` to `vercel.json`**: The Vercel Hobby plan does not support custom target regions in configuration. Keep `vercel.json` clean of any regional array definitions (like `"regions": ["cdg1", "iad1"]`).
