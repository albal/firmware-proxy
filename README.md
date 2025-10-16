# Firmware Proxy

A Netlify serverless function that proxies firmware downloads from GitHub releases with CORS support. This project enables web applications to download firmware binaries directly from GitHub releases without CORS restrictions.

## Features

- **CORS-Enabled Downloads**: Adds necessary CORS headers to allow web applications to download firmware binaries
- **Automatic Latest Release**: Automatically fetches the latest firmware release from the configured GitHub repository
- **Serverless Architecture**: Runs as a Netlify function, no server maintenance required
- **Binary File Support**: Properly handles binary firmware files with base64 encoding

## How It Works

The proxy function:
1. Fetches the latest release information from the configured GitHub repository
2. Locates the firmware binary file (`.bin` extension) in the release assets
3. Downloads the firmware file from GitHub
4. Returns the file with appropriate CORS headers and content type

This solves the common problem where web applications cannot directly download files from GitHub releases due to CORS policy restrictions.

## Deployment

### Deploy to Netlify

1. Fork this repository
2. Connect your forked repository to Netlify
3. Configure the environment (see Configuration section below)
4. Deploy!

Netlify will automatically detect the `netlify/functions` directory and deploy the serverless function.

### Configuration

Edit the configuration variables in `netlify/functions/get-firmware.js`:

```javascript
const FIRMWARE_OWNER = 'albal'; // The GitHub username or organization
const FIRMWARE_REPO = 'keybot'; // The name of your firmware repository
```

Update these values to point to your own firmware repository:
- `FIRMWARE_OWNER`: Your GitHub username or organization name
- `FIRMWARE_REPO`: The name of the repository containing firmware releases

The function looks for firmware files with the name pattern `*keybot_merged.bin`. If your firmware file has a different naming pattern, update line 16:

```javascript
const firmwareAsset = releaseData.assets.find(asset => asset.name.endsWith('keybot_merged.bin'));
```

## Usage

Once deployed, your Netlify function will be available at:

```
https://your-site-name.netlify.app/.netlify/functions/get-firmware
```

You can make GET requests to this endpoint from any web application:

```javascript
// Example: Downloading firmware from a web application
fetch('https://your-site-name.netlify.app/.netlify/functions/get-firmware')
  .then(response => response.arrayBuffer())
  .then(data => {
    // Process the firmware binary data
    console.log('Firmware downloaded:', data.byteLength, 'bytes');
  })
  .catch(error => console.error('Download failed:', error));
```

## API Response

### Success Response (200)

- **Headers**:
  - `Access-Control-Allow-Origin: *`
  - `Content-Type: application/octet-stream`
- **Body**: Binary firmware file (base64 encoded)

### Error Responses

- **404**: No firmware file found in the latest release
- **502**: Failed to download firmware from GitHub
- **500**: Internal server error

## Use Cases

- **Web-based firmware updaters**: Enable browser-based firmware update tools
- **IoT device configuration portals**: Provide firmware downloads through web interfaces
- **Documentation sites**: Allow users to download firmware directly from docs
- **Progressive Web Apps**: Support offline-capable firmware management

## Requirements

- GitHub repository with releases containing firmware `.bin` files
- Netlify account (free tier works fine)

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Al West

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
