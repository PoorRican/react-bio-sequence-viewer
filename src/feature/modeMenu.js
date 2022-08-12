import {Button, Navbar} from "@blueprintjs/core";
import React from "react";

export function ModeMenu(props) {
  return (
    <Navbar style={{
      position: 'fixed',
      zIndex: 11
    }}>
      <Navbar.Group>

        <Navbar.Heading style={{
          minWidth: '75px',
          display: 'block',
        }}>
          {props.heading}
        </Navbar.Heading>

        <Navbar.Divider/>

        {props.buttons.map((i) =>
          <Button key={i.mode} large={true} minimal={true} fill={true}
                  icon={i.icon} text={i.text}
                  active={props.mode === i.mode}
                  onClick={i.action}
          />
        )}

      </Navbar.Group>
    </Navbar>
  )
}

