var __lr_state_is_left = true;
var __combination_results = undefined;
var __saved_attempts = [];
var __best_code_left = [];
var __best_code_right = [];

function generateRegularData()
{
	document.getElementById("tabs_input").value = "B1: Nothing\nB2: 000000\n000000\nB3: 000101\nB4: 000100\nB5: 100011\nB6: 100012\nB5: 201210\n111221\nB3: 211002 - lightrings2.gif - A large ring of light";
}

function generateTestData()
{
	__saved_attempts = [[[0,1,2,0,0,0], "L", "Down", 0, 1],
		[[1,3,4,0,0,0], "L", "Down", 1, 1],
		[[4,3,0,0,0,0], "L", "Down", 1, 0],
		[[3,3,1,0,0,0], "L", "Down", 2, 0],
	];
	/*__saved_attempts = [[[0,1,2,0,0,0], "L", "Down", 0, 1],
		[[1,3,4,0,0,0], "L", "Down", 1, 1]
	];*/
	
	//document.getElementById("tabs_input").value = "1 000010\n2 000000\n3 000000\n4 000110\n5 000000\n6 000211\n6 100122\n6 211000\n6 211211\n6 012120\n6 122001\n2 112021\n5 012211\n5 012101\n5 002021\n4 012101\n5 002021";
	//document.getElementById("tabs_input").value = "000000\nB1: Nothing\nB2: Nothing?\nB3: 000101\nB4: 000100\nB5: 100011\nB6: 100012\nB5: 201210\nB5: 011121\nB5: 211002 - lightrings2.gif - A large ring of light\nB5: 022200 - lightrings3.gif - A small flashing ring of light\nB1: 211002 - lightrings2.gif - A large ring of light\nB3: 212100 - lightrings2.gif - A large ring of light\nB3: 212201 - lightrings3.gif - A small flashing ring of light\nB1: 112000\nB3: 112101\nB3: 112202\nB3: 110110\nB3: 110211\nB3: 110022 - lightrings1.gif - A large flashing ring of light\nB3: 111120 - lightrings1.gif - A large flashing ring of light\nB3: 111221 - lightrings2.gif - A large ring of light\nB3: 211002 - lightrings2.gif - A large ring of light";
	//document.getElementById("tabs_input").value = "000000\nB1: Nothing\nB2: Nothing?";
}

function randomi(min, max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//Returns true if done.
function iterateCode(code)
{
	//Try next code:
	var i = 5;
	while (i >= 0)
	{
		code[i]++;
		if (code[i] > 10)
		{
			code[i] = 0;
			i--;
		}
		else
			break;
	}
	if (i < 0)
		return true;
	return false;
}

function solidCountForCodes(code_a, code_b, starting_position)
{
	var count = 0;
	for (var i = starting_position; i <= starting_position + 2; i++)
	{
		if (code_a[i] == code_b[i])
			count++;
	}
	return count;
}

//var __blinking_cache = [];
function blinkingCountForCodes(code_a, code_b, starting_position)
{
	//Lookup cache if this is too slow:
	/*if (__blinking_cache.length == 0)
	{
		for (var i = 0; i < 11 * 11 * 11 * 11 * 11 * 11; i++)
			__blinking_cache.push(-1);
	}
	var cache_index = code_a[0] + code_a[1] * 11 + code_a[2] * 11 * 11 + code_b[0] * 11 * 11 * 11 + code_b[1] * 11 * 11 * 11 * 11 + code_b[2] * 11 * 11 * 11 * 11 * 11;
	if (__blinking_cache[cache_index] != -1)
		return __blinking_cache[cache_index];*/
	//How on earth can we compute this quickly?
	//I know!
	//Just hardcode it. That's a perfect idea.
	var marked_positions = [false, false, false];
	var count = 0;
	for (var i = starting_position; i <= starting_position + 2; i++)
	{
		if (code_a[i] != code_b[i])
		{
			//Not a solid.
			//Does this digit exist in a non-solid position? If so, mark it.
			for (var j = starting_position; j <= starting_position + 2; j++)
			{
				if (i == j) continue;
				if (code_a[j] == code_b[j]) continue; //j is solid position, ignore
				if (marked_positions[j - starting_position]) continue;
				if (code_a[i] == code_b[j]) //we found one
				{
					//console.log(i + ", " + j);
					marked_positions[j - starting_position] = true;
					count++;
					break;
				}
			}
		}
	}
	//__blinking_cache[cache_index] = count;
	return count;
}

function guessBestCombination(possibilities, starting_index)
{
	if (possibilities.length == 0)
		return [];
	
	//We now have a list of every possible answer it could be.
	//From here, we pick the two possibilities that eliminate the most of the rest...?
	//Like, 000 won't eliminate as many as 012.
	//Go through each possibility. Assume that one is our guess. Now, assume every other possibility is our answer. How many did we eliminate in that case? Sum.
	
	//First convert possibilities into limited form:
	var limited_possibilities = [];
	var seen_numbers = {};
	for (var i = 0; i < possibilities.length; i++)
	{
		var code = possibilities[i];
		var number = code[starting_index] * 11 * 11 + code[starting_index + 1] * 11 + code[starting_index + 2];
		if (seen_numbers[number])
			continue;
		seen_numbers[number] = true;
		limited_possibilities.push([code[starting_index], code[starting_index + 1], code[starting_index + 2]]);
	}
	//Hardcode the first one:
	//Though our estimation function returns this anyways...
	if (limited_possibilities.length == 1331)
		return [0, 1, 2];
	
	//If we have too many possibilities, don't bother trying knuth's algorithm, because forever.
	//Instead, pick the possibility that has the most digits we haven't seen yet. Followed by... the maximum distance from seen attempts? From itself?
	
	//512 - 9.8s Safari. 5.6s chrome.
	//1000 - 76.513s Safari. 46.20594s chrome.
	//768 - 34.5s Safari. 18.9039s chrome.
	
	console.log("limited_possibilities.length = " + limited_possibilities.length);
	if (limited_possibilities.length >= 512)
	{
		//Ummm...
		var picked = undefined;
		var picked_score = 0;
		for (var i = 0; i < limited_possibilities.length; i++)
		{
			var code = limited_possibilities[i];
			var numbers_unique = 0;
			if (code[0] != code[1] && code[0] != code[2])
				numbers_unique++;
			if (code[1] != code[0] && code[1] != code[2])
				numbers_unique++;
			if (code[2] != code[1] && code[2] != code[0])
				numbers_unique++;
			var score = numbers_unique * 10000;
			//FIXME what else?
			if (picked == undefined || score > picked_score)
			{
				picked = code;
				picked_score = score;
			}
		}
		return picked;
	}
	
	//[0,1,2]
	//Solve the limited possibilities:
	//O(N^3) in javascript? ... ... Yes. Absolutely. We've got this.
	var best_guess = [];
	var best_guess_score = -1;
	var best_guess_total_score = -1;
	for (var i = 0; i < limited_possibilities.length; i++)
	{
		var guess = limited_possibilities[i];
		var guess_score = -1;
		//We're guessing with this.
		var total_score = 0;
		for (var j = 0; j < limited_possibilities.length; j++)
		{
			if (i == j) continue;
			var assumed_truth = limited_possibilities[j];
			
			var solid_count_guess_assumed = solidCountForCodes(guess, assumed_truth, 0);
			var blinking_count_guess_assumed = blinkingCountForCodes(guess, assumed_truth, 0);
			var eliminations = 0;
			//Assume code2 is the truth.
			//So, taking this guess and this assumed truth, how many possibilities do we knock out?
			for (var k = 0; k < limited_possibilities.length; k++)
			{
				if (i == k || j == k) continue;
				var possibility = limited_possibilities[k];
				var solid_count_assumed_possibility = solidCountForCodes(possibility, assumed_truth, 0);
				
				var passes = true;
				if (solid_count_assumed_possibility != solid_count_guess_assumed)
					passes = false;
				else
				{
					//How many blinking lights:
					var blinking_count_assumed_possibility = blinkingCountForCodes(possibility, assumed_truth, 0);
					if (blinking_count_guess_assumed != blinking_count_assumed_possibility)
						passes = false;
				}
				if (!passes)
				{
					eliminations++;
				}
			}
			if (guess_score == -1)
				guess_score = eliminations;
			else
				guess_score = Math.min(guess_score, eliminations);
			total_score += eliminations;
		}
		//console.log(guess + " - " + guess_score + ", " + total_score);
		if (best_guess_score < guess_score || best_guess_total_score < total_score)
		{
			console.log("Switching to " + guess + " from " + best_guess + " (" + best_guess_score + " vs " + guess_score + ")");
			best_guess_score = guess_score;
			best_guess_total_score = total_score;
			best_guess = guess.slice(0);
		}
	}
	console.log("best_guess_score = " + best_guess_score + ", best_guess = " + best_guess);
	
	return best_guess;
}

function findValidCombations(attempts)
{
	var result = [];
	var code = [0,0,0,0,0,0];
	//We can use a mastermind algorithm, because we only solve three positions at once, which is only 1.7 million iterations or so. Javascript can handle that, no problem. Absolutely.
	//So...
	//If we have the left side guessed, solve the right side. Otherwise, solve the left side.
	while (true)
	{
		//Assume this is the code.
		var passes_test = true;
		for (var attempt_index = 0; attempt_index < attempts.length; attempt_index++)
		{
			var attempt = attempts[attempt_index];
			var attempt_code = attempt[0];
			var side = attempt[1];
			var handle = attempt[2];
			var actual_solid_count = attempt[3];
			var actual_blinking_count = attempt[4];
			//Solid - correct in the right position.
			//Blinking - correct in the wrong position?
			
			var solid_count_should_be = 0;
			
			var code_starting_index = 0;
			var code_ending_index = 2;
			if (side == "R")
			{
				code_starting_index = 3;
				code_ending_index = 5;
			}
			var blinking_count_should_be = 0;
			if (true)
			{
				solid_count_should_be = solidCountForCodes(attempt_code, code, code_starting_index);
				blinking_count_should_be = blinkingCountForCodes(attempt_code, code, code_starting_index);
			}
			else
			{
				var blinking_map_assumed = {};
				var blinking_map_actual = {};
				for (var code_index = code_starting_index; code_index <= code_ending_index; code_index++)
				{
					//Are they identical?
					if (code[code_index] == attempt_code[code_index])
						solid_count_should_be++;
					else
					{
						//Blinking?
						//For instance, 4 5 6 versus true 6 5 4 would be 1 solid, 2 blinking.
						//Let's see... hash map of the unused?
						if (blinking_map_assumed[code[code_index]] == undefined)
							blinking_map_assumed[code[code_index]] = 1;
						else
							blinking_map_assumed[code[code_index]]++;
						if (blinking_map_actual[attempt_code[code_index]] == undefined)
							blinking_map_actual[attempt_code[code_index]] = 1;
						else
							blinking_map_actual[attempt_code[code_index]]++;
					}
				}
				for (var i = 0; i <= 10; i++)
				{
					if (blinking_map_assumed[i] == undefined || blinking_map_actual[i] == undefined)
					{
						continue;
					}
					blinking_count_should_be += Math.min(blinking_map_assumed[i], blinking_map_actual[i]);
				}
				var alternate = blinkingCountForCodes(attempt_code, code, code_starting_index);
				if (alternate != blinking_count_should_be)
				{	
					console.log("ERROR in " + alternate + " vs. " + blinking_count_should_be + ": attempt_code = " + attempt_code + ", code = " + code);
				}
			}
			//console.log("blinking_count_should_be = " + blinking_count_should_be + ", actual_blinking_count = " + actual_blinking_count + " on " + attempt_code);
			//Now, blinking... blinking... what's 000?
			
			//console.log("code = " + code + ", solid_count_should_be = " + solid_count_should_be + ", actual_solid_count = " + actual_solid_count + ", actual_blinking_count = " + actual_blinking_count + ", blinking_count_should_be = " + blinking_count_should_be);
			if (solid_count_should_be != actual_solid_count || actual_blinking_count != blinking_count_should_be)
			{
				passes_test = false;
				break;
			}
		}
		if (passes_test)
			result.push(code.slice(0));
		
		if (iterateCode(code))
			break;
		
	}
	var best_left = guessBestCombination(result, 0);
	var best_right = guessBestCombination(result, 3);
	
	return {possibilities:result, bestLeft:best_left, bestRight:best_right};
}

function generate()
{
	document.getElementById("output_div").innerHTML = "";
	var html = "";
	
	//solid count, blinking count
	/*var attempts = [];
	if (false)
	{
		attempts = [[[0,0,0,0,0,0], "L", "Down", 0, 0],
						[[0,0,0,0,0,0], "R", "Down", 0, 0],
						[[4,9,9,3,6,4], "L", "Down", 0, 0],
						[[1,1,1,0,0,0], "L", "Down", 0, 0],
						/*[[2,2,2,0,0,0], "L", "Down", 1, 0],
						[[2,3,3,0,0,0], "L", "Down", 0, 1],
						[[5,2,5,0,0,0], "L", "Down", 1, 0],
						[[6,2,6,0,0,0], "L", "Down", 1, 0],
						[[7,2,7,0,0,0], "L", "Down", 2, 0],
						[[7,2,8,0,0,0], "L", "Down", 2, 0],
						[[7,2,10,0,0,0], "L", "Down", 3, 0],
						[[7,2,10,1,1,1], "R", "Down", 0, 0],
						[[7,2,10,2,2,2], "R", "Down", 0, 0],
						[[7,2,10,8,6,7], "R", "Down", 0, 0],
						[[7,2,10,5,10,9], "R", "Down", 0, 1],
						[[7,2,10,4,3,10], "R", "Down", 1, 2],
						[[7,2,10,3,4,10], "R", "Down", 0, 3],
						];
	}	
	if (false)
	{
		attempts = [[[0,1,2,0,0,0], "L", "Down", 0, 0],
		[[0,0,0,0,0,0], "L", "Down", 0, 0],
		[[3,4,5,0,0,0], "L", "Down", 0, 2],
		[[5,5,6,0,0,0], "L", "Down", 0, 0],
		[[7,3,3,0,0,0], "L", "Down", 1, 0],
		[[4,8,3,0,0,0], "L", "Down", 2, 0],
		[[4,9,3,0,0,0], "L", "Down", 3, 0],
		[[4,9,3,0,1,2], "R", "Down", 0, 0],
		//[[4,9,3,0,0,0], "R", "Down", 0, 0],
		//[[4,9,3,3,4,5], "R", "Down", 0, 3]
		];
	}
	__saved_attempts = attempts;*/
	var attempts = __saved_attempts;
	var calculation_start = performance.now();
	var combination_results = findValidCombations(attempts);
	var calculation_end = performance.now();
	var calculation_time = calculation_end - calculation_start;
	var possible_combinations = combination_results.possibilities;
	
	__best_code_left = combination_results.bestLeft;
	__best_code_right = combination_results.bestRight;
	
	html += "Found " + possible_combinations.length + " combinations.";
	//if (possible_combinations.length < 10000)
		//html += possible_combinations.join("<br>");
	//else
		//html += possible_combinations[0];
	html += "<br>Best guess for left code: " + combination_results.bestLeft;
	html += "<br>Best guess for right code: " + combination_results.bestRight;
	
	html += "<br>Calculated in " + Math.round(calculation_time) + " ms.";
	document.getElementById("output_div").innerHTML = html;
	__combination_results = combination_results;
}

function generateLRStyle()
{
	var html = "";
	html += "width:30px;height:20px;display:inline-block;cursor:pointer;";
	if (__lr_state_is_left)
		html += "background:#000000;border-left:20px solid #777777;";
	else
		html += "background:#000000;border-right:20px solid #777777;";
	html += "margin-left:20px;margin-right:20px;";
	return html;
}

function generateTranslationHTMLForCode(c)
{
	var code_script_lookup = {0:"&#x0416;", 1:"&#x0424;", 2:"&#x043b;", 3:"&#x042d;", 4:"&#x0447;", 5:"&#x0414;", 6:"&#x0431;", 7:"&#x042f;", 8:"&#x0418;", 9:"&#x0429;", 10:"&#x042a;"}
	var html = "";
	
	html += "<span style=\"font-size:18px;\">" + code_script_lookup[c] + "</span>";
	var image = "images/char" + (c == 10 ? "a" : c) + "t.png";
	html += "<img src=\"" + image + "\">";
	return html;
}

function generateGuessBox(attempt, is_initial_input)
{
	/*
	0 - Ж
	1 - Ф
	2 - л
	3 - Э
	4 - ч
	5 - Д
	6 - б
	7 - Я
	8 - И
	9 - Щ
	a - Ъ
	*/
	var html = "";
	var attempt_code = attempt[0];
	var side = attempt[1];
	var handle = attempt[2];
	var actual_solid_count = attempt[3];
	var actual_blinking_count = attempt[4];
	
	var background_colour = "#DDDDDD";
	if (!is_initial_input)
		background_colour = "#AAAAAA";
	html += "<div style=\"background:" + background_colour + ";border-radius:20px;padding:10px;max-width:";
	if (is_initial_input)
		html += "500px;";
	else
		html += "310px;";
	html += "display:inline-block;margin:10px;";
	/*if (is_initial_input)
		html += "border:2px solid black;";
	else
		html += "border:2px solid grey;";*/
	html += "\" class=\"r_centre\">";
	
	html += "<div style=\"display:table;\">";
	html += "<div style=\"display:table-row;\">";
	html += "<div class=\"briefcase_cell\"";
	if (side == "R")
		html += " style=\"visibility:hidden;\"";
	if (is_initial_input)
		html += " id=\"input_left_cell\"";
	html += ">";
	for (var code_index = 0; code_index < attempt_code.length; code_index++)
	{
		if (code_index == 0)
			html += "Left:<br>";
		if (code_index == 3)
			html += "Right:<br>";
		/*if (code_index == 0)
		{
			html += "<div style=\"display:inline-block;\">";
		}*/
		//if (code_index == 0 && side == "L")
			//html += "<span style=\"font-size:2.0em\">L</span>";
		/*var should_display = false;
		if (code_index <= 2 && side == "L")
			should_display = true;
		if (code_index > 2 && side == "R")
			should_display = true;*/
		html += "<div style=\"width:22px;display:inline-block;text-align:center;";
		//if (!should_display)
			//html += "visibility:hidden;";
		html += "\">";
		if (true)
		{
			var c = attempt_code[code_index];
			if (is_initial_input)
				html += "<span id=\"input_character_sequence_" + code_index + "\">";
			
			html += generateTranslationHTMLForCode(c);
			if (is_initial_input)
				html += "</span>";
			html += "<br>"
			
			if (is_initial_input)
			{
				html += "<select id=\"number_input_" + code_index + "\" onchange=\"change();\">";
				for (var i = 0; i <= 10; i++)
				{
					var o = i;
					if (i == 10)
						o = "A";
					html += "<option value=\"" + i + "\"";
					if (i == c)
					{
						html += " selected=\"selected\"";
					}
					html += ">" + o + "</option>";
				}
				html += "</select>";
			}
			else
			{
				html += c;
			}
		}
		html += "</div>";
		if (code_index == 2)
		{
			html += "</div>";
			html += "<div class=\"briefcase_cell\">";
		}
		if (code_index == 2)
		{
			if (is_initial_input)
			{
				html += "<div style=\"" + generateLRStyle() + "\" id=\"left_right_selection_button\" onmouseup=\"LRSelectionButtonClicked();\"></div>";
			}
			else
			{
				html += "<div style=\"width:50px;display:inline-block;\">";
				html += "<div style=\"width:1px;height:50px;display:inline-block;background:black;\"></div>";
				html += "</div>";
			}
		}
		if (code_index == 2)
		{
			html += "</div>";
			html += "<div class=\"briefcase_cell\"";
			
			if (side == "L")
				html += " style=\"visibility:hidden;\"";
			if (is_initial_input)
				html += " id=\"input_right_cell\"";
			html += ">";
		}
	}
	html += "</div>";
	html += "<div class=\"briefcase_cell\">";
	if (false)
	{
		//There are three lights!
		var lights_output = 0;
		//html += "<div style=\"inline-block;background:white;width:20px;border-radius:10px;margin:5px;\">";
		html += "<div style=\"display:inline-block;background:white;width:40px;\">";
		for (var l = 0; l < actual_solid_count; l++)
		{
			html += "<img src=\"images/light_on.gif\">";
			lights_output++;
		}
		for (var l = 0; l < actual_blinking_count; l++)
		{
			html += "<img src=\"images/light_blinking.gif\">";
			lights_output++;
		}
		for (var l = lights_output; l < 3; l++)
		{
			html += "<img src=\"images/light_off.gif\">";
		}
		html += "</div>";
	

	}
	html += "<div style=\"width:20px;display:inline-block;\"></div>";
	html += "<div style=\"display:inline-block;\"># Solid<br>";
	if (is_initial_input)
	{
		html += "<select id=\"solid_number_input\" onchange=\"change();\">";
		for (var i = -1; i <= 3; i++)
		{
			html += "<option value=\"" + i + "\">" + (i == -1 ? " " : i) + "</option>";
		}
		html += "</select>";
	}
	else
		html += "<span style=\"font-size:2.0em;font-weight:bold;\">" + actual_solid_count + "</span>";
	html += "</div>";
	html += "<div style=\"width:10px;display:inline-block;\"></div>";
	html += "<div style=\"display:inline-block;\"># Blink<br>";
	if (is_initial_input)
	{
		html += "<select id=\"blinking_number_input\" onchange=\"change();\">";
		for (var i = -1; i <= 3; i++)
		{
			html += "<option value=\"" + i + "\">" + (i == -1 ? " " : i) + "</option>";
		}
		html += "</select>";
	}
	else
		html += "<span style=\"font-size:2.0em;font-weight:bold;\">" + actual_blinking_count + "</span>";
	html += "</div>";
	//html += attempt;
	html += "</div>";
	
	if (is_initial_input)
	{
		html += "<div class=\"briefcase_cell\">";
		html += "<div style=\"width:20px;display:inline-block;\"></div>";
		html += "<div style=\"display:inline-block;background:green;border-radius:25px;padding:5px;color:white;cursor:pointer;\" onmouseup=\"commitButtonClicked();\">";
		html += "Commit.";
		html += "</div>";
	}
	html += "</div>";
	html += "</div>";
	html += "</div>";
	return html;
}

function generateInitialLayout()
{
	var html = "";
	
	html += generateGuessBox([[0,1,2,0,1,2], "L", "Down", 0, 0], true);
	document.getElementById("output2_div").innerHTML = html;
}

function layout()
{
	if (__combination_results == undefined)
		generate();
		
		
	//Update numbers:
	//number_input_0 through 5
	for (var i = 0; i <= 5; i++)
	{
		var input_id = "number_input_" + i;
		var value = parseInt(document.getElementById(input_id).value);
		//Generate 
		document.getElementById("input_character_sequence_" + i).innerHTML = generateTranslationHTMLForCode(value);
	}
	
	var html = "";
	
	//Show previous guesses, and next entry:
	for (var i = 0; i < __saved_attempts.length; i++)
	{
		var attempt = __saved_attempts[i];
		html += generateGuessBox(attempt, false);
	}
	document.getElementById("output3_div").innerHTML = html;
}

function generate2()
{
	var html = "";
	//html += "first: " + blinkingCountForCodes([2,3,3], [7,2,10], 0) + "<br>";
	//html += "second: " + blinkingCountForCodes([1,2,2], [2,2,1], 0) + "<br>";
	//html += "third: " + blinkingCountForCodes([3,7,2], [7,2,3], 0) + "<br>";
	
	
	html += "fourth (2): " + blinkingCountForCodes([0,1,2], [1,0,0], 0) + "<br>";
	//html += "fifth (?): " + blinkingCountForCodes([1,0,0], [0,1,2], 0) + "<br>";
	
	
	document.getElementById("output_div").innerHTML = html;
}

function pageLoaded()
{
	generateRegularData();
	//generateTestData();
	generateInitialLayout();
	generate();
	layout();
	recalculateTabs();
}


//Events:



function change()
{
	layout();
}

function LRSelectionButtonClicked()
{
	__lr_state_is_left = !__lr_state_is_left;
	//FIXME do things
	if (__lr_state_is_left)
	{
		document.getElementById("left_right_selection_button").style.background = "#000000";
		document.getElementById("left_right_selection_button").style.borderLeft = "20px solid #777777";
		document.getElementById("left_right_selection_button").style.borderRight = "";
		//document.getElementById("left_right_selection_button").style.background = "#006600";
		//html += "background:#006600;border-left:20px solid #00CC00;";
	}
	else
	{
		document.getElementById("left_right_selection_button").style.background = "#000000";
		document.getElementById("left_right_selection_button").style.borderRight = "20px solid #777777";
		document.getElementById("left_right_selection_button").style.borderLeft = "";
		//html += "background:#660000;border-right:20px solid #CC0000;";
	}
	document.getElementById("left_right_selection_button").style = generateLRStyle();
	//FIXME hide the other side:
	if (__lr_state_is_left)
	{
		document.getElementById("input_left_cell").style.visibility = "visible";
		document.getElementById("input_right_cell").style.visibility = "hidden";
	}
	else
	{
		document.getElementById("input_left_cell").style.visibility = "hidden";
		document.getElementById("input_right_cell").style.visibility = "visible";
	}
	
}

function commitButtonClicked()
{
	//Read out state:
	var guess = [];
	var side = "L";
	var handle = "Down";
	if (!__lr_state_is_left)
		side = "R";
	var solid_count = parseInt(document.getElementById("solid_number_input").value);
	var blinking_count = parseInt(document.getElementById("blinking_number_input").value);
	for (var i = 0; i <= 5; i++)
	{
		var input_id = "number_input_" + i;
		var value = parseInt(document.getElementById(input_id).value);
		guess.push(value);
	}
	if (solid_count < 0 || blinking_count < 0 || solid_count + blinking_count > 3)
	{
		//no
		console.log("solid_count = " + solid_count + ", blinking_count = " + blinking_count);
		return;
	}
	//Reset the inputs:
	document.getElementById("solid_number_input").value = -1;
	document.getElementById("blinking_number_input").value = -1;
	//Add it to the list:
	//[[4,9,3,0,1,2], "R", "Down", 0, 0]
	__saved_attempts.push([guess, side, handle, solid_count, blinking_count]);
	console.log("__saved_attempts.length = " + __saved_attempts.length);
	//Calculate the next left/right:
	generate();
	//Set that to next:
	//__best_code_left
	for (var i = 0; i <= 2; i++)
	{
		var c = __best_code_left[i];
		if (c == undefined)
			c = 0;
		document.getElementById("number_input_" + i).value = c;
	}
	for (var i = 3; i <= 5; i++)
	{
		var c = __best_code_right[i - 3];
		if (c == undefined)
			c = 0;
		document.getElementById("number_input_" + i).value = c;
	}
	//Show them:
	layout();
}
