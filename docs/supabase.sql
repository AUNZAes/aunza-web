-- Run once in the Supabase SQL editor.

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('quote', 'contact')),
  reply_to text not null,
  data jsonb not null,
  attachment_path text
);

-- The website writes with the server-only service-role key, which bypasses RLS.
-- With RLS on and no policies, nobody else can read or write this table.
alter table public.form_submissions enable row level security;

-- Private bucket for reference files. Max 4 MB, same as the form.
insert into storage.buckets (id, name, public, file_size_limit)
values ('form-uploads', 'form-uploads', false, 4194304)
on conflict (id) do nothing;
