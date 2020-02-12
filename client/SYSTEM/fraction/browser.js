let browserFractions = mp.browsers.new('package://HTML/fractions/index.html'); 
mp.events.add("FRACTION::EXECUTE",(execute)=>{
    browserFractions.execute(execute);
})
exports.browserFractions = browserFractions;	