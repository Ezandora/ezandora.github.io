

function calculateSkillListToIgnore()
{
	var skills_ignore_textarea = document.getElementById("ignore_skills_textarea").value;
	if (skills_ignore_textarea == undefined)
		skills_ignore_textarea = "";
	skills_ignore_textarea = skills_ignore_textarea.toLowerCase();
	
	var skills_to_ignore_list = skills_ignore_textarea.split("\n");
	for (var i = 0; i < skills_to_ignore_list; i++)
	{
		skills_to_ignore_list[i] = skills_to_ignore_list.trim();
	}
	
	return skills_to_ignore_list;
}


function shouldIgnoreSkill(skill_id, skills_to_ignore_list)
{
	if (skill_id < 0) return false;
	var skill_lowercase_name = __skill_ids_to_names[skill_id].toLowerCase();
	for (var j = 0; j < skills_to_ignore_list.length; j++)
	{
		if (skills_to_ignore_list[j] == skill_lowercase_name)
		{
			return true;
		}
	}
	return false;
}

function skillIDForItem(item_id, desc_id)
{
	//if (item_id >= 9347 && item_id <= 9400)
	//Operating assumption:
	//All robortender items are normal, except for six items that give the combat skills.
	//We've tested against 32% of all items, that's like spading them all, right?
	if (item_id == 9353)
		return 23302;
	else if (item_id == 9349)
		return 23304;
	else if (item_id == 9357)
		return 23301;
	else if (item_id == 9359)
		return 23306;
	else if (item_id == 9361)
		return 23305;
	else if (item_id == 9354)
		return 23303;
	
	return desc_id % 125 + 23001;
}

var __cell_html;
var __is_row_active;
var __all_rows_active = false;
var __maximum_cell_id = -1;
var __maximum_row_id = -1;
function writePageLayout()
{
	__cell_html = [];
	__is_row_active = [];
	//__skill_ids_to_names
	//__skill_ids_to_descriptions
	//__item_ids_to_names
	//__item_ids_to_desc_ids
	var skills_to_ignore_list = calculateSkillListToIgnore();
	
	var output = "";
	
    var cells_since_last_row = 0;
    var row_id = 0;
    var cell_id = 0;
    
    
    //All button:
	output += "<div class=\"gelatinous_table r_centre\" style=\"text-align:center;\">";
	output += "<div class=\"gelatinous_table_row\">";
	output += "<div style=\"display:table-cell;padding:5px;cursor:pointer;\" onclick=\"resetAllRows(event);\" id=\"expand_all\"><strong>Expand All</strong></div>";
	output += "</div>";
	output += "</div>";
	output += "<div class=\"gelatinous_table r_centre\">";
	
	var last_skill_set = -1;
	for (var index = 0; index < __evaluation_order.length; index++)
	{
	/*for (var skill_id in __skill_ids_to_descriptions)
	{
		if (!__skill_ids_to_descriptions.hasOwnProperty(skill_id))
			continue;*/
			
	    
		var skill_id = __evaluation_order[index];
	    
	    if (shouldIgnoreSkill(skill_id, skills_to_ignore_list))
	    	continue;
		//Calculate every relevant item:
		var relevant_item_ids = [];
		
		var skill_set = Math.floor((skill_id - 1) / 5);
		//Special groups:
		if (skill_id >= 23301 && skill_id <= 23303)
			skill_set = -2;
		else if (skill_id >= 23304 && skill_id <= 23306)
			skill_set = -3;
		if (last_skill_set == -1)
			last_skill_set = skill_set;
	    if (skill_set != last_skill_set) //% 5 == 0)
	    {
	    	last_skill_set = skill_set;
	    	//Reset:
			for (var cell_id_2 = cells_since_last_row; cell_id_2 < 3; cell_id_2++)
			{
				output += "<div style=\"display:table-cell;\" onclick=\"gelatinousRowClicked(event, " + row_id + ");\" style=\"cursor:pointer;\"></div>";
				cell_id += 1;
			}
			output += "</div>";
			output += "</div>";
			output += "<hr>";
			output += "<div class=\"gelatinous_table r_centre\">";
			
			cells_since_last_row = 0;
	    }
		for (var item_id in __item_ids_to_desc_ids)
		{
			if (!__item_ids_to_desc_ids.hasOwnProperty(item_id))
				continue;
			desc_id = __item_ids_to_desc_ids[item_id];
			if (skillIDForItem(item_id, desc_id) != skill_id)
				continue;
			relevant_item_ids.push(item_id);
		}
		
	    if (cells_since_last_row >= 3 || cells_since_last_row == 0)
	    {
			row_id += 1;
	    	if (cells_since_last_row > 0)
				output += "</div>";
				
			output += "<div class=\"gelatinous_table_row\">";
			__is_row_active[row_id] = false;
	    	cells_since_last_row = 0;
	    }
		output += "<div style=\"display:table-cell;width:33%;padding:5px;\" id=\"left_" + cell_id + "\">";
		//output += "<span style=\"font-size:1.04em;\">";
		output += "<div onclick=\"gelatinousRowClicked(event, " + row_id + ");\" style=\"cursor:pointer;\">";
		output += "<strong>" + __skill_ids_to_descriptions[skill_id] + "</strong><br>" + __skill_ids_to_names[skill_id] + "</div>";
		
		relevant_item_ids.sort(function(a, b) { if (__item_ids_are_blocked[a] && !__item_ids_are_blocked[b]) return 1; if (!__item_ids_are_blocked[a] && __item_ids_are_blocked[b]) return -1; return 0;  });
		var cell_data = "";
		for (var i = 0; i < relevant_item_ids.length; i++)
		{
			var item_id = relevant_item_ids[i];
			var span_style = "";
			if (__item_ids_are_blocked[item_id])
				span_style += "text-decoration:line-through;";
			if (__item_ids_are_probably_npc_items[item_id])
				span_style += "font-weight:bold;";
			if (span_style != "")
				cell_data += "<span style=\"" + span_style + "\">";
			
			//links here don't work, because table-cell is overriding it? don't know how to fix this
			var guessed_url = "";
			//guessed_url = "http://kol.coldfront.net/thekolwiki/index.php/" + __item_ids_to_names[item_id].replace(/ /g, "_");
			cell_data += "&bull; ";
			if (guessed_url != "")
				cell_data += "<a href=\"" + guessed_url + "\" style=\"text-decoration:none;\">";
			cell_data += __item_ids_to_names[item_id];
			if (guessed_url != "")
				cell_data += "</a>";
			var custom_description = __item_ids_to_custom_description[item_id];
			if (custom_description !== undefined)
				cell_data += " (" + custom_description + ")";
			if (span_style != "")
				cell_data += "</span>";
			cell_data += "<br>";
		}
		__cell_html[cell_id] = cell_data;
	    output += "<div class=\"gelatinous_component_container\"></div>";
		//output += "<span style=\"color:#555555\">" + cell_data + "</span>";
		output += "</div>";
	    cells_since_last_row += 1;
	    cell_id += 1;
	}
	__maximum_cell_id = cell_id - 1;
	__maximum_row_id = row_id;
    //Fill in the blanks:
    for (var cell_id = cells_since_last_row; cell_id < 3; cell_id++)
    {
    	output += "<div style=\"display:table-cell;\" onclick=\"gelatinousRowClicked(event, " + row_id + "); style=\"cursor:pointer;\"\"></div>";
    }
	
    output += "</div>";
    output += "</div>";
	
	document.getElementById("results_holder").innerHTML = output;
}

function writeDropdown()
{
	var output = "<option value=\"-1\"></option>";
	
	
	var items_output = [];
	for (var item_id in __item_ids_to_desc_ids)
	{
		if (!__item_ids_to_desc_ids.hasOwnProperty(item_id))
			continue;
		items_output.push(item_id);
	}
	items_output.sort(function(a, b) { return __item_ids_to_names[a].localeCompare(__item_ids_to_names[b]); });
	
	for (var i = 0; i < items_output.length; i++)
	{
		var item_id = items_output[i];
		var item_name = __item_ids_to_names[item_id];
		output += "<option value=\"" + item_id + "\">" + item_name + "</option>";
		
	}
	
	document.getElementById("all_items_dropdown").innerHTML = output;
}

function updateCell(cell_id, active)
{
	var cell_html = __cell_html[cell_id];
	if (!active)
		cell_html = "";
	var element_1 = document.getElementById("left_" + cell_id);
	if (element_1 == undefined)
		return;
	element_1.getElementsByClassName("gelatinous_component_container")[0].innerHTML = cell_html;
}

function gelatinousRowClicked(event, row_id)
{
	var row = event.target;
	var active = !__is_row_active[row_id];
	__is_row_active[row_id] = active;
	for (var cell_id = (row_id - 1) * 3; cell_id < (row_id - 1) * 3 + 3; cell_id++)
	{
		updateCell(cell_id, active);
	}
}

function resetAllRows(event)
{
	__all_rows_active = !__all_rows_active;
	if (!__all_rows_active)
		document.getElementById("expand_all").innerHTML = "<strong>Expand All</strong>";
	else
		document.getElementById("expand_all").innerHTML = "<strong>Collapse All</strong>";
	
	for (var row_id = 0; row_id <= __maximum_row_id; row_id++)
	{
		__is_row_active[row_id] = __all_rows_active;
	}
	for (var cell_id = 0; cell_id <= __maximum_cell_id; cell_id++)
	{
		updateCell(cell_id, __all_rows_active);
	}
}

function dropdownSelectionChanged()
{
	var item_id = document.getElementById("all_items_dropdown").value;
	
	var output = "";
	
	var desc_id = __item_ids_to_desc_ids[item_id];
	if (desc_id !== undefined)
	{
		var skill_id = skillIDForItem(item_id, desc_id);
		
		var skill_name = __skill_ids_to_names[skill_id];
		var skill_description = __skill_ids_to_descriptions[skill_id];
		
		if (skill_name === undefined)
			skill_name = "unknown skill";
		if (skill_description === undefined)
			skill_description = "";
			
		var already_have = false;
		if (shouldIgnoreSkill(skill_id, calculateSkillListToIgnore()))
			already_have = true;
		if (already_have)
			output += "<span style=\"color:red;\">";
		output += " gives <strong>" + skill_description + "</strong> (" + skill_name + "";
		if (already_have)
			output += ", already have)</span>";
		else
			output += ")";
		//__skill_ids_to_names
		//__skill_ids_to_descriptions
	}
	
	
	document.getElementById("dropdown_output").innerHTML = output;
}

function pageLoaded()
{
	writePageLayout();
	writeDropdown();
}