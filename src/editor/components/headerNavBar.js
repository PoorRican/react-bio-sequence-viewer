import React from 'react'
import PropTypes from "prop-types";
import {
  Navbar, NavbarGroup,
  Button, Alignment, Tag,
  Text,
} from "@blueprintjs/core";

import {FeatureBreadcrumbs} from "../../components/featureBreadcrumbs";
import {EditorContext} from "../data";

import './headerNavBar.css'


/**
 * Shows info about cursor location, whether it points to a `Feature`, a range, or an index
 *
 * @param props
 *
 * @constructor
 * @returns {JSX.Element}
 */
function CursorTag(props) {
  return (
    <>
      <Tag round={true} large={true} minimal={true} className={`cursor-position`}>

        {(props.id ?
          <>
            <Text ellipsize={true}
                  tagName={'span'}>
              {props.id}
            </Text>

            &nbsp;
          </> : null
        )}

        <span>
          {typeof(props.location) === 'number' ?
            <>Index:&nbsp;{props.location}</> :
            <>({props.location[0]},&nbsp;{props.location[1]})</>
          }

        </span>

      </Tag>
    </>
  )
}
CursorTag.propTypes = {
  id: PropTypes.string,
  location: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.number])
}


export default class HeaderNavBar extends React.PureComponent {
  static contextType = EditorContext;

  /**
   * Shows current editor mode and provides the ability to change modes.
   * @returns {JSX.Element}
   */
  mode() {
    // TODO: show menu to change mode
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

  /**
   * Display range of cursor selection and `feature.id` if cursor selection is `Feature`
   * @returns {JSX.Element}
   */
  cursor_info() {
    if (this.context.cursor) {
      if (this.context.cursor.hasOwnProperty('id')) {     // is instance of `Feature`
        return <CursorTag id={this.context.cursor.id} location={this.context.cursor.location} />
      } else {
        return <CursorTag location={this.context.cursor} />
      }
    }
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

          {this.cursor_info()}

          {this.details()}

        </NavbarGroup>

      </Navbar>
      )
  }
}