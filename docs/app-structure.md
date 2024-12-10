# Application Structure Documentation

## Overview
This application appears to be a web-based interface with various components and styling modules. The application uses vanilla JavaScript with modular organization for both JavaScript and CSS components.

## Core Files

### HTML
- `current-status.html`: Main HTML file that serves as the primary interface

### JavaScript Organization
The JavaScript files are organized in the `scripts` directory:

#### Main Script
- `scripts/main.js`: Main JavaScript file coordinating core application logic

#### Modules (`scripts/modules/`)
- `sidebar.js`: Manages general sidebar behavior and interactions
- `right-sidebar.js`: Handles functionality for the right sidebar component
- `tasks.js`: Manages task-related functionality
- `tasksByDay.js`: Handles daily task organization
- `env.js`: Environment configuration management
- `clock.js`: Clock display functionality
- `weather.js`: Weather information handling
- `ping.js`: Network ping functionality
- `cryptoPrices.js`: Cryptocurrency price tracking
- `stockPrices.js`: Stock market price monitoring
- `marketStatus.js`: Market status tracking
- `networkStatus.js`: Network status monitoring
- `dateGreeting.js`: Date-based greeting system
- `taskProgress.js`: Task progress tracking

#### Utilities (`scripts/utils/`)
- `dom.js`: DOM manipulation utilities
- `format.js`: Data formatting utilities

### Style Organization
The project uses a modular CSS approach with styles organized into specific concerns:

- `styles.css`: Main stylesheet that may import or coordinate other CSS modules
- `styles/components.css`: Styles for reusable UI components
- `styles/layout.css`: Core layout and structural styling
- `styles/metrics.css`: Contains measurements, spacing, and sizing variables
- `styles/sidebar.css`: Specific styles for sidebar elements
- `styles/tables.css`: Styling for table components
- `styles/todo.css`: Styles related to todo functionality
- `styles/variables.css`: Global CSS variables and theming

### Configuration Files
- `.env.example`: Template for environment variables
- `.gitignore`: Specifies which files Git should ignore
- `master-morning.ps1`: PowerShell script, likely for automation or setup tasks

### Assets
- `images/interesting.jpg`: Image asset used in the application

## Architecture
The application follows a modular structure with:
1. Separated concerns between HTML, JavaScript, and CSS
2. Component-based organization for both JavaScript and CSS
3. Modular JavaScript system with specific functionality in dedicated modules
4. Modular styling system with specific stylesheets for different purposes
5. Configuration management through environment variables
