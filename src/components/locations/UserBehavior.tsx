'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function UserBehavior() {
  const [deviceData, setDeviceData] = useState([]);
  const [userTypeData, setUserTypeData] = useState([]);
  const COLORS = ['#f97316', '#84cc16', '#06b6d4'];

  useEffect(() => {
    const fetchBehaviorData = async () => {
      const response = await fetch('/api/locations/behavior');
      const data = await response.json();
      setDeviceData(data.devices);
      setUserTypeData(data.userTypes);
    };

    fetchBehaviorData();
  }, []);

  return (
    <Card className="p-4 bg-white/5 backdrop-blur">
      <h2 className="text-lg font-semibold text-white mb-4">User Behavior</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-[200px]">
          <h3 className="text-sm text-gray-400 mb-2">Device Distribution</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={deviceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-[200px]">
          <h3 className="text-sm text-gray-400 mb-2">User Types</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={userTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {userTypeData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}