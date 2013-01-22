"use strict";

var ObjectCall = require('./lib/objectCall').ObjectCall;
var Constants = require('./constants').Constants;
var User = require('./user').User;

var util = require('util'),
	async = require('async'),
    config = require('config');
   


function NodeServerLoadTest() {
	
}

NodeServerLoadTest.prototype.setup = function () {
	
}

NodeServerLoadTest.prototype.start = function (userNum) {
	
	for (var i=0; i<userNum; i++) {
		var user = new User();
		
	}
}


var test = new NodeServerLoadTest();
test.start(50);