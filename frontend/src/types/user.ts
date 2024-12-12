export type UserRole = 'admin' | 'landlord' | 'searcher' | 'agency';

export interface BaseUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  token?: string;
}

export interface SearcherUser extends BaseUser {
  role: 'searcher';
  preferences?: {
    maxPrice?: number;
    preferredLocations?: string[];
    propertyTypes?: string[];
    moveInDate?: string;
  };
  savedSearches?: {
    id: string;
    criteria: Record<string, any>;
    createdAt: string;
  }[];
  savedListings?: string[];
}

export interface LandlordUser extends BaseUser {
  role: 'landlord';
  properties: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  documents?: {
    id: string;
    type: 'id' | 'proof_of_ownership' | 'other';
    status: 'pending' | 'verified' | 'rejected';
    url: string;
  }[];
}

export interface AgencyUser extends BaseUser {
  role: 'agency';
  companyName: string;
  companyId: string;
  properties: string[];
  agents: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  }[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  documents?: {
    id: string;
    type: 'business_license' | 'tax_id' | 'other';
    status: 'pending' | 'verified' | 'rejected';
    url: string;
  }[];
}

export interface AdminUser extends BaseUser {
  role: 'admin';
  permissions: {
    canManageUsers: boolean;
    canManageListings: boolean;
    canManageVerifications: boolean;
    canManageReports: boolean;
    canManageSettings: boolean;
  };
}

export type User = SearcherUser | LandlordUser | AgencyUser | AdminUser;

export interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithTelegram: (telegramData: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}
