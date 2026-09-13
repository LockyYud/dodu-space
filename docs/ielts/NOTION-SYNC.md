# Weekly Notion sync

`/ielts/today` has a user-triggered **Sync weekly review** button. It writes
the selected ISO week from Turso to one Notion page; it does not expose a
public endpoint and does not let ChatGPT pull from the app.

Configure these Production variables in Vercel:

```text
NOTION_TOKEN=secret_from_your_notion_integration
NOTION_WEEKLY_DATA_DATABASE_ID=English_Weekly_Data_database_id
```

Share the `English Weekly Data` database with that integration. Its schema
must contain a Title property, `Week` as Rich text, and `Status` as Select or
Status with a `Ready` option. Turso remains canonical: Notion is only the
weekly mirror consumed by the scheduled ChatGPT workflow.

Before deploying a schema change, run `npm run ielts:migrate` against the same
Turso database configured in Vercel. This avoids deploying a query for a column
that production has not received yet.
