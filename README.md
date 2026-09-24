# Computational Physics Toolkit (CPT)

**Computational Physics Toolkit (CPT)** is a web-based simulation workspace designed to make computational physics more accessible to students, teachers, lecturers, and physics learners.

CPT provides interactive numerical simulations, visualization tools, simulation data, statistics, and export capabilities through a modern Blazor WebAssembly interface backed by an ASP.NET Core API.

## Live Application

**CPT v1:**
https://sonofgrace2203.github.io/CPT/

**Live API:**
https://cptapi-vu70.onrender.com/

---

## Overview

Computational Physics Toolkit was created as a personal computational physics project with a focus on making numerical methods and physical models easier to explore interactively.

The project combines:

* Physics simulations
* Numerical computation
* Interactive visualization
* Simulation configuration
* User accounts
* Authentication and authorization
* Simulation history
* Data analysis
* Export functionality
* Administrative management

CPT is designed to provide a workspace where users can move from **physical parameters → numerical simulation → visualization → data analysis** without needing to build the computational environment themselves.

---

# CPT v1

The first version of CPT establishes the core platform architecture and the first working simulation environment.

### V1 includes

* Public landing page
* Demo simulation experience
* User registration
* User login
* JWT-based authentication
* User dashboard
* Simulation workspace
* Physics module catalogue
* Heat Equation simulation
* Simulation progress tracking
* Simulation cancellation
* Simulation results
* Temperature visualization
* Surface visualization
* Contour visualization
* Line visualization
* Animation playback
* Simulation data table
* Simulation statistics
* CSV export
* PDF export
* PNG visualization export
* User settings
* Help / Quick Start
* About section
* SuperAdmin account
* Admin dashboard
* User management
* Physics module management
* Individual user simulation data
* Production PostgreSQL database
* Production API
* GitHub Pages frontend deployment

---

# Physics Module Catalogue

CPT v1 contains the initial physics module catalogue:

* Diffusion Equation
* Electromagnetic Field
* EM Wave Propagation
* Heat Equation (1D)
* Laplace Equation (1D)
* Magnetic Field
* Monte Carlo Simulation
* N-Body Simulation
* Pendulum
* Projectile Motion
* Random Walk
* Schrödinger Equation (1D)
* Spring Mass
* Wave Equation (1D)

The module catalogue is stored in the backend database and exposed through the API.

The first fully implemented computational module in CPT v1 is the **2D Heat Equation** simulation.

---

# 2D Heat Equation

The 2D Heat Equation module demonstrates numerical heat diffusion across a two-dimensional grid.

The simulation uses a finite-difference numerical approach to approximate the evolution of temperature over time.

### Configurable parameters include

* Thermal diffusivity
* Final simulation time
* Time step
* Grid dimensions
* Spatial bounds
* Initial temperature
* Boundary temperature

The current default configuration includes:

```text
Diffusivity: 0.21
Final Time: 1.0
Time Step: 0.0005
Grid: 20 × 20
Bounds: -1 to 1
Initial Temperature: 100
Boundary Temperature: 0
```

The backend processes simulations asynchronously through a simulation queue and worker architecture.

---

# Simulation Workflow

A typical simulation follows this flow:

```text
Configure Simulation
        ↓
Create Simulation
        ↓
Queue Simulation
        ↓
Background Worker
        ↓
Numerical Solver
        ↓
Progress Updates
        ↓
Simulation Completed
        ↓
Results
        ↓
Visualization / Data / Export
```

The simulation interface provides progress information and console output while the computation is running.

After completion, users can explore the resulting data through several visualization modes.

---

# Result Visualization

CPT v1 provides multiple ways to inspect simulation results.

### Temperature Map

The temperature distribution can be displayed using different visualization options, including:

* Thermal
* Viridis
* Grayscale

Additional visualization controls include:

* Colour bar
* Grid
* Aspect ratio
* Time-step selection

### Other visualization modes

* Surface
* Contour
* Line
* Animation

The animation interface allows users to move through simulation time steps and inspect how the physical system evolves.

---

# Simulation Data

Completed simulations provide access to the underlying numerical data.

The data interface includes:

### Data Table

Numerical simulation values can be inspected directly in tabular form.

### Statistics

Simulation statistics provide a summarized view of the numerical result.

### Export

CPT v1 supports:

* CSV export
* PDF export
* PNG export

This allows simulation results to be retained for further analysis, documentation, teaching, or presentation.

---

# Authentication

CPT uses ASP.NET Core Identity together with JWT authentication.

The authentication architecture includes:

* User registration
* User login
* Password hashing through ASP.NET Core Identity
* JWT token generation
* JWT token validation
* Role-based authorization
* Authenticated user sessions
* Logout
* Protected API endpoints

The frontend stores and manages the authentication session through dedicated authentication services.

---

# User Accounts

Each registered CPT user has an individual account.

User-specific information and simulation activity are associated with the authenticated user rather than being stored as one shared simulation workspace.

This allows the platform to support multiple users while keeping their simulation activity separated.

---

# Administration

CPT v1 includes a SuperAdmin system.

The SuperAdmin can access administrative functionality that is not available to ordinary users.

### Administrative capabilities include

* Viewing registered users
* Inspecting relevant user activity
* Managing physics modules
* Accessing administrative dashboard information
* Viewing platform activity

The SuperAdmin role is seeded by the backend during application startup.

SuperAdmin credentials are supplied through environment configuration and are **not stored in the source code**.

---

# Architecture

CPT uses a separated frontend/backend architecture.

```text
┌──────────────────────────────────────────┐
│              CPT Frontend                │
│        Blazor WebAssembly (.NET 10)      │
│                                          │
│  UI / Navigation / Visualization / Auth  │
└────────────────────┬─────────────────────┘
                     │ HTTPS / REST API
                     ▼
┌──────────────────────────────────────────┐
│               CPT API                    │
│          ASP.NET Core (.NET 10)          │
│                                          │
│ Controllers / Services / Auth / Physics  │
│ Simulation Queue / Background Worker     │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│           Supabase PostgreSQL            │
│                                          │
│ Users / Roles / Simulations / Modules    │
│ Simulation Data / Application Records    │
└──────────────────────────────────────────┘
```

---

# Frontend

The frontend is built with:

* C#
* .NET 10
* Blazor WebAssembly
* Razor Components
* HTML
* CSS
* JavaScript
* Plotly.Blazor

The frontend is deployed as a static WebAssembly application through GitHub Pages.

### Repository

`Sonofgrace2203/CPT`

### Production URL

https://sonofgrace2203.github.io/CPT/

---

# Backend

The backend is built with:

* C#
* .NET 10
* ASP.NET Core Web API
* Entity Framework Core
* ASP.NET Core Identity
* JWT Bearer Authentication
* PostgreSQL
* Npgsql
* Swagger / OpenAPI
* Background hosted services

### Backend repository

`Sonofgrace2203/cptapi`

### Production API

https://cptapi-vu70.onrender.com/

---

# Database

CPT uses PostgreSQL through Supabase.

Entity Framework Core manages the database schema and migrations.

The production database contains the CPT application data, including:

* Users
* Roles
* Physics modules
* Simulation records
* User-related application data

The production API connects to Supabase through a Supabase pooler connection.

Database credentials are supplied through environment variables and are not committed to GitHub.

---

# Backend Services

The API uses a service-oriented structure for application functionality.

Important services include:

* `PhysicsModuleService`
* `SimulationService`
* `SimulationParameterService`
* `SimulationResultService`
* `HeatEquationService`
* `DashboardService`
* `AdminUserService`
* `AdminDashboardService`
* `UserSettingsService`
* `EmailService`

The Heat Equation computation is separated into dedicated components including:

* `HeatEquationService`
* `IHeatEquationSolver`
* `HeatEquationSolver`
* `HeatEquationProgressStore`
* `HeatEquationSimulationQueue`
* `HeatEquationSimulationWorker`
* `HeatEquationCancellationStore`

This separation keeps the numerical solver independent from the API and simulation orchestration layer.

---

# API

The frontend communicates with the backend through HTTP services.

For example, the physics module catalogue is available through:

```text
GET /api/PhysicsModules
```

Production:

```text
https://cptapi-vu70.onrender.com/api/PhysicsModules
```

The API returns the physics modules stored in the production PostgreSQL database.

---

# Environment Configuration

CPT separates local development configuration from production configuration.

The frontend uses:

```text
wwwroot/appsettings.json
```

for the production API URL:

```json
{
  "ApiBaseUrl": "https://cptapi-vu70.onrender.com/"
}
```

Local development overrides this through:

```text
wwwroot/appsettings.Development.json
```

with:

```json
{
  "ApiBaseUrl": "http://localhost:5121/"
}
```

Therefore:

```text
Local Development
CPT Frontend
     ↓
http://localhost:5121/
     ↓
Local CPT API
```

while production uses:

```text
GitHub Pages
     ↓
https://cptapi-vu70.onrender.com/
     ↓
Supabase PostgreSQL
```

This allows development to continue locally without accidentally using the production API.

---

# Backend Secrets

Sensitive backend configuration is provided through environment variables.

Examples include:

```text
CPT_SUPERADMIN_EMAIL
CPT_SUPERADMIN_PASSWORD
```

JWT secrets and email credentials are also supplied through environment configuration.

Sensitive credentials should never be committed to GitHub.

---

# Email

CPT includes an email service implemented with SMTP.

The current implementation uses Gmail SMTP:

```text
smtp.gmail.com
Port: 587
SSL/TLS: Enabled
```

The email address and application password are supplied through configuration rather than being hard-coded into the application.

---

# Deployment

## Frontend Deployment

The frontend is deployed using:

* GitHub
* GitHub Actions
* GitHub Pages

The deployment workflow is located at:

```text
.github/workflows/deploy.yml
```

The workflow:

1. Checks out the repository.
2. Installs .NET 10.
3. Restores dependencies.
4. Publishes the Blazor WebAssembly application.
5. Configures the GitHub Pages `/CPT/` base path.
6. Creates the `.nojekyll` file.
7. Uploads the generated WebAssembly application as a Pages artifact.
8. Deploys the artifact to GitHub Pages.

The local `index.html` can therefore continue using:

```html
<base href="/" />
```

while the deployment workflow changes the published version to:

```html
<base href="/CPT/" />
```

This keeps local development and GitHub Pages deployment compatible.

---

# Backend Deployment

The backend is containerized with Docker and deployed to Render.

The production backend runs in the Render environment and connects to the Supabase PostgreSQL database.

Production environment variables are configured directly in Render.

The API is available at:

https://cptapi-vu70.onrender.com/

---

# Local Development

## Requirements

To work on CPT locally, install:

* .NET 10 SDK
* Git
* PostgreSQL or the configured local database
* A code editor such as Visual Studio Code or JetBrains Rider

---

## Running the Backend

Navigate to the API project:

```bash
cd cptapi
```

The backend requires the appropriate local environment variables, including the SuperAdmin credentials.

Then run:

```bash
dotnet watch run
```

The API will be available through the configured local development port.

---

## Running the Frontend

Navigate to the frontend:

```bash
cd cpt
```

Then run:

```bash
dotnet watch
```

or run the project through your preferred .NET development environment.

During local development, the frontend uses:

```text
http://localhost:5121/
```

as its API base URL.

---

# Project Structure

## Frontend

```text
cpt/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── Components/
├── Models/
├── Services/
├── Properties/
├── wwwroot/
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── css/
│   ├── icons/
│   ├── js/
│   └── ...
├── App.razor
├── Program.cs
├── _Imports.razor
├── cpt.csproj
└── .gitignore
```

## Backend

```text
cptapi/
├── Constants/
├── Controllers/
├── Data/
├── Dtos/
├── Migrations/
├── Models/
├── Physics/
├── Services/
├── Program.cs
├── appsettings.json
├── cptapi.csproj
├── Dockerfile
└── .gitignore
```

---

# Development Principles

CPT is being developed around a few core principles:

### Physics first

Numerical models and physical meaning should remain central to the platform.

### Interactive learning

Users should be able to change parameters and observe how the physical system responds.

### Visualization

Numerical output should be presented visually as well as numerically.

### Separation of concerns

The frontend, API, database, numerical solvers, simulation orchestration, and authentication systems are separated into appropriate components.

### Extensibility

The physics module catalogue is designed so additional computational physics modules can be added over time without rebuilding the entire application architecture.

---

# Current V1 Status

CPT V1 is currently deployed and operational as a live web application.

### Production stack

```text
Frontend
Blazor WebAssembly
.NET 10
      │
      ▼
GitHub Pages
      │
      ▼
ASP.NET Core Web API
.NET 10
      │
      ▼
Render
      │
      ▼
Entity Framework Core
      │
      ▼
Supabase PostgreSQL
```

---

# Future Development

CPT is structured to allow additional physics and computational modules to be introduced progressively.

Potential future development areas include:

* Additional numerical physics modules
* More simulation visualizations
* Expanded simulation analysis
* Additional export formats
* Improved simulation history
* More user workspace functionality
* Expanded administrative tools
* Additional educational resources
* Performance improvements for larger simulations

Future modules can be added to the existing physics-module architecture without changing the fundamental frontend/backend deployment model.

---

# Author

**Mustapha Mojeed Olabode**

Physics graduate and software developer interested in:

* Computational Physics
* Scientific Computing
* Numerical Methods
* Simulation
* Software Development
* Interactive Physics Education

GitHub:
https://github.com/Sonofgrace2203

---

# License

This project is currently maintained as a personal project.

License and reuse terms may be added as the project develops.
