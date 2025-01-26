function buttons(){
    return `
     ${actors.p1.pokemon[0].move.map((id, i) => {
        return /*HTML*/`
                <button style="font-size: 100%; position: relative; background-color: ${typecolors[moves[id].type]};" 
                        ${global.inturn || actors.p1.pokemon[0].pp[i] > 0 ? '' : 'disabled'} 
                        onclick="setmove(${i});">
                    <div style="position: relative; height: 100%; width: 100%; display: flex; justify-content: center; align-items: center;">
                        <div>${moves[id].name}</div>
                        <div style="position: absolute; bottom: 0; right: 0;">
                            ${actors.p1.pokemon[0].pp[i]} / ${(moves[id].pp ?? moves[id].turn2.pp)}
                        </div>
                    </div>
                </button>`
    }).join('')}
    `
}

function bag(){
    return `
    <img onclick="seeroster()" ${player.trapped ? 'disabled' : ''}  style="width: auto; height: 16vh; cursor: pointer;" src="media/pictures/misc/bag.png">
    `
}


updateview()
async function updateview() {
    global.app.innerHTML = /*HTML*/`
    <div>
    <div class="weather">${weather.image ?? ''}</div>
    <div></div>
    <div></div>
    <div></div>
    </div>
    
    <div class="upright">
    <div></div>
    <div class="rival">${actors.p2.avatar}</div>
    <div class="opponentPokemon">${genpokemon(actors.p2)}</div>
    <div></div>
    </div>
    
    <div class="downleft">
    <div></div>
    <div class="playerPokemon">${genpokemon(actors.p1)}</div>
    <div class="player">${actors.p1.avatar}</div>
    <div></div>
    </div>
    
    <div class="downright">
    <div>${global.battlemessage}</div>
    <div></div>
    <div>${buttons()}</div>
    <div>${bag()}</div>
    </div>
    `
}

function genpokemon(who) {
    if (who.stats.invul || who.stats.fainted) return ''
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

function playersqaud(switchmove){
    return actors.p1.pokemon.map((p, i) => {
        return /*HTML*/`<div id="changegrandparent">
                <div id="changeparent" onclick="changeto(${i}, '${switchmove}')">
    
                <div id="info">
                
                <div style="">
                <div>${p.name}</div>
                <div>${`${p.hp} / ${p.maxhp} HP`}</div>
                </div>
    
                <div>${statusimages[p.status] ?? ''}</div>
                
                <div>
                <div>${p.item ? `<img src="media/pictures/items/${p.item.name.toLowerCase().replace(' ', '')}.png" style="height: 2vh; width: auto;">` : ''}</div>
                <div>${p.ability ? `${p.ability.name}` : ''}</div>
                </div>
    
                </div>
                
                <div id="hp">
                <div style="width: ${(p.hp / p.maxhp * 100).toString()}%; background-color: green;"></div>
                <div style="width: ${((p.maxhp - p.hp) / p.maxhp * 100).toString()}%; background-color: red;"></div>
                </div>
                
                <div id="avatar">
                ${p.avatar}
                </div>
    
                </div>
                </div>`
    }).join('')
}

async function seeroster(switchmove) {
    global.app.style.display = "flex";
    global.app.style.removeProperty('grid-template-columns');
    global.app.style.removeProperty('grid-template-rows');
    global.app.style.removeProperty('grid-template-areas');
    global.app.style.removeProperty('grid-template-areas');
    
    global.app.innerHTML = /*HTML*/`
    <div class="switch">

    <div class="pokemongrid">
    ${playersqaud(switchmove)}
    </div>

    <div class="backtogamebuttons">
    <button onclick="updateview();">Gå tilbake</button>
    </div>

    </div>
    `

    app.style.display = 'grid';
    app.style.gridTemplateColumns = '50% 50%';
    app.style.gridTemplateRows = '50% 50%';
    app.style.gridTemplateAreas = '"upleft upright" "downleft downright"';
    return new Promise(resolve => window.resolvechange = resolve)
}

