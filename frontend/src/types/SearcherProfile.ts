export type Sex = 'Male' | 'Female' | 'Other';
export type StudyLevel = 'Undergraduate' | 'Graduate' | 'PhD' | 'Postdoc';
export type StudyField = 
  | 'Engineering'
  | 'Computer Science'
  | 'Business'
  | 'Medicine'
  | 'Law'
  | 'Arts'
  | 'Humanities'
  | 'Social Sciences'
  | 'Natural Sciences'
  | 'Other';

export interface SearcherProfile {
  id?: string; // Optional ID for database storage
  
  // Core Personal Information
  personalInfo: {
    firstName?: string;
    lastName?: string;
    age?: number;
    nationality: string;
    sex: Sex;
    contactInfo: {
      telegramUsername: string;
      email?: string;
      phoneNumber?: string;
    };
  };
  
  // Academic Profile
  academicProfile: {
    university?: string;
    studyLevel: StudyLevel;
    studyField: StudyField;
    department?: string;
    expectedGraduation?: Date;
  };
  
  // Financial Information
  financialInfo: {
    monthlyIncome: number; // in local currency
    financialStatus: 'Student' | 'Working Student' | 'Scholarship' | 'Other';
    budgetPreference: {
      min: number;
      max: number;
    };
  };
  
  // Housing Preferences
  housingPreferences: {
    desiredLocation: string[];
    moveInDate: Date;
    stayDuration: {
      min: number; // in months
      max: number; // in months
    };
    groupSize: number; // Number of people in the group
    preferredRoommates?: string[]; // Telegram usernames
  };
  
  // Lifestyle and Compatibility
  lifestylePreferences: {
    smokingPreference: 'Non-Smoker' | 'Smoker' | 'Occasional';
    alcoholPreference: 'Non-Drinker' | 'Drinker' | 'Occasional';
    dietaryRestrictions?: string[];
    petFriendly: boolean;
    additionalTags: string[]; // e.g., 'LGBTQ+ Friendly', 'International Students Welcome'
  };

  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    profileCompleteness: number; // 0-100%
  };
}
