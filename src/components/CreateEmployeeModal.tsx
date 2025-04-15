'use client';
import { useState } from 'react';
import SearchableSelect from './SearchableSelect';
import DepartmentSelect from './DepartmentSelect';

export default function CreateEmployeeModal({ isOpen, onClose, onSuccess }: { 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess?: () => void;
}) {
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
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ 
          message: 'Employee created successfully!', 
          type: 'success' 
        });
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to create employee');
      }
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : 'Failed to create employee',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Create New Employee</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
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

          {status.message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              status.type === 'success' 
                ? 'bg-green-500/10 text-green-500' 
                : 'bg-red-500/10 text-red-500'
            }`}>
              {status.message}
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Creating Employee...' : 'Create Employee'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-white/5 text-white font-semibold hover:bg-white/10 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}