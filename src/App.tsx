
import { useEffect, useState } from 'react'
import type { QuizData } from './types/quiz'

function App() {
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isChecked, setIsChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    async function loadQuiz() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/questions.json`
        )

        if (!response.ok) {
          throw new Error('Gagal mengambil data quiz')
        }

        const data: QuizData = await response.json()

        if (
          !data.questions?.length ||
          data.questions.some(
            q =>
              !q.question ||
              !Array.isArray(q.options) ||
              q.options.length < 2 ||
              !Number.isInteger(q.answer) ||
              q.answer < 0 ||
              q.answer >= q.options.length
          )
        ) {
          throw new Error('Format data quiz tidak valid')
        }

        setQuiz(data)
      } catch {
        setError('Tidak dapat memuat soal. Silakan coba lagi.')
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Memuat quiz...</p>
      </main>
    )
  }

  if (error || !quiz) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Quiz tidak tersedia'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Coba Lagi
          </button>
        </div>
      </main>
    )
  }

  const question = quiz.questions[currentQuestion]
  const totalQuestions = quiz.questions.length
  const isCorrect = selectedAnswer === question.answer
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  function checkAnswer() {
    if (selectedAnswer === null || isChecked) return

    setIsChecked(true)

    if (selectedAnswer === question.answer) {
      setScore(prev => prev + 1)
    }
  }

  function nextQuestion() {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setIsChecked(false)
    } else {
      setFinished(true)
    }
  }

  function restartQuiz() {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsChecked(false)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const percentage = Math.round((score / totalQuestions) * 100)

    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-5">
            {percentage >= 70 ? '🎉' : '📚'}
          </div>

          <h1 className="text-2xl font-bold mb-2">
            Quiz Selesai!
          </h1>

          <p className="text-slate-500 mb-8">
            Terima kasih sudah mengerjakan quiz.
          </p>

          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <p className="text-sm text-blue-600 font-medium mb-2">
              Nilai Kamu
            </p>

            <p className="text-5xl font-bold text-blue-700">
              {percentage}
            </p>

            <p className="text-sm text-slate-500 mt-3">
              {score} benar dari {totalQuestions} soal
            </p>
          </div>

          <button
            onClick={restartQuiz}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Ulangi Quiz
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6">

      <div className="max-w-2xl w-full">

        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              UT
            </div>

            <span className="text-xl font-bold text-slate-900">
              Universitas Terbuka
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {quiz.title}
          </h1>

          <p className="text-slate-500">
            {quiz.description}
          </p>
        </header>

        {/* Quiz Card */}
        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-5 sm:p-8">

          {/* Progress */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-600">
              Pertanyaan {currentQuestion + 1} dari {totalQuestions}
            </span>

            <span className="text-sm font-semibold text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 mb-8 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question */}
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed mb-6">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const selected = selectedAnswer === index
              const correct = question.answer === index

              let style =
                'border-slate-200 hover:border-blue-400 hover:bg-blue-50'

              if (selected && !isChecked) {
                style = 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
              }

              if (isChecked && correct) {
                style = 'border-green-500 bg-green-50 text-green-800'
              } else if (isChecked && selected) {
                style = 'border-red-500 bg-red-50 text-red-800'
              }

              return (
                <button
                  key={index}
                  disabled={isChecked}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full flex items-center gap-4 text-left p-4 border rounded-xl transition ${style}`}
                >
                  <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-semibold shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="flex-1 font-medium text-sm sm:text-base">
                    {option}
                  </span>

                  {isChecked && correct && (
                    <span className="text-green-600 font-bold">✓</span>
                  )}

                  {isChecked && selected && !correct && (
                    <span className="text-red-600 font-bold">✕</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {isChecked && (
            <div
              className={`mt-6 p-4 rounded-xl ${
                isCorrect
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className={`font-bold mb-1 ${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {isCorrect ? 'Jawaban Benar!' : 'Jawaban Salah!'}
              </p>

              {!isCorrect && (
                <p className="text-sm text-slate-700">
                  Jawaban yang benar adalah:{' '}
                  <strong>{question.options[question.answer]}</strong>
                </p>
              )}
            </div>
          )}

          {/* Action */}
          <div className="mt-8">
            {!isChecked ? (
              <button
                onClick={checkAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition"
              >
                Periksa Jawaban
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition"
              >
                {currentQuestion + 1 === totalQuestions
                  ? 'Lihat Hasil'
                  : 'Soal Berikutnya'}
              </button>
            )}
          </div>

        </section>

        <footer className="text-center text-sm text-slate-400 mt-6">
          Semangat Ujian! Jangan lupa untuk beristirahat dan tetap sehat. 😊
        </footer>

      </div>
    </main>
  )
}

export default App
