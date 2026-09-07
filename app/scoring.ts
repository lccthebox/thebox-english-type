import { TYPE_IDS, type TypeId } from './quiz-data.ts';

export type Scores = Readonly<Record<TypeId, number>>;

export type ScoreOutcome =
  | { readonly kind: 'tie'; readonly candidates: readonly TypeId[] }
  | { readonly kind: 'winner'; readonly primary: TypeId; readonly secondary: readonly TypeId[] };

export function addScore(scores: Scores, type: TypeId | null): Scores {
  return type ? { ...scores, [type]: scores[type] + 1 } : scores;
}

export function determineOutcome(scores: Scores): ScoreOutcome {
  const ranked = TYPE_IDS.map((type) => ({ type, score: scores[type] })).sort((a, b) => b.score - a.score);
  const leader = ranked[0];
  if (!leader) return { kind: 'winner', primary: 'guide', secondary: [] };

  const tiedLeaders = ranked.filter(({ score }) => score === leader.score).map(({ type }) => type);
  if (tiedLeaders.length > 1) return { kind: 'tie', candidates: tiedLeaders };

  const runnerUpScore = ranked[1]?.score ?? 0;
  const secondary = leader.score - runnerUpScore === 1
    ? ranked.filter(({ type, score }) => type !== leader.type && score === runnerUpScore).map(({ type }) => type)
    : [];
  return { kind: 'winner', primary: leader.type, secondary };
}
