## Hosted Supabase Setup

Project URL:
`https://yesqzahheivcosyzqyyx.supabase.co`

Publishable key:
`sb_publishable_VhMQ1Kz2ikQATMQTvc_qDw_nLFCiX0p`

Direct connection string template:
`postgresql://postgres:[YOUR-PASSWORD]@db.yesqzahheivcosyzqyyx.supabase.co:5432/postgres`

Still required before running the hosted migration:
- the actual database password for `postgres`

Suggested sequence:
1. Copy values from [.env.example](B:\Blue Ocean Research\south_africa\apps\costofliving\.env.example) into `.env.local`.
2. Fill in `SUPABASE_DB_URL` with the real password.
3. Apply [20260316170000_init_cost_of_living.sql](B:\Blue Ocean Research\south_africa\apps\costofliving\supabase\migrations\20260316170000_init_cost_of_living.sql).
4. Apply [20260316210000_add_research_staging_tables.sql](B:\Blue Ocean Research\south_africa\apps\costofliving\supabase\migrations\20260316210000_add_research_staging_tables.sql).
5. Run [research_seed.sql](B:\Blue Ocean Research\south_africa\apps\costofliving\supabase\research_seed.sql).
