import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Introduction from "./pages/Introduction.jsx";
import { Toaster } from "react-hot-toast";
import StepTH from "./pages/user/StepTH.jsx";


function App() {

  return (
    <div className="App">
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Introduction />} />
      <Route path="/step" element={<StepTH />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} /> {/* Xử lý 404 */}
    </Routes>
  );
}

export default App
