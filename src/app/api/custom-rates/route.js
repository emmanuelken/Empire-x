import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.resolve('src/config/rates.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const rates = JSON.parse(fileContent);

    console.log('Fetched Rates:', rates); // Log the fetched rates

    return new Response(JSON.stringify(rates), { status: 200 });
  } catch (error) {
    console.error('Error fetching custom rates:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch rates', error: error.message }), { status: 500 });
  }
}
