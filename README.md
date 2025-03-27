# CareTrack - Care Worker Attendance Tracking App

A comprehensive application for tracking care worker attendance using location-based clock in/out functionality.

## Features

### Manager Features
- Set location perimeters (e.g., within 2 km of a facility)
- View a table of all staff who are clocked in
- See detailed clock in/out information for each staff member
- Analytics dashboard showing:
  - Average hours care workers spend clocked in each day
  - Number of people clocking in each day
  - Total hours clocked in per staff over the last week

### Care Worker Features
- Clock in when within the designated perimeter
- Add optional notes when clocking in or out
- Location validation to ensure workers are in the correct area
- View personal clock in/out history

### Authentication
- Secure login with username/password
- Google login option
- Email login option
- Role-based access control (Manager vs Care Worker)

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Node.js (Next.js API routes)
- **Authentication**: Auth0
- **Database**: MongoDB
- **Geolocation**: Browser Geolocation API and geolib
- **Charts**: Chart.js with react-chartjs-2

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB account (Atlas or self-hosted)
- Auth0 account

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/care-tracking-app.git
cd care-tracking-app
```

2. Install dependencies:
```
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/care-tracking?retryWrites=true&w=majority

# Auth0 Configuration - Server
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_SECRET=a-long-random-string-at-least-32-characters

# Auth0 Configuration - Client
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.us.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
```

4. Run the development server:
```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Auth0 Setup

1. Create an Auth0 application (Regular Web Application)
2. Configure the following URLs in your Auth0 application settings:
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
3. Create an Auth0 API
4. Create two roles in Auth0: `manager` and `careworker`
5. Create a rule to assign roles to users based on email domain or metadata

## Deployment

The application can be deployed to Vercel with the following command:

```
vercel
```

Make sure to add all environment variables to your deployment platform.
