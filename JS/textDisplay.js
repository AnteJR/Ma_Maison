/* 
    CRÉATION D'UN OBSERVER POUR OBSERVER SI L'INNERHTML DE LA DIV
    #GAMEDIV EST MODIFIÉ D'UNE FAÇON OU D'UNE AUTRE, ET AINSI LANCER
    LA FONCTION D'AFFICHAGE DES TEXTES DISPLAYGAMETEXT();
*/
let gameDiv = document.getElementById("gameScreen");
const observer = new MutationObserver(function() {
    // lancer la fonction pour afficher les textes
    displayGameText();
});
observer.observe(gameDiv, {characterData: false, childList: true, attributes: false});

/* 
    FONCTION POUR AFFICHER DU TEXTE PHRASE APRÈS PHRASE,
    EN METTANT DES MOTS EN ÉVIDENCE SI BESOIN, ET EN
    RENFANT INTERACTIF LES TEXTES QUI DOIVENT L'ÊTRE
*/
function displayGameText(){
    let textsToAppear = document.querySelectorAll('.textDiv');
    let texts = [];

    // récupérer les éléments marqués ".interactiveText" pour les rendre interactifs
    let mesObjets = document.querySelectorAll(".interactiveText");
    mesObjets.forEach((element) => {
        // on récupère leur textContent
        element.addEventListener("click", function(){
            let monObjet = this.textContent;
            let obj = monObjet.split("");
            // on édite le texte s'il comprend un . ou une ,
            obj.forEach((e, i) => {
                if(e == "." || e == ","){
                    obj[i] = ""
                }
                else{
                    obj[i] = e;
                }
            });
            // on affiche le mot dans l'input quand il est cliqué (s'il suit un autre mot)
            let monMot = obj.join("");
            if(document.getElementById("commandInput").value != ""){
                document.getElementById("commandInput").value += monMot;
            }
        });
    });

    // un forEach pour chaque div qui contient du texte
    textsToAppear.forEach((el, idx)=> {
        // on récupère le textContent de chaque div et on l'ajoute dans un array, 
        let textOriginal = el.textContent;
        texts.push(textOriginal);
        el.innerHTML = "";

        // on split le texte original de chaque div pour en savoir sa longueur en caractère
        let text = textOriginal.split("");
        let nbrChar = text.length;
        let charPos = 0;

        // on appelle la fonction qui affiche caractère par caractère
        txtDisplay(nbrChar, charPos, el, text, idx);
    });

    /*
        CETTE FONCTION EST UNE FONCTION RÉCURSIVE QUI AFFICHE :
        1. CHAQUE STRING L'UN APRÈS L'AUTRE
        2. CHAQUE STRING CARACTRÈRE PAR CARACTÈRE
    */
    function txtDisplay(i, j, element, txtFrag, index){
        // gestion des intervals pour les timeout
        let interval1 = 0;
        let interval2 = 43;
        let diviser = 1;
        // dans le cas spécifique de l'affichage de la lettre, on a besoin que ça s'affiche plus rapidement
        if(myGameTxt.currentAct >= 4 && myGameTxt.currentScene >= 5 && myGameTxt.scenes[myGameTxt.currentScene].items[0].lookingAtLetter == true){
            diviser = 3;
            interval2 = (interval2-13)/diviser;
        }
        if(index > 0){
            let previousTexts = 0;
            for(let k = 0; k<texts.length-1; k++){
                previousTexts += texts[k].length;
            }
            interval1 = (50*previousTexts)/diviser;
        }

        // 2 setimeout imbriqués :
        // 1. Le premier prend comme intervale la somme des caractères des strings le précédent * 50ms
        // 2. Le deuxième prend comme intervale "interval2", donc 43ms
        setTimeout(function(){
            setTimeout(()=> {
                if(i>0){
                    let delay = 0;

                    // afficher les espaces comme des espaces inséquables (sans quoi ils ne s'affichent pas en fin de string)
                    if(txtFrag[j] == " "){
                        txtFrag[j] = "&nbsp;"
                    }

                    // set de condition pour appliquer des délais aux spans qui contiennent les animations
                    if(element.getAttribute("class").split(" ")[0] == "wobblyTxt"){
                        delay = j*50;
                        element.innerHTML+=`<span style="animation-delay: ${delay}ms">${txtFrag[j]}</span>`;
                    }
                    else if(element.getAttribute("class").split(" ")[0] == "angerWobble"){
                        delay = j*20;
                        element.innerHTML+=`<span style="animation-delay: ${delay}ms">${txtFrag[j]}</span>`;
                    }
                    else if(element.getAttribute("class").split(" ")[0] == "bargainWobble"){
                        delay = j*500;
                        element.innerHTML+=`<span style="animation-delay: ${delay}ms">${txtFrag[j]}</span>`;
                    }
                    else if(element.getAttribute("class").split(" ")[0] == "sadWobble"){
                        delay = j*500;
                        element.innerHTML+=`<span style="animation-delay: ${delay}ms">${txtFrag[j]}</span>`;
                    }
                    else if(element.getAttribute("class").split(" ")[0] == "acceptanceWobble"){
                        element.innerHTML+=`<span style="animation-delay: ${delay}ms">${txtFrag[j]}</span>`;
                    }
                    else{
                        // sinon, on enlève les espaces insécables dans les paragraphes non-animés
                        if(txtFrag[j] == "&nbsp;"){
                            txtFrag[j] = " ";
                        }
                        element.innerHTML+=txtFrag[j];
                    }
                    // on rappelle la fonction (elle est récursive)
                    j++;
                    i--;
                    txtDisplay(i, j, element, txtFrag);
                }
            },interval2);
        },interval1);
    }
}

/* 
    CETTE FONCTION AFFICHE LA COULEUR CORRECTE DES COMMANDES BONUS
    HIT (ACTE 2) - INSPECT (ACTE 3) - WAIT (ACTE 4) - ACCEPT (ACTE 5)
*/
function inspectColor(){
    // si l'acte vaut 0, donner l'opacité 0.2 à toutes les commandes bonus
    if(myGameTxt.currentAct == 0 ){
        document.querySelectorAll(".bonusC").forEach((e) => {
            e.style.opacity = 0.2;
        });
    }
    // si l'act vaut 1 ou +, donner l'opacité 0.2 à toutes les commandes bonus sauf hit
    else if(myGameTxt.currentAct >= 1 ){
        document.querySelectorAll(".bonusC").forEach((e) => {
            if(e.className.split(" ")[1] == "hitC"){
                e.style.opacity = 1;
            }
            else{
                e.style.opacity = 0.2;
            }
        });
    }
    // si l'act vaut 2 ou +, donner l'opacité 0.2 à toutes les commandes bonus sauf hit et inspect
    else if(myGameTxt.currentAct >= 2 ){
        document.querySelectorAll(".bonusC").forEach((e) => {
            if(e.className.split(" ")[1] == "hitC"){
                e.style.opacity = 1;
            }
            else if(e.className.split(" ")[1] == "inspectC"){
                e.style.opacity = 1;
            }
            else{
                e.style.opacity = 0.2;
            }
        });
    }
    // si l'act vaut 3 ou +, donner l'opacité 1 à toutes les commandes bonus sauf accept
    else if(myGameTxt.currentAct >= 3 ){
        document.querySelectorAll(".bonusC").forEach((e) => {
            if(e.className.split(" ")[1] == "acceptC"){
                e.style.opacity = 0.2;
            }
            else{
                e.style.opacity = 1;
            }
        });
    }
    // si l'act vaut 4 ou +, donner l'opacité 1 à toutes les commandes bonus
    else if(myGameTxt.currentAct >= 4 ){
        document.querySelectorAll(".bonusC").forEach((e) => {
            e.style.opacity = 1;
        });
    }
}

/*
    CETTE FONCTION S'OCCUPE SPÉCIFIQUEMENT DE L'AFFICHAGE DU TITRE
    DU JEU, DE FAÇON FLOTTANTE. ELLE REPREND LARGEMENT LE FONCTIONNEMENT
    DE LA FONCTION DISPLAYTXT()
*/
let title = document.getElementById('titleGame');
let titleText = title.textContent;
titleTxt(titleText);

function titleTxt (text){
    text = text.split("");
    let textToAppend = text.map((x, idx)=> {
        if(x == " "){
            x = "&nbsp;"
        }
        let delay = (idx) * 500;
        return `<span style="animation-delay: ${delay}ms">${x}</span>`;
    });
    title.innerHTML = textToAppend.join("");
}