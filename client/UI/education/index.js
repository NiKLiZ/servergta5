const educationList = require('../../../packages/configs/education.json');
const browserHud = require('../GUI/gui').browserHud; 

let educationStep,
    tasksList,
    pedEducation = [],
    getMail = false,
    deliveryCar = false,
    blipQ,
    variableShow = true;
let createShape = (param, callback) => {
    let hireColshape = {
        position: param,
        scale: 2
    }

    mp.game.ui.setNewWaypoint(param.x, param.y);

    mp.peds.new(mp.game.joaat(educationStep.NPCModel), param, 0);

    createColshapeRadius(hireColshape,(m)=>{
        callback();
    });
}
mp.events.add({
    'EDUCATION::START' : () => {
        if (educationStep.firstCompleted) return setTask(educationStep.tasks[0].name)
        browserHud.execute(`hud.educationTitle = '${educationStep.name}';
            hud.educationTasks = ${JSON.stringify(educationStep.tasks)};
            hud.education = true;
        `);

        tasksList = educationStep.tasks;

        alert(`${educationStep.tip}`)
    },

    'EDUCATION::CONTINUE' : (ed, type) => {

        const education = JSON.parse(ed);
        
        if (education.length == 0) {
            educationStep = educationList[0];

        } else {
            educationStep = educationList[education.length]
        }

        educationStep.firstCompleted = false;

        createEd(type);
    },

    'EDDUCATION::MAIL' : () => {
        variableShow = false;
        browser.execute(`education.variableShow = false;`)
        createShape(educationStep.mailPos, () => {
            if (!getMail) {
                getMail = true;
                variableShow = true;

                setTask('getRules');
                mp.events.callRemote('EDUCATION::MAILMONEY')
                alert('Вы успешно передали конверт');
            }
        });
    },

    'EDDUCATION::CAR' : () => {
        const pos = JSON.stringify(educationStep.carPos);
        mp.events.callRemote('EDUCATION::SPAWNDELIVERYCAR', pos);

        mp.game.ui.setNewWaypoint(educationStep.deliveryCarPos.x,educationStep.deliveryCarPos.y);

        mp.events.call('EDUCATION::START')

        let checkModel = {
            type: 4,
            color:  [198, 22, 22,175],
            scale: 6,
            position: educationStep.deliveryCarPos,
            vehicle_stop: true
        }

        let check = createCheckpoint(checkModel,()=>{
            if (!deliveryCar) {
                deliveryCar = true;
    
                mp.events.callRemote('EDUCATION::DELIVERYCAR')
                alert('Вы успешно доставили автомобиль');

                setTask(educationStep.tasks[0].name);

                check.del()
            }
        })

    },
    
    'EDUCATION::HIDE' : () => {
        guitoggle(false,false);

        mp.gui.chat.show(true);
    }
})

let getTask = (taskName) => {
    if (!tasksList) return false;
    for (let i = 0; i < tasksList.length; i++) {
        if (tasksList[i].name == taskName && !tasksList[i].completed) return true;
    }
}

let setTask = (taskName) => {
    for (let i = 0; i < tasksList.length; i++) {
        if (tasksList[i].name == taskName) {
            tasksList[i].completed = true;
            if (allComplete()) {
                mp.events.callRemote('taskComplete', JSON.stringify(tasksList))
            }

            browserHud.execute(`hud.educationTasks = ${JSON.stringify(educationStep.tasks)};`);
            alert('Задание успешно выполнено')
            break;
        }
    }   
}

let setFirstComplete = () => {
    educationStep.firstCompleted = true;
}

let allComplete = () => {
    const idx = tasksList.length;
    let counterComplete = 0;

    for (let i = 0; i < tasksList.length; i++) {
        if (tasksList[i].completed === true) {
            counterComplete++;
        }
    }   

    if (idx == counterComplete) {
        browserHud.execute(`hud.education = false;
            hud.educationTitle = '';
            hud.educationTasks = ${JSON.stringify([])};
        `);
        browser.execute(`education.variableShow = false;
            education.carDelivery = false;
            education.freezeWait = false;
        `)
        
        return true;

    }
}

let isAleadyCreated  = () => {
    for (let i = 0; i < pedEducation.length; i++) {
        if (pedEducation[i].x == educationStep.pos.x) return true;
    }

    return false;
} 

let shapeExecute = (descr, id) => {
    browser.execute(`education.show = true; 
        education.description = '${descr}';
        education.id = ${id};
    `)

    guitoggle(true,true);
    mp.gui.chat.show(false); 
}

let createEd = (type) => {
    if (!isAleadyCreated()) {
        let hireColshape = {
            position: educationStep.pos,
            scale: 2
        }
        

        blipQ = mp.blips.new(304, educationStep.pos,{
            education: true,
            pos: educationStep.pos,
            typeB: 'education',
            name: 'Обучение',
            color: 81,
            shortRange: true,
        });

        if (type == 0) blipQ.setRoute(true)

        mp.labels.new(`${educationStep.NPCName}`, new mp.Vector3(educationStep.pos.x, educationStep.pos.y, educationStep.pos.z + 1),
        {
            education: true,
            los: false,
            font: 0,
            drawDistance: 5,
            color: [31, 144, 93, 255]
        });


        let ped = mp.peds.new(mp.game.joaat(educationStep.NPCModel), educationStep.pos, 0 );
        ped.education = true;

        createColshapeRadius(hireColshape,(m)=>{
            if (!tasksList && educationStep.pos.x == hireColshape.position.x) {
                browser.execute(`education.freezeWait = false;`)
                shapeExecute(educationStep.description, educationStep.id);

                if (educationStep.tasks[0].name == 'deliveryCar') browser.execute(`education.carDelivery = true;`)
              
            } else if (educationStep.pos.x == hireColshape.position.x && educationStep.description2 && educationStep.firstCompleted && variableShow) {
                browser.execute(`education.freezeWait = false;`)
                shapeExecute(educationStep.description2, educationStep.id);
                
                if (tasksList[0].name == 'getRules') browser.execute(`education.variableShow = true;`)

            } else {

                browser.execute(`education.freezeWait = true;`);
                shapeExecute('Ты еще тут? Давай шустрее', educationStep.id);
            }

        });

        pedEducation.push(educationStep.pos);
    }
    tasksList = undefined;
}
module.exports.getTask = getTask;
module.exports.setTask = setTask;
module.exports.setFirstComplete = setFirstComplete;