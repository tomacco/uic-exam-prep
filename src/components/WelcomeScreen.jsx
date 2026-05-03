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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Header with constructivism geometric elements */}
      <div className="relative mb-12">
        {/* Decorative shapes */}
        <div className="absolute -top-8 -left-16 w-24 h-24 bg-primary-red rotate-12 opacity-80" />
        <div className="absolute -top-4 -right-12 w-16 h-16 bg-primary-yellow -rotate-6" />
        <div className="absolute -bottom-6 left-8 w-20 h-8 bg-primary-blue rotate-3" />

        <h1 className="relative font-display text-7xl md:text-9xl tracking-tight text-primary-black uppercase leading-none">
          UIC EXAM
          <span className="block text-primary-red">PREP</span>
        </h1>
      </div>

      {/* Subtitle */}
      <div className="skew-element mb-12">
        <p className="bg-primary-black text-primary-white px-6 py-2 font-heading text-xl tracking-wide uppercase">
          Simulador de Admisión — Medicina
        </p>
      </div>

      {/* Student name input */}
      <div className="w-full max-w-md mb-8">
        <label className="block font-heading text-sm uppercase tracking-widest text-primary-blue mb-2">
          Nombre del estudiante
        </label>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Introduce tu nombre..."
          className="w-full px-4 py-3 bg-primary-white geo-border font-body text-lg focus:outline-none focus:border-primary-red transition-colors"
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
                className="px-3 py-1 text-sm border-2 border-primary-black bg-accent-cream hover:bg-primary-yellow transition-colors font-body"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        <button
          onClick={() => handleStart(onStartExam)}
          disabled={!inputName.trim()}
          className="group relative px-6 py-4 bg-primary-red text-primary-white font-heading text-xl uppercase tracking-wide
            border-4 border-primary-black shadow-[6px_6px_0px_#1A1A1A]
            hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1
            active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
            transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="block">▶ Examen Estándar</span>
          <span className="block text-xs font-body opacity-80 normal-case">
            100 preguntas · 100 minutos
          </span>
        </button>

        <button
          onClick={() => handleStart(onStartReview)}
          disabled={!inputName.trim() || !hasHistory}
          className="group relative px-6 py-4 bg-primary-blue text-primary-white font-heading text-xl uppercase tracking-wide
            border-4 border-primary-black shadow-[6px_6px_0px_#1A1A1A]
            hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1
            active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
            transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
          className="group relative px-6 py-4 bg-primary-yellow text-primary-black font-heading text-xl uppercase tracking-wide
            border-4 border-primary-black shadow-[6px_6px_0px_#1A1A1A]
            hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1
            active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
            transition-all"
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
          className="group relative px-6 py-4 bg-primary-white text-primary-black font-heading text-xl uppercase tracking-wide
            border-4 border-primary-black shadow-[6px_6px_0px_#1A1A1A]
            hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1
            active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
            transition-all"
        >
          <span className="block">📊 Historial</span>
          <span className="block text-xs font-body opacity-60 normal-case">
            Resultados anteriores
          </span>
        </button>
      </div>

      {/* Footer info */}
      <div className="mt-12 text-center">
        <div className="inline-flex gap-6 items-center font-body text-xs uppercase tracking-widest text-gray-500">
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
