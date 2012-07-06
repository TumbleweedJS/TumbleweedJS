window.onload = function () {

    // Initialisation du manager de son.
    this.manager =  new TW.Sound.Manager;

    // Création d'un channel de son.
    this.id1 = this.manager.add("assets/Game-Death.mp3", 1);

    // Création d'un channel comme le précèdent sauf que celui-ci aura 10 instances
    // il pourra donc être joué 10 fois en même temps.
    this.id2 = this.manager.add("assets/Game-Spawn.mp3", 10);

    // Création d'un autre channel en utilisant une source multiple pour la compatibilité
    // des navigateurs.
    this.id3 = this.manager.add("assets/Game-Shot.mp3|assets/Game-Shot.ogg", 10);

    // Ajout d'une fonction callback lorsqu'un channel est prêt.
    this.manager.instanceReady = function(id) {
        console.log(id);
    }

    // Ajout d'une fonction callback lorsque tous les channels sont prêts.
    this.manager.allInstancesReady = function(id) {
        console.log("All channel finish load.");
    }

    // Chargement de tous les channels.
    this.manager.loadAll();
};


// Fonction pour lire le premier son.
function playFirstSound() {
    this.manager.getPlayableSound(this.id1).play();
}

// Fonction pour lire le second son.
function playSecondSound() {
    this.manager.getPlayableSound(this.id2).play();
}

// Fonction pour lire le troisième son.
function playThirdSound() {
    this.manager.getPlayableSound(this.id3).play();
}

// Fonction pour augmenter le volume de l'ensemble des channels.
function upVolume() {
    this.manager.setMasterVolume(manager.masterVolume += 0.1);
}

// Fonction pour augmenter le volume de l'ensemble des channels.
function downVolume() {
    this.manager.setMasterVolume(manager.masterVolume -= 0.1);
}

// Fonction pour activer le mode muet sur l'ensemble des channels.
function mute() {
    this.manager.setMute(true);
}

// Fonction pour enlever le mode muet sur l'ensemble des channels.
function unmute() {
    this.manager.setMute(false);
}