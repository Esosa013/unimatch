'use client';

import { useState, useEffect } from 'react';
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
  Filter,
  Flame,
  Zap,
  Trophy,
  Target,
  Plus,
  Check
} from 'lucide-react';

interface TrendingUniversity {
  university: any;
  trendScore: number;
  trendReasons: string[];
  trendCategory: 'Rising Star' | 'Popular Choice' | 'Growing Fast' | 'Well Established';
}

interface TrendsResponse {
  trending: TrendingUniversity[];
  categories: string[];
  total: number;
}

export default function TrendsPage() {
  const [trendsData, setTrendsData] = useState<TrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedUniversities, setLikedUniversities] = useState<Set<string>>(new Set());
  const [addingToFavorites, setAddingToFavorites] = useState<Set<string>>(new Set());
  const [token, setToken] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [limit, setLimit] = useState(12);

  // Get token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    
    // Load existing liked universities for this user
    if (storedToken) {
      loadLikedUniversities(storedToken);
    }
  }, []);

  // Fetch trending universities
  useEffect(() => {
    fetchTrendingUniversities();
  }, [selectedCategory, limit]);

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

  const fetchTrendingUniversities = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/trends?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending universities');
      }

      const data: TrendsResponse = await response.json();
      setTrendsData(data);
    } catch (err) {
      setError((err as Error).message);
      setTrendsData(null);
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

  const getTrendScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getTrendScoreLabel = (score: number) => {
    if (score >= 80) return 'Hot Trending';
    if (score >= 70) return 'Trending Up';
    if (score >= 60) return 'Rising';
    return 'Emerging';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Rising Star':
        return <Sparkles className="w-4 h-4" />;
      case 'Popular Choice':
        return <Flame className="w-4 h-4" />;
      case 'Growing Fast':
        return <Zap className="w-4 h-4" />;
      case 'Well Established':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Rising Star':
        return 'bg-purple-100 text-purple-700';
      case 'Popular Choice':
        return 'bg-red-100 text-red-700';
      case 'Growing Fast':
        return 'bg-green-100 text-green-700';
      case 'Well Established':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderLoadingState = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
          <div className="relative mb-6">
            <Loader2 className="h-16 w-16 text-red-600 animate-spin mx-auto" />
            <Flame className="h-6 w-6 text-orange-500 absolute top-0 right-8 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Discovering Trending Universities</h3>
          <p className="text-gray-600 mb-6">
            We're analyzing the hottest trends in higher education to show you what's popular right now...
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchTrendingUniversities}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filter by Category:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {trendsData?.categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getCategoryIcon(category)}
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value={6}>6 Universities</option>
            <option value={12}>12 Universities</option>
            <option value={18}>18 Universities</option>
            <option value={24}>24 Universities</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderTrendingUniversities = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-3 mr-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              <span className="text-red-600">Trending</span> Universities
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Discover the hottest universities that students are choosing right now
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-red-500" />
              <span>Real-time trends</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Rising stars</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Popular choices</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        {renderFilters()}

        {/* Results Count */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory ? `${selectedCategory} Universities` : 'All Trending Universities'}
            <span className="text-lg font-normal text-gray-600 ml-2">
              ({trendsData?.trending.length} found)
            </span>
          </h2>
        </div>

        {/* Trending Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {trendsData?.trending.map(({ university, trendScore, trendReasons, trendCategory }, index) => (
            <div
              key={university._id || index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
            >
              {/* Trending Badge */}
              {index < 3 && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <Flame className="w-3 h-3 mr-1" />
                    #{index + 1} Trending
                  </div>
                </div>
              )}

              {/* Card Header */}
              <div className="relative p-6 bg-gradient-to-r from-red-500 to-orange-600 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getTrendScoreColor(trendScore)}`}>
                    {Math.round(trendScore)}% Hot
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
                
                <div className="flex items-center text-white/90 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{university.state}</span>
                </div>

                {/* Category Badge */}
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(trendCategory)}`}>
                  {getCategoryIcon(trendCategory)}
                  <span>{trendCategory}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Trend Quality Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Trend Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTrendScoreColor(trendScore)}`}>
                    {getTrendScoreLabel(trendScore)}
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
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Established</div>
                      <div className="text-sm text-gray-600">{university.yearEstablished}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Student Population</div>
                      <div className="text-sm text-gray-600">{university.studentPopulation.toLocaleString()}</div>
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
                </div>

                {/* Trend Reasons */}
                {trendReasons && trendReasons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm font-medium text-gray-900 mb-2">Why it's trending:</div>
                    <div className="space-y-1">
                      {trendReasons.slice(0, 2).map((reason, i) => (
                        <div key={i} className="flex items-center text-xs text-gray-600">
                          <TrendingUp className="w-3 h-3 text-red-500 mr-2 flex-shrink-0" />
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
                          : 'bg-red-600 text-white hover:bg-red-700'
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

        {/* Load More */}
        {trendsData && trendsData.trending.length >= limit && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setLimit(prev => prev + 6)}
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all inline-flex items-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Load More Trending
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <Flame className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Ahead of the Trends</h3>
            <p className="text-gray-600 mb-6">
              These universities are making waves in education. Don't miss out on what's trending now!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/recommendations'}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all"
              >
                Get Personalized Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  if (loading) return renderLoadingState();
  if (error) return renderErrorState();
  if (!trendsData || trendsData.trending.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Trending Data Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any trending universities at the moment. Please try again later.
            </p>
            <button
              onClick={fetchTrendingUniversities}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh Trends
            </button>
          </div>
        </div>
      </div>
    );
  }

  return renderTrendingUniversities();
}