// Flag to enable/disable using real Amplify backend
// Set to false for local development with mock data
export const useRealAmplifyBackend = false;

// Amplify configuration settings - can be modified for different environments
const awsConfig = {
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'API_KEY',
};

// Configure Amplify with the settings above
export const configureAmplify = () => {
  if (useRealAmplifyBackend) {
    console.log('Using real Amplify backend');
    // This is where we would configure Amplify with actual credentials
    // For now, it's just a placeholder
  } else {
    console.log('Using mock data service');
  }
};