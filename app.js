const gameboard = document.querySelector(".board");
const numbers = document.querySelector(".numbers");
const letters = document.querySelector(".letters");
let playerGo = 'white';
const playerDisplay = document.querySelector("#player")
playerDisplay.textContent = playerGo + "'s turn";


let letter = "abcdefgh";

for (let row = 1; row <= 8; row++) {
    for (let col = 1; col <= 8; col++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.id = `${String.fromCharCode(96 + col)}${9-row}`;

        if ((row + col) % 2 === 0) {
            square.classList.add("white");
        } else {
            square.classList.add("black");
        }

        gameboard.appendChild(square);
    }

    let numberli = document.createElement("li");
    numberli.textContent = row;
    numbers.appendChild(numberli);

    let letterli = document.createElement("li");
    letterli.textContent = letter[row - 1];
    letters.appendChild(letterli);
}

function addPiece(row, col, piece) {
    const square = document.getElementById(`${String.fromCharCode(96 + col)}${9-row}`);
    const img = document.createElement("img");
    img.src = `Images/${piece}.png`;
    img.alt = piece;
    img.width = 80; // Spécifiez la largeur souhaitée en pixels
    img.height = 80; // Spécifiez la hauteur souhaitée en pixels
    square.appendChild(img);
}

function initChessboardFromFEN(fen) {
    const pieces = fen.split(' ')[0]; // Obtenez la partie de la notation FEN contenant les pièces

    // Map des pièces FEN aux noms de pièces correspondants
    const pieceMapping = {
        'p': 'bp',
        'r': 'br',
        'n': 'bn',
        'b': 'bb',
        'q': 'bq',
        'k': 'bk',
        'P': 'wp',
        'R': 'wr',
        'N': 'wn',
        'B': 'wb',
        'Q': 'wq',
        'K': 'wk',
    };

    const rows = pieces.split('/'); // Divisez les rangées de pièces

    // Parcourez chaque rangée et chaque caractère pour placer les pièces sur l'échiquier
    rows.forEach((row, rowIndex) => {
        let colIndex = 1; // Commencez à la première colonne
        for (let i = 0; i < row.length; i++) {
            const currentChar = row[i];
            if (pieceMapping[currentChar]) {
                addPiece(rowIndex + 1, colIndex, pieceMapping[currentChar]);
                colIndex++;
            } else if (!isNaN(currentChar)) {
                colIndex += parseInt(currentChar, 10);
            }
        }
    });
}

// Exemple d'utilisation :
initChessboardFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");



//drag and drop
const allSquares = document.querySelectorAll(".board .square")
allSquares.forEach(square =>{
    square.addEventListener('dragstart',dragStart)
    square.addEventListener('dragover',dragOver)
    square.addEventListener('drop',dragDrop)
})

let startPositionId
let draggedElement
function dragStart(e) {
    if (playerGo === 'black' && e.target.getAttribute('alt')[0] === 'w') {
        e.preventDefault(); // Empêche le démarrage du glisser-déposer
    } else if (playerGo === 'white' && e.target.getAttribute('alt')[0] === 'b') {
        e.preventDefault(); // Empêche le démarrage du glisser-déposer
    } else {
        startPositionId = e.target.parentNode.getAttribute('id');
        draggedElement = e.target;
    }
}


function dragOver(e){
    e.preventDefault()
}

function canPieceBeTaken(targetImgId) {
    const playerColor = playerGo[0];
    const targetPieceColor = targetImgId.getAttribute('alt');
    return playerColor !== targetPieceColor[0]; // Retourne true si les couleurs sont différentes
}    


function dragDrop(e){
    e.stopPropagation()

    const parentSquare = e.target.parentNode;
    const taken = parentSquare.querySelector(':scope > img') !== null

    

    if (taken) {
        if (canPieceBeTaken(parentSquare.querySelector(':scope > img'))){
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            changePlayer()
        }
    }else{
        e.target.append(draggedElement)
        changePlayer()
    }
    
}

function changePlayer(){
    if (playerGo === "black"){
        playerGo = "white"
    }else{
        playerGo = "black"
    }
    playerDisplay.textContent = playerGo+"'s turn"
}
