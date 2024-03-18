updateview()
function updateview() {
    app.innerHTML = /*HTML*/`
    
        <div style="position: fixed; bottom: 5%; left: 5%">
        ${p1.avatar}
        </div>  
        <div style="position: fixed; bottom: 25%; left: 25%">
        ${genavatar(p1)}
        </div>
        <div style="position: fixed; top: 10%; left: 10%">${weather.image}</div>
        
        <div style="position: fixed; top: 5%; right: 5%">
        ${p2.avatar}
        </div>
        <div style="position: fixed; top: 19%; right: 23%">
        ${genavatar(p2)}
        </div> 
        <div style="position: fixed; bottom: 10%; right: 8%">${genbuttons()}</div>
        `
}

function genavatar(who) {
    avatar = /*HTML*/`
    <div style="position: relative;"> 
    <div style="display: flex; justify-content: space-between">
    <div style="text-align: left; justify-content: left">${who.pokemon.length > 0 ? who.pokemon[0].name : ''}</div>
    <div>${statusimages[who.pokemon[0].status] ?? ''}</div> </div>
    <div>${who.pokemon.length > 0 ? who.pokemon[0].hp : ''}${who.pokemon.length > 0 ? ' / ' : ''}
    ${who.pokemon.length > 0 ? who.pokemon[0].maxhp : ''}${who.pokemon.length > 0 ? ' HP' : ''}</div><div style="display: flex; height: 30px;">
    <div style="width: ${who.pokemon.length > 0 ? (who.pokemon[0].hp / who.pokemon[0].maxhp * 100).toString() : ''}%; 
    background-color: green;"></div>
    <div style="flex-grow: 1; background-color: red;"></div></div>${who.pokemon.length > 0 ? who.pokemon[0].avatar : ''}</div>`
    return avatar
}


function genbuttons() {
    let button = ''
    for (let i = 0; i < 4; i++) {
        move = p1.pokemon.length > 0 ? moves[p1.pokemon[0].move[i]] : null;
        button += `<button style="width: 16vh; height: 8vh; font-size: 100%; background-color: ${typecolors[move.type]};"
            ${buttonsenabled ? '' : 'disabled'} onclick="battlemanager(${p1.pokemon.length > 0 ? p1.pokemon[0].move[i] : ''})">
            ${move ? move.name : ''}</button>`
    }
    const buttons = `
    <div style="background-color: orange; display: flex; align-items: center; justify-content: center; width: 32vh; height: 6vh">${battlemessage}</div>
    <div style="display: flex"><div style="display: grid; grid-template-columns: repeat(2, 1fr)">${button}</div>
    <img onclick="changepokemon()" style="width: auto; height: 16vh;" src="pictures/misc/bag.png" alt=""></div>`
    return buttons;
}

function changepokemon() {
    let caughtpokemon = ''
    for (let i = 0; i < p1.pokemon.length; i++) {
        caughtpokemon += /*HTML*/ `
        <div style="height: 24vh; width: auto;" onclick="changeto(${i})">
            <div style="display: flex; justify-content: space-between">
                <div style="text-align: left;">${p1.pokemon[i].name}</div>
                <div>${statusimages[p1.pokemon[i].status[1]] ?? ''}</div>
            </div>
            <div>${p1.pokemon.length > 0 ? p1.pokemon[i].hp : ''}${p1.pokemon.length > 0 ? ' / ' : ''}${p1.pokemon[i].maxhp} HP</div>
            <div style="display: flex; height: 30px;">
                <div style="width: ${p1.pokemon.length > 0 ? (p1.pokemon[i].hp / p1.pokemon[i].maxhp * 100).toString() : ''}%; background-color: green;"></div>
                <div style="flex-grow: 1; background-color: red;"></div>
            </div>
            ${p1.pokemon[i].avatar}
        </div>
        `
    }
    app.innerHTML = /*HTML*/`<div style="position: fixed; top: 5%; left: 50%; transform: translateX(-50%)">Trykk på pokemonen du vil bytte til</div>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); width: auto; height: 80vh; position: fixed; left: 50%; top: 50%; transform: 
    translate(-50%, -50%); gap: 5vh;">${caughtpokemon}<button style="position: fixed; bottom: -5vh; left: 50vw" 
    onclick="updateview()">Gå tilbake</button>`
}



async function changeto(who) {
    if (who != 0 && p1.pokemon[who].hp != 0 && p1.pokemon[0].hp != 0) {
        battlemessage = p1.name + ' byttet ut ' + p1.pokemon[0].name + ' med ' + p1.pokemon[who].name + '!'
        updateview()
        await delay(2000)
        const item = p1.pokemon.splice(who, 1)[0]
        p1.pokemon.unshift(item)
        resetstats()
        updateview()
        await delay(2000)
        p2move = moves[p2.pokemon[0].move[randommove()]]
        whoismoving('foe')
        battlemessage = uname + ' brukte ' + p2move.name + '!'
        updateview()
        await delay(2000)
        eval(p2move.movetype + "(player2move)")
        await delay(2000)
        endofround()
    }
    else {
        p1.pokemon[0].status = ''
        const item = p1.pokemon.splice(who, 1)[0]
        p1.pokemon.unshift(item)
        buttonsenabled = true
        updateview()
    }
}

