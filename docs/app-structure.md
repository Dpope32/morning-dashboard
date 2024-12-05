# Application Structure Documentation

## Overview
This application appears to be a web-based interface with various components and styling modules. The application uses vanilla JavaScript with modular CSS organization.

## Core Files

### HTML
- `current-status.html`: Main HTML file that serves as the primary interface

### JavaScript Files
- `script.js`: Main JavaScript file containing core application logic
- `right-sidebar.js`: Handles functionality for the right sidebar component
- `sidebar.js`: Manages general sidebar behavior and interactions

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
- `interesting.jpg`: Image asset used in the application

## Architecture
The application follows a modular structure with:
1. Separated concerns between HTML, JavaScript, and CSS
2. Component-based organization for both JavaScript and CSS
3. Modular styling system with specific stylesheets for different purposes
4. Configuration management through environment variables
