import { useState } from "react";
import axios from "axios";
import azureImage from './assets/Screenshot_5-4-2025_113257_ml.azure.com.jpeg';


interface Recommendations {
  collaborative: string[];
  content: string[];
  // azure: string[];
}

const App = () => {
  const contentIds = [
    "6817244649248188271",
    "-885886002174762919",
    "6006800146436649545",
    "-3231932874544830919",
    "-7442296890640709658",
    "-6570327055377820618",
    "-1897853393557630253",
    "8734156751308150579",
    "-3179358869851478234",
    "-6761163882540291832",
    "679005777543560737",
    "-8052188270551570124",
    "7510090557616166004",
    "-5628343274127925011",
    "8631616594020837056",
    "-6207670654614839859",
    "2255878226385826814",
    "-5458316826145145813",
    "5395868751435718725",
    "1797385737206265555",
    "5410293063635507608",
    "8240934591713322028",
    "174707786647990372",
    "-9033211547111606164",
    "8779890754987103603",
    "-2424983931459616622",
    "6587635730509289343",
    "5211673327552264703",
    "886450434856305025",
    "-3061741807736367554",
    "348632682812866328",
    "3128282567747885251",
    "4430520614172753870",
    "-6884335507424704154",
    "4785499183287168509",
    "-4673235524420943843"
  ];

  const [itemId, setItemId] = useState<string>(contentIds[0]);  // Set default to first itemId
  const [recommendations, setRecommendations] = useState<Recommendations>({
    collaborative: [],
    content: [],
    // azure: [],
  });
  const [error, setError] = useState<string>("");

  const fetchRecommendations = async (itemId: string) => {
    if (!itemId.trim()) {
      setError("Item ID is required");
      return;
    }

    const encodedItemId = encodeURIComponent(itemId.trim());

    try {
      // Fetch collaborative recommendations
      const collaborativeResponse = await axios.get(
        `http://127.0.0.1:5000/recommendations/collaborative?contentId=${encodedItemId}`
      );

      // Fetch content-based recommendations
      const contentResponse = await axios.get(
        `http://127.0.0.1:5000/recommendations/content?contentId=${encodedItemId}`
      );

      // Set the results for all three types
      setRecommendations({
        collaborative: collaborativeResponse.data || [],
        content: contentResponse.data || [],
        // azure: azureResponse.data || [],
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

      {/* Dropdown for selecting content ID */}
      <div>
        <label>
          Select Content ID:
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          >
            {contentIds.map((id, index) => (
              <option key={index} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <button onClick={() => fetchRecommendations(itemId)}>Search</button>
      </div>

      {/* Error message */}
      {error && (
        <div style={{ color: "red" }}>
          <strong>{error}</strong>
        </div>
      )}

      {/* Display recommendations in separate lists */}
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
          <img 
            src={azureImage} 
            alt="Azure ML Recommendations" 
            style={{ maxWidth: "50%", height: "auto" }} 
          />
        </div>
      )}
    </div>
  );
};

export default App;
