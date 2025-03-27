import Link from "next/link";
import { FaRegClock, FaMapMarkerAlt, FaChartLine } from 'react-icons/fa';
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('auth0.is.authenticated')?.value === 'true';

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero section with gradient background */}
      <div className="flex-grow bg-gradient-to-b from-blue-500 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Streamline Care Worker Attendance Tracking
              </h1>
              <p className="text-xl mb-8">
                Simple location-based clock in/out system for care providers.
                Track attendance accurately and efficiently.
              </p>
              <div className="mb-12 md:mb-0">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <p className="text-center">Welcome back!</p>
                    <div className="flex flex-col space-y-3">
                      <Link 
                        href="/dashboard" 
                        className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-2 px-4 rounded text-center"
                      >
                        Go to Dashboard
                      </Link>
                      <Link 
                        href="/profile" 
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded text-center border border-white"
                      >
                        View Profile
                      </Link>
                      <Link 
                        href="/api/auth/logout" 
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded text-center"
                      >
                        Log Out
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-center">Please log in to access the application</p>
                    <div className="flex flex-col space-y-3">
                      <Link 
                        href="/login" 
                        className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-2 px-4 rounded text-center"
                      >
                        Log In
                      </Link>
                      <Link 
                        href="/login?screen_hint=signup" 
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded text-center border border-white"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/hero-image.svg" 
                alt="Care worker tracking illustration" 
                className="w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-4xl mb-4">
                <FaRegClock />
              </div>
              <h3 className="text-xl font-semibold mb-3">Simple Clock In/Out</h3>
              <p className="text-gray-600">
                Easy one-touch clock in and clock out with automatic time tracking and reporting.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl mb-4">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-xl font-semibold mb-3">Location Verification</h3>
              <p className="text-gray-600">
                Verify care worker presence at the correct location through GPS-based location tracking.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-md">
              <div className="text-purple-600 text-4xl mb-4">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reporting Dashboard</h3>
              <p className="text-gray-600">
                Comprehensive reporting tools for managers to track attendance and analyze patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
