import { Helmet } from "react-helmet-async"; 

const LegalNotice = () => {
  return (
    <>
        <Helmet>
            <title>Mentions Légales et Conditions d'Utilisation - Lunchy</title>
            <meta name="description" content="Consultez les mentions légales et les conditions générales d'utilisation du site Lunchy." />
            <meta property="og:title" content="Mentions Légales Lunchy" />
            <meta property="og:description" content="Toutes les informations légales concernant l'utilisation du site Lunchy." />
            <meta property="og:image" content={`${import.meta.env.VITE_DOMAINE_URL}/assets/seo-img.png`} />
            <meta property="og:url" content={`${import.meta.env.VITE_DOMAINE_URL}/mentionslegales`} />
        </Helmet>

      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Mentions légales</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">1. Éditeur du site</h2>
          <p className="mt-2">
            <strong>Nom de l'entreprise :</strong> {/* TODO: Ton nom d'entreprise ou du client ici */}
          </p>
          <p className="mt-2">
            <strong>Forme juridique :</strong> {/* Ex : SAS, SARL, Auto-entreprise */}
          </p>
          <p className="mt-2">
            <strong>Siège social :</strong> {/* Adresse complète */}
          </p>
          <p className="mt-2">
            <strong>Numéro SIRET :</strong> {/* Numéro SIRET */}
          </p>
          <p className="mt-2">
            <strong>Email : lunchyParis@gmail.com</strong> {/* Adresse email de contact */}
          </p>
          <p className="mt-2">
            <strong>Téléphone : +33 760 13 59 96</strong> {/* Numéro téléphone de contact */}
          </p>
          <p className="mt-2">
            <strong>Directeur de la publication : Halim Belhocine</strong> {/* Nom du responsable, souvent le gérant */}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">2. Hébergement du site</h2>
          <p className="mt-2">
            <strong>Hébergeur :  Hostinger International Ltd</strong> {/* Ex : OVH, Scaleway, Infomaniak... */}
          </p>
          <p className="mt-2">
            <strong>Adresse : 61 Lordou Vironos Street, 6023 Larnaca, Chypre  </strong> {/* Adresse complète de l'hébergeur */}
          </p>
          <p className="mt-2">
            <strong>Téléphone : +1 212 796 5811</strong> {/* Téléphone de l'hébergeur */}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">3. Propriété intellectuelle</h2>
          <p className="mt-2">
            Le site Lunchy ainsi que l'ensemble de son contenu (textes, images, graphismes, logo, icônes, etc.) sont protégés par les lois françaises relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation préalable écrite de Lunchy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">4. Données personnelles</h2>
          <p className="mt-2">
            Pour plus d'informations sur la collecte et le traitement de vos données personnelles, veuillez consulter notre {" "}
            <a href="/politiqueDeConfidentialite" className="text-orange-500 underline">
              Politique de confidentialité
            </a>.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">5. Cookies</h2>
          <p className="mt-2">
            Le site Lunchy utilise uniquement des cookies essentiels au fonctionnement du site et à la gestion des sessions utilisateurs. Aucune donnée n'est collectée à des fins publicitaires.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">6. Droit applicable</h2>
          <p className="mt-2">
            Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>
      </div>
    </>
  );
};

export default LegalNotice;
