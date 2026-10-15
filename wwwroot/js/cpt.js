// ==================================================
// CAPACITOR DOWNLOAD SUPPORT
// ==================================================

window.cptIsNativeAndroid = () => {
    return !!(
        window.Capacitor &&
        window.Capacitor.isNativePlatform &&
        window.Capacitor.isNativePlatform() &&
        window.Capacitor.getPlatform() === "android"
    );
};



window.cptDownloadFile = async (fileName, contentType, content) => {

    // ==============================================
    // ANDROID / CAPACITOR
    // ==============================================

    if (window.cptIsNativeAndroid && window.cptIsNativeAndroid()) {

        try {

            const base64Data = btoa(
                String.fromCharCode(
                    ...new Uint8Array(content)
                )
            );

            const Filesystem =
                window.Capacitor.Plugins.Filesystem;

            const Share =
                window.Capacitor.Plugins.Share;

            const result =
                await Filesystem.writeFile({
                    path: fileName,
                    data: base64Data,
                    directory: "Cache",
                    recursive: true
                });

            await Share.share({
                title: fileName,
                text: `CPT exported file: ${fileName}`,
                url: result.uri,
                dialogTitle: "Save or share file"
            });

        }
        catch (error) {

            console.error(
                "CPT Android download failed:",
                error
            );
        }

        return;
    }


    // ==============================================
    // NORMAL WEB BROWSER
    // ==============================================

    const blob =
        new Blob([content], {
            type: contentType
        });

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href =
        url;

    link.download =
        fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

