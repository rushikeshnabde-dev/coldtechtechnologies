import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://coldtechtechnologies.in';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * SEO component — drop into any page for full meta tag control.
 * @param {string} title        - Page title (will append " | Coldtech Technologies")
 * @param {string} description  - Meta description (150–160 chars)
 * @param {string} keywords     - Comma-separated keywords
 * @param {string} canonical    - Canonical URL path (e.g. "/about")
 * @param {string} ogImage      - OG image URL (defaults to site OG image)
 * @param {string} ogType       - OG type (default: "website")
 * @param {object} schema       - JSON-LD schema object (optional)
 */
export function SEO({
  title,
  description,
  keywords,
  canonical = '/',
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  schema = null,
  noIndex = false,
}) {
  const fullTitle = title
    ? `${title} | Coldtech Technologies`
    : 'Coldtech Technologies | IT Solutions Company in Pune';

  const canonicalUrl = `${BASE_URL}${canonical}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Coldtech Technologies" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@coldtechpune" />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
