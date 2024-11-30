var board = [];                           // MAIN BOARD WHERE THE NUMBERS GET STORED
for(let i=0; i<9; i++){
    board[i] = [];
    for(let j=0; j<9; j++){
        board[i][j]=0;
    }
}
var numToAdd;           // number which is select to put in board
var index1;
var index2;             // Variables that hold the position of the number placed in the board
var fault1 = 0;
var fault2 = 0;
var fault3 = 0;         // Variables kept to identify the faults of number being repeated in row, column or sub-square
var isSolved = false;   // Variable kept to check if the board is Solved or not


window.onload = function () {

    makeBoard();
    funcId("newBoard").addEventListener("click", makeBoard);    // Functions for makeBoard being called when newBoard is pressed
    funcId("solver").addEventListener("click", solve1);        // Option for solve and speedSolve
    funcId("speedup").addEventListener("click", solve2); 
    
}



function makeBoard () {

    emptyBoard();    // Clears previous board and makes new one
    addElement();    // to add html element in board div

    // add functionalities to 0 to 9 button
    for(let i=0; i<10; i++){
        funcId("numbers").children[i].addEventListener("click", function () {
            
            if(this.classList.contains("selected")) {

                this.classList.remove("selected");              // Done to deselect numbers which were selected
                numToAdd = undefined;
            }
            else {

                for(let i=0; i<10; i++) {
                    funcId("numbers").children[i].classList.remove("selected");  // Removes all the previously selected numbers and selects the current one
                }

                this.classList.add("selected")
                numToAdd = funcId("numbers").children[i].innerHTML;  // Grabs the value of the number selected. For eg. 1,2,3 etc

            }    
        });
    }

    // add functionalities to board number
    for(let i=0; i<81; i++){

        funcId("board").children[i].addEventListener("click", async function () {
            x = parseInt(i/9);
            y = i%9;
            var finalIndexes = [parseInt(i/9), i%9];   // The above code is done to obtain the correct index and position of the square on the board which has a number placed in it

            if(checkDuplicates(board, parseInt(numToAdd), finalIndexes) == true && numToAdd != undefined && numToAdd != 'del') {

                funcId("board").children[i].innerHTML = numToAdd;
                funcId("board").children[i].classList.add("solveColour")        // Adds number to board after knowing that it follows the rule of sudoku and does not get repeated in the same row, column or sub-square
                board[x][y] = parseInt(numToAdd);
            }

            if(checkDuplicates(board, parseInt(numToAdd), finalIndexes) == false && isSolved == false){

                funcId('warning1').classList.remove('warn1anim');
                funcId('warning2').classList.remove('warn2anim');       // removing the warning class animation after animation gets completed
                funcId('warning3').classList.remove('warn3anim');

                await sleep1();     // used a sleep function to create a small 25 millisecond delay and to ensure that the changes happen
                
                if(fault1 == 1) {funcId('warning1').classList.add('warn1anim'); fault1=0;}
                if(fault2 == 1) {funcId('warning2').classList.add('warn2anim'); fault2=0;}  //Adds appropriate warning classes depending upon the rule violated to give suitable warning messages
                if(fault3 == 1) {funcId('warning3').classList.add('warn3anim'); fault3=0;}
            }
        });
        
    }
    
}

function emptyBoard () {

    let squares = document.querySelectorAll(".square");
    
    for(let i=0; i<squares.length; i++) {
        squares[i].remove();                    // Removes all the squares from the board
    }

    for(let i=0; i<9; i++) {
        for(let j=0; j<9; j++) {
            board[i][j] = 0;                    // Sets all the values in our board to zero
        }
    }

    fault1 = 0;
    fault2 = 0;
    fault3 = 0;
    isSolved = false;       // Resets all the values

}
function addElement(){
    for(let i=0; i<81; i++){

        const idnum = String(i);

        let square = document.createElement("p");     // Adds <p> tags with the square class list which will hold all the 81 squares of the game
        square.textContent = '';
        square.classList.add("square");
        square.id = idnum                             // Helps in giving borders to the board as it holds the id nums of each square

        if(i>=0 && i<9) {square.classList.add("borderUp");}

        if(i>=72 && i<=81) {square.classList.add("borderBottom");}   // This section is entirely built to give the dark bold borders to the sudoku game

        if((i+1)%9 == 0) {square.classList.add("borderRight");}

        if(i%9 == 0) {square.classList.add("borderLeft");}

        if((i>17 && i<27) || (i>44 && i<54)) {square.classList.add("borderBottom");}

        if((i+1) %9 == 3 || (i+1) %9 == 6) {square.classList.add("borderRight");}

        funcId("board").appendChild(square); 
    }
}
function funcId(id) {
    return document.getElementById(id);     // Function to get the id of any element in HTML
}



// -------------------------------- MAIN SUDOKU SOLVER ----------------------------------------------


var finalInd;       // variable used to store the current element at a particular square during solving

function sleep1() {
    return new Promise(resolve => setTimeout(resolve, 25));     // Sleeper function used for the solve option 
}

async function solve1 () {

    var empty = findEmptySpace();

    if(!empty) {
        isSolved = true;
        return true;
    }

    for(let i=1; i<10; i++) {

        if(checkDuplicates(board, i, empty)) {

            board[empty[0]][empty[1]] = i;
            finalInd = (empty[0]*9) + empty[1];

            funcId("board").children[finalInd].classList.remove("solveColour")
            await sleep1();
            funcId("board").children[finalInd].classList.add("solveColour");
            funcId("board").children[finalInd].innerHTML = i;                   //Changes the number on the board

            if(await solve1()) {
                return true;
            }

            board[empty[0]][empty[1]] = 0;

            funcId("board").children[finalInd].classList.remove("solveColour")
            await sleep1();
            funcId("board").children[finalInd].classList.add("solveColour");
            funcId("board").children[finalInd].innerHTML = 0;                   //Changes the number on the board
            
            // await keywords are added above to create a wait of 25 milliseconds so that the user can visualize as to what is going on in the board
            
        }
    }

    funcId("board").children[0].innerHTML = board[0][0];    // Sets the first element in the board list seperately due to an exception
    return false;

}

function solve2 () {

    var empty = findEmptySpace();

    if(!empty) {
        isSolved = true;
        return true;
    }

    for(let i=1; i<10; i++) {

        if(checkDuplicates(board, i, empty)) {

            board[empty[0]][empty[1]] = i;
            finalInd = (empty[0]*9) + empty[1];

            funcId("board").children[finalInd].classList.add("solveColour");
            funcId("board").children[finalInd].innerHTML = i;                   //Changes the number on the board

            if(solve2()) {
                return true;
            }

            board[empty[0]][empty[1]] = 0;

            funcId("board").children[finalInd].classList.add("solveColour");
            funcId("board").children[finalInd].innerHTML = 0;                   //Changes the number on the board
            
            // This function is used by the speed solve option and has no waiting period of 25 milliseconds and therefore gets the board solved almost instantly

        }
    }

    funcId("board").children[0].innerHTML = board[0][0];    // Sets the first element in the board list seperately due to an exception
    return false;

}


function checkDuplicates (board, num, empty) {
    for(let i=0; i<9; i++) {
        if(board[empty[0]][i] == num && empty[1] != i) {
            fault1 = 1;                                       // Helps us to know that it is the first rule that was violated while inserting numbers into the sudoku board
            return false;
        }
    }

    for(let i=0; i<9; i++) {
        if(board[i][empty[1]] == num && empty[0] != i) {
            fault2 = 1;                                        // Helps us to know that it is the second rule that was violated while inserting numbers into the sudoku board
            return false;
        }
    }

    var x = Math.floor(empty[1]/3);
    var y = Math.floor(empty[0]/3);

    for(let i=(y*3); i<(y*3)+3; i++) {
        for(let j=(x*3); j<(x*3)+3; j++) {
            if(board[i][j] == num && i != empty[0] && j != empty[1]) {
                fault3 = 1;                                             // Helps us to know that it is the third rule that was violated while inserting numbers into the sudoku board
                return false;
            }
        }
    }

    return true;

}

// helps us in finding the empty spaces in the board when the algo  works

function findEmptySpace () {

    for(let i=0; i<9; i++) {
        for(let j=0; j<9; j++) {
            if(board[i][j] == 0) {
                return [i, j];
            }
        }
    }

}