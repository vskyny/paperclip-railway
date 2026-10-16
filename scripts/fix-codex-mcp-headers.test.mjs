import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fixManagedMcpHeaders } from './fix-codex-mcp-headers.mjs';
const old = '`headers = { Authorization = ${tomlString(`Bearer ${gateway.bearerToken}`)} }`';
const corrected = old.replace('`headers', '`http_headers');
test('corrects managed bearer header without changing credentials or surrounding source', () => {
  assert.equal(fixManagedMcpHeaders(`prefix\n${old}\nsuffix`), `prefix\n${corrected}\nsuffix`);
});
test('accepts corrected upstream image unchanged', () => assert.equal(fixManagedMcpHeaders(corrected), corrected));
test('rejects missing, duplicate and mixed generator shapes', () => {
  for (const s of ['unknown', old + old, old + corrected, corrected + corrected]) assert.throws(() => fixManagedMcpHeaders(s), /Unexpected/);
});
