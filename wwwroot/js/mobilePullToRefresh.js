(() => {
    // Only enable this behavior inside the Capacitor Android app.
    if (!window.Capacitor) {
        return;
    }

    const isAndroid =
        window.Capacitor.getPlatform &&
        window.Capacitor.getPlatform() === "android";

    if (!isAndroid) {
        return;
    }

    let startY = 0;
    let startX = 0;
    let pulling = false;
    let refreshing = false;

    const threshold = 80;

    function isInteractiveElement(element) {
        if (!element) {
            return false;
        }

        return !!element.closest(
            "input, textarea, select, button, a, canvas, [role='button'], [data-no-pull-refresh]"
        );
    }

    function isAtTop() {
        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;

        return scrollTop <= 0;
    }

    document.addEventListener(
        "touchstart",
        (event) => {
            if (refreshing || event.touches.length !== 1) {
                return;
            }

            const touch = event.touches[0];

            if (!isAtTop()) {
                pulling = false;
                return;
            }

            if (isInteractiveElement(event.target)) {
                pulling = false;
                return;
            }

            startY = touch.clientY;
            startX = touch.clientX;
            pulling = true;
        },
        { passive: true }
    );

    document.addEventListener(
        "touchmove",
        (event) => {
            if (!pulling || refreshing || event.touches.length !== 1) {
                return;
            }

            const touch = event.touches[0];

            const deltaY = touch.clientY - startY;
            const deltaX = touch.clientX - startX;

            // Cancel if the gesture is primarily horizontal.
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                pulling = false;
                return;
            }

            // Only respond to a downward gesture.
            if (deltaY <= 0) {
                return;
            }

            // If the page is no longer at the top, stop tracking.
            if (!isAtTop()) {
                pulling = false;
                return;
            }

            // Do not interfere with normal scrolling.
            if (deltaY < threshold) {
                return;
            }

            // Pull-to-refresh threshold reached.
            event.preventDefault();
        },
        { passive: false }
    );

    document.addEventListener(
        "touchend",
        (event) => {
            if (!pulling || refreshing) {
                return;
            }

            const touch =
                event.changedTouches && event.changedTouches.length
                    ? event.changedTouches[0]
                    : null;

            if (!touch) {
                pulling = false;
                return;
            }

            const deltaY = touch.clientY - startY;

            pulling = false;

            if (deltaY >= threshold && isAtTop()) {
                refreshing = true;

                // Give the gesture a tiny moment to finish naturally.
                setTimeout(() => {
                    window.location.reload();
                }, 50);
            }
        },
        { passive: true }
    );

    document.addEventListener(
        "touchcancel",
        () => {
            pulling = false;
        },
        { passive: true }
    );
})();