import { useEffect, useState } from "react";
import Map, { Layer, Source, Marker } from "react-map-gl/maplibre";

function View({ props, submitted }) {
  let [viewport, setViewport] = useState({
    latitude: props.latitude,
    longitude: props.longitude,
    zoom: props.zoom,
  });
  useEffect(() => {
    setViewport({
      latitude: props.latitude,
      longitude: props.longitude,
      zoom: props.zoom,
    });
  }, [props]);
  return (
    <Map
      {...viewport}
      onMove={(e) => {
        setViewport(e.viewState);
      }}
      onViewportChange={(viewport) => {
        setViewport(viewport);
      }}
      style={{ width: "100vw", height: "50vh" }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    >
      {submitted && (
        <>
          <Source
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: props.filteredMatsuya,
            }}
          >
            <Layer
              {...{
                id: "matsuya",
                type: "circle",
                paint: {
                  "circle-radius": 5,
                  "circle-color": "#f00",
                },
              }}
            />
          </Source>
          <Source
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: props.filteredNishimatsuya,
            }}
          >
            <Layer
              {...{
                id: "nishimatsuya",
                type: "circle",
                paint: {
                  "circle-radius": 5,
                  "circle-color": "#00f",
                },
              }}
            />
          </Source>
        </>
      )}
      <Marker latitude={props.latitude} longitude={props.longitude}></Marker>
      <Source type="geojson" data={props.circlePolygon}>
        <Layer
          id="rectangle"
          type="fill"
          paint={{
            "fill-color": "#000",
            "fill-opacity": 0.1,
            "fill-outline-color": "blue",
          }}
        />
      </Source>
    </Map>
  );
}

export default View;
