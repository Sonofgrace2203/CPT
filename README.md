# Computational Physics Toolkit (CPT)

**Computational Physics Toolkit (CPT)** is a web-based simulation workspace designed to make computational physics more accessible to students, teachers, lecturers, and physics learners.

CPT provides interactive numerical simulations, visualization tools, simulation data, statistics, and export capabilities through a Blazor WebAssembly interface backed by an ASP.NET Core API.

## Live Application

- **CPT V1.1.0:** [https://sonofgrace2203.github.io/CPT/](https://sonofgrace2203.github.io/CPT/)
- **Live API:** [https://cptapi-vu70.onrender.com/](https://cptapi-vu70.onrender.com/)
- **Public demo gallery:** Available from the **Demos** page in the live application.

---

## Overview

Computational Physics Toolkit began as a personal computational physics project focused on making numerical methods and physical models easier to explore interactively.

The project brings together:

- Physics simulations
- Numerical computation
- Interactive visualization
- Simulation configuration and progress tracking
- User accounts and authentication
- Simulation history and data inspection
- Data analysis and export functionality
- Administrative management

CPT aims to provide a workspace where users can move from **physical parameters → numerical simulation → visualization → data analysis** without having to build the computational environment themselves.

## CPT V1.1.0

CPT V1.1.0 establishes the platform's core architecture and its initial simulation environment. It includes a public demo experience as well as account-based features for registered users.

### Platform features

- Public landing page
- Central demo gallery
- Heat Equation and Wave Equation demo entry points
- User registration and login
- JWT-based authentication
- User dashboard
- Physics module catalogue
- Simulation configuration and execution
- Simulation progress tracking and cancellation where supported
- Simulation results and visualizations
- Simulation data and statistics where supported by the module
- CSV, PDF, and PNG export capabilities for supported result views
- User settings
- Help / Quick Start
- About section
- SuperAdmin account and admin dashboard
- User and physics-module management
- Individual user simulation data
- PostgreSQL production database
- Production API
- GitHub Pages frontend deployment

Feature availability can vary by simulation module and result page. The catalogue may contain modules that are listed for future development but are not yet fully implemented.

---

## Public Demo Gallery

The **Demos** page provides a central place for visitors to explore available demonstrations before creating an account.

The gallery currently provides entry points for:

- **2D Heat Equation** — explore temperature diffusion on a two-dimensional grid.
- **1D Wave Equation** — explore wave displacement using different initial displacement profiles.

Visitors can open a demo, configure the available parameters, and proceed through the relevant simulation workflow. Demo navigation returns users to the gallery when they go back from a demo configuration page.

Demo access is intended for exploration. Account-based features, saved user activity, and other protected functionality may require authentication.

---

## Physics Module Catalogue

The physics-module catalogue currently includes entries for the following topics:

- Diffusion Equation
- Electromagnetic Field
- EM Wave Propagation
- Heat Equation (1D)
- Laplace Equation (1D)
- Magnetic Field
- Monte Carlo Simulation
- N-Body Simulation
- Pendulum
- Projectile Motion
- Random Walk
- Schrödinger Equation (1D)
- Spring Mass
- Wave Equation (1D)

The catalogue is stored in the backend database and exposed through the API. **A catalogue entry does not necessarily mean that the corresponding simulation is fully implemented.** The 2D Heat Equation and 1D Wave Equation are the simulation modules currently documented as implemented in CPT V1.

---

## 2D Heat Equation

The 2D Heat Equation module demonstrates numerical heat diffusion across a two-dimensional grid. It uses a finite-difference numerical approach to approximate how temperature evolves over time.

### Configurable parameters

The available configuration includes parameters such as:

- Thermal diffusivity
- Final simulation time
- Time step
- Grid dimensions
- Spatial bounds
- Initial temperature
- Boundary temperature

The current default configuration is:

```text
Diffusivity: 0.21
Final Time: 1.0
Time Step: 0.0005
Grid: 20 × 20
Bounds: -1 to 1
Initial Temperature: 100
Boundary Temperature: 0
```

The backend processes simulations asynchronously using a simulation queue and background worker architecture. Progress information is available while a simulation is running, and the supported workflow includes cancellation.

### Heat Equation visualizations

The result interface supports several ways to inspect the temperature field, including:

- Temperature map
- Surface visualization
- Contour visualization
- Line visualization
- Animation through simulation time steps

Temperature-map controls include available colour palettes and options such as the colour bar, grid, aspect ratio, and time-step selection.

### Heat Equation data and export

Supported result features include numerical data inspection, summary statistics, and export options such as CSV, PDF, and PNG visualization export.

---

## 1D Wave Equation

The Wave Equation module extends CPT's numerical simulation capabilities to a one-dimensional wave model. Users configure a wave simulation, run the computation, and inspect the resulting displacement profile through the module's result interface.

### Initial displacement profiles

The solver supports these initial displacement types:

- **Sine Wave** — a sinusoidal initial displacement profile.
- **Square Pulse** — a localized, flat-topped displacement pulse.
- **Gaussian Pulse** — a smooth, localized pulse with a Gaussian profile.

The selected initial profile determines the starting displacement used by the simulation.

### Wave simulation workflow

The Wave Equation workflow follows the same general pattern as other supported CPT simulations:

1. Configure the simulation parameters.
2. Create and start the simulation.
3. Follow simulation progress where provided.
4. View the simulation results.
5. Inspect the wave profile and other result information available in the interface.

The Wave Equation module is integrated with the CPT frontend and API. Demo mode allows visitors to explore the module without first registering.

> The Wave Equation module and its available result features continue to evolve. Refer to the live application for the current configuration options and visualizations.

---

## Simulation Workflow

A typical simulation follows this general workflow:

```text
Configure Simulation
        ↓
Create Simulation
        ↓
Queue Simulation (where applicable)
        ↓
Background Worker (where applicable)
        ↓
Numerical Solver
        ↓
Progress Updates (where supported)
        ↓
Simulation Completed
        ↓
Results
        ↓
Visualization / Data / Export (where supported)
```

The simulation interface can provide progress information and console output while a computation is running. Once a simulation is complete, users can explore the result features supported by that module.

---

## Authentication and User Accounts

CPT uses ASP.NET Core Identity together with JWT authentication.

The authentication architecture includes:

- User registration and login
- Password hashing through ASP.NET Core Identity
- JWT token generation and validation
- Role-based authorization
- Authenticated user sessions
- Logout
- Protected API endpoints

The frontend manages authentication through dedicated services. User-specific information and simulation activity are associated with the authenticated user rather than being treated as one shared workspace.

---

## Administration

CPT V1 includes SuperAdmin functionality for platform administration.

Administrative capabilities include:

- Viewing registered users
- Inspecting relevant user activity
- Managing physics modules
- Accessing administrative dashboard information
- Viewing platform activity
- Accessing individual users' simulation data where supported

The SuperAdmin role is seeded by the backend during application startup. SuperAdmin credentials are supplied through environment configuration and are **not stored in source code**.

---

## Architecture

CPT uses a separated frontend/backend architecture.

```text
┌──────────────────────────────────────────┐
│              CPT Frontend                │
│       Blazor WebAssembly (.NET 10)       │
│                                          │
│  UI / Navigation / Visualization / Auth  │
└────────────────────┬─────────────────────┘
                     │ HTTPS / REST API
                     ▼
┌──────────────────────────────────────────┐
│                CPT API                   │
│          ASP.NET Core (.NET 10)          │
│                                          │
│ Controllers / Services / Auth / Physics  │
│ Simulation Queue / Background Worker     │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│          Supabase PostgreSQL             │
│                                          │
│ Users / Roles / Simulations / Modules    │
│ Simulation Data / Application Records    │
└──────────────────────────────────────────┘
```

### Frontend

The frontend uses:

- C#
- .NET 10
- Blazor WebAssembly
- Razor components
- HTML and CSS
- JavaScript
- Plotly.Blazor

The frontend is deployed as a static WebAssembly application through GitHub Pages.

- **Repository:** [`Sonofgrace2203/CPT`](https://github.com/Sonofgrace2203/CPT)
- **Production URL:** [https://sonofgrace2203.github.io/CPT/](https://sonofgrace2203.github.io/CPT/)

### Backend

The backend uses:

- C#
- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- ASP.NET Core Identity
- JWT Bearer Authentication
- PostgreSQL
- Npgsql
- Swagger / OpenAPI
- Background hosted services

- **Repository:** [`Sonofgrace2203/cptapi`](https://github.com/Sonofgrace2203/cptapi)
- **Production API:** [https://cptapi-vu70.onrender.com/](https://cptapi-vu70.onrender.com/)

### Database

CPT uses PostgreSQL through Supabase. Entity Framework Core manages the database schema and migrations.

The production database stores application data such as users, roles, physics modules, simulation records, and related application data. The production API connects to Supabase using a pooler connection.

Database credentials are supplied through environment variables and are not committed to GitHub.

---

## Backend Services

The API uses a service-oriented structure for application functionality. Important services include:

- `PhysicsModuleService`
- `SimulationService`
- `SimulationParameterService`
- `SimulationResultService`
- `HeatEquationService`
- `DashboardService`
- `AdminUserService`
- `AdminDashboardService`
- `UserSettingsService`
- `EmailService`

The Heat Equation computation is separated into dedicated components, including:

- `HeatEquationService`
- `IHeatEquationSolver`
- `HeatEquationSolver`
- `HeatEquationProgressStore`
- `HeatEquationSimulationQueue`
- `HeatEquationSimulationWorker`
- `HeatEquationCancellationStore`

The Wave Equation has its own solver and API/service integration. Keeping numerical computation separate from API and simulation orchestration helps the project evolve module by module.

---

## API

The frontend communicates with the backend through HTTP services. For example, the physics-module catalogue is available at:

```http
GET /api/PhysicsModules
```

Production endpoint:

[https://cptapi-vu70.onrender.com/api/PhysicsModules](https://cptapi-vu70.onrender.com/api/PhysicsModules)

The endpoint returns physics-module records stored in the production PostgreSQL database.

---

## Environment Configuration

CPT separates local development configuration from production configuration.

The frontend production API URL is configured in:

```text
wwwroot/appsettings.json
```

Example:

```json
{
  "ApiBaseUrl": "https://cptapi-vu70.onrender.com/"
}
```

Local development can override this in:

```text
wwwroot/appsettings.Development.json
```

Example:

```json
{
  "ApiBaseUrl": "http://localhost:5121/"
}
```

This allows local development to use a local API while the deployed frontend uses the production API.

```text
Local development
CPT frontend
      ↓
http://localhost:5121/
      ↓
Local CPT API
```

```text
Production
GitHub Pages frontend
      ↓
https://cptapi-vu70.onrender.com/
      ↓
Render-hosted CPT API
      ↓
Supabase PostgreSQL
```

---

## Backend Secrets

Sensitive backend configuration is provided through environment variables. Examples include:

```text
CPT_SUPERADMIN_EMAIL
CPT_SUPERADMIN_PASSWORD
```

JWT secrets and email credentials are also supplied through environment configuration. Never commit passwords, tokens, database credentials, or email application passwords to source control.

---

## Email

CPT includes an SMTP email service. The current implementation is configured for Gmail SMTP:

```text
Host: smtp.gmail.com
Port: 587
Security: STARTTLS
```

The email address and application password are supplied through configuration rather than hard-coded into the application.

---

## Deployment

### Frontend deployment

The frontend uses GitHub Actions and GitHub Pages. The deployment workflow is located at:

```text
.github/workflows/deploy.yml
```

The workflow:

1. Checks out the repository.
2. Installs the .NET SDK.
3. Restores dependencies.
4. Publishes the Blazor WebAssembly application.
5. Configures the GitHub Pages `/CPT/` base path.
6. Creates the `.nojekyll` file.
7. Uploads the generated WebAssembly application as a Pages artifact.
8. Deploys the artifact to GitHub Pages.

The source `index.html` can use:

```html
<base href="/" />
```

while the deployment workflow adjusts the published version to use:

```html
<base href="/CPT/" />
```

This keeps local development and GitHub Pages deployment compatible.

### Backend deployment

The backend is containerized with Docker and deployed to Render. The production API connects to Supabase PostgreSQL, and production environment variables are configured in Render.

- **Production API:** [https://cptapi-vu70.onrender.com/](https://cptapi-vu70.onrender.com/)

---

## Local Development

### Requirements

To work on CPT locally, install:

- .NET 10 SDK
- Git
- PostgreSQL or access to the configured development database
- A code editor such as Visual Studio Code or JetBrains Rider

### Running the backend

Navigate to the API project directory:

```bash
cd cptapi
```

Configure the required local environment variables, including SuperAdmin credentials and any database, JWT, and email settings required by your setup. Then run:

```bash
dotnet watch run
```

The API will be available at the configured local address and port.

### Running the frontend

Navigate to the frontend project directory:

```bash
cd cpt
```

Then run:

```bash
dotnet watch
```

or launch the project through your preferred .NET development environment.

During local development, the frontend is configured to use the local API URL:

```text
http://localhost:5121/
```

Ensure the frontend API base URL matches the address where the backend is running.

---

## Project Structure

The following is a high-level overview; the exact files and folders may change as development continues.

### Frontend

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

### Backend

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

## Development Principles

### Physics first

Numerical models and their physical meaning should remain central to the platform.

### Interactive learning

Users should be able to adjust available parameters and observe how a physical system responds.

### Visualization

Numerical output should be presented visually as well as numerically where appropriate.

### Separation of concerns

The frontend, API, database, numerical solvers, simulation orchestration, and authentication systems are separated into appropriate components.

### Extensibility

The physics-module catalogue is designed to support the gradual addition of computational physics modules without requiring the entire application architecture to be rebuilt.

---

## Current V1 Status

CPT V1 is deployed as a live web application. The current platform includes a public demo gallery and implemented Heat Equation and Wave Equation simulation experiences. Other catalogue entries may still be awaiting implementation.

### Production stack

```text
Blazor WebAssembly frontend (.NET 10)
                ↓
          GitHub Pages
                ↓ HTTPS / REST
ASP.NET Core Web API (.NET 10)
                ↓
              Render
                ↓
     Entity Framework Core
                ↓
      Supabase PostgreSQL
```

---

## Future Development

Potential future development areas include:

- Additional numerical physics modules
- More simulation visualizations
- Expanded simulation analysis
- Additional export formats
- Improved simulation history
- More user-workspace functionality
- Expanded administrative tools
- Additional educational resources
- Performance improvements for larger simulations

New modules can be added progressively within the existing physics-module architecture.

---

## Author

**Mustapha Mojeed Olabode**

Physics graduate and software developer interested in:

- Computational Physics
- Scientific Computing
- Numerical Methods
- Simulation
- Software Development
- Interactive Physics Education

GitHub: [https://github.com/Sonofgrace2203](https://github.com/Sonofgrace2203)

---

## License

This project is currently maintained as a personal project. License and reuse terms may be added as the project develops.
