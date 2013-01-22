var ObjectRequestNodeHttp = require('./objectRequestNodeHttp').ObjectRequestNodeHttp;

var config = require('config');
var util = require('util');

ObjectCall = {};

ObjectCall.rpc = function(object, handler, id, mobageId, args, cb) {
    
    // var host = config.getRegionalized("gameServer.host");
    // var port = config.getRegionalized("gameServer.port");
	
	// TODO...Read this from config file.
	// var host = "transformers.mobage.cn";
	var host = "transformers.dena-porting.kr";

	var port = "8090";
    
	// logger.debug("args: " + util.inspect(args));
    var data = {
		handler: handler, args: args, binaryVersion: 'agb1c0ea3', configVersion: '', jsVersion: 'undefined', clientEnv: 'ios', mobageId: mobageId
	};
    
    var consumerKey = config.getRegionalized("mobage.consumerKey");
    var consumerSecret = config.getRegionalized("mobage.consumerSecret");
	
    new ObjectRequestNodeHttp({consumerKey: consumerKey, consumerSecret: consumerSecret, token: ""})
        .request('PUT', "http://" + host + ":" + port + "/" + "objects/" + object + "/" + id, data, {'x-content-tag': 'default'}, cb);
};


exports.ObjectCall = ObjectCall;