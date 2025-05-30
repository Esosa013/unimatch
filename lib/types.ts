import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  state: string;
  likedUniversities: string[];
  role: 'student' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface University {
  _id: ObjectId;
  name: string;
  abbreviation: string;
  state: string;
  location: string;
  yearEstablished: number;
  type: 'Private';
  accreditation: string[];
  faculties: string[];
  courses: string[];
  studentPopulation: number;
  studentToLecturerRatio: string;
  tuitionFee: {
    min: number;
    max: number;
    currency: 'NGN';
  };
  accommodationFee: {
    min: number;
    max: number;
    currency: 'NGN';
  };
  otherFees: number;
  scholarshipAvailable: boolean;
  facilities: string[];
  campusType: 'Urban' | 'Suburban' | 'Rural';
  libraryCapacity: number;
  hasHostel: boolean;
  hasMedicalCenter: boolean;
  hasLaboratories: boolean;
  hasSportsComplex: boolean;
  ranking: {
    national?: number;
    regional?: number;
  };
  website: string;
  email: string;
  phone: string;
  address: string;
   missionStatement: string;
  notableAlumni?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RecommendationRequest {
  _id: ObjectId;
  userId: ObjectId;
  preferredCourse: string;
  academicLevel: 'Undergraduate' | 'Postgraduate';
  previousGrades: string;
  budgetRange: {
    min: number;
    max: number;
  };
  scholarshipNeeded: boolean;
  preferredStates: string[];
  campusTypePreference: 'Urban' | 'Suburban' | 'Rural' | 'No Preference';
  facilitiesImportance: {
    library: number;
    hostel: number;
    laboratory: number;
    sportsComplex: number;
    medicalCenter: number;
  };
  maxStudentPopulation?: number;
  minStudentPopulation?: number;
  
  createdAt: Date;
}

export interface Preferences {
  preferredCourse: string;
  academicLevel: string;
  budgetRange: {
    min: number;
    max: number;
  };
  preferredStates: string[];
  campusTypePreference: string; // e.g., 'Urban', 'Rural', 'No Preference'
  facilitiesImportance: {
    library: number;       // e.g., 0-5 importance scale
    hostel: number;
    laboratory: number;
    sportsComplex: number;
    medicalCenter: number;
  };
  scholarshipNeeded: boolean;
}

export interface Recommendation {
  university: University;
  matchScore: number;      // e.g., 0 to 100
  matchReasons: string[];  // list of reasons why it matched
}
