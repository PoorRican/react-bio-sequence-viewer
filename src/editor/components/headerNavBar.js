import React from 'react'
import {
  Navbar, NavbarGroup,
  Button, Alignment, Tag,
} from "@blueprintjs/core";

import {FeatureBreadcrumbs} from "../../components/featureBreadcrumbs";
import {SequenceContext} from "../data";

import './headerNavBar.css'


export default class HeaderNavBar extends React.PureComponent {
  static contextType = SequenceContext;

  /**
   * Shows current editor mode and provides the ability to change modes.
   * @returns {JSX.Element}
   */
  mode() {
    // TODO: should show menu to change mode
    return (
      <>
        Mode:&nbsp;
        <Button outlined={true}>
          {this.context.mode.replace(/^\w/,
            function(c) {return c.toUpperCase();
            })}
        </Button>
      </>
    )
  }

  /**
   * Display depth and hierarchy of editor content and provides return URLs to higher-level features
   * @returns {JSX.Element}
   */
  breadcrumbs() {
    return (
      <FeatureBreadcrumbs />
    )
  }

  /**
   * Displays direction of current sequence and provides capability to reverse direction
   * @returns {JSX.Element}
   */
  direction() {
    // TODO: click to reverse direction
    return (
      <Button
        className={`sequence-direction`}
        minimal={true}
        disabled={true}>

        5' &rarr; 3'

      </Button>
    )
  }

  current_info() {
    return (
      <>
        {(this.context.cursor) ?
          <Tag round={true} large={true} minimal={true} className={`cursor-position`}>
            <span>{this.context.cursor.id}</span>
            &nbsp;
            <span>({this.context.cursor.location[0]},&nbsp;{this.context.cursor.location[1]})</span>
          </Tag> : null
        }
        }
      </>
    )
  }

  /**
   * Displays cursor position size of editor content
   * @returns {JSX.Element}
   */
  details() {
    return (
      <>

        {this.direction()}

        <span className={`sequence-length`}>
          {this.context.sequence.length} bp
        </span>

      </>
    )
  }

  render() {
    return (
      <Navbar className={`editor-header`} fixedToTop={true}>

        <NavbarGroup align={Alignment.LEFT}>

          {this.mode()}

          {this.breadcrumbs()}

        </NavbarGroup>

        <NavbarGroup align={Alignment.RIGHT}
                     className={`editor-details`} >

          {this.current_info()}

          {this.details()}

        </NavbarGroup>

      </Navbar>
      )
  }
}