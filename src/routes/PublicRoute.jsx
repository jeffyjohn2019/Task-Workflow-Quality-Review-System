import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  console.log("token from public", token)
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default PublicRoute;