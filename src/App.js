import logo from './logo.svg';
import './App.css';
import Home from "./home";
import Login from './pages/Login';
import Register from './pages/Register';
import axios from "axios"
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom"

import { createContext, useState } from 'react';

let apiUrl = "http://localhost:8000"
export const axiosContext = createContext({ apiUrl, axios })


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='salut' element={<Home />} >
        <Route path='a' element={<div>une url a dans home</div>} />
      </Route>
    </>
  )
)

function App() {


  return (
    <div className="App">
      <axiosContext.Provider value={{ apiUrl, axios }}>
        <RouterProvider router={router} />
      </axiosContext.Provider>
    </div>
  );
}

export default App;
