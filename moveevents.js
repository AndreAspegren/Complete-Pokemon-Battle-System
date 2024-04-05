async function moveevents(i) {
    completed = false
    if (user[4 + i] == p1.pokemon[0] && move == 'switch') return        // switch out
    if (user[10 + i].length != 1) {                                     // movethencd rest 
        if (user[10 + i][user[10 + i].length - 2].effect2 == 'cd' && user[10 + i][user[10 + i].length - 2].hit == true && user[10 + i][user[10 + i].length - 2].cd != true) {
            user[10 + i][user[10 + i].length - 1]['cd'] = true
            battlemessage = uname + ' må hvile!'
            completed = true
        }
    }
    if (protected && user[4 + i].hp != 0) {                 // protect 
        battlemessage = user[4 + i].name + ' brutke ' + user[2 + i].name + '!'
        updateview()
        await delay(2000)
        battlemessage = oname + ' beskyttet seg selv!'
        completed = true
        protected = false
    }
    if (user[4 + i].hp == 0) await deathdisplay(i)           // death display
    if (!completed) {                                       // hvis ikke noe annet, så dette
        battlemessage = user[4 + i].name + ' brutke ' + user[2 + i].name + '!'
        updateview()
        await delay(2000)
        await window[user[2 + i].movetype]()
    }
    updateview()
    await delay(2000)
} 

async function deathdisplay(i){
    resetstats(user[8 + i])
    completed = true
    updateview()
    await delay(2000)
    battlemessage = user[4 + i].name + ' døde!'
    updateview()
    await delay(2000)
    deadmon = user[0 + i]
}

