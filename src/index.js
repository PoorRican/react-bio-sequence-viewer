import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";


// Feature View
import FeaturesProvider from "./feature/data"
import FeatureContainer from './feature/featureContainer'

// Sequence View
import {SequenceProvider} from "./editor/data"
import EditorContainer from "./editor/editorContainer"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={
        <FeaturesProvider>
          <FeatureContainer />
        </FeaturesProvider>
      }>Home</Route>
      <Route path={'/editor'} element={
        <SequenceProvider>
          <EditorContainer />
        </SequenceProvider>
      }>Sequence</Route>
    </Routes>
  </BrowserRouter>)