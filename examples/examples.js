// Single source of truth for the examples site.
// The sidebar, the overview page and every page header are built from this file.
//
// To add an example:
//   1. Copy _template.html to a new file in this folder
//   2. Add one entry to a group below, or add a new group

export const repoSourceBase =
  "https://github.com/scybud/scybud-ui/blob/main/examples/";

export const home = {
  file: "index.html",
  title: "Examples",
  description:
    "Small focused pages that each show one part of Scybud UI. Open the source and copy what you need.",
};

export const groups = [
  {
    id: "foundations",
    title: "Foundations",
    examples: [
      {
        file: "typography.html",
        title: "Typography",
        description: "Headings, body text, links and the text utility classes.",
      },
    ],
  },
  {
    id: "layout",
    title: "Layout",
    examples: [
      {
        file: "dashboard.html",
        title: "Sidebar layout",
        description:
          "A fixed sidebar on desktop that becomes a drawer below 800px.",
      },
    ],
  },
  {
    id: "components",
    title: "Components",
    examples: [
      {
        file: "buttons.html",
        title: "Buttons",
        description:
          "Primary, secondary, no background and pill variants, plus the loading state.",
      },
      {
        file: "empty-state.html",
        title: "Empty states",
        description:
          "Placeholder blocks for empty lists and feeds, with or without an action.",
      },
      {
        file: "lightbox.html",
        title: "Lightbox",
        description: "Add one class to an image to magnify it into an overlay.",
      },
    ],
  },
];
