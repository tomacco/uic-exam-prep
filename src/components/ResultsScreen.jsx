export default function ResultsScreen({ result, studentName, onGoHome, onRetry }) {
  const percentage = Math.round((result.score / result.totalQuestions) * 100)
  const passed = percentage >= 60

  const subjectData = [
    { key: 'biology', label: 'Biología', color: 'bio-green', icon: '🧬' },
    { key: 'chemistry', label: 'Química', color: 'chem-purple', icon: '⚗️' },
    { key: 'math', label: 'Matemáticas', color: 'math-blue', icon: '📐' },
  ]

  // Group wrong answers by topic
  const wrongByTopic = {}
  result.answers.forEach((a) => {
    if (!a.correct) {
      if (!wrongByTopic[a.topic]) wrongByTopic[a.topic] = 0
      wrongByTopic[a.topic]++
    }
  })
  const sortedWeakTopics = Object.entries(wrongByTopic).sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-8 w-16 h-16 bg-primary-yellow -rotate-12 opacity-60" />
            <div className="absolute -top-2 -right-6 w-12 h-12 bg-primary-red rotate-6 opacity-40" />
            <h1 className="relative font-display text-6xl md:text-8xl text-primary-black">
              RESULTADOS
            </h1>
          </div>
          <p className="font-heading text-lg uppercase tracking-widest text-gray-500 mt-2">
            {studentName}
          </p>
        </div>

        {/* Main score */}
        <div className={`geo-border p-8 mb-8 text-center ${passed ? 'bg-bio-green/5' : 'bg-primary-red/5'}`}>
          <div className="font-display text-8xl md:text-[10rem] leading-none">
            <span className={passed ? 'text-bio-green' : 'text-primary-red'}>
              {result.score}
            </span>
            <span className="text-gray-300">/{result.totalQuestions}</span>
          </div>
          <div className="mt-4 font-heading text-2xl uppercase">
            {percentage}% — {passed ? '¡APROBADO!' : 'NO APROBADO'}
          </div>
          <div className="mt-2 font-body text-sm text-gray-500">
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

        {/* Subject breakdown */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {subjectData.map(({ key, label, color, icon }) => {
            const data = result.bySubject[key]
            if (!data || data.total === 0) return null
            const pct = Math.round((data.correct / data.total) * 100)
            return (
              <div key={key} className="border-4 border-primary-black p-4 bg-primary-white shadow-[4px_4px_0px_#1A1A1A]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-heading text-sm uppercase tracking-widest">{label}</span>
                </div>
                <div className={`font-display text-4xl text-${color}`}>
                  {data.correct}/{data.total}
                </div>
                <div className="mt-2 h-3 bg-gray-200 relative">
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
          <div className="border-4 border-primary-red p-6 mb-8 bg-primary-red/5">
            <h2 className="font-heading text-xl uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="w-4 h-4 bg-primary-red inline-block rotate-45" />
              Temas a reforzar
            </h2>
            <div className="grid gap-2">
              {sortedWeakTopics.slice(0, 8).map(([topic, count]) => (
                <div key={topic} className="flex items-center justify-between font-body text-sm py-1 border-b border-primary-red/20">
                  <span>{topic}</span>
                  <span className="font-heading text-primary-red">{count} errores</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetry}
            className="px-8 py-4 bg-primary-red text-white font-heading text-xl uppercase tracking-wide
              border-4 border-primary-black shadow-[6px_6px_0px_#1A1A1A]
              hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            ↻ Repetir examen
          </button>
          <button
            onClick={onGoHome}
            className="px-8 py-4 bg-primary-white text-primary-black font-heading text-xl uppercase tracking-wide
              border-4 border-primary-black shadow-[6px_6px_0px_#1A1A1A]
              hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            ← Inicio
          </button>
        </div>
      </div>
    </div>
  )
}
