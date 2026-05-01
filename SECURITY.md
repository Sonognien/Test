# Securite

## Modele d'acces

- Les routes `/admin` et `/api/upload` exigent un utilisateur Clerk avec `publicMetadata.role = "admin"`.
- Les routes `/membre/*` exigent une session Clerk.
- Les formations privees exigent `publicMetadata.subscriptionStatus = "active"` ou `publicMetadata.role = "admin"`.
- Les sujets forum exigent une session utilisateur et passent par moderation.

## Protection applicative

- HTTPS force en production via middleware quand `x-forwarded-proto = http`.
- HSTS active: `max-age=63072000; includeSubDomains; preload`.
- Headers HTTP durcis dans `next.config.ts`: CSP, frame deny, nosniff, referrer policy, permissions policy.
- Validation et nettoyage des entrees dans `src/lib/security.ts`.
- Rate limit en memoire sur les endpoints publics et sensibles.
- Controle `Origin` sur les POST sensibles.
- Upload limite aux admins, types autorises et taille maximale 50 Mo.
- Cron protege par `CRON_SECRET` compare en temps constant.
- Webhook Stripe verifie avec `STRIPE_WEBHOOK_SECRET`.

## Base de donnees

- Roles utilisateurs types.
- Index sur slugs, statuts, categories, abonnements, emails et logs.
- Suppression logique sur contenus et medias.
- Tables `audit_logs` et `security_events` pour tracer les actions admin et signaux suspects.

## Vercel Firewall recommande

Activez dans le dashboard Vercel:

- Managed Ruleset OWASP.
- Bot Protection.
- Rate limiting sur:
  - `/api/contact`
  - `/api/newsletter`
  - `/api/forum/topics`
  - `/api/checkout`
  - `/api/upload`
- Challenge ou deny sur les scanners classiques: `/wp-admin`, `/wp-login.php`, `/.env`, `/phpmyadmin`.

## HTTPS et domaine

- Vercel fournit HTTPS automatiquement sur `*.vercel.app`.
- Pour un domaine personnalise, ajoutez le domaine dans Vercel puis configurez les DNS demandes.
- Quand le certificat est actif, gardez HSTS active. N'activez le preload navigateur global qu'apres verification que tous les sous-domaines supportent HTTPS.
- Verifiez `/api/health` apres deploiement: il doit repondre `ok: true`.

## A faire avant production

- Configurer les roles Clerk depuis le dashboard ou un script admin.
- Verifier en mode test Stripe que les metadata Clerk `subscriptionStatus` passent bien a `active` puis `inactive`.
- Appliquer `npm run db:push` apres configuration `DATABASE_URL`.
- Activer les logs Vercel et alertes sur erreurs 401/403/429/500.
