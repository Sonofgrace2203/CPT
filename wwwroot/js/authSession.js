window.cptAuthSession = {
    initialize: function () {
        let lastRecorded = 0;

        const recordActivity = function () {
            const now = Date.now();

            // Avoid writing to localStorage on every mouse movement.
            if (now - lastRecorded < 30000) {
                return;
            }

            lastRecorded = now;

            localStorage.setItem(
                "cpt_last_activity",
                now.toString()
            );
        };

        const events = [
            "click",
            "keydown",
            "touchstart",
            "scroll",
            "mousemove"
        ];

        events.forEach(function (eventName) {
            document.addEventListener(
                eventName,
                recordActivity,
                { passive: true }
            );
        });

        // Record the initial visit.
        recordActivity();
    },

    getLastActivity: function () {
        return localStorage.getItem(
            "cpt_last_activity"
        );
    }
};