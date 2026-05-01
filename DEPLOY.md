# Mise en ligne sur Vercel

## Methode recommandee avec GitHub

1. Creez un nouveau repository GitHub et poussez ce dossier.
2. Dans Vercel, cliquez sur **Add New > Project**.
3. Importez le repository.
4. Framework preset: **Next.js**.
5. Ajoutez les variables d'environnement depuis `.env.example`.
6. Deployer.

Vercel active HTTPS automatiquement sur l'URL `vercel.app`. Pour un domaine personnalise, ajoutez le domaine dans **Project Settings > Domains** et suivez les enregistrements DNS indiques.

## Integrations Vercel a ajouter

- Clerk: authentification et comptes membres.
- Neon: base Postgres.
- Vercel Blob: stockage images/videos/documents.
- Resend: emails et newsletter.
- Stripe: abonnements formations.

## Variables minimales pour un premier deploiement

Pour afficher les pages publiques sans activer tous les services:

```env
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
CRON_SECRET=un-secret-long
```

Pour activer les fonctions completes, ajoutez ensuite:

```env
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
RESEND_API_KEY=
EMAIL_FROM=
CONTACT_TO=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_MEMBER_PRICE_ID=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
```

## Methode CLI

Si `npm` et `vercel` sont disponibles sur votre machine:

```bash
npm install
npm run build
vercel login
vercel deploy --prod
```

Apres la creation du projet, synchronisez les variables:

```bash
vercel env pull .env.local
npm run db:push
```
