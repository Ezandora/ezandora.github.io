
function calculatePossibleSolutions(words, solutions, solutions_assuming_any_order)
{
	//Find a word matching the first letter of each word.
	var initial_letters_to_match = [];
	for (var i = 0; i < 6; i++)
		initial_letters_to_match[i] = "";
	
	var letters_found = 0;
	for (var i = 0; i < words.length; i++)
	{
		var word = words[i];
		if (word == undefined || word == "")
			continue;
		initial_letters_to_match[i] = word[0].toLowerCase();
		letters_found++;
	}
	if (letters_found <= 0) //1 might be enough, for, like, X
		return;
	//Linear search because why not?
	
	var letter_combinations_sets_to_match = [];
	letter_combinations_sets_to_match.push(initial_letters_to_match);
	//Add all other shifts:
	if (letters_found > 1)
	{
		for (var shift = 1; shift < 6; shift++)
		{
			var combination = [];
			for (var i = 0; i < 6; i++)
			{
				var target_index = (i + shift) % 6;
				combination[i] = initial_letters_to_match[target_index];
			}
			letter_combinations_sets_to_match.push(combination);
		}
	}
	
	
	if (false)
	{
		//Output shifts:
		var output = "Shifts: ";
		for (var i = 0; i < letter_combinations_sets_to_match.length; i++)
		{
			var line = "";
			for (var j = 0; j < letter_combinations_sets_to_match[i].length; j++)
			{
				var c = letter_combinations_sets_to_match[i][j];
				if (c == "")
					line += "•";
				else
					line += c;
			}
			output += "/" + line;
		}
		console.log(output);
	}
	
	for (var i = 0; i < __six_letter_words.length; i++)
	{
		var trial_word = __six_letter_words[i];
		
		for (var j = 0; j < letter_combinations_sets_to_match.length; j++)
		{
			var combination = letter_combinations_sets_to_match[j];
			var matches = true;
			for (var k = 0; k < 6; k++)
			{
				var c1 = combination[k];
				if (c1 == "") continue;
				if (c1 != trial_word[k])
				{
					matches = false;
					break;
				}
			}
			
			if (matches)
			{
				if (j == 0)
					solutions.push(trial_word);
				else
					solutions_assuming_any_order.push(trial_word);
				break;
			}
		}
	}
}



var __textareas_on_page = 0;

function collectWordInputs()
{
	var words = [];
	for (var i = 0; i < __textareas_on_page; i++)
		words[i] = "";
		
	for (var i = 0; i < __textareas_on_page; i++)
	{
		var element = document.getElementById("word" + i);
		if (element == undefined)
			continue;
		var word = element.value;
		if (word != undefined && word != "")
			words[i] = word;
	}
	return words;
}

function currentlySelectedTextareaIndex()
{
	for (var i = 0; i < __textareas_on_page; i++)
	{
		var element = document.getElementById("word" + i);
		if (element == undefined)
			continue;
		if (element.matches(":focus"))
		{
			return i;
		}
	}
	return -1;
}

function tabToNextTextarea()
{
	var index = currentlySelectedTextareaIndex();
	//console.log("index = " + index);
	if (index >= 0)
	{
		if (index < __textareas_on_page - 1)
			index += 1;
		else
			index = 0;
		document.getElementById("word" + index).focus();
	}
}

function readjustTextareas(saved_words, desired_textarea_count)
{
	if (__textareas_on_page == desired_textarea_count)
		return;
	//var words_in_areas = collectWordInputs();
	//FIXME collect words_in_areas
	
	var element_to_focus_on = 0;//desired_textarea_count - 1;
	for (var i = 0; i < __textareas_on_page; i++)
	{
		var element = document.getElementById("word" + i);
		if (element == undefined)
			continue;
		if (element.matches(":focus"))
		{
			element_to_focus_on = i;
			break;
		}
	}
	
	var word_names = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh"];
	//Make HTML:
	var html = "";
	for (var i = 0; i < desired_textarea_count; i++)
	{
		var word_name = word_names[i] + " word";
		if (word_name == undefined)
			word_name = "Word";
		var saved_word_value = saved_words[i];
		if (saved_word_value == undefined)
			saved_word_value = "";
		html += "<textarea placeholder=\"" + word_name + "\" rows=\"1\" cols=\"11\" id=\"word" + i + "\" onkeydown=\"if(event.keyCode == 13) { tabToNextTextarea(); return false; }\" onkeyup=\"solveLOV();\">" + saved_word_value + "</textarea><br>";
	}
	
	//Write out:
	document.getElementById("word_entry_holder").innerHTML = html;
	__textareas_on_page = desired_textarea_count;
	
	document.getElementById("word" + element_to_focus_on).focus();
	
}

var __loaded_inputs = false;
function saveInputs()
{
	if (!__loaded_inputs)
		return;
	var words = collectWordInputs();
	try
	{
		if (typeof localStorage !== "undefined")
		{
			localStorage.setItem("lov_puzzle_saved_inputs", JSON.stringify(words));
			//console.log("saved = \"" + localStorage.getItem("lov_puzzle_saved_inputs") + "\"");
		}
	}
	catch (exception)
	{
	}
}

function loadInputs()
{
	__loaded_inputs = true;
	var words = [];
	try
	{
		if (typeof localStorage !== "undefined")
		{
			//retrieve from cache:
			var words_saved = localStorage.getItem("lov_puzzle_saved_inputs");
			//console.log("loaded = \"" + words_saved + "\"");
			if (words_saved != undefined)
			{
				var words_parsed = JSON.parse(words_saved);
				if (words_parsed != undefined)
					words = words_parsed;
			}
		}
	}
	catch (exception)
	{
	}
	for (var i = 0; i < Math.min(6, words.length); i++)
	{
		document.getElementById("word" + i).value = words[i];
	}
}

function solveLOV()
{
	saveInputs();
	var words = collectWordInputs();
	//readjustTextareas(words, words.length + 1);
	var html = "";
	
	
	var solutions = [];
	var solutions_assuming_any_order = [];
	calculatePossibleSolutions(words, solutions, solutions_assuming_any_order);
	
	if (solutions.length > 0)
	{
		html += "<strong>Possible solutions:</strong><br>";
		for (var i = 0; i < solutions.length; i++)
		{
			html += solutions[i] + "<br>";
		}
	}
	if (solutions_assuming_any_order.length > 0)
	{
		if (solutions.length > 0)
			html += "<br>";
		html += "<strong>Possible solutions assuming unknown starting word:</strong><br>";
		for (var i = 0; i < solutions_assuming_any_order.length; i++)
		{
			html += solutions_assuming_any_order[i] + "<br>";
		}
	}
	document.getElementById("results_holder").innerHTML = html;
}

function pageLoaded()
{
	readjustTextareas([], 6);
	loadInputs();
}
