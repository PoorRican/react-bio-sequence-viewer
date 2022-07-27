import {H1} from "@blueprintjs/core";
import RearrangeableList from "./rearrangeableList";
import React from "react";

export function App(props) {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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