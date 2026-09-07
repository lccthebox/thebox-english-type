# The Box English Type — Design Contract

## 0. Research Log

- Embedded references: shortlisted Spotify (high-energy editorial contrast), Duolingo (playful learning feedback), and Stripe (polished layered surfaces). Selected Spotify as the dominant layout grammar because the experience should feel entertainment-first; adapted without brand assets or copy.
- Real-product screen lane: network-dependent screen research was unavailable within the local build path; the supplied character sheets provide stronger product-specific visual direction.
- Imagen draft lane: omitted because the user supplied an extensive original character system; generating replacement concepts would dilute the established IP rather than improve the test.

## 1. Direction

Atmosphere: a confident digital personality magazine with the momentum of a game show. Signature material: crisp white quiz cards floating over a deep ink stage with electric coral and lime spotlights. Memorable moment: the chosen answer snaps forward and the character “hosts” the transition into the next question.

## 2. Audience and Jobs

- Primary: Korean adults curious about why English study has not stuck.
- Job: complete ten low-friction choices and receive a specific, reassuring learning-environment diagnosis.
- Cognitive constraint: one question and five short choices at a time; no English proficiency jargon.

## 3. Tokens

- Ink `#111116`; paper `#FFFDF8`; coral `#FF5B3D`; lime `#C9F24A`; lilac `#B8A7FF`; cyan `#74DDF2`.
- Display: system sans, black weight, compressed letter spacing. Body: system sans, regular/semibold.
- Spacing rhythm: 4, 8, 12, 16, 24, 32, 48, 64.
- Radii: 14 controls, 24 cards, 999 pills.
- Shadow: hard offset for playful depth; soft ambient only behind the main stage.

## 4. Layout

- Start: compact masthead, editorial headline, character sprite and direct CTA above the fold; no secondary statistics row beneath the CTA.
- Quiz: two themed parts (`평소의 나는?`, `영어 앞에서는 어떤 내가 될까?`), progress rail, question count, one prompt, two response cards (plus an unscored no-experience option where relevant), followed by one unscored multi-select experience step.
- Result: result badge and sprite, full-width diagnosis, balanced moment/environment cards, fit summary, friction note, closing statement and actions.
- Mobile: single column, 16px gutters, tap targets at least 48px. Desktop: two-column stage for start/result; quiz stays narrow for focus.

## 5. Primitives and States

- `StageCard`: paper surface, ink border, offset shadow; default only.
- `PrimaryAction`: coral fill; hover lifts 2px, active returns to baseline, visible focus ring, disabled muted.
- `IntroGuide`: question hook, short cause statement and two scannable honesty rules; bold emphasis carries the reading path on mobile.
- `ChoiceCard`: paper default; hover/keyboard focus highlights coral edge; selected fills lime and advances after brief confirmation.
- `TieBreakerCard`: shown only for a shared top score; presents only the tied types as equal priority choices, does not change their scores, and allows an explicit composite-result skip.
- `ProgressRail`: ten semantic segments; complete coral, current lime, future translucent.
- `CharacterSprite`: supplied transparent sprite sheet cropped through reusable row/column positioning.
- `ResultTag`: compact uppercase/pill metadata treatment.
- `SecondaryTypeNote`: when the runner-up is exactly one point behind, keeps the winner visually primary and explains the nearby preference without labeling the result composite.
- `ResultDetailPair`: equal-height moment and environment cards on desktop; a single readable stack on mobile.
- `ResultActionGroup`: study consultation, academy consultation, and sharing as three equally weighted actions; separated from the closing statement by 24px (16px on mobile), followed by a centered tertiary restart action.
- `ResultGuide`: a clearly caveated next-step card that frames advice as an experiment based on the current answers, followed by one concrete same-day mission.

## 6. Motion

- 180ms ease-out for hover/press feedback; 260ms ease-out for question entrance.
- Quiz, tie-breaker, and result stages share the same 260ms entrance rhythm so screen changes feel continuous; mobile density is reduced without shrinking tap targets below 48px.
- Only stateful elements move. No ambient looping animation.
- `prefers-reduced-motion` removes transforms and transitions.

## 7. Accessibility

- Semantic buttons for every answer; visible `:focus-visible` ring.
- Question changes announced in a polite live region.
- Color never carries progress alone; numbers and text remain present.
- Korean line breaking uses `word-break: keep-all` and generous line height.

## 8. Accepted Debt

- The supplied sprite sheet is cropped at runtime instead of shipping five separately exported image files. This preserves source fidelity and keeps the build reversible; screen-reader meaning is provided as text.
