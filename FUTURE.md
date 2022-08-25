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
    - Rename "Link/Unlink" to "Create Feature". Show dialog.
    - Expand/Minimize individual features
- Scrollbar that displays features and regions
- Zoom depth to show or hide low or high feature levels

### Improvements
- Stylize feature dialog
- Improve navbar styling
- Scroll vertically to scroll horizontally
- Dynamically render features based on window position
- Change size of `FeatureCard` based on sequence length (via `grid-column`)
- Show index number grid (ie: 1, 500, etc)

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
    - Highlight row onMouseEnter
    - Option to highlight:
        - codons and coding regions
        - activator/inhibitor sites
        - restriction enzyme sites
        - introns/exons
        - nucleotide modifications (eg: methylation, etc)
- Show/highlight features based on regions and complexes:
  - Show number to notate several levels of features
- Show index numbers:
  - Line numbers
  - Intervals of 10/100
- `FeatureRowBar`:
  - Option to view feature metadata from context menu
- "Create feature" from `ContextMenu`
- Edit Sequence:
  - Allow editing of downloaded sequence:
    - Highlight modified indices
    - Allow saving of modified feature as new feature
- Improve readability:
  - Separate into paragraphs of 100bp or so
  - Use screensize to determine number of columns
  - Controllable parameter for number of rows/columns
  - Identify segment as a coding region:
    - Highlight coding region (using `context.highlighted`) when editing
      - Remember previous column/row setting
    - Emphasize codons using vertical gaps for using nucleotide sequence
    - Show codons as letters of amino acids *or* mnemonic words (user parameter)
- Vim-style cursor functionality
  - Navigate by `\<hjkl\>`
  - Select mode:
    - Select line/box/cursor mode
  - Insert/Replace/Copy & Paste/Cut/Delete & Insert functions:
    - i.e: `\<i\>`, `\<r\>`, `\<y\>`, `\<p\>`, `\<x\>`, `<\s\>`


# Low-level Implementation
- Indicate nested `Feature` by using `::` notation in `id` attributes

# Meta
_Program structure and organization_

- Rename `feature` directory to `overview`
- Move `ModeMenu` components to a top-level directory `components`