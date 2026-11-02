import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Confidentialité",
  robots: { index: false, follow: true },
};
export default function Privacy() {
  return (
    <main id="contenu" className="wrap legal">
      <p className="label">Vos informations</p>
      <h1>Confidentialité</h1>
      <h2>Les données demandées</h2>
      <p>
        Le formulaire recueille le type de prestation, votre profil, la commune
        et le code postal du chantier, l’échéance, la description du projet,
        votre nom, votre adresse e-mail et votre téléphone. Le nom de votre
        entreprise est facultatif. Les champs marqués d’un astérisque sont
        nécessaires au traitement de votre demande.
      </p>
      <h2>Leur utilisation</h2>
      <p>
        Ces informations permettent à MK Aération d’étudier votre projet et de
        vous recontacter dans le cadre de votre demande de devis. Elles ne sont
        pas utilisées pour de la publicité. Votre accord au traitement est
        recueilli à l’envoi du formulaire. Les données ne sont pas publiées sur
        le site.
      </p>
      <h2>Enregistrement et protection</h2>
      <p>
        Les demandes sont enregistrées dans une base de données liée au site,
        hébergée sur l’infrastructure Cloudflare via Sites d’OpenAI. Une
        référence permet d’identifier votre demande. Une empreinte technique de
        l’adresse IP, renouvelée chaque jour, est utilisée pour limiter les
        envois abusifs. L’adresse IP brute n’est pas enregistrée dans la base
        des demandes.
      </p>
      <p>
        Si la notification par e-mail est activée, les données nécessaires sont
        transmises au service d’envoi Resend pour informer MK Aération. Le
        bouton « Transmettre aussi par e-mail » utilise votre propre logiciel de
        messagerie et nécessite votre action pour envoyer le message.
      </p>
      <h2>Conservation</h2>
      <p>
        Les informations doivent être conservées uniquement pendant le suivi du
        projet et la durée nécessaire aux obligations applicables. Pour cette
        version de présentation, la politique de conservation et la procédure de
        suppression doivent être confirmées par l’éditeur avant ouverture au
        public.
      </p>
      <h2>Vos demandes</h2>
      <p>
        Pour demander l’accès, la rectification ou la suppression des
        informations de votre demande, contactez{" "}
        <a href="mailto:mk.aeration@hotmail.com">mk.aeration@hotmail.com</a> en
        indiquant, si possible, sa référence. L’identité du responsable du
        traitement doit être complétée dans les mentions légales de la version
        publique.
      </p>
      <h2>Cookies</h2>
      <p>
        L’espace équipe est réservé aux collaborateurs autorisés. Il utilise
        leur nom, leur adresse e-mail et leur rôle pour gérer les publications
        et les accès. Les brouillons, les photos privées et l’historique des
        actions sont stockés sur Neon dans la région de Francfort. Les photos et
        textes validés par un administrateur deviennent publics sur le site. Les
        métadonnées d’origine des photos importées sont retirées lors de leur
        préparation pour le web.
      </p>
      <p>
        Le site n’intègre pas de traceur publicitaire ni de module de mesure
        d’audience. L’hébergement privé peut utiliser les éléments techniques
        nécessaires au contrôle de l’accès. La connexion de l’équipe utilise des
        cookies de session et un code personnel envoyé par le service
        d’authentification Neon. Le formulaire de devis ne conserve pas vos
        coordonnées dans le stockage local du navigateur.
      </p>
    </main>
  );
}
