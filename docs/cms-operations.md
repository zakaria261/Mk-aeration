# Exploitation de l’espace équipe

Le CMS fonctionne avec Next.js sur Vercel, Lakebase Postgres, Managed Better Auth et Object Storage sur Neon, dans la région AWS Francfort. Les neuf réalisations historiques restent dans `lib/content.ts`. Les nouveaux contenus sont lus en base ; aucune modification du dépôt ni reconstruction du site n’est nécessaire pour les publier.

Projet Neon : `sweet-dust-35078066` (`mk-aeration`). Production : branche `main`, `br-muddy-moon-b9j6dnyo`. Développement isolé : `cms-development`, `br-dawn-glade-b9xwoysa`. Le stockage privé s’appelle `chantier-medias` sur chaque branche. Les demandes de devis conservent D1 lorsque configuré ; sinon elles rejoignent les contacts courts dans `cms_contacts` sur Neon. Les réglages du site et leur historique utilisent `cms_site_settings` et `cms_site_history`.

## Configuration serveur

Variables Vercel de production : `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`. Aucune n’utilise `NEXT_PUBLIC_`. Les secrets restent dans les environnements de l’hébergeur ; les fichiers `.env*`, `.neon` et `.vercel` sont ignorés par Git.

Pour reproduire la configuration après connexion des CLI :

```sh
neon env pull --branch main --service postgres --service auth --service object-storage --file .env.cms-production
# Ajouter un NEON_AUTH_COOKIE_SECRET aléatoire de 32 caractères minimum, sans le committer.
node --env-file=.env.cms-production scripts/cms-migrate.mjs
node --env-file=.env.cms-production scripts/cms-configure-vercel.mjs
```

Le script de migration utilise la connexion directe et les migrations SQL suivies dans `db/cms/`, appliquées dans l’ordre (`001_content.sql`, `002_pages.sql`, puis `003_site_settings.sql`). Tester toute modification de schéma sur la branche de développement avant son application en production. Le script Vercel utilise la session CLI déjà connectée et transmet les valeurs dans le corps HTTPS de l’API officielle. Il ne les imprime pas et ne les place pas dans les arguments de commande.

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

## Textes et photo de la page d’accueil

`cms_pages` conserve les versions `draft` et `published` de l’accueil et un compteur de version. `/api/equipe/home` exige une session active et le rôle administrateur. Les mutations vérifient l’origine, limitent le volume et valident les champs et la photo choisie. Seule la publication invalide le cache de l’accueil. Les brouillons ne sont jamais utilisés pour le rendu public. Les chiffres des références restent établis dans la présentation des chantiers, sans champ de satisfaction inventé.

Le scénario d’intégration contrôle aussi l’accès interdit aux collaborateurs, le refus d’une origine étrangère, la confidentialité du brouillon, le conflit de versions et la mise à jour publique après publication. Il restaure le contenu de développement après le test. La migration additive `002_pages.sql` a été vérifiée sur `cms-development` avant son application sur `main`.

## Réglages et réception des demandes — refonte 2026-11

`/equipe/contenu` édite les textes de l’accueil. `/equipe/reglages` édite les autres pages, prestations, coordonnées, logo, image d’accueil, références historiques, ordre des sections, chiffres sourcés, qualifications et témoignages autorisés. `/equipe/apercu` affiche les brouillons enregistrés, sans accès public. Les enregistrements et leur historique sont atomiques ; une version numérique bloque l’écrasement concurrent. La publication invalide les données publiques et le sitemap. Les justificatifs et les témoignages non publiés sont retirés du contexte public.

Les images globales utilisent le même transfert privé et les mêmes variantes que les publications. Un média global n’est public que s’il est référencé par la version publiée. Les droits sont revérifiés côté serveur.

`/equipe/demandes` est réservé aux administrateurs : coordonnées, message, statut de suivi, téléphone, e-mail et suppression définitive avec confirmation. Les contacts courts n’envoient pas de notification automatique. Les notifications D1 existantes restent conditionnelles à Resend. La durée de conservation doit être définie par le responsable ; aucun délai fictif ni purge automatique ne sont annoncés.

La migration 003 a été exécutée et testée uniquement sur `cms-development` pendant cette mission. L’appliquer en production avant déploiement, après sauvegarde et contrôle de la branche cible. Aucun secret ni fichier d’environnement ne doit être commité. Voir le [rapport de livraison](mission-2026-11-04.md).
