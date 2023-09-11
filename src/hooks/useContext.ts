import { useContext } from "react";
import { MyContext } from "../App";
import { MyContextType } from "../types";

export const useMyContext = (): MyContextType => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};