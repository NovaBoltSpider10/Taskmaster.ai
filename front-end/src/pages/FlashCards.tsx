import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import React from "react";

interface ClassData {
  _id: string;
  name: string;
  topics: string[];
}

interface FlashcardsData {
  topic: string;
  question: string;
  answer: string;
}

type MCQ = {
  question: string;
  correct: string;
  options: string[];
};

const FlashCards: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardsData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const [mode, setMode] = useState<"flashcards" | "test">("flashcards");
  const [testSettings, setTestSettings] = useState({
    scope: "topic" as "topic" | "class" | "all",
    count: 10,
  });
  const [testQuestions, setTestQuestions] = useState<MCQ[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  const shuffle = <T,>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      const userId = "google-oauth2|117092462712380430315";
      try {
        const res = await axios.get<ClassData[]>(
          `http://localhost:3000/class/user/${userId}`
        );
        setClasses(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch classes.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const fetchFlashcards = async (classId: string) => {
    setLoading(true);
    setFlashcards(null);
    setSelectedTopic(null);
    setError(null);
    try {
      const res = await axios.get<FlashcardsData[]>(
        `http://localhost:3000/cards/class/${classId}`
      );
      setFlashcards(res.data || []);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error(err);
      setError("Error fetching flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (cls: ClassData) => {
    setSelectedClass(cls);
    fetchFlashcards(cls._id);
    setMode("flashcards");
  };

  const topics = flashcards
    ? Array.from(new Set(flashcards.map((c) => c.topic)))
    : [];
  const filteredCards = flashcards
    ? selectedTopic
      ? flashcards.filter((c) => c.topic === selectedTopic)
      : flashcards
    : [];

  const startTest = () => {
    if (!flashcards) return;
    let pool = flashcards;
    if (testSettings.scope === "topic" && selectedTopic) {
      pool = flashcards.filter((c) => c.topic === selectedTopic);
    }
    const sample = shuffle(pool).slice(0, testSettings.count);
    const mcqs: MCQ[] = sample.map((card) => {
      const distractors = shuffle(
        pool.map((c) => c.answer).filter((a) => a !== card.answer)
      ).slice(0, 3);
      const options = shuffle([card.answer, ...distractors]);
      return { question: card.question, correct: card.answer, options };
    });
    setTestQuestions(mcqs);
    setUserAnswers(Array(mcqs.length).fill(""));
    setCurrentTestIndex(0);
    setMode("test");
  };

  const selectAnswer = (ans: string) => {
    setUserAnswers((ua) => {
      const copy = [...ua];
      copy[currentTestIndex] = ans;
      return copy;
    });
  };

  if (error) {
    return <div className="text-center text-red-500 mt-6">{error}</div>;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-gray-900 dark:text-white">
      {/* Header */}
      <header className="relative z-10 bg-white/90 dark:bg-darkCard shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Flashcards
          </h1>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="col-span-3 space-y-6">
            {/* Class Selector */}
            <div className="bg-white/90 dark:bg-darkCard rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-3">
                Classes
              </h2>
              <div className="space-y-2">
                {classes.map((cls) => (
                  <motion.div
                    key={cls._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClassClick(cls)}
                    className={`cursor-pointer p-3 rounded-lg border transition-all ${
                      selectedClass?._id === cls._id
                        ? "bg-gray-100 dark:bg-darkAccent border-gray-400 dark:border-gray-500"
                        : "bg-gray-50 dark:bg-darkCard border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-400"
                    }`}
                  >
                    <h3 className="font-medium text-gray-700 dark:text-gray-200">
                      {cls.name}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Topic Selector */}
            {flashcards && topics.length > 0 && (
              <div className="bg-white/90 dark:bg-darkCard rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-3">
                  Topics
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className={`w-full text-left p-2 rounded-lg transition-all ${
                      selectedTopic === null
                        ? "bg-violet-600 text-white"
                        : "bg-gray-50 dark:bg-darkAccent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    All Topics
                  </button>
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTopic(t)}
                      className={`w-full text-left p-2 rounded-lg transition-all ${
                        selectedTopic === t
                          ? "bg-violet-600 text-white"
                          : "bg-gray-50 dark:bg-darkAccent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Main Content */}
          <div className="col-span-9">
            {/* Mode Toggle & Test Settings */}
            {flashcards && (
              <div className="bg-white dark:bg-darkCard rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {["flashcards", "test"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m as "flashcards" | "test")}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          mode === m
                            ? "bg-violet-600 text-white"
                            : "bg-gray-100 dark:bg-darkAccent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {m === "flashcards" ? "Flashcards" : "Test"}
                      </button>
                    ))}
                  </div>

                  {mode === "test" && (
                    <div className="flex items-center space-x-4">
                      <select
                        value={testSettings.scope}
                        onChange={(e) =>
                          setTestSettings((s) => ({
                            ...s,
                            scope: e.target.value as "topic" | "class" | "all",
                          }))
                        }
                        className="border rounded-lg px-3 py-2 bg-white dark:bg-darkAccent text-gray-700 dark:text-gray-200 dark:border-gray-600"
                      >
                        <option value="topic">Topic Only</option>
                        <option value="class">Full Class</option>
                        <option value="all">All</option>
                      </select>
                      <select
                        value={testSettings.count}
                        onChange={(e) =>
                          setTestSettings((s) => ({
                            ...s,
                            count: Number(e.target.value),
                          }))
                        }
                        className="border rounded-lg px-3 py-2 bg-white dark:bg-darkAccent text-gray-700 dark:text-gray-200 dark:border-gray-600"
                      >
                        <option value={10}>10 Questions</option>
                        <option value={30}>30 Questions</option>
                        <option value={flashcards.length}>All Questions</option>
                      </select>
                      <button
                        onClick={startTest}
                        className="bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition"
                      >
                        Start Test
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Flashcard or Test View */}
            <div className="bg-white dark:bg-darkCard rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
                </div>
              ) : mode === "test" ? (
                <div className="space-y-6">
                  {testQuestions.length > 0 ? (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                          Question {currentTestIndex + 1} /{" "}
                          {testQuestions.length}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              setCurrentTestIndex((i) => Math.max(i - 1, 0))
                            }
                            disabled={currentTestIndex === 0}
                            className="px-4 py-2 bg-gray-200 dark:bg-darkAccent text-gray-700 dark:text-gray-200 rounded-lg disabled:opacity-50"
                          >
                            Previous
                          </button>
                          {currentTestIndex < testQuestions.length - 1 ? (
                            <button
                              onClick={() => setCurrentTestIndex((i) => i + 1)}
                              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                            >
                              Next
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const score = userAnswers.filter(
                                  (ans, idx) =>
                                    ans === testQuestions[idx].correct
                                ).length;
                                alert(
                                  `You scored ${score} / ${testQuestions.length}`
                                );
                                setMode("flashcards");
                              }}
                              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                            >
                              Submit
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xl font-medium text-gray-700 dark:text-white">
                        {testQuestions[currentTestIndex].question}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {testQuestions[currentTestIndex].options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => selectAnswer(opt)}
                            className={`p-4 border rounded-lg text-left transition-all ${
                              userAnswers[currentTestIndex] === opt
                                ? "bg-gray-100 dark:bg-violet-700 dark:text-white border-gray-400 dark:border-gray-500"
                                : "hover:bg-gray-50 dark:hover:bg-darkAccent border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                      Click "Start Test" to begin your quiz.
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredCards && filteredCards.length > 0 ? (
                    <>
                      <div className="flex justify-center">
                        <div
                          className="w-full max-w-2xl cursor-pointer"
                          style={{ perspective: 1000 }}
                          onClick={() => setIsFlipped((f) => !f)}
                        >
                          <motion.div
                            key={currentCardIndex}
                            className="relative h-96"
                            style={{ transformStyle: "preserve-3d" }}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6 }}
                          >
                            {/* Front */}
                            <div
                              className="absolute w-full h-full rounded-lg p-8 bg-white dark:bg-darkAccent border-2 border-gray-200 dark:border-gray-600 shadow-sm flex flex-col justify-between"
                              style={{ backfaceVisibility: "hidden" }}
                            >
                              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-darkCard text-gray-700 dark:text-white mb-4">
                                {filteredCards[currentCardIndex].topic}
                              </span>
                              <p className="text-2xl font-medium text-gray-700 dark:text-white">
                                {filteredCards[currentCardIndex].question}
                              </p>
                              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                                Click to flip
                              </p>
                            </div>

                            {/* Back */}
                            <div
                              className="absolute w-full h-full rounded-lg p-8 bg-gray-50 dark:bg-darkCard border-2 border-gray-300 dark:border-gray-600 shadow-sm flex flex-col justify-between"
                              style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                              }}
                            >
                              <p className="text-2xl font-medium text-gray-700 dark:text-white">
                                {filteredCards[currentCardIndex].answer}
                              </p>
                              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                                Click to flip back
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                      <div className="flex justify-center items-center space-x-4">
                        <button
                          onClick={() => {
                            setCurrentCardIndex((i) => i - 1);
                            setIsFlipped(false);
                          }}
                          disabled={currentCardIndex === 0}
                          className={`px-6 py-2 rounded-lg font-medium ${
                            currentCardIndex === 0
                              ? "bg-gray-100 dark:bg-darkAccent text-gray-400 cursor-not-allowed"
                              : "bg-violet-600 text-white hover:bg-violet-700"
                          }`}
                        >
                          Previous
                        </button>
                        <span className="text-gray-600 dark:text-gray-300">
                          {currentCardIndex + 1} / {filteredCards.length}
                        </span>
                        <button
                          onClick={() => {
                            setCurrentCardIndex((i) => i + 1);
                            setIsFlipped(false);
                          }}
                          disabled={
                            currentCardIndex === filteredCards.length - 1
                          }
                          className={`px-6 py-2 rounded-lg font-medium ${
                            currentCardIndex === filteredCards.length - 1
                              ? "bg-gray-100 dark:bg-darkAccent text-gray-400 cursor-not-allowed"
                              : "bg-violet-600 text-white hover:bg-violet-700"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                      {flashcards
                        ? "No flashcards for this topic."
                        : "Select a class to get started."}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FlashCards;
