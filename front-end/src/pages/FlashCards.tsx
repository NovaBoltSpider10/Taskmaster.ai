import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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
  // --- Study Mode State ---
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardsData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGeneratePopup, setShowGeneratePopup] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // --- Test Mode State ---
  const [mode, setMode] = useState<"flashcards" | "test">("flashcards");
  const [testSettings, setTestSettings] = useState<{
    scope: "topic" | "class" | "all";
    count: number;
  }>({ scope: "topic", count: 10 });
  const [testQuestions, setTestQuestions] = useState<MCQ[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // --- Utility to shuffle an array ---
  const shuffle = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // --- Fetch list of classes on mount ---
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

  // --- Fetch flashcards for a class ---
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

  // --- Generate flash cards ---
  const generateFlashCards = async (classId: ClassData["_id"]) => {
    try {
      await axios.post(`http://localhost:3000/cards/${classId}`);
      console.log("Generated successfully");
    } catch (err) {
      console.error(err);
      setError("Error generating flashcards");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers for study mode ---
  const handleClassClick = (cls: ClassData) => {
    setSelectedClass(cls);
    fetchFlashcards(cls._id);
    setMode("flashcards");
  };
  const handleNextCard = () => {
    if (flashcards && currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex((i) => i + 1);
      setIsFlipped(false);
    }
  };
  const handlePreviousCard = () => {
    if (flashcards && currentCardIndex > 0) {
      setCurrentCardIndex((i) => i - 1);
      setIsFlipped(false);
    }
  };
  const handleResetFlip = () => {
    setIsFlipped(false);
  };

  // --- Derived data for study mode ---
  const topics = flashcards
    ? Array.from(new Set(flashcards.map((c) => c.topic)))
    : [];
  const filteredCards = flashcards
    ? selectedTopic
      ? flashcards.filter((c) => c.topic === selectedTopic)
      : flashcards
    : [];

  // --- Test mode: build questions ---
  const startTest = () => {
    if (!flashcards) return;
    // choose pool
    let pool = flashcards;
    if (testSettings.scope === "topic" && selectedTopic) {
      pool = flashcards.filter((c) => c.topic === selectedTopic);
    }
    // sample up to count
    const sample = shuffle(pool).slice(0, testSettings.count);
    // build MCQs
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

  // --- Error state early return ---
  if (error) {
    return <div className="text-center text-red-500 mt-6">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-700">Flashcards</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Class & Topic Selection */}
          <div className="col-span-3 space-y-6">
            {/* Class Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
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
                        ? "bg-gray-100 border-gray-400"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <h3 className="font-medium text-gray-700">{cls.name}</h3>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Topic Selection */}
            {flashcards && topics.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                  Topics
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedTopic(null);
                      setIsFlipped(false);
                      setCurrentCardIndex(0);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-all ${
                      selectedTopic === null
                        ? "bg-gray-700 text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    All Topics
                  </button>
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedTopic(t);
                        setIsFlipped(false);
                        setCurrentCardIndex(0);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-all ${
                        selectedTopic === t
                          ? "bg-gray-700 text-white"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            {/* Mode Selection & Test Settings */}
            {flashcards && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setMode("flashcards")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        mode === "flashcards"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Flashcards
                    </button>
                    <button
                      onClick={() => setMode("test")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        mode === "test"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Test
                    </button>
                  </div>

                  {mode === "test" && (
                    <div className="flex items-center space-x-4">
                      <select
                        value={testSettings.scope}
                        onChange={(e) =>
                          setTestSettings((s) => ({
                            ...s,
                            scope: e.target.value as any,
                          }))
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
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
                        className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                      >
                        <option value={10}>10 Questions</option>
                        <option value={30}>30 Questions</option>
                        <option value={flashcards.length}>All Questions</option>
                      </select>
                      <button
                        onClick={startTest}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all"
                      >
                        Start Test
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700"></div>
                </div>
              ) : mode === "test" ? (
                // Test Mode UI
                <div className="space-y-6">
                  {testQuestions.length > 0 ? (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700">
                          Question {currentTestIndex + 1}/{testQuestions.length}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              setCurrentTestIndex((i) => Math.max(i - 1, 0))
                            }
                            disabled={currentTestIndex === 0}
                            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 text-gray-700"
                          >
                            Previous
                          </button>
                          {currentTestIndex < testQuestions.length - 1 ? (
                            <button
                              onClick={() => setCurrentTestIndex((i) => i + 1)}
                              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
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
                                setTestScore(score);
                                setShowResults(true); // Show the results modal
                                setMode("flashcards");
                              }}
                              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                            >
                              Submit
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-xl font-medium text-gray-700">
                          {testQuestions[currentTestIndex].question}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {testQuestions[currentTestIndex].options.map(
                            (opt) => (
                              <button
                                key={opt}
                                onClick={() => selectAnswer(opt)}
                                className={`p-4 border rounded-lg text-left transition-all ${
                                  userAnswers[currentTestIndex] === opt
                                    ? "bg-gray-100 border-gray-400"
                                    : "hover:bg-gray-50 border-gray-200"
                                }`}
                              >
                                {opt}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">
                        Click "Start Test" to begin your quiz
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Flashcards Mode UI
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
                              className="absolute w-full h-full rounded-lg p-8 bg-white border-2 border-gray-200 shadow-sm flex flex-col justify-between"
                              style={{ backfaceVisibility: "hidden" }}
                            >
                              <div>
                                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 mb-4">
                                  {filteredCards[currentCardIndex].topic}
                                </span>
                                <p className="text-2xl font-medium text-gray-700">
                                  {filteredCards[currentCardIndex].question}
                                </p>
                              </div>
                              <p className="text-sm text-gray-500 text-center">
                                Click to flip
                              </p>
                            </div>
                            {/* Back */}
                            <div
                              className="absolute w-full h-full rounded-lg p-8 bg-gray-50 border-2 border-gray-300 shadow-sm flex flex-col justify-between"
                              style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                              }}
                            >
                              <p className="text-2xl font-medium text-gray-700">
                                {filteredCards[currentCardIndex].answer}
                              </p>
                              <p className="text-sm text-gray-500 text-center">
                                Click to flip back
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                      <div className="flex justify-center items-center space-x-4">
                        <button
                          onClick={handlePreviousCard}
                          disabled={currentCardIndex === 0}
                          className={`px-6 py-2 rounded-lg font-medium ${
                            currentCardIndex === 0
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-700 text-white hover:bg-gray-800"
                          }`}
                        >
                          Previous
                        </button>
                        <span className="text-gray-600">
                          {currentCardIndex + 1} / {filteredCards.length}
                        </span>
                        <button
                          onClick={handleNextCard}
                          disabled={
                            currentCardIndex === filteredCards.length - 1
                          }
                          className={`px-6 py-2 rounded-lg font-medium ${
                            currentCardIndex === filteredCards.length - 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-700 text-white hover:bg-gray-800"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">
                        {flashcards && selectedClass ? (
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                              setSelectedClassId(selectedClass._id); // Store the class ID
                              setShowGeneratePopup(true); // Show the popup
                            }}
                          >
                            Generate Flashcards
                          </button>
                        ) : (
                          "Select a class to get started."
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Results</h2>
            <p className="text-lg text-gray-700">
              You scored <span className="font-bold">{testScore}</span> /{" "}
              {testQuestions.length}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowResults(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Flashcards Popup */}
      {showGeneratePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Generate Flashcards</h2>
            <p className="text-gray-700 mb-6">
              Warning: Flashcards generation may take up to 2 minutes. Do you want to proceed?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowGeneratePopup(false)} // Close the popup
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedClassId) {
                    generateFlashCards(selectedClassId); // Call the generation function
                  }
                  setShowGeneratePopup(false); // Close the popup
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashCards;
