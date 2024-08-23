// src/app/api/fetchAssets/route.js
export async function GET() {
  try {
    // API call with desired assets
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,solana,tron,binancecoin,usd-coin'
    );
    const data = await response.json();
    
    //Logging data to check its structure
    console.log('API Response:', data);

    // making sureww data is an array before processing
    if (Array.isArray(data)) {
      // Map data to include only the necessary fields
      const filteredAssets = data.map(asset => ({
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        image: asset.image, // Logo URL
      }));

      return new Response(JSON.stringify(filteredAssets), { status: 200 });
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    console.error('Error fetching assets:', error.message);
    return new Response(JSON.stringify({ message: 'Failed to fetch assets', error: error.message }), { status: 500 });
  }
}
