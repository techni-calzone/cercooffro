'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { FaUpload, FaSpinner, FaTimes } from 'react-icons/fa';
import { ClientLayout } from '@/components/layout';
import { toast } from 'react-hot-toast';

// Define the form schema using zod
const listingSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(50).max(1000),
  price: z.number().min(100).max(5000),
  location: z.string().min(5),
  propertyType: z.enum(['studio', 'apartment', 'room', 'shared']),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  area: z.number().min(1),
  amenities: z.array(z.string()),
  availableFrom: z.date(),
  availableUntil: z.date().optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

export default function AddListingPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { register, handleSubmit, control, formState: { errors } } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
  });

  // Handle image upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      return isValidSize && isValidType;
    });

    if (validFiles.length !== acceptedFiles.length) {
      toast.error(t('addListing.validation.imageFormat'));
    }

    setImages(prev => {
      const newImages = [...prev, ...validFiles];
      if (newImages.length > 10) {
        toast.error(t('addListing.validation.maxImages'));
        return newImages.slice(0, 10);
      }
      return newImages;
    });
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
      }
    });

    return Promise.all(uploadPromises);
  };

  const onSubmit = async (data: ListingFormData) => {
    if (images.length === 0) {
      toast.error(t('addListing.validation.minImages'));
      return;
    }

    const toastId = toast.loading(t('addListing.form.uploading'));

    try {
      setUploading(true);
      
      // Upload images first
      const imageUrls = await uploadImages(images);

      // Create the listing with image URLs
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          ...data,
          images: imageUrls,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      toast.success(t('addListing.success'), { id: toastId });
      router.push('/listings/my-listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(t('addListing.error'), { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{t('addListing.title')}</h1>
        <p className="text-gray-600 mb-8">{t('addListing.subtitle')}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('addListing.form.title')}
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder={t('addListing.form.titlePlaceholder')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring-cercooffro-primary"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{t('addListing.validation.required')}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('addListing.form.description')}
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder={t('addListing.form.descriptionPlaceholder')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring-cercooffro-primary"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{t('addListing.validation.required')}</p>
            )}
          </div>

          {/* Price and Location row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('addListing.form.price')}
              </label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                placeholder={t('addListing.form.pricePlaceholder')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring-cercooffro-primary"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{t('addListing.validation.required')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('addListing.form.location')}
              </label>
              <input
                type="text"
                {...register('location')}
                placeholder={t('addListing.form.locationPlaceholder')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring-cercooffro-primary"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{t('addListing.validation.required')}</p>
              )}
            </div>
          </div>

          {/* Property Details row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('addListing.form.propertyType')}
              </label>
              <select
                {...register('propertyType')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring-cercooffro-primary"
              >
                {Object.entries(t('addListing.form.propertyTypes', { returnObjects: true })).map(([key, value]) => (
                  <option key={key} value={key}>{value as string}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('addListing.form.bedrooms')}
              </label>
              <input
                type="number"
                {...register('bedrooms', { valueAsNumber: true })}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring-cercooffro-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('addListing.form.bathrooms')}
              </label>
              <input
                type="number"
                {...register('bathrooms', { valueAsNumber: true })}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring-cercooffro-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('addListing.form.area')}
              </label>
              <input
                type="number"
                {...register('area', { valueAsNumber: true })}
                placeholder={t('addListing.form.areaPlaceholder')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring-cercooffro-primary"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('addListing.form.amenities')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(t('addListing.form.amenitiesList', { returnObjects: true })).map(([key, value]) => (
                <label key={key} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register('amenities')}
                    value={key}
                    className="rounded border-gray-300 text-cercooffro-primary focus:ring-cercooffro-primary"
                  />
                  <span className="ml-2">{value as string}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('addListing.form.images.title')}
            </label>
            <p className="text-sm text-gray-500 mb-4">{t('addListing.form.images.subtitle')}</p>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-cercooffro-primary bg-cercooffro-primary/5' : 'border-gray-300 hover:border-cercooffro-primary'}`}
            >
              <input {...getInputProps()} />
              <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">{t('addListing.form.images.dragDrop')}</p>
              <p className="text-xs text-gray-500 mt-2">
                {t('addListing.form.images.maxSize')}
                <br />
                {t('addListing.form.images.formats')}
              </p>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('addListing.form.availability.startDate')}
              </label>
              <Controller
                name="availableFrom"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring-cercooffro-primary"
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('addListing.form.availability.endDate')}
              </label>
              <Controller
                name="availableUntil"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cercooffro-primary focus:ring-cercooffro-primary"
                  />
                )}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cercooffro-primary"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-cercooffro-primary hover:bg-cercooffro-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cercooffro-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin inline-block mr-2" />
                  {t('addListing.form.submit')}...
                </>
              ) : (
                t('addListing.form.submit')
              )}
            </button>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
}
