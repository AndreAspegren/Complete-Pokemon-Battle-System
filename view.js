updateview()
function updateview() {
    app.innerHTML = /*HTML*/`
    
        <div style="position: fixed; bottom: 5%; left: 5%">
        ${player.avatar}
        </div>  
        <div style="position: fixed; bottom: 25%; left: 25%">
        ${genavatar(player)}
        </div>  
        
        <div style="position: fixed; top: 5%; right: 5%">
        ${rival.avatar}
        </div>
        <div style="position: fixed; top: 19%; right: 23%">
        ${genavatar(rival)}
        </div> 
        <div style="position: fixed; bottom: 15%; right: 18%">${genbuttons()}</div>
        `
}

function genavatar(who){
    avatar = `<div>
    <div style="display:flex; right: 0%">
    <div>
    <div>${who.pokemon[0].name}</div>
    <div>${who.pokemon[0].hp} / ${who.pokemon[0].maxhp} HP</div>
    </div>
     <div style="position: absolute, top:0%; right: 0%"></div>
     </div>
    <div style="display: flex; justify-content: left;">
    <div style="flex: 0 0 auto; width:${(who.pokemon[0].hp / who.pokemon[0].maxhp * 20).toString()}vh; height: 30px; background-color: green"></div>
    <div style="flex: 0 0 auto; width:${((who.pokemon[0].maxhp - who.pokemon[0].hp) / who.pokemon[0].maxhp * 20).toString()}vh; height: 30px; 
    background-color: red"></div>
    </div>
    ${who.pokemon[0].avatar}
    </div>
    `
    return avatar
}

function genbuttons(){
   buttons = `<div style="display: grid; grid-template-columns: repeat(2, 1fr)">
    <button style="width: 200px; height: 100px;" onclick="battlemanager(${player.pokemon[0].move1})">${moves[player.pokemon[0].move1].name}</button>
    <button style="width: 200px; height: 100px;" onclick="battlemanager(${player.pokemon[0].move2})">${moves[player.pokemon[0].move2].name}</button>
    <button style="width: 200px; height: 100px;" onclick="battlemanager(${player.pokemon[0].move3})">${moves[player.pokemon[0].move3].name}</button>
    <button style="width: 200px; height: 100px;" onclick="battlemanager(${player.pokemon[0].move4})">${moves[player.pokemon[0].move4].name}</button>
    </div>`
    return buttons
}
