create table if not exists health_metrics (
  id uuid default gen_random_uuid() primary key,
  metric_name text not null,
  units text,
  recorded_at timestamptz not null,
  value jsonb not null default '{}',
  source text,
  created_at timestamptz default now()
);

create unique index if not exists health_metrics_metric_time
  on health_metrics (metric_name, recorded_at);

create index if not exists health_metrics_name_time
  on health_metrics (metric_name, recorded_at desc);

alter table health_metrics enable row level security;

-- Allow the service role (webhook) to insert/upsert
create policy "service role full access"
  on health_metrics
  for all
  using (true)
  with check (true);

-- Allow anon (frontend) to read
create policy "anon read"
  on health_metrics
  for select
  to anon
  using (true);
