import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CURRENT_APP_VERSION, CURRENT_BUILD_NUMBER, CURRENT_COMMIT } from './otaUpdate';

test('OTA Update: verifies version format and build numbers', () => {
  assert.equal(CURRENT_APP_VERSION, '2.2.0');
  assert.equal(typeof CURRENT_BUILD_NUMBER, 'number');
  assert.equal(CURRENT_BUILD_NUMBER >= 22, true);
  assert.equal(typeof CURRENT_COMMIT, 'string');
  assert.equal(CURRENT_COMMIT.length >= 7, true);
});

test('OTA Update: verifies semantic version parsing logic', () => {
  const isVersionNewer = (v1: string, v2: string): boolean => {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 > p2) return true;
      if (p1 < p2) return false;
    }
    return false;
  };

  assert.equal(isVersionNewer('2.2.1', '2.2.0'), true);
  assert.equal(isVersionNewer('2.3.0', '2.2.0'), true);
  assert.equal(isVersionNewer('3.0.0', '2.2.0'), true);
  assert.equal(isVersionNewer('2.2.0', '2.2.0'), false);
  assert.equal(isVersionNewer('2.1.9', '2.2.0'), false);
});
