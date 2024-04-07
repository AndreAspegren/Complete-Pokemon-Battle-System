async function battlemanager(moveinput, pp) {
    prelimfunctions(moveinput, pp)

    for (let i = 0; i < 2; i++) {
        checkacc(user[4 + i], i)
        whoismoving(user[0 + i], i)
        await moveevents(i)
    }
    await endofrounddamage()
    await newpokemon()

    battlemessage = p2.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du vant!' : p1.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du tapte!' : ''
    buttonsenabled = battlemessage == '' ? true : false
    updateview()
}


async function endofrounddamage() {      // brn, psn, tox, sandstorm
    let who = [p1.pokemon[0].status, p2.pokemon[0].status]
    let what = ['brn', 'brn', 'psn', 'psn', 'tox', 'tox', weather.weather, weather.weather]

    for (let i = 0; i < 8; i++) {
        n = i % 2 == 0 ? 0 : 1
        value = what[i] == 0.125 ? 0.125 : 0.0625
        if (who[i] == what[i] && user[6 + n].hp > 0 || what[i] == 'sandstorm' && ![8, 12, 16].includes(user[6 + n].type1) &&
            ![8, 12, 16].includes(user[6 + n].type2) && user[6 + n].hp > 0) {
            effect = Math.round((user[6 + n].maxhp * (what[i] == 'tox' ? value * user[8 + n].txc : value)))
            user[6 + n].hp -= effect < 1 ? effect = 1 : effect
            if (user[6 + n].hp < 0) user[6 + n].hp = 0
            if (what == 'tox') user[8 + n].toxcounter++
            endofroundmsg(what[i], user[6 + n])
            if (user[6 + n].hp == 0) await deathdisplay(i)
            updateview()
            await delay(2000)
        }
    }
}

async function newpokemon() {
    let newmon = false
    for (let i = 0; i < 2; i++) {
        if (user[4 + i].hp == 0 && !user[12 + i].pokemon.every(pokemon => pokemon.hp == 0) &&
            (((user[12 + i] == p1 ? p1faster : !p1faster) && i == 0) || ((user[12 + i] == p1 ? !p1faster : p1faster) && i == 1))) {
            newmon = true
            user[12 + i] == p1 ? (deadp1 = null, await changepokemon()) : (deadp2 = null, newpokemonout = p2.pokemon.splice(indexcheck(), 1)[0], p2.pokemon.unshift(newpokemonout))
            battlemessage = user[12 + i].name + ' sendte ut ' + user[6 + i].name + '!'
            updateview()
            await delay(3000)
        }
    }
    if (newmon) await hazards()
}

async function hazards() {      // spikes, toxic spikes, stealth rock
    spk = ['', 1 / 8, 1 / 6, 1 / 4]
    tspk = ['', 'psn', 'tox']
    strk = [types[12][p1.pokemon[0].type1] * types[12][p1.pokemon[0].type2], types[12][p2.pokemon[0].type1] * types[12][p2.pokemon[0].type2]]
    value = [spk[player.spk], rival[spk], tspk[player.tspk], tspk[rival.tspk], strk[0], strk[1]]

    for (let i = 0; i < 6; i++) {
        n = i % 2 == 0 ? 0 : 1
        if (user[14 + n] && user[6 + n].hp != 0) {
            if (!isInteger(value[i])) updatestats(user[16 + i], value[i])
            else {
                effect = Math.round((user[6 + n].maxhp * value[i]))
                user[6 + n].hp -= effect < 1 ? effect = 1 : effect
                if (user[6 + n].hp < 0) user[6 + n].hp = 0
            }
            // hazardsmsg(who[i], user[6 + i])
            if (user[6 + n].hp == 0) await deathdisplay(i)
            updateview()
            await delay(2000)
        }
    }
}

function prelimfunctions(moveinput, pp) {
    buttonsenabled = false
    p1.pokemon[0].pp[pp]--
    p1move = moveinput != 'switch' ? moves[moveinput] : moveinput
    p2move = moves[p2.pokemon[0].move[randommove()]]
    p1movehistory.push(JSON.parse(JSON.stringify(p1move)))
    p2movehistory.push(JSON.parse(JSON.stringify(p2move)))
    p1firstMO = checkspeed('moveorder')
    p1faster = checkspeed()

    user = [p1firstMO ? 'friend' : 'foe', !p1firstMO ? 'friend' : 'foe',                      // whoismoving 0-1 MO
    p1firstMO ? p1move : p2move, p1firstMO ? p2move : p1move,                                 // move 2-3 MO
    p1firstMO ? p1.pokemon[0] : p2.pokemon[0], p1firstMO ? p2.pokemon[0] : p1.pokemon[0],     // pokemon move speed 4-5 MO
    p1faster ? p1.pokemon[0] : p2.pokemon[0], p1faster ? p2.pokemon[0] : p1.pokemon[0],       // pokemon speed 6-7
    p1firstMO ? player : rival, p1firstMO ? rival : player,                                   // stats 8-9 MO
    p1firstMO ? p1movehistory : p2movehistory, p1firstMO ? p2movehistory : p1movehistory,     // historie 10-11 MO
    p1faster ? p1 : p2, p1faster ? p2 : p1,                                                   // spiller 12-13 
    p1faster ? player : rival, p1faster ? rival : player,                                     // stats 14-15
    p1faster ? 'friend' : 'foe', p1faster ? 'foe' : 'friend',]                                // whoismoving 16-17    
    
    who = null
    speed = null
    stats = null
    players = null
    currentmove = null
    movehistory = null
}
