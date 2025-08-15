
var __button_functions = [-1, 1, -10, 10, -100, 100];

function convertFunctionalButtonToString(function_id)
{
	if (__button_functions[function_id] > 0)
		return "+" + __button_functions[function_id];
	else
		return __button_functions[function_id];
}

function convertTabConfigurationToString(tab_configuration)
{
	return tab_configuration.join("");
}

function convertStringToTabConfiguration(input)
{
	var tab_configuration = [];
	for (var c_i = 0; c_i < Math.min(6, input.length); c_i++)
		tab_configuration.push(parseInt(input[c_i]));
	return tab_configuration;
}

function generateAllTabPermutations(all_permutations, current_permutation)
{
	if (current_permutation.length >= 6) return;
	for (var i = 0; i < 6; i++)
	{
		var no = false;
		for (var j = 0; j < current_permutation.length; j++)
		{
			if (current_permutation[j] == i)
			{
				no = true;
				break;
			}
		}
		if (no) continue;
		
		var permutation = current_permutation.slice(0);
		permutation.push(i);
		if (permutation.length == 6)
			all_permutations.push(permutation);
		
		generateAllTabPermutations(all_permutations, permutation);
	}
}

function convertTabConfigurationToBase10(configuration, permutation)
{
	var base_ten = 0;
	for (var i = 0; i < configuration.length; i++)
	{
		var v = configuration[i];
		if (v < 0 || v > 2)
			return -1;
		var permutation_index = permutation[i];
		base_ten += v * Math.pow(3, 5 - permutation_index);
	}
	return base_ten;
}

function addNumberToTabConfiguration(configuration, amount, permutation, should_output)
{
	//var should_output = true;
	if (should_output)
		console.log("addNumberToTabConfiguration(" + configuration + ", " + amount + ", " + permutation + ")");
	//Convert base-three number into base-ten:
	var base_ten = convertTabConfigurationToBase10(configuration, permutation);
	if (should_output)
		console.log("base_ten = " + base_ten);
	//Add number:
	base_ten += amount;
	//Cap:
	if (base_ten < 0) base_ten = 0;
	if (base_ten > 728) base_ten = 728;
	//Convert back again:
	var next_configuration = [-1, -1, -1, -1, -1, -1];
	
	var permutation_inverse = [-1, -1, -1, -1, -1, -1];
	for (var i = 0; i < permutation.length; i++)
	{
		permutation_inverse[permutation[i]] = i;
	}
	for (var i = 0; i < configuration.length; i++)
	{
		var index_value = Math.pow(3, 5 - i);
		var v = Math.floor(base_ten / index_value);
		base_ten -= v * index_value;
		next_configuration[permutation_inverse[i]] = v;
	}
	if (should_output)
		console.log("next_configuration = " + next_configuration);
	
	return next_configuration;
}

function configurationsAreEqual(configuration_a, configuration_b)
{
	if (configuration_a.length != configuration_b.length) return false;
	for (var i = 0; i < configuration_a.length; i++)
	{
		if (configuration_a[i] != configuration_b[i]) return false;
	}
	return true;
}

function calculateStateTransitionInformation(all_permutations, button_actual_id, last_tab_configuration, current_tab_configuration, valid_possible_button_configurations)
{
	//This button is one of six, and the permutation is one of 720.
	//So, out of all of those, which could we possibly be?
	var stop = false;
	for (var button_function_id = 0; button_function_id < 6; button_function_id++)
	{
		var change_amount = __button_functions[button_function_id];
		
		for (var i = 0; i < all_permutations.length; i++)
		{
			//console.log(button_actual_id + ", " + button_function_id + ", " + i);
			if (valid_possible_button_configurations[button_actual_id] == undefined)
			{
				console.log(button_actual_id + ", " + button_function_id + ", " + i);
				console.log("NO");
			}
			if (!valid_possible_button_configurations[button_actual_id][button_function_id][i])
				continue;
			var permutation = all_permutations[i];
			//Apply button_function to last_tab_configuration. Do we get current_tab_configuration?
			var configuration = last_tab_configuration.slice(0);
			var next_configuration = addNumberToTabConfiguration(configuration, change_amount, permutation, false);
			
			if (configurationsAreEqual(current_tab_configuration, next_configuration))
			{
				//We could possibly be button_function_id, permutation.
			}
			else
			{
				//We aren't. Eliminate it.
				//console.log("! " + button_actual_id + ", " + button_function_id + ", " + i + " - " + next_configuration + ", " + current_tab_configuration);
				valid_possible_button_configurations[button_actual_id][button_function_id][i] = false;
			}
			if (false)
			{
				var configuration_test = addNumberToTabConfiguration(configuration, 0, permutation, false);
				if (!configurationsAreEqual(configuration_test, configuration))
				{
					console.log("ERROR: " + configuration_test + " is not " + configuration + " on permutation " + permutation);
					addNumberToTabConfiguration(configuration, 0, permutation, true);
					console.log("END ERROR");
					stop = true;
				}
			}
			if (stop)
				break;
		}
		if (stop)
			break;
	}
}


function recalculateTabs()
{
	var input = document.getElementById("tabs_input").value;
	var input_lines = input.split("\n");
	//console.log("input_lines = " + input_lines);
	
	var input_sequence = [];
	for (var i = 0; i < input_lines.length; i++)
	{
		var line = input_lines[i].split(" ");
		//Convert into useful:
		
		var button_id = -1;
		var tab_configuration = [];
		var lightrings_id = -1;
		
		//Parse button:
		if (line.length >= 2 && line[0].length != 6)
		{
			var v = parseInt(line[0].replace("B", "").replace(":", "")) - 1;
			if (v >= 0 && v < 6)
				button_id = v;
		}
		
		var configuration_id = 1;
		if (line.length == 1 || line[0].length == 6)
			configuration_id = 0;
		if (line[configuration_id].length == 6)
		{
			tab_configuration = convertStringToTabConfiguration(line[configuration_id]);
		}
		else if (line[configuration_id].toLowerCase().indexOf("nothing") !== -1 || line[configuration_id].toLowerCase().indexOf("none") !== -1)
			tab_configuration = [0,0,0,0,0,0];
		else
		{
			continue;
		}
		
		for (var j = 1; j < line.length; j++)
		{
			if (line[j].indexOf("lightrings") !== -1)
			{
				lightrings_id = line[j].replace("lightrings", "").replace(".gif", "");
			}
		}
		
		//console.log(button_id + ", " + tab_configuration + ", " + lightrings_id);
		//console.log(line);
		input_sequence.push([button_id, tab_configuration, lightrings_id]);
	}
	//console.log("input_sequence = " + input_sequence.join("|"));
	
	//Calculate all permutations:
	var all_permutations = [];
	generateAllTabPermutations(all_permutations, []);
	//console.log("all_permutations(" + all_permutations.length + ") = " + all_permutations.join(" | "));
	
	
	var valid_possible_button_configurations = [];
	for (var button_actual_id = 0; button_actual_id < 6; button_actual_id++)
	{
		var button_list = [];
		for (var button_functional_id = 0; button_functional_id < 6; button_functional_id++)
		{
			var button_2_list = [];
			for (var permutation_id = 0; permutation_id < all_permutations.length; permutation_id++)
			{
				button_2_list.push(true);
			}
			button_list.push(button_2_list);
		}
		valid_possible_button_configurations.push(button_list);
	}
	
	
	//Now, with the input sequence, calculate things:
	//Calculate what each button does:
	var last_state = [0, [0,0,0,0,0,0], -1]; //default state
	for (var sequence_index = 0; sequence_index < input_sequence.length; sequence_index++)
	{
		var state = input_sequence[sequence_index];
		var state_button_id = state[0];
		var state_tab_configuration = state[1];
		var last_state_tab_configuration = last_state[1];
		
		if (state_button_id >= 0)
		{
			//We have a button.
			//Let's find out what it does.
			//And also compute the permutation.
			calculateStateTransitionInformation(all_permutations, state_button_id, last_state_tab_configuration, state_tab_configuration, valid_possible_button_configurations);
		}
		
		last_state = state;
	}
	//********************************************************************************************
	//Now, learn from valid_possible_button_configurations:
	//Calculate valid_permutation_ids:
	var valid_permutation_ids = [];
	for (var permutation_id = 0; permutation_id < all_permutations.length; permutation_id++)
		valid_permutation_ids.push(true);
	//Calculate valid permutations:
	for (var permutation_id = 0; permutation_id < all_permutations.length; permutation_id++)
	{
		for (var button_actual_id = 0; button_actual_id < 6; button_actual_id++)
		{
			var has_valid_combination = false;
			for (var button_functional_id = 0; button_functional_id < 6; button_functional_id++)
			{
				if (valid_possible_button_configurations[button_actual_id][button_functional_id][permutation_id])
				{
					//console.log(permutation_id + ": " + button_actual_id + ", " + button_functional_id);
					has_valid_combination = true;
				}
				if (has_valid_combination)
					break;
			}
			if (!has_valid_combination)
			{
				//console.log(permutation_id + " invalidated by " + button_actual_id);
				valid_permutation_ids[permutation_id] = false;
				break;
			}
		}
	}
	var valid_permutations = [];
	for (var permutation_id = 0; permutation_id < all_permutations.length; permutation_id++)
	{
		if (valid_permutation_ids[permutation_id])
			valid_permutations.push(all_permutations[permutation_id]);
	}
	
	//console.log("valid_permutation_ids = " + valid_permutation_ids);
	//__button_functions
	var valid_button_functions = [];
	var button_fuctions_identified = [false, false, false, false, false, false];
	for (var button_actual_id = 0; button_actual_id < 6; button_actual_id++)
	{
		var functions = [];
		for (var button_functional_id = 0; button_functional_id < 6; button_functional_id++)
		{
			var possible = false;
			for (var permutation_id = 0; permutation_id < all_permutations.length; permutation_id++)
			{
				if (!valid_permutation_ids[permutation_id])
					continue;
				if (!valid_possible_button_configurations[button_actual_id][button_functional_id][permutation_id])
				{
					continue;
				}
				possible = true;
				//console.log(button_actual_id + ", " + button_functional_id + ", " + all_permutations[permutation_id] + " is valid");
			}
			if (possible)
			{
				functions.push(button_functional_id);
			}
		}
		valid_button_functions.push(functions);
		if (functions.length == 1)
			button_fuctions_identified[functions[0]] = true;
	}
	//Update valid_button_functions with button_fuctions_identified:
	for (var button_actual_id = 0; button_actual_id < 6; button_actual_id++)
	{
		if (valid_button_functions[button_actual_id].length == 1) continue;
		var new_list = [];
		for (var i = 0; i < valid_button_functions[button_actual_id].length; i++)
		{
			var v = valid_button_functions[button_actual_id][i];
			if (!button_fuctions_identified[v])
				new_list.push(v);
		}
		valid_button_functions[button_actual_id] = new_list;
	}
	
	
	//FIXME calculate possible lightrings range:
	var lightrings_seen_values = [];
	for (var lightrings_id = 0; lightrings_id <= 6; lightrings_id++)
		lightrings_seen_values.push([]);
	if (valid_permutations.length == 1)
	{
		for (var sequence_index = 0; sequence_index < input_sequence.length; sequence_index++)
		{
			var state = input_sequence[sequence_index];
			var state_tab_configuration = state[1];
			var lightrings_id = state[2];
			if (lightrings_id < 1) continue;
			
			var found = false;
			for (var i = 0; i < lightrings_seen_values[lightrings_id].length; i++)
			{
				if (configurationsAreEqual(lightrings_seen_values[lightrings_id][i], state_tab_configuration))
				{
					found = true;
					break;
				}
			}
			if (!found)
				lightrings_seen_values[lightrings_id].push(state_tab_configuration);
		}
	}
	var possible_lightrings_numbers = [];
	for (var i = 0; i < 729; i++)
	{
		possible_lightrings_numbers.push(true);
	}
	//Process lightrings:
	var possible_lightrings_answers_final = [];
	if (valid_permutations.length == 1)
	{
		var lightrings_range_modifications = 
		[[],
		[[-100, -76], [76, 100]],
		[[-75, -51], [51, 75]],
		[[-50, -26], [26, 50]],
		[[-25, -11], [11, 25]],
		[[-10, -6], [6, 10]],
		[[-5, 5]]];
		for (var lightrings_id = 1; lightrings_id <= 6; lightrings_id++)
		{
			for (var i = 0; i < lightrings_seen_values[lightrings_id].length; i++)
			{
				var tab_configuration = lightrings_seen_values[lightrings_id][i];
				var base_ten = convertTabConfigurationToBase10(tab_configuration, valid_permutations[0]);
				//The answer has to be in a specific range. Invalidate all numbers that aren't in that range.
				for (var answer = 0; answer < 729; answer++)
				{
					if (!possible_lightrings_numbers[answer]) continue;
					var is_valid = false;
					for (var range_id = 0; range_id < lightrings_range_modifications[lightrings_id].length; range_id++)
					{
						var range_relative = lightrings_range_modifications[lightrings_id][range_id];
						var range_absolute = [base_ten + range_relative[0], base_ten + range_relative[1]];
						if (answer >= range_absolute[0] && answer <= range_absolute[1])
							is_valid = true;
					}
					if (!is_valid)
						possible_lightrings_numbers[answer] = false;
				}
			}
		}
		for (var i = 0; i < 729; i++)
		{
			if (possible_lightrings_numbers[i])
				possible_lightrings_answers_final.push(i);
		}
		
	}
	
	
	//Output:
	var html = "";
	html += "Input sequence:<br>";
	for (var sequence_index = 0; sequence_index < input_sequence.length; sequence_index++)
	{
		var state = input_sequence[sequence_index];
		var state_button_id = state[0];
		var state_tab_configuration = state[1];
		var lightrings_id = state[2];
		if (sequence_index != 0)
			html += " &#9658; ";
		if (state_button_id >= 0)
			html += "<strong>B" + (state_button_id + 1) + ":</strong> ";
		html += convertTabConfigurationToString(state_tab_configuration);
		
		if (valid_permutations.length == 1)
			html += " (" + convertTabConfigurationToBase10(state_tab_configuration, valid_permutations[0]) + ")";
		if (lightrings_id > 0)
			html += " / lightrings" + lightrings_id + ".gif";
	}
	html += "<br><br>";
	
	//html += input_sequence.join(" -> ") + "<br>";
	html += valid_permutations.length + " valid permutation" + (valid_permutations.length > 1 ? "s" : "");
	if (valid_permutations.length < 20)
	{
		html += ":<div style=\"margin-left:20px;\">";
		for (var i = 0; i < valid_permutations.length; i++)
		{
			var permutation = valid_permutations[i];
			var display_array_notation = false;
			//if (i != 0)
				//html += ", ";
			html += "<div style=\"width:300px;display:inline-block;\">";
			if (display_array_notation)
				html += "[" + permutation + "]";
			
			var other_notation = [];
			for (var j = 0; j < permutation.length; j++)
			{
				other_notation.push(Math.pow(3, 5 - permutation[j]));
			}
			if (display_array_notation)
				html += " / ";
			html += "(" + other_notation.join(", ") + ")";
			html += "</div>";
			//html += "<br>";
		}
		html += "</div>";
	}
	//html += "<br>";
	
	for (var button_actual_id = 0; button_actual_id < 6; button_actual_id++)
	{
		html += "<br><strong>Button " + (button_actual_id + 1) + ":</strong> ";
		var functions = valid_button_functions[button_actual_id];
		if (functions.length == 1)
			html += convertFunctionalButtonToString(functions[0]);
		else
		{
			html += "[";
			for (var i = 0; i < functions.length; i++)
			{
				if (i == functions.length - 1)
					html += " or ";
				else if (i > 0)
					html += ", ";
				html += convertFunctionalButtonToString(functions[i]);
			}
			html += "]";
		}
	}
	
	html += "<br><br>";
	for (var lightrings_id = 1; lightrings_id < lightrings_seen_values.length; lightrings_id++)
	{
		var values = lightrings_seen_values[lightrings_id];
		if (values == undefined)
		{
			console.log("error on lightrings" + lightrings_id);
			continue;
		}
		if (values.length == 0) continue;
		html += "<strong>lightrings" + lightrings_id + ".gif:</strong> ";
		
		var converted_list = [];
		for (var i = 0; i < values.length; i++)
		{
			var tab_configuration = values[i];
			var base_ten = convertTabConfigurationToBase10(tab_configuration, valid_permutations[0]);
			converted_list.push(base_ten);
		}
		converted_list.sort();
		html += converted_list.join(", ");
		
		html += "<br>";
	}
	html += "<br>";
	if (possible_lightrings_answers_final.length == 0 || possible_lightrings_answers_final.length == 729)
	{
	}
	else if (possible_lightrings_answers_final.length == 1)
	{
		html += "Your lightrings target number is " + possible_lightrings_answers_final[0] + ".";
	}
	else
	{
		html += possible_lightrings_answers_final.length + " possible answer" + (possible_lightrings_answers_final.length > 1 ? "s" : "") + " for lightrings puzzle";
		if (possible_lightrings_answers_final.length <= 200)
			html += ": " + possible_lightrings_answers_final.join(", ");
		html += ".";
	}
	
	var conversion_html = "";
	if (valid_permutations.length == 1)
	{
		var input = document.getElementById("tabs_number_conversion_input").value;
		if (input.length == 6)
		{
			var tab_configuration = convertStringToTabConfiguration(input);
			var base_ten = convertTabConfigurationToBase10(tab_configuration, valid_permutations[0]);
			if (base_ten < 0)
				conversion_html = " is not a valid number.";
			else
				conversion_html = " is " + base_ten + " in base 10.";
		}
		document.getElementById("tab_converter_overall_div").style.visibility = "visible";
	}
	else
		document.getElementById("tab_converter_overall_div").style.visibility = "hidden";
	
	document.getElementById("tabs_conversion_output").innerHTML = conversion_html;
	document.getElementById("output_tabs_div").innerHTML = html;
}

function tabsTextInputKeyup()
{
	recalculateTabs();
}