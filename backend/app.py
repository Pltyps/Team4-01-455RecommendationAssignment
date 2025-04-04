from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the CSV files for collaborative and content filtering
try:
    collab_df = pd.read_csv(r'C:\Users\Navin\OneDrive\Desktop\BYU Winter 2025\IS 455\Recommendation\backend\GroupCollaborativeFiltering.csv')
    content_df = pd.read_csv(r'C:\Users\Navin\OneDrive\Desktop\BYU Winter 2025\IS 455\Recommendation\backend\GroupContentFiltering.csv')
    print("CSV files loaded successfully.")
except Exception as e:
    print(f"Error loading CSV files: {e}")

# Swagger UI setup
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'  # Location of the Swagger JSON
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Recommendation API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

@app.route('/recommendations/collaborative', methods=['GET'])
def get_collaborative_recommendations():
    content_id = request.args.get('contentId')

    if not content_id:
        return jsonify({"error": "contentId is required"}), 400

    try:
        # Select the top 5 recommendations for the given contentId
        rec_columns = ['Recommendation 1', 'Recommendation 2', 'Recommendation 3', 'Recommendation 4', 'Recommendation 5']
        rec_values = collab_df[rec_columns].iloc[0].tolist()
        collab_list = [rec for rec in rec_values if pd.notna(rec)][:5]
    except Exception as e:
        print(f"Error fetching collaborative recommendations: {e}")
        return jsonify({"error": f"Error fetching collaborative recommendations: {e}"}), 500

    return jsonify(collab_list)

@app.route('/recommendations/content', methods=['GET'])
def get_content_recommendations():
    content_id = request.args.get('contentId')

    if not content_id:
        return jsonify({"error": "contentId is required"}), 400

    try:
        # Check if the contentId exists as a column in content_df
        if content_id not in content_df.columns:
            return jsonify({"error": f"contentId '{content_id}' not found in content recommendations data."}), 404

        # Retrieve the recommendations for the given contentId
        content_recs = content_df[content_id].dropna().tolist()
        content_list = content_recs[:5]
    except Exception as e:
        print(f"Error fetching content recommendations: {e}")
        return jsonify({"error": f"Error fetching content recommendations: {e}"}), 500

    return jsonify(content_list)

if __name__ == '__main__':
    app.run(debug=True)
