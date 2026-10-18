import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  noIndex?: boolean;
}

const DEFAULT_IMAGE = "https://i.ibb.co/DH6fNLnr/file-00000000a16482118ce8d70bb897524d.png";
const DEFAULT_KEYWORDS = "bput pyq, bput previous year question papers, bput question paper download, bput engineering questions, bput question bank, bput cse ece ee me civil questions, bput 1st sem to 8th sem pyq";

export default function SEOHead({
  title,
  description,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  jsonLd,
  noIndex = false,
}: SEOHeadProps) {
  const location = useLocation();

  // Resolve current canonical URL
  const resolvedCanonical = canonicalUrl || (typeof window !== "undefined" ? `${window.location.origin}${location.pathname}` : `https://getpyq.com${location.pathname}`);

  return (
    <Helmet>
      {/* Standard Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical Link */}
      <link rel="canonical" href={resolvedCanonical} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:site_name" content="GetPYQ" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:url" content={resolvedCanonical} />

      {/* Schema.org Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
