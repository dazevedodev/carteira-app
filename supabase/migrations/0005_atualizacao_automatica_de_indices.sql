-- Atualização automática dos índices (IGP-M, IPCA, INPC), uma vez por dia.
-- O cron do Vercel (/api/cron/indices) busca os últimos meses no Banco Central e
-- chama sync_indices(), que só acrescenta o que ainda não existe, em todas as carteiras.
--
-- ATENÇÃO: o segredo abaixo NÃO fica no repositório. Rode a versão com o segredo
-- real (a mesma que está em CRON_SECRET no Vercel). Se precisar trocar: gere outro,
-- atualize o Vercel e rode de novo só o "insert ... on conflict" da tabela app_config.

create table if not exists app_config (
  chave text primary key,
  valor text not null
);
alter table app_config enable row level security;  -- sem políticas: ninguém lê pelo app

insert into app_config (chave, valor)
values ('indices_secret_hash', encode(digest('COLE_O_SEGREDO_AQUI', 'sha256'), 'hex'))
on conflict (chave) do update set valor = excluded.valor;

create or replace function sync_indices(p_secret text, p_rows jsonb)
returns integer
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_hash text;
  v_novos integer;
  v_total integer := 0;
  r record;
begin
  select valor into v_hash from app_config where chave = 'indices_secret_hash';
  if v_hash is null or encode(digest(coalesce(p_secret, ''), 'sha256'), 'hex') <> v_hash then
    raise exception 'nao_autorizado';
  end if;

  for r in
    select * from jsonb_to_recordset(p_rows) as x(tipo text, mes text, valor numeric)
  loop
    if r.tipo not in ('IPCA', 'IGP-M', 'INPC')
       or r.mes is null or r.mes !~ '^\d{4}-\d{2}$'
       or r.valor is null or abs(r.valor) >= 100 then
      continue;
    end if;

    -- Só um mês realmente novo é copiado para as carteiras (não recoloca o que
    -- alguém apagou ou editou em meses antigos).
    insert into index_templates (tipo, mes_referencia, valor_percent)
    select r.tipo, r.mes, r.valor
    where not exists (
      select 1 from index_templates t
      where t.tipo = r.tipo and t.mes_referencia = r.mes
    );
    get diagnostics v_novos = row_count;

    if v_novos > 0 then
      insert into indices (account_id, tipo, mes_referencia, valor_percent)
      select a.id, r.tipo, r.mes, r.valor from accounts a
      on conflict do nothing;
      v_total := v_total + 1;
    end if;
  end loop;

  return v_total;
end;
$$;

grant execute on function sync_indices(text, jsonb) to anon, authenticated;
