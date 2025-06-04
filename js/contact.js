document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.querySelector('.roll-btn'); // Ensure this class matches your button
    const scrollElement = document.querySelector('.scroll');
    const leftRollElement = document.querySelector('.left-roll');

    if (!scrollElement || !leftRollElement || !rollButton) {
        console.error('Required elements not found!');
        return;
    }

    const ROLL_WIDTH_PERCENTAGE = 0.15;
    let animationFrameId = null;
    let isRolled = false; // True if the parchment is currently in the "rolled up" state

    // Function to set the .left-roll's position and size based on .scroll's current state
    // and whether it's supposed to be rolled or unrolled.
    function syncLeftRollToScrollState() {
        const scrollRect = scrollElement.getBoundingClientRect();
        // Parent for relative positioning (e.g., .contact)
        const contactRect = scrollElement.parentElement.getBoundingClientRect();

        const relativeScrollTop = scrollRect.top - contactRect.top;
        const relativeScrollLeft = scrollRect.left - contactRect.left;

        leftRollElement.style.top = `${relativeScrollTop}px`;
        leftRollElement.style.height = `${scrollRect.height}px`;

        const calculatedRollWidth = scrollRect.width * ROLL_WIDTH_PERCENTAGE;
        leftRollElement.style.width = `${calculatedRollWidth}px`;

        if (isRolled) {
            // Position for "rolled up" state: right edge of roll aligns with right edge of scroll
            leftRollElement.style.left = `${relativeScrollLeft + scrollRect.width - calculatedRollWidth}px`;
        } else {
            // Position for "unrolled" state: left edge of roll aligns with left edge of scroll
            leftRollElement.style.left = `${relativeScrollLeft}px`;
        }
    }

    // Initial setup: parchment is unrolled
    isRolled = false;
    syncLeftRollToScrollState();

    window.addEventListener('resize', () => {
        if (!animationFrameId) { // Only update if not currently animating
            syncLeftRollToScrollState(); // Re-sync based on current isRolled state
        }
    });

    function animateRoll(timestamp, animParams) {
        const {
            startTime,
            startRollLeft, targetRollLeft, // For .left-roll's 'left'
            startClipLeft, targetClipLeft, // For .scroll's clip-path
            duration,
            // Parameters for the precise final state after this animation segment finishes
            finalParchmentIsRolled, // The state of `isRolled` AFTER this animation
            finalRollElementLeft, finalRollElementTop,
            finalRollElementWidth, finalRollElementHeight,
            finalScrollClipLeft
        } = animParams;

        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Interpolate .left-roll's 'left' position
        const currentRollLeft = startRollLeft + (targetRollLeft - startRollLeft) * progress;
        leftRollElement.style.left = `${currentRollLeft}px`;

        // Interpolate .scroll's clip-path
        const currentClipLeft = startClipLeft + (targetClipLeft - startClipLeft) * progress;
        scrollElement.style.clipPath = `inset(0 0 0 ${currentClipLeft}px)`;

        // Fade content: if rolling up (targetClipLeft > startClipLeft), fade out (1 to 0)
        // if unrolling (targetClipLeft < startClipLeft), fade in (0 to 1)
        const scrollContent = scrollElement.querySelectorAll('h2, .form-container');
        const opacityProgress = (targetClipLeft > startClipLeft) ? (1 - progress) : progress;
        scrollContent.forEach(content => content.style.opacity = opacityProgress);

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(newTime => animateRoll(newTime, animParams));
        } else { // Animation finished
            animationFrameId = null;
            isRolled = finalParchmentIsRolled; // Update the global state

            // Apply the pre-calculated final state precisely
            leftRollElement.style.left = `${finalRollElementLeft}px`;
            leftRollElement.style.top = `${finalRollElementTop}px`;
            leftRollElement.style.width = `${finalRollElementWidth}px`;
            leftRollElement.style.height = `${finalRollElementHeight}px`;
            scrollElement.style.clipPath = `inset(0 0 0 ${finalScrollClipLeft}px)`;

            // Ensure content opacity is at its final value
            scrollContent.forEach(content => content.style.opacity = finalParchmentIsRolled ? 0 : 1);

            rollButton.textContent = isRolled ? "Reset Parchment" : "Roll Parchment";
        }
    }

    rollButton.addEventListener('click', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            // If animation was interrupted, the `isRolled` state might be out of sync
            // with the visual. Call sync to fix visual based on last `isRolled` state.
            syncLeftRollToScrollState();
        }

        // Get current dimensions and positions using getBoundingClientRect for precision
        const scrollRect = scrollElement.getBoundingClientRect();
        const contactRect = scrollElement.parentElement.getBoundingClientRect(); // Parent (e.g., .contact)

        const currentRelativeScrollTop = scrollRect.top - contactRect.top;
        const currentRelativeScrollLeft = scrollRect.left - contactRect.left;
        const currentScrollWidth = scrollRect.width;
        const currentScrollHeight = scrollRect.height;

        const calculatedRollWidth = currentScrollWidth * ROLL_WIDTH_PERCENTAGE;

        let animParams = {};
        const animationDuration = 1600;

        if (!isRolled) { // === Current state: UNROLLED. Action: ROLL IT UP ===
            // Start animation from current visual state of .left-roll
            const animStartRollLeft = currentRelativeScrollLeft; // Left edge of scroll
            // Target state for .left-roll
            const animTargetRollLeft = currentRelativeScrollLeft + currentScrollWidth - calculatedRollWidth;

            animParams = {
                startTime: performance.now(),
                startRollLeft: animStartRollLeft,
                targetRollLeft: animTargetRollLeft,
                startClipLeft: 100,                       // Scroll starts unclipped
                targetClipLeft: currentScrollWidth - 100,     // Scroll ends fully clipped from left

                duration: animationDuration,

                finalParchmentIsRolled: true, // State AFTER this animation
                finalRollElementLeft: animTargetRollLeft, // .left-roll's final 'left'
                finalRollElementTop: currentRelativeScrollTop,
                finalRollElementWidth: calculatedRollWidth,
                finalRollElementHeight: currentScrollHeight,
                finalScrollClipLeft: currentScrollWidth
            };
            rollButton.textContent = "Rolling...";
            // Note: isRolled is updated *after* animation in this model
        } else { // === Current state: ROLLED. Action: UNROLL IT ===
            // Start animation from current visual state of .left-roll
            const animStartRollLeft = currentRelativeScrollLeft + currentScrollWidth - calculatedRollWidth;
            // Target state for .left-roll
            const animTargetRollLeft = currentRelativeScrollLeft; // Back to left edge of scroll

            animParams = {
                startTime: performance.now(),
                startRollLeft: animStartRollLeft,
                targetRollLeft: animTargetRollLeft,
                startClipLeft: currentScrollWidth - 100,      // Scroll starts fully clipped
                targetClipLeft: 100,                      // Scroll ends unclipped

                duration: animationDuration,

                finalParchmentIsRolled: false, // State AFTER this animation
                finalRollElementLeft: animTargetRollLeft,
                finalRollElementTop: currentRelativeScrollTop,
                finalRollElementWidth: calculatedRollWidth,
                finalRollElementHeight: currentScrollHeight,
                finalScrollClipLeft: 0
            };
            rollButton.textContent = "Unrolling...";
        }

        animationFrameId = requestAnimationFrame(timestamp => animateRoll(timestamp, animParams));
    });
});