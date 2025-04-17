import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface ClassData {
  _id: string;
  name: String;
  topics: String[];
}

interface FlashcardsData {
  topic: String;
  question: String;
  answer: String;
}

const FlashCards = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardsData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = () => {
      const userId = "google-oauth2|117092462712380430315";

      axios
        .get(`http://localhost:3000/class/user/${userId}`)
        .then((response) => {
          setClasses(response.data);
        })
        .catch((err) => {
          console.error("Failed to fetch classes:", err);
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchClasses();
  }, []);

  const fetchFlashcards = async (classId: string) => {
    setLoading(true);
    setFlashcards(null);
    setSelectedTopic(null);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/cards/class/${classId}`
      );
      if (response.data.length === 0) {
        setFlashcards([]);
      } else {
        setFlashcards(response.data);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (classItem: ClassData) => {
    setSelectedClass(classItem);
    fetchFlashcards(classItem._id);
  };

  const handleGenerateFlashcards = async () => {
    if (!selectedClass) return;

    setLoading(true);
    setError(null);

    axios
      .post(`http://localhost:3000/cards/${selectedClass._id}`)
      .then(() => {
        return fetchFlashcards(selectedClass._id);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to generate flashcards.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const topics = flashcards
    ? [...new Set(flashcards.map((card) => card.topic))]
    : [];

  const filteredCards =
    flashcards && selectedTopic
      ? flashcards.filter((card) => card.topic === selectedTopic)
      : [];

 

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full h-full p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        {/* Class List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Select a Class</h2>
          {classes.length === 0 && (
            <p>No classes found. Upload a syllabus to get started</p>
          )}
          <div className="space-y-4">
            {classes.map((classItem) => (
              <div
                key={classItem._id}
                onClick={() => handleClassClick(classItem)}
                className={`cursor-pointer p-4 rounded-md border ${
                  selectedClass?._id === classItem._id
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <h3 className="text-lg font-semibold">{classItem.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Flashcards */}
        {selectedClass && flashcards && flashcards.length === 0 && (
          <div className="text-center space-y-2">
            <p className="text-gray-600">No flashcards found for this class.</p>
            <button
              onClick={handleGenerateFlashcards}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Flashcards"}
            </button>
          </div>
        )}

        {/* Topic Selector */}
        {flashcards && flashcards.length > 0 && (
          <div className="bg-white p-4 rounded-md shadow-md">
            <label className="text-gray-700 font-medium mr-2">
              Filter by Topic:
            </label>
            <select
              value={selectedTopic || ""}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="border px-3 py-2 rounded-md"
            >
              <option value="">-- Select a topic --</option>
              {topics.map((topic, idx) => (
                <option key={idx} value={topic as string}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Flashcards Display */}
        {filteredCards.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Flashcards</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredCards.map((card, index) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() =>
                    setFlippedCardIndex(
                      flippedCardIndex === index ? null : index
                    )
                  }
                  style={{ perspective: "1000px" }}
                >
                  <motion.div
                    className="relative w-full h-48"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: flippedCardIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Front */}
                    <div
                      className="absolute w-full h-full rounded-md p-4 bg-white border shadow"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <p className="text-sm text-gray-500 mb-1">
                        Topic:{" "}
                        <span className="font-medium text-gray-800">
                          {card.topic}
                        </span>
                      </p>
                      <p className="font-semibold text-lg">{card.question}</p>
                    </div>

                    {/* Back */}
                    <div
                      className="absolute w-full h-full rounded-md p-4 bg-blue-100 border shadow"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <p className="text-md text-gray-800">
                        <span className="font-semibold">A:</span> {card.answer}
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default FlashCards;
