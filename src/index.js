import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";

import './index.css'

// Feature View
import FeaturesProvider from "./overview/data"
import OverviewContainer from './overview/overviewContainer'

// Sequence View
import {EditorProvider} from "./editor/data"
import EditorContainer from "./editor/editorContainer"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={
        <FeaturesProvider>
          <OverviewContainer />
        </FeaturesProvider>
      }>Home</Route>
      <Route path={'/editor'} element={
        <EditorProvider>
          <EditorContainer />
        </EditorProvider>
      }>Sequence</Route>
    </Routes>
  </BrowserRouter>)