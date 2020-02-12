let browserElements = mp.browsers.new('package://HTML/elements/index.html'); 
exports.browserElements = browserElements;
require('./inputСall')(browserElements)
require('./table')(browserElements)