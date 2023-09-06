import { point, circle, booleanPointInPolygon } from "@turf/turf";

import ControlPanel, { Submission } from "./Control";
import { useState } from "react";

function calculateCentroid(coordinatesArray) {
  coordinatesArray.filter((coord) => {
    return coord.length == 2;
  });
  const sumLng = coordinatesArray.reduce((sum, coord) => sum + coord[0], 0);
  const sumLat = coordinatesArray.reduce((sum, coord) => sum + coord[1], 0);
  const avgLng = sumLng / coordinatesArray.length;
  const avgLat = sumLat / coordinatesArray.length;
  return [avgLng, avgLat];
}

function getCoordFromFeature(feature) {
  const coord = feature.geometry.coordinates;
  if (coord.length == 0) {
    return null;
  }
  return Array.isArray(coord[0]) ? calculateCentroid(coord) : coord;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function createFocus(data) {
  let longitude;
  let latitude;

  while (true) {
    const coord = getCoordFromFeature(
      data.court.features[getRandomInt(data.court.features.length)],
    );
    if (coord && coord.length == 2 && coord[0] && coord[1]) {
      longitude = coord[0];
      latitude = coord[1];
      break;
    }
  }

  let circleRadius = 5;
  while (true) {
    const centerPoint = point([longitude, latitude]);
    const circlePolygon = circle(centerPoint, circleRadius, { steps: 64 });

    const filteredMatsuya = data.matsuya.features.filter((feature) => {
      const coord = getCoordFromFeature(feature);
      return (
        coord &&
        booleanPointInPolygon(
          Array.isArray(coord[0]) ? calculateCentroid(coord) : coord,
          circlePolygon,
        )
      );
    });

    const filteredNishimatsuya = data.nishimatsuya.features.filter(
      (feature) => {
        const coord = getCoordFromFeature(feature);
        return (
          coord &&
          booleanPointInPolygon(
            Array.isArray(coord[0]) ? calculateCentroid(coord) : coord,
            circlePolygon,
          )
        );
      },
    );
    if (
      filteredMatsuya.length + filteredNishimatsuya.length >= 2 &&
      filteredMatsuya.length != filteredNishimatsuya.length
    ) {
      return [
        longitude,
        latitude,
        circleRadius,
        circlePolygon,
        filteredMatsuya,
        filteredNishimatsuya,
      ];
    }
    if (circleRadius >= 50) {
      return createFocus(data, longitude, latitude);
    }
    circleRadius += 10;
  }
}

function createMap(data) {
  const [
    longitude,
    latitude,
    circleRadius,
    circlePolygon,
    filteredMatsuya,
    filteredNishimatsuya,
  ] = createFocus(data);

  const zoom = 10 - circleRadius / 15;

  const answer = (function () {
    if (filteredMatsuya.length < filteredNishimatsuya.length) {
      return Submission.NISHIMATSUYA;
    }
    if (filteredMatsuya.length > filteredNishimatsuya.length) {
      return Submission.MATSUYA;
    }
    return Submission.DRAW;
  })();

  return {
    latitude: latitude,
    longitude: longitude,
    zoom: zoom,
    circlePolygon: circlePolygon,
    filteredMatsuya: filteredMatsuya,
    filteredNishimatsuya: filteredNishimatsuya,
    answer: answer,
  };
}

function Main({ data }) {
  const [mapprops, setMapprops] = useState(createMap(data));

  return (
    <>
      <h1>松屋 vs 西松屋</h1>
      <ControlPanel
        mapprops={mapprops}
        resetMapFunc={() => {
          setMapprops(createMap(data));
        }}
      />
      <p className="credit">
        Source:{" "}
        <a href="https://github.com/TadaTeruki/matsuyanishimatsuya">
          https://github.com/TadaTeruki/matsuyanishimatsuya
        </a>
      </p>
    </>
  );
}

export default Main;
