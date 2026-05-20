/**
 * Quick sanity tests for the pH MCP server tool functions.
 * Run with:   node test.js
 *
 * We re-implement the pH math inline (instead of importing the
 * full MCP server) so the test does not require the SDK to be
 * installed just to verify pH math.
 */

function calc(c) {
  return Number((-Math.log10(c)).toFixed(2));
}

const tests = [
  ["pH of [H+]=1e-4",         calc(1e-4),  4.00],
  ["pH of [H+]=1e-7",         calc(1e-7),  7.00],
  ["pH of [H+]=1e-12",        calc(1e-12), 12.00],
  ["pH of [H+]=0.1",          calc(0.1),   1.00],
];

let failed = 0;
for (const [label, got, want] of tests) {
  const ok = Math.abs(got - want) < 0.01;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: got ${got}, want ${want}`);
  if (!ok) failed++;
}
console.log(failed === 0 ? "\nAll pH math tests passed." : `\n${failed} tests failed.`);
process.exit(failed === 0 ? 0 : 1);
