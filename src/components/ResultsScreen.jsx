import { useState } from 'react'

export default function ResultsScreen({ result, questions, studentName, onGoHome, onRetry }) {
  const [reviewMode, setReviewMode] = useState(null) // null | 'errors' | 'all'

  const percentage = Math.round((result.score / result.totalQuestions) * 100)
  const passed = percentage >= 60

  const subjectData = [
    { key: 'biology', label: 'Biología', color: 'bio-green', icon: '🧬' },
    { key: 'chemistry', label: 'Química', color: 'chem-purple', icon: '⚗️' },
    { key: 'math', label: 'Matemáticas', color: 'math-blue', icon: '📐' },
  ]

  const wrongByTopic = {}
  result.answers.forEach((a) => {
    if (!a.correct) {
      if (!wrongByTopic[a.topic]) wrongByTopic[a.topic] = 0
      wrongByTopic[a.topic]++
    }
  })
  const sortedWeakTopics = Object.entries(wrongByTopic).sort((a, b) => b[1] - a[1])

  const reviewAnswers = reviewMode
    ? result.answers
        .map((answer, idx) => {
          const question = questions.find((q) => q.id === answer.questionId)
          return question ? { ...answer, question, index: idx + 1 } : null
        })
        .filter(Boolean)
        .filter((item) => reviewMode === 'all' || !item.correct)
    : []

  if (reviewMode) {
    return (
      <ReviewPanel
        answers={reviewAnswers}
        mode={reviewMode}
        onBack={() => setReviewMode(null)}
        totalQuestions={result.totalQuestions}
      />
    )
  }

  return (
    <div className="min-h-screen px-3 py-4 sm:p-4 md:p-8 safe-bottom">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="relative inline-block">
            <div className="absolute -top-3 -left-4 sm:-top-4 sm:-left-8 w-10 h-10 sm:w-16 sm:h-16 bg-primary-yellow -rotate-12 opacity-60" />
            <div className="absolute -top-1 -right-3 sm:-top-2 sm:-right-6 w-8 h-8 sm:w-12 sm:h-12 bg-primary-red rotate-6 opacity-40" />
            <h1 className="relative font-display text-5xl sm:text-6xl md:text-8xl text-primary-black">
              RESULTADOS
            </h1>
          </div>
          <p className="font-heading text-base sm:text-lg uppercase tracking-widest text-gray-500 mt-2">
            {studentName}
          </p>
        </div>

        {/* Main score */}
        <div className={`geo-border p-5 sm:p-8 mb-6 sm:mb-8 text-center ${passed ? 'bg-bio-green/5' : 'bg-primary-red/5'}`}>
          <div className="font-display text-6xl sm:text-8xl md:text-[10rem] leading-none">
            <span className={passed ? 'text-bio-green' : 'text-primary-red'}>
              {result.score}
            </span>
            <span className="text-gray-300">/{result.totalQuestions}</span>
          </div>
          <div className="mt-3 sm:mt-4 font-heading text-xl sm:text-2xl uppercase">
            {percentage}% — {passed ? '¡APROBADO!' : 'NO APROBADO'}
          </div>
          <div className="mt-1 sm:mt-2 font-body text-xs sm:text-sm text-gray-500">
            {new Date(result.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        {/* Review buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setReviewMode('errors')}
            disabled={result.score === result.totalQuestions}
            className="px-4 sm:px-6 py-4 bg-primary-red/10 text-primary-black font-heading text-base sm:text-lg uppercase tracking-wide
              border-3 sm:border-4 border-primary-red shadow-[4px_4px_0px_#D62828] sm:shadow-[5px_5px_0px_#D62828]
              active:shadow-[2px_2px_0px_#D62828] active:translate-x-0.5 active:translate-y-0.5
              transition-all disabled:opacity-30 disabled:cursor-not-allowed min-h-[60px]"
          >
            <span className="block">✗ Ver errores</span>
            <span className="block text-sm font-body normal-case text-primary-red">
              {result.totalQuestions - result.score} preguntas falladas
            </span>
          </button>
          <button
            onClick={() => setReviewMode('all')}
            className="px-4 sm:px-6 py-4 bg-primary-blue/10 text-primary-black font-heading text-base sm:text-lg uppercase tracking-wide
              border-3 sm:border-4 border-primary-blue shadow-[4px_4px_0px_#003566] sm:shadow-[5px_5px_0px_#003566]
              active:shadow-[2px_2px_0px_#003566] active:translate-x-0.5 active:translate-y-0.5
              transition-all min-h-[60px]"
          >
            <span className="block">☰ Ver todas</span>
            <span className="block text-sm font-body normal-case text-primary-blue">
              {result.totalQuestions} preguntas completas
            </span>
          </button>
        </div>

        {/* Subject breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {subjectData.map(({ key, label, color, icon }) => {
            const data = result.bySubject[key]
            if (!data || data.total === 0) return null
            const pct = Math.round((data.correct / data.total) * 100)
            return (
              <div key={key} className="border-3 sm:border-4 border-primary-black p-3 sm:p-4 bg-primary-white shadow-[3px_3px_0px_#1A1A1A] sm:shadow-[4px_4px_0px_#1A1A1A]">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-2xl">{icon}</span>
                  <span className="font-heading text-xs sm:text-sm uppercase tracking-widest">{label}</span>
                </div>
                <div className={`font-display text-3xl sm:text-4xl text-${color}`}>
                  {data.correct}/{data.total}
                </div>
                <div className="mt-2 h-2 sm:h-3 bg-gray-200 relative">
                  <div
                    className={`absolute inset-y-0 left-0 bg-${color} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 font-body text-xs text-right text-gray-500">{pct}%</div>
              </div>
            )
          })}
        </div>

        {/* Weak topics */}
        {sortedWeakTopics.length > 0 && (
          <div className="border-3 sm:border-4 border-primary-red p-4 sm:p-6 mb-6 sm:mb-8 bg-primary-red/5">
            <h2 className="font-heading text-lg sm:text-xl uppercase tracking-wide mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-3 h-3 sm:w-4 sm:h-4 bg-primary-red inline-block rotate-45" />
              Temas a reforzar
            </h2>
            <div className="grid gap-2">
              {sortedWeakTopics.slice(0, 8).map(([topic, count]) => (
                <div key={topic} className="flex items-center justify-between font-body text-xs sm:text-sm py-1 border-b border-primary-red/20">
                  <span className="mr-2">{topic}</span>
                  <span className="font-heading text-primary-red whitespace-nowrap">{count} err.</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={onRetry}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-primary-red text-white font-heading text-lg sm:text-xl uppercase tracking-wide
              border-3 sm:border-4 border-primary-black shadow-[4px_4px_0px_#1A1A1A] sm:shadow-[6px_6px_0px_#1A1A1A]
              active:shadow-[2px_2px_0px_#1A1A1A] active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[48px]"
          >
            ↻ Repetir examen
          </button>
          <button
            onClick={onGoHome}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-primary-white text-primary-black font-heading text-lg sm:text-xl uppercase tracking-wide
              border-3 sm:border-4 border-primary-black shadow-[4px_4px_0px_#1A1A1A] sm:shadow-[6px_6px_0px_#1A1A1A]
              active:shadow-[2px_2px_0px_#1A1A1A] active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[48px]"
          >
            ← Inicio
          </button>
        </div>
      </div>
    </div>
  )
}

function ReviewPanel({ answers, mode, onBack, totalQuestions }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const current = answers[currentIdx]

  if (!answers.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="geo-border p-6 sm:p-8 bg-primary-white text-center max-w-sm">
          <p className="font-heading text-xl uppercase mb-4">¡Sin errores!</p>
          <p className="font-body text-sm text-gray-600 mb-6">No tienes preguntas falladas. ¡Perfecto!</p>
          <button onClick={onBack} className="px-6 py-3 bg-primary-black text-white font-heading uppercase min-h-[44px]">
            ← Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-3 py-4 sm:p-4 md:p-8 safe-bottom">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <button
            onClick={onBack}
            className="px-3 sm:px-4 py-2 font-heading uppercase text-xs sm:text-sm border-2 sm:border-3 border-primary-black
              active:bg-primary-black active:text-white transition-colors min-h-[40px] flex-shrink-0"
          >
            ← <span className="hidden sm:inline">Resultados</span>
          </button>
          <div className="font-heading text-xs sm:text-sm uppercase tracking-widest text-gray-500 text-right">
            {mode === 'errors' ? 'Errores' : 'Completa'}
            {' · '}{currentIdx + 1}/{answers.length}
          </div>
        </div>

        {/* Question card */}
        <div className={`border-3 sm:border-4 p-4 sm:p-6 mb-4 sm:mb-6 ${current.correct ? 'border-bio-green bg-bio-green/5' : 'border-primary-red bg-primary-red/5'}`}>
          {/* Status badge */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
            <span className={`inline-block px-2 sm:px-3 py-1 text-xs font-heading uppercase tracking-widest
              ${current.correct ? 'bg-bio-green text-white' : 'bg-primary-red text-white'}`}>
              {current.correct ? '✓ Correcta' : '✗ Incorrecta'}
            </span>
            <span className="font-body text-xs text-gray-500">
              P.{current.index} · {current.question.topic}
            </span>
          </div>

          {/* Question text */}
          <p className="font-body text-base sm:text-lg leading-relaxed text-primary-black mb-4 sm:mb-6">
            {current.question.question}
          </p>

          {/* Options */}
          <div className="grid gap-2">
            {Object.entries(current.question.options).map(([key, value]) => {
              const isCorrectAnswer = key === current.correctAnswer
              const isStudentAnswer = key === current.selected
              const isWrongSelection = isStudentAnswer && !current.correct

              let optionStyle = 'border-gray-200 bg-white'
              if (isCorrectAnswer) {
                optionStyle = 'border-bio-green bg-bio-green/10'
              } else if (isWrongSelection) {
                optionStyle = 'border-primary-red bg-primary-red/10'
              }

              return (
                <div
                  key={key}
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 border-2 sm:border-3 ${optionStyle} flex items-center gap-2 sm:gap-3`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 border-2 font-heading text-xs sm:text-sm flex-shrink-0
                    ${isCorrectAnswer
                      ? 'border-bio-green bg-bio-green text-white'
                      : isWrongSelection
                        ? 'border-primary-red bg-primary-red text-white'
                        : 'border-gray-300'
                    }`}>
                    {key.toUpperCase()}
                  </span>
                  <span className="font-body text-xs sm:text-sm flex-1 min-w-0">{value}</span>
                  {isCorrectAnswer && (
                    <span className="text-bio-green font-heading text-[10px] sm:text-xs uppercase flex-shrink-0">✓</span>
                  )}
                  {isWrongSelection && (
                    <span className="text-primary-red font-heading text-[10px] sm:text-xs uppercase flex-shrink-0">✗</span>
                  )}
                </div>
              )
            })}
          </div>

          {!current.selected && (
            <p className="mt-3 font-body text-xs sm:text-sm text-gray-500 italic">
              — No respondiste esta pregunta
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="px-3 sm:px-5 py-2.5 font-heading uppercase tracking-wide text-sm
              border-2 sm:border-3 border-primary-black min-h-[44px]
              active:bg-primary-black active:text-white transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ←
          </button>

          <span className="font-body text-xs sm:text-sm text-gray-500">
            {currentIdx + 1} / {answers.length}
          </span>

          <button
            onClick={() => setCurrentIdx(Math.min(answers.length - 1, currentIdx + 1))}
            disabled={currentIdx === answers.length - 1}
            className="px-3 sm:px-5 py-2.5 font-heading uppercase tracking-wide text-sm
              border-2 sm:border-3 border-primary-black min-h-[44px]
              active:bg-primary-black active:text-white transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>

        {/* Mini navigator */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 border-2 border-primary-black bg-accent-cream/20">
          <div className="flex flex-wrap gap-1">
            {answers.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`w-7 h-7 sm:w-7 sm:h-7 text-[10px] sm:text-xs font-body border transition-all
                  ${idx === currentIdx
                    ? 'bg-primary-black text-white border-primary-black scale-110'
                    : item.correct
                      ? 'bg-bio-green/20 border-bio-green'
                      : 'bg-primary-red/20 border-primary-red'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
