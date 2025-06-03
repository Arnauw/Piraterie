document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('rollButton');
    const scrollElement = document.querySelector('.contact .scroll');
    const leftRollElement = document.querySelector('.contact .left-roll'); // Now a sibling

    if (!scrollElement || !leftRollElement || !rollButton) {
        console.error('Required elements not found!');
        return;
    }

    let animationFrameId = null;
    let isRolled = false; // To toggle state

    // Function to position and size the left-roll element based on the scroll element
    function updateLeftRollAppearance() {
        const scrollRect = scrollElement.getBoundingClientRect(); // Gets dimensions and position relative to viewport
        const contactRect = scrollElement.parentElement.getBoundingClientRect(); // .contact

        // Calculate top and left relative to the .contact parent
        const scrollOffsetTop = scrollRect.top - contactRect.top;
        const scrollOffsetLeft = scrollRect.left - contactRect.left;
        
        const scrollCurrentWidth = scrollElement.offsetWidth; // scrollRect.width is also fine
        const scrollCurrentHeight = scrollElement.offsetHeight; // scrollRect.height

        leftRollElement.style.top = `${scrollOffsetTop}px`;
        leftRollElement.style.height = `${scrollCurrentHeight}px`;
        // The roll's width is a percentage of the scroll's width (e.g., 15%)
        const rollWidthPercentage = 0.15; // Assuming 15%
        const currentRollWidth = scrollCurrentWidth * rollWidthPercentage;
        leftRollElement.style.width = `${currentRollWidth}px`;

        if (isRolled) {
            // If rolled, position it at the right edge of where the scroll was
            leftRollElement.style.left = `${scrollOffsetLeft + scrollCurrentWidth - currentRollWidth}px`;
        } else {
            // If not rolled (or unrolled), position it at the left edge
            leftRollElement.style.left = `${scrollOffsetLeft}px`;
        }
    }

    // Initial setup
    updateLeftRollAppearance();

    // Update on window resize
    window.addEventListener('resize', () => {
        if (!animationFrameId) { // Only update if not currently animating
            updateLeftRollAppearance();
        }
    });

    function animateRoll(timestamp, startParams) {
        const {
            startTime,
            startRollLeft, startClipLeft,
            targetRollLeft, targetClipLeft,
            duration
        } = startParams;

        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        const currentRollLeft = startRollLeft + (targetRollLeft - startRollLeft) * progress;
        const currentClipLeft = startClipLeft + (targetClipLeft - startClipLeft) * progress;

        leftRollElement.style.left = `${currentRollLeft}px`;
        scrollElement.style.clipPath = `inset(0 0 0 ${currentClipLeft}px)`;

        // Fade out content within .scroll
        const scrollContent = scrollElement.querySelectorAll('h2, .form-container');
        scrollContent.forEach(content => {
            content.style.opacity = 1 - progress;
        });

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(newTime => animateRoll(newTime, startParams));
        } else {
            animationFrameId = null;
            rollButton.textContent = isRolled ? "Reset Parchment" : "Roll Parchment";
            // Ensure final states
            if (isRolled) {
                scrollContent.forEach(content => content.style.opacity = 0);
                leftRollElement.style.left = `${targetRollLeft}px`; // Ensure precise final position
                scrollElement.style.clipPath = `inset(0 0 0 ${targetClipLeft}px)`;
            } else {
                scrollContent.forEach(content => content.style.opacity = 1);
                // On unroll, updateLeftRollAppearance will set the correct left for the roll.
                updateLeftRollAppearance(); // Make sure it's perfectly aligned
            }
        }
    }

    rollButton.addEventListener('click', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        // Ensure current appearance is correct before calculating animation parameters
        updateLeftRollAppearance();

        const scrollWidth = scrollElement.offsetWidth;
        const scrollOffsetLeft = scrollElement.offsetLeft; // Left of .scroll relative to .contact
        const rollWidth = leftRollElement.offsetWidth;   // Actual current width of the roll

        const animationDuration = 1500; // milliseconds
        let startParams;

        if (!isRolled) { // === Action: Roll it up ===
            startParams = {
                startTime: performance.now(),
                startRollLeft: scrollOffsetLeft, // Starts at the left edge of scroll
                startClipLeft: 0,               // Scroll is initially not clipped
                targetRollLeft: scrollOffsetLeft + scrollWidth - rollWidth, // Roll ends at right edge of scroll
                targetClipLeft: scrollWidth,    // Scroll is fully clipped from the left
                duration: animationDuration
            };
            isRolled = true;
            rollButton.textContent = "Rolling...";
        } else { // === Action: Unroll it ===
            // Current position of the roll (should be at the right edge)
            const currentActualRollLeft = parseFloat(leftRollElement.style.left);
            // Current clip of the scroll (should be fully clipped)
            const currentActualClipLeft = scrollWidth; // Assuming it was fully clipped

            startParams = {
                startTime: performance.now(),
                startRollLeft: currentActualRollLeft,
                startClipLeft: currentActualClipLeft,
                targetRollLeft: scrollOffsetLeft, // Roll returns to left edge of scroll
                targetClipLeft: 0,               // Scroll becomes fully unclipped
                duration: animationDuration
            };
            isRolled = false;
            rollButton.textContent = "Unrolling...";
            // Make scroll content visible immediately for unroll
            const scrollContent = scrollElement.querySelectorAll('h2, .form-container');
            scrollContent.forEach(content => content.style.opacity = 1); // Start making visible
        }

        animationFrameId = requestAnimationFrame(timestamp => animateRoll(timestamp, startParams));
    });
});