import { useState, useEffect } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import ExamScreen from './components/ExamScreen'
import ResultsScreen from './components/ResultsScreen'
import HistoryScreen from './components/HistoryScreen'
import CustomExamScreen from './components/CustomExamScreen'
import { generateExam, generateCustomExam } from './utils/examGenerator'
import { saveExamResult, getFailedQuestionIds } from './utils/storage'

// Lazy load question data
import biologyData from './data/biology.json'
import chemistryData from './data/chemistry.json'
import mathData from './data/math.json'

function App() {
  const [screen, setScreen] = useState('welcome')
  const [studentName, setStudentName] = useState('')
  const [currentExam, setCurrentExam] = useState(null)
  const [examResult, setExamResult] = useState(null)

  function startStandardExam(name) {
    setStudentName(name)
    const questions = generateExam(biologyData, chemistryData, mathData)
    setCurrentExam({ questions, timeLimit: 100 * 60 })
    setScreen('exam')
  }

  function startReviewExam(name) {
    setStudentName(name)
    const failedIds = getFailedQuestionIds(name)
    const questions = generateExam(biologyData, chemistryData, mathData, {
      mode: 'review',
      failedIds,
    })
    setCurrentExam({ questions, timeLimit: 100 * 60 })
    setScreen('exam')
  }

  function startCustomExam(name, config) {
    setStudentName(name)
    const questions = generateCustomExam(biologyData, chemistryData, mathData, config)
    const timeLimit = questions.length * 60 // 1 min per question
    setCurrentExam({ questions, timeLimit })
    setScreen('exam')
  }

  function finishExam(answers) {
    const result = {
      date: new Date().toISOString(),
      totalQuestions: currentExam.questions.length,
      answers,
      score: answers.filter((a) => a.correct).length,
      bySubject: {
        biology: { total: 0, correct: 0 },
        chemistry: { total: 0, correct: 0 },
        math: { total: 0, correct: 0 },
      },
    }

    answers.forEach((a) => {
      const subject = getSubject(a.questionId)
      if (result.bySubject[subject]) {
        result.bySubject[subject].total++
        if (a.correct) result.bySubject[subject].correct++
      }
    })

    saveExamResult(studentName, result)
    setExamResult(result)
    setScreen('results')
  }

  function getSubject(questionId) {
    if (biologyData.find((q) => q.id === questionId)) return 'biology'
    if (chemistryData.find((q) => q.id === questionId)) return 'chemistry'
    return 'math'
  }

  function goHome() {
    setScreen('welcome')
    setCurrentExam(null)
    setExamResult(null)
  }

  return (
    <div className="min-h-screen constructivism-bg">
      {screen === 'welcome' && (
        <WelcomeScreen
          onStartExam={startStandardExam}
          onStartReview={startReviewExam}
          onCustomExam={() => setScreen('custom')}
          onViewHistory={() => setScreen('history')}
          studentName={studentName}
          setStudentName={setStudentName}
        />
      )}
      {screen === 'exam' && currentExam && (
        <ExamScreen
          questions={currentExam.questions}
          timeLimit={currentExam.timeLimit}
          onFinish={finishExam}
          onQuit={goHome}
          studentName={studentName}
        />
      )}
      {screen === 'results' && examResult && (
        <ResultsScreen
          result={examResult}
          questions={currentExam?.questions || []}
          studentName={studentName}
          onGoHome={goHome}
          onRetry={() => startStandardExam(studentName)}
        />
      )}
      {screen === 'history' && (
        <HistoryScreen
          studentName={studentName}
          onGoHome={goHome}
        />
      )}
      {screen === 'custom' && (
        <CustomExamScreen
          studentName={studentName}
          setStudentName={setStudentName}
          onStartExam={startCustomExam}
          onGoHome={goHome}
          biologyTopics={[...new Set(biologyData.map((q) => q.topic))]}
          chemistryTopics={[...new Set(chemistryData.map((q) => q.topic))]}
          mathTopics={[...new Set(mathData.map((q) => q.topic))]}
        />
      )}
    </div>
  )
}

export default App
