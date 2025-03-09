import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Taqdeer - AI-Powered Islamic Du\'a Generator',
  description = 'Find authentic du\'as from Quran and Hadith for any situation. Taqdeer uses AI to provide personalized Islamic supplications with references and translations.',
  canonicalUrl,
  keywords = 'islamic dua, dua generator, islamic supplications, quran dua, hadith dua, muslim prayers, authentic duas',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image'
}) => {
  // Construct the canonical URL
  const siteUrl = 'https://taqdeer.app';
  const canonical = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="Taqdeer" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Additional SEO Tags */}
      <meta name="application-name" content="Taqdeer" />
      <meta name="apple-mobile-web-app-title" content="Taqdeer" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#121212" />
    </Helmet>
  );
};

export default SEO; 