// netlify/functions/get-firmware.js

// --- ⚙️ CONFIGURATION ---
const FIRMWARE_OWNER = 'albal'; // The GitHub username or organization
const FIRMWARE_REPO = 'keybot'; // The name of your firmware repository

exports.handler = async function(event, context) {
  try {
    // 1. Get the URL for the latest firmware release asset from the GitHub API
    const releaseApiUrl = `https://api.github.com/repos/${FIRMWARE_OWNER}/${FIRMWARE_REPO}/releases/latest`;
    
    const releaseResponse = await fetch(releaseApiUrl);
    const releaseData = await releaseResponse.json();
    
    // Find the asset that ends in .bin (or whatever your firmware extension is)
    const firmwareAsset = releaseData.assets.find(asset => asset.name.endsWith('keybot_merged.bin'));
    
    if (!firmwareAsset) {
      return { statusCode: 404, body: JSON.stringify({ error: 'No .bin file found in the latest release.' }) };
    }
    
    const firmwareUrl = firmwareAsset.browser_download_url;

    // 2. Fetch the actual firmware binary file
    const firmwareFileResponse = await fetch(firmwareUrl);
    
    if (!firmwareFileResponse.ok) {
        return { statusCode: 502, body: JSON.stringify({ error: 'Failed to download firmware file from GitHub.' }) };
    }

    const firmwareBuffer = await firmwareFileResponse.arrayBuffer();

    // 3. Return the file with the correct headers
    // Binary data must be base64 encoded to be sent in the response body.
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // This is the crucial CORS header
        'Content-Type': 'application/octet-stream',
      },
      body: Buffer.from(firmwareBuffer).toString('base64'),
      isBase64Encoded: true, // Tell Netlify to decode the body before sending
    };
    
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal error occurred.' }),
    };
  }
};
