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
  const [showResults, setShowResults] = useState(false);

  const shuffle = <T,>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      const userId = "google-oauth2|117092462712380430315";
      try {
        const res = await axios.get<ClassData[]>(
          `http://localhost:5000/class/user/${userId}`
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
        `http://localhost:5000/cards/class/${classId}`
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
    setShowResults(false);
  };

  const selectAnswer = (ans: string) => {
    setUserAnswers((ua) => {
      const copy = [...ua];
      copy[currentTestIndex] = ans;
      return copy;
    });
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === testQuestions[index].correct ? 1 : 0);
    }, 0);
  };

  if (error) {
    return <div className="text-center text-destructive mt-6">{error}</div>;
  }

  return (
    <div className="w-full">
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-emphasis mb-6">Flashcards & Testing</h1>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 space-y-6">
            <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-4">
              <h2 className="text-lg font-semibold text-emphasis mb-3">
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
                        ? "bg-primary text-primary-foreground border-primary/50"
                        : "bg-background text-foreground border-border hover:border-accent"
                    }`}
                  >
                    <h3 className="font-medium">
                      {cls.name}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </div>

            {flashcards && topics.length > 0 && (
              <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-4">
                <h2 className="text-lg font-semibold text-emphasis mb-3">
                  Topics
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className={`w-full text-left p-2 rounded-lg transition-all font-medium ${
                      selectedTopic === null
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    All Topics
                  </button>
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTopic(t)}
                      className={`w-full text-left p-2 rounded-lg transition-all font-medium ${
                        selectedTopic === t
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-span-12 md:col-span-9">
            {flashcards && (
              <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex space-x-2">
                    {["flashcards", "test"].map((m) => (
                      <button
                        key={m}
                        onClick={() => { setMode(m as "flashcards" | "test"); setShowResults(false); }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          mode === m
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {m === "flashcards" ? "Flashcards" : "Test"}
                      </button>
                    ))}
                  </div>

                  {mode === "test" && !showResults && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <select
                        value={testSettings.scope}
                        onChange={(e) => setTestSettings((s) => ({ ...s, scope: e.target.value as any }))}
                        className="border border-input rounded-lg px-3 py-2 bg-input text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="topic">Topic Only</option>
                        <option value="class">Full Class</option>
                      </select>
                      <select
                        value={testSettings.count}
                        onChange={(e) => setTestSettings((s) => ({ ...s, count: parseInt(e.target.value) }))}
                        className="border border-input rounded-lg px-3 py-2 bg-input text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} Questions</option>)}
                      </select>
                      <button
                        onClick={startTest}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
                      >
                        Start Test
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="min-h-[400px]">
              {loading && <p className="text-muted-foreground">Loading...</p>}

              {mode === "flashcards" && filteredCards.length > 0 && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center justify-between w-full max-w-xl">
                    <button
                      onClick={() => setCurrentCardIndex(i => Math.max(0, i - 1))}
                      disabled={currentCardIndex === 0}
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg disabled:opacity-50 transition hover:bg-secondary/80"
                    >Prev</button>
                    <span className="text-muted-foreground font-medium">
                      Card {currentCardIndex + 1} of {filteredCards.length}
                    </span>
                    <button
                      onClick={() => setCurrentCardIndex(i => Math.min(filteredCards.length - 1, i + 1))}
                      disabled={currentCardIndex === filteredCards.length - 1}
                       className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg disabled:opacity-50 transition hover:bg-secondary/80"
                    >Next</button>
                  </div>

                  <motion.div
                    key={currentCardIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-xl h-64 perspective-[1000px] cursor-pointer"
                    onClick={() => setIsFlipped(f => !f)}
                  >
                    <motion.div
                      className="relative w-full h-full transition-transform duration-500 preserve-3d"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                    >
                      <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-card border border-border rounded-lg shadow-md">
                        <p className="text-lg font-semibold text-center text-card-foreground">
                          {filteredCards[currentCardIndex]?.question}
                        </p>
                      </div>
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-6 bg-secondary border border-border rounded-lg shadow-md">
                        <p className="text-lg font-semibold text-center text-secondary-foreground">
                          {filteredCards[currentCardIndex]?.answer}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              )}

              {mode === "test" && testQuestions.length > 0 && (
                <div className="flex flex-col items-center space-y-6">
                  {!showResults ? (
                    <>
                      <div className="w-full max-w-2xl text-center">
                          <p className="text-sm text-muted-foreground mb-1">Question {currentTestIndex + 1} of {testQuestions.length}</p>
                          <p className="text-xl font-semibold text-foreground">
                              {testQuestions[currentTestIndex].question}
                          </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                          {testQuestions[currentTestIndex].options.map((opt, i) => (
                          <button
                              key={i}
                              onClick={() => selectAnswer(opt)}
                              className={`p-4 rounded-lg border transition-all text-left font-medium ${
                                  userAnswers[currentTestIndex] === opt
                                  ? "bg-primary text-primary-foreground border-primary/50 ring-2 ring-primary"
                                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground border-border"
                              }`}
                          >
                              {opt}
                          </button>
                          ))}
                      </div>
                       <div className="flex items-center justify-between w-full max-w-2xl">
                            <button
                                onClick={() => setCurrentTestIndex(i => Math.max(0, i - 1))}
                                disabled={currentTestIndex === 0}
                                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg disabled:opacity-50 transition hover:bg-secondary/80"
                            >Prev</button>
                            <button
                                onClick={() => {
                                    if (currentTestIndex === testQuestions.length - 1) {
                                      setShowResults(true);
                                    } else {
                                      setCurrentTestIndex(i => i + 1);
                                    }
                                }}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg transition hover:bg-primary/90"
                            >
                                {currentTestIndex === testQuestions.length - 1 ? "Finish" : "Next"}
                           </button>
                        </div>
                    </>
                  ) : (
                    <div className="w-full max-w-2xl text-center space-y-4">
                        <h2 className="text-2xl font-bold text-emphasis">Test Results</h2>
                        <p className="text-xl text-foreground">
                            Your Score: {calculateScore()} / {testQuestions.length}
                        </p>
                        <button
                            onClick={() => { setMode("flashcards"); setTestQuestions([]); }}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg transition hover:bg-secondary/80"
                        >
                            Back to Flashcards
                        </button>
                    </div>
                  )}
                </div>
              )}

               {!flashcards && !loading && selectedClass && (
                   <p className="text-center text-muted-foreground">No flashcards found for {selectedClass.name}.</p>
               )}
               {!selectedClass && !loading && (
                   <p className="text-center text-muted-foreground">Select a class to view flashcards.</p>
               )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FlashCards;
