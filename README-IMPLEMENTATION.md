# Europoker — staging

Branche de staging : `Sonognien/Test#staging`.

## Backend
- Supabase project: `plateforme-scientifique-staging` (`eflpdvbsndohopnwssge`)
- RLS activé sur les tables publiques
- Edge Function `guest-24h-check`
- Recherche plein texte française
- 10 thématiques initiales
- Article de démonstration publié

## Frontend
- React 18 + Vite + TypeScript + Tailwind
- Auth email / Google / Microsoft
- Articles, recherche, commentaires, espace admin
- Mode clair/sombre
- Limite invitée vérifiée côté serveur

## Infrastructure
- Cloudflare Pages staging créé
- Cloudflare R2 reste bloqué tant que R2 n'est pas activé une première fois dans le Dashboard Cloudflare (erreur API 10042).
