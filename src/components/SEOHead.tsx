import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

export interface BreadcrumbItem {
  name: string;
  item: string; // Absolute URL or relative path
}

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  breadcrumbs?: BreadcrumbItem[];
  noIndex?: boolean;
}

export const CANONICAL_ORIGIN = "https://getpyq.vercel.app";
const DEFAULT_IMAGE = "https://i.ibb.co/DH6fNLnr/file-00000000a16482118ce8d70bb897524d.png";
const DEFAULT_KEYWORDS = "bput pyq, bput previous year question papers, bput question paper download, bput engineering questions, bput question bank, bput cse ece ee me civil questions, bput 1st sem to 8th sem pyq, biju patnaik university of technology exam papers";

export default function SEOHead({
  title,
  description,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  jsonLd,
  breadcrumbs,
  noIndex = false,
}: SEOHeadProps) {
  const location = useLocation();

  // Normalize canonical URL to always point to production domain https://getpyq.vercel.app
  const resolvedCanonical = React.useMemo(() => {
    if (canonicalUrl) {
      if (canonicalUrl.startsWith("http")) {
        // Ensure production domain is used even if an old domain or localhost was passed
        try {
          const parsed = new URL(canonicalUrl);
          return `${CANONICAL_ORIGIN}${parsed.pathname}${parsed.search}`;
        } catch {
          return canonicalUrl;
        }
      }
      return `${CANONICAL_ORIGIN}${canonicalUrl.startsWith("/") ? "" : "/"}${canonicalUrl}`;
    }

    const cleanPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");
    return `${CANONICAL_ORIGIN}${cleanPath}`;
  }, [canonicalUrl, location.pathname]);

  // Construct BreadcrumbList schema if breadcrumbs are provided
  const breadcrumbSchema = React.useMemo(() => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, idx) => {
        const fullUrl = crumb.item.startsWith("http")
          ? crumb.item
          : `${CANONICAL_ORIGIN}${crumb.item.startsWith("/") ? "" : "/"}${crumb.item}`;
        return {
          "@type": "ListItem",
          "position": idx + 1,
          "name": crumb.name,
          "item": fullUrl,
        };
      }),
    };
  }, [breadcrumbs]);

  // Consolidate JSON-LD schemas
  const structuredDataList = React.useMemo(() => {
    const list: Array<Record<string, any>> = [];
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        list.push(...jsonLd);
      } else {
        list.push(jsonLd);
      }
    }
    if (breadcrumbSchema) {
      list.push(breadcrumbSchema);
    }
    return list;
  }, [jsonLd, breadcrumbSchema]);

  return (
    <Helmet>
      {/* Primary Page Title and Core Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="GetPYQ Community" />

      {/* Crawlers & Search Engine Directives */}
      {noIndex ? (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
          <meta name="bingbot" content="noindex, nofollow" />
        </>
      ) : (
        <>
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={resolvedCanonical} />

      {/* OpenGraph / Social Share Cards (Facebook, WhatsApp, LinkedIn, Slack) */}
      <meta property="og:site_name" content="GetPYQ" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Twitter / X Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@GetPYQ" />
      <meta name="twitter:creator" content="@GetPYQ" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:url" content={resolvedCanonical} />

      {/* Schema.org JSON-LD Structured Data */}
      {structuredDataList.map((schema, index) => (
        <script key={`jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
