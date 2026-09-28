using cpt.Models.Modules;

namespace CPT.Services;

public class PhysicsModuleCatalogue
{
    public IReadOnlyList<PhysicsModule> Modules { get; } =
    new List<PhysicsModule>
    {

new PhysicsModule
            {
                Name = "Projectile Motion",
                Category = "Classical Mechanics",
                Icon = "icons/cooking.svg",
                Available = false
            },

            new PhysicsModule
            {
                Name = "Pendulum",
                Category = "Classical Mechanics",
                Icon = "icons/cooking.svg",
                Available = false
            },

            new PhysicsModule
            {
                Name = "Spring Mass",
                Category = "Classical Mechanics",
                Icon = "icons/cooking.svg",
                Available = false
            },

            new PhysicsModule
            {
                Name = "N-Body Simulation",
                Category = "Classical Mechanics",
                Icon = "icons/cooking.svg",
                Available = false
            },


            // Electromagnetism

            new PhysicsModule
            {
                Name = "Electromagnetic Field",
                Category = "Electromagnetism",
                Icon = "icons/cooking.svg",
                Available = false
            },

            new PhysicsModule
            {
                Name = "Magnetic Field",
                Category = "Electromagnetism",
                Icon = "icons/cooking.svg",
                Available = false
            },

            new PhysicsModule
            {
                Name = "EM Wave Propagation",
                Category = "Electromagnetism",
                Icon = "icons/cooking.svg",
                Available = false
            },


            // Mathematical Physics

            new PhysicsModule
            {
                Name = "Heat Equation (1D)",
                Category = "Mathematical Physics",
                Icon = "icons/cooking.svg",
                Available = false
            },

            new PhysicsModule
            {
                Name = "Heat Equation (2D)",
                Category = "Mathematical Physics",
                Icon = "icons/cooking.svg",
                Route = "HeatEquation",
                Available = true
            },

            new PhysicsModule
            {
                Name = "Wave Equation (1D)",
                Category = "Mathematical Physics",
                Icon = "icons/cooking.svg",
                Available = false
            },

            new PhysicsModule
            {
                Name = "Laplace Equation (1D)",
                Category = "Mathematical Physics",
                Icon = "icons/cooking.svg",
                Available = false
            },


            // Statistical & Quantum

            new PhysicsModule
            {
                Name = "Monte Carlo Simulation",
                Category = "Statistical & Quantum",
                Icon = "icons/cooking.svg",
                Available = false
            },

            new PhysicsModule
            {
                Name = "Random Walk",
                Category = "Statistical & Quantum",
                Icon = "icons/cooking.svg",
                Available = false
            },

            new PhysicsModule
            {
                Name = "Schrödinger Equation (1D)",
                Category = "Statistical & Quantum",
                Icon = "icons/cooking.svg",
                Available = false
            },

            new PhysicsModule
            {
                Name = "Diffusion Equation",
                Category = "Statistical & Quantum",
                Icon = "icons/cooking.svg",
                Available = false
            }

        // Add future modules here.
        // Example:
        //
        // new PhysicsModule
        // {
        //     Name = "Wave Equation (2D)",
        //     Category = "Mathematical Physics",
        //     Icon = "icons/wave.svg",
        //     Route = "WaveEquation",
        //     Available = false
        // }
        };

}
