'use client';

import { ArrowRight, Check, MessageCircle, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CharacterSprite, preloadCharacter } from './character-sprite';
import { QUESTIONS, RESULTS, TYPE_IDS, type TypeId } from './quiz-data';

type Screen = 'intro' | 'quiz' | 'experience' | 'result';
type Scores = Readonly<Record<TypeId, number>>;
const EMPTY_SCORES: Scores = { guide: 0, hideout: 0, field: 0, rehearsal: 0, quest: 0 };
const STUDY_METHODS = ['학교 수업·시험 준비', '책·앱·영상으로 독학', '학원·과외', '회화스터디·전화·화상영어', '여행·업무·일상에서 사용', '기타', '뚜렷한 경험 없음'] as const;

export default function Home() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Scores>(EMPTY_SCORES);
  const [opportunities, setOpportunities] = useState<Scores>(EMPTY_SCORES);
  const [winners, setWinners] = useState<readonly TypeId[]>(['guide']);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Readonly<Record<number, number>>>({});
  const [studyMethods, setStudyMethods] = useState<readonly string[]>([]);
  const question = QUESTIONS[questionIndex];

  function start(): void {
    setScores(EMPTY_SCORES); setOpportunities(EMPTY_SCORES); setQuestionIndex(0); setSelected(null); setAnswers({}); setStudyMethods([]); setScreen('quiz');
  }

  function answer(optionIndex: number): void {
    if (!question || selected) return;
    const option = question.options[optionIndex];
    if (!option) return;
    setSelected(optionIndex + 1);
    const nextScores = option.type ? { ...scores, [option.type]: scores[option.type] + 1 } : scores;
    const scoredTypes = question.options.flatMap((item) => item.type ? [item.type] : []);
    const nextOpportunities = option.type ? scoredTypes.reduce<Scores>((current, type) => ({ ...current, [type]: current[type] + 1 }), opportunities) : opportunities;
    setAnswers((current) => ({ ...current, [questionIndex + 1]: optionIndex }));
    window.setTimeout(() => {
      if (questionIndex === QUESTIONS.length - 1) {
        setScores(nextScores); setOpportunities(nextOpportunities); setScreen('experience');
      } else {
        setScores(nextScores); setOpportunities(nextOpportunities); setQuestionIndex((current) => current + 1); setSelected(null); window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }, 240);
  }

  async function showResult(): Promise<void> {
    const ratios = TYPE_IDS.map((type) => ({ type, ratio: opportunities[type] === 0 ? 0 : scores[type] / opportunities[type] }));
    const highest = Math.max(...ratios.map(({ ratio }) => ratio));
    const nextWinners = ratios.filter(({ ratio }) => Math.abs(ratio - highest) < Number.EPSILON).map(({ type }) => type);
    const primaryType = nextWinners[0] ?? 'guide';
    await preloadCharacter(RESULTS[primaryType].sprite);
    setWinners(nextWinners);
    setScreen('result'); window.scrollTo({ top: 0, behavior: 'auto' });
  }

  return (
    <main className="site-shell">
      <header className="masthead">
        <button className="brand" type="button" onClick={() => setScreen('intro')} aria-label="처음 화면으로"><span className="brand-hook">내가 말을 못 하는 진짜 이유?</span><span className="brand-title">더박스 영어회화 유형 진단</span></button>
        <span className="issue">TYPE TEST · 20 QUESTIONS</span>
      </header>
      {screen === 'intro' && (
        <section className="intro stage" aria-labelledby="intro-title">
          <div className="intro-copy">
            <span className="eyebrow"><Sparkles size={16} /> 3분이면 발견하는 나의 영어 환경</span>
            <h1 id="intro-title">나는 어떤 환경에서<br /><em>영어를 가장 잘 배울까?</em></h1>
            <p>영어가 안 느는 이유는 의지가 부족해서가 아니라, 나에게 맞는 환경을 만나지 못했기 때문일 수도 있어요.</p>
            <p className="intro-strong">잘하고 싶은 모습보다, 평소의 내 모습에 가까운 답을 골라주세요. 둘 다 맞는 것 같다면 조금 더 자주 느끼거나 행동하는 쪽을 선택해주세요.</p>
            <Button className="primary-action" size="lg" onClick={start}>테스트 시작하기 <ArrowRight aria-hidden="true" /></Button>
          </div>
          <div className="intro-art" aria-hidden="true">
            <span className="art-sticker sticker-one">NO WRONG<br />ANSWERS!</span>
            <CharacterSprite position={[0, 1]} label="" className="hero-sprite" />
            <span className="art-sticker sticker-two">READY?</span>
          </div>
        </section>
      )}
      {screen === 'quiz' && question && (
        <section className="quiz-stage" aria-labelledby="question-title">
          <div className="part-label">PART {question.part}. {question.part === 1 ? '평소의 나는?' : '영어 앞에서는 어떤 내가 될까?'}</div>
          <div className="progress-copy"><span>{String(questionIndex + 1).padStart(2, '0')} / 20</span><span>평소의 내 모습에 더 가까운 답을 골라주세요</span></div>
          <Progress value={(questionIndex + 1) * 5} aria-label={`20문항 중 ${questionIndex + 1}번째`} className="quiz-progress" />
          <article className="question-card" key={questionIndex} aria-live="polite">
            <h2 id="question-title">{question.prompt}</h2>
            <div className="choices">
              {question.options.map((option, index) => (
                <button key={option.label} type="button" className="choice" data-selected={selected === index + 1} onClick={() => answer(index)} disabled={selected !== null}>
                  <span className="choice-index">{String(index + 1).padStart(2, '0')}</span><span>{option.label}</span><span className="choice-check" aria-hidden="true"><Check /></span>
                </button>
              ))}
            </div>
          </article>
        </section>
      )}
      {screen === 'experience' && (
        <section className="quiz-stage experience-stage" aria-labelledby="experience-title">
          <article className="question-card">
            <span className="part-label">LAST STEP · 점수에는 반영되지 않아요</span>
            <h2 id="experience-title">지금까지 해본 영어공부 방법을 모두 골라주세요.</h2>
            <div className="method-grid">{STUDY_METHODS.map((method) => <button key={method} type="button" className="method-choice" data-selected={studyMethods.includes(method)} onClick={() => setStudyMethods((current) => current.includes(method) ? current.filter((item) => item !== method) : [...current, method])}><Check aria-hidden="true" />{method}</button>)}</div>
            <Button className="primary-action" disabled={studyMethods.length === 0} onClick={() => void showResult()}>결과 확인하기 <ArrowRight aria-hidden="true" /></Button>
          </article>
        </section>
      )}
      {screen === 'result' && <ResultScreen types={winners} answers={answers} restart={start} />}
    </main>
  );
}

function ResultScreen({ types, answers, restart }: { readonly types: readonly TypeId[]; readonly answers: Readonly<Record<number, number>>; readonly restart: () => void }) {
  const type = types[0] ?? 'guide';
  const result = RESULTS[type];
  const [shareStatus, setShareStatus] = useState('');
  const typeNames = types.map((item) => RESULTS[item].name);
  const personalNote = answers[1] === 0 && answers[13] === 0
    ? { title: '평소에는 즉흥적인데, 영어 앞에서는 준비 시간이 필요해요.', body: '일상에서는 “일단 움직여보자”는 쪽을 골랐지만, 영어로 말할 때는 내용을 먼저 정리하는 쪽을 선택했어요. 평소의 행동 방식과 영어 앞에서 편하게 느끼는 조건이 조금 다르게 나타났네요.' }
    : answers[4] === 0 && answers[15] === 0
      ? { title: '마음은 사람과 풀지만, 영어로 할 말은 먼저 정리하고 싶어요.', body: '복잡한 마음은 편한 사람과 나누는 쪽을 골랐고, 영어로 말하기 전에는 내 이야기를 메모할 시간을 선택했어요. 함께하는 사람도 중요하지만, 바로 대답해야 한다는 부담은 덜고 싶은 모습이에요.' }
      : null;

  async function shareTest(): Promise<void> {
    const url = new URL(window.location.pathname, window.location.origin).href;
    if (navigator.share) {
      try {
        await navigator.share({ title: '나의 영어 성향 테스트', text: '나는 어떤 환경에서 영어를 가장 잘 배울까?', url });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) throw error;
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setShareStatus('첫 페이지 링크를 복사했어요!');
  }

  function restartFromTop(): void {
    restart();
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  }

  return (
    <section className="result-stage" data-type={type} aria-labelledby="result-title">
      <div className="result-hero"><div><span className="eyebrow">{types.length > 1 ? 'YOUR ENGLISH TYPES ARE' : 'YOUR ENGLISH TYPE IS'}</span><h1 id="result-title">{types.length > 1 ? '복합형' : result.name}</h1><p className="result-headline">{types.length > 1 ? `${typeNames.join(' × ')} 성향이 함께 나타났어요` : result.headline}</p><div className="tags">{result.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div><CharacterSprite position={result.sprite} label={`${result.name} 더박스 캐릭터`} className="result-sprite" /></div>
      {personalNote && <section className="personal-note"><span>평소의 나와 영어 앞의 나</span><strong>{personalNote.title}</strong><p>{personalNote.body}</p></section>}
      <article className="result-story">
        <p className="result-intro">{result.intro}</p>
        <div className="result-grid">
          <section className="moment-card"><span>이런 순간, 나 같지 않나요?</span><strong>{result.momentQuote}</strong><p>{result.moment}</p></section>
          <aside className="grow-card"><span className="grow-label">이런 환경에서 잘 자라요</span><ul>{result.grows.map((item) => <li key={item}><Check aria-hidden="true" /><span>{item.replace(/ (\S+)$/, '\u00a0$1')}</span></li>)}</ul></aside>
        </div>
        <p className="result-fit">{result.fit}</p>
      </article>
      <section className="friction-card"><span>반대로, 이런 환경은 답답할 수 있어요</span><p>{result.friction}</p></section>
      <blockquote>{result.closing}</blockquote>
      <div className="result-actions">
        <a className="consult-action" href="https://naver.me/5BcFp4RM" target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> 영어회화 상담받아보기</a>
        <button className="share-action" type="button" onClick={() => void shareTest()}><Share2 aria-hidden="true" /> 친구에게 공유하기</button>
      </div>
      <p className="share-status" aria-live="polite">{shareStatus}</p>
      <Button className="restart-action" variant="outline" size="lg" onClick={restartFromTop}><RotateCcw aria-hidden="true" /> 다시 테스트하기</Button>
      <p className="test-disclaimer">이 테스트는 일상과 영어 상황에서 드러난 선호를 살펴보는 오락형 성향 테스트입니다. MBTI 검사나 심리 진단, 학습 효과를 검증하는 검사는 아닙니다.</p>
    </section>
  );
}
