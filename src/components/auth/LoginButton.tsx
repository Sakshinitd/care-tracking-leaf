import { useAuth0 } from '@auth0/auth0-react';
import { FaGoogle } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  const handleEmailLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'email',
      },
    });
  };

  const handleGoogleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
      },
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={handleEmailLogin}
        className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <MdEmail className="h-5 w-5" />
        <span>Login with Email</span>
      </button>
      
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 rounded-md bg-white px-6 py-2 text-gray-800 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <FaGoogle className="h-5 w-5 text-red-500" />
        <span>Login with Google</span>
      </button>
    </div>
  );
} 