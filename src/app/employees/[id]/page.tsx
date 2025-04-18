'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  designation: string;
  department: string;
  manager: string;
  approver: string;
  status: string;
  pin?: string;
  authCode?: string;
  createdAt: string;
}

export default function EmployeeProfile() {
  const params = useParams();
  const router = useRouter();
  
  // States
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3001/api/users/${params.id}/view`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }

        const data = await response.json();
        if (data.success && data.user) {
          setEmployee(data.user);
        } else {
          throw new Error(data.message || 'Failed to fetch employee data');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEmployee();
    }
  }, [params.id]);

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${params.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      if (data.success) {
        setEmployee(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // You might want to show an error message to the user
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Failed to copy');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-400 mb-4">{error || 'Employee not found'}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to List
      </button>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Header with Status */}
        <div className="bg-white/5 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white">{employee.fullName}</h1>
              <p className="text-gray-400 mt-1">{employee.designation}</p>
            </div>
            <div className="flex flex-col items-end space-y-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                employee.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400' :
                employee.status === 'SUSPENDED' ? 'bg-yellow-400/10 text-yellow-400' :
                employee.status === 'DISMISSED' ? 'bg-red-400/10 text-red-400' :
                'bg-orange-400/10 text-orange-400'
              }`}>
                {employee.status}
              </span>
              
              {/* Status Action Buttons */}
              <div className="flex space-x-2">
                {employee.status !== 'SUSPENDED' && (
                  <button
                    onClick={() => handleStatusChange('SUSPENDED')}
                    className="px-3 py-1 text-sm bg-yellow-500/10 text-yellow-400 rounded hover:bg-yellow-500/20"
                  >
                    Suspend
                  </button>
                )}
                {employee.status !== 'PAUSED' && (
                  <button
                    onClick={() => handleStatusChange('PAUSED')}
                    className="px-3 py-1 text-sm bg-orange-500/10 text-orange-400 rounded hover:bg-orange-500/20"
                  >
                    Pause
                  </button>
                )}
                {employee.status !== 'DISMISSED' && (
                  <button
                    onClick={() => handleStatusChange('DISMISSED')}
                    className="px-3 py-1 text-sm bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                  >
                    Dismiss
                  </button>
                )}
                {employee.status !== 'ACTIVE' && (
                  <button
                    onClick={() => handleStatusChange('ACTIVE')}
                    className="px-3 py-1 text-sm bg-green-500/10 text-green-400 rounded hover:bg-green-500/20"
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white/5 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white mt-1">{employee.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Phone</label>
                <p className="text-white mt-1">{employee.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Employee ID</label>
                <p className="text-white mt-1">{employee.employeeId}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Department</label>
                <p className="text-white mt-1">{employee.department}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Designation</label>
                <p className="text-white mt-1">{employee.designation}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Joined Date</label>
                <p className="text-white mt-1">
                  {new Date(employee.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white/5 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Work Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400">Manager</label>
              <p className="text-white mt-1">{employee.manager}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Approver</label>
              <p className="text-white mt-1">{employee.approver}</p>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-white/5 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Security Information</h2>
            {copySuccess && (
              <span className="text-green-400 text-sm">{copySuccess}</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PIN Section */}
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-400">PIN</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowPin(!showPin)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPin ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  {employee.pin && (
                    <button
                      onClick={() => copyToClipboard(employee.pin!, 'PIN')}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-purple-400 font-mono mt-1">
                {showPin ? employee.pin : '••••'}
              </p>
            </div>

            {/* Auth Code Section */}
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-400">Auth Code</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAuthCode(!showAuthCode)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showAuthCode ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  {employee.authCode && (
                    <button
                      onClick={() => copyToClipboard(employee.authCode!, 'Auth Code')}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-blue-400 font-mono mt-1">
                {showAuthCode ? employee.authCode : '••••••••'}
              </p>
            </div>
          </div>

          {/* Share Instructions */}
          <div className="mt-4 p-4 bg-blue-500/10 rounded-lg">
            <p className="text-sm text-gray-400">
              <span className="text-blue-400">ℹ️ </span>
              Click the eye icon to view the credentials and use the copy button to share them securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
