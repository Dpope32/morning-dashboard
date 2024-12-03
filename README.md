# Morning Dashboard

A personalized morning dashboard that displays weather, crypto prices, stock portfolio, and sets up your development environment.

## Features

- Automated development environment setup
- Weather information display
- Crypto portfolio tracking
- Stock portfolio monitoring
- Market status updates
- Customizable greeting based on time of day

## Prerequisites

- Windows 10
- PowerShell
- Brave Browser
- Cursor Editor
- Dual monitor setup (1920x1080 each)

## Setup Instructions

1. Clone this repository:
```bash
git clone https://github.com/yourusername/morning-dashboard.git
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Get your API keys:
   - Weather API key from [WeatherAPI](https://www.weatherapi.com/)
   - Finnhub API key from [Finnhub](https://finnhub.io/)

4. Update the `.env` file with your:
   - API keys
   - ZIP code
   - Name
   - Portfolio holdings

5. Run the setup:
```powershell
.\master-morning.ps1
```

## Security Note

Never commit your `.env` file or any files containing personal data or API keys. The `.gitignore` file is set up to prevent this, but always verify before committing.

## License

MIT License - feel free to modify and use as you wish!
