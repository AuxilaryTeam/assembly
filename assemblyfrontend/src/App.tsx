import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import DashboardLayout from "./components/DashboardLayout";
import Search from "./components/search/Search";
import Searchprint from "./components/search/Searchprint";
import Diplay from "./components/display/Display";
import Diplayprint from "./components/display/DisplayPrint";
import Print from "./components/print/Print";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute, { UserRole } from "./components/ProtectedRoute";
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
import SearchPrint from "./components/print_dividend/Searchprint";
import { AttendanceProvider } from "./components/utils/AttendanceContext";

function App() {
  console.log("App component rendering");

  return (
    <AttendanceProvider>
      <Router basename="/assembly">
        <Routes>
          {/* Public Routes */}
          <Route path="" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/assembly_dividend" element={<SearchPrint />} />
            <Route path="/assembly_dividend/Print" element={<Print />} />
          </Route>
          <Route path="/proposals/:id" element={<PublicPoposalDisplay />} />
          <Route path="/polls/:id" element={<PublicPollDisplay />} />
          <Route path="/display" element={<Diplay />} />

          {/* Protected Routes with Role-Based Access */}

          {/* Basic authentication only (any logged-in user) */}
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
              <Route path="/displayprint" element={<Diplayprint />} />
            </Route>
          </Route>

          {/* User role and above */}
          <Route
            element={
              <ProtectedRoute requiredRoles={["user", "moderator", "admin"]} />
            }
          >
            <Route
              element={
                <AuthLayout>
                  <DashboardLayout />
                </AuthLayout>
              }
            >
              <Route path="/print" element={<Print />} />
              <Route path="/positions" element={<PositionsPage />} />
              <Route path="/positions/:id" element={<PositionDetailPage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/issues/:id" element={<IssueDetailPage />} />
              <Route path="/candidates" element={<CandidatesPage />} />
            </Route>
          </Route>

          {/* Moderator role and above */}
          <Route
            element={<ProtectedRoute requiredRoles={["moderator", "admin"]} />}
          >
            <Route
              element={
                <AuthLayout>
                  <DashboardLayout />
                </AuthLayout>
              }
            >
              <Route path="/attendancereport" element={<AttendanceReport />} />
              <Route path="/votereportspage" element={<VoteReportsPage />} />
              <Route path="/printprevdisplay" element={<PrintPrevDisplays />} />
              <Route path="/elections" element={<ElectionsPage />} />
              <Route path="/log" element={<PrintPrevDisplays />} />
            </Route>
          </Route>

          {/* Admin only routes */}
          <Route element={<ProtectedRoute requiredRoles="admin" />}>
            <Route
              element={
                <AuthLayout>
                  <DashboardLayout />
                </AuthLayout>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/displayselector"
                element={<PollProposalSelectorPage />}
              />
            </Route>
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </AttendanceProvider>
  );
}

export default App;
