
# Comprehensive Development Prompt for Tender Management System (TMS)

## Project Overview

You are tasked with developing a Tender Management System (TMS) that will eventually be part of a larger enterprise portal. The system needs to be built with scalability in mind, allowing for future integration of additional applications while maintaining its independence as a standalone module.

### Key Technical Requirements
```typescript
interface TechnicalStack {
  frontend: {
    framework: "Angular 19+";
    styling: ["Angular Material", "Tailwind CSS"];
    stateManagement: "RxJS";
    buildTool: "Nx";
  };
  backend: {
    framework: "NestJS";
    language: "TypeScript";
    database: "MongoDB with Mongoose";
  };
  deployment: "Docker";
  architecture: "Monorepo with Clean Architecture";
}
```

## 1. Project Structure

```bash
tms-monorepo/
├── apps/
│   ├── frontend/                 # Angular application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/        # Core modules
│   │   │   │   ├── features/    # Feature modules
│   │   │   │   ├── shared/      # Shared modules
│   │   │   │   └── layouts/     # Layout components
│   │   │   └── assets/
│   │   └── package.json
│   └── backend/                  # NestJS application
│       ├── src/
│       │   ├── modules/
│       │   ├── schemas/
│       │   └── services/
│       └── package.json
├── libs/                        # Shared libraries
│   ├── shared/
│   │   ├── interfaces/
│   │   ├── constants/
│   │   └── utils/
│   └── ui-components/
└── docker/
    ├── frontend/
    ├── backend/
    └── docker-compose.yml
```

## 2. Core Data Models

### 2.1 Organization Model
```typescript
export interface Organization {
  id: string;
  name: string;
  address: string;
  country: Country;     // From predefined country list
  alias: string;        // Unique across system
  units: string[];      // Array of unit names
  createdAt: Date;
  updatedAt: Date;
}

// Validation Rules
const organizationRules = {
  alias: "Must be unique across all organizations",
  country: "Must be from predefined country list",
  units: "Array of strings, no additional metadata needed"
};
```

### 2.2 Tender Model
```typescript
export interface Tender {
  id: string;
  tenderId: string;            // Auto-generated sequence
  title: string;
  description: string;
  country: Country;           // Mandatory
  organization: Types.ObjectId; // Reference to Organization
  organizationUnit: string;    // Must exist in organization.units
  type: 'GEM' | 'EPROC';
  items: string[];            // Simple string array
  toc: 'PRIORITY' | 'CLEAR';
  status: TenderStatus;
  currentStage: TenderStage;
  dates: {
    creation: Date;          // With time (12-hour format)
    sendForQuote: Date;
    priceDiscussion: Date;
    quoteApproval: Date;
    submission: Date;
    reference: Date;         // submission + 2 business days
  };
  isDeleted: boolean;
  deletionDate: Date;        // Quote completion + 200 business days
}
```

## 3. Business Rules and Workflows

### 3.1 Date Calculations
```typescript
interface DateCalculationRules {
  businessDays: {
    weekends: ["Saturday", "Sunday"];
    holidays: "Indian Calendar Holidays";
    timeFormat: "12-hour";
  };

  calculations: {
    priceDiscussion: "creation + 5 business days";
    quoteApproval: "creation + 10 business days";
    submission: "creation + 15 business days";
    reference: "submission + 2 business days";
    softDelete: "quoteCompletion + 200 business days";
  };
}
```

### 3.2 Tender Workflow
```typescript
interface TenderWorkflow {
  stages: [
    "Creation",
    "Price Discussion",
    "Quote Approval",
    "Submit"
  ];

  rules: {
    dateOverride: "All calculated dates can be manually adjusted";
    countryFilter: "Organizations filtered by selected country";
    softDelete: "Automatic after 200 business days of quote completion";
  };
}
```

## 4. Frontend Implementation Requirements

### 4.1 Form Handling
```typescript
interface FormRequirements {
  dateFields: {
    type: "datetime-picker";
    format: "12-hour";
    validation: "All dates required";
  };

  countrySelection: {
    type: "dropdown";
    source: "Static country list";
    effect: "Filters organization list";
  };

  organizationSelection: {
    type: "dropdown";
    filtering: "Based on selected country";
    validation: "Must exist in selected country";
  };
}
```

### 4.2 Date Calculations
```typescript
interface DateCalculationFeatures {
  trigger: "On creation date selection";
  display: "Show all calculated dates immediately";
  editability: "All date fields should be editable";
  validation: "Ensure business day logic";
}
```

## 5. Backend Implementation Requirements

### 5.1 API Endpoints
```typescript
interface APIStructure {
  organization: {
    create: "POST /api/organizations";
    list: "GET /api/organizations";
    listByCountry: "GET /api/organizations?country=:code";
  };

  tender: {
    create: "POST /api/tenders";
    update: "PUT /api/tenders/:id";
    list: "GET /api/tenders";
    getById: "GET /api/tenders/:id";
  };
}
```

### 5.2 Background Jobs
```typescript
interface BackgroundJobs {
  tenderCleanup: {
    schedule: "Daily at midnight";
    action: "Soft delete eligible tenders";
    criteria: "200 business days after quote completion";
  };
}
```

## 6. Critical Implementation Details

### 6.1 Business Day Calculation
```typescript
const businessDayRules = {
  weekends: ["Saturday", "Sunday"],
  holidays: "Indian holidays list",
  calculation: `
    function addBusinessDays(date, days) {
      // Must skip weekends
      // Must skip Indian holidays
      // Must handle holiday lists updates
    }
  `
};
```

### 6.2 Organization Filtering
```typescript
const organizationFilterRules = {
  timing: "Server-side filtering",
  criteria: "Exact country match",
  response: "Only organizations from selected country"
};
```

## 7. Non-Functional Requirements

```typescript
interface NonFunctionalRequirements {
  performance: {
    apiResponse: "< 300ms",
    dateCalculations: "Client-side",
    filtering: "Server-side"
  };

  security: {
    authentication: "Required",
    authorization: "Role-based",
    dataValidation: "Both client and server side"
  };

  scalability: {
    design: "Ready for multi-app integration",
    database: "Indexed for performance",
    caching: "Where appropriate"
  };
}
```

## 8. Development Guidelines

```typescript
interface DevelopmentGuidelines {
  codeStyle: {
    frontend: "Angular style guide",
    backend: "NestJS best practices",
    naming: "Consistent across codebase"
  };

  testing: {
    unit: "Jest",
    coverage: "> 80%",
    e2e: "Critical workflows"
  };

  documentation: {
    api: "OpenAPI/Swagger",
    code: "JSDoc",
    commits: "Conventional commits"
  };
}
```

## 9. Deployment Requirements

```typescript
interface DeploymentRequirements {
  containerization: {
    tool: "Docker",
    services: ["Frontend", "Backend", "MongoDB"]
  };

  configuration: {
    environment: "Environment variables",
    secrets: "Secure storage required"
  };
}
```

## Important Notes

1. This system will be part of a larger portal in the future
2. All date calculations must consider Indian business days
3. The application must be built for scalability
4. Frontend and backend share interfaces through the libs folder
5. All calculated dates should be editable by users
6. Country-based organization filtering must be handled server-side
7. Soft deletion is automatic and permanent (no restore needed)
