import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }

  const secretName = process.env.GEMINI_SECRET_NAME || 'projects/YOUR_PROJECT_ID/secrets/GEMINI_API_KEY/versions/latest';
  try {
    const [version] = await client.accessSecretVersion({ name: secretName });
    return version.payload.data.toString('utf8');
  } catch (err) {
    console.error('Failed to fetch secret from Secret Manager:', err.message);
    throw new Error('Could not retrieve Gemini API key from Secret Manager');
  }
}
