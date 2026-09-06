'use client';

import { ArrowRight, Check, MessageCircle, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CharacterSprite } from './character-sprite';
import { QUESTIONS, RESULTS, TYPE_IDS, type TypeId } from './quiz-data';

type Screen = 'intro' | 'quiz' | 'result';
type Scores = Readonly<Record<TypeId, number>>;
const EMPTY_SCORES: Scores = { guide: 0, hideout: 0, field: 0, rehearsal: 0, quest: 0 };

export default function Home() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Scores>(EMPTY_SCORES);
  const [winner, setWinner] = useState<TypeId>('guide');
  const [selected, setSelected] = useState<TypeId | null>(null);
  const question = QUESTIONS[questionIndex];

  function start(): void {
    setScores(EMPTY_SCORES); setQuestionIndex(0); setSelected(null); setScreen('quiz');
  }

  function answer(type: TypeId): void {
    if (!question || selected) return;
    setSelected(type);
    const nextScores = { ...scores, [type]: scores[type] + question.weight };
    window.setTimeout(() => {
      if (questionIndex === QUESTIONS.length - 1) {
        const result = TYPE_IDS.reduce((best, candidate) => nextScores[candidate] > nextScores[best] ? candidate : best);
        setScores(nextScores); setWinner(result); setScreen('result');
      } else {
        setScores(nextScores); setQuestionIndex((current) => current + 1); setSelected(null);
      }
    }, 240);
  }

  return (
    <main className="site-shell">
      <header className="masthead">
        <button className="brand" type="button" onClick={() => setScreen('intro')} aria-label="처음 화면으로"><span className="brand-hook">내가 말을 못 하는 진짜 이유?</span><span className="brand-title">더박스 영어회화 유형 진단</span></button>
        <span className="issue">TYPE TEST · 10 QUESTIONS</span>
      </header>
      {screen === 'intro' && (
        <section className="intro stage" aria-labelledby="intro-title">
          <div className="intro-copy">
            <span className="eyebrow"><Sparkles size={16} /> 3분이면 발견하는 나의 영어 환경</span>
            <h1 id="intro-title">나는 어떤 환경에서<br /><em>영어를 가장 잘 배울까?</em></h1>
            <p>영어가 안 느는 이유는 의지가 부족해서가 아니라, 나에게 맞는 환경을 만나지 못했기 때문일 수도 있어요.</p>
            <p className="intro-strong">무작정 더 오래 공부하기보다, 내가 자연스럽게 배우고 말할 수 있는 조건을 찾아보세요.</p>
            <Button className="primary-action" size="lg" onClick={start}>테스트 시작하기 <ArrowRight aria-hidden="true" /></Button>
            <div className="intro-meta"><span>10개의 상황 질문</span><span>5가지 영어 성향</span><span>약 3분</span></div>
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
          <div className="progress-copy"><span>{String(questionIndex + 1).padStart(2, '0')} / 10</span><span>나에게 더 가까운 답을 골라주세요</span></div>
          <Progress value={(questionIndex + 1) * 10} aria-label={`10문항 중 ${questionIndex + 1}번째`} className="quiz-progress" />
          <article className="question-card" key={questionIndex} aria-live="polite">
            <span className="weight">THIS ONE COUNTS ×{question.weight}</span>
            <h2 id="question-title">{question.prompt}</h2>
            <div className="choices">
              {TYPE_IDS.map((type, index) => (
                <button key={type} type="button" className="choice" data-selected={selected === type} onClick={() => answer(type)} disabled={selected !== null}>
                  <span className="choice-index">{String(index + 1).padStart(2, '0')}</span><span>{question.options[type]}</span><span className="choice-check" aria-hidden="true"><Check /></span>
                </button>
              ))}
            </div>
          </article>
        </section>
      )}
      {screen === 'result' && <ResultScreen type={winner} restart={start} />}
    </main>
  );
}

function ResultScreen({ type, restart }: { readonly type: TypeId; readonly restart: () => void }) {
  const result = RESULTS[type];
  const [shareStatus, setShareStatus] = useState('');

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

  return (
    <section className="result-stage" data-type={type} aria-labelledby="result-title">
      <div className="result-hero"><div><span className="eyebrow">YOUR ENGLISH TYPE IS</span><h1 id="result-title">{result.name}</h1><p className="result-headline">{result.headline}</p><div className="tags">{result.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div><CharacterSprite position={result.sprite} label={`${result.name} 더박스 캐릭터`} className="result-sprite" /></div>
      <div className="result-grid"><article className="result-story"><p>{result.intro}</p><section className="moment-card"><span>이런 순간, 나 같지 않나요?</span><strong>{result.momentQuote}</strong><p>{result.moment}</p></section><p>{result.fit}</p></article><aside className="grow-card"><span className="grow-label">이런 환경에서 잘 자라요</span><ul>{result.grows.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></aside></div>
      <section className="friction-card"><span>반대로, 이런 환경은 답답할 수 있어요</span><p>{result.friction}</p></section>
      <blockquote>{result.closing}</blockquote>
      <div className="result-actions">
        <a className="consult-action" href="https://naver.me/5BcFp4RM" target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> 영어회화 상담받아보기</a>
        <button className="share-action" type="button" onClick={() => void shareTest()}><Share2 aria-hidden="true" /> 친구에게 공유하기</button>
      </div>
      <p className="share-status" aria-live="polite">{shareStatus}</p>
      <Button className="restart-action" variant="outline" size="lg" onClick={restart}><RotateCcw aria-hidden="true" /> 다시 테스트하기</Button>
    </section>
  );
}
