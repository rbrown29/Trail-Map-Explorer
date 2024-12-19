# Trail Map Explorer

Trail Map Explorer is a React-based web application that displays hiking trails on an interactive Mapbox map. Trails are displayed as clustered or unclustered points, and clicking on a trail reveals detailed information in a popup.

## Features

- **Interactive Map**: Powered by Mapbox GL JS.
- **Trail Clustering**: Group trails into clusters for better visualization.
- **Popup Info**: Display trail details (name, distance, elevation gain, difficulty, rating, reviews, and more) on click.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/trail-map-explorer.git
    cd trail-map-explorer
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory and add your Mapbox access token:
    ```bash
    REACT_APP_MAPBOX_ACCESS_TOKEN=your-access-token
    ```
4.  Add trail data: - Create a `TrailData.json` file in the `src` directory containing trail information in the following format:
    ```json
    [
      {
        "Unique_Id": "1",
        "Trail_Name": "Trail Name",
        "Distance": 5.5,
        "Elevation_Gain": 1200,
        "Difficulty": "Moderate",
        "Rating": 4.5,
        "Review_Count": 20,
        "Url": "https://example.com",
        "Cover_Photo": "https://example.com/photo.jpg",
        "Longitude": -120.123,
        "Latitude": 44.123
    
      }
    ]
    ```
    or use the data provided in `src/TrailData.json`.

5.  Start the development server:
    ```bash
    npm start
    ```

## Usage
  - View Trails: Navigate around the map to view hiking trails.
  - Trail Data: Trail data is imported from TrailData.json and converted to JSON format.
  - Trail Clustering: Trails are clustered based on proximity for better visualization.

## Code Structure
  - `App.js`: Main application file containing the Mapbox map and its layers.
  - `Trail Data`: Trail data is imported from `TrailData.json` and   converted to GeoJSON format.
  - `Map Layers`: Includes clustered points and unclustered points.

## Dependencies
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/): Interactive, customizable maps.
- [React-map-gl](https://visgl.github.io/react-map-gl/): React wrapper for Mapbox GL JS.
- [React](https://reactjs.org/): JavaScript library for building user interfaces.
- [AllTrails](https://www.alltrails.com/): Hiking trail data.
- [OSM](https://www.openstreetmap.org/): Map data.

## Deployment
[Trail Map Explorer](https://trailmapexplorer.netlify.app/)


## Screenshots
![Trail Map Explorer](/src/assets/TrailMap.png)

![Trail Map Explorer](/src/assets/TrailMapPopup.png)