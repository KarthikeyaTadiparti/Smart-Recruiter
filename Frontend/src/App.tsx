import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";       
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import ManageInterview from "./pages/ManageInterview";

function App() {
    return (
        <>
            {/* <div className="bg-(--color-sec)">App</div> */}
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Dashboard />} />
                    <Route path="create" element={<CreateInterview />} />
                    <Route path="manage-interview" element={<ManageInterview />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
