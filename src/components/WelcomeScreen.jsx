import { useState } from 'react'
import { getAllStudents, getStudentHistory } from '../utils/storage'

export default function WelcomeScreen({
  onStartExam,
  onStartReview,
  onCustomExam,
  onViewHistory,
  studentName,
  setStudentName,
}) {
  const [inputName, setInputName] = useState(studentName)
  const students = getAllStudents()
  const hasHistory = studentName && getStudentHistory(studentName).exams.length > 0

  function handleStart(action) {
    if (!inputName.trim()) return
    setStudentName(inputName.trim())
    action(inputName.trim())
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:p-8 safe-bottom">
      {/* Header with constructivism geometric elements */}
      <div className="relative mb-8 sm:mb-12">
        {/* Decorative shapes — hidden on very small screens to avoid overflow */}
        <div className="hidden sm:block absolute -top-8 -left-16 w-24 h-24 bg-primary-red rotate-12 opacity-80" />
        <div className="hidden sm:block absolute -top-4 -right-12 w-16 h-16 bg-primary-yellow -rotate-6" />
        <div className="hidden sm:block absolute -bottom-6 left-8 w-20 h-8 bg-primary-blue rotate-3" />
        {/* Mobile-friendly decorative shapes */}
        <div className="sm:hidden absolute -top-3 -left-3 w-10 h-10 bg-primary-red rotate-12 opacity-60" />
        <div className="sm:hidden absolute -top-2 -right-3 w-8 h-8 bg-primary-yellow -rotate-6" />

        <h1 className="relative font-display text-6xl sm:text-7xl md:text-9xl tracking-tight text-primary-black uppercase leading-none text-center">
          UIC EXAM
          <span className="block text-primary-red">PREP</span>
        </h1>
      </div>

      {/* Subtitle */}
      <div className="skew-element mb-8 sm:mb-12 max-w-full">
        <p className="bg-primary-black text-primary-white px-4 sm:px-6 py-2 font-heading text-sm sm:text-xl tracking-wide uppercase text-center">
          Simulador de Admisión — Medicina
        </p>
      </div>

      {/* Student name input */}
      <div className="w-full max-w-md mb-6 sm:mb-8 px-2">
        <label className="block font-heading text-sm uppercase tracking-widest text-primary-blue mb-2">
          Nombre del estudiante
        </label>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Introduce tu nombre..."
          className="w-full px-4 py-3 bg-primary-white geo-border font-body text-base sm:text-lg focus:outline-none focus:border-primary-red transition-colors"
          onKeyDown={(e) => e.key === 'Enter' && handleStart(onStartExam)}
        />
        {students.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs uppercase tracking-widest text-gray-500 self-center">
              Recientes:
            </span>
            {students.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setInputName(name)
                  setStudentName(name)
                }}
                className="px-3 py-1.5 text-sm border-2 border-primary-black bg-accent-cream hover:bg-primary-yellow transition-colors font-body min-h-[36px]"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg px-2">
        <button
          onClick={() => handleStart(onStartExam)}
          disabled={!inputName.trim()}
          className="group relative px-5 py-4 bg-primary-red text-primary-white font-heading text-lg sm:text-xl uppercase tracking-wide
            border-3 sm:border-4 border-primary-black shadow-[4px_4px_0px_#1A1A1A] sm:shadow-[6px_6px_0px_#1A1A1A]
            hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1
            active:shadow-none active:translate-x-1 active:translate-y-1
            transition-all disabled:opacity-40 disabled:cursor-not-allowed min-h-[60px]"
        >
          <span className="block">▶ Examen Estándar</span>
          <span className="block text-xs font-body opacity-80 normal-case">
            100 preguntas · 100 minutos
          </span>
        </button>

        <button
          onClick={() => handleStart(onStartReview)}
          disabled={!inputName.trim() || !hasHistory}
          className="group relative px-5 py-4 bg-primary-blue text-primary-white font-heading text-lg sm:text-xl uppercase tracking-wide
            border-3 sm:border-4 border-primary-black shadow-[4px_4px_0px_#1A1A1A] sm:shadow-[6px_6px_0px_#1A1A1A]
            hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1
            active:shadow-none active:translate-x-1 active:translate-y-1
            transition-all disabled:opacity-40 disabled:cursor-not-allowed min-h-[60px]"
        >
          <span className="block">↻ Repaso Errores</span>
          <span className="block text-xs font-body opacity-80 normal-case">
            Preguntas falladas anteriormente
          </span>
        </button>

        <button
          onClick={() => {
            if (inputName.trim()) setStudentName(inputName.trim())
            onCustomExam()
          }}
          className="group relative px-5 py-4 bg-primary-yellow text-primary-black font-heading text-lg sm:text-xl uppercase tracking-wide
            border-3 sm:border-4 border-primary-black shadow-[4px_4px_0px_#1A1A1A] sm:shadow-[6px_6px_0px_#1A1A1A]
            hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1
            active:shadow-none active:translate-x-1 active:translate-y-1
            transition-all min-h-[60px]"
        >
          <span className="block">⚙ Examen Custom</span>
          <span className="block text-xs font-body opacity-60 normal-case">
            Elige materias y cantidad
          </span>
        </button>

        <button
          onClick={() => {
            if (inputName.trim()) setStudentName(inputName.trim())
            onViewHistory()
          }}
          className="group relative px-5 py-4 bg-primary-white text-primary-black font-heading text-lg sm:text-xl uppercase tracking-wide
            border-3 sm:border-4 border-primary-black shadow-[4px_4px_0px_#1A1A1A] sm:shadow-[6px_6px_0px_#1A1A1A]
            hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1
            active:shadow-none active:translate-x-1 active:translate-y-1
            transition-all min-h-[60px]"
        >
          <span className="block">📊 Historial</span>
          <span className="block text-xs font-body opacity-60 normal-case">
            Resultados anteriores
          </span>
        </button>
      </div>

      {/* Footer info */}
      <div className="mt-8 sm:mt-12 text-center">
        <div className="inline-flex gap-4 sm:gap-6 items-center font-body text-xs uppercase tracking-widest text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-bio-green inline-block" /> 200 Bio
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-chem-purple inline-block" /> 200 Quím
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-math-blue inline-block" /> 200 Mat
          </span>
        </div>
      </div>
    </div>
  )
}
