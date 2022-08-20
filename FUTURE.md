# Bugs
- `.selection` doesn't handle `overflow-y: scroll` correctly
- Remove width on last feature spacer in `#mainItems`
- Prevent `link` option showing on context menu when only one feature is selected
- Drag background (`feature-group`) along with features during `move`
- Cursor class is not being set


# Program Features
_Top-level program features and planned functionality_

## Feature Overview

### Functionality
- Show/highlight features based on regions and complexes
    - Ability to edit/modify regions
- Ability to zoom-in and navigate regions and complexes
    - Show breadcrumbs
- Context Menu
    - Implement replace functionality via context menu and side menu
    - Show different content for content menu in selection panel during `insert` mode
- Scrollbar that displays features and regions

### Improvements
- Stylize feature dialog
- Improve navbar styling
- Scroll vertically to scroll horizontally
- Calculate selected and linked elements by using context instead of using props passed to `RearrangeableList`
- Dynamically render features based on window position

#### `SelectMode`
- Indicate that `selecting` has begun:
  - Change cursor icon
  - Stylize `FeatureItem` components based on mouse position
  - Text/icon indication


## Sequence View

### Functionality
- Display sequence
    - Highlight selected feature/sub-feature/region
      by graying-out unselected sequence
    - Option to highlight:
        - codons and coding regions
        - activator/inhibitor sites
        - restriction enzyme sites
        - introns/exons
        - nucleotide modifications (eg: methylation, etc)
- Show/highlight features based on regions and complexes


# Meta
_Program structure and organization_

- Rename `feature` directory to `overview`
- Move `ModeMenu` components to a top-level directory `components`
