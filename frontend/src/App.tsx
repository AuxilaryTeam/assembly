import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import PublicPollDisplay from "./pages/Poll";
import Issues from "./pages/Issues";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/p" element={<PublicPollDisplay />} />
        </Routes>
        <Routes>
          <Route path="/i" element={<Issues />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
