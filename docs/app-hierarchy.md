# Application Hierarchy and Component Relationships

## Frontend Structure
```
current-status.html             # Main entry point of the application
├── script.js                   # Core application logic
│   └── Manages overall app state and behavior
│
├── Sidebar System
│   ├── right-sidebar.js       # Right sidebar specific functionality
│   └── sidebar.js             # General sidebar management
│
└── Styling System
    ├── styles.css             # Main stylesheet
    │   └── Coordinates all styling modules
    │
    └── styles/                # Modular CSS organization
        ├── components.css     # Reusable UI component styles
        ├── layout.css         # Page structure and grid systems
        ├── metrics.css        # Sizing and spacing definitions
        ├── sidebar.css        # Sidebar-specific styles
        ├── tables.css         # Table component styling
        ├── todo.css          # Todo feature styling
        └── variables.css      # Global CSS variables and theming

```

## Component Dependencies
1. HTML Layer
   - `current-status.html` serves as the root container
   - Imports and coordinates all JavaScript and CSS resources

2. JavaScript Layer
   - `script.js` initializes core functionality
   - Sidebar modules (`right-sidebar.js` and `sidebar.js`) handle navigation and UI state
   - JavaScript components interact with DOM elements styled by corresponding CSS modules

3. CSS Layer
   - Hierarchical styling system with `styles.css` as the entry point
   - Modular organization with specific stylesheets for each concern
   - `variables.css` provides global theming and consistent styling values
   - Component-specific styles complement their JavaScript counterparts

## Configuration Layer
```
.env.example                    # Environment variable template
.gitignore                     # Version control configuration
master-morning.ps1             # Automation script
```

## Asset Management
```
interesting.jpg                # Image asset
```

This hierarchy demonstrates a modular, maintainable architecture with clear separation of concerns between presentation, logic, and styling. Each component has a specific role and integrates with others through well-defined interfaces.
