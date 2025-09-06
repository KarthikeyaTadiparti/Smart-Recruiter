import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CreateInterview from "./pages/recruiter/CreateInterview";
import ManageInterview from "./pages/recruiter/ManageInterview";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import Login from "./pages/auth/Login";

function App() {
    return (
        <>
            {/* public routes */}
            <Routes>
                    <Route path="/login" element={<Login />} />
            </Routes>

            {/* protected routes */}
            <Routes>
                <Route path="/recruiter" element={<Layout />}>
                    <Route index element={<RecruiterDashboard />} />
                    <Route path="create-interview" element={<CreateInterview />} />
                    <Route path="manage-interview" element={<ManageInterview />} />
                </Route>

                <Route path="/candidate" element={<Layout />}>
                    <Route index element={<CandidateDashboard />} />
                    <Route path="create-interview" element={<CreateInterview />} />
                    <Route path="manage-interview" element={<ManageInterview />} />
                </Route>
            </Routes>

        </>
    );
}

export default App;
