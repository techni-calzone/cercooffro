'use client';

import React from 'react';

export default function ListingPage({ params }: { params: { listingId: string } }) {
  // Fetch the listing details using the listingId
  // For now, we will use a placeholder for the listing details
  const listingDetails = {
    id: params.listingId,
    title: `Listing ${params.listingId}`,
    description: 'Detailed description of the listing goes here.',
    price: '€500/month',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{listingDetails.title}</h1>
      <p className="text-gray-600 mb-4">{listingDetails.description}</p>
      <span className="text-cercooffro-secondary font-bold text-lg">{listingDetails.price}</span>
    </div>
  );
}

export const dynamic = 'force-dynamic';
