namespace CPT.Models.Visualization;

public class ColorScale
{
    public string Name { get; set; } = string.Empty;

    public List<ColorStop> Stops { get; set; } = [];
}

public class ColorStop
{
    public double Position { get; set; }

    public int Red { get; set; }

    public int Green { get; set; }

    public int Blue { get; set; }
}