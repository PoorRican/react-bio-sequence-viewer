import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import {
  Routes,
  Route,
} from "react-router-dom";

import { H1 } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import ResourcePage from "./resource";
import RearrangeableList from "./rearrangeableList"

import './index.css'

function App(props) {
  const items = [1,2,3,4,5,6,7,8,9];
  return (
  <div>
    <H1>React Draggable</H1>
    <p className={`topline`}>
      <a href='test'>Demo Source</a>
    </p>

    <RearrangeableList items={items}/>

  </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>Home</Route>
      <Route path='/resource' element={<ResourcePage/>}>Home</Route>
    </Routes>
  </BrowserRouter>)