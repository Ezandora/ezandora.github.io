//This source file is public domain.

function calculateNumberologyValues(ascensions, level, spleen_used, adventures, moon_sign_id)
{
	let b = spleen_used + level;
	let c = (ascensions + moon_sign_id) * b + adventures;
	
	let solutions = [];
	let closest_point = [];
	
	
	for (let x = 0; x <= 99; x++)
	{
		closest_point[x] = 99;
	}
	
	for (let x = 0; x <= 99; x++)
	{
		let v = x * b + c;
		let last_two_digits = v % 100;
		
		solutions[last_two_digits] = x;
		
		for (let x2 = 0; x2 <= 99; x2++)
		{
			let delta = x2 - last_two_digits;
			if (delta <= 0)
				closest_point[x2] = Math.min(closest_point[x2], -delta);
			else
			{
				delta = x2 - (last_two_digits + 100)
				if (delta <= 0)
					closest_point[x2] = Math.min(closest_point[x2], -delta);
			}
		}
	}
	
	let result = {};
	result["solutions"] = solutions;
	result["adventures until solution"] = closest_point;
	return result;
}

function numberologyExplanations()
{
	let explain_it_all = [];
	let nons = [24,25,26,28,29,31,32,39,41,42,46,52,53,54,55,56,59,60,61,62,64,65,67,72,73,74,76,79,80,81,82,84,85,86,91,92,94,95,96];
	for (let i = 0; i < nons.length; i++)
		explain_it_all[nons[i]] = "Try Again";
	//na, na, na na na
	
	let bottles = "<a href=\"https://wiki.kingdomofloathing.com/Bottle_of_gin\">bottle of gin</a>, <a href=\"https://wiki.kingdomofloathing.com/Bottle_of_rum\">bottle of rum</a>, <a href=\"https://wiki.kingdomofloathing.com/Bottle_of_vodka\">bottle of vodka</a>, or <a href=\"https://wiki.kingdomofloathing.com/Bottle_of_whiskey\">bottle of whiskey</a>";
	
	explain_it_all[0] = "0 meat";
	explain_it_all[1] = "seal-clubbing club";
	explain_it_all[2] = "Sleepy (100 adventures)";
	explain_it_all[3] = "Confused (100 adventures)";
	explain_it_all[4] = "Embarrassed (100 adventures)";
	explain_it_all[5] = "Far Out (100 adventures)";
	explain_it_all[6] = "Wings (100 adventures)";
	explain_it_all[7] = "Beaten Up (100 adventures)";
	explain_it_all[8] = "Hardly Poisoned At All (100 adventures)";
	explain_it_all[9] = "Knob Goblin Perfume (100 adventures)";
	explain_it_all[10] = "Steriod Boost (100 adventures)";
	explain_it_all[11] = "-1 to +3 drunkenness";
	explain_it_all[12] = "Fight gnollish gearhead";
	explain_it_all[13] = "Nothing... or is it?";
	explain_it_all[14] = "14 moxie weeds (autosell for 1400 meat)";
	explain_it_all[15] = "15 meat";
	explain_it_all[16] = "[?-3] magicalness-in-a-can";
	explain_it_all[17] = "+1 adventure";
	explain_it_all[18] = bottles;
	explain_it_all[19] = "+21? moxie?";
	explain_it_all[20] = "-19-20? mainstat?";
	explain_it_all[21] = "+1 fight";
	explain_it_all[22] = "pygmy phone number";
	explain_it_all[23] = "+22? muscle?";
	explain_it_all[27] = "+25? moxie?";
	explain_it_all[30] = "Fight a ghuol";
	explain_it_all[33] = "[?] magicalness-in-a-can";
	explain_it_all[34] = "+38-50? mainstat";
	explain_it_all[35] = "-38? muscle?";
	explain_it_all[36] = "+2 adventures";
	explain_it_all[37] = "+3 fights";
	explain_it_all[38] = "+24? myst?";
	explain_it_all[40] = "40 meat";
	explain_it_all[43] = "+26? muscle?";
	explain_it_all[44] = bottles;
	explain_it_all[45] = "[?] magicalness-in-a-can";
	explain_it_all[47] = "+44? moxie?";
	explain_it_all[48] = "Fight your butt";
	explain_it_all[49] = "+49? mainstat";
	explain_it_all[50] = "-53-57? myst?";
	explain_it_all[51] = "War Frat 151st Infantryman";
	explain_it_all[57] = "+46? moxie?";
	explain_it_all[58] = "Teleportitis (10 adventures)";
	explain_it_all[63] = "+36-40? muscle?";
	explain_it_all[66] = "[?] magicalness-in-a-can";
	explain_it_all[68] = "+33-41? myst?";
	explain_it_all[69] = "+3 adventures";
	explain_it_all[70] = "+77? mainstat?";
	explain_it_all[71] = "-70? myst?";
	explain_it_all[75] = bottles;
	explain_it_all[77] = "spooky stick";
	explain_it_all[78] = "+41? myst?";
	explain_it_all[83] = "+50? muscle?";
	explain_it_all[87] = "+40-52? moxie?";
	explain_it_all[88] = "[?] magicalness-in-a-can";
	explain_it_all[89] = "+89? mainstat";
	explain_it_all[90] = "-97? muscle?";
	explain_it_all[93] = "93 meat";
	explain_it_all[97] = "[?] magicalness-in-a-can";
	explain_it_all[98] = "+58-59? myst?";
	explain_it_all[99] = bottles;
	
	return explain_it_all;
}

function numberologyURLs()
{
	let urls = [];
	urls[0] = ""; //0 meat
	urls[1] = "https://wiki.kingdomofloathing.com/Seal-clubbing_club"; //seal-clubbing club
	urls[2] = "https://wiki.kingdomofloathing.com/Sleepy"; //Sleepy (100 adventures)
	urls[3] = "https://wiki.kingdomofloathing.com/Confused"; //Confused (100 adventures)
	urls[4] = "https://wiki.kingdomofloathing.com/Embarrassed"; //Embarrassed (100 adventures)
	urls[5] = "https://wiki.kingdomofloathing.com/Far_Out"; //Far Out (100 adventures)
	urls[6] = "https://wiki.kingdomofloathing.com/Wings"; //Wings (100 adventures)
	urls[7] = "https://wiki.kingdomofloathing.com/Beaten_Up"; //Beaten Up (100 adventures)
	urls[8] = "https://wiki.kingdomofloathing.com/Hardly_Poisoned_at_All"; //Hardly Poisoned At All (100 adventures)
	urls[9] = "https://wiki.kingdomofloathing.com/Knob_Goblin_Perfume"; //Knob Goblin Perfume (100 adventures)
	urls[10] = "https://wiki.kingdomofloathing.com/Steroid_Boost"; //Steriod Boost (100 adventures)
	urls[11] = ""; //+ or - drunkenness?
	urls[12] = "https://wiki.kingdomofloathing.com/Gnollish_Gearhead"; //Fight gnollish gearhead
	urls[13] = ""; //Nothing... or is it?
	urls[14] = "https://wiki.kingdomofloathing.com/Moxie_weed"; //14 moxie weeds (autosell for 1400 meat)
	urls[15] = ""; //15 meat
	urls[16] = "https://wiki.kingdomofloathing.com/Magicalness-in-a-can"; //[?-3] magicalness-in-a-can
	urls[17] = ""; //+1 adventure
	urls[18] = ""; //[bottle of rum, bottle of gin, bottle of vodka, ?]
	urls[19] = ""; //+21? moxie?
	urls[20] = ""; //-19-20? mainstat?
	urls[21] = ""; //+1 fight
	urls[22] = "https://wiki.kingdomofloathing.com/Pygmy_phone_number"; //pygmy phone number
	urls[23] = ""; //+22? muscle?
	urls[27] = ""; //+25? moxie?
	urls[30] = "https://wiki.kingdomofloathing.com/Ghuol"; //Fight a ghuol
	urls[33] = ""; //[?] magicalness-in-a-can
	urls[34] = ""; //+38-50? mainstat
	urls[35] = ""; //-38? muscle?
	urls[36] = ""; //+2 adventures
	urls[37] = ""; //+3 fights
	urls[38] = ""; //+24? myst?
	urls[40] = ""; //40 meat
	urls[43] = ""; //+26? muscle?
	urls[44] = ""; //[bottle of rum, bottle of whiskey, ?]
	urls[45] = ""; //[?] magicalness-in-a-can
	urls[47] = ""; //+44? moxie?
	urls[48] = "https://wiki.kingdomofloathing.com/Your_butt"; //Fight your butt
	urls[49] = ""; //+49? mainstat
	urls[50] = ""; //-53-57? myst?
	urls[51] = "https://wiki.kingdomofloathing.com/War_Frat_151st_Infantryman"; //War Frat 151st Infantryman
	urls[57] = ""; //+46? moxie?
	urls[58] = "https://wiki.kingdomofloathing.com/Teleportitis"; //Teleportitis (10 adventures)
	urls[63] = ""; //+36-40? muscle?
	urls[66] = "https://wiki.kingdomofloathing.com/Magicalness-in-a-can"; //[?] magicalness-in-a-can
	urls[68] = ""; //+33-41? myst?
	urls[69] = ""; //+3 adventures
	urls[70] = ""; //+77? mainstat?
	urls[71] = ""; //-70? myst?
	urls[75] = ""; //[bottle of rum, bottle of vodka, bottle of gin, ?]
	urls[77] = "https://wiki.kingdomofloathing.com/Spooky_stick"; //spooky stick
	urls[78] = ""; //+41? myst?
	urls[83] = ""; //+50? muscle?
	urls[87] = ""; //+40-52? moxie?
	urls[88] = "https://wiki.kingdomofloathing.com/Magicalness-in-a-can"; //[?] magicalness-in-a-can
	urls[89] = ""; //+89? mainstat
	urls[90] = ""; //-97? muscle?
	urls[93] = ""; //93 meat
	urls[97] = "https://wiki.kingdomofloathing.com/Magicalness-in-a-can"; //[?] magicalness-in-a-can
	urls[98] = ""; //+58-59? myst?
	urls[99] = ""; //[bottle of rum, bottle of gin, bottle of whiskey, ?]
	
	return urls;
}


function generateIntegerPresenceMap(array)
{
	let result = [];
	for (let i = 0; i < array.length; i++)
		result[array[i]] = true;
	return result;
}

function solveNumberology()
{
	let ascensions_input = document.getElementById("ascensions").value;
	let level_input = document.getElementById("level").value;
	let spleen_used_input = document.getElementById("spleen_used").value;
	let adventures_left_input = document.getElementById("adventures_left").value;
	let moon_sign_input = document.getElementById("moon_sign").value;
	
	//Save inputs:
	try
	{
		if (typeof localStorage !== "undefined")
		{
			let saved_ascensions = localStorage.getItem("ascensions");
			if (saved_ascensions != ascensions_input)
			{
				document.getElementById("moon_sign").value = -1;
				moon_sign_input = document.getElementById("moon_sign").value;
				
			}
			
			
			localStorage.setItem("ascensions", ascensions_input);
			localStorage.setItem("moon_sign", moon_sign_input);
		}
	}
	catch (exception)
	{
	}
	
	if (ascensions_input.length == 0 || level_input.length == 0 || spleen_used_input.length == 0 || adventures_left_input.length == 0 || moon_sign_input == "-1") //need more data
	{
		document.getElementById("results").innerHTML = "";
		return;
	}
	
	
	let calculation_result = calculateNumberologyValues(parseInt(ascensions_input), parseInt(level_input), parseInt(spleen_used_input), parseInt(adventures_left_input), parseInt(moon_sign_input));
	
	let solutions = calculation_result["solutions"];
	let adventures_until_solution = calculation_result["adventures until solution"];
	
	
	let explain_it_all = numberologyExplanations();
	let explain_urls = numberologyURLs();
	
	let index_display_order_base = [];
	index_display_order_base.push([69, 37, 51, 89]); //useful things
	index_display_order_base.push([]); //default - will always be index 1, so try not to move this
	index_display_order_base.push([17, 36]); //adventures
	index_display_order_base.push([18,44,75,99]); //rum
	index_display_order_base.push([12,30,48]); //monsters to fight
	index_display_order_base.push([2,3,4,5,6,7,8,9,10,58]); //effects
	index_display_order_base.push([1,22,77,14]); //Items
	index_display_order_base.push([0,15,40,93]); //meat
	index_display_order_base.push([23,35,43,63,83,90]); //muscle statgain
	index_display_order_base.push([38,50,68,71,78,98]); //myst statgain
	index_display_order_base.push([19,27,47,57,87]); //moxie statgain
	index_display_order_base.push([20,89,70,34,49]); //misc. statgain
	index_display_order_base.push([16,33,45,66,88,97]); //magicalness-in-a-can
	index_display_order_base.push([13]); //ooOoOoOo
	
	let index_display_order = [];
	for (let i = 0; i < index_display_order_base.length; i++)
	{
		index_display_order[i] = generateIntegerPresenceMap(index_display_order_base[i]);
	}
	
	//Array of an array:
	let ordered_options = [];
	for (let i = 0; i < index_display_order_base.length; i++)
		ordered_options[i] = [];
		
	
	for (let x = 0; x <= 99; x++)
	{
		let explaination = explain_it_all[x];
		let url = explain_urls[x];
		if (url === null || url === undefined)
			url = "";
		let intro = "";
		if (solutions[x] != undefined)
			intro = "<strong>" + solutions[x] + "</strong>";
		else if (adventures_until_solution[x] > 0 && adventures_until_solution[x] < 99)
			intro = "Wait " + adventures_until_solution[x] + " adv";
		else
			intro = "Unknown";
		
		let outro = "";
		if (url.length > 0)
			outro += "<a href=\"" + url + "\">";
		outro += explaination;
		if (url.length > 0)
			outro += "</a>";
		outro += " ";
		outro += "<span style=\"color:grey;font-size:0.8em;\">(" + x + ")</span>";
		
		let line = [intro, outro];
		
		if (explaination === "Try Again")
		{
			//not worth showing?
			continue;
		}
		let importance_index = 1;
		
		
		for (let i = 0; i < index_display_order.length; i++)
		{
			if (index_display_order[i][x] != undefined)
			{
				importance_index = i;
				break;
			}
		}
			
		ordered_options[importance_index].push(line);
	}
	
	//Linearise options, calculate linebreak indices:
	let all_options = [];
	let linebreak_indices = [];
	for (let i = 0; i < ordered_options.length; i++)
	{
		for (let j = 0; j < ordered_options[i].length; j++)
			all_options.push(ordered_options[i][j]);
		if (ordered_options[i].length > 0 && i != ordered_options.length - 1)
			linebreak_indices[all_options.length - 1] = true;
	}
		
	//Format HTML:
	let result_html = "";
	result_html += "<hr>";
	
	result_html += "<div style=\"display:table;margin-left:auto; margin-right:auto;\">";
	result_html += "<div style=\"display:table-row;\">";
	result_html += "<div style=\"display:table-cell;font-weight:bold;text-decoration:underline;\">Input this</div>";
	result_html += "<div style=\"display:table-cell;font-weight:bold;padding-left:1em;text-decoration:underline;\">For this</div>";
	result_html += "</div>";
	
	for (let i = 0; i < all_options.length; i++)
	{
		let option = all_options[i];
		
		let row_html = "";
		row_html += "<div style=\"display:table-row;";
		if (option[1] === "Try Again")
		{
			row_html += "color:grey;";
		}
		if (i % 2 == 0)
			row_html += "background-color:#EEEEEE;";
		row_html += "\">";
		row_html += "<div style=\"display:table-cell;text-align:right;padding-top:5px;padding-bottom:5px;";
		if (linebreak_indices[i])
			row_html += "border-bottom:1px solid black;";
		row_html += "\">";
		row_html += option[0];
		row_html += "</div>";
		row_html += "<div style=\"display:table-cell;padding-left:1em;";
		if (linebreak_indices[i])
			row_html += "border-bottom:1px solid black;";
		row_html += "\">";
		row_html += option[1];
		row_html += "</div>";
		row_html += "</div>";
		result_html += row_html;
	}
	
	result_html += "</div>";
	document.getElementById("results").innerHTML = result_html;
}

function pageLoaded()
{
	let focus_on_level = false;
	try
	{
		if (typeof localStorage !== "undefined")
		{
			//retrieve from cache:
			let saved_ascensions = localStorage.getItem("ascensions");
			let saved_moon_sign = localStorage.getItem("moon_sign");
			if (saved_ascensions != undefined)
			{
				document.getElementById("ascensions").value = saved_ascensions;
				focus_on_level = true;
			}
			if (saved_moon_sign != undefined)
				document.getElementById("moon_sign").value = saved_moon_sign;
		}
	}
	catch (exception)
	{
	}
	if (focus_on_level)
		document.getElementById("level").focus();
	else
		document.getElementById("ascensions").focus();
}