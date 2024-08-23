// src/utils/conversionUtils.js
import { connectToDatabase } from './dbConnect'; // Update with your database connection utility
import Rate from '../models/Rates'; // Update with your Rate model

export async function getConversionRate(assetId) {
  try {
    await connectToDatabase();

    // Fetch the conversion rate from the database
    const rate = await Rate.findOne({ asset: assetId });

    if (!rate || !rate.rate) {
      throw new Error('Conversion rate not found');
    }

    return rate.rate;
  } catch (error) {
    throw new Error('Failed to fetch conversion rate: ' + error.message);
  }
}
