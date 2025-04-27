import React from 'react'
import Hero from '../components/Hero'
import PourquoiLunchy from '../components/PourquoiLunchy'
import CmntcaMrch from '../components/CmntcaMrch'
import Testimonials from '../components/Testimonials'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
 }, []);
 
  return (
    <div>
    <Helmet>
      <title>Lunchy - Livraison de repas frais à Paris | Rapide & Délicieux</title>
      <meta name="description" content="Lunchy vous livre des repas frais à Paris en moins de 30 minutes. Commandez facilement pour votre entreprise ou personnellement." />
      <meta name="keywords" content="livraison repas Paris, déjeuner Paris,repas amis,déjeuner entre amis, repas entreprise Paris, Lunchy Paris, repas rapide Paris" />
      <meta property="og:title" content="Lunchy - Livraison de repas à Paris" />
      <meta property="og:description" content="Commandez vos repas frais et gourmands avec Lunchy à Paris. Service rapide pour particuliers et entreprises." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${import.meta.env.VITE_DOMAINE_URL}/assets/seo-img.png`} />
      <meta property="og:url" content={import.meta.env.VITE_DOMAINE_URL} />
    </Helmet>

  
        <Hero />
        <PourquoiLunchy />
        <CmntcaMrch />
        <Testimonials />
        
    </div>
  )
}

export default Home