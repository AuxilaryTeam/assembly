import { Routes, Route } from "react-router-dom";
import SearchPrint from "./components/Searchprint";
import Print from "./components/Print";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPrint />} />
      <Route path="/Print" element={<Print />} />
    </Routes>
  );
}

export default App;
