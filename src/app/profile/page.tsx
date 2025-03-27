import { redirect } from "next/navigation";
import { getSession } from '@/utils/auth';
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  const user = session.user;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>
        
        <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
          {user.picture && (
            <div className="flex-shrink-0">
              <img 
                src={user.picture} 
                alt={user.name || 'Profile picture'} 
                className="rounded-full w-24 h-24 object-cover border-2 border-blue-500"
              />
            </div>
          )}
          
          <div className="flex-grow">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            {user.email_verified && (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                Verified Email
              </span>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-lg mb-3">Account Information</h3>
          <ul className="space-y-2">
            <li><span className="font-medium">User ID:</span> {user.sub}</li>
            <li><span className="font-medium">Last Updated:</span> {new Date(user.updated_at).toLocaleDateString()}</li>
          </ul>
        </div>
        
        <div className="mt-6 text-center">
          <Link
            href="/api/auth/logout"
            className="text-red-600 hover:text-red-800"
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
} 