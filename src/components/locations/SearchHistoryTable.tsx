'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchRecord {
  search_id: string;
  search_query: string;
  search_count: number;
  first_searched: string;
  last_searched: string;
  user_type: string;
  device: string;
  is_successful: boolean;
}

export default function SearchHistoryTable() {
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<keyof SearchRecord>('last_searched');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    fetchSearches();
  }, [sortBy, sortDesc]);

  const fetchSearches = async () => {
    const response = await fetch(`/api/locations/history?sort=${sortBy}&desc=${sortDesc}`);
    const data = await response.json();
    setSearches(data);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filter searches..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={fetchSearches}>Refresh</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Query</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>First Searched</TableHead>
            <TableHead>Last Searched</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Success</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searches
            .filter(search => 
              search.search_query.toLowerCase().includes(filter.toLowerCase())
            )
            .map(search => (
              <TableRow key={search.search_id}>
                <TableCell>{search.search_query}</TableCell>
                <TableCell>{search.search_count}</TableCell>
                <TableCell>{new Date(search.first_searched).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(search.last_searched).toLocaleDateString()}</TableCell>
                <TableCell>{search.user_type}</TableCell>
                <TableCell>{search.device}</TableCell>
                <TableCell>{search.is_successful ? '✅' : '❌'}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}