# Gym Finder Setup Guide

This guide will help you set up the Google Maps API for the Gym Finder feature.

## Google Maps API Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a project" at the top of the page
4. Click "New Project"
5. Enter a project name (e.g., "FlowSports Gym Finder")
6. Click "Create"

### 2. Enable the Maps JavaScript API

1. In the Google Cloud Console, go to the [APIs & Services Dashboard](https://console.cloud.google.com/apis/dashboard)
2. Click "+ ENABLE APIS AND SERVICES" at the top
3. Search for "Maps JavaScript API"
4. Click on "Maps JavaScript API"
5. Click "Enable"

### 3. Create an API Key

1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "+ CREATE CREDENTIALS" at the top
3. Select "API key"
4. Your API key will be created and displayed
5. **Important**: Click "RESTRICT KEY" to secure your API key

### 4. Restrict Your API Key (Recommended)

#### Application Restrictions
- For development: Select "HTTP referrers (web sites)"
  - Add: `http://localhost:3000/*`
  - Add: `http://127.0.0.1:3000/*`
- For production: Add your production domain(s)
  - Example: `https://yourdomain.com/*`

#### API Restrictions
- Select "Restrict key"
- Check "Maps JavaScript API"
- Click "Save"

### 5. Add API Key to Your Project

1. Open your `.env` file in the root of your project
2. Add the following line with your API key:

```env
NUXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

3. Save the file

### 6. Update Runtime Config (Already Done)

The `nuxt.config.ts` should already include:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  },
})
```

If it doesn't, add this configuration.

### 7. Enable Billing (Required for Production)

Google Maps requires billing to be enabled, but they provide $200 of free usage per month.

1. Go to [Billing](https://console.cloud.google.com/billing) in Google Cloud Console
2. Click "Link a billing account" or "Create billing account"
3. Follow the prompts to add your payment information
4. Link the billing account to your project

**Note**: With the free $200 monthly credit, you can make approximately:
- 28,000 map loads per month
- Or many more API calls for other services

### 8. Restart Your Development Server

After adding the API key to your `.env` file:

```bash
pnpm dev
```

## Using the Gym Finder

### Access the Features

1. **View Gyms**: Navigate to `/gym-finder`
   - See all gyms on an interactive map
   - Click on map markers to see gym details
   - Click on gyms in the sidebar to view quick info
   - Click "View Details" to see the full gym page

2. **Manage Gyms**: Navigate to `/gym-finder/admin`
   - Add new gyms
   - Edit existing gyms
   - Delete gyms
   - Add schedule, pricing, images, instructors, and amenities

3. **View Gym Details**: Navigate to `/gym-finder/[gym-id]`
   - See full gym information
   - View image gallery
   - See schedule and pricing
   - Get directions to the gym

### Adding Your First Gym

1. Go to `/gym-finder/admin`
2. Click "Add Gym"
3. Fill in the required fields:
   - **Name**: The gym's name
   - **Address**: Full street address
   - **Coordinates**: Latitude and longitude
     - Use [latlong.net](https://www.latlong.net/) to find coordinates
     - Enter the address and copy the coordinates
4. Optional: Add contact info, description, schedule, pricing, images, instructors, and amenities
5. Click "Create Gym"

### Finding Coordinates

To get latitude and longitude for a gym:

1. Go to [https://www.latlong.net/](https://www.latlong.net/)
2. Enter the gym's address
3. Click "Find"
4. Copy the Latitude and Longitude values
5. Paste them into the admin form

Alternative method using Google Maps:

1. Open [Google Maps](https://maps.google.com)
2. Right-click on the gym's location
3. Click the coordinates at the top of the menu
4. The coordinates will be copied to your clipboard

## Data Storage

Currently, the gyms are stored in an **in-memory database**, which means:
- Data will be lost when the server restarts
- This is only suitable for development

### For Production

You should connect to a real database. Here are your options:

#### Option 1: Use Vercel KV (Redis)
```bash
pnpm add @vercel/kv
```

#### Option 2: Use MongoDB
```bash
pnpm add mongodb
```

#### Option 3: Use PostgreSQL
```bash
pnpm add @vercel/postgres
# or
pnpm add pg
```

Update the `/server/db/gyms.ts` file to use your chosen database instead of the in-memory array.

## Troubleshooting

### Map Not Loading

1. **Check API Key**: Make sure your API key is correctly added to `.env`
2. **Check Browser Console**: Open developer tools and look for error messages
3. **Verify API is Enabled**: Ensure "Maps JavaScript API" is enabled in Google Cloud Console
4. **Check Billing**: Make sure billing is enabled for your Google Cloud project
5. **Restart Server**: After adding the API key, restart your development server

### "Google Maps API key is not configured" Error

This means the API key is not being read from your `.env` file:

1. Make sure your `.env` file is in the root of your project
2. Check that the variable is named exactly: `NUXT_PUBLIC_GOOGLE_MAPS_API_KEY`
3. Restart your development server

### Pins Not Showing

1. **Check Coordinates**: Make sure latitude and longitude are correct
2. **Check Data**: Ensure gyms are being fetched from the API
3. **Check Browser Console**: Look for JavaScript errors

### TypeScript Errors

If you see TypeScript errors related to `google.maps`, you may need to install type definitions:

```bash
pnpm add -D @types/google.maps
```

## Features Summary

### Main Gym Finder Page (`/gym-finder`)
- Interactive Google Map with custom pins
- Sidebar list of all gyms
- Click on pins or list items to see quick info
- Responsive design

### Individual Gym Page (`/gym-finder/[id]`)
- Full gym details
- Image gallery
- Schedule and pricing information
- Instructors and amenities
- Contact information
- Embedded map showing gym location
- "Get Directions" link to Google Maps

### Admin Page (`/gym-finder/admin`)
- Add new gyms
- Edit existing gyms
- Delete gyms
- Manage all gym information:
  - Basic info (name, address, location)
  - Contact details
  - Schedule
  - Pricing
  - Images
  - Instructors
  - Amenities

## Styling

The Gym Finder uses your existing design system:
- **Electric Blue** (#1B8CFF) - Primary color for interactive elements
- **Hyper Lime** (#C6FF1E) - Accent color
- **Deep Navy** (#0A1A2F) - Background
- **Ice White** (#FFFFFF) - Text
- Tailwind CSS for styling
- Poppins font for headings
- Satoshi font for body text

## API Endpoints

The following API endpoints are available:

- `GET /api/gyms` - Get all gyms
- `POST /api/gyms` - Create a new gym
- `GET /api/gyms/:id` - Get a specific gym
- `PUT /api/gyms/:id` - Update a gym
- `DELETE /api/gyms/:id` - Delete a gym

## Next Steps

1. Get your Google Maps API key
2. Add it to your `.env` file
3. Visit `/gym-finder/admin` to add your first gym
4. View your gyms at `/gym-finder`

For any issues or questions, check the troubleshooting section above.
