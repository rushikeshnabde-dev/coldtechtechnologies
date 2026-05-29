import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://coldtechtechnologies.in';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * SEO component — full meta tag, OG, Twitter, JSON-LD control per page.
 *
 * @param {string}   title        Page title (appended with " | Coldtech Technologies")
 * @param {string}   description  Meta description (150–160 chars ideal)
 * @param {string}   keywords     Comma-separated keywords
 * @param {string}   canonical    Canonical URL path e.g. "/about"
 * @param {string}   ogImage      OG image URL
 * @param {string}   ogType       OG type (default: "website")
 * @param {object}   schema       Primary JSON-LD schema object
 * @param {Array}    faqSchema    Array of {q, a} for FAQ schema (auto-generates FAQPage)
 * @param {Array}    breadcrumbs  Array of {name, url} for BreadcrumbList schema
 * @param {boolean}  noIndex      Set true to noindex the page
 */
export function SEO({
  title,
  description,
  keywords,
  canonical = '/',
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  schema = null,
  faqSchema = null,
  breadcrumbs = null,
  noIndex = false,
}) {
  const fullTitle = title
    ? `${title} | Coldtech Technologies`
    : 'Coldtech Technologies | Laptop Repair & IT Support in Pune';

  const canonicalUrl = `${BASE_URL}${canonical}`;

  // Auto-generate FAQPage schema
  const faqJsonLd = faqSchema?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqSchema.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a }
    }))
  } : null;

  // Auto-generate BreadcrumbList schema
  const breadcrumbJsonLd = breadcrumbs?.length ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": b.name,
      "item": `${BASE_URL}${b.url}`
    }))
  } : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title || 'Coldtech Technologies'} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Coldtech Technologies" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@coldtechpune" />

      {/* Primary JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* FAQ JSON-LD */}
      {faqJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      )}

      {/* Breadcrumb JSON-LD */}
      {breadcrumbJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      )}
    </Helmet>
  );
}
