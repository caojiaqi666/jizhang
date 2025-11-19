-- FlowMoney Database Schema (PostgreSQL / Supabase)

-- 1. Users Table (Extension of Supabase Auth)
-- Note: Supabase handles auth in auth.users, we create a public profile table
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  avatar_url text,
  membership_tier text default 'free' check (membership_tier in ('free', 'pro')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- RLS Policy: Users can only see their own data
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- 2. Categories Table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id), -- if null, it's a system default category
  name text not null,
  icon text not null, -- emoji or icon identifier
  type text not null check (type in ('income', 'expense')),
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.categories enable row level security;

create policy "Users can view defaults and own categories" on public.categories
  for select using (user_id is null or auth.uid() = user_id);
create policy "Users can insert own categories" on public.categories
  for insert with check (auth.uid() = user_id);
create policy "Users can update own categories" on public.categories
  for update using (auth.uid() = user_id);
create policy "Users can delete own categories" on public.categories
  for delete using (auth.uid() = user_id);

-- 3. Transactions Table
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  category_id uuid references public.categories(id),
  amount decimal(12, 2) not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  note text,
  mood text check (mood in ('happy', 'neutral', 'sad', 'angry', 'fear', 'grateful')), -- 情绪标签
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.transactions enable row level security;

create policy "Users can CRUD own transactions" on public.transactions
  for all using (auth.uid() = user_id);

-- 4. Budgets Table
create table public.budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  category_id uuid references public.categories(id), -- if null, total budget
  amount_limit decimal(12, 2) not null,
  period text default 'monthly' check (period in ('weekly', 'monthly', 'yearly')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.budgets enable row level security;

create policy "Users can CRUD own budgets" on public.budgets
  for all using (auth.uid() = user_id);

-- 5. Savings Goals (Challenges) Table
create table public.savings_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  name text not null,
  target_amount decimal(12, 2) not null,
  current_amount decimal(12, 2) default 0,
  deadline date,
  status text default 'active' check (status in ('active', 'completed', 'abandoned')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.savings_goals enable row level security;

create policy "Users can CRUD own goals" on public.savings_goals
  for all using (auth.uid() = user_id);

