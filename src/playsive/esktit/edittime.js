function GetPluginSettings()
{
	return {
		"name":			"PlaysiveSDK",			// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"PlaysiveSDK",			// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.002",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Playsive SDK for game integration to playsive platform",
		"author":		"Playsve Technologies LTD",
		"help url":		"playsive.com",
		"category":		"Web",					// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example				
// AddNumberParam("Number", "Enter a number to test if positive.");
// AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");

AddCondition(0, cf_trigger, "On User Info Recived", "Profile", "On User Info Recived", "Triggered On User Info Recived.", "onUserInfoRecived");
AddCondition(1, cf_trigger, "On Best Score Recived", "Profile", "On Best Score Recived", "Triggered On Best Score Recived.", "onBestScoreReceived");
AddCondition(2, cf_trigger, "On Saved Game Data Recived", "Profile", "On Saved Game Data Recived", "Triggered On Saved Game Data Recived.", "onSavedGameDataReceived");


////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
// AddStringParam("Message", "Enter a string to alert.");
// AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");


AddAction(0, af_none, "Game Loaded", "Load Action", "Post Event <b>Game Loaded</b>", "Post event to the platform of Game finished loading", "gameLoaded");
AddNumberParam("Progress", "Enter a number that represents the loading progress (0 - 100)");
AddAction(1, af_none, "Progress Update", "Load Action", "Post Loading Progress Update of <b>{0}</b>", "Post event to the platform of loading progress update", "loadingProgressUpdate");
AddNumberParam("Score", "Enter a number that represents the game score");
AddAction(2, af_none, "Post Score", "Score Action", "Post Score of <b>{0}</b>", "Post event to the platform of score post and game over", "postScore");
AddAction(3, af_none, "Get Best Score", "Score Action", "<b>Get Best Score</b>", "Get The Best Score Of The Current Game", "getBestScore");
AddAction(4, af_none, "Get User Info", "Profile Action", "<b>Get User Info</b>", "Get All User Information", "getUserInfo");
AddStringParam("Data", "Enter Data To Set");
AddAction(5, af_none, "Save Game Data", "Data Action", "<b>Save Game Data</b> {0}", "Save Game Data For The Current Game For The Current User", "saveGameData");
AddAction(6, af_none, "Get Saved Game Data", "Data Action", "<b>Get Saved Game Data</b>", "Get Saved Game Data For The Current Game For The Current User", "getSavedGameData");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
// AddExpression(0, ef_return_number, "Leet expression", "My category", "MyExpression", "Return the number 1337.");
AddExpression(0, ef_return_any, "SDK Version", "SDK", "sdkVersion", "Returns SDK Version");
AddExpression(1, ef_return_any, "SDK Last Updated", "SDK", "sdkLastUpdated", "Returns SDK Last Updated Data");
// for test only
// AddExpression(2, ef_return_any, "User Info Data", "Profile", "UserInfoData", "Returns User Information Data.");
AddExpression(3, ef_return_number, "Best Score Data", "Profile", "bestScoreData", "Returns Best Score Data For Current Game.");
AddExpression(4, ef_return_any, "Saved Game Data", "Profile", "savedGameData", "Returns The Saved Game Data For The Current Game And The Current User.");
AddExpression(5, ef_return_string, "Profile User Name", "Profile", "profileUserName", "Returns The Fullname Of The Current User.");
AddExpression(6, ef_return_string, "Profile Pic Url", "Profile", "profilePicUrl", "Returns The Profile Picture URL Of The Current User.");
AddExpression(7, ef_return_number, "Profile User ID", "Profile", "profileUserID", "Returns The Profile User ID");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	// new cr.Property(ept_integer, 	"My property",		77,		"An example property.")
	new cr.Property(ept_combo,		"Debug",	"true",		"Debug Mode - Logs The action to console", "true|false")	
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}