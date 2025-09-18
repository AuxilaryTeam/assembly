import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import {
  IssueDetailPage,
  IssuesPage,
  PositionDetailPage,
  PositionsPage,
  PublicPollDisplay,
  SignIn,
  SignUp,
} from "./index";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<PublicPollDisplay />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/positions/:id" element={<PositionDetailPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
