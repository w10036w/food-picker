import React, { createContext, useState } from "react";
import styles from './App.module.scss';
import logo from './svgs/logo.svg';
import { MyContextType } from "./types";
import { useMyContext } from "./hooks/useContext";
import Auth from "./containers/Auth";
import { useGetInitial } from "./hooks/useGetToken";
import dayjs from "dayjs";
import { setToStorage } from "./utils";
import { useChromeStorage } from "./hooks/useChromeStorage";
import Home from "./containers/Home";

// Create the context
export const MyContext = createContext<MyContextType | null>(null);

// Create a provider component
export const MyContextProvider = ({ children }: any) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const day = new Date().getDate();
  const hour = new Date().getHours();
  const formatHour = hour < 10 ? 10 : hour <= 15 ? hour : 19;
  const [date, setDate] = useState(dayjs(new Date(year, month, day, formatHour)));
  const [storage, setStorage] = useState<any>({});
  const [vendorCode, setVendorCode] = useState('');
  
  const updateStorage = (key: string, value: any) => {
    setStorage((prev: any) => ({ ...prev, [key]: value }))
    setToStorage(key, value);
  }
  
  return (
    <MyContext.Provider value={{ date, setDate, storage, updateStorage, vendorCode, setVendorCode }}>
      {children}
    </MyContext.Provider>
  );
};


const App = () => {
  const { storage } = useMyContext();
  const { token, host } = storage;
  useChromeStorage();
  useGetInitial()
  return (
    <div className={styles.app}>
      <div className={styles.title}>
        <img src={logo} />
        Food Picker - Fuan Tuan
      </div>
      {token && host?.code ? <Home /> : <Auth />}
    </div>
  );
}

const WrapApp = () => {
  return (
    <MyContextProvider>
      <App />
    </MyContextProvider>
  )
}

export default WrapApp;
