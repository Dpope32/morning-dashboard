# Application Hierarchy and Component Relationships

## Frontend Structure
```
current-status.html             # Main entry point of the application
├── scripts/                    # JavaScript modules and utilities
│   ├── main.js                # Core application logic
│   ├── modules/               # Modular JavaScript components
│   │   ├── right-sidebar.js   # Right sidebar specific functionality
│   │   ├── sidebar.js         # General sidebar management
│   │   ├── tasks.js          # Task management functionality
│   │   ├── tasksByDay.js     # Daily task organization
│   │   ├── env.js            # Environment configuration
│   │   ├── clock.js          # Clock functionality
│   │   ├── weather.js        # Weather information
│   │   ├── ping.js           # Network ping functionality
│   │   ├── cryptoPrices.js   # Cryptocurrency price tracking
│   │   ├── stockPrices.js    # Stock market price tracking
│   │   ├── marketStatus.js   # Market status monitoring
│   │   ├── networkStatus.js  # Network status monitoring
│   │   ├── dateGreeting.js   # Date-based greeting system
│   │   └── taskProgress.js   # Task progress tracking
│   └── utils/                 # Utility functions
│       ├── dom.js            # DOM manipulation utilities
│       └── format.js         # Data formatting utilities
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
   - Organized in `scripts/modules/` for better modularity
   - Core functionality split into specific module files
   - Utility functions in `scripts/utils/` for shared functionality
   - Each module handles specific features (sidebars, tasks, weather, etc.)

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
