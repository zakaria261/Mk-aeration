# Mise en service — 4 novembre 2026

## Production accessible

- Site : https://mk-aeration.vercel.app
- Gestion privée : https://mk-aeration.vercel.app/equipe
- Connexion : https://mk-aeration.vercel.app/connexion
- Commit applicatif : `2511c78a8bd2abd24464453a7bd90f254df60613`.
- Branche source : `refonte/mobile-cms-2026-11`.
- Déploiement Vercel : `dpl_3uvS2VPYTHfCk82bzqnEV5oW9K4p`, statut Ready, cible Production.
- URL immuable : https://mk-aeration-7t6ehim4m-zakarias-projects-f65ac4d1.vercel.app

La nouvelle version a été reconstruite depuis l’aperçu GitHub correspondant exactement au commit livré, avec les variables de production. Les secrets sensibles de Vercel ne sont pas exportables ; leur contenu n’a pas été recopié ni remplacé. Les tests de persistance, de stockage et de session ci-dessous vérifient les services en fonctionnement.

Aucune fusion ou modification de `main` : sa référence distante reste `d0e3bdb71890997d150cbfa96268923ea57a372e`. Le code a été déployé depuis la branche de travail, indépendamment d’une fusion.

## Migration

Une branche Neon normale, `predeploy-cms-20261104` (`br-summer-mountain-b9tcxghh`), a été créée à partir de la production. Les migrations suivies ont été exécutées avec sa connexion directe. Les publications et les membres sont conservés : une publication et deux membres avant/après. Les nouvelles tables de réglages et de contacts sont présentes.

Les mêmes migrations ont ensuite été exécutées via `scripts/cms-migrate.mjs` avec l’environnement de production vérifié (`NEON_BRANCH=main`, connexion non poolée). La migration additive 003 est donc appliquée. Aucun contenu de développement ou compte de test n’a été transféré vers la production.

La branche de vérification expire le **6 novembre 2026 à 01:00, heure de Paris**. Elle contient la copie de production migrée ; ce n’est pas une base publique ou une nouvelle cible du site. Les fichiers temporaires de connexion ont été supprimés.

## Contrôles sur le domaine public

- Accueil et Contact : HTTP 200 sur la nouvelle version.
- `/equipe` sans session : redirection 307 vers `/connexion`.
- Réglages, demandes et médiathèque : refus 401 sans session.
- Lecture de session Auth : HTTP 200, sans demande de code ni envoi d’e-mail de test.
- Manifest : `start_url=/equipe`, application MK Gestion.
- Stockage : CORS autorise `https://mk-aeration.vercel.app`.
- Contact synthétique : réponse 201, ligne réelle vérifiée dans la base de production ; reprise identique en 200 et une seule ligne.
- Devis synthétique : réponse 201 et ligne réelle vérifiée dans la boîte Neon.
- Les deux contacts synthétiques ont été supprimés par leur identifiant exact, sans toucher aux demandes des clients. Aucune notification e-mail réelle n’a été envoyée.
- Les 19 URL du sitemap renvoient une réponse réussie.
- Chrome headless sur accueil, contact, prestation réseaux et connexion : 36 contrôles aux largeurs 320, 360, 375, 390, 393, 430, 768, 1024 et 1440 px ; aucun débordement ou erreur JavaScript.
- Canonical public : domaine de production vérifié. Huit captures mobile/desktop sont conservées localement dans `outputs/mission-2026-11-04/production-*.png`.

Les tests de publication, des rôles, d’import et de brouillons restent ceux exécutés sur la branche isolée et documentés dans le rapport de refonte. Aucun accès administrateur synthétique n’a été créé en production pour contourner la connexion.

## Lighthouse sur la production

Mesure le 2026-11-04T14:32:35.634Z, Lighthouse 13.6.0, preset mobile avec ralentissement simulé, Chrome headless sur **le domaine public de production**. Un passage, sans prétention de médiane ni de percentile terrain.

| Performance | Accessibilité | Bonnes pratiques | SEO | LCP simulé | TBT | CLS |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 98 | 100 | 100 | 100 | 2.3 s | 10 ms | 0.001 |

Résumé suivi : `qa/production-2026-11-04.json`. Rapports complets HTML/JSON locaux : `outputs/mission-2026-11-04/lighthouse-production.report.*`. Cette mesure complète les scores locaux du rapport initial, sans les présenter comme des mesures de production.

## Utilisation sur iPhone

Ouvrir **https://mk-aeration.vercel.app/equipe dans Safari**, se connecter avec l’adresse autorisée, puis **Partager → Ajouter à l’écran d’accueil**. L’icône MK Gestion ouvre l’espace privé. Le site client conserve son interface web et son adresse habituelle.

L’application reste une PWA, sans publication App Store. La réception d’un code réel par le dirigeant et le comportement sur iPhone physique restent à valider par lui ; aucun code ne lui a été envoyé pendant cette mise en service. Les durées de conservation et éventuels horaires, qualifications, réseaux sociaux ou témoignages doivent toujours correspondre à ses informations réelles.
