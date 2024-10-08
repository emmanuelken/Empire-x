// src/app/api/custom-rates/route.js
import { connectToDatabase } from '../../../utils/dbConnect';
import Rate from '../../../models/Rates'; // Assuming you have a Rate model

export async function GET(request) {
  await connectToDatabase();
  
  try {
    const rates = await Rate.find(); // Fetch rates from database
    if (!rates) {
      return new Response(JSON.stringify([]), { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } });
    }
    return new Response(JSON.stringify(rates), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', // Disable caching
      },
    });
  } catch (error) {
    console.error('Error fetching rates:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch rates' }), {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', // Disable caching for errors as well
      },
    });
  }
}

