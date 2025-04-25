# TMS Frontend Application Context

## Project Overview

The frontend of the Tender Management System (TMS) is a standalone Angular application responsible for providing a user-friendly interface for managing tenders and organizations. This system will eventually be part of a larger enterprise portal but is designed to function independently.

## Technical Stack

```typescript
interface FrontendTechnicalStack {
  framework: "Angular 19+";
  styling: ["Angular Material", "Tailwind CSS"];
  stateManagement: "RxJS";
  architecture: "Standalone Angular application";
}
```

## Project Structure

```
tms-frontend/
├── src/
│   ├── app/
│   │   ├── core/            # Core services, guards, interceptors
│   │   │   ├── services/    # API services, auth service, etc.
│   │   │   └── types/       # Shared interfaces and types
│   │   ├── features/        # Feature modules (organizations, tenders)
│   │   │   ├── organization/
│   │   │   └── tender/
│   │   ├── shared/          # Shared components, directives, pipes
│   │   │   ├── components/
│   │   │   └── icons/
│   │   ├── layout/          # Layout components (header, sidebar, etc.)
│   │   └── auth/            # Authentication components
│   ├── assets/              # Static assets (images, fonts, etc.)
│   ├── environments/        # Environment configuration
│   └── styles/              # Global styles and theme
├── package.json
├── angular.json
├── tailwind.config.js
├── tsconfig.json
├── .eslintrc.json
└── README.md
```

## Core Data Models

### Types and Enums

```typescript
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER'
}

export enum TenderType {
  GEM = 'GEM',
  EPROC = 'EPROC'
}

export enum TenderTOC {
  PRIORITY = 'PRIORITY',
  CLEAR = 'CLEAR'
}

export enum TenderStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TenderStage {
  CREATION = 'CREATION',
  PRICE_DISCUSSION = 'PRICE_DISCUSSION',
  QUOTE_APPROVAL = 'QUOTE_APPROVAL',
  SUBMIT = 'SUBMIT'
}

export enum HolidayType {
  NATIONAL = 'NATIONAL',
  REGIONAL = 'REGIONAL',
  CUSTOM = 'CUSTOM'
}

export interface Country {
  code: string;
  name: string;
}
```

### Organization Model
```typescript
export interface Organization {
  _id?: string;
  name: string;
  address: string;
  country: string;      // Country code
  alias: string;        // Unique across system
  units: string[];      // Array of unit names
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
}

export interface OrganizationResponse {
  data: Organization[];
  total: number;
}

export interface OrganizationUnit {
  name: string;
}

export interface CreateOrganizationDto {
  name: string;
  address: string;
  country: string;
  alias: string;
  units: string[];
}

export interface UpdateOrganizationDto {
  name?: string;
  address?: string;
  country?: string;
  alias?: string;
  units?: string[];
  isActive?: boolean;
}
```

### Tender Model
```typescript
export interface TenderDates {
  creation: Date;
  sendForQuote: Date;
  priceDiscussion: Date;
  quoteApproval: Date;
  submission: Date;
  reference: Date;
}

export interface Tender {
  _id?: string;
  tenderId?: string;            // Auto-generated sequence
  title: string;
  description: string;
  status: TenderStatus;
  country: string;              // Country code
  organizationId: string;       // Reference to Organization ID
  organizationUnit: string;     // Must exist in organization.units
  type: TenderType;
  items: string[];              // Simple string array
  toc: TenderTOC;
  currentStage: TenderStage;
  dates: TenderDates;
  createdBy: string;            // User ID who created the tender
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletionDate?: Date;
}

export interface TenderResponse {
  data: Tender[];
  total: number;
}

export interface TenderStats {
  total: number;
  active: number;
  completed: number;
  growth: number;
  newOrganizations: number;
}

export interface CreateTenderDto {
  title: string;
  description: string;
  country: string;
  organizationId: string;
  organizationUnit: string;
  type: TenderType;
  items: string[];
  toc: TenderTOC;
  status: TenderStatus;
  currentStage: TenderStage;
  dates: TenderDates;
}

export interface UpdateTenderDto {
  title?: string;
  description?: string;
  country?: string;
  organizationId?: string;
  organizationUnit?: string;
  type?: TenderType;
  items?: string[];
  toc?: TenderTOC;
  status?: TenderStatus;
  currentStage?: TenderStage;
  dates?: Partial<TenderDates>;
}
```

### Holiday Model
```typescript
export interface Holiday {
  _id?: string;
  date: Date;
  name: string;
  type: HolidayType;
  isActive: boolean;
}

export interface CreateHolidayDto {
  date: Date;
  name: string;
  type: HolidayType;
}

export interface UpdateHolidayDto {
  date?: Date;
  name?: string;
  type?: HolidayType;
  isActive?: boolean;
}
```

### User and Auth Models
```typescript
export interface User {
  _id?: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  email: string;
  fullName: string;
  role?: UserRole;
}
```

## Frontend Implementation Requirements

### Form Handling
```typescript
interface FormRequirements {
  dateFields: {
    type: "datetime-picker";
    format: "12-hour";
    validation: "All dates required";
    appearance: "fill";  // Material appearance
    components: "mat-form-field with mat-datepicker";
  };

  countrySelection: {
    type: "dropdown";
    source: "Static country list";
    effect: "Filters organization list";
    appearance: "fill";  // Material appearance
    components: "mat-form-field with mat-select";
  };

  organizationSelection: {
    type: "dropdown";
    filtering: "Based on selected country";
    validation: "Must exist in selected country";
    appearance: "fill";  // Material appearance
    components: "mat-form-field with mat-select";
  };

  inputFields: {
    appearance: "fill";  // Material appearance
    validation: "Dynamic validation messages";
    components: "mat-form-field with mat-input";
  };

  buttons: {
    primary: "mat-raised-button with primary color";
    secondary: "mat-stroked-button with accent color";
    cancel: "mat-button with warn color";
  };
}
```

### Date Calculations
```typescript
interface DateCalculationFeatures {
  trigger: "On creation date selection";
  display: "Show all calculated dates immediately";
  editability: "All date fields should be editable";
  validation: "Ensure business day logic";
}
```

### Business Logic

#### Date Calculation Rules
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
  };
}

// Implementation - Business Day Calculation
export class DateCalculator {
  // Add business days to a date
  static addBusinessDays(date: Date, days: number): Date {
    let currentDate = new Date(date);
    let addedDays = 0;

    while (addedDays < days) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        // Skip weekends (0=Sunday, 6=Saturday)
        addedDays++;
      }
      // Would also check holiday list in actual implementation
    }

    return currentDate;
  }

  // Check if a date is a business day
  static isBusinessDay(date: Date): boolean {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not weekend
    // Would also check holiday list in actual implementation
  }

  // Calculate all related dates based on creation date
  static calculateTenderDates(creationDate: Date): TenderDates {
    return {
      creation: creationDate,
      priceDiscussion: this.addBusinessDays(creationDate, 5),
      quoteApproval: this.addBusinessDays(creationDate, 10),
      submission: this.addBusinessDays(creationDate, 15),
      sendForQuote: this.addBusinessDays(creationDate, 3),
      reference: this.addBusinessDays(this.addBusinessDays(creationDate, 15), 2) // submission + 2
    };
  }
}
```

#### Tender Workflow
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
  };
}
```

## API Integration

The frontend communicates with the backend through a RESTful API. Here are the key endpoints with payload details:

```typescript
interface APIEndpoints {
  auth: {
    login: {
      url: "POST /api/auth/login",
      payload: LoginDto,
      response: AuthResponse
    },
    register: {
      url: "POST /api/auth/register",
      payload: RegisterDto,
      response: AuthResponse
    },
    profile: {
      url: "GET /api/auth/profile",
      response: User
    }
  },

  organization: {
    create: {
      url: "POST /api/organizations",
      payload: CreateOrganizationDto,
      response: Organization
    },
    list: {
      url: "GET /api/organizations",
      queryParams: {
        search?: string,
        page?: number,
        limit?: number
      },
      response: OrganizationResponse
    },
    listByCountry: {
      url: "GET /api/organizations",
      queryParams: {
        country: string,
        search?: string,
        page?: number,
        limit?: number
      },
      response: OrganizationResponse
    },
    getById: {
      url: "GET /api/organizations/:id",
      params: { id: string },
      response: Organization
    },
    update: {
      url: "PUT /api/organizations/:id",
      params: { id: string },
      payload: UpdateOrganizationDto,
      response: Organization
    },
    delete: {
      url: "DELETE /api/organizations/:id",
      params: { id: string },
      response: Organization
    }
  },

  tender: {
    create: {
      url: "POST /api/tenders",
      payload: CreateTenderDto,
      response: Tender
    },
    update: {
      url: "PUT /api/tenders/:id",
      params: { id: string },
      payload: UpdateTenderDto,
      response: Tender
    },
    list: {
      url: "GET /api/tenders",
      queryParams: {
        search?: string,
        status?: TenderStatus,
        type?: TenderType,
        organization?: string,
        country?: string,
        page?: number,
        limit?: number
      },
      response: TenderResponse
    },
    getById: {
      url: "GET /api/tenders/:id",
      params: { id: string },
      response: Tender
    },
    delete: {
      url: "DELETE /api/tenders/:id",
      params: { id: string },
      response: Tender
    },
    getStats: {
      url: "GET /api/tenders/stats",
      response: TenderStats
    }
  },

  holidays: {
    create: {
      url: "POST /api/holidays",
      payload: CreateHolidayDto,
      response: Holiday
    },
    list: {
      url: "GET /api/holidays",
      response: Holiday[]
    },
    update: {
      url: "PUT /api/holidays/:id",
      params: { id: string },
      payload: UpdateHolidayDto,
      response: Holiday
    },
    delete: {
      url: "DELETE /api/holidays/:id",
      params: { id: string },
      response: Holiday
    }
  }
}
```

## UI Implementation and Styling

### Material and Tailwind Integration

```typescript
interface StylingGuidelines {
  layout: {
    container: "max-w-screen-xl mx-auto px-4",
    card: "bg-white rounded-lg shadow-md overflow-hidden",
    section: "py-6",
    grid: "grid grid-cols-12 gap-4"
  },

  components: {
    // Angular Material + Tailwind customizations
    buttons: {
      primary: "mat-raised-button color='primary' class='w-full md:w-auto px-6 py-2'",
      secondary: "mat-stroked-button color='accent' class='w-full md:w-auto px-6 py-2'",
      danger: "mat-raised-button color='warn' class='w-full md:w-auto px-6 py-2'"
    },

    forms: {
      field: "w-full mb-4",
      input: "mat-form-field appearance='fill' class='w-full'",
      label: "text-gray-700 text-sm font-medium mb-1",
      error: "text-red-500 text-xs mt-1"
    },

    tables: {
      container: "overflow-x-auto",
      table: "mat-table class='min-w-full divide-y divide-gray-200'",
      header: "bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
      row: "hover:bg-gray-50 transition-colors"
    },

    cards: {
      base: "bg-white overflow-hidden rounded-lg shadow-md",
      header: "bg-gray-50 px-4 py-5 border-b border-gray-200",
      body: "px-4 py-5",
      footer: "bg-gray-50 px-4 py-4"
    },

    dialogs: {
      title: "text-xl font-semibold text-gray-900",
      content: "my-4",
      actions: "flex justify-end gap-3"
    }
  },

  typography: {
    pageTitle: "text-2xl font-bold text-gray-900 mb-6",
    sectionTitle: "text-xl font-semibold text-gray-800 mb-4",
    cardTitle: "text-lg font-medium text-gray-900",
    bodyText: "text-base text-gray-700",
    smallText: "text-sm text-gray-500"
  },

  colors: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0"
    },
    accent: {
      main: "#ff4081",
      light: "#ff80ab",
      dark: "#c51162"
    },
    warn: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f"
    },
    gray: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      // ... more shades
      900: "#212121"
    }
  }
}
```

### Responsive Design
```typescript
interface ResponsiveDesignGuidelines {
  breakpoints: {
    xs: "0px",
    sm: "600px",
    md: "960px",
    lg: "1280px",
    xl: "1920px"
  },

  gridSystem: "Tailwind's grid system with 12 columns",

  containers: {
    maxWidth: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px"
    }
  },

  strategies: {
    tables: "Horizontal scroll on small screens",
    forms: "Stack fields vertically on small screens",
    navigation: "Collapse to hamburger menu on small screens",
    cards: "Full width on small screens, grid on larger screens"
  }
}
```

## Non-Functional Requirements

```typescript
interface NonFunctionalRequirements {
  performance: {
    dateCalculations: "Client-side",
    responsive: "Mobile and desktop compatible",
    lazyLoading: "Feature modules loaded on demand"
  };

  security: {
    authentication: "JWT-based",
    authorization: "Role-based UI components",
    dataValidation: "Client-side validation before submission",
    tokenStorage: "Secure browser storage"
  };

  scalability: {
    design: "Component-based for reusability",
    stateManagement: "RxJS for reactive state management",
    loadingIndicators: "For all async operations"
  };
}
```

## Development Guidelines

```typescript
interface DevelopmentGuidelines {
  codeStyle: {
    standard: "Angular style guide",
    naming: "Consistent BEM-based CSS naming",
    formatting: "Prettier with default Angular settings"
  };

  documentation: {
    components: "Use JSDoc for public methods and interfaces",
    commits: "Conventional commits"
  };

  patterns: {
    dataFetching: "Services with Observable pattern",
    forms: "Reactive forms with FormBuilder",
    stateManagement: "RxJS BehaviorSubject or NgRx where appropriate",
    errorHandling: "Catchable HTTP errors with user feedback",
    componentDesign: "Smart container / dumb presentational pattern"
  }
}
```

## Important Notes

1. The frontend uses Angular Material components with Tailwind CSS for styling and customization
2. All date calculations should be performed client-side using business day logic
3. All calculated dates should be editable by users
4. Country-based organization filtering is initiated by the frontend but processed server-side
5. The application uses reactive forms with comprehensive validation
6. Error handling should be consistent with appropriate user feedback
7. The application must be responsive and work on both desktop and mobile devices
8. Angular Material components should be customized with Tailwind utility classes for a unique look
9. Form fields should use the "fill" appearance style from Material but with custom colors
10. Actions should use proper color coding: primary (blue), accent (pink), warn/danger (red)