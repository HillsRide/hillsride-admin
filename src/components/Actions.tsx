// app/employees/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';

export default function EmployeeDetail() {
  const params = useParams();
  const employeeId = params.id;
  
  // Fetch employee data here using employeeId
  
  return (
    <div>
      <h1>Employee Details Page</h1>
      <p>Viewing employee with ID: {employeeId}</p>
      {/* Add your detail view implementation here */}
    </div>
  );
}