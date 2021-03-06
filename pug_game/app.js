var scores, roundScores, activePlayer, gamePlaying, winScore;

init();

document.querySelector('.btn-roll').addEventListener('click', function() {
    if (gamePlaying) {
        
        winScore = document.getElementById('input-score').value; // get value of input box on the first dice roll
        document.getElementById("input-score").disabled = true;  // disable input box until new game
        
        //1. random number
        
        var dice0 = Math.floor(Math.random() * 6 + 1);
        var dice1 = Math.floor(Math.random() * 6 + 1);
        
        //2. display result
        var diceDOM0 = document.querySelector('.dice0');
        var diceDOM1 = document.querySelector('.dice1');
        // change dice image
        diceDOM0.style.display = 'block'; 
        diceDOM0.src = 'dice-' + dice0 + '.png';
        
        diceDOM1.style.display = 'block';
        diceDOM1.src = 'dice-' + dice1 + '.png';
        
    
        //3. update the round score only IF the rolled number was not a 1
        if (dice0 !== 1 && dice1 !== 1) {
            // add score
                roundScore += dice0 + dice1;
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
        } else {
        // next player
        nextPlayer();
        } 
    }
    

});

document.querySelector('.btn-hold').addEventListener('click', function () {
    if (gamePlaying) {
            // 1. add current score to global score
        scores[activePlayer] += roundScore;
        

    
    // 2. update the UI
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

    // 3. check if player won the game
    if (scores[activePlayer] >= winScore) {
        document.getElementById('name-' + activePlayer).textContent = 'WINNER!';
        document.querySelector('.dice0').style.display = 'none';
        document.querySelector('.dice1').style.display = 'none';
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        gamePlaying = false;
       } else {
        //next player
        nextPlayer();
       } 
    }
});

document.querySelector('.btn-new').addEventListener('click', init);

function init() {
    gamePlaying = true;
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    
    document.getElementById("input-score").disabled = false;
    document.querySelector('.dice0').style.display = 'none';
    document.querySelector('.dice1').style.display = 'none';
    
    document.getElementById('score-0').textContent = '0'; // element by id select only id, faster than querry
    document.getElementById('score-1').textContent = '0';

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    
    document.querySelector('.player-0-panel').classList.add('active');
};

function nextPlayer() {
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;
    oldDice = 0;
        
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
        
        // change class with toggle
    document.querySelector('.player-0-panel').classList.toggle('active'); 
    document.querySelector('.player-1-panel').classList.toggle('active');
        
        // change class, add, remove with if
        //document.querySelector('.player-0-panel').classList.remove('active'); 
        //document.querySelector('.player-1-panel').classList.add('active');
        
    document.querySelector('.dice0').style.display = 'none';
    document.querySelector('.dice1').style.display = 'none';
}






//document.querySelector('#current-' + activePlayer).textContent = dice; // set a value
//document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';
//var x = document.querySelector('#score-0').textContent; // get a value