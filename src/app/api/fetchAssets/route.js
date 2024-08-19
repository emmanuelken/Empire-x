//src/app/api/fetchAssets/route.js
export async function GET() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
      const data = await response.json();
  
      // Define the assets you want
      const desiredAssets = [
        'bitcoin',
        'ethereum',
        'tether',
        'solana',
        'tron',
        'binancecoin',
        'usd-coin'
      ];
  
      // Filter assets
      const filteredAssets = data.filter(asset => desiredAssets.includes(asset.id));
  
      return new Response(JSON.stringify(filteredAssets), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Failed to fetch assets', error: error.message }), { status: 500 });
    }
  }
  