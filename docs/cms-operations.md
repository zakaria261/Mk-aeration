# Exploitation de l’espace équipe

Le CMS fonctionne avec Next.js sur Vercel, Lakebase Postgres, Managed Better Auth et Object Storage sur Neon, dans la région AWS Francfort. Les neuf réalisations historiques restent dans `lib/content.ts`. Les nouveaux contenus sont lus en base ; aucune modification du dépôt ni reconstruction du site n’est nécessaire pour les publier.

Projet Neon : `sweet-dust-35078066` (`mk-aeration`). Production : branche `main`, `br-muddy-moon-b9j6dnyo`. Développement isolé : `cms-development`, `br-dawn-glade-b9xwoysa`. Le stockage privé s’appelle `chantier-medias` sur chaque branche. Les demandes de devis conservent leur backend D1 existant.

## Configuration serveur

Variables Vercel de production : `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`. Aucune n’utilise `NEXT_PUBLIC_`. Les secrets restent dans les environnements de l’hébergeur ; les fichiers `.env*`, `.neon` et `.vercel` sont ignorés par Git.

Pour reproduire la configuration après connexion des CLI :

```sh
neon env pull --branch main --service postgres --service auth --service object-storage --file .env.cms-production
# Ajouter un NEON_AUTH_COOKIE_SECRET aléatoire de 32 caractères minimum, sans le committer.
node --env-file=.env.cms-production scripts/cms-migrate.mjs
node --env-file=.env.cms-production scripts/cms-configure-vercel.mjs
```

Le script de migration utilise la connexion directe et la migration SQL suivie dans `db/cms/001_content.sql`. Tester toute modification de schéma sur la branche de développement avant son application en production. Le script Vercel utilise la session CLI déjà connectée et transmet les valeurs dans le corps HTTPS de l’API officielle. Il ne les imprime pas et ne les place pas dans les arguments de commande.

Le domaine de production doit être autorisé dans Neon Auth. Les règles CORS du bucket permettent les transferts depuis ce même domaine. Ajouter explicitement tout futur domaine officiel à ces deux configurations. La branche de développement autorise les aperçus locaux sur le port 3032.

## Accès et médias

La connexion utilise un code par e-mail, vérifié par Managed Better Auth. L’application limite l’accès à `cms_members`, exige un e-mail vérifié et vérifie le rôle et l’état du membre à chaque opération. Les modifications exigent une origine identique au site. Les endpoints d’authentification non utilisés par l’application sont fermés dans son proxy. L’identité n’est jamais déduite d’un simple en-tête client.

Les photos sont transférées directement vers une clé temporaire privée avec une autorisation de dix minutes. La finalisation vérifie le poids, décode l’image, retire les métadonnées et produit les variantes WebP. Une clé définitive distincte empêche l’autorisation temporaire de remplacer une photo finalisée. Les fichiers d’une fiche non publiée nécessitent une session du propriétaire ou d’un administrateur. Les photos déjà publiques ont un cache d’une minute ; les brouillons ne sont pas mis en cache publiquement. Les fichiers temporaires d’un import abandonné peuvent être nettoyés après expiration de leur autorisation ; aucune règle de cycle de vie automatique n’est supposée active.

`cms_posts.draft` et `cms_posts.published` séparent le travail en cours de la version publique. Une version numérique protège contre les modifications concurrentes. Les actions de publication et de gestion des personnes sont journalisées dans `cms_events`. L’archivage reste réversible. Les pages et leur sitemap sont invalidés après publication ou retrait.

## Vérification

```sh
node --experimental-strip-types --test tests/*.test.mjs
npm run build:vercel
npm run start:next -- --port 3032
node --env-file=.env.local tests/cms-integration.mjs
```

Le test d’intégration refuse la production et toute URL extérieure à la machine locale. Il utilise des adresses fictives sur la branche de développement, prépare ses propres codes de test sans envoyer d’e-mail et nettoie les publications et photos créées. Il vérifie la connexion, la session, les rôles, la propriété des contenus, l’import, la confidentialité, la publication, les actualités, la conservation de la version publique, les conflits, le retrait, les archives, la révocation et la déconnexion.

La délivrabilité réelle du code dans la messagerie de l’administrateur se vérifie lors de sa première connexion. Le service SMTP partagé Neon est utilisé pour les codes ; un expéditeur SMTP de marque peut être configuré dans Neon sans modifier l’application.
