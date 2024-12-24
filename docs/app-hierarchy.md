# Application Hierarchy and Component Relationships

## Frontend Structure

```tree
current-status.html             # Main entry point of the application
├── scripts/                    # JavaScript modules and utilities
│   ├── main.js                # Core application logic
│   ├── modules/               # Modular JavaScript components
│   │   ├── right-sidebar.js   # Right sidebar specific functionality
│   │   ├── sidebar.js         # General sidebar management
│   │   ├── tasks.js          # Task management functionality
│   │   ├── taskModal.js      # Task modal dialog functionality
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
    ├── styles/                # Modular CSS organization
    │   ├── styles.css        # Main stylesheet
    │   ├── base/             # Base styling elements
    │   │   ├── layout.css    # Page structure and grid systems
    │   │   └── variables.css # Global CSS variables and theming
    │   ├── components/       # Reusable component styles
    │   │   ├── components.css      # Common component styles
    │   │   └── weather-calendar.css # Weather calendar specific styles
    │   └── modules/          # Feature-specific styles
    │       ├── metrics.css   # Sizing and spacing definitions
    │       ├── sidebar.css   # Sidebar-specific styles
    │       ├── tables.css    # Table component styling
    │       ├── tasks.css     # Task management styling
    │       └── todo.css      # Todo feature styling
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
   - Task management enhanced with modal dialog functionality

3. CSS Layer
   - Hierarchical styling system organized in `styles/` directory
   - Base styles for layout and variables
   - Component styles for reusable UI elements
   - Module-specific styles for feature implementations
   - Weather calendar component has dedicated styling

## Configuration and Examples

```tree
examples/                       # Example configurations
├── .env.example               # Environment variable template
└── tasksByDay.example.js      # Task configuration example
```

***Documentation***

```tree
docs/                          # Project documentation
├── app-hierarchy.md           # Application structure and relationships
├── app-structure.md           # Detailed application architecture
└── directory-structure.md     # File system organization
```

## Asset Management

```tree
images/                        # Image assets
└── interesting.jpg           # Image resource
```

This hierarchy demonstrates a modular, maintainable architecture with clear separation of concerns between presentation, logic, and styling. Each component has a specific role and integrates with others through well-defined interfaces. The styling system is organized into logical categories (base, components, modules) for better maintainability and scalability.
