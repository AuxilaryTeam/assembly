import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import DashboardLayout from "./components/DashboardLayout";
import Search from "./components/search/Search";
import Searchprint from "./components/search/Searchprint";
import Diplay from "./components/display/Display";
import Diplayprint from "./components/display/DisplayPrint";
import Print from "./components/print/Print";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./components/AuthLayout";
import PublicPollDisplay from "./components/pages/PublicPoll";
import PositionsPage from "./components/pages/PositionsPage";
import IssuesPage from "./components/pages/IssuesPage";
import PositionDetailPage from "./components/pages/PositionDetailPage";
import IssueDetailPage from "./components/pages/IssueDetailPage";
import PublicPoposalDisplay from "./components/pages/PublicProposal";
import PollProposalSelectorPage from "./components/pages/PollProposalSelectorPage";
import CandidatesPage from "./components/pages/CandidatesPage";
import PrintPrevDisplays from "./components/pages/PrintPrevDisplays";
import ElectionsPage from "./components/pages/ElectionPage";
import DashboardPage from "./components/pages/DashboardPage";
import AttendanceReport from "./components/report/AttendanceReport";
import VoteReportsPage from "./components/report/VoteReportsPage";

function App() {
  console.log("App component rendering");

  return (
    <>
      <Router basename="/assembly">
        <Routes>
          {/* Public Route: Login */}
          <Route path="" element={<Login />} />
          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <AuthLayout>
                  <DashboardLayout />
                </AuthLayout>
              }
            >
              <Route path="/search" element={<Search />} />
              <Route path="/searchprint" element={<Searchprint />} />
              <Route path="/attendancereport" element={<AttendanceReport />} />
              <Route path="/VoteReportsPage" element={<VoteReportsPage />} />

              <Route path="/displayprint" element={<Diplayprint />} />
              <Route path="/printprevdisplay" element={<PrintPrevDisplays />} />
              <Route path="/print" element={<Print />} />
              <Route path="/positions" element={<PositionsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/positions/:id" element={<PositionDetailPage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/issues/:id" element={<IssueDetailPage />} />
              <Route path="/elections" element={<ElectionsPage />} />
              <Route path="/log" element={<PrintPrevDisplays />} />

              <Route
                path="/displayselector"
                element={<PollProposalSelectorPage />}
              />
              <Route path="/candidates" element={<CandidatesPage />} />
            </Route>
          </Route>
          <Route path="/proposals/:id" element={<PublicPoposalDisplay />} />
          <Route path="/polls/:id" element={<PublicPollDisplay />} />
          <Route path="/display" element={<Diplay />} />
        </Routes>
      </Router>

      {/* Toast container where toasts will appear */}
      <Toaster />
    </>
  );
}

export default App;
