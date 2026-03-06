import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "../App";       
import HomePage from "../pages/home"; 

export default function AppRoutes() {


  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<App />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}