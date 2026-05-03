import { getStudentHistory, getAllStudents } from '../utils/storage'

export default function HistoryScreen({ studentName, onGoHome }) {
  const students = getAllStudents()
  const history = studentName ? getStudentHistory(studentName) : null

  if (!students.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="geo-border p-8 bg-primary-white text-center max-w-md">
          <h2 className="font-heading text-2xl uppercase mb-4">Sin historial</h2>
          <p className="font-body text-gray-600 mb-6">
            No hay exámenes realizados todavía. ¡Empieza tu primer examen!
          </p>
          <button
            onClick={onGoHome}
            className="px-6 py-3 bg-primary-black text-white font-heading uppercase tracking-wide"
          >
            ← Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative">
            <div className="absolute -top-2 -left-4 w-10 h-10 bg-primary-blue rotate-12 opacity-30" />
            <h1 className="relative font-display text-5xl md:text-7xl text-primary-black">
              HISTORIAL
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

        {history && history.exams.length > 0 ? (
          <>
            {/* Stats summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Exámenes"
                value={history.exams.length}
                color="primary-black"
              />
              <StatCard
                label="Media"
                value={`${Math.round(history.exams.reduce((sum, e) => sum + (e.score / e.totalQuestions) * 100, 0) / history.exams.length)}%`}
                color="primary-blue"
              />
              <StatCard
                label="Mejor"
                value={`${Math.round(Math.max(...history.exams.map((e) => (e.score / e.totalQuestions) * 100)))}%`}
                color="bio-green"
              />
              <StatCard
                label="Último"
                value={`${Math.round((history.exams[history.exams.length - 1].score / history.exams[history.exams.length - 1].totalQuestions) * 100)}%`}
                color="accent-orange"
              />
            </div>

            {/* Weak topics */}
            {Object.keys(history.weakTopics).length > 0 && (
              <div className="border-4 border-primary-red p-6 mb-8 bg-primary-red/5">
                <h2 className="font-heading text-lg uppercase tracking-wide mb-4">
                  ⚠ Temas con más errores acumulados
                </h2>
                <div className="grid gap-2">
                  {Object.entries(history.weakTopics)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([topic, count]) => (
                      <div key={topic} className="flex items-center justify-between py-2 border-b border-primary-red/20">
                        <span className="font-body text-sm">{topic}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 relative">
                            <div
                              className="absolute inset-y-0 left-0 bg-primary-red"
                              style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                            />
                          </div>
                          <span className="font-heading text-sm text-primary-red w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Exam list */}
            <h2 className="font-heading text-xl uppercase tracking-wide mb-4">Exámenes realizados</h2>
            <div className="space-y-3">
              {[...history.exams].reverse().map((exam, idx) => {
                const pct = Math.round((exam.score / exam.totalQuestions) * 100)
                const passed = pct >= 60
                return (
                  <div
                    key={idx}
                    className={`border-3 p-4 flex items-center justify-between
                      ${passed ? 'border-bio-green/50 bg-bio-green/5' : 'border-primary-red/50 bg-primary-red/5'}`}
                  >
                    <div>
                      <div className="font-body text-sm text-gray-500">
                        {new Date(exam.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="font-body text-xs text-gray-400 mt-1">
                        {exam.totalQuestions} preguntas
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-display text-3xl ${passed ? 'text-bio-green' : 'text-primary-red'}`}>
                        {pct}%
                      </div>
                      <div className="font-body text-xs text-gray-500">
                        {exam.score}/{exam.totalQuestions}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="geo-border p-8 bg-primary-white text-center">
            <p className="font-body text-gray-600">
              {studentName
                ? `No hay exámenes registrados para "${studentName}".`
                : 'Introduce un nombre en la pantalla de inicio para ver el historial.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="border-4 border-primary-black p-4 bg-primary-white shadow-[4px_4px_0px_#1A1A1A]">
      <div className="font-body text-xs uppercase tracking-widest text-gray-500 mb-1">{label}</div>
      <div className={`font-display text-3xl text-${color}`}>{value}</div>
    </div>
  )
}
