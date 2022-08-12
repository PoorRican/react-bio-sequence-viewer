import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";


import Provider from "./feature/data"
import Container from './feature/container'
import ViewMode from "./feature/viewMode";
import InsertMode from "./feature/insertMode";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={
        <Provider>
          <Container>
            <ViewMode />
            <InsertMode />
          </Container>
        </Provider>
      }>Home</Route>
    </Routes>
  </BrowserRouter>)