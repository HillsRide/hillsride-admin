'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SearchAccuracy() {
  const [accuracyData, setAccuracyData] = useState([]);

  useEffect(() => {
    const fetchAccuracyData = async () => {
      const response = await fetch('/api/locations/accuracy');
      const data = await response.json();
      setAccuracyData(data);
    };

    fetchAccuracyData();
  }, []);

  return (
    <Card className="p-4 bg-white/5 backdrop-blur">
      <h2 className="text-lg font-semibold text-white mb-4">Search Accuracy</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={accuracyData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="successRate" 
              stroke="#f97316" 
              fill="#f97316" 
              fillOpacity={0.2} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center">
          <p className="text-sm text-gray-400">Success Rate</p>
          <p className="text-2xl font-bold text-green-500">
            {accuracyData[accuracyData.length - 1]?.successRate}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Failed Searches</p>
          <p className="text-2xl font-bold text-red-500">
            {accuracyData[accuracyData.length - 1]?.failedSearches}
          </p>
        </div>
      </div>
    </Card>
  );
}