import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import PublicPollDisplay from "./pages/Poll";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<PublicPollDisplay />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
