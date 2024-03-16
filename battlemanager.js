async function battlemanager(player1move) {
    turncounter = 0
    buttonsenabled = true
    random = 1                                                                                        
    if (random == 0) player2move = moves[player2.pokemon[0].move1]
    if (random == 1) player2move = moves[player2.pokemon[0].move2]
    if (random == 2) player2move = moves[player2.pokemon[0].move3]
    if (random == 3) player2move = moves[player2.pokemon[0].move4]
                                                                                                            
    if (player1move.type === 'priority' && player2move.type !== 'priority') playerisfaster = true              
    else if (player1move.type !== 'priority' && player2move.type === 'priority') playerisfaster = false
    else if (player1move.type === 'priority' && player2move.type === 'priority') {
        if (player1move.prioritystage > player2move.prioritystage) playerisfaster = true
        else if (player1move.prioritystage < player2move.prioritystage) playerisfaster = false
        else playerisfaster = Math.random() < 0.5
    } else {
        if (player1.pokemon[0].speed > player2.pokemon[0].speed) {
            playerisfaster = true
        } else if (player1.pokemon[0].speed < player2.pokemon[0].speed) {
            playerisfaster = false
        } else playerisfaster = Math.random() < 0.5
    }

    
    if (playerisfaster) {
        player1moved = true
        whoismoving('friend')
        battlemessage = uname + ' brukte ' + player1move.name + '!'
        updateview()
        await delay(2000)
        eval(player1move.movetype + "(player1move)")
        await delay(2000)
    } else {
        whoismoving('foe')
        battlemessage = uname + ' brukte ' + player2move.name + '!'
        updateview()
        await delay(2000)
        eval(player2move.movetype + "(player2move)")
        await delay(2000)
    }
    if (player1moved && player2.pokemon[0].hp != 0) {
        whoismoving('foe')
        battlemessage = uname + ' brukte ' + player2move.name + '!'
        updateview()
        await delay(2000)
        eval(player2move.movetype + "(player2move)")
        await delay(2000)
    } else if (!player1moved && player1.pokemon[0].hp != 0) {
        whoismoving('friend')
        battlemessage = uname + ' brukte ' + player1move.name + '!'
        updateview()
        await delay(2000)
        eval(player1move.movetype + "(player1move)")
        await delay(2000)
    }
    endofround()
}

async function endofround(){
    if (player.brn || rival.brn) await endofrounddamage('brn', 0.125)
    if (player.psn || rival.psn) await endofrounddamage('psn', 0.125)
    if (player.tox || rival.tox) await endofrounddamage('tox', 0.125)
    if (weather.weather == 'sandstorm') await endofrounddamage('sandstorm', 0.125)
    
    
    if (player1.pokemon[0].hp == 0) {
        item = player1.pokemon.splice(0, 1)[0]
        player1.pokemon.push(item)
    }
    if (player2.pokemon[0].hp == 0) {
        item = player2.pokemon.splice(0, 1)[0]
        player2.pokemon.push(item)
    }
    if (!player2.pokemon.every(pokemon => pokemon.hp == 0)) {
        battlemessage = 'Du vant!'
    }
    else if (!player1.pokemon.every(pokemon => pokemon.hp == 0)) {
        battlemessage = 'Du tapte!'
    } else {
        battlemessage = ''
        buttonsenabled = false
    }
    player1moved = false
    updateview()
}

function endofrounddamage(what, value) {
    return new Promise(resolve => {
        let timer = 0
        if (playerisfaster && player[what] && player1.pokemon[0].hp != 0 || playerisfaster && what == 'sandstorm' && ![8, 12, 16].includes(player1.pokemon[0].type1) &&
            ![8, 12, 16].includes(player1.pokemon[0].type2) && player1.pokemon[0].hp != 0) {
            player1.pokemon[0].hp -= player1.pokemon[0].maxhp * (what == 'tox' ? value * player.toxcounter : value)
            if (what == 'tox') player.toxcounter++
            updateview()
            timer += 2000
        } else if (!playerisfaster && rival[what] && player2.pokemon[0].hp != 0 || !playerisfaster && what == 'sandstorm' && ![8, 12, 16].includes(player2.pokemon[0].type1) &&
            ![8, 12, 16].includes(player2.pokemon[0].type2) && player2.pokemon[0].hp != 0) {
            player2.pokemon[0].hp -= player2.pokemon[0].maxhp * (what == 'tox' ? value * rival.toxcounter : value)
            if (what == 'tox') rival.toxcounter++
            updateview()
            timer += 2000
        }
        if (!playerisfaster && player[what] && player1.pokemon[0].hp != 0 || !playerisfaster && what == 'sandstorm' && ![8, 12, 16].includes(player1.pokemon[0].type1) &&
            ![8, 12, 16].includes(player1.pokemon[0].type2)) {
            setTimeout(function () {
                player1.pokemon[0].hp -= player1.pokemon[0].maxhp * (what == 'tox' ? value * player.toxcounter : value)
                if (what == 'tox') player.toxcounter++
                updateview()
            }, timer)
            timer += 2000
        } else if (playerisfaster && rival[what] && player2.pokemon[0].hp != 0 || playerisfaster && what == 'sandstorm' && ![8, 12, 16].includes(player2.pokemon[0].type1) &&
            ![8, 12, 16].includes(player2.pokemon[0].type1) && player2.pokemon[0].hp != 0) {
            setTimeout(function () {
                player2.pokemon[0].hp -= player2.pokemon[0].maxhp * (what == 'tox' ? value * rival.toxcounter : value)
                if (what == 'tox') rival.toxcounter++
                updateview()
            }, timer)
            timer += 2000
        }
        setTimeout(() => resolve(), timer)
    })
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomacc(){
    return Math.ceil(Math.random() * 100)
}

function playerfaster(){
    if (player1.pokemon[0].speed > player2.pokemon[0].speed) return true
    else if (player1.pokemon[0].speed < player2.pokemon[0].speed) return false
    else return Math.random() < 0.5
}