//////////////////////////////////////
// implementation of the multiplayer
// version 1.004 last update date: 23/5/2018
// written by jacob sobolev
//////////////////////////////////////

var PlaysiveSDK = function (debugMode) {
    this.debugMode = debugMode;
    this.userInfoData = undefined;
    this.bestScoreData = undefined;
    this.savedGameData = undefined;
};

//////////////////////////////////////
// Utils
//////////////////////////////////////

PlaysiveSDK.prototype.logger = function (message) {
    if (this.debugMode) {
        console.log("PlaysiveSDK Debug - " + message);
    }
};

PlaysiveSDK.prototype.postToParent = function (postData) {
    if (postData != undefined) {
        if (typeof (postData) != "object") {
            parent.postMessage(postData, "*");
        } else if (typeof (postData) == "object") {
            parent.postMessage(JSON.stringify(postData), "*");
        } else {
            this.logger("Error posting to parent");
        }
    } else {
        this.logger("Error posting to parent");
    }
};

//////////////////////////////////////
// Actions - General
//////////////////////////////////////
// The action post message to the parent, which is the mobile activity ontop
// some of the actions are posting data to update the platfom or the ui
// some of the actions wait for data to get back from the activity

PlaysiveSDK.prototype.gameLoaded = function () {
    //post action game loaded to the platfrom (the game finished loading)
    this.postToParent("gameLoaded");
    this.logger("Action Event (Game Loaded)");
};

PlaysiveSDK.prototype.loadingProgressUpdate = function (progress) {
    //post action of updating the loading progress (the game still being loaded)
    var progressToSend = progress.toFixed(0);
    var postData = {
        "type": "progress",
        "data": progressToSend
    };
    this.postToParent(postData);
    this.logger("Action Event (Loading Progress Update: " + progressToSend + ")");
};

PlaysiveSDK.prototype.postScore = function (score) {
    //post action of the score, this is done by game over state in the game
    //this will end the game and will raise the ui of the parent activity 
    this.postToParent(score);
    this.logger("Action Event (Post Score: " + score + ")");
};

PlaysiveSDK.prototype.getUserInfo = function () {
    //post action that tells the activity to send it the user inforamtion, 
    //and the callback function which will recive it
    var postData = {
        "type": "get_user_info",
        "data": "playsiveSDK.onUserInfoReceived"
    };
    this.postToParent(postData);
    this.logger("Action Event (Get user info: )");
};

PlaysiveSDK.prototype.saveGameData = function (gameData) {
    //post action that saves a data to the server
    //for the current game and the current user
    //can be primitive like int,string,float
    //can be complex object like {"coins": 1500, "rachedLevel": 15}
    var dataToSend = JSON.stringify(gameData);
    if (gameData != undefined) {
        var postData = {
            "type": "save_game_data",
            "data": dataToSend
        };
        this.postToParent(postData);
    }
    this.logger("Action Event (Save game data: " + dataToSend + ")");
};

PlaysiveSDK.prototype.getSavedGameData = function () {
    //post action that tells the activity to send the saved game data
    //for the current game and the current user
    //and the callback function which will recive it
    var postData = {
        "type": "get_game_data",
        "data": "playsiveSDK.onSavedGameDataReceived"
    };
    this.postToParent(postData);
    this.logger("Action Event (Get game data)");
};

PlaysiveSDK.prototype.getBestScore = function () {
    //post action that tells the activity to send it's the best score
    //for the current game and the current user
    //and the callback function which will recive it
    var postData = {
        "type": "get_best_score",
        "data": "playsiveSDK.onBestScoreReceived"
    };
    this.postToParent(postData);
    this.logger("Action Event (Get user best score)");
};

//////////////////////////////////////
// callbacks
//////////////////////////////////////
// callback for actions that need to get information from the platform
// the call back assignes the data so it can be access

PlaysiveSDK.prototype.onUserInfoReceived = function (data) {
    this.userInfoData = data;
    this.logger("Function Callback (onUserInfoReceived: " + data + ")");
    // code what you want to do with the data
};

PlaysiveSDK.prototype.onBestScoreReceived = function (data) {
    if (data !== null && data !== undefined && data > 0){
        this.bestScoreData = data;
        this.logger("Function Callback (onBestScoreReceived: " + data + ")");
    }
    else{
        this.bestScoreData = 0;
        this.logger("Function Callback (onBestScoreReceived: " + data + ", converted to: "+ this.onBestScoreReceived +")"); 
    }
    
    // code what you want to do with the data
};

PlaysiveSDK.prototype.onSavedGameDataReceived = function (data) {
    this.savedGameData = data;
    this.logger("Function Callback (onSavedGameDataReceived: " + data + ")");
    // code what you want to do with the data
};


var playsiveSDK     = new PlaysiveSDK(true);

export { playsiveSDK };


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
// 	"err