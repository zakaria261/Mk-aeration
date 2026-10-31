# MK Aération

Site vitrine en français, développé avec Next.js App Router et React, exécuté avec Vinext/Vite pour l’hébergement Sites sur Cloudflare Workers.

## Démarrage local

Node.js 22.13 ou plus récent.

```sh
npm ci
npm run dev
```

Le serveur utilise normalement `http://127.0.0.1:5173`.

## Pages et contenu

Accueil, expertises, réalisations avec filtres, trois fiches chantier, entreprise et zone d’intervention, devis en trois étapes, confidentialité, mentions légales et page 404.

Les textes, contacts et références sont regroupés dans `lib/content.ts`. Les photographies proviennent du site MK Aération fourni pour la refonte. Le logo est repris de cette même source. Le chantier Grenoble est présenté sans lui attribuer de photographie d’un autre chantier. Aucune note, certification ni statistique commerciale n’a été inventée.

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
npm run build
```

Vérifications effectuées : réponses HTTP des dix pages, 404, sitemap et robots ; enregistrement local réel, nouvelle tentative sans doublon, refus d’e-mail et code postal invalides, absence de consentement, champ piège, origine étrangère et charge trop volumineuse. Inspection visuelle Safari sur ordinateur et cadres mobiles de 390 et 360 px. Menu et navigation vers le devis contrôlés. Le parcours de saisie complet sur un appareil physique reste à vérifier.

## Avant ouverture au public

La publication Sites est privée par défaut. Le domaine public définitif pourra ensuite être raccordé et les URL absolues de `layout.tsx`, `sitemap.ts` et `robots.ts` mises à jour. Compléter les informations juridiques réelles, la politique de conservation et la procédure de suppression, puis configurer les notifications d’e-mail avant une campagne de collecte publique. Les pages légales signalent les éléments manquants sans inventer de SIRET ou de dénomination juridique.

Les images sont locales, proposées en plusieurs tailles WebP avec `srcset`. La police de titre est locale. Les mouvements sont limités aux transitions et respectent la préférence de réduction des animations.
