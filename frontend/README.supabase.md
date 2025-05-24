# Supabase Authentication Setup Guide

This guide explains how to configure Supabase authentication in the tempo-plan-sync application.

## Prerequisites

- A Supabase account - [Sign up](https://supabase.com)
- A Supabase project created

## Setup Steps

### 1. Get Your Supabase Credentials

1. Navigate to your Supabase project dashboard
2. Go to Project Settings > API
3. Find and copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Project API Keys**: Copy the `anon` public key

### 2. Configure Environment Variables

1. Create a `.env` file in the root directory of the project (or copy from `.env.example`)
2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Configure OAuth Providers in Supabase

To enable Google authentication:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers > Google
3. Toggle to enable Google auth
4. Set up your Google OAuth credentials:
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Go to "APIs & Services" > "Credentials"
   - Create OAuth client ID credentials
   - Set the Authorized redirect URI to:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Copy the Client ID and Client Secret to Supabase
5. In Google Cloud Console, also add your application's domain to the authorized JavaScript origins:
   ```
   http://localhost:8080  # For local development
   https://your-production-domain.com  # For production
   ```

### 4. Additional OAuth Providers (Optional)

Follow similar steps for other providers (GitHub, Facebook, etc.) in Authentication > Providers section.

## Usage

The authentication hooks are already set up in the application. To use:

```jsx
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  // Check if user is logged in
  if (user) {
    console.log("Logged in as:", user.email);
  }

  // Sign out
  const handleSignOut = () => {
    signOut();
  };

  // Sign in with Google
  const handleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <div>
      {user ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
}
```

## Environment-Specific Configuration

For production environments, update your environment variables accordingly:

```
VITE_SUPABASE_URL=https://your-production-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## Troubleshooting

- **Authentication Redirects Not Working**: Ensure your redirect URLs are properly configured in Supabase and Google Cloud Console
- **CORS Issues**: Verify that your domain is added to the allowed origins in Supabase
- **Environment Variables Not Loading**: Make sure to restart your development server after updating environment variables

For more information, refer to the [Supabase Authentication documentation](https://supabase.com/docs/guides/auth).