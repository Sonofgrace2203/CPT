window.cptDownloadFile = (fileName, contentType, content) => {
    const blob = new Blob([content], {
        type: contentType
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};



// ==================================================
// DOWNLOAD PDF
// ==================================================

window.cptDownloadPdf = (
    fileName,
    reportContent,
    temperature,
    gridWidth,
    gridHeight,
    minimum,
    maximum,
    gridData,
    includeGridData,
    colorMap
) => {

    if (!window.jspdf) {
        console.error("jsPDF is not loaded.");
        return;
    }


    // ==================================================
    // VALIDATE COLOR MAP
    // ==================================================

    if (
        colorMap !== "Thermal" &&
        colorMap !== "Viridis" &&
        colorMap !== "Grayscale"
    ) {
        colorMap = "Thermal";
    }


    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();

    const margin = 15;

    let y = 18;


    // ==================================================
    // PAGE 1 — REPORT
    // ==================================================

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");

    doc.text(
        "CPT - Computational Physics Toolkit",
        margin,
        y
    );

    y += 9;

    doc.setFontSize(14);

    doc.text(
        "Heat Equation Simulation Report",
        margin,
        y
    );

    y += 10;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const lines =
        reportContent.split("\n");

    for (const line of lines) {

        if (line.trim() === "") {
            y += 3;
            continue;
        }

        if (y > pageHeight - 20) {

            doc.addPage();

            y = margin;
        }

        doc.text(
            line.substring(0, 115),
            margin,
            y
        );

        y += 5;
    }


    // ==================================================
    // PAGE 2 — HEATMAP
    // ==================================================

    if (
        temperature &&
        temperature.length > 0 &&
        gridWidth > 0 &&
        gridHeight > 0
    ) {

        doc.addPage();

        y = margin;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");

        doc.text(
            "Temperature Distribution",
            margin,
            y
        );

        y += 8;


        const canvas =
            document.createElement("canvas");

        const canvasWidth = 800;

        const canvasHeight =
            Math.round(
                canvasWidth *
                (gridHeight / gridWidth)
            );

        canvas.width =
            canvasWidth;

        canvas.height =
            canvasHeight;


        const ctx =
            canvas.getContext("2d");

        if (ctx) {

            const cellWidth =
                canvasWidth / gridWidth;

            const cellHeight =
                canvasHeight / gridHeight;


            // ==================================================
            // DRAW HEATMAP
            // ==================================================

            for (
                let row = 0;
                row < temperature.length;
                row++
            ) {

                const values =
                    temperature[row];

                if (!values)
                    continue;


                for (
                    let column = 0;
                    column < values.length;
                    column++
                ) {

                    const value =
                        values[column];

                    let normalized;


                    if (
                        Math.abs(
                            maximum - minimum
                        ) < Number.EPSILON
                    ) {

                        normalized = 0.5;

                    }
                    else {

                        normalized =
                            (value - minimum) /
                            (maximum - minimum);
                    }


                    normalized =
                        Math.max(
                            0,
                            Math.min(
                                1,
                                normalized
                            )
                        );


                    const rgb =
                        getHeatmapTemperatureColor(
                            normalized,
                            colorMap
                        );


                    ctx.fillStyle =
                        `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;


                    ctx.fillRect(
                        column * cellWidth,
                        row * cellHeight,
                        Math.ceil(cellWidth),
                        Math.ceil(cellHeight)
                    );
                }
            }


            // ==================================================
            // ADD HEATMAP IMAGE TO PDF
            // ==================================================

            const maxImageWidth =
                pageWidth -
                (margin * 2);

            const maxImageHeight = 145;

            let imageWidth =
                maxImageWidth;

            let imageHeight =
                imageWidth *
                (canvasHeight / canvasWidth);


            if (imageHeight > maxImageHeight) {

                imageHeight =
                    maxImageHeight;

                imageWidth =
                    imageHeight *
                    (canvasWidth / canvasHeight);
            }


            const imageX =
                (pageWidth - imageWidth) / 2;


            doc.addImage(
                canvas.toDataURL("image/png"),
                "PNG",
                imageX,
                y,
                imageWidth,
                imageHeight
            );


            y +=
                imageHeight +
                10;


            // ==================================================
            // LEGEND
            // ==================================================

            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");

            doc.text(
                `Minimum: ${minimum.toFixed(2)} K`,
                margin,
                y
            );

            doc.text(
                `Maximum: ${maximum.toFixed(2)} K`,
                pageWidth - margin,
                y,
                {
                    align: "right"
                }
            );

            y += 5;


            const legendWidth =
                pageWidth -
                (margin * 2);

            const legendHeight = 5;


            const gradientCanvas =
                document.createElement("canvas");

            gradientCanvas.width = 800;
            gradientCanvas.height = 20;


            const gradientCtx =
                gradientCanvas.getContext("2d");


            if (gradientCtx) {

                const gradient =
                    gradientCtx.createLinearGradient(
                        0,
                        0,
                        gradientCanvas.width,
                        0
                    );


                const legendStops = 20;


                for (
                    let i = 0;
                    i < legendStops;
                    i++
                ) {

                    const position =
                        i /
                        (legendStops - 1);


                    const color =
                        getHeatmapTemperatureColor(
                            position,
                            colorMap
                        );


                    gradient.addColorStop(
                        position,
                        `rgb(${color.r}, ${color.g}, ${color.b})`
                    );
                }


                gradientCtx.fillStyle =
                    gradient;


                gradientCtx.fillRect(
                    0,
                    0,
                    gradientCanvas.width,
                    gradientCanvas.height
                );


                doc.addImage(
                    gradientCanvas.toDataURL("image/png"),
                    "PNG",
                    margin,
                    y,
                    legendWidth,
                    legendHeight
                );
            }
        }
    }


    // ==================================================
    // GRID DATA
    // ==================================================

    if (
        includeGridData &&
        gridData &&
        gridData.length > 0
    ) {

        doc.addPage();

        y = margin;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");

        doc.text(
            "Numerical Grid Data",
            margin,
            y
        );

        y += 8;

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");


        // ==================================================
        // TABLE DIMENSIONS
        // ==================================================

        const tableWidth =
            pageWidth -
            (margin * 2);

        const xColumnWidth = 50;
        const yColumnWidth = 50;

        const temperatureColumnWidth =
            tableWidth -
            xColumnWidth -
            yColumnWidth;

        const rowHeight = 5;


        // ==================================================
        // TABLE HEADER
        // ==================================================

        const drawHeader = () => {

            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.text(
                "X",
                margin + 2,
                y
            );

            doc.text(
                "Y",
                margin +
                xColumnWidth +
                2,
                y
            );

            doc.text(
                "Temperature (K)",
                margin +
                xColumnWidth +
                yColumnWidth +
                2,
                y
            );


            doc.line(
                margin,
                y + 2,
                pageWidth - margin,
                y + 2
            );


            y += 6;


            doc.setFont(
                "helvetica",
                "normal"
            );
        };


        drawHeader();


        // ==================================================
        // TABLE ROWS
        // ==================================================

        for (const point of gridData) {

            if (y > pageHeight - 15) {

                doc.addPage();

                y = margin;

                doc.setFontSize(8);

                drawHeader();
            }


            doc.text(
                Number(point.x).toFixed(6),
                margin + 2,
                y
            );


            doc.text(
                Number(point.y).toFixed(6),
                margin +
                xColumnWidth +
                2,
                y
            );


            doc.text(
                Number(point.temperature).toFixed(6),
                margin +
                xColumnWidth +
                yColumnWidth +
                2,
                y
            );


            y += rowHeight;
        }
    }


    // ==================================================
    // SAVE
    // ==================================================

    doc.save(fileName);
};



// ==================================================
// HEATMAP PNG EXPORT
// ==================================================

window.cptDownloadHeatmapPng = (
    fileName,
    reportContent,
    temperature,
    gridWidth,
    gridHeight,
    minimum,
    maximum,
    gridData,
    includeGridData,
    colorMap
) => {

    if (
        !temperature ||
        temperature.length === 0 ||
        gridWidth <= 0 ||
        gridHeight <= 0
    ) {

        console.error(
            "No heatmap data available."
        );

        return;
    }


    // ==================================================
    // VALIDATE COLOR MAP
    // ==================================================

    if (
        colorMap !== "Thermal" &&
        colorMap !== "Viridis" &&
        colorMap !== "Grayscale"
    ) {

        colorMap = "Thermal";
    }


    // ==================================================
    // LAYOUT
    // ==================================================

    const canvasWidth = 1400;

    const margin = 80;

    const contentWidth =
        canvasWidth -
        (margin * 2);

    const titleHeight = 120;

    const reportLineHeight = 30;


    const heatmapHeight =
        Math.round(
            contentWidth *
            (gridHeight / gridWidth)
        );


    const legendHeight = 100;

    const gridRowHeight = 28;

    const gridHeaderHeight = 40;


    const gridDataHeight =
        includeGridData &&
        gridData &&
        gridData.length > 0

            ? 80 +
            gridHeaderHeight +
            (gridData.length * gridRowHeight)

            : 0;


    // ==================================================
    // REPORT HEIGHT
    // ==================================================

    const reportLines =
        reportContent
            ? reportContent.split(/\r?\n/)
            : [];


    const reportHeight =
        reportLines.length > 0
            ? 40 +
            (reportLines.length *
                reportLineHeight)
            : 0;


    // ==================================================
    // TOTAL CANVAS HEIGHT
    // ==================================================

    const canvasHeight =
        titleHeight +
        reportHeight +
        heatmapHeight +
        legendHeight +
        gridDataHeight +
        120;


    // ==================================================
    // CANVAS
    // ==================================================

    const canvas =
        document.createElement("canvas");

    canvas.width =
        canvasWidth;

    canvas.height =
        canvasHeight;


    const ctx =
        canvas.getContext("2d");


    if (!ctx) {

        console.error(
            "Unable to create canvas context."
        );

        return;
    }


    // ==================================================
    // BACKGROUND
    // ==================================================

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


    let currentY = 50;


    // ==================================================
    // TITLE
    // ==================================================

    ctx.fillStyle =
        "#111111";

    ctx.textAlign =
        "left";

    ctx.font =
        "bold 32px Arial";


    ctx.fillText(
        "CPT - Computational Physics Toolkit",
        margin,
        currentY
    );


    currentY += 42;


    ctx.font =
        "22px Arial";

    ctx.fillStyle =
        "#555555";


    ctx.fillText(
        "Heat Equation Simulation Report",
        margin,
        currentY
    );


    currentY += 38;


    // ==================================================
    // REPORT CONTENT
    // ==================================================

    if (reportLines.length > 0) {

        ctx.strokeStyle =
            "#dddddd";

        ctx.lineWidth = 1;


        ctx.beginPath();

        ctx.moveTo(
            margin,
            currentY
        );

        ctx.lineTo(
            canvasWidth - margin,
            currentY
        );

        ctx.stroke();


        currentY += 35;


        for (const rawLine of reportLines) {

            const line =
                rawLine.trim();


            if (line === "") {

                currentY += 12;

                continue;
            }


            // ------------------------------------------
            // SECTION HEADINGS
            // ------------------------------------------

            const isSectionHeading =
                line === "SIMULATION PARAMETERS" ||
                line === "STATISTICS" ||
                line === "Boundary Conditions";


            if (line === "Simulation Report") {
                continue;
            }


            if (isSectionHeading) {

                ctx.font =
                    "bold 20px Arial";

                ctx.fillStyle =
                    "#222222";


                ctx.fillText(
                    line,
                    margin,
                    currentY
                );


                currentY +=
                    reportLineHeight;

                continue;
            }


            // ------------------------------------------
            // NORMAL REPORT LINE
            // ------------------------------------------

            ctx.font =
                "18px Arial";

            ctx.fillStyle =
                "#333333";


            ctx.fillText(
                line,
                margin,
                currentY
            );


            currentY +=
                reportLineHeight;
        }


        currentY += 25;
    }


    // ==================================================
    // HEATMAP TITLE
    // ==================================================

    ctx.font =
        "bold 22px Arial";

    ctx.fillStyle =
        "#222222";


    ctx.fillText(
        "Temperature Distribution",
        margin,
        currentY
    );


    currentY += 30;


    // ==================================================
    // HEATMAP
    // ==================================================

    const heatmapY =
        currentY;


    const cellWidth =
        contentWidth /
        gridWidth;


    const cellHeight =
        heatmapHeight /
        gridHeight;


    // ==================================================
    // DRAW HEATMAP
    // ==================================================

    for (
        let row = 0;
        row < temperature.length;
        row++
    ) {

        const values =
            temperature[row];

        if (!values)
            continue;


        for (
            let column = 0;
            column < values.length;
            column++
        ) {

            const value =
                values[column];

            let normalized;


            if (
                Math.abs(
                    maximum - minimum
                ) < Number.EPSILON
            ) {

                normalized = 0.5;
            }
            else {

                normalized =
                    (value - minimum) /
                    (maximum - minimum);
            }


            normalized =
                Math.max(
                    0,
                    Math.min(
                        1,
                        normalized
                    )
                );


            const rgb =
                getHeatmapTemperatureColor(
                    normalized,
                    colorMap
                );


            ctx.fillStyle =
                `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;


            ctx.fillRect(
                margin +
                (column * cellWidth),

                heatmapY +
                (row * cellHeight),

                Math.ceil(cellWidth),

                Math.ceil(cellHeight)
            );
        }
    }


    currentY =
        heatmapY +
        heatmapHeight +
        25;


    // ==================================================
    // LEGEND
    // ==================================================

    const legendWidth =
        contentWidth;

    const legendBarHeight = 20;


    const gradient =
        ctx.createLinearGradient(
            margin,
            currentY,
            margin + legendWidth,
            currentY
        );


    // ==================================================
    // LEGEND COLOR MAP
    // ==================================================

    const legendStops = 20;


    for (
        let i = 0;
        i < legendStops;
        i++
    ) {

        const position =
            i /
            (legendStops - 1);


        const color =
            getHeatmapTemperatureColor(
                position,
                colorMap
            );


        gradient.addColorStop(
            position,
            `rgb(${color.r}, ${color.g}, ${color.b})`
        );
    }


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        margin,
        currentY,
        legendWidth,
        legendBarHeight
    );


    currentY += 48;


    // ==================================================
    // MINIMUM / MAXIMUM
    // ==================================================

    ctx.font =
        "17px Arial";

    ctx.fillStyle =
        "#333333";

    ctx.textAlign =
        "left";


    ctx.fillText(
        `Minimum: ${minimum.toFixed(2)} K`,
        margin,
        currentY
    );


    ctx.textAlign =
        "right";


    ctx.fillText(
        `Maximum: ${maximum.toFixed(2)} K`,
        canvasWidth - margin,
        currentY
    );


    ctx.textAlign =
        "left";


    currentY += 55;


    // ==================================================
    // GRID DATA
    // ==================================================

    if (
        includeGridData &&
        gridData &&
        gridData.length > 0
    ) {

        ctx.font =
            "bold 22px Arial";

        ctx.fillStyle =
            "#222222";


        ctx.fillText(
            "Grid Data",
            margin,
            currentY
        );


        currentY += 30;


        const tableX =
            margin;

        const tableWidth =
            contentWidth;

        const columnXWidth = 280;

        const columnYWidth = 280;

        const columnTemperatureWidth =
            tableWidth -
            columnXWidth -
            columnYWidth;


        // ==================================================
        // TABLE HEADER
        // ==================================================

        ctx.fillStyle =
            "#eeeeee";


        ctx.fillRect(
            tableX,
            currentY,
            tableWidth,
            gridHeaderHeight
        );


        ctx.strokeStyle =
            "#cccccc";

        ctx.lineWidth = 1;


        ctx.strokeRect(
            tableX,
            currentY,
            tableWidth,
            gridHeaderHeight
        );


        ctx.font =
            "bold 16px Arial";

        ctx.fillStyle =
            "#222222";

        ctx.textAlign =
            "left";


        ctx.fillText(
            "X",
            tableX + 12,
            currentY + 26
        );


        ctx.fillText(
            "Y",
            tableX +
            columnXWidth +
            12,
            currentY + 26
        );


        ctx.fillText(
            "Temperature (K)",
            tableX +
            columnXWidth +
            columnYWidth +
            12,
            currentY + 26
        );


        currentY +=
            gridHeaderHeight;


        // ==================================================
        // GRID ROWS
        // ==================================================

        ctx.font =
            "15px Arial";


        for (const point of gridData) {

            ctx.fillStyle =
                "#ffffff";


            ctx.fillRect(
                tableX,
                currentY,
                tableWidth,
                gridRowHeight
            );


            ctx.strokeStyle =
                "#dddddd";


            ctx.strokeRect(
                tableX,
                currentY,
                tableWidth,
                gridRowHeight
            );


            ctx.fillStyle =
                "#333333";


            ctx.textAlign =
                "left";


            // ------------------------------------------
            // X
            // ------------------------------------------

            ctx.fillText(
                Number(point.x).toFixed(6),
                tableX + 12,
                currentY + 19
            );


            // ------------------------------------------
            // Y
            // ------------------------------------------

            ctx.fillText(
                Number(point.y).toFixed(6),
                tableX +
                columnXWidth +
                12,
                currentY + 19
            );


            // ------------------------------------------
            // TEMPERATURE
            // ------------------------------------------

            ctx.fillText(
                Number(point.temperature).toFixed(6),
                tableX +
                columnXWidth +
                columnYWidth +
                12,
                currentY + 19
            );


            currentY +=
                gridRowHeight;
        }
    }


    // ==================================================
    // FOOTER
    // ==================================================

    ctx.textAlign =
        "center";

    ctx.font =
        "14px Arial";

    ctx.fillStyle =
        "#777777";


    ctx.fillText(
        "Generated by CPT - Computational Physics Toolkit",
        canvasWidth / 2,
        canvasHeight - 35
    );


    // ==================================================
    // DOWNLOAD
    // ==================================================

    const link =
        document.createElement("a");


    link.download =
        fileName;


    link.href =
        canvas.toDataURL("image/png");


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
};



// ==================================================
// HEATMAP COLOUR HELPER
// ==================================================

function getHeatmapTemperatureColor(
    normalized,
    scale
) {

    normalized =
        Math.max(
            0,
            Math.min(
                1,
                normalized
            )
        );


    // ==================================================
    // VIRIDIS
    // ==================================================

    if (scale === "Viridis") {

        const stops = [
            [68, 1, 84],
            [59, 82, 139],
            [33, 145, 140],
            [94, 201, 98],
            [253, 231, 37]
        ];


        const position =
            normalized *
            (stops.length - 1);


        const index =
            Math.floor(position);


        const fraction =
            position - index;


        if (index >= stops.length - 1) {

            const last =
                stops[stops.length - 1];


            return {
                r: last[0],
                g: last[1],
                b: last[2]
            };
        }


        const start =
            stops[index];

        const end =
            stops[index + 1];


        return {

            r: Math.round(
                start[0] +
                (end[0] - start[0]) *
                fraction
            ),

            g: Math.round(
                start[1] +
                (end[1] - start[1]) *
                fraction
            ),

            b: Math.round(
                start[2] +
                (end[2] - start[2]) *
                fraction
            )
        };
    }


    // ==================================================
    // GRAYSCALE
    // ==================================================

    if (scale === "Grayscale") {

        const value =
            Math.round(
                normalized * 255
            );


        return {
            r: value,
            g: value,
            b: value
        };
    }


    // ==================================================
    // THERMAL
    // ==================================================

    const stops = [
        [0, 80, 150],
        [0, 180, 255],
        [0, 255, 175],
        [255, 255, 0],
        [255, 0, 0]
    ];


    const position =
        normalized *
        (stops.length - 1);


    const index =
        Math.floor(position);


    const fraction =
        position - index;


    if (index >= stops.length - 1) {

        const last =
            stops[stops.length - 1];


        return {
            r: last[0],
            g: last[1],
            b: last[2]
        };
    }


    const start =
        stops[index];

    const end =
        stops[index + 1];


    return {

        r: Math.round(
            start[0] +
            (end[0] - start[0]) *
            fraction
        ),

        g: Math.round(
            start[1] +
            (end[1] - start[1]) *
            fraction
        ),

        b: Math.round(
            start[2] +
            (end[2] - start[2]) *
            fraction
        )
    };
}



// ==================================================
// DRAW HEATMAP
// ==================================================

window.cptDrawHeatmap = function (
    canvas,
    temperature,
    gridWidth,
    gridHeight,
    minimumTemperature,
    maximumTemperature,
    colorMap,
    showGrid,
    equalAspectRatio
) {

    if (!canvas) {

        console.error(
            "HEATMAP: Canvas is null."
        );

        return;
    }


    if (
        !temperature ||
        temperature.length === 0
    ) {

        console.warn(
            "HEATMAP: Temperature data is empty."
        );

        return;
    }


    if (
        gridWidth <= 0 ||
        gridHeight <= 0
    ) {

        console.error(
            `HEATMAP: Invalid grid size ${gridWidth}x${gridHeight}`
        );

        return;
    }


    // ==================================================
    // GET ACTUAL CONTAINER
    // ==================================================

    const container =
        canvas.parentElement;


    if (!container) {

        console.error(
            "HEATMAP: Canvas parent container not found."
        );

        return;
    }


    const containerWidth =
        container.clientWidth;


    // ==================================================
    // ACCOUNT FOR CONTAINER PADDING
    // ==================================================

    const computedStyle =
        window.getComputedStyle(
            container
        );


    const paddingLeft =
        parseFloat(
            computedStyle.paddingLeft
        ) || 0;


    const paddingRight =
        parseFloat(
            computedStyle.paddingRight
        ) || 0;


    const availableWidth =
        containerWidth -
        paddingLeft -
        paddingRight;


    // ==================================================
    // FINAL DISPLAY WIDTH
    // ==================================================

    const width =
        Math.max(
            1,
            Math.floor(
                availableWidth
            )
        );


    // ==================================================
    // PRESERVE GRID ASPECT RATIO
    // ==================================================

    let height;


    if (equalAspectRatio) {

        height =
            Math.max(
                1,
                Math.round(
                    width *
                    (gridHeight / gridWidth)
                )
            );
    }
    else {

        height =
            Math.max(
                1,
                Math.round(width)
            );
    }


    // ==================================================
    // CANVAS DISPLAY SIZE
    // ==================================================

    canvas.style.width =
        `${width}px`;

    canvas.style.height =
        `${height}px`;

    canvas.style.display =
        "block";

    canvas.style.maxWidth =
        "100%";

    canvas.style.margin =
        "0 auto";


    // ==================================================
    // CANVAS INTERNAL SIZE
    // ==================================================

    /*
     * IMPORTANT:
     *
     * Do NOT multiply the canvas dimensions
     * by devicePixelRatio here.
     *
     * putImageData() writes directly to the
     * canvas pixel coordinate system.
     *
     * Keeping the internal canvas size equal
     * to the CSS display size guarantees that
     * mobile devices do not receive a 2x/3x
     * backing canvas while only drawing a smaller
     * image into its top-left corner.
     */

    canvas.width =
        width;

    canvas.height =
        height;


    // ==================================================
    // CANVAS CONTEXT
    // ==================================================

    const context =
        canvas.getContext("2d");


    if (!context) {

        console.error(
            "HEATMAP: Unable to create canvas context."
        );

        return;
    }


    // ==================================================
    // RESET TRANSFORM
    // ==================================================

    context.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );


    // ==================================================
    // CLEAR CANVAS
    // ==================================================

    context.clearRect(
        0,
        0,
        width,
        height
    );


    // ==================================================
    // CREATE IMAGE DATA
    // ==================================================

    const imageData =
        context.createImageData(
            width,
            height
        );


    const pixels =
        imageData.data;


    // ==================================================
    // TEMPERATURE RANGE
    // ==================================================

    const range =
        maximumTemperature -
        minimumTemperature;


    // ==================================================
    // DRAW HEATMAP
    // ==================================================

    for (
        let y = 0;
        y < height;
        y++
    ) {

        const sourceY =
            Math.min(
                gridHeight - 1,
                Math.floor(
                    y *
                    gridHeight /
                    height
                )
            );


        const row =
            temperature[sourceY];


        if (!row) {
            continue;
        }


        for (
            let x = 0;
            x < width;
            x++
        ) {

            const sourceX =
                Math.min(
                    gridWidth - 1,
                    Math.floor(
                        x *
                        gridWidth /
                        width
                    )
                );


            const value =
                row[sourceX];


            let normalized;


            if (
                value === undefined ||
                value === null ||
                !Number.isFinite(value)
            ) {

                normalized = 0.5;

            }
            else if (range === 0) {

                normalized = 0.5;

            }
            else {

                normalized =
                    (
                        value -
                        minimumTemperature
                    ) /
                    range;


                normalized =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            normalized
                        )
                    );
            }


            const rgb =
                getHeatmapTemperatureColor(
                    normalized,
                    colorMap
                );


            const pixelIndex =
                (
                    y *
                    width +
                    x
                ) * 4;


            pixels[pixelIndex] =
                rgb.r;

            pixels[pixelIndex + 1] =
                rgb.g;

            pixels[pixelIndex + 2] =
                rgb.b;

            pixels[pixelIndex + 3] =
                255;
        }
    }


    // ==================================================
    // PUT IMAGE ON CANVAS
    // ==================================================

    context.putImageData(
        imageData,
        0,
        0
    );


    // ==================================================
    // OPTIONAL GRID
    // ==================================================

    if (showGrid) {

        context.strokeStyle =
            "rgba(255,255,255,0.15)";

        context.lineWidth =
            0.5;


        const gridStepX =
            width /
            gridWidth;


        const gridStepY =
            height /
            gridHeight;


        for (
            let x = 0;
            x <= gridWidth;
            x++
        ) {

            const position =
                x *
                gridStepX;


            context.beginPath();

            context.moveTo(
                position,
                0
            );

            context.lineTo(
                position,
                height
            );

            context.stroke();
        }


        for (
            let y = 0;
            y <= gridHeight;
            y++
        ) {

            const position =
                y *
                gridStepY;


            context.beginPath();

            context.moveTo(
                0,
                position
            );

            context.lineTo(
                width,
                position
            );

            context.stroke();
        }
    }
};





















