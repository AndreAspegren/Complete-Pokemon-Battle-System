function endofroundmsg(what, who) {
    const options = { brn: 'tok brannskade', psn: 'tok giftskade', tox: 'tok giftskade', sandstorm: 'ble skadet av sandstormen' }
    return battlemessage = (who == p1.pokemon[0] ? p1.pokemon[0].name : p2.pokemon[0].name) + ' ' + options[what]
}

async function effectivenessmsg() {
    const effect = (types[move.type][otype1] * types[move.type][otype2])
    if (effect == 0) battlemessage = 'Det har ingen effekt på ' + oname + '!'
    else if (effect > 1) battlemessage = 'Det var super effektivt!'
    else if (effect < 1) battlemessage = 'Det var ikke veldig effektivt!'
}

function statmsg(type, change) {
    const typemap = { 'atk': 0, 'def': 1, 'spa': 2, 'spd': 3, 'spe': 4, 'acc': 5, 'eva': 6 }
    stats = [' sitt angrep', ' sitt forsvar', ' sitt spesielle angrep', ' sitt spesielle forsvar', ' sin hastighet', ' sin treffsikkerthet', ' sin unnvikelse']
    statsmovement = [' falt betraktelig!', ' falt!', '', ' økte!', ' økte netraktelig!']
    return battlemessage = targetname + stats[typemap[type]] + statsmovement[change + 2]
}

function weathermsg(){
    const weathermessages = {
        rain: 'Det begynte å reine!',
        sandstorm: 'En sandstorm brygget!',
        sun: 'Sollyset ble hardt!',
        snow: 'Det begynte å hagle!',
    }
    return battlemessage = weathermessages[move.weather]
}

function missed(){
    return battlemessage = uname + ' bommet!'
}

function statusmsg(what, who){
    let statusconditions = {
        brn: ' ble brent!',
        psn: ' ble forgiftet!',
        tox: ' ble veldig forgiftet!',
        par: ' ble paralysert!',
        slp: ' sovna!'
    }
    return battlemessage = who.name + statusconditions[what]
}