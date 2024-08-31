// lib/auth0.ts
import axios from 'axios';

export async function getManagementAPIToken() {
  try {
    const response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Auth0 Management API token:', error);
    throw error;
  }
}
