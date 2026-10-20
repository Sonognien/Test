# Europoker

Application React déployée sur Cloudflare Pages avec Supabase pour la base de données et l'authentification.

## Stack
- React 18
- Vite
- JavaScript / JSX
- Tailwind CSS
- Supabase
- Cloudflare Pages
- Cloudflare R2 sera ajouté ultérieurement

Aucun Next.js, Vercel, Clerk, Neon, Drizzle ou Vercel Blob n'est utilisé sur la branche `staging`.

## Développement
```bash
npm install
npm run dev
```

Copier `.env.example` vers `.env.local` et renseigner uniquement les variables publiques Supabase.
