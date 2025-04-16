'use client';

import { useState, useEffect } from 'react';
import SearchStatsCards from '@/components/locations/SearchStatsCards';
import SearchHistoryTable from '@/components/locations/SearchHistoryTable';
import PopularLocations from '@/components/locations/PopularLocations';
import SeasonalTrends from '@/components/locations/SeasonalTrends';
import UserBehavior from '@/components/locations/UserBehavior';
import SearchAccuracy from '@/components/locations/SearchAccuracy';

export default function SearchedLocationsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto refresh every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 1800000); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white">Search Analytics</h1>
      
      {/* Stats Cards */}
      <SearchStatsCards key={`stats-${refreshKey}`} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopularLocations key={`popular-${refreshKey}`} />
        <SeasonalTrends key={`trends-${refreshKey}`} />
        <UserBehavior key={`behavior-${refreshKey}`} />
        <SearchAccuracy key={`accuracy-${refreshKey}`} />
      </div>

      {/* Full Width Table */}
      <SearchHistoryTable key={`table-${refreshKey}`} />
    </div>
  );
}