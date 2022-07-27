import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import ResourcePage from "./resource";

import './index.css'
import {App} from "./app";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>Home</Route>
      <Route path='/resource' element={<ResourcePage/>}>Home</Route>
    </Routes>
  </BrowserRouter>)