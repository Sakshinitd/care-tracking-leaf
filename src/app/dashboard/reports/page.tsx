'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import axios from 'axios';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { format, subDays, isAfter } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [reportData, setReportData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reports?timeRange=${timeRange}`);
      setReportData(response.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch report data');
      setLoading(false);
    }
  };

  // For demo purposes, generate mock data when actual API is not available
  const generateMockData = () => {
    // Current date
    const currentDate = new Date();
    
    // Daily clock-ins
    const dailyClockIns = [];
    const days = timeRange === 'week' ? 7 : 30;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(currentDate, i);
      const formattedDate = format(date, 'MMM dd');
      const count = Math.floor(Math.random() * 10) + 15; // Random between 15-25
      dailyClockIns.push({ date: formattedDate, count });
    }
    
    // Staff hours
    const staffHours = [
      { name: 'John Doe', hours: Math.random() * 20 + 20 },
      { name: 'Jane Smith', hours: Math.random() * 20 + 20 },
      { name: 'Bob Johnson', hours: Math.random() * 20 + 20 },
      { name: 'Alice Williams', hours: Math.random() * 20 + 20 },
      { name: 'Chris Lee', hours: Math.random() * 20 + 20 },
    ];
    
    // Average daily hours
    const avgDailyHours = dailyClockIns.map(day => ({
      date: day.date,
      hours: (Math.random() * 3 + 5).toFixed(1) // Random between 5-8 hours
    }));
    
    // Location distribution
    const locationDistribution = [
      { name: 'Downtown Facility', count: Math.floor(Math.random() * 50) + 50 },
      { name: 'North Branch', count: Math.floor(Math.random() * 40) + 30 },
      { name: 'South Clinic', count: Math.floor(Math.random() * 30) + 20 },
      { name: 'East Center', count: Math.floor(Math.random() * 25) + 15 },
    ];
    
    return {
      dailyClockIns,
      staffHours,
      avgDailyHours,
      locationDistribution,
      totalHours: staffHours.reduce((total, staff) => total + staff.hours, 0).toFixed(1),
      averageHoursPerDay: (
        avgDailyHours.reduce((total, day) => total + parseFloat(day.hours), 0) / avgDailyHours.length
      ).toFixed(1),
      totalStaff: staffHours.length,
    };
  };

  // Use mock data when actual data is not available
  const data = reportData || generateMockData();

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Clock-ins',
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Average Hours Per Day',
      },
    },
  };

  return (
    <ProtectedRoute requiredRole="manager">
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4 text-blue-600 hover:underline">
              <FaArrowLeft className="inline mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month')}
              className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
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
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">Total Hours</h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">{data.totalHours}</p>
                <p className="mt-1 text-sm text-gray-500">Hours clocked in the {timeRange === 'week' ? 'last 7 days' : 'last 30 days'}</p>
              </div>
              
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">Average Daily Hours</h3>
                <p className="mt-2 text-3xl font-bold text-green-600">{data.averageHoursPerDay}</p>
                <p className="mt-1 text-sm text-gray-500">Average hours per staff per day</p>
              </div>
              
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">Active Staff</h3>
                <p className="mt-2 text-3xl font-bold text-purple-600">{data.totalStaff}</p>
                <p className="mt-1 text-sm text-gray-500">Staff with clock-in records</p>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <Bar
                  options={barChartOptions}
                  data={{
                    labels: data.dailyClockIns.map((day: any) => day.date),
                    datasets: [
                      {
                        label: 'Number of Clock-ins',
                        data: data.dailyClockIns.map((day: any) => day.count),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                      },
                    ],
                  }}
                />
              </div>
              
              <div className="rounded-lg bg-white p-6 shadow-md">
                <Line
                  options={lineChartOptions}
                  data={{
                    labels: data.avgDailyHours.map((day: any) => day.date),
                    datasets: [
                      {
                        label: 'Average Hours',
                        data: data.avgDailyHours.map((day: any) => day.hours),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      },
                    ],
                  }}
                />
              </div>
            </div>
            
            {/* Staff Hours and Location Distribution */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Hours by Staff</h3>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Staff Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Total Hours
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {data.staffHours.map((staff: any, index: number) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            {staff.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {staff.hours.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Clock-ins by Location</h3>
                <div className="flex justify-center">
                  <div style={{ height: '250px', width: '250px' }}>
                    <Doughnut
                      data={{
                        labels: data.locationDistribution.map((loc: any) => loc.name),
                        datasets: [
                          {
                            data: data.locationDistribution.map((loc: any) => loc.count),
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.5)',
                              'rgba(54, 162, 235, 0.5)',
                              'rgba(255, 206, 86, 0.5)',
                              'rgba(75, 192, 192, 0.5)',
                            ],
                            borderColor: [
                              'rgba(255, 99, 132, 1)',
                              'rgba(54, 162, 235, 1)',
                              'rgba(255, 206, 86, 1)',
                              'rgba(75, 192, 192, 1)',
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 