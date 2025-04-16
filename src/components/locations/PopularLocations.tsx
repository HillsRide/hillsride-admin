'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PopularLocations() {
  const [topLocations, setTopLocations] = useState([]);

  useEffect(() => {
    const fetchTopLocations = async () => {
      const response = await fetch('/api/locations/popular');
      const data = await response.json();
      setTopLocations(data.slice(0, 10)); // Top 10 locations
    };

    fetchTopLocations();
  }, []);

  return (
    <Card className="p-4 bg-white/5 backdrop-blur">
      <h2 className="text-lg font-semibold text-white mb-4">Popular Locations</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topLocations}>
            <XAxis dataKey="search_query" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="search_count" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}