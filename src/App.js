import React, { useState, useRef, useEffect } from 'react';
import Map, { Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // Mapbox token

const trailData = require('./TrailData.json'); // Import trail data

// Convert trails to GeoJSON format
const geoJsonData = {
  type: 'FeatureCollection',
  features: trailData.map((trail) => ({
    type: 'Feature',
    properties: {
      id: trail.Unique_Id,
      name: trail.Trail_Name,
      distance: trail.Distance,
      elevationGain: trail.Elevation_Gain,
      difficulty: trail.Difficulty,
      rating: trail.Rating,
      reviews: trail.Review_Count,
      url: trail.Url,
      image: trail.Cover_Photo,
    },
    geometry: {
      type: 'Point',
      coordinates: [trail.Longitude, trail.Latitude],
    },
  })),
};

// Cluster Layers
const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'trails',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#2b2b2b',
      10,
      '#2b2b2b',
      50,
      '#2b2b2b',
    ],
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      15,
      20,
      20,
      50,
      25,
    ],
  },
};

const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'trails',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
  paint: {
    'text-color': '#ffffff',
  },
};

const unclusteredPointLayer = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'trails',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#2b2b2b',
    'circle-radius': 8,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
};

const App = () => {
  const [selectedTrail, setSelectedTrail] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current?.getMap();

    if (!map) return;

    map.on('load', () => {
      if (!map.getLayer('water')) {
        map.addLayer(
          {
            id: 'water',
            type: 'fill',
            source: 'composite',
            'source-layer': 'water',
            paint: {
              'fill-color': '#1831F5', // Blue water
              'fill-opacity': 0.7, // Semi-transparent water
            },
          },
          'hillshade' // Place the water layer below hillshading
        );
      }
    });
  }, []);

  const waterLayer = {
    id: 'water',
    type: 'fill',
    source: 'composite',
    'source-layer': 'water',
    paint: {
      'fill-color': '#1831F5', // Blue water
      'fill-opacity': 0.7, // Semi-transparent water
    },
  };

  const handleClusterClick = (event, clusterId) => {
    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(event.point, {
      layers: ['clusters'],
    });

    if (features.length === 0) return;

    const cluster = features[0];
    const clusterSource = map.getSource('trails');

    clusterSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;

      map.easeTo({
        center: cluster.geometry.coordinates,
        zoom,
      });
    });
  };

  const handleTrailClick = (event) => {
    const feature = event.features && event.features[0];
    if (feature) setSelectedTrail(feature);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: 44.0,
          longitude: -120.0,
          zoom: 6.5,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={process.env.REACT_APP_MAPBOX_STYLE} // Mapbox style URL
        style={{ width: '100%', height: '100%' }}
        interactiveLayerIds={['clusters', 'unclustered-point']}
        onClick={(event) => {
          const features = event.features || [];
          if (features.length > 0) {
            const clickedFeature = features[0];
            if (clickedFeature.layer.id === 'clusters') {
              handleClusterClick(event, clickedFeature.properties.cluster_id);
            } else if (clickedFeature.layer.id === 'unclustered-point') {
              handleTrailClick(event);
            }
          }
        }}
      >
        {/* Water Layer */}
        <Layer {...waterLayer} />
        {/* Source for trails */}
        <Source
          id="trails"
          type="geojson"
          data={geoJsonData}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          {/* Clustered Circles */}
          <Layer {...clusterLayer} />
          {/* Cluster Count */}
          <Layer {...clusterCountLayer} />
          {/* Unclustered Points */}
          <Layer {...unclusteredPointLayer} />
        </Source>

        {/* Show popup on trail click */}
        {selectedTrail && (
          <Popup
          latitude={selectedTrail.geometry.coordinates[1]}
          longitude={selectedTrail.geometry.coordinates[0]}
          anchor="top"
          onClose={() => setSelectedTrail(null)}
          className="custom-popup"
        >
          <div
            style={{
              textAlign: 'center',
              color: '#ffffff',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <h3 style={{ margin: '5px 0' }}>{selectedTrail.properties.name}</h3>
            <img
              src={selectedTrail.properties.image || 'https://via.placeholder.com/150'}
              alt={selectedTrail.properties.name}
              style={{
                width: '100%',
                maxHeight: '150px',
                objectFit: 'cover',
                borderRadius: '5px',
              }}
            />
            <p style={{ margin: '5px 0' }}>
              <strong>Distance:</strong> {selectedTrail.properties.distance} miles
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Elevation Gain:</strong> {selectedTrail.properties.elevationGain} ft
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Difficulty:</strong> {selectedTrail.properties.difficulty}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Rating:</strong> {selectedTrail.properties.rating} / 5 (
              {selectedTrail.properties.reviews} reviews)
            </p>
            <p style={{ margin: '5px 0' }}>
              <a
                href={selectedTrail.properties.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#08ff08', textDecoration: 'none' }}
              >
                View More
              </a>
            </p>
          </div>
        </Popup>        
        )}
      </Map>
    </div>
  );
};

export default App;

