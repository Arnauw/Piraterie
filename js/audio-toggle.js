const audio = document.getElementById('bg-audio');
const btn = document.getElementById('toggle-audio');

btn.addEventListener('click', function() {
  if (audio.paused) {
    audio.play();
    btn.textContent = "Couper le son";
  } else {
    audio.pause();
    btn.textContent = "Activer le son";
  }
});
