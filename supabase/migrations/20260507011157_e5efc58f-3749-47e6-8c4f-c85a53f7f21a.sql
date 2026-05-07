
drop policy if exists "anyone can submit application" on public.applications;
create policy "anyone can submit application" on public.applications for insert
with check (
  char_length(learner_name) between 1 and 200
  and char_length(parent_name) between 1 and 200
  and char_length(phone) between 1 and 50
  and char_length(coalesce(notes,'')) <= 4000
);
