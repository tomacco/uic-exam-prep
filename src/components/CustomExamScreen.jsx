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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative">
            <div className="absolute -top-2 -left-4 w-10 h-10 bg-primary-yellow rotate-45 opacity-50" />
            <h1 className="relative font-display text-5xl md:text-7xl text-primary-black">
              CUSTOM EXAM
            </h1>
          </div>
          <button
            onClick={onGoHome}
            className="px-4 py-2 font-heading uppercase text-sm border-3 border-primary-black
              hover:bg-primary-black hover:text-white transition-colors"
          >
            ← Inicio
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
              className="w-full max-w-sm px-4 py-3 geo-border font-body focus:outline-none"
            />
          </div>
        )}

        {/* Question counts */}
        <div className="geo-border p-6 mb-8 bg-primary-white">
          <h2 className="font-heading text-lg uppercase tracking-wide mb-4">
            Cantidad de preguntas
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
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
            <span className="font-body text-sm text-gray-500">Total de preguntas:</span>
            <span className="font-display text-3xl">{totalQuestions}</span>
          </div>
        </div>

        {/* Topic filter */}
        <div className="border-4 border-primary-black p-6 mb-8 bg-accent-cream/20">
          <h2 className="font-heading text-lg uppercase tracking-wide mb-2">
            Filtrar por temas (opcional)
          </h2>
          <p className="font-body text-xs text-gray-500 mb-4">
            Si no seleccionas ninguno, se incluirán todos los temas.
          </p>

          {topicSections.map(({ label, topics, color, icon }) => (
            <div key={label} className="mb-4">
              <h3 className="font-heading text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                <span>{icon}</span>
                <span>{label}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-1 text-xs font-body border-2 transition-all
                      ${selectedTopics.includes(topic)
                        ? `border-${color} bg-${color} text-white`
                        : `border-gray-300 hover:border-${color}`
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
            className="px-10 py-5 bg-primary-red text-white font-heading text-2xl uppercase tracking-wide
              border-4 border-primary-black shadow-[8px_8px_0px_#1A1A1A]
              hover:shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1
              transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ▶ Comenzar examen ({totalQuestions} preguntas)
          </button>
          <p className="mt-3 font-body text-xs text-gray-500">
            Tiempo: {totalQuestions} minutos (1 min/pregunta)
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
        <span className={`font-display text-2xl text-${color}`}>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 appearance-none bg-gray-200 cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:bg-primary-black [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="flex justify-between font-body text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
