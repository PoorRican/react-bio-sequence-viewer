import {
  H1, H4, H6,
  Checkbox,
  Dialog
} from '@blueprintjs/core'
import React from 'react'

function FeatureContent(props) {
  const data = props.data;
  return(
    <div>

      {/* title/id */}
      <H1>{data.title}</H1>
      <H4>{data.id}</H4>

      <section id={`dataSection`}>
        <H6>Data</H6>
        {data.data}
      </section>

      {/* TODO: implement tooltip with explanation */}
      <Checkbox checked={data.except} label={`Exceptional`} />

      <section id={`productSection`}>
        <H6>Product</H6>
        {data.product}
      </section>

      <section id={`locationSection`}>
        <H6>Location</H6>
        {data.location}
      </section>

      <section id={`qualSection`}>
        <H6>Qualifiers</H6>
        {data.location}
      </section>
    </div>

  )
}

export function FeatureDialog(props) {
  return (
    <Dialog isOpen={props.isOpen}
            onClose={props.onClose}
            lazy={true}
    >
      <FeatureContent data={props.data} />
    </Dialog>
  )
}