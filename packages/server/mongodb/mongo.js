let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
let conn = mp.config.dbUser ? `mongodb://${mp.config.dbUser}:${mp.config.dbPassword}@127.0.0.1:27017/west?authSource=west` : 'mongodb://127.0.0.1:27017/west';
let connect = mongoose.connect(conn,{
	poolSize: 6,
    useNewUrlParser: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
});
mongoose.connection.on('error',(err)=>{
    console.error("Database Connection Error: " + err);
    // Скажите админу пусть включит MongoDB сервер
    console.error('Админ сервер MongoDB Запусти!');
    process.exit(2);
});

// Данная функция будет вызвано когда подключение будет установлено
mongoose.connection.on('connected',()=>{
    // Подключение установлено
    console.info("Succesfully connected to MongoDB Database");
});

module.exports = mongoose;