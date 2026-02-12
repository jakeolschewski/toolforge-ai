// JSON-LD Structured Data Component

import React from 'react';

interface JsonLdProps {
  data: object | object[];
}

/**
 * Component to inject JSON-LD structured data into the page
 */
export default function JsonLd({ data }: JsonLdProps) {
  const jsonLdString = JSON.stringify(Array.isArray(data) ? data : data, null, 0);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
}
