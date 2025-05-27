'use client';

import { useState } from 'react';
import { GraduationCap, MapPin, DollarSign, Building, Star, Award, ArrowRight, CheckCircle } from 'lucide-react';

interface FormData {
  preferredCourse: string;
  budgetRange: { min: number; max: number };
  preferredStates: string[];
  campusTypePreference: string;
  facilitiesImportance: {
    library: number;
    hostel: number;
    laboratory: number;
    sportsComplex: number;
    medicalCenter: number;
  };
  scholarshipNeeded: boolean;
}

export default function RecommendationForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState<FormData>({
    preferredCourse: '',
    budgetRange: { min: 500000, max: 2000000 },
    preferredStates: [],
    campusTypePreference: 'No Preference',
    facilitiesImportance: {
      library: 3,
      hostel: 3,
      laboratory: 3,
      sportsComplex: 2,
      medicalCenter: 3
    },
    scholarshipNeeded: false
  });

  const nigerianStates = [
    "Ogun", "Adamawa", "Osun", "FCT", "Edo", "Lagos", "Kano", "Rivers", "Kaduna", "Oyo",
    "Imo", "Enugu", "Delta", "Anambra", "Akwa Ibom", "Cross River", "Bayelsa", "Plateau"
  ];

  const popularCourses = [
    'Computer Science', 'Medicine', 'Engineering', 'Business Administration',
    'Law', 'Economics', 'Mass Communication', 'Architecture', 'Pharmacy',
    'Nursing', 'Accounting', 'International Relations', 'Psychology'
  ];

  const facilityIcons = {
    library: '📚',
    hostel: '🏠',
    laboratory: '🔬',
    sportsComplex: '🏃‍♂️',
    medicalCenter: '🏥'
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              step <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 4 && (
              <div className={`w-20 h-1 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-gray-600">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Academic Preferences</h2>
        <p className="text-gray-600">Tell us about your educational goals</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Course of Study</label>
        <select
          value={formData.preferredCourse}
          onChange={(e) => setFormData({...formData, preferredCourse: e.target.value})}
          className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-gray-700"
        >
          <option value="">Select your preferred course</option>
          {popularCourses.map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </div>

      {/* <div className="bg-white rounded-xl p-6 shadow-lg">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Academic Level</label>
        <div className="grid grid-cols-2 gap-4">
          {['Undergraduate', 'Postgraduate'].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData({...formData, academicLevel: level})}
              className={`p-4 rounded-lg border-2 font-medium transition-all ${
                formData.academicLevel === level
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget & Financial Aid</h2>
        <p className="text-gray-600">Set your budget preferences</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Annual Budget Range: ₦{formData.budgetRange.min.toLocaleString()} - ₦{formData.budgetRange.max.toLocaleString()}
        </label>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Minimum Budget</span>
              <span>₦{formData.budgetRange.min.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="300000"
              max="5000000"
              step="100000"
              value={formData.budgetRange.min}
              onChange={(e) => setFormData({
                ...formData,
                budgetRange: {...formData.budgetRange, min: parseInt(e.target.value)}
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Maximum Budget</span>
              <span>₦{formData.budgetRange.max.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500000"
              max="5000000"
              step="100000"
              value={formData.budgetRange.max}
              onChange={(e) => setFormData({
                ...formData,
                budgetRange: {...formData.budgetRange, max: parseInt(e.target.value)}
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="scholarship"
            checked={formData.scholarshipNeeded}
            onChange={(e) => setFormData({...formData, scholarshipNeeded: e.target.checked})}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="scholarship" className="flex items-center text-gray-700 font-medium">
            <Award className="w-5 h-5 text-yellow-500 mr-2" />
            I need scholarship opportunities
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Preferences</h2>
        <p className="text-gray-600">Choose your preferred locations and campus environment</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <label className="block text-sm font-semibold text-gray-700 mb-4">Preferred States</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
          {nigerianStates.map(state => (
            <label key={state} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.preferredStates.includes(state)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      preferredStates: [...formData.preferredStates, state]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      preferredStates: formData.preferredStates.filter(s => s !== state)
                    });
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{state}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <label className="block text-sm font-semibold text-gray-700 mb-4">Campus Environment Preference</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { value: 'No Preference', icon: '🌍', desc: 'Open to all environments' },
            { value: 'Urban', icon: '🏙️', desc: 'City environment with urban amenities' },
            { value: 'Suburban', icon: '🏘️', desc: 'Town environment, balanced lifestyle' },
            { value: 'Rural', icon: '🌿', desc: 'Countryside, peaceful environment' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({...formData, campusTypePreference: option.value})}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                formData.campusTypePreference === option.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{option.icon}</span>
                <span className="font-medium text-gray-900">{option.value}</span>
              </div>
              <p className="text-sm text-gray-600">{option.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Building className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Campus Facilities</h2>
        <p className="text-gray-600">Rate the importance of these facilities (1-5 scale)</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="space-y-6">
          {Object.entries(formData.facilitiesImportance).map(([facility, importance]) => (
            <div key={facility} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{facilityIcons[facility as keyof typeof facilityIcons]}</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {facility.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        facilitiesImportance: {
                          ...formData.facilitiesImportance,
                          [facility]: num
                        }
                      })}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                        importance >= num 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {importance === 1 && "Not important"}
                {importance === 2 && "Slightly important"}
                {importance === 3 && "Moderately important"}
                {importance === 4 && "Very important"}
                {importance === 5 && "Extremely important"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect <span className="text-blue-600">University Match</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Answer a few questions to get personalized university recommendations tailored to your needs
          </p>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Form Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={currentStep === 1 && !formData.preferredCourse}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Next Step
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => onSubmit(formData)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all inline-flex items-center shadow-lg"
            >
              Find My Perfect Universities
              <Star className="ml-2 h-5 w-5" />
            </button>
          )}

        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}