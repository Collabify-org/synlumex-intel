-- ============================================================
-- SYNLUMEX INTEL — Core Schema
-- Migration 001: Tables, Enums, RLS, The Loop Trigger
-- ============================================================

-- ---------- ENUMS ----------
create type user_role as enum ('owner', 'member');

create type currency_code as enum ('INR', 'USD', 'SAR');

create type project_stage as enum (
  'intake', 'requirements', 'boq', 'estimation', 'engineering',
  'procurement', 'execution', 'qa_qc', 'testing_commissioning',
  'measurement_claim', 'financial_erp', 'commercial_visibility',
  'handover', 'closeout'
);

create type stage_status as enum ('pending', 'in_progress', 'done', 'blocked');

create type health_status as enum ('green', 'amber', 'red', 'on_hold');

create type exception_severity as enum ('low', 'medium', 'high', 'critical');

create type exception_status as enum ('open', 'ack', 'closed');

create type reminder_status as enum ('pending', 'done', 'overdue');

-- ---------- TABLES ----------

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role user_role not null default 'member',
  created_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  client_id uuid references clients(id) on delete set null,
  description text,
  contract_value numeric(18,2) not null default 0,
  currency currency_code not null default 'INR',
  current_stage project_stage not null default 'intake',
  health health_status not null default 'green',
  start_date date,
  end_date date,
  owner_id uuid references profiles(id),
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_projects_client on projects(client_id);
create index idx_projects_owner on projects(owner_id);
create index idx_projects_health on projects(health) where archived = false;

create table project_stages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  stage project_stage not null,
  status stage_status not null default 'pending',
  entered_at timestamptz,
  completed_at timestamptz,
  notes text,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  unique(project_id, stage)
);
create index idx_stages_project on project_stages(project_id);

create table boq_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  description text not null,
  unit text,
  quantity numeric(18,4) not null default 0,
  rate numeric(18,2) not null default 0,
  amount numeric(18,2) generated always as (quantity * rate) stored,
  source text not null default 'manual',
  created_at timestamptz not null default now()
);
create index idx_boq_project on boq_items(project_id);

create table estimates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  labour_cost numeric(18,2) not null default 0,
  material_cost numeric(18,2) not null default 0,
  other_cost numeric(18,2) not null default 0,
  total numeric(18,2) generated always as (labour_cost + material_cost + other_cost) stored,
  margin_pct numeric(5,2),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_estimates_project on estimates(project_id);

create table procurement (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  vendor_name text not null,
  item text not null,
  quantity numeric(18,4),
  unit text,
  amount numeric(18,2) not null default 0,
  status text not null default 'rfq',
  expected_date date,
  created_at timestamptz not null default now()
);
create index idx_procurement_project on procurement(project_id);

create table execution_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  progress_pct numeric(5,2) not null check (progress_pct between 0 and 100),
  notes text,
  evidence_url text,
  reported_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
create index idx_execution_project on execution_updates(project_id);

create table billing (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  invoice_no text not null,
  amount numeric(18,2) not null default 0,
  billed_at date not null default current_date,
  due_at date,
  status text not null default 'raised',
  created_at timestamptz not null default now()
);
create index idx_billing_project on billing(project_id);

create table collections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  billing_id uuid references billing(id) on delete set null,
  amount numeric(18,2) not null default 0,
  collected_at date not null default current_date,
  reference text,
  created_at timestamptz not null default now()
);
create index idx_collections_project on collections(project_id);

create table exceptions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  type text not null,
  severity exception_severity not null default 'medium',
  message text not null,
  status exception_status not null default 'open',
  assigned_to uuid references profiles(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_exceptions_project on exceptions(project_id);
create index idx_exceptions_status on exceptions(status) where status = 'open';

create table reminders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  exception_id uuid references exceptions(id) on delete cascade,
  assigned_to uuid references profiles(id),
  message text not null,
  due_at timestamptz not null,
  status reminder_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index idx_reminders_assigned on reminders(assigned_to, status);
create index idx_reminders_due on reminders(due_at) where status = 'pending';

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  actor_id uuid references profiles(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  payload jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_project on audit_log(project_id, created_at desc);

create table settings (
  id int primary key default 1 check (id = 1),
  company_name text not null default 'SYNLUMEX INTEL',
  last_sync_at timestamptz not null default now()
);
insert into settings (id) values (1);

-- ---------- ROW LEVEL SECURITY ----------
alter table profiles enable row level security;
alter table clients enable row level security;
alter table projects enable row level security;
alter table project_stages enable row level security;
alter table boq_items enable row level security;
alter table estimates enable row level security;
alter table procurement enable row level security;
alter table execution_updates enable row level security;
alter table billing enable row level security;
alter table collections enable row level security;
alter table exceptions enable row level security;
alter table reminders enable row level security;
alter table audit_log enable row level security;
alter table settings enable row level security;

create or replace function is_owner()
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

create or replace function can_access_project(p_id uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from projects p
    left join profiles pr on pr.id = auth.uid()
    where p.id = p_id
    and (pr.role = 'owner' or p.owner_id = auth.uid())
  );
$$;

create policy "profiles: self read" on profiles for select using (id = auth.uid() or is_owner());
create policy "profiles: owner update" on profiles for update using (is_owner());

create policy "clients: read" on clients for select using (auth.uid() is not null);
create policy "clients: owner write" on clients for all using (is_owner()) with check (is_owner());

create policy "projects: read" on projects for select
  using (is_owner() or owner_id = auth.uid());
create policy "projects: owner write" on projects for all
  using (is_owner()) with check (is_owner());

do $$
declare t text;
begin
  for t in select unnest(array[
    'project_stages','boq_items','estimates','procurement',
    'execution_updates','billing','collections','exceptions','reminders'
  ]) loop
    execute format($f$
      create policy "%1$s: read" on %1$s for select
        using (can_access_project(project_id));
      create policy "%1$s: write" on %1$s for all
        using (can_access_project(project_id))
        with check (can_access_project(project_id));
    $f$, t);
  end loop;
end $$;

create policy "audit: read" on audit_log for select using (is_owner() or can_access_project(project_id));

create policy "settings: read" on settings for select using (auth.uid() is not null);
create policy "settings: owner write" on settings for all using (is_owner());

-- ---------- AUTO-CREATE STAGES ON PROJECT INSERT ----------
create or replace function seed_project_stages()
returns trigger
language plpgsql
as $$
declare
  s project_stage;
begin
  foreach s in array enum_range(null::project_stage) loop
    insert into project_stages (project_id, stage, status)
    values (new.id, s,
      case when s = 'intake' then 'in_progress'::stage_status
           else 'pending'::stage_status end);
  end loop;
  return new;
end;
$$;

create trigger trg_seed_project_stages
after insert on projects
for each row execute function seed_project_stages();

-- ---------- THE LOOP ----------
create or replace function recompute_project_state(p_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_project projects%rowtype;
  v_contract numeric;
  v_billed numeric;
  v_collected numeric;
  v_unbilled numeric;
  v_overdue_collections numeric;
  v_open_critical int;
  v_open_high int;
  v_health health_status;
begin
  select * into v_project from projects where id = p_id;
  if not found then return; end if;

  select coalesce(sum(amount),0) into v_billed
    from billing where project_id = p_id and status in ('approved','paid');

  select coalesce(sum(c.amount),0) into v_collected
    from collections c where c.project_id = p_id;

  select coalesce(sum(amount),0) into v_overdue_collections
    from billing
    where project_id = p_id
      and status = 'overdue';

  v_unbilled := greatest(v_billed - v_collected, 0);
  v_contract := v_project.contract_value;

  select count(*) into v_open_critical
    from exceptions where project_id = p_id and status = 'open' and severity = 'critical';

  select count(*) into v_open_high
    from exceptions where project_id = p_id and status = 'open' and severity = 'high';

  if v_open_critical > 0 or (v_contract > 0 and v_overdue_collections / v_contract > 0.10) then
    v_health := 'red';
  elsif v_open_high > 0 or (v_contract > 0 and v_unbilled / v_contract > 0.25) then
    v_health := 'amber';
  else
    v_health := 'green';
  end if;

  update projects set health = v_health, updated_at = now() where id = p_id;

  update settings set last_sync_at = now() where id = 1;

  insert into audit_log (project_id, action, entity, entity_id, payload)
  values (p_id, 'recompute', 'projects', p_id,
    jsonb_build_object(
      'health', v_health,
      'billed', v_billed,
      'collected', v_collected,
      'unbilled', v_unbilled,
      'overdue', v_overdue_collections
    ));
end;
$$;

create or replace function trg_loop_on_project_mutation()
returns trigger language plpgsql as $$
begin
  perform recompute_project_state(coalesce(new.project_id, old.project_id));
  return coalesce(new, old);
end;
$$;

create trigger loop_billing
after insert or update or delete on billing
for each row execute function trg_loop_on_project_mutation();

create trigger loop_collections
after insert or update or delete on collections
for each row execute function trg_loop_on_project_mutation();

create trigger loop_exceptions
after insert or update or delete on exceptions
for each row execute function trg_loop_on_project_mutation();
