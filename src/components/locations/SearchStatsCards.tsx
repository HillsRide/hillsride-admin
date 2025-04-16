'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export default function SearchStatsCards() {
  const [stats, setStats] = useState({
    totalSearches: 0,
    uniqueLocations: 0,
    successRate: 0,
    activeUsers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('/api/locations/stats');
      const data = await response.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-white/5 backdrop-blur">
        <h3 className="text-sm font-medium text-gray-400">Total Searches</h3>
        <p className="text-2xl font-bold text-white mt-2">{stats.totalSearches}</p>
      </Card>
      
      <Card className="p-4 bg-white/5 backdrop-blur">
        <h3 className="text-sm font-medium text-gray-400">Unique Locations</h3>
        <p className="text-2xl font-bold text-white mt-2">{stats.uniqueLocations}</p>
      </Card>
      
      <Card className="p-4 bg-white/5 backdrop-blur">
        <h3 className="text-sm font-medium text-gray-400">Success Rate</h3>
        <p className="text-2xl font-bold text-white mt-2">{stats.successRate}%</p>
      </Card>
      
      <Card className="p-4 bg-white/5 backdrop-blur">
        <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
        <p className="text-2xl font-bold text-white mt-2">{stats.activeUsers}</p>
      </Card>
    </div>
  );
}