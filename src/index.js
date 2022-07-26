import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import {
  Routes,
  Route,
} from "react-router-dom";

import ResourcePage from "./resource";
import RearrangeableList from "./rearrangeableList"
import './index.css'

function App(props) {
  const items = [1,2,3,4,5,6,7,8,9];
  return (
  <div>
    <h1>React Draggable</h1>
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