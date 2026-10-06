# Accounts Tree

Interactive hierarchical accounts tree built with **Next.js** and **MUI** (JavaScript).

## Features

- Expand / collapse any node
- Right-click context menu on every node:
  - **Cut**: only for nodes without children
  - **Copy**: copies the node with all its children
  - **Paste**: adds the cut/copied node as a child of the selected node
  - **Delete**: only for nodes without children
  - **Add child**: opens a modal that takes a label
- RTL (Persian) layout with Vazirmatn font
- Responsive: smaller sizes on mobile, plus a ⋮ button instead of right-click

## Tech Stack

- Next.js (App Router)
- MUI + Emotion
- stylis-plugin-rtl

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
  app/
    layout.js      # font and RTL setup
    providers.js   # MUI theme + RTL cache
    page.js        # main logic (state, menu, modal)
  components/
    TreeNode.js    # recursive node component
  lib/
    tree.js        # initial data and immutable helpers
```

## Notes

- The tree is stored as nested objects: `{ id, label, children, open }`.
- All updates are immutable (`update`, `remove`, `cloneNode` in `lib/tree.js`).