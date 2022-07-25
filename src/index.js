import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import {
  Routes,
  Route,
} from "react-router-dom";
import Draggable from 'react-draggable';

import ResourcePage from "./resource";
import RearrangeableList from "./components"
import './index.css'

class App extends React.Component {
  state = {
    activeDrags: 0,
    deltaPosition: {
      x: 0, y: 0
    },
    controlledPosition: {
      x: -400, y: 200
    }
  };

  handleDrag = (e, ui) => {
    const {x, y} = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  };

  onStart = () => {
    this.setState({activeDrags: ++this.state.activeDrags});
  };

  onStop = () => {
    this.setState({activeDrags: --this.state.activeDrags});
  };
  onDrop = (e) => {
    this.setState({activeDrags: --this.state.activeDrags});
    if (e.target.classList.contains("drop-target")) {
      alert("Dropped!");
      e.target.classList.remove('hovered');
      let target = e.target;
      console.log(target)
    }
  };
  onDropAreaMouseEnter = (e) => {
    if (this.state.activeDrags) {
      e.target.classList.add('hovered');
    }
  }
  onDropAreaMouseLeave = (e) => {
    e.target.classList.remove('hovered');
  }

  // For controlled component
  adjustXPos = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {x, y} = this.state.controlledPosition;
    this.setState({controlledPosition: {x: x - 10, y}});
  };

  adjustYPos = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {controlledPosition} = this.state;
    const {x, y} = controlledPosition;
    this.setState({controlledPosition: {x, y: y - 10}});
  };

  onControlledDrag = (e, position) => {
    const {x, y} = position;
    this.setState({controlledPosition: {x, y}});
  };

  onControlledDragStop = (e, position) => {
    this.onControlledDrag(e, position);
    this.onStop();
  };

  render() {
    const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
    const {deltaPosition, controlledPosition} = this.state;
    return (
    <div>
      <h1>React Draggable</h1>
      <p>Active DragHandlers: {this.state.activeDrags}</p>
      <p className={`topline`}>
        <a href='test'>Demo Source</a>
      </p>

      <RearrangeableList />

      {/* Linked Box */}
      <Draggable position={controlledPosition} {...dragHandlers} onDrag={this.onControlledDrag}>
        <div className="box">
          My position can be changed programmatically. <br />
          I have a drag handler to sync state.
          <div>
            <a href="#" onClick={this.adjustXPos}>Adjust x ({controlledPosition.x})</a>
          </div>
          <div>
            <a href="#" onClick={this.adjustYPos}>Adjust y ({controlledPosition.y})</a>
          </div>
        </div>
      </Draggable>
      <Draggable position={controlledPosition} {...dragHandlers} onStop={this.onControlledDragStop}>
        <div className="box">
          My position can be changed programmatically. <br />
          I have a dragStop handler to sync state.
          <div>
            <a href="#" onClick={this.adjustXPos}>Adjust x ({controlledPosition.x})</a>
          </div>
          <div>
            <a href="#" onClick={this.adjustYPos}>Adjust y ({controlledPosition.y})</a>
          </div>
        </div>
      </Draggable>

      {/* Locked Box */}
      <Draggable onStart={() => false}>
        <div className="box">I don't want to be dragged</div>
      </Draggable>

      {/* Self-aware Box */}
      <Draggable onDrag={this.handleDrag} {...dragHandlers}>
        <div className="box">
          <div>I track my deltas</div>
          <div>x: {deltaPosition.x.toFixed(0)}, y: {deltaPosition.y.toFixed(0)}</div>
        </div>
      </Draggable>

      <Draggable {...dragHandlers} onStop={this.onDrop}>
        <div className={`box ${this.state.activeDrags ? "no-pointer-events" : ""}`}>I can be dropped onto another box.</div>
      </Draggable>

      {/* Box w/ handle */}
      <Draggable handle="strong" {...dragHandlers}>
        <div className="box no-cursor">
          <strong className="cursor"><div>Drag here</div></strong>
          <div>You must click my handle to drag me</div>
        </div>
      </Draggable>

      {/* Restricted to axis */}
      <Draggable axis="y" {...dragHandlers}>
        <div className="box cursor-y">I can only be dragged vertically (y axis)</div>
      </Draggable>

      {/* Highlight drop-in box */}
      <Draggable {...dragHandlers}>
        <div className="box drop-target" onMouseEnter={this.onDropAreaMouseEnter} onMouseLeave={this.onDropAreaMouseLeave}>I can detect drops from the next box.</div>
      </Draggable>

    </div>
    );
  }
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>Home</Route>
      <Route path='/resource' element={<ResourcePage/>}>Home</Route>
    </Routes>
  </BrowserRouter>)