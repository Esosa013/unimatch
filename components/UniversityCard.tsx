'use client';

import { University } from '@/lib/types';
import { MapPin, Users, DollarSign, Star, ExternalLink, Phone, Mail } from 'lucide-react';

interface UniversityCardProps {
  university: University;
  matchScore?: number;
  matchReasons?: string[];
}

export default function UniversityCard({ university, matchScore, matchReasons }: UniversityCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Header with Match Score */}
      {matchScore !== undefined && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{university.name}</h3>
              <p className="text-blue-100">{university.abbreviation}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{matchScore}%</div>
              <div className="text-sm text-blue-100">Match</div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Basic Info */}
        <div className="mb-4">
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{university.location}, {university.state} State</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <Users className="h-4 w-4 mr-2" />
            <span>{university.studentPopulation.toLocaleString()} students</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <Star className="h-4 w-4 mr-2" />
            <span>Established {university.yearEstablished}</span>
          </div>
        </div>

        {/* Fees */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Annual Fees</h4>
          <div className="flex items-center text-green-600 mb-1">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="font-medium">
              Tuition: ₦{university.tuitionFee.min.toLocaleString()} - ₦{university.tuitionFee.max.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Accommodation: ₦{university.accommodationFee.min.toLocaleString()} - ₦{university.accommodationFee.max.toLocaleString()}
          </div>
          {university.scholarshipAvailable && (
            <div className="text-sm text-blue-600 font-medium mt-1">
              ✓ Scholarships Available
            </div>
          )}
        </div>

        {/* Courses */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Popular Courses</h4>
          <div className="flex flex-wrap gap-2">
            {university.courses.slice(0, 4).map((course, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {course}
              </span>
            ))}
            {university.courses.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                +{university.courses.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Facilities */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Key Facilities</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {/* {university.hasLibrary && <div className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Library</div>} */}
            {university.hasHostel && <div className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Student Hostels</div>}
            {university.hasLaboratories && <div className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Laboratories</div>}
            {university.hasSportsComplex && <div className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Sports Complex</div>}
            {university.hasMedicalCenter && <div className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Medical Center</div>}
          </div>
        </div>

        {/* Match Reasons */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Why this matches you:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              {matchReasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t pt-4 flex flex-wrap gap-4">
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Website
          </a>
          <a
            href={`mailto:${university.email}`}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
          >
            <Mail className="h-4 w-4 mr-1" />
            Email
          </a>
          <a
            href={`tel:${university.phone}`}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
          >
            <Phone className="h-4 w-4 mr-1" />
            Call
          </a>
        </div>
      </div>
    </div>
  );
}