var __setting_output_one_day_early_plans = true;
var __setting_output_two_day_early_plans = true;

function listJoinComponents(list, joining_string, and_string)
{
	var result = "";
	var first = true;
	var number_seen = 0;
	for (var i = 0; i < list.length; i++)
	{
		var value = list[i];
		if (first)
		{
			result += value;
			first = false;
		}
		else
		{
			if (!(list.length == 2 && and_string != ""))
				result += joining_string;
			if (and_string != "" && number_seen == list.length - 1)
			{
				result += " ";
				result += and_string;
				result += " ";
			}
			result += value;
		}
		number_seen = number_seen + 1;
	}
	return result;
}

function twoSimpleArraysAreEqual(a, b)
{
	//this is a nightmare if they aren't a simple list
	if (a.length != b.length) return false;
	for (var i = 0; i < a.length; i++)
	{
		if (a[i] !== b[i]) return false;
	}
	return true;
}

var __onpage_classes = [];
function writeInputs()
{
	var fields_to_monitor = ["path_selection", "class_selection"];
	var checkboxes_to_monitor = [];
	
	
	var previous_values = {};
	var previous_checkbox_values = {};
	for (var i = 0; i < fields_to_monitor.length; i++)
	{
		var field_name = fields_to_monitor[i];
		var element = document.getElementById(field_name);
		if (element != undefined)
			previous_values[field_name] = element.value;
		else
		{
			//Set a default value:
			var default_value = -1;
			if (field_name == "daycount_input" || field_name == "cornucopias_used_input")
				default_value = "";
			else if (field_name == "path_selection")
				default_value = 22; //everybody ascends standard, right?
			else if (field_name == "cornucopia_selection")
				default_value = 0;
			else if (field_name == "run_length_selection")
				default_value = 3;
			previous_values[field_name] = default_value;
		}
	}
	for (var i = 0; i < checkboxes_to_monitor.length; i++)
	{
		var field_name = checkboxes_to_monitor[i];
		var element = document.getElementById(field_name);
		if (element != undefined)
			previous_checkbox_values[field_name] = element.checked;
		else
			previous_checkbox_values[field_name] = true;
	}
	var focused_element_id = "";
	if (document.activeElement != undefined)
		focused_element_id = document.activeElement.id;
	//Path, class.
	//Then day, cornucopia number for seed.
	var output = "";
	var output2 = "";
	output += "<div style=\"display:table;\">";
	output += "<div style=\"display:table-row;\">";
	output += "<div class=\"input_table_cell align_right\">Path:</div>";
	output += "<div class=\"input_table_cell\"><select id=\"path_selection\" onchange=\"inputChanged();\">";
	output += "<option value=-1> </option>";
	for (var path_id in __paths)
	{
		if (!__paths.hasOwnProperty(path_id)) continue;
		var path_name = __paths[path_id];
		output += "<option value=" + path_id + ">";
		output += path_name;
		output += "</option>";
	}
	output += "</select></div>";
	
	var classes = __classes_for_path[previous_values["path_selection"]];
	if (classes == undefined)
	{
		classes = [1,2,3,4,5,6];
	}
	
	if (twoSimpleArraysAreEqual(classes, __onpage_classes))
	{
		return;
	}
	__onpage_classes = classes.slice(0);
	
	/*output += "<div class=\"input_table_cell align_right\">Class:</div>";
	output += "<div class=\"input_table_cell\"><select id=\"class_selection\" onchange=\"inputChanged();\">";
	if (classes.length > 1)
		output += "<option value=-1> </option>";
	else
	{
		previous_values["class_selection"] = classes[0];
	}
	for (var i = 0; i < classes.length; i++)
	{
		var class_id = classes[i];
		output += "<option value=" + class_id + ">";
		output += __classes[class_id];
		output += "</option>";
	}
	output += "</select></div>";*/
	
	
	if (true)
	{
		output += "</div>"; //row
		//output += "</div>"; //table
		//output += "<div style=\"display:table;\">";
		output += "<div style=\"display:table-row;\">";
		output += "<div class=\"input_table_cell align_right\">Class:</div>";

		output += "<div class=\"input_table_cell\"><select id=\"class_selection\" onchange=\"inputChanged();\">";
		if (classes.length > 1)
			output += "<option value=-1> </option>";
		else
		{
			previous_values["class_selection"] = classes[0];
		}
		for (var i = 0; i < classes.length; i++)
		{
			var class_id = classes[i];
			output += "<option value=" + class_id + ">";
			output += __classes[class_id];
			output += "</option>";
		}
		output += "</select></div>";
	}
	
	output += "</div>";
	output += "</div>";
	
	if (false)
	{
		output2 += "<hr>";
		output2 += "<div style=\"display:table;\">";
		output2 += "<div style=\"display:table-row;\">";
		output2 += "<div class=\"input_table_cell align_right\">Day:</div>";
		output2 += "<div class=\"input_table_cell\"><textarea style=\"overflow:hidden;\" maxlength=3 rows=1 cols=3 id=\"daycount_input\" onfocus=\"this.select();\" onkeyup=\"inputChanged();\"></textarea></div>";
	
		output2 += "<div class=\"input_table_cell align_right\">Cornucopias used previously:</div>";
		output2 += "<div class=\"input_table_cell\"><textarea style=\"overflow:hidden;\" maxlength=3 rows=1 cols=3 id=\"cornucopias_used_input\" onfocus=\"this.select();\" onkeyup=\"inputChanged();\"></textarea></div>";
	}	
	
	document.getElementById("input_div").innerHTML = output;
	document.getElementById("input_2_div").innerHTML = output2;
	
	for (var i = 0; i < fields_to_monitor.length; i++)
	{
		var element = document.getElementById(fields_to_monitor[i]);
		if (element != undefined)
			element.value = previous_values[fields_to_monitor[i]];
	}
	for (var i = 0; i < checkboxes_to_monitor.length; i++)
	{
		var field_name = checkboxes_to_monitor[i];
		var element = document.getElementById(field_name);
		if (element != undefined)
			element.checked = previous_checkbox_values[field_name];
	}
	if (focused_element_id != "")
	{
		document.getElementById(focused_element_id).focus();
	}
}


function elementGetGlobalOffsetTop(element)
{
    if (element == undefined)
        return 0.0;
    //Recurse upward:
    var offset = 0.0;
    var breakout = 100; //prevent loops, if somehow that happened
    while (breakout > 0 && element != undefined)
    {
        offset += element.offsetTop;
        element = element.parentElement;
        breakout--;
    }
    return offset;
}

var __scroll_positions_for_days = {};
function recalculateScrolling()
{
	var fixed_position_offset = document.getElementById("fixed_div").offsetTop;
	__scroll_positions_for_days = {};
	for (var day = 2; day < 5; day++)
	{
		var element_name = "header_day_" + day;
		var element = document.getElementById(element_name);
		if (element === undefined || element === null)
			continue;
		var offset = element.offsetTop - fixed_position_offset; //elementGetGlobalOffsetTop(element);
		__scroll_positions_for_days[day] = offset;
		//console.log("offset = " + offset);
	}
}
function setupScrolling()
{
	recalculateScrolling();
	window.onscroll = function (event) { pageScroll(); };
}

var __element_visible = false;
var __last_day_shown = -1;
function pageScroll()
{
    var scroll_position = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
    
    var max_day = -1;
	for (var day = 2; day < 5; day++)
	{
		if (scroll_position > __scroll_positions_for_days[day])
		{
			max_day = day;
		}
		else
			break;
	}
	var desired_visibility = false;
	if (max_day == -1)
	{
		desired_visibility = false;
	}
	else
	{
		desired_visibility = true;
	}
	if (__last_day_shown != max_day && max_day != -1)
	{
		__last_day_shown = max_day;
		document.getElementById("fixed_div").innerHTML = document.getElementById("header_day_" + max_day).innerHTML;
	}
	if (__element_visible != desired_visibility)
	{
		__element_visible = desired_visibility;
		if (__element_visible)
		{
			document.getElementById("fixed_div").style.visibility = "visible";
		}
		else
		{
			document.getElementById("fixed_div").style.visibility = "hidden";
			__last_day_shown = -1;
		}
	}
}


function outputRunData(path_id, class_id_in)
{
	var html = "";
	
	var evalulating_classes = [class_id_in];
	if (class_id_in <= 0)
	{
		evalulating_classes = [];
		if (__classes_for_path[path_id] != undefined)
		{
			for (var i = 0; i < __classes_for_path[path_id].length; i++)
			{
				evalulating_classes.push(__classes_for_path[path_id][i]);
			}
		}
		else
		{
			evalulating_classes = [1,2,3,4,5,6];
		}
	}
	
	for (var i = 0; i < evalulating_classes.length; i++)
	{
		var class_id = evalulating_classes[i];
		var day_count_limit = 11;
		if (i > 0)
			html += "<hr>";
		html += "<H1>" + __classes[class_id] + "</H1>";
		if (evalulating_classes.length > 1)
		{
			day_count_limit = 2;
		}
		for (var day_count = 1; day_count <= day_count_limit; day_count++)
		{
			if (day_count > 1)
				html += "<br>";
			html += "<div style=\"font-size:1.5em;font-weight:bold;\">Day " + day_count + "</div>";
		
			for (var j = 0; j < __dailies_generation_functions.length; j++)
			{
				var result = __dailies_generation_functions[j](path_id, class_id, day_count);
				if (result.length == 2 && result[1].length > 0)
				{
					var identifier = result[0];
					var output = result[1];
					html += "<div style=\"margin-left:20px;\">";
					html += "<span style=\"font-weight:bold;font-size:1.2em;\">" + identifier + ":</span> " + output;
					html += "</div>";
				}
			}
		}
	}
	document.getElementById("output_div").innerHTML = html;
}


function updateOutput()
{
	var path_id = document.getElementById("path_selection").value;
	var class_id = document.getElementById("class_selection").value;
	if (path_id !== undefined && path_id !== "")
		path_id = parseInt(path_id);
	if (class_id !== undefined && class_id !== "")
		class_id = parseInt(class_id);
		
	
	document.getElementById("output_2_div").innerHTML = "";
	if (path_id != -1)
	{
		outputRunData(path_id, class_id);
	}
	else
	{
		document.getElementById("output_div").innerHTML = "";
		document.getElementById("output_2_div").innerHTML = "";
	}
	recalculateScrolling();
}

function inputChanged()
{
	writeInputs();
	updateOutput();
}

function pageLoaded()
{
	writeInputs();
	updateOutput();
	//Doesn't look good, doesn't help much:
	//setupScrolling();
}