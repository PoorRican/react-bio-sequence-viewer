# Bugs

## Overview Mode
- `.selection` doesn't handle `overflow-y: scroll` correctly
- Remove width on last feature spacer in `#mainItems`
- Prevent `link` option showing on context menu when only one feature is selected
- Drag background (`feature-group`) along with features during `move`
- Cursor class is not being set

## Editor Mode:
  - Select by dragging does not work in reverse
  - when starting drag outside of `SequenceText`, `Monomer.handleDrag` is called


# Program Features
_Top-level program features and planned functionality_

## Feature Overview

### Functionality
- Construct gene using drag and drop
- Dual-strand features:
  - When deleting a feature, resolve hanging strands via editor
- Option to visualize GC-content
- Show/highlight features based on regions and complexes
- Ability to zoom-in and navigate regions and complexes
    - Show breadcrumbs
- Context Menu
    - Implement replace functionality via context menu and side menu
    - Show different content for content menu in selection panel during `insert` mode
    - Expand/Minimize individual features
- Scrollbar that displays features and regions
- Zoom depth to show or hide low or high feature levels
- Regions without features should be shown:
  - When inserting feature, show `editor` mode
    - Emphasize region by greying-out
    - Approximate insert location by `MouseEvent` location

### Improvements
_Improvements to existing features/functionality_

- Rename "Link/Unlink" to "Create Feature". Show dialog.
- Stylize feature dialog
- Improve navbar styling
- Scroll vertically to scroll horizontally
- Dynamically render features based on window position
- Change size of `FeatureCard` based on sequence length (via `grid-column`)
- Show index number grid (ie: 1, 500, etc)

#### `SelectMode`
- Indicate that `selecting` has begun:
  - Change cursor icon
  - Highlight `FeatureItem` components based on mouse hover
  - Text/icon indication


## Sequence Editor

### Functionality
- Option to highlight:
  - codons and coding regions
  - activator/inhibitor sites
  - restriction enzyme sites
  - introns/exons
  - nucleotide modifications as subscript (eg: methylation, etc)
- Show/highlight features based on regions and complexes:
  - Show number to notate several levels of features
- Footer:
  - show feature type (eg: gDNA, mRNA, mmRNA, protein)
  - cursor location:
    - in respect to local feature
    - in respect to global sequence
    - number of selected `Monomers`
- `FeatureBar`:
  - Option to view feature metadata from context menu
  - "Create feature" from `ContextMenu` if selected range is not a feature
- Edit Sequence:
  - Allow editing of downloaded sequence:
    - Highlight modified indices
    - Allow saving of modified feature as new feature
- Improve readability:
  - Separate into paragraphs of 100bp or so
  - Use screen size to determine number of columns
  - Controllable parameter for number of rows/columns
  - Identify segment as a coding region:
    - Highlight coding region (using `context.highlighted`) when editing
      - Remember previous column/row setting
    - Emphasize codons using vertical gaps for using nucleotide sequence
    - Show codons as letters of amino acids *or* mnemonic words (user parameter)
- Vim-style cursor functionality
  - Motion keys
  - Select mode:
    - Select line/box/cursor mode
  - Insert/Replace/Copy & Paste/Cut/Delete & Insert functions:
    - i.e: `\<i\>`, `\<r\>`, `\<y\>`, `\<p\>`, `\<x\>`, `<\s\>`
  - Goto line

### Improvements
- Highlighting of features should occur after render
- Speed up `flattenHierarchy` by not iterating through top-level features


# Low-level Implementation
- Indicate nested `Feature` by using `::` notation in `id` attributes

# Meta
_Program structure and organization_

- Move `ModeMenu` components to a top-level directory `components`