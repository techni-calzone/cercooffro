import { Metadata } from 'next';
import { metadata as globalMetadata } from '../metadata';

export const metadata: Metadata = {
  ...globalMetadata,
  title: 'CercoOffro - Home',
  description: 'Find your perfect student housing in Italy',
};
