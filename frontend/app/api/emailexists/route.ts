import { NextResponse } from 'next/server';
import axios from 'axios';
import { getManagementAPIToken } from '@/lib/auth0';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  let token: string;

  try {
    token = await getManagementAPIToken();
  } catch (error) {
    console.error('Failed to get Auth0 token:', error);
    return NextResponse.json({ error: 'Failed to get Auth0 token' }, { status: 500 });
  }

  try {
    const response = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users-by-email`,
      {
        params: { email },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Debugging output to check the response data
    console.log('Auth0 API Response:', response.data);

    if (response.data.length > 0) {
      const user = response.data[0];
      if (user.email_verified) {
        return NextResponse.json({ verifiedMessage: `${user.email} exists and is verified` });
      } else {
        return NextResponse.json({ unverifiedMessage: `${user.email} exists but is not verified` });
      }
    } else {
      return NextResponse.json({ unverifiedMessage: `${email} does not exist` });
    }
  } catch (error) {
    return NextResponse.json({ error: `${email} does not exist or error checking email` }, { status: 500 });
  }
}
