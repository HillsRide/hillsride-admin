'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CodeLogo from '@/components/CodeLogo';
import Link from 'next/link';
import SearchableSelect from '@/components/SearchableSelect';
import DepartmentSelect from '@/components/DepartmentSelect';

export default function CreateUser() {
  const router = useRouter();
  const [status, setStatus] = useState({
    message: '',
    type: ''  // 'success' or 'error'
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          message: 'User created successfully!',
          type: 'success'
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to create user');
      }
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : 'Failed to create user',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
    designation: '',
    department: '',
    manager: '',
    approver: '',
    authCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 py-8">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <CodeLogo />
            <h2 className="text-2xl font-semibold text-center text-white mt-6">Create New User</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Employee ID</label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="Enter employee ID"
                  className="input-field"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Designation</label>
                <SearchableSelect
                  value={formData.designation}
                  onChange={(value) => setFormData({ ...formData, designation: value })}
                  placeholder="Select designation"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Department</label>
                <DepartmentSelect
                  value={formData.department}
                  onChange={(value) => setFormData({ ...formData, department: value })}
                  placeholder="Select department"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Manager</label>
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  placeholder="Enter manager name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Approver Name</label>
                <input
                  type="text"
                  value={formData.approver}
                  onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
                  placeholder="Enter approver name"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {status.message && (
              <div className={`mt-4 p-3 rounded-lg text-center ${
                status.type === 'success' 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {status.message}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}