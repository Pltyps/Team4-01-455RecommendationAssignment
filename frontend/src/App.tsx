import { useState } from "react";
import axios from "axios";

interface Recommendations {
  collaborative: string[];
  content: string[];
  azure: string[];
}

const App = () => {
  const [itemId, setItemId] = useState<string>("");
  const [recommendations, setRecommendations] = useState<Recommendations>({
    collaborative: [],
    content: [],
    azure: [],
  });
  const [error, setError] = useState<string>("");

  const fetchRecommendations = async (itemId: string) => {
    if (!itemId.trim()) {
      setError("Item ID is required");
      return;
    }

    const encodedItemId = encodeURIComponent(itemId.trim());

    try {
      const [collabRes, contentRes, azureRes] = await Promise.all([
        axios.get(
          `http://127.0.0.1:5000/recommendations/collaborative?contentId=${encodedItemId}`
        ),
        axios.get(
          `http://127.0.0.1:5000/recommendations/content?contentId=${encodedItemId}`
        ),
        axios.get(
          `http://127.0.0.1:5000/recommendations/azure?contentId=${encodedItemId}`
        ),
      ]);

      setRecommendations({
        collaborative: collabRes.data || [],
        content: contentRes.data || [],
        azure: azureRes.data || [],
      });
      setError("");
    } catch (err: any) {
      if (err.response) {
        setError(
          `Error: ${err.response.data.message || err.response.statusText}`
        );
      } else if (err.request) {
        setError("Error: No response from server");
      } else {
        setError(`Error: ${err.message || "Unknown error"}`);
      }
    }
  };

  return (
    <div>
      <h1>Recommendation System</h1>

      <div>
        <label>
          Enter Content ID:
          <input
            type="text"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="e.g., -9189659052158407108"
          />
        </label>
        <button onClick={() => fetchRecommendations(itemId)}>Search</button>
      </div>

      {error && (
        <div style={{ color: "red" }}>
          <strong>{error}</strong>
        </div>
      )}

      {recommendations && (
        <div>
          <h2>Collaborative Recommendations</h2>
          <ul>
            {recommendations.collaborative.length > 0 ? (
              recommendations.collaborative.map((item, index) => (
                <li key={index}>
                  Recommendation {index + 1}: {item}
                </li>
              ))
            ) : (
              <li>No collaborative recommendations found</li>
            )}
          </ul>

          <h2>Content-Based Recommendations</h2>
          <ul>
            {recommendations.content.length > 0 ? (
              recommendations.content.map((item, index) => (
                <li key={index}>
                  Recommendation {index + 1}: {item}
                </li>
              ))
            ) : (
              <li>No content-based recommendations found</li>
            )}
          </ul>

          <h2>Azure ML Recommendations</h2>
          <ul>
            {recommendations.azure.length > 0 ? (
              recommendations.azure.map((item, index) => (
                <li key={index}>
                  Recommendation {index + 1}: {item}
                </li>
              ))
            ) : (
              <li>No Azure recommendations found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
