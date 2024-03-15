function battlemanager(player1move) {
    turncounter = 0
    player1move = moves[player1move]
    random = 3                                          // definere rival move
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
    moveannouncement(player1move, player2move)
}

function moveannouncement(player1move, player2move, random) {
    randomacc = Math.ceil(Math.random() * 100)
    if (playerisfaster && turncounter == 0 || playerisfaster && turncounter <= 1) {
        if (playerisfaster && turncounter == 0 && player1.pokemon[0].hp != 0 && !player1moved) {
            player1moved = true
            whoismoving('friend')
            battlemessage = uname + ' brukte ' + player1move.name + '!'
            setTimeout(() => eval(player1move.movetype + "(player1move, player2move, randomacc)"), 2000)
        } else turncounter++
        if (playerisfaster && turncounter == 1 && player2.pokemon[0].hp != 0 && !player2moved) {
            player2moved = true
            whoismoving('foe')
            battlemessage = uname + ' brukte ' + player2move.name + '!'
            setTimeout(() => eval(player2move.movetype + "(player2move, player1move)"), 2000)
        } else turncounter ++
        updateview()
    }
    else if (!playerisfaster && turncounter == 0 || !playerisfaster && turncounter <= 1) {
        if (!playerisfaster && turncounter == 0 && player2.pokemon[0].hp != 0 && !player2moved) {
            player2moved = true
            whoismoving('foe')
            battlemessage = uname + ' brukte ' + player2move.name + '!'
            setTimeout(() => eval(player2move.movetype + "(player2move, player1move)"), 2000)
        } else turncounter ++ 
        if (!playerisfaster && turncounter == 1 && player2.pokemon[0].hp != 0 && !playermoved) {
            player1moved = true
            whoismoving('friend')
            battlemessage = uname + ' brukte ' + player1move.name + '!'
            setTimeout(() => eval(player1move.movetype + "(player1move, player2move)"), 2000)
        } else turncounter ++
        updateview()
    }
    if (turncounter == 2) {
        endofroundevents()
    }
    turncounter++
}

async function endofroundevents() {
    if (player.brn || rival.brn) await endofrounddamage('brn', 0.125)
    if (player.psn || rival.psn) await endofrounddamage('psn', 0.125)
    if (player.tox || rival.tox) await endofrounddamage('tox', 0.125)
    if (weather.weather == 'sandstorm') await endofrounddamage('sandstorm', 0.125)
    endround()  
}

function endround(){
    console.log('hei')
    if (player1.pokemon[0].hp == 0){
        const item = player1.pokemon.splice(0, 1)[0]
        player1.pokemon.unshift(item)
        updateview()  
    }
    if (player2.pokemon[0].hp == 0){
        console.log('på')
        const item = player2.pokemon.splice(0, 1)[0]
        player2.pokemon.push(item)
        updateview()  
    }
}

function endofrounddamage(what, value) {
    return new Promise(resolve => {
        let timer = 0
        if (playerisfaster && player[what] && player1.pokemon[0].hp != 0 || playerisfaster && what == 'sandstorm' && ![8, 12, 16].includes(player1.pokemon[0].type1) && 
        ![8, 12, 16].includes(player1.pokemon[0].type2) && player1.pokemon[0].hp != 0) {
            player1.pokemon[0].hp -= player1.pokemon[0].maxhp * value
            updateview()
            timer += 2000
        } else if (!playerisfaster && rival[what] && player2.pokemon[0].hp != 0 || !playerisfaster && what == 'sandstorm' && ![8, 12, 16].includes(player2.pokemon[0].type1) && 
        ![8, 12, 16].includes(player2.pokemon[0].type2) && player2.pokemon[0].hp != 0) {
            player2.pokemon[0].hp -= player2.pokemon[0].maxhp * value
            updateview()
            timer += 2000
        }
        if (!playerisfaster && player[what] && player1.pokemon[0].hp != 0 || !playerisfaster && what == 'sandstorm' && ![8, 12, 16].includes(player1.pokemon[0].type1) && 
        ![8, 12, 16].includes(player1.pokemon[0].type2)) {
            setTimeout(function () {
                player1.pokemon[0].hp -= player1.pokemon[0].maxhp * value
                updateview()
            }, timer)
            timer += 2000
        } else if (playerisfaster && rival[what] && player2.pokemon[0].hp != 0 || playerisfaster && what == 'sandstorm' && ![8, 12, 16].includes(player2.pokemon[0].type1) && 
        ![8, 12, 16].includes(player2.pokemon[0].type1) && player2.pokemon[0].hp != 0) {
            setTimeout(function () {
                player2.pokemon[0].hp -= player2.pokemon[0].maxhp * value
                updateview()
            }, timer)
            timer += 2000
        }
        setTimeout(() => resolve(), timer)
    })
}