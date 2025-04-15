'use client';
import { useState, useRef } from 'react';
import CreateEmployeeModal from '@/components/CreateEmployeeModal';
import EmployeeList from '@/components/EmployeeList';
import RefreshButton from '@/components/RefreshButton';

export default function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const listRef = useRef<{ refreshList: () => Promise<void> }>();

  const handleRefresh = async () => {
    await listRef.current?.refreshList();
  };

  const handleSuccess = () => {
    handleRefresh(); // Refresh the list after successful creation
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Employees</h2>
        <div className="flex gap-3">
          <RefreshButton onRefresh={handleRefresh} />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Add Employee
          </button>
        </div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
        <EmployeeList ref={listRef} />
      </div>
      
      <CreateEmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}