async function intimidate(){
    await updatestats(who[1], 'atk', stats[1].atk -1)
    await updatestats(who[0], 'ability', true, 'cd')
    await playsound('statdown')
    updateview()
    await delay(2000)
    battlemessage = monname[0] + ' senket ' + monname[1] + ' sitt angrep med Intimdate!'
    updateview()
    await delay(2000)   
}

async function sturdy() {
    await updatestats(who[1], 'hp', 1)
    await updatestats(who[1], 'ability', true, 'cd')
    updateview()
    await delay(2000)
    battlemessage = monname[1] + ' overlevde med 1 hp takket være Sturdy!'
    updateview()
    await delay(2000)
}