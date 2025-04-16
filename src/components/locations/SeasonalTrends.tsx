'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SeasonalTrends() {
  const [trendData, setTrendData] = useState([]);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchTrends = async () => {
      const response = await fetch(`/api/locations/trends?range=${timeRange}`);
      const data = await response.json();
      setTrendData(data);
    };

    fetchTrends();
  }, [timeRange]);

  return (
    <Card className="p-4 bg-white/5 backdrop-blur">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Seasonal Trends</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="searches" stroke="#f97316" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}