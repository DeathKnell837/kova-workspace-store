-- DeskLaya store schema. Run only in the dedicated DeskLaya Supabase project.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  category text not null default 'Desk organization',
  price_php integer not null check (price_php > 0),
  supplier_name text,
  supplier_sku text,
  image_url text not null default '',
  stock_status text not null default 'unverified' check (stock_status in ('unverified', 'available', 'out_of_stock')),
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address_line1 text not null,
  address_line2 text not null default '',
  city text not null,
  province text not null,
  postal_code text not null,
  delivery_notes text not null default '',
  currency text not null default 'PHP' check (currency = 'PHP'),
  subtotal_php integer not null check (subtotal_php > 0),
  shipping_php integer not null check (shipping_php >= 0),
  total_php integer not null check (total_php = subtotal_php + shipping_php),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'checkout_error', 'refunded')),
  fulfillment_status text not null default 'unfulfilled' check (fulfillment_status in ('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_session_id text unique,
  paid_at timestamptz,
  tracking_number text,
  tracking_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_customer_email_idx on public.orders (customer_email, order_number);
create index if not exists orders_fulfillment_status_idx on public.orders (fulfillment_status, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,
  unit_price_php integer not null check (unit_price_php > 0),
  quantity integer not null check (quantity between 1 and 10),
  created_at timestamptz not null default now()
);
create index if not exists order_items_order_idx on public.order_items (order_id);

create table if not exists public.payment_events (
  event_id text primary key,
  event_type text not null,
  order_number text not null,
  received_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_events enable row level security;

-- No public policies. All writes and private order reads go through server-side store functions
-- using a server-only Supabase secret key (or legacy service role key).
revoke all on public.products, public.orders, public.order_items, public.payment_events from anon, authenticated;
