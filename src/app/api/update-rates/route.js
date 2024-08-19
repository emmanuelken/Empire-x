// src/app/api/update-rates/route.js
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/utils/dbConnect';

export async function POST(request) {
  try {
    await connectToDatabase();

    const { bitcoinRate, tetherRate } = await request.json();
    const filePath = path.resolve('src/config/rates.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const rates = JSON.parse(fileContent);

    // Update rates with correct nesting
    rates.bitcoin = { ngn: bitcoinRate };
    rates.tether = { ngn: tetherRate };

    fs.writeFileSync(filePath, JSON.stringify(rates, null, 2));

    return new Response(JSON.stringify({ message: 'Rates updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating rates:', error);
    return new Response(JSON.stringify({ message: 'Failed to update rates', error: error.message }), { status: 500 });
  }
}
