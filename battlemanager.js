async function battlemanager(moveinput, pp) {
    prelimfunctions(moveinput, pp)

    for (let i = 0; i < 2; i++) {
        checkacc(user[4 + i])
        whoismoving(user[0 + i], i)
        await moveevents(i)
    }
    endofround()
}

async function endofround() {
    if (p1.pokemon[0].status == 'brn' || p2.pokemon[0].status == 'brn') await endofrounddamage('brn', 0.125)
    if (p1.pokemon[0].status == 'psn' || p2.pokemon[0].status == 'psn') await endofrounddamage('psn', 0.0625)
    if (p1.pokemon[0].status == 'tox' || p2.pokemon[0].status == 'tox') await endofrounddamage('tox', 0.0625)
    if (weather.weather == 'sandstorm') await endofrounddamage('sandstorm', 0.0625)

    if (p1movehistory.length != 0) p1movehistory[p1movehistory.length - 1]['hit'] = p1movehit
    if (p2movehistory.length != 0) p2movehistory[p2movehistory.length - 1]['hit'] = p2movehit
    await changemanager()
    battlemessage = p2.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du vant!' : p1.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du tapte!' : '';
    buttonsenabled = battlemessage == '' ? true : false
    updateview()
    protected = false
}

async function changemanager() {
    for (let i = 0; i < 2; i++) {
        if (p1.pokemon[0].hp == 0 && !p1.pokemon.every(pokemon => pokemon.hp == 0) && ((p1faster && i == 0) || (!p1faster && i == 1))) {
            await changepokemon()
            battlemessage = p1.name + ' sendte ut ' + p1.pokemon[0].name + '!'
            updateview()
            await delay(3000)
        }
        if (p2.pokemon[0].hp == 0 && !p2.pokemon.every(pokemon => pokemon.hp == 0) && ((!p1faster && i == 0) || (p1faster && i == 1))) {
            index = 0
            for (let i = 0; i < p2.pokemon.length; i++) {
                if (p2.pokemon[i].hp == 0) index++
                else break
            }
            newpokemon = p2.pokemon.splice(index, 1)[0]
            p2.pokemon.unshift(newpokemon)
            battlemessage = p2.name + ' sendte ut ' + p2.pokemon[0].name + '!'
            updateview()
            await delay(3000)
        }
    }
}

async function endofrounddamage(what, value) {
    for (let i = 0; i < 2; i++) {
        if (user[6 + i].status == what && user[6 + i].hp > 0 || what == 'sandstorm' && ![8, 12, 16].includes(user[6 + i].type1) &&
            ![8, 12, 16].includes(user[6 + i].type2) && user[6 + i].hp > 0) {
            effect = Math.round((user[6 + i].maxhp * (what == 'tox' ? value * user[8 + i].toxcounter : value)))
            user[6 + i].hp -= effect < 1 ? effect = 1 : effect
            if (user[6 + i].hp < 0) user[6 + i].hp = 0
            if (what == 'tox') user[8 + i].toxcounter++
            endofroundmsg(what, user[6 + i])
            updateview()
            await delay(2000)
        }
    }
}

function prelimfunctions(moveinput, pp) {
    buttonsenabled = false
    p1.pokemon[0].currentpp[pp]--
    p1move = moveinput != 'switch' ? moves[moveinput] : 'switch'
    p2move = moves[p2.pokemon[0].move[randommove()]]
    p1movehistory.push(JSON.parse(JSON.stringify(p1move)))
    p2movehistory.push(JSON.parse(JSON.stringify(p2move)))
    p1firstMO = determinespeed('moveorder')
    p1faster = determinespeed()

    user = [p1firstMO ? 'friend' : 'foe', !p1firstMO ? 'friend' : 'foe',                      // whoismoving 0-1
    p1firstMO ? p1move : p2move, p1firstMO ? p2move : p1move,                                 // move 2-3
    p1firstMO ? p1.pokemon[0] : p2.pokemon[0], p1firstMO ? p2.pokemon[0] : p1.pokemon[0],     // pokemon move speed 4-5
    p1faster ? p1.pokemon[0] : p2.pokemon[0], p1faster ? p2.pokemon[0] : p1.pokemon[0],       // pokemon speed 6-7
    p1firstMO ? player : rival, p1firstMO ? rival : player,                                   // stats 8-9
    p1firstMO ? p1movehistory : p2movehistory, p1firstMO ? p2movehistory : p1movehistory]     // historie 10-11          
}




