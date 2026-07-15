#!/usr/bin/env bash
# Sobe um Postgres descartável, aplica shim + migrations + grants e roda os
# testes de integração. Requer initdb/pg_ctl/psql no PATH (brew install postgresql).
# Alternativa: com Supabase local (supabase start), exporte TEST_DATABASE_URL
# e rode `npm run test:integration` direto.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PGPORT="${PGPORT:-54329}"
PGDATA_DIR="${TMPDIR:-/tmp}/poupensa-testdb"
DB=poupensa_test
export PGHOST=127.0.0.1 PGUSER=postgres

cleanup() {
  pg_ctl -D "$PGDATA_DIR" stop -m immediate >/dev/null 2>&1 || true
  rm -rf "$PGDATA_DIR"
}
trap cleanup EXIT

rm -rf "$PGDATA_DIR"
initdb -D "$PGDATA_DIR" -U postgres --auth=trust -E UTF8 >/dev/null
pg_ctl -D "$PGDATA_DIR" -o "-p $PGPORT -c unix_socket_directories=''" \
  -l "$PGDATA_DIR/pg.log" start >/dev/null

for _ in $(seq 1 30); do
  psql -p "$PGPORT" -d postgres -tAc 'select 1' >/dev/null 2>&1 && break
  sleep 0.5
done

createdb -p "$PGPORT" "$DB"
psql -p "$PGPORT" -d "$DB" -v ON_ERROR_STOP=1 \
  -f "$REPO_DIR/supabase/test/auth-shim.sql" \
  -f "$REPO_DIR/supabase/migrations/00001_initial_schema.sql" \
  -f "$REPO_DIR/supabase/migrations/00002_rls_policies.sql" \
  -f "$REPO_DIR/supabase/test/grants.sql" >/dev/null

export TEST_DATABASE_URL="postgres://postgres@127.0.0.1:$PGPORT/$DB"
cd "$REPO_DIR"
npx vitest run tests/integration "$@"
