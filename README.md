# MK Aération

Site vitrine en français, développé avec Next.js App Router et React, exécuté avec Vinext/Vite pour l’hébergement Sites sur Cloudflare Workers.

## Démarrage local

Node.js 22 LTS.

```sh
npm ci
npm run dev
```

Le serveur utilise normalement `http://127.0.0.1:5173`.

## Déploiement Vercel

`vercel.json` sélectionne le framework Next.js, lance `npm run build:vercel` (`next build`) et utilise `.next`. Le build Sites (`npm run build`) reste distinct et produit `dist/` pour Cloudflare ; il ne doit pas servir de build Vercel.

Pour exécuter la version Next.js native en local :

```sh
npm run dev:next
# ou, pour tester la version de production :
npm run build:vercel
npm run start:next
```

Les pages de présentation sont pré-générées par Next.js. L’API de devis est une fonction serveur Node.js. Sur Sites, elle conserve sa liaison D1 native ; sur Vercel, elle utilise l’API REST D1 avec les variables **serveur uniquement** suivantes :

- `CLOUDFLARE_ACCOUNT_ID` : identifiant du compte Cloudflare propriétaire de la base.
- `CLOUDFLARE_D1_DATABASE_ID` : identifiant de la base D1 contenant la table `quote_requests`.
- `CLOUDFLARE_D1_API_TOKEN` : jeton limité à cette base avec accès D1 en lecture et écriture.

Appliquer la migration SQL `drizzle/0000_slimy_cyclops.sql` à cette base avant réception des demandes. La base gérée par Sites n’est pas automatiquement transférée vers Vercel. Les variables doivent être configurées dans Vercel, puis un déploiement doit être relancé. Sans cette configuration, le site vitrine fonctionne mais l’API refuse explicitement les demandes ; le visiteur peut alors envoyer le récapitulatif par sa messagerie. Aucune confirmation de sauvegarde n’est simulée.

## Pages et contenu

L’accueil est une vitrine web distincte de l’application de gestion : ouverture sur une référence choisie par le dirigeant, preuves chiffrées reliées aux chantiers, trois expertises, présentation du savoir-faire avec photo et quatre avantages, réalisations et contact. Le visuel Mont-Blanc conserve son cadrage complet. L’en-tête et le pied de page sont communs aux pages publiques ; aucune barre d’onglets iPhone n’y est affichée. **MK Gestion** démarre sur `/equipe` et permet d’éditer l’accueil, de préparer des réalisations et d’importer leurs photos. L’édition de l’accueil est réservée à l’administrateur, avec brouillon privé, publication et protection contre les modifications concurrentes. Voir le [guide de l’équipe](docs/espace-equipe.md) et la [configuration du CMS](docs/cms-operations.md).

Accueil, expertises, réalisations avec filtres, neuf fiches chantier historiques et nouvelles réalisations, actualités, entreprise et zone d’intervention, devis en trois étapes, espace équipe, confidentialité, mentions légales et page 404.

Les textes, contacts et références sont regroupés dans `lib/content.ts`. Les photographies proviennent du site MK Aération fourni pour la refonte, des images de chantier transmises directement dans la conversation et des publications LinkedIn de Murat Kaya indiquées dans `docs/project-sources.md`. Le logo original fourni en pièce jointe par MK Aération est repris intégralement dans l’en-tête, le pied de page et les icônes du navigateur. Les dossiers présentent la réhabilitation VMC de 3 immeubles et 21 appartements, la pose d’une hotte de cuisine professionnelle, le Forum de la Métropole de Grenoble, HTC La Boisse, le tunnel du Mont-Blanc, Yottacity, FIER Annecy, la légumerie de Vourney et la plateforme Lidl. HTC La Boisse présente les quatre photographies de pose de gaines circulaires de la publication du 26 mars 2026, puis la vue architecturale du programme. Les vues architecturales sont légendées « Vue du projet » ; les photographies de pose restent identifiées comme photos de chantier. La fiche du tunnel du Mont-Blanc reprend intégralement le visuel de présentation fourni par le client et les interventions décrites par Murat Kaya sur LinkedIn ; ce visuel est légendé distinctement des photographies de chantier. Les captures de conversations et d’interfaces sociales ne sont pas publiées. Aucune note, certification ni statistique commerciale n’a été inventée.

## Demandes de devis

`POST /api/devis` valide les données côté serveur, refuse les origines étrangères, limite le volume envoyé, utilise un champ piège et limite les envois répétés. Les requêtes sont enregistrées en D1 dans `quote_requests`. L’identifiant de soumission évite une nouvelle création lors d’une reprise après coupure réseau. La confirmation contient la référence uniquement après sauvegarde. Aucun accès public en lecture aux demandes n’est exposé.

Les données du formulaire restent en mémoire pendant la navigation entre ses étapes. Elles ne sont pas stockées dans le navigateur. Recharger ou quitter la page efface la saisie en cours.

Pour la base locale, après la première compilation :

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_slimy_cyclops.sql
```

La publication Sites applique séparément les migrations sur la base hébergée. Les demandes locales de test ne sont pas publiées.

### Notifications par e-mail

La sauvegarde des devis fonctionne sans fournisseur d’e-mail. Pour notifier automatiquement `mk.aeration@hotmail.com`, configurer **dans l’environnement serveur de l’hébergeur** :

- `RESEND_API_KEY` : clé d’un compte Resend autorisé.
- `QUOTE_EMAIL_FROM` : adresse d’expédition sur un domaine vérifié dans ce compte.

Ne jamais placer ces valeurs dans le code ou dans une variable `NEXT_PUBLIC_*`. En cas d’échec de notification, le devis reste enregistré et `notified` reste à `0`. Le visiteur peut aussi ouvrir sa messagerie avec sa demande préremplie pour envoyer un e-mail et joindre ses plans ; cette action n’est jamais présentée comme un envoi automatique.

## Vérifications

```sh
npx tsc --noEmit
node --experimental-strip-types --test tests/quote-validation.test.mjs
node --experimental-strip-types --test tests/server-env.test.mjs
npm run build
npm run build:vercel
```

Vérifications effectuées : réponses HTTP des seize pages, 404, sitemap et robots ; enregistrement local réel, nouvelle tentative sans doublon, refus d’e-mail et code postal invalides, absence de consentement, champ piège, origine étrangère et charge trop volumineuse. Inspection visuelle Safari sur ordinateur et cadres mobiles de 390 et 360 px. Fiche Mont-Blanc vérifiée dans Chrome à 360 px : visuel complet et absence de débordement horizontal. Menu et navigation vers le devis contrôlés. Le parcours de saisie complet sur un appareil physique reste à vérifier.

## Avant ouverture au public

La publication Sites est privée par défaut. Le domaine public définitif pourra ensuite être raccordé. Sur Vercel, les URL de référencement utilisent automatiquement `VERCEL_PROJECT_PRODUCTION_URL` ; définir `NEXT_PUBLIC_SITE_URL` pour imposer le domaine officiel. Sans ces variables, l’aperçu Sites conserve son URL actuelle. Compléter les informations juridiques réelles, la politique de conservation et la procédure de suppression, puis configurer les notifications d’e-mail avant une campagne de collecte publique. Les pages légales signalent les éléments manquants sans inventer de SIRET ou de dénomination juridique.

Les images sont locales, proposées en plusieurs tailles WebP avec `srcset`. La police de titre est locale. Les mouvements sont limités aux transitions et respectent la préférence de réduction des animations.

## Photos et vidéos de chantier

Les deux films restent dans leurs fiches de réalisation et, pour la hotte, dans la page Expertises. L’accueil présente une sélection de réalisations sans lecteur vidéo et un encart consacré au Mont-Blanc. La fiche de réhabilitation VMC présente les trois photographies et les étapes de l’intervention.

Le lecteur affiche une image d’aperçu ; la source vidéo n’est insérée qu’après une action sur le bouton de lecture. Les commandes natives permettent de mettre en pause, régler le son, avancer et passer en plein écran. La lecture reste intégrée sur mobile ; lancer un film met en pause les autres lecteurs de la page. Le cadrage vertical complet est conservé.

Les originaux `IMG_0135.MOV`, `IMG_6616.MOV` et les trois `IMG_733*.HEIC` restent locaux dans `assets-src/originaux/`, hors du dossier public, et sont ignorés par Git. Les copies publiées utilisent H.264/AAC en MP4 avec démarrage rapide, en 720 × 1280 à 30 images/s, après conversion HDR vers BT.709. Les deux films complets pèsent environ 17 et 10 Mo, contre 319 et 252 Mo pour les MOV. Les images sont converties en WebP avec variantes de 480, 800 et 1440 px, et les affiches vidéo en 480 et 720 px.

Contrôles de cette intégration : build Next.js de production et douze tests existants réussis ; décodage complet des deux MP4 sans erreur ; démarrage rapide et requêtes HTTP partielles `206` vérifiés. Les cadres de 360 et 768 px ne présentent pas de débordement horizontal. La lecture du film VMC et les commandes natives ont été observées dans Chrome. La vérification sur téléphone physique reste à effectuer.

L’espace équipe dispose de quatre tests de validation supplémentaires et d’un scénario d’intégration sur sa branche isolée. Les vues de connexion, de tableau de bord et d’éditeur ont été contrôlées à 360 et 390 px, ainsi que l’accueil à 768 px et l’éditeur à 1100 px. Les scénarios de publication et d’actualité sont détaillés dans `docs/cms-operations.md`.
