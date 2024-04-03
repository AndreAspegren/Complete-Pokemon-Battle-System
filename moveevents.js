async function moveevents(i) {
    completed = false
    if (user[4 + i] == p1.pokemon[0] && move == 'switch') completed = true
    if (user[10 + i].length != 1){
        if (user[10 + i][user[10 + i].length - 2].effect == 'cd' && user[10 + i][user[10 + i].length - 2].hit == true && user[10 + i][user[10 + i].length - 2].cd != true)
        {
            user[10 + i][user[10 + i].length - 1]['cd'] = true
            battlemessage = uname + ' må hvile!'
            completed = true
        } 
    }
    if (user[4 + i].hp == 0) {
        battlemessage = user[4 + i].name + ' døde!'
        resetstats(user[8 + i])
        completed = true
    }
    if (protected && user[4 + i].hp != 0){
        battlemessage = uname + ' beskyttet seg selv!'
        completed = true
    } 
    if (!completed) {
        battlemessage = user[4 + i].name + ' brutke ' + user[2 + i].name + '!'
        updateview()
        await delay(2000)
        await window[user[2 + i].movetype]()
    }
    updateview()
    await delay(2000)
} 
