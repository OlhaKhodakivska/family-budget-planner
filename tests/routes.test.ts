import assert from 'node:assert/strict';
import test from 'node:test';
import { getHashForSection, getRouteFromHash } from '../src/utils/routes';

test('parses dashboard section hashes', () => {
  assert.deepEqual(getRouteFromHash('#/expenses'), { section: 'expenses', goalId: null });
  assert.deepEqual(getRouteFromHash('#/dreams/dream-1'), { section: 'dreams', goalId: 'dream-1' });
  assert.deepEqual(getRouteFromHash('#/missing'), { section: 'overview', goalId: null });
});

test('builds dynamic dashboard hashes', () => {
  assert.equal(getHashForSection('income'), '#/income');
  assert.equal(getHashForSection('dreams', 'dream 1'), '#/dreams/dream%201');
});
