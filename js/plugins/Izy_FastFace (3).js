//=============================================================================
// Izy_FastFace.js
//=============================================================================
/*:
 *
 * @plugindesc v1.01 This plugin make your text show face faster and easier.
 * @author Izyees Fariz
 *
 * @param Default Face Name
 * @desc The default face name if not set.
 * @default Actor1
 *
 * @param Default Face Index
 * @desc The default face index if not set.
 * @default 0
 *
 * @help
////////Term & Use////////
Free to use for free or commercial game.
Credit me as Izyees Fariz.
--------------------------

////////Plugin Commands////////
Use A Plugin Command To Set,Start,Stop,Pause,Reset Plugin.
You can write either face or Face (with capital F).
--------------------------
- face set Actor1-3
This will set the image Face to Actor1 and the index of 3.

- face setActor 1
This will set the image Face of actor 1.

- face setParty 3
This will set the image Face of the actor in the party in 3rd position (by default 1 to 4 except you have more than 4 party member).
Leave blank return to party leader (party number 1).

- face start
This will start the plugin. Please make sure you start the plugin first.
 
- face pause
This will pause the plugin. This will start the default message system.
 
- face clear
This will clear the face and index.
 
- face default
This will set the face and index to default.
 
- face stop
This will stop the plugin and set the face and index to default.
You can use pause to set the face and index from previous one.
--------------------------

////////Change Log////////
v1.01
- Add SetActor.
- Add SetParty.
- Plugin Command now not case sensitive.
v1.00
- plugin release.
--------------------------
*/



//=============================================================================
// Variables
//=============================================================================
var params = PluginManager.parameters('Izy_FastFace');
var _izyDefaultFaceName = String(params['Default Face Name'] || 'Actor1');
var _izyDefaultFaceIndex = Number(params['Default Face Index'] || 0);
var _izyIsShowFace = false;
var _izyFaceName = _izyDefaultFaceName;
var _izyFaceIndex = _izyDefaultFaceIndex;

//=============================================================================
// Game_Interpreter PluginCommand
//=============================================================================

var FastFace =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        FastFace.call(this, command, args);
		this._izyCommand = String(command);
        if(this._izyCommand.toLowerCase() === 'face') {
			this._argumentZero = String(args[0]);
			switch (this._argumentZero.toLowerCase()) {
				case 'set':
				this._izyFace = args[1].split('-');
				_izyFaceName = this._izyFace[0];
				_izyFaceIndex = this._izyFace[1];
				break;
				case 'setactor':
				var actor = $gameActors.actor(args[1]);
				_izyFaceName = actor._faceName;
				_izyFaceIndex = actor._faceIndex;
				break;
				case 'setparty':
				this._izyPartyIndex = args[1] === undefined ? 1 : args[1];
				console.log(this._izyPartyIndex)
				var party = $gameParty.members()[this._izyPartyIndex - 1];
				_izyFaceName = party._faceName;
				_izyFaceIndex = party._faceIndex;
				break;
				case 'clear':
				_izyFaceName = '';
				_izyFaceIndex = '';
				break;
				case 'default':
				_izyFaceName = _izyDefaultFaceName;
				_izyFaceIndex = _izyDefaultFaceIndex;
				break;
				case 'start':
				_izyIsShowFace = true;
				break;
				case 'pause':
				_izyIsShowFace = false;
				break;
				case 'stop':
				_izyIsShowFace = false;
				_izyFaceName = _izyDefaultFaceName;
				_izyFaceIndex = _izyDefaultFaceIndex;
				break;
			}
		}
    }

// Show Text
Game_Interpreter.prototype.command101 = function() {
    if (!$gameMessage.isBusy()) {
		if (this._params[0] == '') {
			if (_izyIsShowFace) {
				$gameMessage.setFaceImage(_izyFaceName, _izyFaceIndex);
			}
		} else {
			$gameMessage.setFaceImage(this._params[0], this._params[1]);
		}
        $gameMessage.setBackground(this._params[2]);
        $gameMessage.setPositionType(this._params[3]);
        while (this.nextEventCode() === 401) {  // Text data
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        switch (this.nextEventCode()) {
        case 102:  // Show Choices
            this._index++;
            this.setupChoices(this.currentCommand().parameters);
            break;
        case 103:  // Input Number
            this._index++;
            this.setupNumInput(this.currentCommand().parameters);
            break;
        case 104:  // Select Item
            this._index++;
            this.setupItemChoice(this.currentCommand().parameters);
            break;
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};