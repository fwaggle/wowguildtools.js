/*
** Copyright (C) 2013 Jamie Fraser <fwaggle@moodoo.org>
** 
** Permission is hereby granted, free of charge, to any person obtaining 
** a copy of this software and associated documentation files (the 
** "Software"), to deal in the Software without restriction, including 
** without limitation the rights to use, copy, modify, merge, publish, 
** distribute, sublicense, and/or sell copies of the Software, and to 
** permit persons to whom the Software is furnished to do so, subject 
** to the following conditions:
** 
** The above copyright notice and this permission notice shall be 
** included in all copies or substantial portions of the Software.
** 
** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
** EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
** OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
** NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
** LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
** OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
** WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Hard coding this stuff to avoid extra API calls, but it will need 
// updating should the API change?
// This should be current as of 5.3
var classes = Array("Unknown", 
		    "Warrior",		// 1
		    "Paladin",		// 2
		    "Hunter",		// 3
		    "Rogue",		// 4
		    "Priest",		// 5
		    "Death Knight",	// 6
		    "Shaman",		// 7
		    "Mage",		// 8
		    "Warlock",		// 9
		    "Monk",		// 10
		    "Druid"		// 11
);

var races = Array("Unknown", 
		  "Human",	// 1
		  "Orc",	// 2
		  "Dwarf",	// 3
		  "Night Elf",	// 4
		  "Undead",	// 5
		  "Tauren",	// 6
		  "Gnome",	// 7
		  "Troll",	// 8
		  "Goblin",	// 9
		  "Blood Elf",	// 10
		  "Draenei"	// 11
);
races[22] = "Worgen";		// 22
races[25] = "Pandaren";		// 25
races[26] = "Pandaren";		// 26

roster_data = '';

function wowGuild(region, realm, guild) {
	lregion = region;
	lrealm = realm;
	lguild = guild;

	lroster_layer = 'roster';

	var roster_char_list = function(data) {
		d = '<li class="wow_char">';
		d += '<img src="http://' + lregion + '.battle.net/static-render/';
		d += lregion + '/' + data.character.thumbnail;
		d += '?alt=/wow/static/images/2d/avatar/' + data.character.race;
		d += '-' + data.character.gender + '.jpg" alt="';
		d += data.character.name + '" />';
		d += '<span class="name">' + data.character.name + '</span>';
		d += '<span class="level">Level ' + data.character.level;
		d += '</span>';
		d += '<span class="type">';
		d += races[data.character.race] + ' ' + classes[data.character.class];
		d += '</span>';
		d += '</li>';
		return d;
	};
	
	this.roster_render_list = function(layer) {
		lroster_layer = layer;
		var chars = '<ul class="roster">';

		$.each(roster_data.members, function (i, da) {
			chars += '<tr>';
			chars += roster_char_list(da);
			chars += '</tr>';
		});
		chars += '</ul>';

		$('#' + lroster_layer).empty();
		$('#' + lroster_layer).append(chars);
	};
	
	var roster_char_table = function(data) {
		d = '<td>';
		d += data.character.name 
		d += '</td><td>';
		d += data.character.level;
		d += '</td><td>';
		d += races[data.character.race] + ' ' + classes[data.character.class];
		d += '</td>';
		return d;
	};

	this.roster_render_table = function(layer) {
		lroster_layer = layer;
		var chars = '<table class="roster">';

		$.each(roster_data.members, function (i, da) {
			chars += '<tr>';
			chars += roster_char_table(da);
			chars += '</tr>';
		});
		chars += '</table>';

		$('#' + lroster_layer).empty();
		$('#' + lroster_layer).append(chars);
	};
	
	this.name = function(layer) {
		$('#' + layer).empty();
		$('#' + layer).append(roster_data.name);
	};

	this.level = function(layer) {
		$('#' + layer).empty();
		$('#' + layer).append(roster_data.level);
	};

	this.ap = function(layer) {
		$('#' + layer).empty();
		$('#' + layer).append(roster_data.achievementPoints);
	};
	
	this.roster_fetch = function() {
		$.ajax({url: 'http://' + region + '.battle.net/api/wow/guild/' + realm + '/' + guild + '?fields=members&jsonp=roster_callback',
			type: 'GET',
			dataType: 'jsonp'});
	};
}

function roster_callback(data) {
	roster_data = data;
	wowGuildReady();
}