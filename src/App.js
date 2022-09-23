import "./App.css";
import CountriesTables from "./components/CountriesTables";

function App() {
  return (
    <div className=" ">
      <div className="d-flex flex-column align-items-center ">
        <h1 className="font-bold "> React Datatable</h1>
      </div>
      <div>
        <CountriesTables />
      </div>
    </div>
  );
}

export default App;
