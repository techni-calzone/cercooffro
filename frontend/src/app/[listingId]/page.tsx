'use client';

import React from 'react';
import Home from '@/app/(home)/page';

export default function ListingPage({ params }: { params: { listingId: string } }) {
  return <Home initialListingId={params.listingId} />;
}

export const dynamic = 'force-dynamic';
