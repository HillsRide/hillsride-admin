'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  authCode: string;
  createdAt: string;
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setEmployees(data.users);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: 'edit' | 'suspend' | 'delete', employeeId: number) => {
    try {
      const response = await fetch(`/api/users/${employeeId}/${action}`, {
        method: action === 'edit' ? 'PUT' : 'DELETE',
      });
      if (response.ok) {
        fetchEmployees(); // Refresh the list
      }
    } catch (error) {
      console.error(`Failed to ${action} employee:`, error);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-400 py-8">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-white/5">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">User ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
            <th className="px-4 py-3 text-left text-sm font