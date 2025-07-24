# Government Data Generator

An AI-powered mock data generator specifically designed for government and municipal use cases. Generate realistic test data for civic tech projects, government applications, and municipal ERP systems.

## Features

- **12+ Government Data Types**: Citizens, employees, permits, licenses, contracts, assets, budget records, and more
- **Realistic Government Data**: Proper formatting, reference numbers, and field structures reflecting actual municipal operations
- **Flexible Field Selection**: Choose specific fields to include in your generated data
- **Multiple Export Formats**: Download data in JSON or CSV format
- **Preview Functionality**: See a sample of your data before generating the full dataset
- **Professional UI**: Clean, government-appropriate interface with loading states and notifications

## Data Types

### Core Government Data
- **Citizens**: Personal information, addresses, voter registration status
- **Government Employees**: Department assignments, clearance levels, contact information
- **Public Services**: Department services, budgets, contact details, hours of operation
- **Government Contracts**: Vendor agreements, contract values, status tracking
- **Municipal Assets**: Property tracking, asset conditions, purchase values
- **Budget Records**: Fiscal year budgets, spending tracking, department allocations

### Permits & Licensing
- **Permits & Applications**: Building permits, zoning permits, application tracking
- **Business Licenses**: License types, business information, renewal dates

### ERP & Operations
- **Purchase Orders**: Procurement tracking, vendor management, approval workflows
- **Invoices & Payments**: Financial transactions, payment status, department billing
- **Inventory Management**: Asset tracking, supplier information, reorder levels
- **Work Orders**: Maintenance requests, assignment tracking, cost estimates

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/government-data-generator.git
cd government-data-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Usage

1. **Select Data Type**: Choose from 12+ government-specific data types
2. **Configure Records**: Set the number of records to generate (1-1000)
3. **Choose Fields**: Select which fields to include in your dataset
4. **Preview or Generate**: Preview a sample or generate the full dataset
5. **Download**: Export your data in JSON or CSV format

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and development server
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ConfigPanel.tsx # Data configuration panel
│   ├── DataPreview.tsx # Data preview and download
│   └── DataGenerator.tsx # Mock data generation logic
├── styles/             # CSS and styling
│   └── globals.css     # Global styles and Tailwind config
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool generates mock data for testing and development purposes only. Do not use for collecting real personal information or sensitive government data. Always comply with data protection regulations and privacy laws in your jurisdiction.