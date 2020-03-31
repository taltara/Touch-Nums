const TILTINIT = 1;
const TILTDESTROY = 2;
const TILTRESET = 3;


var boardNums = [];

var gCount = 1, gLevel = 1; // gLevel = Math.floor(Math.random() * 3 + 1);

var timeBegan = null,
    timeStopped = null,
    stoppedDuration = 0,
    startedTimer = null;

var min, sec, ms, newBestscore = 0;
var rowIdx = 0;

var elTimer = document.querySelector('.zTimer');
var elTable = document.querySelector('.grid');

var iso;
var gParticlesRows = [];

renderBoard(getNums(gLevel));


//=====================//
//     FUNCTIONS		//
//=====================//


function getNums(diff) {

    var baseMult = 4;

    var boardSize = Math.pow(baseMult + (diff - 1), 2);

    for (var i = 0; i < boardSize; i++) {

        boardNums.push(i + 1);
    }

    boardNums = shuffle(boardNums);

    return boardNums;
}


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function renderBoard(numsBoard) {

    var boardBase = Math.sqrt(numsBoard.length);
    var strHtml = '', addData = '', addClass = '', addId = '', glareStat = '', tiltStat = '30';
    rowIdx = 0;

    if (gLevel === 3) {

        addData = 'data-tilt-reset';
        addClass = 'grid-item-hard grid-item-3';
        glareStat = '1';
        tiltStat = '35';

    } else if (gLevel === 2) {

        addClass = 'grid-item-medium';
        glareStat = '0.8';

    } else if (gLevel === 1) {

        glareStat = '0.6';
    }

    for (var i = 0; i < numsBoard.length; i++) {

        // if(gLevel === 1) {

        //     if(numsBoard[i] === 1) addId = `id="particles-js"`
        //     else addId = '';
        // }

        if (!(i % boardBase)) strHtml += `<div class="num-row num-row-${rowIdx += 1}">`;

        var coverAdd = numsBoard[i] === 1 ? '' : 'non-starter';

        strHtml += `<div class="grid-item span${numsBoard[i]} ${addClass}" ${addId} data-tilt ${addData} onclick="cellClicked(this)">
        <span class="inner-num ${coverAdd} number">${numsBoard[i]}</span></div>`

        if (!((i + 1) % boardBase)) strHtml += '</div>'
    }
    elTable.innerHTML = strHtml;

    initTiltBoard();
}

function initTiltBoard() {

    var tiltSpans = document.querySelectorAll(".grid-item");

    var elem = document.querySelector('.grid');
    iso = new Isotope(elem, {
        // options
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        percentPosition: true,
        getSortData: {
            number: '.number parseInt',
        },
        sortAscending: true,
        stagger: 10.
    });

    handleTilts(tiltSpans, TILTINIT);

}

// attempts to isotope shuffle while tilt disabled for correct behaviour
function shuffleNums(sort = false) {

    var allNums = document.querySelectorAll('.grid-item');

    handleTilts(allNums, TILTDESTROY);
    if (!sort) {

        iso.shuffle();

    } else {

        // iso.arrange({ sortBy: 'original-order' });
        iso.sortAscending = gCount % 2 ? false : true;

        console.log('SHUFFLE: ', iso.sortAscending);

        iso.arrange({ sortBy: 'number' });
    }

    setTimeout(function () {
        handleTilts(allNums, TILTINIT);
    }, 600);
}

function handleTilts(tiltNums, mode) {

    if (mode === TILTDESTROY || mode === TILTRESET) {

        for (var i = 0; i < tiltNums.length; i++) {

            tiltNums[i].vanillaTilt.destroy();
        }
    }

    if (mode === TILTINIT || mode === TILTRESET) {

        VanillaTilt.init(tiltNums, {

            max: gLevel > 2 ? 35 : 30,
            speed: 500,
            glare: true,
            "max-glare": gLevel > 2 ? 1 : gLevel === 2 ? 0.8 : 0.6,

        });
    }

}

function resetGame(elDiffButton) {

    newBestscore = 0;
    var difficulty = elDiffButton.classList[1];
    gLevel = parseInt(difficulty[difficulty.length - 1]);

    resetTimer();

    elTimer.style.fontSize = "unset";
    if (elTimer.classList.contains('new-best-score-timer')) elTimer.classList.remove('new-best-score-timer');

    gCount = 1, boardNums = [];

    renderBoard(getNums(gLevel));
}

function updateScore() {

    var currentScore = parseFloat(gameSecCalc());
    var bestScore = localStorage.getItem(`bestScore${gLevel}`);

    bestScore = (bestScore === null) ? Infinity : parseFloat(bestScore);

    console.log(`BEST:`, bestScore, ` | CURRENT:`, currentScore);

    if (currentScore < bestScore) {

        newBestscore = 1;
        localStorage.setItem(`bestScore${gLevel}`, currentScore);
        elTimer.classList.add('new-best-score-timer');
        console.log(`NEW BEST SCORE: ${currentScore}`);

        return true;
    }
    return false;

}

function gameSecCalc() {

    return parseFloat(`${min * 60 + sec}.${ms > 99 ? ms : '0' + ms}`);
}


function cellClicked(elNum) {

    var numId = elNum.classList[1];
    var elClickedNum = document.querySelector(`.${numId}`);

    var pressedNum = parseInt(elClickedNum.textContent);

    if (pressedNum === gCount) {

        if (pressedNum != boardNums.length) {

            elClickedNum.setAttribute("id", " ");

            if (gLevel === 1) {

                if (pressedNum != boardNums.length) {

                    var elNextNum = document.querySelector(`.span${pressedNum + 1}`);

                    elNextNum.setAttribute("id", "particles-js");
                    createParticles(gLevel);

                }

            } else if (gLevel === 2) {

                if (!(pressedNum % Math.floor(boardNums.length / 5))) {

                    var randomIdx = Math.floor(Math.random() * boardNums.length + 1);
                    
                    while (gParticlesRows.includes(randomIdx)) {

                        randomIdx = Math.floor(Math.random() * boardNums.length + 1);
                    }
                    
                    var particlesRow = document.querySelector(`.span${randomIdx}`);

                    particlesRow.setAttribute("id", "particles-js");

                    // particlesRow.classList.add('particles3');

                    createParticles(gLevel);

                    gParticlesRows.push(randomIdx)
                }

            } else if (gLevel === 3) {

                if (pressedNum === 1) {

                    var gridParticles = document.querySelector(`.grid`);

                    gridParticles.setAttribute("id", "particles-js");
                    createParticles(gLevel);

                    document.querySelector('.particles-js-canvas-el').classList.add('particles3');

                }
            }
        } else {

            if (gLevel === 1) {

                var elFirstNum = document.querySelector(`.span1`);

                elFirstNum.setAttribute("id", "particles-js");
                createParticles(gLevel);

            }
        }

        if (pressedNum === 1) {

            startTime();

            var coveredNums = document.querySelectorAll('.non-starter');


            for (var i = 0; i < coveredNums.length; i++) {

                coveredNums[i].classList.remove('non-starter')
            }

        } else {

            if (pressedNum === Math.floor(boardNums.length / 2)) shuffleNums();

            if (gLevel === 2 || gLevel === 3) {

                if (!(pressedNum % Math.floor(boardNums.length / ((gLevel === 3) ? 6 : 5))) && pressedNum != boardNums.length) {


                    shuffleNums(true);

                    setTimeout(function () {

                        shuffleNums();
                    }, 1500);
                }
            }

        }

        elClickedNum.style.background = 'white';
        elClickedNum.style.color = 'silver';

        if (pressedNum === boardNums.length) {

            stopTimer();
            elTimer.style.fontSize = "50px";
            if (updateScore()) elTimer.classList.add('new-best-score-timer');

        } else {

            gCount += 1;

        }
    }
}


function startTime() {

    if (timeBegan === null) {

        timeBegan = new Date();
    }

    if (timeStopped !== null) {

        stoppedDuration += (new Date() - timeStopped);
    }

    startedTimer = setInterval(clockRunning, 10);
}

function stopTimer() {
    timeStopped = new Date();
    clearInterval(startedTimer);
}

function resetTimer() {
    clearInterval(startedTimer);
    stoppedDuration = 0;
    timeBegan = null;
    timeStopped = null;
    elTimer.innerHTML = "0.000";
}

function clockRunning() {
    var currentTime = new Date(),
        timeElapsed = new Date(currentTime - timeBegan - stoppedDuration);
    min = timeElapsed.getUTCMinutes();
    sec = timeElapsed.getUTCSeconds();
    ms = timeElapsed.getUTCMilliseconds();

    elTimer.innerHTML =
        (min > 0 ? min + "." : min === 0 ? "" : "") +
        (min ? (sec > 9 ? sec : "0" + sec) : sec) + "." +
        (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms);
};


