"use strict";

var ObjectCall = require('./lib/objectCall').ObjectCall;
var Constants = require('./constants').Constants;
var User = require('./user').User;

var util = require('util'),
	async = require('async'),
    config = require('config');


function RedisServerLoadTest() {
	
}

RedisServerLoadTest.prototype.setup = function () {
	
}

RedisServerLoadTest.prototype.start = function (userNum) {
	// var baseNum = Constants.BaseNumber;
	// var i = 0;
	// async.whilst(
	// 	function() { return i < userNum; },
	// 	function(whilstCb) {
	// 		i++;
	// 		var user = new User(baseNum + i);
	// 		user.registerForEvent(function(err, res) {
	// 			if (err) {
	// 				console.log("Register For Event Failed, Error: " + util.inspect(err));
	// 				whilstCb(err);
	// 			} else {
	// 				user.play();					
	// 			}
	// 		});
	// 	},
	// 	function (err) {
	// 		if (err) {
	// 			console.error("Fail.............");
	// 		} else {
	// 			console.log("PASS!!!!!!!!!!!!");
	// 		}
	// 	}
	// );	
	var baseNum = Constants.BaseNumber;
	for (var i=0; i<userNum; i++) {
		var user = new User(baseNum + i + 1);
		user.log("Created!");
		user.registerForEvent(function(err, res) {
			if (err) {
				console.log("Register For Event Failed, Error: " + util.inspect(err));
			} else {
				console.log("Register For Event SUCCESS!!!!")				
			}
		});					
	}
	
	for (var i=0; i<userNum; i++) {
		var user = new User(baseNum + i + 1);
		user.play();
	}
}

var concurrentUsers = 5;
if (process.argv[2]) {
	concurrentUsers = parseInt(process.argv[2]);
}


var test = new RedisServerLoadTest();
test.start(concurrentUsers);