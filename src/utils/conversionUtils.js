import fs from 'fs';
import path from 'path';

// Define the path to the rates JSON file
const ratesFilePath = path.resolve(process.cwd(), 'src/config/rates.json');

// Function to get conversion rate from JSON file
export async function getConversionRate(assetId) {
  try {
    // Read rates from the JSON file
    const data = fs.readFileSync(ratesFilePath, 'utf8');
    const rates = JSON.parse(data);

    // Check if the assetId exists in the rates and return the rate for NGN
    if (!rates[assetId] || !rates[assetId]['ngn']) {
      throw new Error('Conversion rate not found');
    }

    return rates[assetId]['ngn'];
  } catch (error) {
    throw new Error('Failed to read or parse rates file: ' + error.message);
  }
}
