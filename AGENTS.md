# For any AI agent or new chat

Start with `docs/RECOVERY.md` (current state, owner rules, next work), then the newest file in `docs/logs/`, then `git log --oneline -20`.

Build and check before every commit:

```
python scripts/validate_content.py
python scripts/build_review_site.py
node scripts/check_review_site.cjs
```

At the end of every working session: add or update `docs/logs/<date>.md` (what was done, decisions, limits) and refresh "Current state" and "Exact next work" in `docs/RECOVERY.md`, then commit. Chat history is not the record; this repository is.
