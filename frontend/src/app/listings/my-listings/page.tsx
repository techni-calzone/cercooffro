'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { ClientLayout } from '@/components/layout';
import { ListingCard } from '@/components/features/listings';
import { FaSpinner, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
  ownerType?: 'agency' | 'person';
  university?: string;
  rating?: number;
}

export default function MyListingsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/listings/my-listings`,
          {
            headers: {
              'Authorization': `Bearer ${user?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast.error(t('myListings.error.fetch'));
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchListings();
    }
  }, [user?.token, t]);

  const handleStatusChange = async (listingId: string, newStatus: 'active' | 'inactive') => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listingId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update listing status');
      }

      setListings(prev =>
        prev.map(listing =>
          listing.id === listingId
            ? { ...listing, status: newStatus }
            : listing
        )
      );

      toast.success(t('myListings.success.statusUpdate'));
    } catch (error) {
      console.error('Error updating listing status:', error);
      toast.error(t('myListings.error.statusUpdate'));
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!window.confirm(t('myListings.confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listingId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      setListings(prev => prev.filter(listing => listing.id !== listingId));
      toast.success(t('myListings.success.delete'));
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error(t('myListings.error.delete'));
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('myListings.title')}</h1>
          <Link
            href="/listings/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cercooffro-primary hover:bg-cercooffro-primary/90"
          >
            <FaPlus className="mr-2" />
            {t('myListings.addNew')}
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin h-8 w-8 text-cercooffro-primary" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{t('myListings.noListings')}</p>
            <Link
              href="/listings/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cercooffro-primary hover:bg-cercooffro-primary/90"
            >
              <FaPlus className="mr-2" />
              {t('myListings.createFirst')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                isOwner={true}
              />
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
