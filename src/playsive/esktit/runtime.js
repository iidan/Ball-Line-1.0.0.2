//////////////////////////////////////
// implementation of the multiplayer
// version 1.002 last update date: 13/5/2018
// written by jacob sobolev
//////////////////////////////////////
// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.PlaysiveSDK = function (runtime) {
	this.runtime = runtime;
};

(function () {
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.PlaysiveSDK.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function (plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function () {};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function (type) {
		this.type = type;
		this.runtime = type.runtime;

		// any other properties you need, e.g...
		// this.myValue = 0;
	};

	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function () {
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		this.sdkVersion = "1.003";
		this.sdkLastUpdated = "16/3/2018";
		this.DebugMode = ["true", "false"][this.properties[0]] == "true" ? true : false;

		// for triggering condition
		parent["playsiveSelf"] = this;


		//////////////////////////////////////
		// callbacks
		//////////////////////////////////////
		// callback for actions that need to get information from the platform
		// the call back assign the data so it can be access and triggers the condition

		// getUserInfo callback
		parent["playsiveUserDataReceived"] = function (data) {
			parent["playsiveUserInfoData"] = data;
			if (parent["playsiveSelf"].DebugMode) {
				console.log("PlaysiveSDK Debug - Function Callback for getUserInfo: " + JSON.stringify(data));
			}
			parent["playsiveSelf"].runtime.trigger(cr.plugins_.PlaysiveSDK.prototype.cnds.onUserInfoRecived, parent["playsiveSelf"]);
		};

		// getBestScore callback
		parent["playsiveBestScoreReceived"] = function (data) {
			parent["playsiveBestScoreData"] = data;
			if (parent["playsiveSelf"].DebugMode) {
				console.log("PlaysiveSDK Debug - Function Callback for getBestScore: " + data);
			}
			parent["playsiveSelf"].runtime.trigger(cr.plugins_.PlaysiveSDK.prototype.cnds.onBestScoreReceived, parent["playsiveSelf"]);
		};

		// getSavedGameData callback
		parent["playsiveSavedGameDataReceived"] = function (data) {
			parent["playsiveSavedGameData"] = data;
			if (parent["playsiveSelf"].DebugMode) {
				console.log("PlaysiveSDK Debug - Function Callback for saveGameData: " + JSON.stringify(data));
			}
			parent["playsiveSelf"].runtime.trigger(cr.plugins_.PlaysiveSDK.prototype.cnds.onSavedGameDataReceived, parent["playsiveSelf"]);
		};

	};



	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function (ctx) {};

	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw) {};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.onUserInfoRecived = function () {
		//trigger which is called when the get uder data callback finished
		if (this.DebugMode) {
			console.log("PlaysiveSDK Debug - Condition Trigger (onUserInfoRecived)");
		}
		return true;
	};

	Cnds.prototype.onBestScoreReceived = function () {
		//trigger which is called when the get best score callback finished
		if (this.DebugMode) {
			console.log("PlaysiveSDK Debug - Condition Trigger (onBestScoreReceived)");
		}
		return true;
	};

	Cnds.prototype.onSavedGameDataReceived = function () {
		//trigger which is called when the get saved game data callback finished
		if (this.DebugMode) {
			console.log("PlaysiveSDK Debug - Condition Trigger (onSavedGameDataReceived)");
		}
		return true;
	};


	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	//////////////////////////////////////
	// The action post message to the parent, which is the mobile activity ontop
	// some of the actions are posting data to update the platfom or the ui
	// some of the actions wait for data to get back from the activity

	function Acts() {};

	Acts.prototype.gameLoaded = function () {
		//post action game loaded to the platfrom (the game finished loading)
		parent.postMessage("gameLoaded", "*");
		if (this.DebugMode) {
			console.log("PlaysiveSDK Debug - Load Action (gameLoaded)");
		}
		
	};

	Acts.prototype.loadingProgressUpdate = function (progress) {
		//post action of updating the loading progress (the game still being loaded)
		var progressToSend = progress.toFixed(0);
		var postData = {
			"type": "progress",
			"data": progressToSend
		};
		parent.postMessage(JSON.stringify(postData), "*");
		if (this.DebugMode) {
			console.log("PlaysiveSDK Debug - Load Action (loadingProgressUpdate: " + progressToSend + " )");
		}
	};

	Acts.prototype.postScore = function (score) {
		//post action of the score, this is done by game over state in the game
		//this will end the game and will raise the ui of the parent activity 
		parent.postMessage(score, "*");
		if (this.DebugMode) {
			console.log("PlaysiveSDK Debug - Post Action (postScore: " + score + ")");
		}
	};

	Acts.prototype.getUserInfo = function () {
		//post action that tells the activity to send it the user inforamtion, 
		//and the callback function which will recive it
		var postData = {
			"type": "get_user_info",
			"data": "parent.playsiveUserDataReceived"
		};
		parent.postMessage(JSON.stringify(postData), "*");
		if (this.DebugMode) {
			console.log("PlaysiveSDK Debug - Profile Action (getUserInfo)");
		}
	};


	Acts.prototype.getBestScore = function () {
		//post action that tells the activity to send it's the best score
		//for the current game and the current user
		//and the callback function which will recive it
		var postData = {
			"type": "get_best_score",
			"data": "parent.playsiveBestScoreReceived"
		};
		parent.postMessage(JSON.stringify(postData), "*");
		if (this.DebugMode) {
			console.log("PlaysiveSDK Debug - Profile Action (getBestScore)");
		}
	};

	Acts.prototype.saveGameData = function (data) {
		//post action that saves a data to the server
		//for the current game and the current user
		//can be primitive like int,string,float
		//can be complex object like {"coins": 1500, "rachedLevel": 15}
		var dataToSend = JSON.stringify(data);
		if (data) {
			var postData = {
				"type": "save_game_data",
				"data": dataToSend
			};
			parent.postMessage(JSON.stringify(postData), "*");
		}
		if (this.DebugMode) {
			console.log("PlaysiveSDK Debug - Profile Action (saveGameData: " + dataToSend + " )");
		}
	};

	Acts.prototype.getSavedGameData = function () {
		//post action that tells the activity to send the saved game data
		//for the current game and the current user
		//and the callback function which will recive it
		var postData = {
			"type": "get_game_data",
			"data": "parent.playsiveSavedGameDataReceived"
		};
		parent.postMessage(JSON.stringify(postData), "*");
		if (this.DebugMode) {
			console.log("PlaysiveSDK Debug - Profile Action (getSavedGameData)");
		}
	};

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	//////////////////////////////////////
	// returns plugins memebers
	// and recived data from the callbacks of gettings data from the parent activity	
	function Exps() {};

	Exps.prototype.sdkVersion = function (ret) {
		ret.set_string(this.sdkVersion);
	};

	Exps.prototype.sdkLastUpdated = function (ret) {
		ret.set_string(this.sdkLastUpdated);
	};

	// Exps.prototype.UserInfoData = function (ret) {
	// 	ret.set_any(JSON.stringify(parent["playsiveUserInfoData"]));
	// };

	Exps.prototype.bestScoreData = function (ret) {
		ret.set_int(parent["playsiveBestScoreData"]);
	};

	Exps.prototype.savedGameData = function (ret) {
		ret.set_any(parent["playsiveSavedGameData"]);
	};

	Exps.prototype.profileUserName = function (ret) {
		var dataObj = parent["playsiveUserInfoData"];
		ret.set_string(dataObj["firstname"] + " " + dataObj["lastname"]);
	};

	Exps.prototype.profilePicUrl = function (ret) {
		var dataObj = parent["playsiveUserInfoData"];
		ret.set_string(dataObj["profilepic"]);
	};

	Exps.prototype.profileUserID = function (ret) {
		var dataObj = parent["playsiveUserInfoData"];
		ret.set_int(dataObj["userid"]);
	};

	pluginProto.exps = new Exps();




}());

//profile data exmaple

// {
// 	"status": "success",
// 	"data": {
// 		"userData": {
// 			"following_count": "66",
// 			"follower_count": "80",
// 			"level": "14",
// 			"waittime": "2",
// 			"xp": "190820",
// 			"diamonds": "-2504",
// 			"unlockedgamepercentage": "99",
// 			"minimumexperienceforcurrentlevel": "159923",
// 			"minimumexperiencefornextlevel": "213253",
// 			"diamondcost": "70",
// 			"firstname": "Tft",
// 			"lastname": "Device",
// 			"profilepic": "https://graph.facebook.com/255560104853709/picture?height=250&width=250&migration_overrides=%7Boctober_2012%3Atrue%7D",
// 			"isdeveloper": true
// 		},
// 		"games": []
// 	},
// 	"errorData": null
// }