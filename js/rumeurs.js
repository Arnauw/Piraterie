const rumeurs = [
 "On dit que Mounir a tenté de vendre du sable… à un marchand du désert.",
 "Jérémie aurait confondu le trésor avec la réserve de biscuits du navire.",
 "Arnaud aurait gagné au bras de fer contre une pieuvre… mais perdu contre une mouette.",
 "Amine aurait réussi à naviguer en ligne droite… sur terre.",
 "Mounir aurait essayé de payer sa rançon en coquillages.",
 "Jérémie a déjà coulé un navire… en oubliant de fermer le robinet.",
 "On raconte que Mounir a cherché le trésor… avec Google Maps en mode pirate.",
 "Arnaud croit encore que le X sur la carte… c’est l’endroit à éviter.",
 "Amine a tenté de faire du stop en mer… il attend toujours sur son tonneau.",
 "Mounir a failli être promu capitaine… mais il s’est endormi pendant le vote.",
 "Jérémie a tenté de dresser un crabe… il a perdu sa chaussure.",
 "Arnaud a confondu le rhum avec l’eau de mer… Il a eu une surprise salée toute la soirée.",
 "Le crew a tenté de faire un barbecue sur le pont… ils ont fini par griller la voile.",
 "Jérémie a tenté de dresser une mouette… elle lui a volé son chapeau."
];

let NB_BULLES;
function updateNbBulles() {
  if (window.innerWidth <= 768) {
    NB_BULLES = 3;
  } else {
    NB_BULLES = 8;
  }
}
function afficheRumeursMultiples() {
  const zone = document.getElementById('zone-rumeurs');
  zone.innerHTML = ''; // Vide la zone

  // Mélange les rumeurs
  const rumeursMelangees = rumeurs
    .map(r => ({ r, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ r }) => r);

  for (let i = 0; i < NB_BULLES; i++) {
    const bulle = document.createElement('div');
    bulle.className = 'bulle-rumeur show';
    bulle.textContent = rumeursMelangees[i % rumeursMelangees.length];
    zone.appendChild(bulle);
  }
}

addEventListener("resize", (event) => {
updateNbBulles();
afficheRumeursMultiples();
});

setInterval(afficheRumeursMultiples, 8000);
window.onload = () =>{
  updateNbBulles();
afficheRumeursMultiples();
};
