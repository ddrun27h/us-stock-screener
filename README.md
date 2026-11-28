# us-stock-screener

Static output of the screener, served by GitHub Pages from the `gh-pages` branch.

The `main` branch only holds the publishing workflow (`.github/workflows/screener-pages.yml`).
It runs on a schedule (06:00, 12:30 and 19:00 Taipei), builds the site from a separate private source
repository, and publishes the result to `gh-pages`. Logs of this repository are public.
