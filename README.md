# Wallet App

A React TypeScript application that provides wallet functionality with multiple currency support, transactions history, and more.

## Features

- Mobile Number + OTP Verification (dummy OTP: 1234)
- Wallet Dashboard showing balances in multiple currencies (INR, USD, EUR, GBP)
- Add & Withdraw Funds functionality
- Currency Exchange between supported currencies
- Transaction History with filters (date, type, status)
- Export options for transaction history (PDF, Excel, CSV)
- Data persistence using LocalStorage

## Tech Stack

- React (functional components & hooks)
- TypeScript
- Tailwind CSS
- React Router DOM for navigation
- jsPDF, xlsx, and file-saver for export functionality
- LocalStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install the dependencies:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production

To build the app for production:

```bash
npm run build
```

This will create an optimized production build in the `build` folder.

## Usage

1. **Login**: Enter any 10-digit mobile number and use "1234" as the OTP
2. **Dashboard**: View your balances and add funds
3. **Currency Exchange**: Convert between supported currencies
4. **Withdraw**: Withdraw funds by providing bank details
5. **Transactions**: View all transactions with filtering and export options

## Project Structure

- `/src/components`: Reusable UI components
- `/src/contexts`: React context for wallet state management
- `/src/pages`: Main application pages
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions for currency conversion, formatting, and exports
