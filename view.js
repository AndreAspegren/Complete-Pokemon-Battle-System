assignpp()
function assignpp(){
    p1.pokemon[0].pp = []
    for (let i = 0; i < p1.pokemon[0].move.length; i++) p1.pokemon[0].pp.push(moves[p1.pokemon[0].move[i]].pp)
}

updateview()

function randommove() {
    return Math.floor(Math.random() * 4)
}

function updateview() {
    app.innerHTML = /*HTML*/`
        <div style="position: fixed; bottom: 5%; left: 5%">
        ${p1.avatar}
        </div>  
        <div style="position: fixed; bottom: 25%; left: 25%">
        ${genpokemon(p1)}
        </div>
        <div style="position: fixed; top: 10%; left: 10%">${weather.image}</div>
        
        <div style="position: fixed; top: 5%; right: 5%">
        ${p2.avatar}
        </div>
        <div style="position: fixed; top: 19%; right: 23%">
        ${genpokemon(p2)}
        </div> 
        <div style="position: fixed; bottom: 10%; right: 8%">${genui()}</div>
        `
}

function genpokemon(who) {
    if (who == p1 && deadp1 || who == p2 && deadp2 || who == p1 && p1invul || who == p2 && p2invul) return ''
    avatar = /*HTML*/`
    <div style="position: relative;"> 
    <div style="display: flex; justify-content: space-between">
    <div style="text-align: left; justify-content: left">${who.pokemon[0].name}</div>
    <div>${statusimages[who.pokemon[0].status] ?? ''}</div> </div>
    <div>${who.pokemon[0].name ? `${who.pokemon[0].hp} / ${who.pokemon[0].maxhp} HP` : ''}</div>
    <div style="display: flex; height: 2.3vh;">
    <div style="width: ${(who.pokemon[0].hp / who.pokemon[0].maxhp * 100).toString()}%; background-color: green;"></div>
    <div style="flex-grow: 1; background-color: red;"></div></div>${who.pokemon[0].avatar}</div>`
    return avatar
}

function genui() {
    let button = ''
    for (let i = 0; i < 4; i++) {
        button += /*HTML*/`<button style="width: 16vh; height: 8vh; font-size: 100%; position: relative; background-color: ${typecolors[moves[p1.pokemon[0].move[i]].type]};"
            ${buttonsenabled ? '' : 'disabled'} ${p1.pokemon[0].pp[i] > 0 ? '' : 'Disabled'} onclick="battlemanager(${`${p1.pokemon[0].move[i]}`}, ${randommove()}, ${i});">
            <div style="position: relative; height: 100%; width: 100%; display: flex; justify-content: center; align-items: center;">
            <div>${moves[p1.pokemon[0].move[i]].name}</div><div style="position: absolute; bottom: 0; right: 0;">
            ${`${p1.pokemon[0].pp[i]} / ${moves[p1.pokemon[0].move[i]].pp ?? moves[p1.pokemon[0].move[i]].turn2.pp}`}</div>
        </div></button>`
    }
    let buttons = /*HTML*/`
    <div style="background-color: orange; display: flex; align-items: center; justify-content: center; width: 32.3vh; height: 6vh;">${battlemessage}</div>
    <div style="display: flex;"><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.3vh;">${button}</div>
    <img onclick="changepokemon()" style="width: auto; height: 16vh; cursor: pointer;" src="pictures/misc/bag.png"></div>`
    return buttons
}

async function changepokemon(switchmove) {
    let caughtpokemon = ''
    for (let i = 0; i < p1.pokemon.length; i++) {
        if (p1.pokemon[i].name != ''){
            caughtpokemon += /*HTML*/ `
            <div style="height: 24vh; width: auto;" onclick="changeto(${i}, '${switchmove}')">
            <div style="display: flex; justify-content: space-between">
            <div style="text-align: left;">${p1.pokemon[i].name}</div>
            <div>${statusimages[p1.pokemon[i].status[1]] ?? ''}</div>
            </div>
            <div>${`${p1.pokemon[i].hp} / ${p1.pokemon[i].maxhp} HP`}</div>
            <div style="display: flex; height: 30px;">
            <div style="width: ${(p1.pokemon[i].hp / p1.pokemon[i].maxhp * 100).toString()}%; background-color: green;"></div>
            <div style="flex-grow: 1; background-color: red;"></div>
            </div>
            ${p1.pokemon[i].avatar}
            </div>
            `
        }
    }
    app.innerHTML = /*HTML*/`<div style="position: fixed; top: 5%; left: 50%; transform: translateX(-50%)">Trykk på pokemonen du vil bytte til</div>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); width: auto; height: 80vh; position: fixed; left: 50%; top: 50%; transform: 
    translate(-50%, -50%); gap: 5vh;">${caughtpokemon}<button style="position: fixed; bottom: -5vh; left: 50vw" 
    onclick="updateview()">Gå tilbake</button>`
    
    return new Promise(resolve => window.resolvechange = resolve)
}

async function changeto(who, switchmove) {
    if (who != 0 && p1.pokemon[0].hp == 0) {            // død bytte
        element = p1.pokemon.splice(who, 1)[0]
        p1.pokemon.unshift(element)
        resolvechange()
    }
    else if (who != 0 && p1.pokemon[who].hp != 0) {     // levende bytte 
        battlemessage = p1.name + ' byttet ut ' + p1.pokemon[0].name + ' med ' + p1.pokemon[who].name + '!'
        buttonsenabled = false
        updateview()
        await delay(2000)
        resetstats(player, p1.pokemon[0])
        item = p1.pokemon.splice(who, 1)[0]
        p1.pokemon.unshift(item)
        updateview()
        await delay(2000)
        if (switchmove == undefined) battlemanager('switch')
        resolvechange()
    }
}

