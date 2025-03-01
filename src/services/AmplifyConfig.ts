import { Amplify } from 'aws-amplify';

/**
 * Configures the Amplify library to connect to your deployed backend
 *
 * You would replace the placeholder values below with your actual
 * Amplify backend configuration from AWS Console
 */
export const configureAmplify = () => {
  Amplify.configure({
    // You can find this information in your AWS Amplify Console:
    // 1. Go to AWS Amplify Console and select your app
    // 2. Go to "Backend environments" tab
    // 3. Click on "API" in the left sidebar
    // 4. Look for the GraphQL API details
    //
    // For API_KEY:
    // - Go to AppSync in AWS Console
    // - Select your API
    // - Go to "Settings" tab
    // - Scroll down to "API Keys" section
    API: {
      GraphQL: {
        endpoint: 'YOUR_GRAPHQL_ENDPOINT',
        region: 'YOUR_REGION',
        defaultAuthMode: 'apiKey',
        apiKey: 'YOUR_API_KEY',
      }
    }
  });
};

/**
 * Set this to true to use the real Amplify API
 * Set to false to use the mock data
 *
 * To use the real API:
 * 1. Replace the placeholder values above with your actual API details
 * 2. Set this to true
 * 3. Restart your application
 */
export const useRealAmplifyBackend = false;