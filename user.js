"use strict";

var ObjectCall = require('./lib/objectCall').ObjectCall;
var Constants = require('./constants').Constants;

var util = require('util'),
	async = require('async'),
    config = require('config');


function User (mobageId) {
	this._gamerTag = "testUser" + mobageId;
	this._mobageId = String(mobageId);
	this._error = null;
	this._round = 0;
}

User.prototype.play = function () {
	var self = this;
	setTimeout(function() {
		self.generateBoss(self._gamerTag, self._mobageId, function(err2, response2) {
			if (err2) {
				self.recordErr(err2);
				return;
			} else {
				var bossUid = response2.data.id;
				self.log("Boss Generated, UID: " + bossUid);
				setTimeout(function() {
					self.fightBossUntilDeath(self._gamerTag, self._mobageId, bossUid, function(err3, res3) {
						if (err3) {
							self.recordErr(err3);
							return;
						} else {
							self.log("Boss Defeated, UID: " + bossUid);
							setTimeout(function() {
								self.getRanking(self._gamerTag, self._mobageId, function(err4, res4) {
									if (err4) {
										self.recordErr(err4);
										return;
									} else {
										self.log("Total Points: " + res4.data.myPosition.points + ", Position: " + res4.data.myPosition.position);
										setTimeout(function() {
											self.collectRewards(self._gamerTag, self._mobageId, bossUid, function(err5, res5) {
												if (err5) {
													self.recordErr(err5);
													return;
												} else {
													self._round++;
													self.log("Round " + self._round + " Completed!");
													self.play();
												}
											});										
										}, 5000);
									}
								});	
							}, 5000);
						}
					});
				}, 5000);
			}
		});				
	}, 5000);	
}

User.prototype.registerForEvent = function (cb) {
	var self = this;
	ObjectCall.rpc("event", "register", self._gamerTag, self._mobageId, [5], function (err, response) {
		cb(err, response);
	});
}

User.prototype.generateBoss = function (gamerTag, userMobageId, cb) {
	var self = this;
	ObjectCall.rpc("event", "generateBoss", self._gamerTag, self._mobageId, [], function(err2, response2) {
		cb(err2, response2);
	});
}

User.prototype.fightBossUntilDeath = function (gamerTag, userMobageId, bossUid, cb) {
	var end = false;
	async.whilst(
		function() { return !end },
		function (whilstCb) {
			// self.log("Fight Boss, gamerTag: " + gamerTag + "bossUid: " + bossUid);
			var spentEnergy = Math.ceil(Math.random()*10)%3 + 1;  // Spent energy can be 1, 2, or 3
	        ObjectCall.rpc("event", "fightBoss", gamerTag, userMobageId, [ bossUid, spentEnergy ], function (fightBossError, fightBossResponse) {
				if (fightBossError) {
					end = true;
					whilstCb(fightBossError);
				} else if (fightBossResponse.data.isError) {
					end = true;
					whilstCb(fightBossResponse.data.details);
				} else if (fightBossResponse.data.playerWins) {
					end = true;
					whilstCb();
				} else {
					// Fought boss, but didn't defeat it.
					end = false;
					whilstCb();
				}
	        });
		},
		function (err) {
			cb(err, null);
		}
	);
}

User.prototype.getRanking = function (gamerTag, userMobageId, cb) {
    ObjectCall.rpc("event", "getRanking", gamerTag, userMobageId, [ 0, 10 ], function(getRankingError, getRankingResponse) {
		cb(getRankingError, getRankingResponse);
    });
}

User.prototype.collectRewards = function (gamerTag, userMobageId, bossUid, cb) {
	ObjectCall.rpc("event", "getRaidBossRewards", gamerTag, userMobageId, [bossUid], function (err, response) {
		cb(err, response);
	});
}

User.prototype.log = function (msg) {
	var self = this;
	console.log("[ " + self._gamerTag + " ], " + msg);
}

User.prototype.recordErr = function(err) {
	var self = this;
	self._error = err;
	self.log("ERROR! " + util.inspect(err));
}

exports.User = User;