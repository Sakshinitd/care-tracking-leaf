'use client';

import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import axios from 'axios';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaFileAlt } from 'react-icons/fa';
import { format } from 'date-fns';

interface Location {
  latitude: number;
  longitude: number;
}

interface ClockRecord {
  _id: string;
  clockInTime: Date;
  clockInLocation: Location;
  clockInNote: string;
  clockOutTime: Date | null;
  clockOutLocation: Location | null;
  clockOutNote: string | null;
  totalHours: number | null;
  locationName: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

export default function MyHistoryPage() {
  const [clockRecords, setClockRecords] = useState<ClockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'all'>('week');

  const fetchClockRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/user/clock-history?timeFrame=${timeFrame}`);
      setClockRecords(response.data.clockRecords);
      setLoading(false);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.response?.data?.error || 'Failed to fetch clock records');
      setLoading(false);
    }
  }, [timeFrame]);

  useEffect(() => {
    fetchClockRecords();
  }, [fetchClockRecords]);

  // Mock data for demonstration
  const mockClockRecords: ClockRecord[] = [
    {
      _id: '1',
      clockInTime: new Date(Date.now() - 3600000 * 24 * 2),
      clockInLocation: { latitude: 40.7128, longitude: -74.006 },
      clockInNote: 'Started shift',
      clockOutTime: new Date(Date.now() - 3600000 * 24 * 2 + 3600000 * 8),
      clockOutLocation: { latitude: 40.7128, longitude: -74.006 },
      clockOutNote: 'Completed all tasks',
      totalHours: 8,
      locationName: 'Downtown Facility'
    },
    {
      _id: '2',
      clockInTime: new Date(Date.now() - 3600000 * 24),
      clockInLocation: { latitude: 40.7128, longitude: -74.006 },
      clockInNote: 'Starting morning shift',
      clockOutTime: new Date(Date.now() - 3600000 * 24 + 3600000 * 7.5),
      clockOutLocation: { latitude: 40.7128, longitude: -74.006 },
      clockOutNote: 'Shift completed',
      totalHours: 7.5,
      locationName: 'North Branch'
    },
    {
      _id: '3',
      clockInTime: new Date(),
      clockInLocation: { latitude: 40.7128, longitude: -74.006 },
      clockInNote: 'Started work',
      clockOutTime: null,
      clockOutLocation: null,
      clockOutNote: null,
      totalHours: null,
      locationName: 'East Center'
    }
  ];

  const data = clockRecords.length > 0 ? clockRecords : mockClockRecords;

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy h:mm a');
  };

  const formatHours = (hours: number | null) => {
    if (hours === null) return 'In progress';
    return `${hours.toFixed(1)} hours`;
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4 text-blue-600 hover:underline">
              <FaArrowLeft className="inline mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">My Clock History</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as 'week' | 'month' | 'all')}
              className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hours
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.map((record) => (
                  <tr key={record._id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatDateTime(record.clockInTime)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        {record.locationName}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-gray-400" />
                        {formatDateTime(record.clockInTime)}
                      </div>
                      {record.clockInNote && (
                        <div className="mt-1 text-xs text-gray-400">
                          {record.clockInNote}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {record.clockOutTime ? (
                        <>
                          <div className="flex items-center">
                            <FaClock className="mr-2 text-gray-400" />
                            {formatDateTime(record.clockOutTime)}
                          </div>
                          {record.clockOutNote && (
                            <div className="mt-1 text-xs text-gray-400">
                              {record.clockOutNote}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-yellow-600">In Progress</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatHours(record.totalHours)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 