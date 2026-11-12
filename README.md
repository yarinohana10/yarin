# Eli & Lian — Wedding RSVP Site

Digital invitation and RSVP for the wedding, with an admin panel for guest management.

## Local development

```sh
npm install
npm run dev
```

Open [http://localhost:8081](http://localhost:8081).

## Production build

```sh
npm run build
npm run preview
```

For static hosting (e.g. Netlify): build command `npm run build`, publish directory `dist`.

## Stack

- Vite, React, TypeScript, Tailwind CSS, shadcn/ui
- Supabase (guests and event details)
