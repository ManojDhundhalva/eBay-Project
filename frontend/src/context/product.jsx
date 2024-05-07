import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const productContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productId, setProductId] = useState("");
  const navigate = useNavigate();

  return (
    <productContext.Provider value={{ productId, setProductId }}>
      {children}
    </productContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(productContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
