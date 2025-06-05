document.addEventListener("DOMContentLoaded", function () {
  const rollButton = document.querySelector(".submit");
  const scrollElement = document.querySelector(".scroll");
  const leftRollElement = document.querySelector(".left-roll");

  const scrollContainer = document.querySelector(".scroll-container");
  const formContainer = document.querySelector(".form-container");
  const messageTextarea = document.getElementById("message");
  const submitButton = document.querySelector(".submit"); // Get the button element

  // Check if all elements exist before adding listeners
  if (scrollContainer && formContainer && messageTextarea && submitButton) {
    scrollContainer.addEventListener("click", function (event) {
      // IMPORTANT: Prevent focusing if the clicked element is the submit button itself
      // This ensures the button's default behavior (form submission) is not interrupted.
      if (
        event.target === submitButton ||
        submitButton.contains(event.target)
      ) {
        return; // Do nothing, let the button handle its own click
      }

      // Add a class to the form-container to make the textarea visible
      formContainer.classList.add("show-textarea");

      // Set focus to the textarea
      messageTextarea.focus();
    });
  }

  const rollWidthPercentage = 0.15;
  let animationFrameId = null;
  let isRolled = false;

  const animationDuration = 1200;
  const waitDuration = 1000;

  function animateRoll(timestamp, animParams) {
    const startTime = animParams.startTime;
    const startRollLeft = animParams.startRollLeft;
    const targetRollLeft = animParams.targetRollLeft;
    const startClipLeft = animParams.startClipLeft;
    const targetClipLeft = animParams.targetClipLeft;
    const duration = animParams.duration;
    const finalParchmentIsRolled = animParams.finalParchmentIsRolled;
    const finalRollElementLeft = animParams.finalRollElementLeft;
    const finalRollElementTop = animParams.finalRollElementTop;
    const finalRollElementWidth = animParams.finalRollElementWidth;
    const finalRollElementHeight = animParams.finalRollElementHeight;
    const finalScrollClipLeft = animParams.finalScrollClipLeft;

    const elapsedTime = timestamp - startTime;
    let progress = elapsedTime / duration;
    if (progress > 1) {
      progress = 1;
    }

    const currentRollLeft =
      startRollLeft + (targetRollLeft - startRollLeft) * progress;
    leftRollElement.style.left = currentRollLeft + "px";

    const currentClipLeft =
      startClipLeft + (targetClipLeft - startClipLeft) * progress;
    scrollElement.style.clipPath = "inset(0 0 0 " + currentClipLeft + "px)";

    const scrollContent = scrollElement.querySelectorAll("h2, .form-container");
    let opacityProgress;
    if (targetClipLeft > startClipLeft) {
      opacityProgress = 1 - progress;
    } else {
      opacityProgress = progress;
    }

    for (let i = 0; i < scrollContent.length; i++) {
      scrollContent[i].style.opacity = opacityProgress;
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(function (newTimestamp) {
        animateRoll(newTimestamp, animParams);

        // Shadow logic
        const totalDistance = Math.abs(targetRollLeft - startRollLeft);
        const currentDistance = Math.abs(currentRollLeft - startRollLeft);

        const fadeStart = 10;
        const fadeEnd = totalDistance - 10;

        if (currentDistance >= fadeStart && currentDistance <= fadeEnd) {
          let shadowOpacity;

          if (currentDistance < fadeStart + 100) {
            shadowOpacity = ((currentDistance - fadeStart) / 10) * 0.8;
          } else if (currentDistance > fadeEnd - 10) {
            shadowOpacity = ((fadeEnd - currentDistance) / 10) * 0.8;
          } else {
            shadowOpacity = 0.8;
          }

          shadowOpacity = Math.max(0, Math.min(0.8, shadowOpacity)); // Clamp
          leftRollElement.style.filter = `drop-shadow(40px 0px 20px rgba(0, 0, 0, ${shadowOpacity}))`;
        } else {
          leftRollElement.style.filter = "none";
        }
      });
    } else {
      animationFrameId = null;

      leftRollElement.style.left = finalRollElementLeft + "px";
      leftRollElement.style.top = finalRollElementTop + "px";
      leftRollElement.style.width = finalRollElementWidth + "px";
      leftRollElement.style.height = finalRollElementHeight + "px";

      scrollElement.style.clipPath =
        "inset(0 0 0 " + finalScrollClipLeft + "px)";

      for (let j = 0; j < scrollContent.length; j++) {
        if (finalParchmentIsRolled === true) {
          scrollContent[j].style.opacity = 0;
        } else {
          scrollContent[j].style.opacity = 1;
        }
      }

      if (finalParchmentIsRolled === true && isRolled === false) {
        messageTextarea.placeholder =
          "Votre message a bien été envoyé à la mer !\nNotre équipage y répondra rapidement.";
        messageTextarea.classList.add("center-placeholder");
        // messageTextarea.style.color = "var(--color-blue)";
        messageTextarea.value = "";

        isRolled = true;

        setTimeout(function () {
          const scrollRect = scrollElement.getBoundingClientRect();
          const contactRect =
            scrollElement.parentElement.getBoundingClientRect();

          const currentRelativeScrollTop = scrollRect.top - contactRect.top;
          const currentRelativeScrollLeft = scrollRect.left - contactRect.left;
          const currentScrollWidth = scrollRect.width;
          const currentScrollHeight = scrollRect.height;
          const calculatedRollWidth = currentScrollWidth * rollWidthPercentage;

          const unrollAnimParams = {
            startTime: performance.now(),
            startRollLeft: finalRollElementLeft,
            targetRollLeft: currentRelativeScrollLeft,
            startClipLeft: currentScrollWidth - 100,
            targetClipLeft: 100,
            duration: animationDuration,
            finalParchmentIsRolled: false,
            finalRollElementLeft: currentRelativeScrollLeft,
            finalRollElementTop: currentRelativeScrollTop,
            finalRollElementWidth: calculatedRollWidth,
            finalRollElementHeight: currentScrollHeight,
            finalScrollClipLeft: 0,
          };

          animationFrameId = requestAnimationFrame(function (newTime) {
            animateRoll(newTime, unrollAnimParams);
          });
        }, waitDuration);
      } else if (finalParchmentIsRolled === false && isRolled === true) {
        isRolled = false;
        rollButton.disabled = false;
      }
    }
  }

  rollButton.addEventListener("click", function () {
    if (animationFrameId !== null || isRolled === true) {
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

    const rollUpAnimParams = {
      startTime: performance.now(),
      startRollLeft: animStartRollLeft,
      targetRollLeft: animTargetRollLeft,
      startClipLeft: 100,
      targetClipLeft: currentScrollWidth - 100,
      duration: animationDuration,
      finalParchmentIsRolled: true,
      finalRollElementLeft: animTargetRollLeft,
      finalRollElementTop: currentRelativeScrollTop,
      finalRollElementWidth: calculatedRollWidth,
      finalRollElementHeight: currentScrollHeight,
      finalScrollClipLeft: currentScrollWidth,
    };

    rollButton.disabled = true;

    animationFrameId = requestAnimationFrame(function (timestamp) {
      animateRoll(timestamp, rollUpAnimParams);
    });
  });
});
