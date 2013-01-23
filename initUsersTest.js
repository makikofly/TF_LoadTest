"use strict";

var ObjectCall = require('./lib/objectCall').ObjectCall;
var Constants = require('./constants').Constants;

var util = require('util'),
	async = require('async'),
    config = require('config');
   


function InitUsersTest() {
	
}

InitUsersTest.prototype.setup = function () {
	
}

InitUsersTest.prototype.start = function (userNum) {
	var self = this;
	self.initUsers(userNum, function() {
		console.log("Successfully created " + userNum + " users.");
	});
}

InitUsersTest.prototype.initUsers = function (number, cb) {
	var baseNumber = Constants.BaseNumber;
	var i = 0;
	async.whilst(
		function() { return i < number; },
		function(whilstCb) {
			var testUserName = "testUser"+i;
			var testUserMobageId = String(baseNumber+i);
			ObjectCall.rpc("session", "init", testUserName, testUserMobageId, [i, {oauth_token : "token", oauth_secret : "secret" }], function(err, response) {
				if (err) {
					whilstCb(err);
				} else {
					// 1 for autobots, 2 for deceptcons.
					// var side = [Math.ceil(Math.random()*10)%2 + 1];
					var side = [2];					
					ObjectCall.rpc("deck", "setInitialDeck", testUserName, testUserMobageId, side, function(err, response) {
						if (err) {
							whilstCb(err);
						} else {
							// Pay attention to the parameters you passed to fusionSpecial
						    ObjectCall.rpc("card", "fusionSpecial", testUserName, testUserMobageId, [ [29,30],12300643 ], function(err, response ) {
								if (err) {
									whilstCb(err);
								} else {
									i++;
									console.log("Init Users, count: " + i);
									whilstCb();							
								}
						    });  
						}
					});
				}
			});
		},
		function(err) {
			cb();
		}
	);
}


var number = 5;
if (process.argv[2]) {
	number = parseInt(process.argv[2]);
}

if (process.argv[3]) {
	Constants.BaseNumber = parseInt(process.argv[3].split('=')[1]);
}

console.log("Start to create " + number + " new users, with mobageId starting from " + Constants.BaseNumber);

var test = new InitUsersTest();
test.start(number);
