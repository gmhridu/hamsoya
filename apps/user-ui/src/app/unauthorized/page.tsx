import { ArrowLeft, Home, ShieldX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';

/**
 * Unauthorized access page
 */
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldX className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this resource. Please
            contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/login">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Error Code: 403 - Forbidden</p>
        </div>
      </div>
    </div>
  );
}
