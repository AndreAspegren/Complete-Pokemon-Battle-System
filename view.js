updateview()
function updateview() {
    app.innerHTML = /*HTML*/`
    
        <div style="position: fixed; bottom: 5%; left: 5%">
        ${player1.avatar}
        </div>  
        <div style="position: fixed; bottom: 25%; left: 25%">
        ${genavatar(player1)}
        </div>
        <div style="position: fixed; top: 10%; left: 10%">${weather.image}</div>
        
        <div style="position: fixed; top: 5%; right: 5%">
        ${player2.avatar}
        </div>
        <div style="position: fixed; top: 19%; right: 23%">
        ${genavatar(player2)}
        </div> 
        <div style="position: fixed; bottom: 10%; right: 8%">${genbuttons()}</div>
        `
}

function genavatar(who){
    avatar = /*HTML*/`
    <div style="position: relative;"> 
    <div style="display: flex; justify-content: space-between">
    <div style="text-align: left; justify-content: left">${who.pokemon.length > 0 ? who.pokemon[0].name : ''}</div>
    <div>${who == player1 ? player.statusimage : rival.statusimage}</div> </div>
    <div>${who.pokemon.length > 0 ? who.pokemon[0].hp : ''}${who.pokemon.length > 0 ? ' / ' : ''}
    ${who.pokemon.length > 0 ? who.pokemon[0].maxhp : ''}${who.pokemon.length > 0 ? ' HP' : ''}</div><div style="display: flex; height: 30px;">
    <div style="width: ${who.pokemon.length > 0 ? (who.pokemon[0].hp / who.pokemon[0].maxhp * 100).toString() : ''}%; 
    background-color: green;"></div>
    <div style="flex-grow: 1; background-color: red;"></div></div>${who.pokemon.length > 0 ? who.pokemon[0].avatar : ''}</div>`
    return avatar
}


function genbuttons(){
   buttons = /*HTML*/`
    <div style="background-color: orange; display: flex; align-items: center; justify-content: center; width: 32vh; height: 6vh">
    ${battlemessage}</div>
    <div style="display: flex">
    <div style="display: grid; grid-template-columns: repeat(2, 1fr)">
    <button style="width: 16vh; height: 8vh;" onclick="battlemanager(${player1.pokemon.length > 0 ? player1.pokemon[0].move1 : ''})">
    ${player1.pokemon.length > 0 ? moves[player1.pokemon[0].move1].name : ''}</button>
    <button style="width: 16vh; height: 8vh;" onclick="battlemanager(${player1.pokemon.length > 0 ? player1.pokemon[0].move2 : ''})">
    ${player1.pokemon.length > 0 ? moves[player1.pokemon[0].move2].name : ''}</button>
    <button style="width: 16vh; height: 8vh;" onclick="battlemanager(${player1.pokemon.length > 0 ? player1.pokemon[0].move3 : ''})">
    ${player1.pokemon.length > 0 ? moves[player1.pokemon[0].move3].name : ''}</button>
    <button style="width: 16vh; height: 8vh;" onclick="battlemanager(${player1.pokemon.length > 0 ? player1.pokemon[0].move4 : ''})">
    ${player1.pokemon.length > 0 ? moves[player1.pokemon[0].move4].name : ''}</button>
    </div>
    <img onclick="changepokemon()" style= "width: auto; height: 16vh;" 
      src="pictures/misc/bag.png" alt="">
      </div>
    `
    return buttons
}

function changepokemon() {
    let caughtpokemon = ''
    for (let i = 0; i < player1.pokemon.length; i++) {
        caughtpokemon += /*HTML*/ `
        <div style="height: 24vh; width: auto;" onclick="changeto(${i})">
            <div style="display: flex; justify-content: space-between">
                <div style="text-align: left;">${player1.pokemon[i].name}</div>
                <div>${player.statusimage}</div>
            </div>
            <div>${player1.pokemon.length > 0 ? player1.pokemon[i].hp : ''}${player1.pokemon.length > 0 ? ' / ' : ''}${player1.pokemon[i].maxhp} HP</div>
            <div style="display: flex; height: 30px;">
                <div style="width: ${player1.pokemon.length > 0 ? (player1.pokemon[i].hp / player1.pokemon[i].maxhp * 100).toString() : ''}%; background-color: green;"></div>
                <div style="flex-grow: 1; background-color: red;"></div>
            </div>
            ${player1.pokemon[i].avatar}
        </div>
        `
    }
    app.innerHTML = /*HTML*/`<div style="position: fixed; top: 5%; left: 50%; transform: translateX(-50%)">Trykk på pokemonen du vil bytte til</div>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); width: auto; height: 80vh; position: fixed; left: 50%; top: 50%; transform: 
    translate(-50%, -50%); gap: 5vh;">${caughtpokemon}<button style="position: fixed; bottom: -5vh; left: 50vw" 
    onclick="updateview()">Gå tilbake</button>`
}



function changeto(who){
    if (who != 0 && player1.pokemon[who].hp != 0){
        const item = player1.pokemon.splice(who, 1)[0]
        player1.pokemon.unshift(item)
        updateview()  
    }
}

