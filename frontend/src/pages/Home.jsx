import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Home = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return <div>Home</div>;
};
