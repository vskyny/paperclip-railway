import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Compatibility fix for upstream images predating the http_headers correction.
// Fail the build if upstream changes the generator so this cannot silently drift.
export function fixManagedMcpHeaders(source) {
  const before = '`headers = { Authorization = ${tomlString(`Bearer ${gateway.bearerToken}`)} }`';
  const after = '`http_headers = { Authorization = ${tomlString(`Bearer ${gateway.bearerToken}`)} }`';
  const oldCount = source.split(before).length - 1;
  const newCount = source.split(after).length - 1;
  if (oldCount === 0 && newCount === 1) return source;
  if (oldCount !== 1 || newCount !== 0) throw new Error('Unexpected Codex managed MCP header generator; review upstream before building');
  return source.replace(before, after);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const path = process.argv[2];
  if (!path) throw new Error('Expected codex-home.ts path');
  writeFileSync(path, fixManagedMcpHeaders(readFileSync(path, 'utf8')));
  console.log('Codex managed MCP http_headers verified');
}
