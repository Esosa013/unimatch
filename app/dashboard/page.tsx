'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  GraduationCap, 
  Search, 
  TrendingUp, 
  BookOpen, 
  MapPin, 
  DollarSign, 
  Heart, 
  X, 
  Loader2,
  Users,
  Building,
  Edit,
  Save,
  Trash2,
  Plus
} from 'lucide-react';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  state: string;
  likedUniversities: string[];
  role: 'student' | 'admin';
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
  
  // Admin state
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingUniversity, setEditingUniversity] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'universities'>('overview');
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  
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
    
    if (parsedUser.role === 'admin') {
      fetchAllUsers(authToken);
      fetchAllUniversities();
    } else {
      fetchLikedUniversities(authToken);
    }
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

  const fetchAllUsers = async (authToken: string) => {
    setIsLoadingAdmin(true);
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const users = await response.json();
        setAllUsers(users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const fetchAllUniversities = async () => {
    try {
      const response = await fetch('/api/universities');
      const universities = await response.json();
      setAllUniversities(universities);
    } catch (error) {
      console.error('Failed to fetch universities:', error);
    }
  };

  const fetchLikedUniversities = async (authToken: string) => {
    setIsLoadingLiked(true);
    try {
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

      const universitiesResponse = await fetch('/api/universities');
      const allUniversities = await universitiesResponse.json();
      
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
        setLikedUniversities(prev => prev.filter(uni => uni._id !== universityId));
        
        if (user) {
          const updatedUser = {
            ...user,
            likedUniversities: user.likedUniversities.filter(id => id !== universityId)
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Error removing university from favorites:', error);
    } finally {
      setRemovingLike(prev => {
        const newSet = new Set(prev);
        newSet.delete(universityId);
        return newSet;
      });
    }
  };

  // Admin functions
  const startEditingUser = (user: User) => {
    setEditingUser(user._id);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      state: user.state,
      role: user.role
    });
  };

  const startEditingUniversity = (university: University) => {
    setEditingUniversity(university._id);
    setEditFormData({
      name: university.name,
      state: university.state,
      courses: university.courses.join(', '),
      'tuitionFee.min': university.tuitionFee.min,
      'tuitionFee.max': university.tuitionFee.max,
      establishedYear: university.establishedYear,
      type: university.type
    });
  };

  const saveUserEdit = async () => {
    if (!token || !editingUser) return;

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: editingUser,
          update: editFormData
        })
      });

      if (response.ok) {
        // Update local state
        setAllUsers(prev => prev.map(user => 
          user._id === editingUser 
            ? { ...user, ...editFormData }
            : user
        ));
        setEditingUser(null);
        setEditFormData({});
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const saveUniversityEdit = async () => {
    if (!token || !editingUniversity) return;

    try {
      const updateData = {
        ...editFormData,
        courses: editFormData.courses.split(',').map((c: string) => c.trim()),
        tuitionFee: {
          min: parseInt(editFormData['tuitionFee.min']),
          max: parseInt(editFormData['tuitionFee.max'])
        }
      };
      delete updateData['tuitionFee.min'];
      delete updateData['tuitionFee.max'];

      const response = await fetch('/api/universities', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: editingUniversity,
          update: updateData
        })
      });

      if (response.ok) {
        // Update local state
        setAllUniversities(prev => prev.map(uni => 
          uni._id === editingUniversity 
            ? { ...uni, ...updateData }
            : uni
        ));
        setEditingUniversity(null);
        setEditFormData({});
      } else {
        alert('Failed to update university');
      }
    } catch (error) {
      console.error('Error updating university:', error);
      alert('Failed to update university');
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditingUniversity(null);
    setEditFormData({});
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

  // Admin Dashboard
  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard - Welcome, {user?.firstName}! 🔧
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage users and universities from your admin panel
                </p>
              </div>
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
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">States Covered</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.statesCount}</p>
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

          {/* Admin Tabs */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-2 px-4 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-4 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Manage Users ({allUsers.length})
                </button>
                <button
                  onClick={() => setActiveTab('universities')}
                  className={`py-2 px-4 border-b-2 font-medium text-sm ${
                    activeTab === 'universities'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Manage Universities ({allUniversities.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-black">System Overview</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 text-black">Popular Courses</h4>
                      <div className="space-y-2 text-black">
                        {stats?.popularCourses.map((course, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-sm">{course}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-black">Quick Stats</h4>
                      <div className="space-y-2 text-sm text-black">
                        <div>Admin Users: {allUsers.filter(u => u.role === 'admin').length}</div>
                        <div>Student Users: {allUsers.filter(u => u.role === 'student').length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">User Management</h3>
                  </div>
                  {isLoadingAdmin ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p>Loading users...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              State
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allUsers.map((user) => (
                            <tr key={user._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingUser === user._id ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={editFormData.firstName || ''}
                                      onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                                      className="block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                      placeholder="First Name"
                                    />
                                    <input
                                      type="text"
                                      value={editFormData.lastName || ''}
                                      onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                                      className="block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                      placeholder="Last Name"
                                    />
                                  </div>
                                ) : (
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingUser === user._id ? (
                                  <input
                                    type="email"
                                    value={editFormData.email || ''}
                                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                    className="block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                  />
                                ) : (
                                  <div className="text-sm text-gray-900">{user.email}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingUser === user._id ? (
                                  <input
                                    type="text"
                                    value={editFormData.state || ''}
                                    onChange={(e) => setEditFormData({...editFormData, state: e.target.value})}
                                    className="block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                  />
                                ) : (
                                  <div className="text-sm text-gray-900">{user.state}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingUser === user._id ? (
                                  <select
                                    value={editFormData.role || ''}
                                    onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                                    className="block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                  >
                                    <option value="student">Student</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                ) : (
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.role === 'admin' 
                                      ? 'bg-purple-100 text-purple-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {user.role}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {editingUser === user._id ? (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={saveUserEdit}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      <Save className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="text-gray-600 hover:text-gray-900"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startEditingUser(user)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'universities' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">University Management</h3>
                  </div>
                  <div className="space-y-4">
                    {allUniversities.map((university) => (
                      <div key={university._id} className="border border-gray-200 rounded-lg p-4">
                        {editingUniversity === university._id ? (
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                  type="text"
                                  value={editFormData.name || ''}
                                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">State</label>
                                <input
                                  type="text"
                                  value={editFormData.state || ''}
                                  onChange={(e) => setEditFormData({...editFormData, state: e.target.value})}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                  value={editFormData.type || ''}
                                  onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                >
                                  <option value="public">Public</option>
                                  <option value="private">Private</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Established Year</label>
                                <input
                                  type="number"
                                  value={editFormData.establishedYear || ''}
                                  onChange={(e) => setEditFormData({...editFormData, establishedYear: parseInt(e.target.value)})}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Min Tuition Fee</label>
                                <input
                                  type="number"
                                  value={editFormData['tuitionFee.min'] || ''}
                                  onChange={(e) => setEditFormData({...editFormData, 'tuitionFee.min': parseInt(e.target.value)})}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Max Tuition Fee</label>
                                <input
                                  type="number"
                                  value={editFormData['tuitionFee.max'] || ''}
                                  onChange={(e) => setEditFormData({...editFormData, 'tuitionFee.max': parseInt(e.target.value)})}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Courses (comma separated)</label>
                              <textarea
                                value={editFormData.courses || ''}
                                onChange={(e) => setEditFormData({...editFormData, courses: e.target.value})}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                rows={3}
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={saveUniversityEdit}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900">{university.name}</h4>
                                <div className="mt-2 text-sm text-gray-600 space-y-1">
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {university.state} • {university.type} • Est. {university.establishedYear}
                                  </div>
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    ₦{university.tuitionFee.min.toLocaleString()} - ₦{university.tuitionFee.max.toLocaleString()}
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <div className="flex flex-wrap gap-2">
                                    {university.courses.slice(0, 5).map((course, index) => (
                                      <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                      >
                                        {course}
                                      </span>
                                    ))}
                                    {university.courses.length > 5 && (
                                      <span className="text-xs text-gray-500">
                                        +{university.courses.length - 5} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => startEditingUniversity(university)}
                                className="ml-4 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                title="Edit university"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard (original)
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