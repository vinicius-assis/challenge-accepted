import React, { createContext, useEffect, useState } from "react";
import weatherFetch from "../utils/WeatherFetch";
import Uglify from "../utils/UglifyString";

export type TContextProps = {
  inputValue: string;
  setInputValue: (value: string) => void;
  suggest: string[];
  setSuggest: (initial: string[] | ((value: string[]) => string[])) => void;
  searching: boolean;
  handleSearch: (value: string) => void;
  Uglify: (value: string) => string;
  result: TResult;
};

export type TResult = {
  locale: {
    id: number;
    name: string;
    state: string;
    latitude: number;
    longitude: number;
  };
  weather: TWeather[];
};

export type TWeather = {
  date: string;
  text: string;
  temperature: {
    min: number;
    max: number;
  };
  rain: {
    probability: number;
    precipitation: number;
  };
};

export const GlobalContext = createContext({});

export const GlobalStorage = ({ children }: any) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggest, setSuggest] = useState<string[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [result, setResult] = useState<any>({});

  const handleSearch = async (value: string) => {
    setSearching(true);
    const {
      weatherLocation: { locale, weather },
    } = await weatherFetch(Uglify(value));
    setResult({ locale, weather });
    setInputValue("");
  };

  useEffect(() => {
    setSearching(false);
    console.log(result);
  }, [result]);

  return (
    <GlobalContext.Provider
      value={{
        inputValue,
        setInputValue,
        suggest,
        setSuggest,
        searching,
        result,
        handleSearch,
        Uglify,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};