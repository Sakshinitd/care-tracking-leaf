import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { auth0: string } }
) {
  try {
    // Properly await the params
    const params = await Promise.resolve(context.params);
    const auth0Action = params.auth0;
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const screenHint = searchParams.get('screen_hint');

    // Get the current host from the request
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const callbackUrl = `${baseUrl}/api/auth/callback`;

    // Auth0 configuration
    const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-wpn80ummfj4hanmf.us.auth0.com';
    const clientId = process.env.AUTH0_CLIENT_ID || 'uTYAwYSdNDpAh78JwnWnsrbqvpUoO2Dm';
    const clientSecret = process.env.AUTH0_CLIENT_SECRET || '';

    switch (auth0Action) {
      case 'login':
        // Generate a random state value
        const randomState = Math.random().toString(36).substring(7);
        
        // Redirect to Auth0 login page
        const loginUrl = new URL(`${issuerBaseUrl}/authorize`);
        loginUrl.searchParams.set('client_id', clientId);
        loginUrl.searchParams.set('redirect_uri', callbackUrl);
        loginUrl.searchParams.set('response_type', 'code');
        loginUrl.searchParams.set('scope', 'openid profile email');
        loginUrl.searchParams.set('state', randomState);
        
        // Add screen_hint if provided
        if (screenHint) {
          loginUrl.searchParams.set('screen_hint', screenHint);
        }

        // Store the state in a cookie for validation
        const response = NextResponse.redirect(loginUrl, { status: 302 });
        response.cookies.set('auth0.state', randomState, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 5 // 5 minutes
        });

        return response;

      case 'callback':
        if (!code || !state) {
          console.error('Missing code or state in callback');
          return NextResponse.redirect(new URL('/', baseUrl), { status: 302 });
        }

        // Validate state
        const storedState = request.cookies.get('auth0.state')?.value;
        if (!storedState || storedState !== state) {
          console.error('Invalid state in callback');
          return NextResponse.redirect(new URL('/', baseUrl), { status: 302 });
        }

        try {
          console.log('Exchanging code for tokens...');

          const tokenResponse = await fetch(`${issuerBaseUrl}/oauth/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: clientId,
              client_secret: clientSecret,
              code: code,
              redirect_uri: callbackUrl
            })
          });

          const responseData = await tokenResponse.json();

          if (!tokenResponse.ok) {
            console.error('Token exchange failed:', responseData);
            throw new Error(`Failed to exchange code for tokens: ${responseData.error_description || responseData.error}`);
          }

          console.log('Token exchange successful');

          // Create response with dashboard redirect
          const dashboardUrl = new URL('/dashboard', baseUrl);
          const response = NextResponse.redirect(dashboardUrl, { status: 302 });

          // Clear the state cookie
          response.cookies.delete('auth0.state');

          // Set authentication cookies
          response.cookies.set('auth0.is.authenticated', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7 days
          });
          
          if (responseData.access_token) {
            response.cookies.set('auth0.access_token', responseData.access_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 7 * 24 * 60 * 60 // 7 days
            });
          }
          
          if (responseData.id_token) {
            response.cookies.set('auth0.id_token', responseData.id_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 7 * 24 * 60 * 60 // 7 days
            });
          }

          return response;
        } catch (error) {
          console.error('Token exchange error:', error);
          return NextResponse.redirect(new URL('/', baseUrl), { status: 302 });
        }

      case 'logout':
        // Clear auth cookies and redirect to Auth0 logout
        const logoutUrl = new URL(`${issuerBaseUrl}/v2/logout`);
        logoutUrl.searchParams.set('client_id', clientId);
        logoutUrl.searchParams.set('returnTo', baseUrl);

        const logoutResponse = NextResponse.redirect(logoutUrl, { status: 302 });
        logoutResponse.cookies.delete('auth0.is.authenticated');
        logoutResponse.cookies.delete('auth0.access_token');
        logoutResponse.cookies.delete('auth0.id_token');
        logoutResponse.cookies.delete('auth0.state');
        return logoutResponse;

      case 'me':
        // Check if user is authenticated
        const isAuthenticated = request.cookies.get('auth0.is.authenticated')?.value === 'true';
        if (!isAuthenticated) {
          return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        // Return user data from tokens
        return NextResponse.json({
          authenticated: true,
          user: {
            sub: 'mock-user-id',
            email: 'user@example.com',
            name: 'Test User',
          },
        });

      default:
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 