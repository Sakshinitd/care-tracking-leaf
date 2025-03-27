import { cookies } from "next/headers";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('auth0.is.authenticated')?.value === 'true';

  if (!isAuthenticated) {
    return null; // Let the middleware handle the redirect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link 
            href="/profile" 
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
          >
            View Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions Card */}
          <div className="bg-blue-50 p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Link 
                href="/clockin" 
                className="block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-center transition-colors duration-200"
              >
                Clock In
              </Link>
              <Link 
                href="/clockout" 
                className="block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded text-center transition-colors duration-200"
              >
                Clock Out
              </Link>
              <Link 
                href="/location" 
                className="block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded text-center transition-colors duration-200"
              >
                Update Location
              </Link>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-gray-50 p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Current Status</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Status:</span> <span className="text-green-600">Clocked In</span></p>
              <p><span className="font-medium">Location:</span> Main Office</p>
              <p><span className="font-medium">Clock In Time:</span> 9:00 AM</p>
              <p><span className="font-medium">Elapsed Time:</span> 2h 30m</p>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-yellow-50 p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Clock In</span>
                <span className="text-sm text-gray-600">Today, 9:00 AM</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Location Update</span>
                <span className="text-sm text-gray-600">Today, 11:15 AM</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Clock Out</span>
                <span className="text-sm text-gray-600">Yesterday, 5:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Weekly Schedule</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Monday</td>
                  <td className="px-6 py-4 whitespace-nowrap">9:00 AM - 5:00 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap">Main Office</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="text-green-600">Completed</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Tuesday</td>
                  <td className="px-6 py-4 whitespace-nowrap">9:00 AM - 5:00 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap">Main Office</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="text-green-600">Completed</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Wednesday</td>
                  <td className="px-6 py-4 whitespace-nowrap">9:00 AM - 5:00 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap">Main Office</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="text-blue-600">In Progress</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Thursday</td>
                  <td className="px-6 py-4 whitespace-nowrap">9:00 AM - 5:00 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap">Branch Office</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="text-gray-600">Scheduled</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Friday</td>
                  <td className="px-6 py-4 whitespace-nowrap">9:00 AM - 5:00 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap">Branch Office</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="text-gray-600">Scheduled</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 