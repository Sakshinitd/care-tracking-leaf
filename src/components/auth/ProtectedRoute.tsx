import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'manager' | 'careworker';
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }

    // Check for role-based access
    if (requiredRole && !isLoading && isAuthenticated) {
      // This assumes user.role is set from a rule in Auth0 or from your API
      const userRole = user?.['http://yourapp.com/role'] as string | undefined;
      
      if (!userRole || userRole !== requiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, requiredRole, router, user]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 