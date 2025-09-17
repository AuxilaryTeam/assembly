import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import { IssuesPage, PublicPollDisplay, SignIn, SignUp } from "./index";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<PublicPollDisplay />} />
          <Route path="/issues" element={<IssuesPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
