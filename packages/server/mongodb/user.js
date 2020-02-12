let mongoose = require('./mongo'),
	Schema = mongoose.Schema;
let infoitems = require('../inventory/itemsinfo.js');
let async = require('async');
let crypto = require('crypto');

let user = new Schema({
	name: {
		type: String,
		require: true
    },
	surname: {
		type: String,
		require: true
    },
	hashedPassword:{
		type: String,
		require:true
	},
	salt: {
        type: String,
        required: true
    },
	ip:{
		type: String,
	},
	email: {
		type: String,
		require:true,
		unique: true
	},
	money: {
		type: Number,
		default:  250
	},
	authpass:{
		type:String,
		default: null
	},
    serial: {
        type: String,
        default: null
    },
    level: {
		type: Number,
		default:  0
	},
    exp: {
		type: Number,
		default:  0
	},
    social: String,
    seatveh: {},
    seat: Number,
    transactions:{
        type:Array,
        default:[],
        title: String,
        money: Number,
        taken: {
            type: Boolean,
            default:false
        },
        date: Number
    },
    login_tokens: String,
    items:{
        
    },
    pos: {},
    heading: {
        type: Number,
        default: 325
    },
    personage:{},
    tattoos: {
        type:Object,
        default: {}
    },
    ban: {
        type: Boolean,
        default: false
    },
    banCount: {
        type: Number,
        default: 0
    },
    reportsMessage: {
        type: Array,
        default: []
    },
    deaths: {
        type: Number,
        default: 0
    },
    kills: {
        type: Number,
        default: 0
    },
    Reason: {
        type: String,
        default: ''
    },
    LiftTimestamp: {
        type: Number,
        default: 0
    },
    job: {
        type: String,
        default: ''
    },
    jobs: {
        farm: {
            exp: {
                type: Number,
                default: 0,
            }
        },
        evacuator: {
            exp: {
                type: Number,
                default: 0,
            }
        },
        trucker: {
            exp: {
                type: Number,
                default: 0,
            }
        }
    },
    fraction: {
        name: String,
        rank: Number,
        warn: {
            type: Number,
            default: 0
        },
        underRang: {
            type: Number,
        },
        hasJoinInterior: {
            type: Boolean,
            default: false
        }
    },
    ip_last: {
        type: String,
    },
    register_date: {
        type: Number,
    },
    lastJoin_date:{
        type: Number
    },
    time_game:{
        type: Number,
        default: 0
    },
    discord: {
        type: String,
        default: ''
    },
    permision: {
        type: String,
        default: 'default'
    },
    vehicles: [{
        type: Schema.Types.ObjectId,
        ref: 'vehicle',
        default: []
    }],
    lspd: {
        stars: {
            type: Number,
            default: 0
        },
        discription:{
            type: String,
            default: ''  
        },
        article:{
            type: String,
            default: ''  
        },
        fines: {
            type: Array,
            default: []
        },
        
    },
    mute: {
        time: Number,
        reason: String,
    },
    jail: {
        time: Number,
        reason: String,
        discription:String,
        article: String
    },
    warn: {
        type: Number,
        default: 0,
    },
    home: {
        type: Schema.Types.ObjectId,
        ref: 'home',
        default: null
    },
    deat:{
        type: Boolean,
        default: false,
    },
    licenses: {
        deliveryPassengers:{
            is: {
                type: Boolean,
                default: false
            },
            date:{
                type: Number,
                default: 0
            }
        },
        driving:{
            is: {
                type: Boolean,
                default: false
            },
            date:{
                type: Number,
                default: 0
            }
        },
        rightBoat:{
            is: {
                type: Boolean,
                default: false
            },
            date:{
                type: Number,
                default: 0
            }
        },
        gun:{
            is: {
                type: Boolean,
                default: false
            },
            date:{
                type: Number,
                default: 0
            }
        },
        rightPlane:{
            is: {
                type: Boolean,
                default: false
            },
            date:{
                type: Number,
                default: 0
            }
        },
        fishing:{
            is: {
                type: Boolean,
                default: false
            },
            date:{
                type: Number,
                default: 0
            }     
        },
        registration:{
            is: {
                type: Boolean,
                default: false
            },   
        }
    },
    benefit: {
        type: Boolean,
        default: false
    },
    dimension: {
        type: Number,
        default: 0
    },
    coin: {
        type: Number,
        default: 0
    },
    health: {
        type: Number,
        default: 100
    },
    satiety: {
        type: Number,
        default: 100
    },
    thirst: {
        type: Number,
        default: 100
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'user' 
    }],
    referral: {
        type: Schema.Types.ObjectId,
        default: null,
    },
    refsIncome: {
        type: Number,
        default: 0
    },
    referrals: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    isYoutuber: {
        type: Boolean,
        default: false
    },
    dateBirth: {
        type: Number,
        default: 766064037043
    },
    educationComplete: {
        type: Boolean,
        default: false
    },
    education: []
});
user.virtual('password')
    .set(function(password){
        this.salt = mp.randomString(30);
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function(){
        return 'Top secret!'
    });
user.methods = {
    encryptPassword: function (password) {
        return crypto.createHmac('sha256', this.salt).update(password).digest('hex');
    },
    checkPassword: function (password) {
        return this.encryptPassword(password) === this.hashedPassword;
    }
};
user.statics = {
    authorize: function(login,password, callback){
        var User = this;
        let emailFilter = /^\b[-._0-9a-zA-Z]+@[-._0-9a-zA-Z]+[\.]{1}[0-9a-zA-Z]+[\.]?[0-9a-zA-Z]\b$/;
        async.waterfall([
            function(callback){
                if (login){
                    if(/([A-z]{1,}) ([A-z]{1,})/.test(login)){
                        let test = login.match(/([A-z]{1,}) ([A-z]{1,})/)
                        User.findOne({name: new RegExp(test[1], "i") ,surname: new RegExp(test[2], "i")}, callback);
                    }
                    else if(/([A-z]{1,})_([A-z]{1,})/.test(login)){
                        let test = login.match(/([A-z]{1,})_([A-z]{1,})/)
                        User.findOne({name: new RegExp(test[1], "i") ,surname: new RegExp(test[2], "i")}, callback);
                    }
                    else User.findOne({email: login}, callback);
                }
            },
            function(user, callback){
                if (user){
                    if (user.checkPassword(password)){
                        callback(null, user);
                    } else {
                        callback(403);
                    }
                } else {
                    callback(403);
                }
            }
        ], callback);
    },
    checkUser: function(username,surname, password,email, ip, callback){
        var User = this;
        var userFilter = /^([a-zA-Z0-9_\-])+$/;
        var surnameFilter = /^([a-zA-Z0-9_\-])+$/;
        var passFilter = /^[a-zA-Z0-9,!,%,&,@,#,$,\^,*,?,_,~,+]*$/;
        let emailFilter = /^\b[-._0-9a-zA-Z]+@[-._0-9a-zA-Z]+[\.]{1}[0-9a-zA-Z]+[\.]?[0-9a-zA-Z]\b$/;
        async.waterfall([
            function(callback){
                if (!userFilter.test(username)) {
                    callback('userError');
                }else if(!surnameFilter.test(username)){
                    callback('userError');
                }else if(!emailFilter.test(email)){
                    callback('emailError');
                }
                else {
                    callback(null);
                }
            },
            function(callback){
                if ((!passFilter.test(password)) || (password.length < 6)) {
                    callback('passwordError');
                } else {
                    callback(null);
                }
            },
            function(callback){
                User.findOne({name: new RegExp(username, "i") ,surname: new RegExp(surname, "i")}, function(err, user){
                    if (user) {
                        callback('doubleUser');
                    } else {
                        callback(null);
                    }
                });
            },
            function(callback){
                User.findOne({email:email}, function(err, user){
                    if (user) {
                        callback('doubleEmail');
                    } else {
                        callback(null);
                    }
                });
            }
        ],
        function(err){
            if (err){
                callback(err);
            } else {
                callback (null);
            }
        });
    },
    createUser: function(username,surname, password,email, ip,social,authpass,personage,serial, callback){
        var User = this;
        async.waterfall([
            function(callback){
                User.checkUser(username,surname, password,email, ip,(err)=>{
                    if(err) callback(err);
                    else callback(null)
                })
            }
        ],
        function(err){
            if (err){
                console.error("------ DB ERROR ----- ", err);
                callback(err);
            } else {
                var user = new User({
                    name: username,
                    surname: surname,
                    password: password,
                    ip:ip,
                    authpass: authpass,
                    email: email,
                    personage:personage,
                    serial: serial,
                    social: social,
                    register_date: Date.now()
                });
                user.save(function(err){
                    if (err) return callback(err);
                    callback (null, user);
                });
            }
        });
    }
};
exports.User = mongoose.model('user',user); 