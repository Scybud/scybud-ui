# Scybud UI examples

Each page shows one part of the library. The sidebar, the overview cards and
every page header are generated from `examples.js`.

## Add an example

1. Copy `_template.html` to a new file in this folder, for example `modal.html`.
2. Add one entry to a group in `examples.js`. Add a new group if none fits.
3. Fill in the page. Keep the shell stylesheets, and add only the component
   styles the example demonstrates.

If you forget step 2, the page shows a warning banner and logs it to the
console.

## Files

1. `examples.js` is the manifest: groups, titles and descriptions.
2. `shared-layout.js` builds the sidebar, page header and mobile drawer.
3. `examples.css` holds the styles shared by all example pages.
4. `_template.html` is the starting point for a new example.
5. `index.html` is the overview page, generated from the manifest.

## Notes

1. Add `?embed` to any example URL to render it without the sidebar and
   header, for iframes in the docs.
2. File names are kept flat so existing links to these pages keep working.