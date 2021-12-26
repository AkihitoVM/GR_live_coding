/*
Spracovanie json struktury

Úlohou je spracovať json štruktúru a vypísat dáta podľa
zadaných pravidiel. Vstupné dáta obsahujú 2 typy objektov,
cvičenie a program. Jednotlivé cvičenia sú priradené k
programom pomocou atribútu exercise.programs. Cvičenie moze
byt priradene k viacerym programom, nemusí byť priradene k
žiadnemu programu.

Úlohou je spracovať strukturu tak aby vystupom bol zoznam
programov, kde každý program obsahuje pole jeho cvičení.
Zoznam je zoradený primárne podľa počtu priradených cvičení
zostupne, sekundárne podľa atribútu program.createdAt
vzostupne.

Data je potrebne odoslat ako json pomocou POST metody na url
https://postman-echo.com/post
**/



// const MyJson = require('./data.json')

const fs = require('fs');
const MyJson = JSON.parse(fs.readFileSync('./data.json'));

let dataProgram = MyJson.filter((data) => {
    return data.type === "PROGRAM"
})

let dataExercise = MyJson.filter((data) => {
    return data.type === "EXERCISE"
})

dataProgram.forEach(element => {
    element.CVICENIE = []
});

// for all visited IDs
let ids = []

dataExercise.map((exercise, exerciseId) => {
    if (typeof exercise.programs === 'string') {
        dataProgram.map((program, idx) => {  // some duplicate
            if (program.name === exercise.programs) {
                program.CVICENIE.push({ name: exercise.name, type: exercise.type })
                ids.push(idx)
            }
        })
    }
    else if (Array.isArray(exercise.programs)) {
        exercise.programs.map((exeProgram, exeProgramIdx) => {
            dataProgram.map((program, idx) => {  // some duplicate
                if (program.name === exeProgram) {
                    program.CVICENIE.push({ name: exercise.name, type: exercise.type })
                    ids.push(idx)
                }
            })
        })
    }
})

// delete duplicates from array 
let a = Array.from(new Set(ids.sort()))

// add null parameter where exercise.programs === null || exercise.programs === undefined
for (let i = 0; i < dataProgram.length; i++) {
    if (!a.includes(i)) {
        dataProgram[i].CVICENIE.push({ name: null, type: null })
    }
}

// sort program.CVICENIE from largest to smallest .length
dataProgram.sort((a, b) => {
    if (a.CVICENIE.length < b.CVICENIE.length) {
        return 1
    }
    if (a.CVICENIE.length > b.CVICENIE.length) {
        return -1
    }
    return 0
})

// sort program.createdAt from smallest to targest new Date(date)
dataProgram.sort((a, b)=>{
    if (new Date(a.createdAt) < new Date(b.createdAt)) {
        return -1
    }
    return 1
})

console.log(dataProgram);
