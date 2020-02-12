let jobs = require('../../SYSTEM/jobs').jobs;
let infoJobs = [];
for(let job in jobs){
    infoJobs.push({
        name: jobs[job].name,
        type: 'job',
        job
    })
}


exports.points = [
    {
        name: 'Ближайшая АЗС',
        type: 'aps'
    },
    {
        name: 'Ближайший банкомат',
        type: 'atm'
    },
    {
        name: 'Ближайший банк',
        type: 'bank'
    },
    {
        name: 'Работы',
        group: infoJobs
    },
    {
        name: 'Ближайший тюнинг',
        type: 'tuning'
    },
    {
        name: 'Гос. структуры',
        group: [
            {
                name: 'Мэрия',
                type: 'mayoralty'
            } 
        ]
    },
    {
        name: 'Ближайший магазин одежды',
        type: 'clothes'
    },
    {
        name: 'Мой дом',
        type: 'home'
    },
    {
        name: 'Ближайший тату салон',
        type: 'tatu'
    },
    {
        name: 'Ближайшая парикмахерская',
        type: 'barbershop'
    },
];