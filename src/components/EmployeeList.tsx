'use client';
import { useState, useEffect } from 'react';

interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  authCode: string; // Add this field
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.users) {
        setEmployees(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to refresh the list
  const refreshList = () => {
    fetchEmployees();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Phone</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Auth Code</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Created</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-sm text-gray-300">#{employee.id}</td>
                <td className="px-4 py-3 text-sm text-white">{employee.fullName}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{employee.email}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{employee.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{employee.authCode}</td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {new Date(employee.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <div className="flex justify-end gap-2">
                    <button className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                      Edit
                    </button>
                    <button className="px-2 py-1 text-xs rounded bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20">
                      Suspend
                    </button>
                    <button className="px-2 py-1 text-xs rounded bg-red-500/10 text-red-400 hover:bg-red-500/20">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center text-gray-400 py-8">
                No employees found. Click "Add Employee" to create one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}