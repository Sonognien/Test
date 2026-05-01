# Blog Tech Vercel Complet

Application Next.js pour un blog francophone sur l'electronique, l'informatique et l'electricite avec forum, newsletter, formations privees et abonnements.

## Structure importante

- `app/`: routes Next.js App Router detectees directement par Vercel.
- `src/components`: composants React reutilisables.
- `src/lib`: integrations, securite, contenu et schema de base de donnees.

## Demarrage

```bash
npm install
npm run dev
```

Copiez `.env.example` vers `.env.local`, puis ajoutez les variables fournies par Vercel Marketplace: Clerk, Neon, Vercel Blob, Resend et Stripe.

## Fonctionnalites incluses

- Blog public avec categories, tags, articles riches, images et videos.
- Forum complet: categories, sujets, reponses, moderation et signalements prevus dans le schema.
- Admin integre pour gerer contenu, medias, forum, newsletter et services.
- Espace membre avec formations privees et abonnement Stripe.
- Newsletter hebdomadaire automatique via Vercel Cron et Resend.
- Routes API pour contact, newsletter, forum, upload Blob, checkout Stripe et webhook Stripe.

## Verification

```bash
npm run build
```

## Mise en ligne

Voir [DEPLOY.md](./DEPLOY.md) pour la procedure Vercel pas a pas.

## Provisioning Vercel recommande

1. Creer le projet sur Vercel puis lier le repo.
2. Ajouter les integrations Marketplace:
   - Clerk pour l'authentification.
   - Neon pour Postgres.
   - Vercel Blob pour les medias.
   - Resend pour les emails.
   - Stripe pour les abonnements.
3. Pull des variables localement avec `vercel env pull .env.local`.
4. Pousser le schema avec `npm run db:push`.
5. Configurer `CRON_SECRET` et verifier que `vercel.json` pointe vers `/api/cron/weekly-digest`.

## Statut de cette implementation

Le projet contient les pages, le design, les schemas et les endpoints d'integration. Les donnees publiques utilisent des exemples locaux pour que l'interface existe tout de suite; les routes API ecrivent dans Neon des que `DATABASE_URL` est configure. Les webhooks Stripe sont prets a recevoir les evenements, avec le point de raccordement indique pour synchroniser finement les abonnements avec les utilisateurs Clerk.
