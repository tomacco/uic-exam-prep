import { useState, useEffect, useCallback } from 'react'

export default function ExamScreen({ questions, timeLimit, onFinish, onQuit, studentName }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [showConfirmQuit, setShowConfirmQuit] = useState(false)
  const [showConfirmFinish, setShowConfirmFinish] = useState(false)

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

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const question = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100
  const isLowTime = timeRemaining < 300 // Less than 5 min

  function getSubjectColor(questionId) {
    // Determine by ID range convention
    if (question.topic) {
      const bioTopics = ['Biología celular', 'Biomoléculas', 'Genética', 'Microbiología', 'Histología y fisiología humana', 'Ecología y evolución', 'Historia de la biología']
      const chemTopics = ['Estructura atómica', 'Tabla periódica', 'Enlace químico', 'Formulación y nomenclatura', 'Estequiometría', 'Disoluciones', 'Termodinámica y cinética', 'Química orgánica', 'Historia de la química']
      if (bioTopics.includes(question.topic)) return 'bio-green'
      if (chemTopics.includes(question.topic)) return 'chem-purple'
      return 'math-blue'
    }
    return 'primary-black'
  }

  const subjectColor = getSubjectColor(question.id)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar: timer + progress */}
      <div className="sticky top-0 z-50 bg-primary-black text-primary-white px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-heading text-sm uppercase tracking-widest opacity-70">
              {studentName}
            </span>
            <span className="text-xs opacity-50">|</span>
            <span className="font-body text-sm">
              {answeredCount}/{questions.length} respondidas
            </span>
          </div>

          <div className={`font-display text-3xl ${isLowTime ? 'text-primary-red timer-warning' : 'text-primary-yellow'}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mt-2 h-2 bg-gray-700 relative">
          <div
            className="absolute inset-y-0 left-0 bg-primary-yellow progress-stripes transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Question header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className={`inline-block px-3 py-1 text-xs font-heading uppercase tracking-widest bg-${subjectColor} text-white mb-2`}>
              {question.topic}
            </span>
            <div className="font-heading text-sm text-gray-500 uppercase">
              Pregunta {currentIndex + 1} de {questions.length}
            </div>
          </div>
        </div>

        {/* Question text */}
        <div className="geo-border bg-primary-white p-6 mb-8">
          <p className="font-body text-lg md:text-xl leading-relaxed text-primary-black">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="grid gap-3">
          {Object.entries(question.options).map(([key, value]) => {
            const isSelected = answers[currentIndex] === key
            return (
              <button
                key={key}
                onClick={() => selectAnswer(key)}
                className={`text-left px-5 py-4 border-4 transition-all font-body
                  ${isSelected
                    ? 'border-primary-red bg-primary-red/10 shadow-[4px_4px_0px_#D62828] translate-x-0'
                    : 'border-primary-black bg-primary-white hover:border-primary-blue hover:shadow-[4px_4px_0px_#003566] hover:-translate-y-0.5'
                  }`}
              >
                <span className={`inline-flex items-center justify-center w-8 h-8 mr-3 border-2 font-heading text-lg
                  ${isSelected ? 'border-primary-red bg-primary-red text-white' : 'border-primary-black'}`}>
                  {key.toUpperCase()}
                </span>
                <span className="text-base">{value}</span>
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-5 py-2 font-heading uppercase tracking-wide border-3 border-primary-black
              hover:bg-primary-black hover:text-white transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirmQuit(true)}
              className="px-4 py-2 font-body text-sm text-gray-500 hover:text-primary-red transition-colors"
            >
              Abandonar
            </button>
            <button
              onClick={() => setShowConfirmFinish(true)}
              className="px-5 py-2 font-heading uppercase tracking-wide bg-primary-blue text-white border-3 border-primary-black
                shadow-[4px_4px_0px_#1A1A1A] hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              Finalizar ✓
            </button>
          </div>

          <button
            onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            disabled={currentIndex === questions.length - 1}
            className="px-5 py-2 font-heading uppercase tracking-wide border-3 border-primary-black
              hover:bg-primary-black hover:text-white transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>

        {/* Question navigator grid */}
        <div className="mt-8 p-4 border-2 border-primary-black bg-accent-cream/30">
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="bg-primary-white geo-border p-8 max-w-md mx-4">
        <h3 className="font-heading text-2xl uppercase mb-3">{title}</h3>
        <p className="font-body text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 font-heading uppercase text-sm border-2 border-primary-black hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 font-heading uppercase text-sm ${colorClasses} text-white border-2 border-primary-black
              shadow-[3px_3px_0px_#1A1A1A] hover:shadow-[1px_1px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
