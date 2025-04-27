import React from "react";
import { Helmet } from "react-helmet-async";


const PrivacyPolicy = () => {
  return (
    <>
    <Helmet>
    <title>Politique de Confidentialité - Lunchy</title>
    <meta name="description" content="Découvrez comment Lunchy protège vos données personnelles et respecte votre vie privée." />
    <meta property="og:title" content="Politique de Confidentialité Lunchy" />
    <meta property="og:description" content="Toutes les informations sur la gestion et la sécurité de vos données personnelles chez Lunchy." />
    <meta property="og:image" content={`${import.meta.env.VITE_DOMAINE_URL}/assets/seo-img.png`} />
    <meta property="og:url" content={`${import.meta.env.VITE_DOMAINE_URL}/politiqueDeConfidentialite`} />
  </Helmet>
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
    <h1 className="text-3xl font-bold mb-6 text-center">Politique de Confidentialité</h1>

    <section className="mb-6">
      <h2 className="text-xl font-semibold">1. Introduction</h2>
      <p className="mt-2">
        Cette politique décrit comment Lunchy collecte, utilise et protège vos
        informations personnelles.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold">2. Données collectées</h2>
      <p className="mt-2">Nous collectons les informations suivantes :</p>
      <ul className="list-disc pl-6">
        <li>Nom et prénom</li>
        <li>Nom de la société</li>
        <li>Adresse e-mail et numéro de téléphone</li>
        <li>Adresse de livraison</li>
        <li>Historique des commandes</li>
      </ul>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold">3. Utilisation des données</h2>
      <p className="mt-2">Vos données sont utilisées pour :</p>
      <ul className="list-disc pl-6">
        <li>Gérer vos commandes et livraisons</li>
        <li>Vous envoyer des confirmations et mises à jour</li>
        <li>Assurer la sécurité des transactions</li>
        <li>Améliorer nos services</li>
      </ul>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold">4. Partage des données</h2>
      <p className="mt-2">
        Nous ne partageons vos données qu'avec nos partenaires de livraison et
        services de paiement sécurisés (ex: Stripe). Aucune donnée n'est vendue
        à des tiers.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold">5. Sécurité des informations</h2>
      <p className="mt-2">
        Nous mettons en place des mesures de sécurité avancées pour protéger
        vos données contre tout accès non autorisé.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold">6. Cookies</h2>
      <p className="mt-2">
      Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement du site Lunchy (ex : gestion des sessions utilisateurs). Aucun cookie de suivi, publicité ou marketing n'est utilisé.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold">7. Droits des utilisateurs</h2>
      <p className="mt-2">
        Vous avez le droit d'accéder, de modifier ou de supprimer vos données
        personnelles. Contactez-nous pour toute demande.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold">8. Modifications de la politique</h2>
      <p className="mt-2">
        Lunchy peut modifier cette politique de confidentialité. Les mises à
        jour seront communiquées par e-mail.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold">9. Contact</h2>
      <p className="mt-2">
        Pour toute question, contactez-nous l'adresse suivante : lunchyParis@gmail.com.
      </p>
    </section>
  </div>
    </>
  );
};

export default PrivacyPolicy;
