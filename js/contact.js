document.addEventListener("DOMContentLoaded", () => {
  const rollButton = document.querySelector(".roll-btn");
  const scrollElement = document.querySelector(".scroll");
  const leftRollElement = document.querySelector(".left-roll");

  const rollWidthPercentage = 0.15;
  let animationFrameId = null;
  let isRolled = false;

  const animationDuration = 1200;
  const waitDuration = 1000;

  function animateRoll(timestamp, animParams) {
    const {
      startTime,
      startRollLeft,
      targetRollLeft,
      startClipLeft,
      targetClipLeft,
      duration,
      finalParchmentIsRolled,
      finalRollElementLeft,
      finalRollElementTop,
      finalRollElementWidth,
      finalRollElementHeight,
      finalScrollClipLeft,
    } = animParams;

    const elapsedTime = timestamp - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const currentRollLeft =
      startRollLeft + (targetRollLeft - startRollLeft) * progress;
    leftRollElement.style.left = `${currentRollLeft}px`;

    const currentClipLeft =
      startClipLeft + (targetClipLeft - startClipLeft) * progress;
    scrollElement.style.clipPath = `inset(0 0 0 ${currentClipLeft}px)`;

    const scrollContent = scrollElement.querySelectorAll("h2, .form-container");
    // Opacity fades out when rolling (targetClipLeft > startClipLeft, which is true for your roll-up)
    // Opacity fades in when unrolling (targetClipLeft < startClipLeft, which is true for your unroll)
    const opacityProgress =
      targetClipLeft > startClipLeft ? 1 - progress : progress;
    scrollContent.forEach(
      (content) => (content.style.opacity = opacityProgress)
    );

    if (progress < 1) {
      animationFrameId = requestAnimationFrame((newTime) =>
        animateRoll(newTime, animParams)
      );
    } else {
      // Current animation segment finished
      animationFrameId = null;

      // Apply the pre-calculated final state for THIS segment precisely
      leftRollElement.style.left = `${finalRollElementLeft}px`;
      leftRollElement.style.top = `${finalRollElementTop}px`;
      leftRollElement.style.width = `${finalRollElementWidth}px`;
      leftRollElement.style.height = `${finalRollElementHeight}px`;
      scrollElement.style.clipPath = `inset(0 0 0 ${finalScrollClipLeft}px)`; // Use the final clip value
      scrollContent.forEach(function (content) {
        // 2. Use an if/else statement instead of the ternary operator
        if (finalParchmentIsRolled === true) {
          // or just `if (finalParchmentIsRolled)`
          content.style.opacity = 0;
        } else {
          content.style.opacity = 1;
        }
      });

      if (finalParchmentIsRolled === true && isRolled === false) {
        // Just finished ROLLING UP
        isRolled = true;
        rollButton.textContent = "Waiting...";
        // Button remains disabled

        setTimeout(() => {
          const scrollRect = scrollElement.getBoundingClientRect();
          const contactRect =
            scrollElement.parentElement.getBoundingClientRect();
          const currentRelativeScrollTop = scrollRect.top - contactRect.top;
          const currentRelativeScrollLeft = scrollRect.left - contactRect.left;
          const currentScrollWidth = scrollRect.width;
          const currentScrollHeight = scrollRect.height;
          const calculatedRollWidth = currentScrollWidth * rollWidthPercentage;

          // Parameters for UNROLLING, using your original logic for clip values
          const unrollAnimParams = {
            startTime: performance.now(),
            // Start from the final state of the .left-roll after rolling up
            startRollLeft: finalRollElementLeft,
            // Target the initial left position for .left-roll
            targetRollLeft: currentRelativeScrollLeft,

            // **USING YOUR ORIGINAL VALUES FOR UNROLLING**
            startClipLeft: currentScrollWidth - 100, // Corresponds to your original 'else' block's startClipLeft for unrolling
            targetClipLeft: 100, // Corresponds to your original 'else' block's targetClipLeft for unrolling

            duration: animationDuration,

            finalParchmentIsRolled: false,
            finalRollElementLeft: currentRelativeScrollLeft,
            finalRollElementTop: currentRelativeScrollTop,
            finalRollElementWidth: calculatedRollWidth,
            finalRollElementHeight: currentScrollHeight,
            finalScrollClipLeft: 0, // Corresponds to your original 'else' block's finalScrollClipLeft
          };
          rollButton.textContent = "Unrolling...";
          animationFrameId = requestAnimationFrame((newTime) =>
            animateRoll(newTime, unrollAnimParams)
          );
        }, waitDuration);
      } else if (finalParchmentIsRolled === false && isRolled === true) {
        // Just finished UNROLLING
        isRolled = false;
        rollButton.textContent = "Roll Parchment";
        rollButton.disabled = false;
      }
    }
  }

  rollButton.addEventListener("click", () => {
    if (animationFrameId || isRolled) {
      return;
    }

    const scrollRect = scrollElement.getBoundingClientRect();
    const contactRect = scrollElement.parentElement.getBoundingClientRect();
    const currentRelativeScrollTop = scrollRect.top - contactRect.top;
    const currentRelativeScrollLeft = scrollRect.left - contactRect.left;
    const currentScrollWidth = scrollRect.width;
    const currentScrollHeight = scrollRect.height;
    const calculatedRollWidth = currentScrollWidth * rollWidthPercentage;

    const animStartRollLeft = currentRelativeScrollLeft;
    const animTargetRollLeft =
      currentRelativeScrollLeft + currentScrollWidth - calculatedRollWidth;

    // Parameters for ROLLING UP, using your original logic for clip values
    const rollUpAnimParams = {
      startTime: performance.now(),
      startRollLeft: animStartRollLeft,
      targetRollLeft: animTargetRollLeft,

      // **USING YOUR ORIGINAL VALUES FOR ROLLING UP**
      startClipLeft: 100, // Corresponds to your original 'if (!isRolled)' block
      targetClipLeft: currentScrollWidth - 100, // Corresponds to your original 'if (!isRolled)' block

      duration: animationDuration,

      finalParchmentIsRolled: true,
      finalRollElementLeft: animTargetRollLeft,
      finalRollElementTop: currentRelativeScrollTop,
      finalRollElementWidth: calculatedRollWidth,
      finalRollElementHeight: currentScrollHeight,
      finalScrollClipLeft: currentScrollWidth, // Corresponds to your original 'if (!isRolled)' block
    };

    rollButton.textContent = "Rolling...";
    rollButton.disabled = true;
    animationFrameId = requestAnimationFrame((timestamp) =>
      animateRoll(timestamp, rollUpAnimParams)
    );
  });
});
