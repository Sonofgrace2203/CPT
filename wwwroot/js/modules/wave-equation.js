
window.cptDownloadWavePng = function (
    filename,
    reportContent,
    displacement,
    length,
    gridPoints,
    minimum,
    maximum,
    gridData,
    includeGridData
) {
    if (!Array.isArray(displacement) || displacement.length < 2) {
        console.error("Not enough wave data to export.");
        return;
    }

    const width = 1600;
    const margin = 80;
    const reportWidth = width - margin * 2;
    const graphHeight = 650;
    const rowHeight = 28;

    // Prepare and wrap report text.
    const measureCanvas = document.createElement("canvas");
    measureCanvas.width = width;

    const measureCtx = measureCanvas.getContext("2d");

    if (!measureCtx) {
        console.error("Could not prepare the PNG report.");
        return;
    }

    measureCtx.font = "18px Arial";

    const reportLines = [];

    for (const line of (reportContent || "").split(/\r?\n/)) {
        if (!line.trim()) {
            reportLines.push("");
            continue;
        }

        const words = line.split(/\s+/);
        let currentLine = "";

        for (const word of words) {
            const candidate = currentLine
                ? `${currentLine} ${word}`
                : word;

            if (
                measureCtx.measureText(candidate).width > reportWidth &&
                currentLine
            ) {
                reportLines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = candidate;
            }
        }

        if (currentLine) {
            reportLines.push(currentLine);
        }
    }


    const hasGridData =
        includeGridData &&
        Array.isArray(gridData) &&
        gridData.length > 0;

    const reportHeight = reportLines.length * 27 + 35;

    // PNG tables are limited to 100 rows.
    const maxPngGridRows = 100;

    const totalGridRows = hasGridData
        ? gridData.length
        : 0;

    const displayedGridRows = Math.min(
        totalGridRows,
        maxPngGridRows
    );

    const hasOmittedGridRows =
        displayedGridRows < totalGridRows;

    
    const tableHeight = displayedGridRows > 0
        ? 100 +
          displayedGridRows * rowHeight +
          (hasOmittedGridRows ? 85 : 0)
        : 0;

    const height =
        170 +
        reportHeight +
        graphHeight +
        tableHeight +
        100;


    // Prevent browser canvas size limits from producing a corrupt image.
    if (height > 30000) {
        console.error(
            "The report is too large for one PNG image. " +
            "Export the full numerical data as CSV or use PDF."
        );
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Could not create the PNG canvas.");
        return;
    }

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    let y = 55;

    // Report heading
    ctx.fillStyle = "#172033";
    ctx.textAlign = "left";
    ctx.font = "bold 32px Arial";
    ctx.fillText(
        "CPT - Computational Physics Toolkit",
        margin,
        y
    );

    y += 48;

    ctx.font = "bold 25px Arial";
    ctx.fillText("Wave Equation Simulation Report", margin, y);

    y += 35;

    // Metadata, parameters and statistics.
    // GeneratePdfContent already respects their checkboxes.
    ctx.font = "18px Arial";
    ctx.fillStyle = "#344054";

    for (const line of reportLines) {
        if (!line) {
            y += 12;
            continue;
        }

        ctx.fillText(line, margin, y);
        y += 27;
    }

    y += 25;

    // Graph heading
    ctx.fillStyle = "#172033";
    ctx.font = "bold 25px Arial";
    ctx.fillText("Wave Displacement Graph", margin, y);

    y += 25;

    const graphTop = y;
    const graphBottom = graphTop + graphHeight - 100;
    const graphLeft = margin + 100;
    const graphRight = width - margin - 30;
    const plotWidth = graphRight - graphLeft;
    const plotHeight = graphBottom - graphTop;

    const actualMin = Math.min(...displacement);
    const actualMax = Math.max(...displacement);

    const range = actualMax - actualMin;
    const padding = range === 0
        ? Math.max(Math.abs(actualMin) * 0.1, 0.001)
        : range * 0.1;

    const yMin = actualMin - padding;
    const yMax = actualMax + padding;

    const xPosition = i =>
        graphLeft + (i / (displacement.length - 1)) * plotWidth;

    const yPosition = value =>
        graphTop + ((yMax - value) / (yMax - yMin)) * plotHeight;

    ctx.font = "16px Arial";
    ctx.strokeStyle = "#d9e0e8";
    ctx.lineWidth = 1;

    // Graph grid and axis labels
    for (let i = 0; i <= 5; i++) {
        const fraction = i / 5;
        const gy = graphTop + fraction * plotHeight;
        const value = yMax - fraction * (yMax - yMin);

        ctx.beginPath();
        ctx.moveTo(graphLeft, gy);
        ctx.lineTo(graphRight, gy);
        ctx.stroke();

        ctx.fillStyle = "#344054";
        ctx.textAlign = "right";
        ctx.fillText(value.toExponential(3), graphLeft - 12, gy + 5);

        const gx = graphLeft + fraction * plotWidth;

        ctx.beginPath();
        ctx.moveTo(gx, graphTop);
        ctx.lineTo(gx, graphBottom);
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.fillText(
            (fraction * length).toFixed(3),
            gx,
            graphBottom + 28
        );
    }

    // Axis titles
    ctx.fillStyle = "#172033";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
        "Position, x (m)",
        graphLeft + plotWidth / 2,
        graphBottom + 65
    );

    ctx.save();
    ctx.translate(margin + 25, graphTop + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Displacement (m)", 0, 0);
    ctx.restore();

    // Wave curve
    ctx.beginPath();
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;

    displacement.forEach((value, i) => {
        const px = xPosition(i);
        const py = yPosition(value);

        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    });

    ctx.stroke();

    y = graphBottom + 105;

    // Numerical Wave Data table, if selected.
    if (hasGridData) {
        ctx.fillStyle = "#172033";
        ctx.font = "bold 25px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Numerical Wave Data", margin, y);

        y += 45;

        const xColumn = margin + 10;
        const displacementColumn = margin + 650;
        const tableRight = width - margin;

        const drawTableHeader = () => {
            ctx.fillStyle = "#eaf0f8";
            ctx.fillRect(
                margin,
                y - 23,
                reportWidth,
                rowHeight
            );

            ctx.fillStyle = "#172033";
            ctx.font = "bold 18px Arial";

            ctx.textAlign = "left";
            ctx.fillText("Position, x (m)", xColumn, y);
            ctx.fillText(
                "Displacement (m)",
                displacementColumn,
                y
            );

            y += rowHeight;
        };

        drawTableHeader();

        ctx.font = "17px Arial";

        for (let i = 0; i < displayedGridRows; i++) {
            const point = gridData[i];

            if (i % 2 === 1) {
                ctx.fillStyle = "#f7f9fc";
                ctx.fillRect(
                    margin,
                    y - 20,
                    reportWidth,
                    rowHeight
                );
            }

            ctx.fillStyle = "#344054";
            ctx.textAlign = "left";

            ctx.fillText(
                Number(point.x).toFixed(6),
                xColumn,
                y
            );

            ctx.fillText(
                Number(point.displacement).toExponential(6),
                displacementColumn,
                y
            );

            ctx.strokeStyle = "#e1e5eb";
            ctx.beginPath();
            ctx.moveTo(margin, y + 7);
            ctx.lineTo(tableRight, y + 7);
            ctx.stroke();

            y += rowHeight;
        }

        if (hasOmittedGridRows) {
            y += 10;

            ctx.font = "bold 18px Arial";
            ctx.fillStyle = "#b42318";
            ctx.textAlign = "left";

            ctx.fillText(
                `Showing ${displayedGridRows} of ${totalGridRows} rows.`,
                margin,
                y
            );

            y += 28;

            ctx.font = "16px Arial";
            ctx.fillStyle = "#344054";

            ctx.fillText(
                "Export PDF or CSV for all grid data.",
                margin,
                y
            );

            y += 30;
        }
    }

    // Download as PNG
    canvas.toBlob(blob => {
        if (!blob) {
            console.error("Failed to generate the wave PNG.");
            return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = filename.toLowerCase().endsWith(".png")
            ? filename
            : `${filename}.png`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
};












window.cptDownloadWaveCsv = function (
    filename,
    metadata,
    parameters,
    statistics,
    gridData,
    includeMetadata,
    includeParameters,
    includeStatistics,
    includeGridData
) {
    const rows = [];

    const escapeCsv = value => {
        const text = String(value ?? "");
        return `"${text.replace(/"/g, '""')}"`;
    };

    const addRow = (...values) => {
        rows.push(values.map(escapeCsv).join(","));
    };

    if (includeMetadata) {
        addRow("CPT - Computational Physics Toolkit");
        addRow("Simulation Name", metadata.name);
        addRow("Simulation ID", metadata.id);
        addRow("Export Date", metadata.exportDate);
        rows.push("");
    }

    if (includeParameters) {
        addRow("PARAMETERS");
        addRow("Grid Points", parameters.gridPoints);
        addRow("Length", parameters.length);
        addRow("Wave Speed", parameters.waveSpeed);
        addRow("Time Step", parameters.timeStep);
        addRow("Time Steps", parameters.timeSteps);
        addRow("Final Time", parameters.finalTime);
        addRow("Spatial Step", parameters.dx);
        addRow("CFL Number", parameters.cflNumber);
        addRow("Stability", parameters.stability);
        addRow("Initial Condition", parameters.initialCondition);
        addRow("Initial Amplitude", parameters.initialAmplitude);
        addRow("Boundary Condition", parameters.boundaryCondition);
        rows.push("");
    }

    if (includeStatistics) {
        addRow("STATISTICS");
        addRow("Minimum Displacement", statistics.minimum);
        addRow("Maximum Displacement", statistics.maximum);
        addRow("Average Displacement", statistics.mean);
        addRow("Standard Deviation", statistics.standardDeviation);
        addRow("Grid Points", statistics.gridPoints);
        rows.push("");
    }

    if (includeGridData) {
        addRow("GRID DATA");
        addRow("X", "Displacement");

        for (const point of gridData ?? []) {
            addRow(point.x, point.displacement);
        }
    }

    const csv = "\uFEFF" + rows.join("\r\n");

    if (window.cptIsNativeAndroid && window.cptIsNativeAndroid()) {
        // Use the shared download helper, which handles native Android.
        return window.cptDownloadFile(
            filename,
            "text/csv;charset=utf-8",
            csv
        );
    }

    const blob = new Blob(
        [csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename.toLowerCase().endsWith(".csv")
        ? filename
        : `${filename}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
















window.cptDownloadWavePdf = async (
    fileName,
    reportContent,
    displacement,
    length,
    gridPoints,
    minimum,
    maximum,
    gridData,
    includeGridData
) => {
    if (!window.jspdf) {
        console.error("jsPDF is not loaded.");
        return;
    }

    if (!Array.isArray(displacement) || displacement.length < 2) {
        console.error("Not enough wave data to export.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = 18;

    // Report heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CPT - Computational Physics Toolkit", margin, y);

    y += 9;
    doc.setFontSize(14);
    doc.text("Wave Equation Simulation Report", margin, y);

    // Report content
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    for (const line of (reportContent || "").split(/\r?\n/)) {
        if (y > pageHeight - 20) {
            doc.addPage();
            y = margin;
        }

        if (line.trim() === "") {
            y += 3;
            continue;
        }

        doc.text(line.substring(0, 115), margin, y);
        y += 5;
    }

    // Draw the wave profile on a canvas
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");

    if (ctx) {
        const left = 100;
        const right = 40;
        const top = 50;
        const bottom = 80;

        const plotWidth = canvas.width - left - right;
        const plotHeight = canvas.height - top - bottom;

        const range = maximum - minimum;
        const padding = range === 0
            ? Math.max(Math.abs(minimum) * 0.1, 0.001)
            : range * 0.1;

        const yMin = minimum - padding;
        const yMax = maximum + padding;

        const xPosition = i =>
            left + (i / (displacement.length - 1)) * plotWidth;

        const yPosition = value =>
            top + ((yMax - value) / (yMax - yMin)) * plotHeight;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#172033";
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Wave Displacement Profile", canvas.width / 2, 32);

        ctx.strokeStyle = "#d9e0e8";
        ctx.lineWidth = 1;
        ctx.font = "16px Arial";
        ctx.fillStyle = "#344054";

        for (let i = 0; i <= 5; i++) {
            const fraction = i / 5;
            const yGrid = top + fraction * plotHeight;
            const value = yMax - fraction * (yMax - yMin);

            ctx.beginPath();
            ctx.moveTo(left, yGrid);
            ctx.lineTo(canvas.width - right, yGrid);
            ctx.stroke();

            ctx.textAlign = "right";
            ctx.fillText(value.toExponential(3), left - 10, yGrid + 5);

            const xGrid = left + fraction * plotWidth;

            ctx.beginPath();
            ctx.moveTo(xGrid, top);
            ctx.lineTo(xGrid, canvas.height - bottom);
            ctx.stroke();

            ctx.textAlign = "center";
            ctx.fillText((fraction * length).toFixed(3), xGrid, canvas.height - bottom + 25);
        }

        ctx.fillStyle = "#172033";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Position, x (m)", left + plotWidth / 2, canvas.height - 15);

        ctx.save();
        ctx.translate(25, top + plotHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Displacement (m)", 0, 0);
        ctx.restore();

        ctx.beginPath();
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 3;

        displacement.forEach((value, i) => {
            const x = xPosition(i);
            const yValue = yPosition(value);

            if (i === 0) ctx.moveTo(x, yValue);
            else ctx.lineTo(x, yValue);
        });

        ctx.stroke();

        // Add graph on a new page
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Wave Displacement Graph", margin, 20);

        doc.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            margin,
            28,
            pageWidth - 2 * margin,
            95
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        // doc.text(`Grid points: ${gridPoints}`, margin, 132);
        // doc.text(`Minimum displacement: ${minimum.toExponential(6)} m`, margin, 139);
        // doc.text(`Maximum displacement: ${maximum.toExponential(6)} m`, margin, 146);
    }

    // Optional one-dimensional wave data table
    if (includeGridData && Array.isArray(gridData) && gridData.length > 0) {
        doc.addPage();
        y = margin;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Numerical Wave Data", margin, y);

        y += 10;

        const tableWidth = pageWidth - (margin * 2);
        const xColumnWidth = 75;
        const displacementColumnWidth = tableWidth - xColumnWidth;
        const rowHeight = 7;

        doc.setFontSize(9);

        const drawHeader = () => {
            doc.setFont("helvetica", "bold");

            doc.text(
                "Position, x (m)",
                margin + 2,
                y
            );

            doc.text(
                "Displacement (m)",
                margin + xColumnWidth + 2,
                y
            );

            doc.line(
                margin,
                y + 2,
                pageWidth - margin,
                y + 2
            );

            y += 7;

            doc.setFont("helvetica", "normal");
        };

        drawHeader();

        for (const point of gridData) {
            if (y > pageHeight - 15) {
                doc.addPage();
                y = margin;
                doc.setFontSize(9);
                drawHeader();
            }

            // Position column
            doc.text(
                Number(point.x).toFixed(6),
                margin + 2,
                y
            );

            // Displacement column
            doc.text(
                Number(point.displacement).toExponential(6),
                margin + xColumnWidth + 2,
                y
            );

            // Row divider
            doc.setDrawColor(220, 220, 220);
            doc.line(
                margin,
                y + 2,
                pageWidth - margin,
                y + 2
            );

            y += rowHeight;
        }
    }

    // Save or share on Android
    if (window.cptIsNativeAndroid && window.cptIsNativeAndroid()) {
        try {
            const pdfBase64 = doc.output("datauristring").split(",")[1];
            const Filesystem = window.Capacitor.Plugins.Filesystem;
            const Share = window.Capacitor.Plugins.Share;

            const result = await Filesystem.writeFile({
                path: fileName,
                data: pdfBase64,
                directory: "Cache",
                recursive: true
            });

            await Share.share({
                title: fileName,
                text: `CPT Wave Equation report: ${fileName}`,
                url: result.uri,
                dialogTitle: "Save or share PDF"
            });
        } catch (error) {
            console.error("CPT Wave PDF export failed:", error);
        }
    } else {
        doc.save(fileName);
    }
};
