
create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to service_role;

-- restrict storage listing: only allow individual object reads, not bucket listing
drop policy if exists "public read media" on storage.objects;
create policy "public read media files" on storage.objects for select using (bucket_id = 'media' and name is not null);
