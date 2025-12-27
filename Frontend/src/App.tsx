import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CreateInterview from "./pages/recruiter/CreateInterview";
import ManageInterview from "./pages/recruiter/ManageInterview";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import Login from "./pages/auth/Login";
import { useAppDispatch, useAppSelector } from "./hooks/use-redux";
import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { _userLogout } from "./redux/actions/auth-actions";
import { toast } from "sonner";
import Signup from "./pages/auth/Signup";
import Explore from "./pages/candidate/Explore";
import MyInterviews from "./pages/candidate/MyInterviews";
// import Test from "./pages/Test";
// import Cam from "./pages/Cam";
// import VapiWidget from "./pages/VapiWidget";
import InterviewQuestions from "./pages/recruiter/InterviewQuestions";
import Job from "./pages/candidate/Job";
import Interview from "./pages/candidate/Interview";
import Feedback from "./pages/candidate/Feedback";
import InterviewReport from "./pages/recruiter/InterviewReport";


const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { userData, loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoggingOut = useRef(false); // Prevent multiple logouts

  useEffect(() => {
    if (!userData && !isLoggingOut.current && !loading.logout) {
      isLoggingOut.current = true; // Mark logout as started

      (async () => {
        const { payload } = await dispatch(_userLogout({ navigate }));
        if (payload?.data?.status) {
          toast.success(payload.data.message);
          navigate('/login');
        }
      })();
    }
  }, []);

  if (!userData) return null;

  return element;
};


const ProtectedAuthRoute = ({ element }: { element: React.ReactNode }) => {
  const { userData } = useAppSelector((state) => state.auth);
  if (userData) {
    const role = userData.role;
    if (role === "candidate") {
      return <Navigate to="/candidate" replace />;
    }
    if (role === "recruiter") {
      return <Navigate to="/recruiter" replace />;
    }
  }

  return <>{element}</>;
};



function App() {
  const { userData, company } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log("user data : ", userData);
    console.log("company details : ", company);
  }, [userData]);

  return (
    <>
      <Routes>
        {/* default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* public route */}
        <Route path="/login" element={<ProtectedAuthRoute element={<Login />} />} />
        <Route path="/signup" element={<ProtectedAuthRoute element={<Signup />} />} />
        <Route path="/interviews/:id" element={<Interview />} />

        {/* protected routes */}
        <Route path="/recruiter" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<RecruiterDashboard />} />
          <Route path="create-interview" element={<CreateInterview />} />
          <Route path="manage-interview" element={<ManageInterview />} />
          <Route path="manage-interview/:id" element={<InterviewReport />} />
          <Route path="feedback/:id" element={<Feedback />} />
          <Route path="interview-questions/:id" element={<InterviewQuestions />} />
        </Route>

        <Route path="/candidate" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<CandidateDashboard />} />
          <Route path="explore" element={<Explore />} />
          <Route path="explore/:id" element={<Job />} />
          <Route path="my-interviews" element={<MyInterviews />} />
          <Route path="my-interviews/:id" element={<Feedback />} />
        </Route>
      </Routes>

    </>
  );
}

export default App;
