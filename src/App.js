import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import axios from "axios"
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom"

import { createContext, useState } from 'react';
import Home from './pages/Home';
import Client from './components/home/Client';
import Employe from './components/home/Employe';
import Errorpage from './pages/Errorpage';
import Utilisateur from './components/home/Utilisateur';

let apiUrl = "http://localhost:8000"
export const axiosContext = createContext({ apiUrl, axios })


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path="/home" element={<Home />} >
        <Route path='client' element={<Utilisateur type="clients" />} />
        <Route path='employe' element={<Utilisateur type='employe' />} />
      </Route>
      <Route path='*' element={<Errorpage />} />
    </>
  )
)

function App() {


  return (
    <div className="App">
      <div className='my_alert alert d-none' > </div>
      <axiosContext.Provider value={{ apiUrl, axios }}>
        <RouterProvider router={router} />
      </axiosContext.Provider>
    </div>
  );
}

export default App;
