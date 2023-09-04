import Map, { Layer, Source, Marker } from "react-map-gl/maplibre";
import { useState, useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

function App() {
  const [data0, setData0] = useState(null);
  const [clickedCoordinates, setClickedCoordinates] = useState(null);

  useEffect(() => {
    fetch("public/geodata/nishimatsuya.geojson")
      .then((resp) => resp.json())
      .then((json) => setData0(json));
  }, []);

  const handleClick = (event) => {
    const longitude = event.lngLat.lng;
    const latitude = event.lngLat.lat;
    setClickedCoordinates({ latitude, longitude });
  };

  return (
    <>
      <Map
        initialViewState={{
          latitude: 35.709,
          longitude: 139.7319,
          zoom: 7,
        }}
        style={{ width: "100vw", height: "80vh" }}
        onClick={handleClick}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <Source
          type="geojson"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={10}
          data={data0}
        >
          <Layer
            {...{
              id: "matsuya",
              type: "circle",
              paint: {
                "circle-radius": [
                  "step",
                  ["get", "point_count"],
                  10,
                  100,
                  20,
                  200,
                  30,
                ],
                "circle-color": "red",
              },
            }}
          />
        </Source>
        {clickedCoordinates && (
          <Marker
            latitude={clickedCoordinates.latitude}
            longitude={clickedCoordinates.longitude}
          ></Marker>
        )}
      </Map>
    </>
  );
}

export default App;
