import React from "react";
import { Breadcrumb } from "@blueprintjs/core";
import { Breadcrumbs2 } from "@blueprintjs/popover2";

const BREADCRUMBS = [
  // root URL should change depending on mode (ie: overview, editor)
  { href: "/editor", icon: "folder-close", text: "Project Title" },
  { href: "/editor/feature1", icon: "folder-close", text: "feature1" },
  { icon: "document", text: "sub_feature3" },
];

export class FeatureBreadcrumbs extends React.PureComponent {
  render() {
    return (
      <Breadcrumbs2
        className={`feature-breadcrumbs`}
        minVisibleItems={2}
        currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
        items={BREADCRUMBS}
      />
    );
  }

  renderCurrentBreadcrumb = ({ text, ...restProps }) => {
    // customize rendering of last breadcrumb
    return <Breadcrumb {...restProps}>{text}</Breadcrumb>;
  };
}