insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('memories', 'memories', true, 52428800, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Memories images are publicly accessible" on storage.objects;
drop policy if exists "Anyone can upload a memory image" on storage.objects;
drop policy if exists "Anyone can update a memory image" on storage.objects;
drop policy if exists "Anyone can delete a memory image" on storage.objects;

create policy "Memories images are publicly accessible"
  on storage.objects
  for select
  using (bucket_id = 'memories');

create policy "Anyone can upload a memory image"
  on storage.objects
  for insert
  with check (bucket_id = 'memories');

create policy "Anyone can update a memory image"
  on storage.objects
  for update
  using (bucket_id = 'memories')
  with check (bucket_id = 'memories');

create policy "Anyone can delete a memory image"
  on storage.objects
  for delete
  using (bucket_id = 'memories');
