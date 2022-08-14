# Bugs
- `.selection` doesn't handle `overflow-y: scroll` correctly
- Remove width on last feature spacer in `#mainItems`
- Prevent `link` option showing on context menu when only one feature is selected
- Moving linked items is buggy:
    - shifting of `linked` is not correct
    - If there are multiple linked lists, all linked features are dragged
    - Drag background (`feature-group`) along with features
    - 
# Program Features
## Feature View
### Improvements
- Stylize feature dialog
- Show/hilight features based on regions and complexes
    - Ability to edit/modify regions
- Ability to zoom-in and navigate regions and complexes
    - Show breadcrumbs
- Show scrollbar that displays features and regions
- Implement composition for `FeatureView` modes
- Context Menu
    - Implement replace functionality via context menu and side menu
    - Show different content for content menu in selection panel during `insert` mode
- Improve navbar styling
- Scroll vertically to scroll horizontally

## Sequence View
### Purpose / Functionality
- Display sequence
    - Highlight selected feature/subfeature/region
      by graying-out unseleceted sequence
    - Option to hilight:
        - codons and coding regions
        - activator/inhibitor sites
        - restriction enzyme sites
        - introns/exons
        - nucleotide modifications (eg: methylation, etc)
- Show/hilight features based on regions and complexes
