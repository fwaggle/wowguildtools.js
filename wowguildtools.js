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
	
	lnews = false;
	lachievements = false;
	lchallenges = false;
	
	lthumbnails = true;
	lap = false;
	
	lsort = false;

	this.news = function(value) {
		lnews = value;
	};
	
	this.achievements = function(value) {
		lachievements = value;
	};
	
	this.challenges = function(value) {
		lchallenges = value;
	};

	this.showThumbnails = function(value) {
		lthumbnails = value;
	};
	
	this.showAP = function(value) {
		lap = value;
	};

	this.rosterSort = function(value) {
		lsort = value;
	};
	
	var roster_char_list = function(data) {
		c = data.character;
		d = '<li class="wow_char">';
		if (lthumbnails) {
			d += '<img src="http://' + lregion + '.battle.net/static-render/';
			d += lregion + '/' + c.thumbnail;
			d += '?alt=/wow/static/images/2d/avatar/' + c.race;
			d += '-' + c.gender + '.jpg" alt="';
			d += c.name + '" />';
		}
		d += '<span class="name">' + c.name + '</span>';
		d += '<span class="level">' + c.level;
		d += '</span>';
		d += '<span class="type"><span class="race">' + races[c.race];
		d += '</span> <span class="class">' + classes[c.class];
		d += '</span></span>';
		if (lap) {
			d += '<span class="ap">' + c.achievementPoints + '</span>';
		}
		d += '</li>';
		return d;
	};
	
	this.roster_render_list = function(layer) {
		var chars = '<ul class="roster">';

		switch (lsort) {
			case 'level':
				roster_data.members.sort(function(a,b) {
					return b.character.level - a.character.level;
				});
				break;
			case 'levelasc':
				roster_data.members.sort(function(a,b) {
					return a.character.level - b.character.level;
				});
				break;
			case 'rank':
				roster_data.members.sort(function(a,b) {
					if (a.rank == b.rank) {
						return b.character.level - a.character.level;
					}
					return a.rank - b.rank;
				});
				break;
			case 'ap':
				roster_data.members.sort(function(a,b) {
					return b.character.achievementPoints - a.character.achievementPoints;
				});
				break;
			case 'name':
				roster_data.members.sort(function(a,b) {
					x = a.character.name.toUpperCase();
					y = b.character.name.toUpperCase();
					return ((x < y) ? -1 : (x > y) ? +1 : 0);
				});
				break;
			default:
				break;
		}

		$.each(roster_data.members, function (i, da) {
			chars += '<tr>';
			chars += roster_char_list(da);
			chars += '</tr>';
		});
		chars += '</ul>';

		$('#' + layer).empty();
		$('#' + layer).append(chars);
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
		var chars = '<table class="roster">';

		roster_data.members.sort(function(a,b) {
			return b.character.level - a.character.level;
		});
		
		$.each(roster_data.members, function (i, da) {
			chars += '<tr>';
			chars += roster_char_table(da);
			chars += '</tr>';
		});
		chars += '</table>';

		$('#' + layer).empty();
		$('#' + layer).append(chars);
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
	
	var news_item_list = function(data) {
		ts = new Date(data.timestamp);
		out = '<li><span class="ts">'
		out += ts.toLocaleTimeString();
		out += ' ';
		out += ts.toLocaleDateString();
		out += '</span>';
		
		out += '<span class="event">';
		switch (data.type) {
			case 'playerAchievement':
				out += data.character + ' has earned the achievement ';
				out += data.achievement.title;
				break;
			case 'guildAchievement':
				out += 'The guild has earned the achievement ';
				out += data.achievement.title;
				break;
			case 'guildLevel':
				out += 'The Guild has reached level ';
				out += data.levelUp;
				break;
			default:
				return('');
				break;
		}
		out += '</li></span>';
		
		return(out);
	};
	
	this.news_render_list = function(layer) {
		out = '<ul>';
		$.each(roster_data.news, function (i, da) {
			out += news_item_list(da);
		});
		out += '</ul>';
		
		$('#' + layer).empty();
		$('#' + layer).append(out);
	}
	
	this.fetch = function() {
		// Figure out what fields to grab
		fields = 'members';
		if (lnews) { fields += ',news'; }
		if (lachievements == true) { fields += ',achievements'; }
		if (lchallenges) { fields += ',challenge'; }

		// Construct battle.net URL
		wowurl = 'http://' + region + '.battle.net/api/wow/guild/' + realm;
		wowurl += '/' + guild + '?fields=' + fields;
		wowurl += '&jsonp=roster_callback';
		
		
		// Fetch the data
		$.ajax({url: wowurl,
			type: 'GET',
			dataType: 'jsonp'});
	};
}

function roster_callback(data) {
	roster_data = data;
	wowGuildReady();
}