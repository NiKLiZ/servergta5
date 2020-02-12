mp.events.add({
    'educationContinue' : (player) => {
        sendEducation(player, 1);
    },

    'taskComplete' : (player, task) => {
        const taskR = JSON.parse(task);
        const taskModel = {};
        taskR.forEach(el => {
            taskModel[el.id] = el.completed; 
        });
        
        if (!player.education) player.education = []
        
        player.education.push(taskModel)

        sendEducation(player);
    },

    'EDUCATION::MAILMONEY' : (player) => {
        sendEducation(player);
    },

    'EDUCATION::SPAWNDELIVERYCAR': (player, pos) => {

        const carPos = JSON.parse(pos);
        player.deliveryVeh = mp.vehicles.new(mp.joaat('infernus'), carPos,{
            numberPlate: "EDUCATION",
            dimension: player.dimension
        });
        player.deliveryVeh.setVariable('petrol', 3)
    },

    'EDUCATION::DELIVERYCAR' : (player) => {
        sendEducation(player);
    }
})

function sendEducation(player, type = 0) {
    const education = JSON.stringify(player.education)
    if (player.education.length < 5) player.call('EDUCATION::CONTINUE', [education, type])
}
mp.events.addCommand('pdd', (player) => {
    player.call('pdd:complete')
})