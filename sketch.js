////////////////
let etatFinal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, -1]
let etatInitial = [10, 7, 2, 4, 15, -1, 3, 1, 9, 11, 12, 8, 13, 6, 14, 5]
let noeudConnus = [];
let noeudVisite = [];
let largeur = 4;

////////////////
let canvas;
let savedTime;
let width2, height2;
let minToDraw;
let foundText = "Loading...";
////////////////

function setup() {
    width2 = 400; height2 = 400;
    let canvas = createCanvas(width2, height2 + 50);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);
    minToDraw = etatInitial;
    savedTime = millis();
    AstarImprovise(etatInitial, 0)
}

////////////////
function H(L) {
    let c = 0;
    for (let i = 0; i < L.length; i++) {
        if (L[i] != etatFinal[i]) {
            let y = int(i / largeur);
            let x = i % largeur;
            let x2, y2;
            if (L[i] == -1) {
                x2 = x; y2 = y;
            } else {
                y2 = int((L[i] - 1) / largeur);
                x2 = (L[i] - 1) % largeur;
            }
            c += (16 - L[i]) * int(Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2)));
        }
    }
    return c;
}

function AstarImprovise(etatActuel, d) {
    if (etatActuel + "" == etatFinal + "") {
        foundText = int((millis() - savedTime) / 10) / 100 + "s  distance : "+d;
        minToDraw = etatActuel;
        drawTable(etatActuel);
        return;
    }
    let etatPossibles = actions(etatActuel);
    let minH = 300000;
    let cible = null;
    let cibleDistance;
    for (let i = 0; i < etatPossibles.length; i++) {
        let found = -1;
        for (let j = 0; j < noeudConnus.length; j++){
            if (noeudConnus[j][0] + "" == etatPossibles[i] + "") found = j;
        }
        for (let j = 0; j < noeudVisite.length; j++) {
            if (noeudVisite[j] + "" == etatPossibles[i] + "") found = -2;
        }
        if (found != -2 && H(etatPossibles[i]) < minH) {
            minH = H(etatPossibles[i]);
            cible = etatPossibles[i];
            cibleDistance = found >= 0 ? min(d + 1, noeudConnus[found][2]) : d + 1;
        }
        if (found == -1) noeudConnus.push([etatPossibles[i], H(etatPossibles[i]) + d + 1, d + 1]);
        else if (found != -2) {
            noeudConnus[found][1] = min(H(etatPossibles[i]) + d + 1, noeudConnus[found][1]);
            noeudConnus[found][2] = min(d + 1, noeudConnus[found][2]);
        }
    }
    if (cible != null) {
        noeudVisite.push(etatActuel)
        setTimeout(() => {
            drawTable(cible);
            AstarImprovise(cible, cibleDistance);
        }, 0);
        return;
    }
    noeudVisite.push(etatActuel)
    for (let j = 0; j < noeudConnus.length; j++) {
        if (noeudConnus[j][0] + "" == etatActuel + "") {
            noeudConnus.splice(j, 1);
        }
    }
    minH = 500000;
    cible = null;
    cibleDistance = 0;
    for (let j = 0; j < noeudConnus.length; j++) {
        if (noeudConnus[j][1]-noeudConnus[j][2]< minH) {
            minH = noeudConnus[j][1]-noeudConnus[j][2];
            cible = noeudConnus[j][0];
            cibleDistance = noeudConnus[j][2]
        }
    }
    setTimeout(() => {
        drawTable(cible)
        minToDraw = cible;
        AstarImprovise(cible, cibleDistance)
    }, 0);
}


////////////////
function drawTable(L) {
    textSize(20)
    background(250)
    for (let i = 0; i < largeur * largeur; i++) {
      if(L[i] != -1){
        let y = int(i / largeur);
        let x = i % largeur;
        strokeWeight(1);
        fill(color(0))
        text(L[i], x * width / 4 + width / 10, y * height2 / 4 + height2 / 10)
        strokeWeight(2);
        noFill();
        rect( x * width / 4.05 +3,y * height2 / 4.3 + 3,width / 4.05,height2 / 4.3);
      }else{
        let y = int(i / largeur);
        let x = i % largeur;
        fill(color(0))
        strokeWeight(2);
        rect( x * width / 4.05 +3,y * height2 / 4.3 + 3,width / 4.05,height2 / 4.3);
      }
    }
    let sizex = width * 2 / 3;
    fill(color('green'))
    strokeWeight(0)
    rect(width / 2 - sizex / 2, height2, sizex * ((H(etatInitial) - H(minToDraw)) / (H(etatInitial))), 30)
    fill(color('black'))
    noFill();
    strokeWeight(2)
    rect(width / 2 - sizex / 2, height2, sizex, 30)
    fill(color('black'))
    text(foundText, width / 2 - sizex / 2, height2 - 5)
}

function actions(L) {
    let A = []
    let x = 0;
    for (let i = 0; i < L.length; i++) {
        if (L[i] == -1) {
            x = i;
        } 
    }
    let y = int(x / largeur);
    let x2 = x % largeur;
    if (x2 > 0) {
        let L2 = Array.from(L)
        L2[x] = L2[x - 1]
        L2[x - 1] = -1
        A.push(L2)
    }
    if (x2 < 3) {
        let L2 = Array.from(L)
        L2[x] = L2[x + 1]
        L2[x + 1] = -1
        A.push(L2)
    }
    if (y > 0) {
        let L2 = Array.from(L)
        L2[x] = L2[x - 4]
        L2[x - 4] = -1
        A.push(L2)
    }
    if (y < 3) {
        let L2 = Array.from(L)
        L2[x] = L2[x + 4]
        L2[x + 4] = -1
        A.push(L2)
    }
    return (A)
}
///////////////////
function minTable() {
    let minn = 500000;
    let mine = null;
    for (let j = 0; j < noeudConnus.length; j++) {
        if (tabl[j][1] - noeudConnus[j][2] < minn) {
            minn = noeudConnus[j][1] - noeudConnus[j][2];
            mine = noeudConnus[j][0];
        }
    }
    return mine+"";
}