import React from "react";
import { Helmet } from "react-helmet-async"; 
const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Conditions d'utilisation | Lunchy</title>
        <meta name="description" content="Découvrez les conditions générales d'utilisation de Lunchy, votre service de livraison de repas à Paris." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Conditions d'utilisation | Lunchy" />
        <meta property="og:description" content="Toutes les règles d'utilisation de notre service de livraison Lunchy à Paris. Consultez nos conditions pour les commandes, paiements, livraisons et plus." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${import.meta.env.VITE_DOMAINE_URL}/conditionsUtilisation`} />
        <meta property="og:site_name" content="Lunchy" />
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Conditions d'utilisation</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="mt-2">
            Bienvenue sur Lunchy ! En utilisant notre site web, vous acceptez nos
            conditions générales d’utilisation. Veuillez les lire attentivement.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">2. Inscription et Compte</h2>
          <p className="mt-2">
            - Vous devez être situé à Paris (75) pour vous
            inscrire.
          </p>
          <p>- Vous êtes responsable de la confidentialité de votre compte.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">3. Commandes et Paiement</h2>
          <p className="mt-2">
            - Un montant minimum de 150€ pour les entreprises et de 50€ pour les particuliers est requis pour valider une commande.
          </p>
          <p>
            - Pour les entreprises, les commandes doivent être réglées avant de pouvoir en effectuer de
            nouvelles, sauf en période d’événement spécial.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">4. Livraison</h2>
          <p className="mt-2">
            - Les livraisons sont disponibles uniquement dans Paris (75).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">5. Annulation et Remboursement</h2>
          <p className="mt-2">- Toute annulation doit être effectuée à l’avance et avant la préparation de la commande.</p>
          <p>- Aucun remboursement n'est effectué lors de l'annulation.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">6. Sécurité et Confidentialité</h2>
          <p className="mt-2">
            - Vos informations personnelles sont protégées et utilisées selon
            notre politique de confidentialité.
          </p>
          <p>- Nous utilisons Stripe pour sécuriser les paiements.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">7. Modifications des Conditions</h2>
          <p className="mt-2">
            Lunchy se réserve le droit de modifier ces conditions à tout moment.
            Les utilisateurs seront notifiés par e-mail.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">8. Contact</h2>
          <p className="mt-2">
            Pour toute question concernant ces conditions, veuillez nous contacter
            à l'adresse suivante : lunchyParis@gmail.com
          </p>
        </section>
      </div>
    </>
  );
};

export default TermsAndConditions;
