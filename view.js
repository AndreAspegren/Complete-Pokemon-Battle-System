updateview()
function updateview() {
    app.innerHTML = /*HTML*/`
    
        <div style="position: fixed; bottom: 5%; left: 5%">
        ${player1.avatar}
        </div>  
        <div style="position: fixed; bottom: 25%; left: 25%">
        ${genavatar(player1)}
        </div>
        <div style="position: fixed; top: 10%; left: 10%">${weatherimage == undefined ? '' : weatherimage}</div>
        
        <div style="position: fixed; top: 5%; right: 5%">
        ${player2.avatar}
        </div>
        <div style="position: fixed; top: 19%; right: 23%">
        ${genavatar(player2)}
        </div> 
        <div style="position: fixed; bottom: 10%; right: 18%">${genbuttons()}</div>
        `
}

function genavatar(who){
    avatar = `
    <div style="position: relative;"> 
        <div style="display: flex; justify-content: space-between">
            <div style="text-align: left; justify-content: left">${who.pokemon.length > 0 ? who.pokemon[0].name : ''}</div>
            <div>${who == player1 ? player.statusimage : rival.statusimage}</div> 
        </div>
        <div>${who.pokemon.length > 0 ? who.pokemon[0].hp : ''}${who.pokemon.length > 0 ? ' / ' : ''}${who.pokemon.length > 0 ? who.pokemon[0].maxhp : ''}${who.pokemon.length > 0 ? ' HP' : ''}</div>
        <div style="display: flex; height: 30px;">
            <div style="width: ${who.pokemon.length > 0 ? (who.pokemon[0].hp / who.pokemon[0].maxhp * 100).toString() : ''}%; background-color: green;"></div>
            <div style="flex-grow: 1; background-color: red;"></div> <!-- Red bar will take up the remaining space -->
        </div>
        ${who.pokemon.length > 0 ? who.pokemon[0].avatar : ''}
    </div>
    `;
    return avatar;
}


function genbuttons(){
   buttons = `
    <div style="width: 32vh; height: 6vh; background-color: orange; display: flex; align-items: center; justify-content: center">
    ${battlemessage}
    </div>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr)">
    <button style="width: 16vh; height: 8vh;" onclick="battlemanager(${player1.pokemon.length > 0 ? player1.pokemon[0].move1 : ''})">${player1.pokemon.length > 0 ? moves[player1.pokemon[0].move1].name : ''}</button>
    <button style="width: 16vh; height: 8vh;" onclick="battlemanager(${player1.pokemon.length > 0 ? player1.pokemon[0].move2 : ''})">${player1.pokemon.length > 0 ? moves[player1.pokemon[0].move2].name : ''}</button>
    <button style="width: 16vh; height: 8vh;" onclick="battlemanager(${player1.pokemon.length > 0 ? player1.pokemon[0].move3 : ''})">${player1.pokemon.length > 0 ? moves[player1.pokemon[0].move3].name : ''}</button>
    <button style="width: 16vh; height: 8vh;" onclick="battlemanager(${player1.pokemon.length > 0 ? player1.pokemon[0].move4 : ''})">${player1.pokemon.length > 0 ? moves[player1.pokemon[0].move4].name : ''}</button>
    </div>
    `
    return buttons
}
