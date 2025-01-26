assignpp()
function assignpp(who) {
    p1.pokemon[0].pp = []
    for (let i = 0; i < p1.pokemon[0].move.length; i++) p1.pokemon[0].pp.push(moves[p1.pokemon[0].move[i]].pp)
    if (!who) {
        p2.pokemon[0].pp = []
        for (let i = 0; i < p2.pokemon[0].move.length; i++) p2.pokemon[0].pp.push(moves[p2.pokemon[0].move[i]].pp)
    }
}

function buttons(){
    return `
     ${p1.pokemon[0].move.map((id, i) => {
        return /*HTML*/`
                <button style="font-size: 100%; position: relative; background-color: ${typecolors[moves[id].type]};" 
                        ${buttonsenabled || p1.pokemon[0].pp[i] > 0 ? '' : 'disabled'} 
                        onclick="setmove(${i});">
                    <div style="position: relative; height: 100%; width: 100%; display: flex; justify-content: center; align-items: center;">
                        <div>${moves[id].name}</div>
                        <div style="position: absolute; bottom: 0; right: 0;">
                            ${p1.pokemon[0].pp[i]} / ${(moves[id].pp ?? moves[id].turn2.pp)}
                        </div>
                    </div>
                </button>`
    }).join('')}
    `
}

function bag(){
    return `
    <img onclick="changepokemon()" ${player.trapped ? 'disabled' : ''}  style="width: auto; height: 16vh; cursor: pointer;" src="media/pictures/misc/bag.png">
    `
}

updateview()
async function updateview() {
    global.app.innerHTML = /*HTML*/`
    <div class="weather">${weather.image ?? ''}</div>
    </div>
    
    <div class="upright">
    <div class="opponentPokemon">${genpokemon(p2)}</div>
    <div class="rival">${p2.avatar}</div>
    </div>
    
    <div class="downleft">
    <div class="player">${p1.avatar}</div>
    <div class="playerPokemon">${genpokemon(p1)}</div>
    </div>
    
    <div class="downright">
    <div>${battlemessage}</div>
    <div></div>
    <div>${buttons()}</div>
    <div>${bag()}</div>
    </div>
    `
}

function genpokemon(who) {
    if ((who == p1 && (deadp1 || p1invul)) || (who == p2 && (deadp2 || p2invul))) return ''
    return /*HTML*/`
    <div style="position: relative;"> 
    <div style="display: flex; justify-content: space-between">
    <div style="text-align: left; justify-content: left">${who.pokemon[0].name}</div>
    <div>${statusimages[who.pokemon[0].status] ?? ''}</div> </div>
    <div>${`${who.pokemon[0].hp} / ${who.pokemon[0].maxhp} HP`}</div>
    <div style="display: flex; height: 2.3vh;">
    <div style="width: ${(who.pokemon[0].hp / who.pokemon[0].maxhp * 100).toString()}%; background-color: green;"></div>
    <div style="flex-grow: 1; background-color: red;"></div>
    </div>${who.pokemon[0].avatar}</div>`
}

function setenemymove() {
    if (p2.pokemon[0].pp.every(p => p == 0)) return "struggle"
    let random = Math.floor(Math.random() * p2.pokemon[0].move.length)
    while (p2.pokemon[0].pp[random] < 1) random = Math.floor(Math.random(), 4)
    return random
}

async function changepokemon(switchmove) {
    app.innerHTML = /*HTML*/`<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; justify-content: center; align-items: center; width: 60vw; height: 80vh; border: 1px solid black">
        ${p1.pokemon.map((p, i) => {
        return /*HTML*/`<div id="changegrandparent">
                <div id="changeparent" onclick="changeto(${i}, '${switchmove}')">
    
                <div id="info">
                
                <div style="">
                <div>${p.name}</div>
                <div>${`${p.hp} / ${p.maxhp} HP`}</div>
                </div>
    
                <div>${statusimages[p.status] ?? ''}</div>
                
                <div>
                <div>${p.item ? `<img src="pictures/items/${p.item.name.toLowerCase().replace(' ', '')}.png" style="height: 2vh; width: auto;">` : ''}</div>
                <div>${p.ability ? `${p.ability.name}` : ''}</div>
                </div>
    
                </div>
                
                <div id="hp">
                <div style="width: ${(p.hp / p.maxhp * 100).toString()}%; background-color: green;"></div>
                <div style="width: ${((p.maxhp - p.hp) / p.maxhp * 100).toString()}%; background-color: red;"></div>
                </div>
                
                <div id="avatar">
                <img src="${p.url}">
                </div>
    
                </div>
                </div>`
    }).join('')}
    </div>
    <button onclick="updateview()">Gå tilbake</button>
</div>`
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
        resolvechange()
        if (switchmove === 'undefined') {
            assignpp('p1')
            player.move = 'switch'
            rival.move = setenemymove()
            moved()
        }
    }
}

