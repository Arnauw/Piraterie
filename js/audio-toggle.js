let audios = document.querySelectorAll('.bg-audio');
let btns = document.querySelectorAll('.toggle-audio');

for (let i = 0; i < audios.length && i < btns.length; i++) {
  btns[i].addEventListener('click', function() {
    if (audios[i].paused) {
      audios[i].play();
      btns[i].textContent = "Couper le son";
    } else {
      audios[i].pause();
      btns[i].textContent = "Activer le son";
    }
  });
}


//  Manière longue mais sure pour débutant.
// 
// document.addEventListener("DOMContentLoaded", () => {
//   const btn1 = document.querySelector(".toggle-audio-1");
//   const btn2 = document.querySelector(".toggle-audio-2");
//   const audio1 = document.querySelector(".bg-audio-1");
//   const audio2 = document.querySelector(".bg-audio-2");

//   btn1.addEventListener("click", function () {
//     if (audio1.paused) {
//       audio1.play();
//     } else {
//       audio1.pause();
//     }
    
//   });
//     btn2.addEventListener("click", function () {
//     if (audio2.paused) {
//       audio2.play();
//     } else {
//       audio2.pause();
//     }
    
//   });
// });
