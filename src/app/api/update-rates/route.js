// src/app/api/update-rates/route.js
import { connectToDatabase } from '@/utils/dbConnect';
import Rate from '@/models/Rates';

export async function POST(request) {
  try {
    await connectToDatabase();

    // Parse the request body
    const { rates } = await request.json();

    if (!rates || typeof rates !== 'object') {
      throw new Error('Invalid rates data');
    }

    // Iterate over the rates object and update each asset's rate
    for (const [asset, rate] of Object.entries(rates)) {
      if (typeof rate !== 'number' || isNaN(rate)) {
        throw new Error(`Invalid rate value for asset ${asset}`);
      }

      await Rate.findOneAndUpdate(
        { asset: asset }, // Find the document by asset name
        { rate }, // Update the rate field with the new rate
        { new: true, upsert: true } // Create a new document if one doesn't exist
      );
    }

    return new Response(JSON.stringify({ message: 'Rates updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating rates:', error);
    return new Response(JSON.stringify({ message: 'Failed to update rates', error: error.message }), { status: 500 });
  }
}
