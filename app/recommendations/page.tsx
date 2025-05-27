'use client';

import { useState, useEffect } from 'react';
import RecommendationForm from '@/components/RecommendationForm';
import { 
  Star, 
  MapPin, 
  DollarSign, 
  GraduationCap, 
  Building, 
  Award, 
  CheckCircle,
  ExternalLink,
  Heart,
  Users,
  Calendar,
  TrendingUp,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Plus,
  Check
} from 'lucide-react';

interface Recommendation {
  university: any;
  matchScore: number;
  matchReasons?: string[];
}

interface FormData {
  preferredCourse: string;
  academicLevel: string;
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

export default function RecommendationsPage() {
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedUniversities, setLikedUniversities] = useState<Set<string>>(new Set());
  const [token, setToken] = useState<string | null>(null);
  const [addingToFavorites, setAddingToFavorites] = useState<Set<string>>(new Set());

  // Get token from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      
      // Load existing liked universities for this user
      if (storedToken) {
        loadLikedUniversities(storedToken);
      }
    }
  }, []);

  const loadLikedUniversities = async (authToken: string) => {
    try {
      const response = await fetch('/api/liked-universities', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLikedUniversities(new Set(data.likedUniversities || []));
      }
    } catch (error) {
      console.error('Failed to load liked universities:', error);
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const recommendations: Recommendation[] = await response.json();
      setResults(recommendations);
    } catch (err) {
      setError((err as Error).message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (universityId: string) => {
    if (!token) {
      alert('Please login to save favorites');
      return;
    }

    setAddingToFavorites(prev => new Set(prev).add(universityId));

    try {
      const isCurrentlyLiked = likedUniversities.has(universityId);
      const method = isCurrentlyLiked ? 'DELETE' : 'POST';
      
      const response = await fetch('/api/liked-universities', {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ universityId })
      });

      if (response.ok) {
        const newLikedUniversities = new Set(likedUniversities);
        if (isCurrentlyLiked) {
          newLikedUniversities.delete(universityId);
        } else {
          newLikedUniversities.add(universityId);
        }
        setLikedUniversities(newLikedUniversities);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Failed to update favorites');
    } finally {
      setAddingToFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(universityId);
        return newSet;
      });
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Fair Match';
  };

  const renderLoadingState = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
          <div className="relative mb-6">
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto" />
            <Sparkles className="h-6 w-6 text-purple-500 absolute top-0 right-8 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Finding Your Perfect Match</h3>
          <p className="text-gray-600 mb-6">
            Our AI is analyzing thousands of universities to find the best matches for your preferences...
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Results Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your <span className="text-blue-600">Perfect University Matches</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            We found {results?.length} universities that match your preferences
          </p>
          <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Ranked by compatibility score</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {results?.map(({ university, matchScore, matchReasons }, index) => (
            <div
              key={university._id || index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="relative p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(matchScore)}`}>
                    {matchScore}% Match
                  </div>
                  <button
                    onClick={() => toggleFavorite(university._id)}
                    disabled={addingToFavorites.has(university._id)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
                  >
                    {addingToFavorites.has(university._id) ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Heart
                        className={`w-5 h-5 ${
                          likedUniversities.has(university._id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform">
                  {university.name}
                </h3>
                
                <div className="flex items-center text-white/90">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{university.state}</span>
                </div>
                
                {index === 0 && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Best Match
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Match Quality Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Match Quality:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getMatchScoreColor(matchScore)}`}>
                    {getMatchScoreLabel(matchScore)}
                  </span>
                </div>

                {/* University Details */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Campus Type</div>
                      <div className="text-sm text-gray-600">{university.campusType}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Tuition Range</div>
                      <div className="text-sm text-gray-600">
                        ₦{university.tuitionFee.min.toLocaleString()} - ₦{university.tuitionFee.max.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <GraduationCap className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Available Courses</div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {university.courses.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Reasons */}
                {matchReasons && matchReasons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm font-medium text-gray-900 mb-2">Why this matches you:</div>
                    <div className="space-y-1">
                      {matchReasons.slice(0, 2).map((reason, i) => (
                        <div key={i} className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleFavorite(university._id)}
                      disabled={addingToFavorites.has(university._id) || !token}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                        likedUniversities.has(university._id)
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {addingToFavorites.has(university._id) ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Processing...
                        </>
                      ) : likedUniversities.has(university._id) ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Added to Favorites
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Add to Favorites
                        </>
                      )}
                    </button>
                  </div>
                  {!token && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Please login to save favorites
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Are these ok?</h3>
            <p className="text-gray-600 mb-6">
              if you feel these dont fit you, you can always fine tune.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setResults(null)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Refine Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNoResults = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Perfect Matches Found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find universities that match all your criteria. Try adjusting your preferences for better results.
          </p>
          <button
            onClick={() => setResults(null)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Adjust Preferences
          </button>
        </div>
      </div>
    </div>
  );

  // Main render logic
  if (loading) return renderLoadingState();
  if (error) return renderErrorState();
  if (results && results.length === 0) return renderNoResults();
  if (results && results.length > 0) return renderResults();

  return (
    <div className="space-y-8">
      <RecommendationForm onSubmit={handleFormSubmit} />
    </div>
  );
}