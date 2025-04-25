import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RequireAuth from "./components/RequireAuth";
import Category from "./pages/Category";
import Discount from "./pages/Discount";
import Sizes from "./pages/Sizes";
import Colors from "./pages/Colors";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import News from "./pages/News";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/category"
            element={
              <RequireAuth>
                <Category />
              </RequireAuth>
            }
          />
          <Route
            path="/discount"
            element={
              <RequireAuth>
                <Discount />
              </RequireAuth>
            }
          />
          <Route
            path="/sizes"
            element={
              <RequireAuth>
                <Sizes />
              </RequireAuth>
            }
          />
          <Route
            path="/colors"
            element={
              <RequireAuth>
                <Colors />
              </RequireAuth>
            }
          />
          <Route
            path="/Faq"
            element={
              <RequireAuth>
                <Faq />
              </RequireAuth>
            }
          />
          <Route
            path="/contact"
            element={
              <RequireAuth>
                <Contact />
              </RequireAuth>
            }
          />
          <Route
            path="/team-members"
            element={
              <RequireAuth>
                <Team />
              </RequireAuth>
            }
          />
          <Route
            path="/news"
            element={
              <RequireAuth>
                <News />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
