'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export default function SearchHistoryTable() {
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0
  });

  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<keyof SearchRecord>('last_searched');
  const [sortDesc, setSortDesc] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const pageSizeOptions = [20, 50, 100, 150];

  const fetchSearches = useCallback(async () => {
    if (!pagination) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/locations/history?page=${pagination.currentPage}&pageSize=${pagination.pageSize}&sort=${sortBy}&desc=${sortDesc}`
      );
      const data = await response.json();
      setSearches(data.data || []);
      setPagination(prev => ({
        ...prev,
        ...data.pagination
      }));
    } catch (error) {
      console.error('Failed to fetch searches:', error);
      setSearches([]);
    } finally {
      setIsLoading(false);
    }
  }, [pagination, sortBy, sortDesc]);

  useEffect(() => {
    if (pagination) {
      fetchSearches();
    }
  }, [sortBy, sortDesc, pagination?.pageSize, pagination?.currentPage, fetchSearches, pagination]);


  const handlePageSizeChange = (newSize: string) => {
    setPagination(prev => ({
      ...prev,
      pageSize: parseInt(newSize),
      currentPage: 1
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const handleSort = (column: keyof SearchRecord) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const startIndex = (pagination.currentPage - 1) * pagination.pageSize + 1;
  const endIndex = Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems);

  return (
    <div className="space-y-4">
      {/* Top controls section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            placeholder="Filter searches..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            Showing {startIndex}-{endIndex} of {pagination.totalItems}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={fetchSearches}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Table section */}
      <div className="rounded-lg border border-border shadow-sm overflow-hidden">
        <Table className="data-table">
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/60 transition-colors"
                onClick={() => handleSort('search_query')}
              >
                <div className="flex items-center text-muted-foreground font-medium">
                  Search Query
                  <ArrowUpDown className="ml-2 h-3 w-3 opacity-70" />
                  {sortBy === 'search_query' && (
                    <span className="ml-1 text-foreground">{sortDesc ? '↓' : '↑'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/60 transition-colors"
                onClick={() => handleSort('search_count')}
              >
                <div className="flex items-center text-muted-foreground font-medium">
                  Count
                  <ArrowUpDown className="ml-2 h-3 w-3 opacity-70" />
                  {sortBy === 'search_count' && (
                    <span className="ml-1 text-foreground">{sortDesc ? '↓' : '↑'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/60 transition-colors"
                onClick={() => handleSort('first_searched')}
              >
                <div className="flex items-center text-muted-foreground font-medium">
                  First Searched
                  <ArrowUpDown className="ml-2 h-3 w-3 opacity-70" />
                  {sortBy === 'first_searched' && (
                    <span className="ml-1 text-foreground">{sortDesc ? '↓' : '↑'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/60 transition-colors"
                onClick={() => handleSort('last_searched')}
              >
                <div className="flex items-center text-muted-foreground font-medium">
                  Last Searched
                  <ArrowUpDown className="ml-2 h-3 w-3 opacity-70" />
                  {sortBy === 'last_searched' && (
                    <span className="ml-1 text-foreground">{sortDesc ? '↓' : '↑'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/60 transition-colors"
                onClick={() => handleSort('user_type')}
              >
                <div className="flex items-center text-muted-foreground font-medium">
                  User Type
                  <ArrowUpDown className="ml-2 h-3 w-3 opacity-70" />
                  {sortBy === 'user_type' && (
                    <span className="ml-1 text-foreground">{sortDesc ? '↓' : '↑'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/60 transition-colors"
                onClick={() => handleSort('device')}
              >
                <div className="flex items-center text-muted-foreground font-medium">
                  Device
                  <ArrowUpDown className="ml-2 h-3 w-3 opacity-70" />
                  {sortBy === 'device' && (
                    <span className="ml-1 text-foreground">{sortDesc ? '↓' : '↑'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : searches.filter(search => 
                search.search_query.toLowerCase().includes(filter.toLowerCase())
              ).length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="text-muted-foreground">No results found</div>
                </TableCell>
              </TableRow>
            ) : (
              searches
                .filter(search => 
                  search.search_query.toLowerCase().includes(filter.toLowerCase())
                )
                .map(search => (
                  <TableRow key={search.search_id} className="hover:bg-muted/10">
                    <TableCell className="font-medium">
                      <div className="max-w-[200px] truncate" title={search.search_query}>
                        {search.search_query}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="px-2.5">
                        {search.search_count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(search.first_searched)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(search.last_searched)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {search.user_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {search.device}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={search.is_successful ? 'success' : 'destructive'}>
                        {search.is_successful ? 'Success' : 'Failed'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex} to {endIndex} of {pagination.totalItems} results
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center px-4 py-2 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}