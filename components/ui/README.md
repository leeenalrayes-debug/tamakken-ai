# components/ui

This directory is reserved for [shadcn/ui](https://ui.shadcn.com) primitives
(e.g. `button.tsx`, `input.tsx`, `accordion.tsx`, `select.tsx`, `toast.tsx`,
`card.tsx`, `dialog.tsx`).

These are generated on demand via the shadcn CLI once UI implementation
begins, for example:

```bash
npx shadcn@latest add button input label select accordion card dialog toast separator
```

They are intentionally not pre-generated in the foundation step, since
`components.json` already points here (`"ui": "@/components/ui"`) and the
CLI will populate this folder correctly when needed.
