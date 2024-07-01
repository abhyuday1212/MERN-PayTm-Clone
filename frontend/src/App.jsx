import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";
import { NoMatch } from "./pages/NoMatch";

import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home } from "./pages/Home";
import { useLocation } from "react-router-dom";
import axios from "axios";


const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function checkAuthentication() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/v1/user/me",
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          if (response.data.isSuccess) {
            setIsUserAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            setIsUserAuthenticated(false);
          }
        } catch (error) {
          localStorage.removeItem("token");
          setIsUserAuthenticated(false);
        }
      } else {
        setIsUserAuthenticated(false);
      }
      setIsCheckingAuth(false);
    }

    checkAuthentication();
  }, [location]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home isAuthenticated={isUserAuthenticated} />}
        />

        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          element={
            <PrivateRoute isAuthenticated={isUserAuthenticated}>
              <Outlet />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
        </Route>

        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}

export default App;
