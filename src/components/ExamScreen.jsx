import { useState, useEffect, useCallback } from 'react'

export default function ExamScreen({ questions, timeLimit, onFinish, onQuit, studentName }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [showConfirmQuit, setShowConfirmQuit] = useState(false)
  const [showConfirmFinish, setShowConfirmFinish] = useState(false)
  const [showNavigator, setShowNavigator] = useState(false)

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinish()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleFinish = useCallback(() => {
    const results = questions.map((q, idx) => ({
      questionId: q.id,
      topic: q.topic,
      selected: answers[idx] || null,
      correct: answers[idx] === q.correct,
      correctAnswer: q.correct,
    }))
    onFinish(results)
  }, [answers, questions, onFinish])

  function selectAnswer(optionKey) {
    setAnswers({ ...answers, [currentIndex]: optionKey })
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const question = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100
  const isLowTime = timeRemaining < 300

  function getSubjectColor() {
    if (question.topic) {
      const bioTopics = ['Biología celular', 'Biomoléculas', 'Genética', 'Microbiología', 'Histología y fisiología humana', 'Ecología y evolución', 'Historia de la biología']
      const chemTopics = ['Estructura atómica', 'Tabla periódica', 'Enlace químico', 'Formulación y nomenclatura', 'Estequiometría', 'Disoluciones', 'Termodinámica y cinética', 'Química orgánica', 'Historia de la química']
      if (bioTopics.includes(question.topic)) return 'bio-green'
      if (chemTopics.includes(question.topic)) return 'chem-purple'
      return 'math-blue'
    }
    return 'primary-black'
  }

  const subjectColor = getSubjectColor()

  return (
    <div className="min-h-screen flex flex-col safe-top">
      {/* Top bar: timer + progress — responsive layout */}
      <div className="sticky top-0 z-50 bg-primary-black text-primary-white px-3 sm:px-4 py-2 sm:py-3">
        <div className="max-w-4xl mx-auto">
          {/* Mobile: timer prominent, info below */}
          <div className="flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-4">
              <span className="font-heading text-sm uppercase tracking-widest opacity-70">
                {studentName}
              </span>
              <span className="text-xs opacity-50">|</span>
              <span className="font-body text-sm">
                {answeredCount}/{questions.length}
              </span>
            </div>
            {/* Mobile: compact info */}
            <div className="sm:hidden flex items-center gap-2">
              <span className="font-body text-xs opacity-70">
                {answeredCount}/{questions.length}
              </span>
              <button
                onClick={() => setShowNavigator(!showNavigator)}
                className="font-body text-xs bg-gray-700 px-2 py-1 rounded active:bg-gray-600"
              >
                ☰
              </button>
            </div>

            <div className={`font-display text-2xl sm:text-3xl ${isLowTime ? 'text-primary-red timer-warning' : 'text-primary-yellow'}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-1.5 sm:mt-2 h-1.5 sm:h-2 bg-gray-700 relative">
            <div
              className="absolute inset-y-0 left-0 bg-primary-yellow progress-stripes transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mobile navigator drawer */}
      {showNavigator && (
        <div className="sm:hidden bg-accent-cream/95 border-b-3 border-primary-black p-3 sticky top-[52px] z-40">
          <div className="flex flex-wrap gap-1">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentIndex(idx); setShowNavigator(false) }}
                className={`w-8 h-8 text-xs font-body border transition-all
                  ${idx === currentIndex
                    ? 'bg-primary-black text-white border-primary-black'
                    : answers[idx]
                      ? 'bg-primary-yellow border-primary-black'
                      : 'bg-white border-gray-300'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-8">
        {/* Question header */}
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div>
            <span className={`inline-block px-2 sm:px-3 py-1 text-xs font-heading uppercase tracking-widest bg-${subjectColor} text-white mb-1 sm:mb-2`}>
              {question.topic}
            </span>
            <div className="font-heading text-xs sm:text-sm text-gray-500 uppercase">
              Pregunta {currentIndex + 1} de {questions.length}
            </div>
          </div>
        </div>

        {/* Question text */}
        <div className="geo-border bg-primary-white p-4 sm:p-6 mb-5 sm:mb-8">
          <p className="font-body text-base sm:text-lg md:text-xl leading-relaxed text-primary-black">
            {question.question}
          </p>
        </div>

        {/* Options — full-width stacked, large touch targets */}
        <div className="grid gap-2 sm:gap-3">
          {Object.entries(question.options).map(([key, value]) => {
            const isSelected = answers[currentIndex] === key
            return (
              <button
                key={key}
                onClick={() => selectAnswer(key)}
                className={`text-left px-3 sm:px-5 py-3 sm:py-4 border-3 sm:border-4 transition-all font-body min-h-[48px] flex items-center
                  ${isSelected
                    ? 'border-primary-red bg-primary-red/10 shadow-[3px_3px_0px_#D62828] sm:shadow-[4px_4px_0px_#D62828]'
                    : 'border-primary-black bg-primary-white active:bg-gray-50'
                  }`}
              >
                <span className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-3 border-2 font-heading text-sm sm:text-lg flex-shrink-0
                  ${isSelected ? 'border-primary-red bg-primary-red text-white' : 'border-primary-black'}`}>
                  {key.toUpperCase()}
                </span>
                <span className="text-sm sm:text-base">{value}</span>
              </button>
            )
          })}
        </div>

        {/* Navigation — mobile-first layout */}
        <div className="mt-6 sm:mt-8 safe-bottom">
          {/* Mobile: prev/next as a simple row, actions below */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="px-3 sm:px-5 py-2.5 font-heading uppercase tracking-wide text-sm sm:text-base
                border-2 sm:border-3 border-primary-black min-h-[44px]
                hover:bg-primary-black hover:text-white active:bg-primary-black active:text-white transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setShowConfirmQuit(true)}
                className="px-2 sm:px-4 py-2 font-body text-xs sm:text-sm text-gray-500 hover:text-primary-red active:text-primary-red transition-colors min-h-[44px]"
              >
                Salir
              </button>
              <button
                onClick={() => setShowConfirmFinish(true)}
                className="px-3 sm:px-5 py-2 font-heading uppercase tracking-wide text-sm sm:text-base
                  bg-primary-blue text-white border-2 sm:border-3 border-primary-black min-h-[44px]
                  shadow-[3px_3px_0px_#1A1A1A] sm:shadow-[4px_4px_0px_#1A1A1A]
                  active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <span className="sm:hidden">✓</span>
                <span className="hidden sm:inline">Finalizar ✓</span>
              </button>
            </div>

            <button
              onClick={goNext}
              disabled={currentIndex === questions.length - 1}
              className="px-3 sm:px-5 py-2.5 font-heading uppercase tracking-wide text-sm sm:text-base
                border-2 sm:border-3 border-primary-black min-h-[44px]
                hover:bg-primary-black hover:text-white active:bg-primary-black active:text-white transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Siguiente </span>→
            </button>
          </div>
        </div>

        {/* Question navigator grid — desktop only (mobile uses the drawer) */}
        <div className="hidden sm:block mt-8 p-4 border-2 border-primary-black bg-accent-cream/30">
          <p className="font-heading text-xs uppercase tracking-widest mb-3 text-gray-500">
            Navegador de preguntas
          </p>
          <div className="flex flex-wrap gap-1">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 text-xs font-body border transition-all
                  ${idx === currentIndex
                    ? 'bg-primary-black text-white border-primary-black scale-110'
                    : answers[idx]
                      ? 'bg-primary-yellow border-primary-black'
                      : 'bg-white border-gray-300 hover:border-primary-black'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm quit modal */}
      {showConfirmQuit && (
        <Modal
          title="¿Abandonar examen?"
          message="Perderás todo el progreso actual."
          onConfirm={onQuit}
          onCancel={() => setShowConfirmQuit(false)}
          confirmText="Sí, abandonar"
          confirmColor="red"
        />
      )}

      {/* Confirm finish modal */}
      {showConfirmFinish && (
        <Modal
          title="¿Finalizar examen?"
          message={`Has respondido ${answeredCount} de ${questions.length} preguntas. Las no respondidas contarán como incorrectas.`}
          onConfirm={handleFinish}
          onCancel={() => setShowConfirmFinish(false)}
          confirmText="Finalizar"
          confirmColor="blue"
        />
      )}
    </div>
  )
}

function Modal({ title, message, onConfirm, onCancel, confirmText, confirmColor }) {
  const colorClasses = confirmColor === 'red' ? 'bg-primary-red' : 'bg-primary-blue'
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-primary-white geo-border p-5 sm:p-8 max-w-md w-full">
        <h3 className="font-heading text-xl sm:text-2xl uppercase mb-3">{title}</h3>
        <p className="font-body text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 font-heading uppercase text-sm border-2 border-primary-black hover:bg-gray-100 active:bg-gray-100 transition-colors min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 font-heading uppercase text-sm ${colorClasses} text-white border-2 border-primary-black min-h-[44px]
              shadow-[3px_3px_0px_#1A1A1A] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
