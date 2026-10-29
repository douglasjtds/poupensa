-- join_household_by_code: trava a linha do household antes de contar membros.
-- Sem o lock, dois resgates simultâneos do mesmo código leem member_count = 1
-- e ambos inserem, deixando a casa com 3 membros. FOR UPDATE serializa os
-- resgates concorrentes no mesmo household.

create or replace function join_household_by_code(code text)
returns households
language plpgsql
security definer
set search_path = public
as $$
declare
  target households;
  member_count int;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if exists (select 1 from household_members where user_id = auth.uid()) then
    raise exception 'user already belongs to a household';
  end if;

  select * into target from households where invite_code = upper(trim(code)) for update;
  if target.id is null then
    raise exception 'invalid invite code';
  end if;

  select count(*) into member_count from household_members where household_id = target.id;
  if member_count >= 2 then
    raise exception 'household is full';
  end if;

  insert into household_members (household_id, user_id) values (target.id, auth.uid());
  return target;
end;
$$;
