'use client';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';

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
  authCode?: string;
  pin?: string;
  status: string;
  createdAt: string;
}

interface EmployeeListHandles {
  refreshList: () => Promise<void>;
}

const EmployeeList = forwardRef<EmployeeListHandles, object>((_props, ref) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/users');
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

  useImperativeHandle(ref, () => ({
    refreshList: fetchEmployees
  }));

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSuspend = async (employeeId: number) => {
    if (!confirm('Are you sure you want to suspend this employee?')) return;
    
    try {
      const response = await fetch(`/api/users/${employeeId}/suspend`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        await fetchEmployees();
      } else {
        throw new Error('Failed to suspend employee');
      }
    } catch (error) {
      console.error('Error suspending employee:', error);
      alert('Failed to suspend employee');
    }
  };

  const handleDelete = async (employeeId: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/users/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Employee deleted successfully');
        await fetchEmployees();
      } else {
        throw new Error(data.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete employee');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: 'text-green-400',
      SUSPENDED: 'text-yellow-400',
      DELETED: 'text-red-400',
      PAUSED: 'text-orange-400',
      DISMISSED: 'text-gray-400'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  const handleViewEmployee = (employeeId: number) => {
    router.push(`/employees/${employeeId}`);
  };

  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Created On</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Emp ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">PIN</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Auth Code</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Status</th>
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
                <td className="px-4 py-3 text-sm text-gray-300">
                  {new Date(employee.createdAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{employee.employeeId}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{employee.pin || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{employee.authCode || '-'}</td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className={`${getStatusColor(employee.status)} font-medium`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-2">
                  <button 
                    onClick={() => handleViewEmployee(employee.id)}
                    className="p-1 rounded-full hover:bg-white/10 transition"
                    title="View details"
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5c-4.97 0-9 3.58-9 8s4.03 8 9 8 9-3.58 9-8-4.03-8-9-8zm0 14c-3.87 0-7-2.69-7-6s3.13-6 7-6 7 2.69 7 6-3.13 6-7 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleSuspend(employee.id)}
                    className="p-1 rounded-full hover:bg-white/10 transition"
                    title="Suspend"
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(employee.id)}
                    className="p-1 rounded-full hover:bg-white/10 transition"
                    title="Delete"
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center text-gray-400 py-8">
                {loading ? 'Loading employees...' : 'No employees found'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

EmployeeList.displayName = 'EmployeeList';
export default EmployeeList;