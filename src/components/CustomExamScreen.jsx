import { useState } from 'react'

export default function CustomExamScreen({
  studentName,
  setStudentName,
  onStartExam,
  onGoHome,
  biologyTopics,
  chemistryTopics,
  mathTopics,
}) {
  const [name, setName] = useState(studentName || '')
  const [bioCount, setBioCount] = useState(45)
  const [chemCount, setChemCount] = useState(40)
  const [mathCount, setMathCount] = useState(15)
  const [selectedTopics, setSelectedTopics] = useState([])

  const totalQuestions = bioCount + chemCount + mathCount

  function toggleTopic(topic) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  function handleStart() {
    if (!name.trim()) return
    setStudentName(name.trim())
    onStartExam(name.trim(), {
      bioCount,
      chemCount,
      mathCount,
      topics: selectedTopics.length > 0 ? selectedTopics : null,
    })
  }

  const topicSections = [
    { label: 'Biología', topics: biologyTopics, color: 'bio-green', icon: '🧬' },
    { label: 'Química', topics: chemistryTopics, color: 'chem-purple', icon: '⚗️' },
    { label: 'Matemáticas', topics: mathTopics, color: 'math-blue', icon: '📐' },
  ]

  return (
    <div className="min-h-screen px-3 py-4 sm:p-4 md:p-8 safe-bottom">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
          <div className="relative min-w-0">
            <div className="absolute -top-2 -left-3 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 bg-primary-yellow rotate-45 opacity-50" />
            <h1 className="relative font-display text-4xl sm:text-5xl md:text-7xl text-primary-black truncate">
              CUSTOM EXAM
            </h1>
          </div>
          <button
            onClick={onGoHome}
            className="px-3 sm:px-4 py-2 font-heading uppercase text-xs sm:text-sm border-2 sm:border-3 border-primary-black
              active:bg-primary-black active:text-white transition-colors min-h-[40px] flex-shrink-0"
          >
            ← <span className="hidden sm:inline">Inicio</span>
          </button>
        </div>

        {/* Name input */}
        {!studentName && (
          <div className="mb-6">
            <label className="block font-heading text-sm uppercase tracking-widest text-primary-blue mb-2">
              Nombre del estudiante
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre..."
              className="w-full sm:max-w-sm px-4 py-3 geo-border font-body focus:outline-none"
            />
          </div>
        )}

        {/* Question counts */}
        <div className="geo-border p-4 sm:p-6 mb-6 sm:mb-8 bg-primary-white">
          <h2 className="font-heading text-base sm:text-lg uppercase tracking-wide mb-4">
            Cantidad de preguntas
          </h2>
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            <CountSlider
              label="Biología"
              value={bioCount}
              onChange={setBioCount}
              max={200}
              color="bio-green"
            />
            <CountSlider
              label="Química"
              value={chemCount}
              onChange={setChemCount}
              max={200}
              color="chem-purple"
            />
            <CountSlider
              label="Matemáticas"
              value={mathCount}
              onChange={setMathCount}
              max={200}
              color="math-blue"
            />
          </div>
          <div className="mt-4 pt-4 border-t-2 border-primary-black/10 flex justify-between items-center">
            <span className="font-body text-xs sm:text-sm text-gray-500">Total:</span>
            <span className="font-display text-2xl sm:text-3xl">{totalQuestions}</span>
          </div>
        </div>

        {/* Topic filter */}
        <div className="border-3 sm:border-4 border-primary-black p-4 sm:p-6 mb-6 sm:mb-8 bg-accent-cream/20">
          <h2 className="font-heading text-base sm:text-lg uppercase tracking-wide mb-2">
            Filtrar por temas (opcional)
          </h2>
          <p className="font-body text-xs text-gray-500 mb-4">
            Si no seleccionas ninguno, se incluirán todos.
          </p>

          {topicSections.map(({ label, topics, color, icon }) => (
            <div key={label} className="mb-4">
              <h3 className="font-heading text-xs sm:text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                <span>{icon}</span>
                <span>{label}</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-2 sm:px-3 py-1.5 text-xs font-body border-2 transition-all min-h-[32px]
                      ${selectedTopics.includes(topic)
                        ? `border-${color} bg-${color} text-white`
                        : `border-gray-300 active:border-${color}`
                      }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Start button */}
        <div className="text-center">
          <button
            onClick={handleStart}
            disabled={totalQuestions === 0 || !name.trim()}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-primary-red text-white font-heading text-xl sm:text-2xl uppercase tracking-wide
              border-3 sm:border-4 border-primary-black shadow-[4px_4px_0px_#1A1A1A] sm:shadow-[8px_8px_0px_#1A1A1A]
              active:shadow-[2px_2px_0px_#1A1A1A] active:translate-x-0.5 active:translate-y-0.5
              transition-all disabled:opacity-40 disabled:cursor-not-allowed min-h-[56px]"
          >
            ▶ Comenzar ({totalQuestions} preg.)
          </button>
          <p className="mt-3 font-body text-xs text-gray-500">
            Tiempo: {totalQuestions} min (1 min/pregunta)
          </p>
        </div>
      </div>
    </div>
  )
}

function CountSlider({ label, value, onChange, max, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-heading text-sm uppercase">{label}</span>
        <span className={`font-display text-xl sm:text-2xl text-${color}`}>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 appearance-none bg-gray-200 cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
          [&::-webkit-slider-thumb]:bg-primary-black [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-none"
      />
      <div className="flex justify-between font-body text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
