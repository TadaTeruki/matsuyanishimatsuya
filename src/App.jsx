import rawMatsuya from "./assets/geodata/matsuya.geojson?raw";
import rawNishimatsuya from "./assets/geodata/nishimatsuya.geojson?raw";
import rawCourt from "./assets/geodata/court.geojson?raw";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import Main from "./components/Main";

function App() {
  const dataMatsuya = JSON.parse(rawMatsuya);
  const dataNishimatsuya = JSON.parse(rawNishimatsuya);
  const dataCourt = JSON.parse(rawCourt);

  const data = {
    matsuya: dataMatsuya,
    nishimatsuya: dataNishimatsuya,
    court: dataCourt,
  };

  return (
    <>
      <Main data={data} />
    </>
  );
}

export default App;
