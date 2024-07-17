import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await window.api.retrieveParams();
        if (session) {
          if (session.longLivedToken) { 
            setAuthenticated(true);
          } else {
            navigate("/onboarding2");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/onboarding2");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? children : <Navigate to="/onboarding2" />;
};

export default ProtectedRoute;
