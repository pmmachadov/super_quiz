// useAuth.js - Hook para acceder al contexto de autenticación
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// Function to access the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
