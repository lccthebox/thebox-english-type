import assert from 'node:assert/strict';
import test from 'node:test';
import { addScore, determineOutcome, type Scores } from './scoring.ts';

const ZERO: Scores = { guide: 0, hideout: 0, field: 0, rehearsal: 0, quest: 0 };

void test('a scored answer adds exactly one point and an unscored answer adds none', () => {
  assert.deepEqual(addScore(ZERO, 'field'), { ...ZERO, field: 1 });
  assert.strictEqual(addScore(ZERO, null), ZERO);
});

void test('a unique leader is the representative type', () => {
  assert.deepEqual(determineOutcome({ guide: 7, hideout: 4, field: 4, rehearsal: 3, quest: 2 }), { kind: 'winner', primary: 'guide', secondary: [] });
});

void test('types exactly one point behind are secondary, not composite', () => {
  assert.deepEqual(determineOutcome({ guide: 6, hideout: 5, field: 3, rehearsal: 5, quest: 1 }), { kind: 'winner', primary: 'guide', secondary: ['hideout', 'rehearsal'] });
});

void test('only types tied for the highest score become tie candidates', () => {
  assert.deepEqual(determineOutcome({ guide: 6, hideout: 6, field: 4, rehearsal: 4, quest: 2 }), { kind: 'tie', candidates: ['guide', 'hideout'] });
  assert.deepEqual(determineOutcome({ guide: 7, hideout: 4, field: 4, rehearsal: 3, quest: 2 }), { kind: 'winner', primary: 'guide', secondary: [] });
});
