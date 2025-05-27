'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Search, TrendingUp, BookOpen, MapPin, DollarSign, Heart, X, Loader2 } from 'lucide-react';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  state: string;
  likedUniversities: string[];
}

interface DashboardStats {
  totalUniversities: number;
  statesCount: number;
  popularCourses: string[];
  averageFees: { min: number; max: number };
}

interface University {
  _id: string;
  name: string;
  state: string;
  courses: string[];
  tuitionFee: { min: number; max: number };
  establishedYear: number;
  type: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [likedUniversities, setLikedUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLiked, setIsLoadingLiked] = useState(false);
  const [removingLike, setRemovingLike] = useState<Set<string>>(new Set());
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!authToken || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setToken(authToken);
    fetchDashboardStats();
    fetchLikedUniversities(authToken);
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/universities');
      const universities = await response.json();
      
      const statesSet = new Set(universities.map((uni: any) => uni.state));
      const coursesMap = new Map<string, number>();
      let totalMin = 0, totalMax = 0;
      
      universities.forEach((uni: any) => {
        uni.courses.forEach((course: string) => {
          coursesMap.set(course, (coursesMap.get(course) || 0) + 1);
        });
        totalMin += uni.tuitionFee.min;
        totalMax += uni.tuitionFee.max;
      });
      
      const popularCourses = Array.from(coursesMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([course]) => course);
      
      setStats({
        totalUniversities: universities.length,
        statesCount: statesSet.size,
        popularCourses,
        averageFees: {
          min: Math.floor(totalMin / universities.length),
          max: Math.floor(totalMax / universities.length)
        }
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLikedUniversities = async (authToken: string) => {
    setIsLoadingLiked(true);
    try {
      // First, get the user's liked universities from the API
      const likedResponse = await fetch('/api/liked-universities', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!likedResponse.ok) {
        throw new Error('Failed to fetch liked universities');
      }

      const { likedUniversities: likedIds } = await likedResponse.json();
      
      if (!likedIds || likedIds.length === 0) {
        setLikedUniversities([]);
        setIsLoadingLiked(false);
        return;
      }

      // Then get all universities data
      const universitiesResponse = await fetch('/api/universities');
      const allUniversities = await universitiesResponse.json();
      
      // Filter universities that are in the liked list
      const likedUniversitiesData = allUniversities.filter((uni: University) => 
        likedIds.includes(uni._id)
      );
      
      setLikedUniversities(likedUniversitiesData);
    } catch (error) {
      console.error('Failed to fetch liked universities:', error);
    } finally {
      setIsLoadingLiked(false);
    }
  };

  const removeLikedUniversity = async (universityId: string) => {
    if (!token) return;

    setRemovingLike(prev => new Set(prev).add(universityId));

    try {
      const response = await fetch('/api/liked-universities', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ universityId })
      });

      if (response.ok) {
        // Remove from local state
        setLikedUniversities(prev => prev.filter(uni => uni._id !== universityId));
        
        // Update user data in localStorage
        if (user) {
          const updatedUser = {
            ...user,
            likedUniversities: user.likedUniversities.filter(id => id !== universityId)
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } else {
        // const errorData = await response.json();
        // alert(errorData.error || 'Failed to remove university from favorites');
      }
    } catch (error) {
      // console.error('Error removing university from favorites:', error);
      // alert('Failed to remove university from favorites');
    } finally {
      setRemovingLike(prev => {
        const newSet = new Set(prev);
        newSet.delete(universityId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Ready to find your perfect university match?
              </p>
            </div>
            <Link
              href="/recommendations"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Find Universities
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Universities</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalUniversities}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">States Covered</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.statesCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Popular Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.popularCourses.length}+</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Tuition</p>
                <p className="text-lg font-bold text-gray-900">
                  ₦{stats?.averageFees.min.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  href="/recommendations"
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <Search className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 mb-1">Find Universities</h3>
                  <p className="text-sm text-gray-600">Get personalized university recommendations</p>
                </Link>

                <Link
                  href="/trends"
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                >
                  <TrendingUp className="h-8 w-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 mb-1">Trending Universities</h3>
                  <p className="text-sm text-gray-600">See the most popular choices right now</p>
                </Link>
              </div>
            </div>

            {/* Liked Universities Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Your Liked Universities</h2>
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {likedUniversities.length}
                </span>
              </div>

              {isLoadingLiked ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading liked universities...</p>
                </div>
              ) : likedUniversities.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't liked any universities yet.</p>
                  <Link
                    href="/recommendations"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Start exploring universities →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {likedUniversities.map((university) => (
                    <div
                      key={university._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {university.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {university.state}
                            <span className="mx-2">•</span>
                            <span className="capitalize">{university.type}</span>
                            <span className="mx-2">•</span>
                            Est. {university.establishedYear}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ₦{university.tuitionFee.min.toLocaleString()} - ₦{university.tuitionFee.max.toLocaleString()}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {university.courses.slice(0, 3).map((course, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                              >
                                {course}
                              </span>
                            ))}
                            {university.courses.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{university.courses.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeLikedUniversity(university._id)}
                          disabled={removingLike.has(university._id)}
                          className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                          title="Unlike university"
                        >
                          {removingLike.has(university._id) ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <X className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary / Sidebar */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-gray-900">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">State</p>
                <p className="text-gray-900">{user?.state}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Liked Universities</p>
                <p className="text-gray-900">{likedUniversities.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}