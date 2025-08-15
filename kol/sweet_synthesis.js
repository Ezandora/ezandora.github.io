var __names_to_item_ids = {};
var __item_ids_to_candy_type = {};

function recalculateDatafiles()
{
	for (var item_id in __item_ids_to_names)
	{
		if (!__item_ids_to_names.hasOwnProperty(item_id))
			continue;
		var name = __item_ids_to_names[item_id];
		__names_to_item_ids[name] = item_id;
	}
	
	for (var i = 0; i < __complex_candy.length; i++)
	{
		var item_id = __complex_candy[i];
		__item_ids_to_candy_type[item_id] = "complex";
	}
	for (var i = 0; i < __simple_candy.length; i++)
	{
		var item_id = __simple_candy[i];
		__item_ids_to_candy_type[item_id] = "simple";
	}
}

function lookupItemName(item_id)
{
	if (__item_ids_to_names.hasOwnProperty(item_id))
		return __item_ids_to_names[item_id];
	else
		return "item #" + item_id;
}

function mallPriceOfItem(item_id)
{
	if (!__item_ids_to_mall_price.hasOwnProperty(item_id))
		return 999999999;
	return __item_ids_to_mall_price[item_id];
}

var __cell_data;
var __is_row_active;
function recalculateForEffect(buff_name, tier, subid)
{
	__cell_data = [];
	__is_row_active = [];
	var output = "";
	
    var list_1;
    var list_2;
    if (tier == 1)
    {
    	list_1 = __simple_candy;
    	list_2 = __simple_candy;
    }
    else if (tier == 2)
    {
    	list_1 = __simple_candy;
    	list_2 = __complex_candy;
    }
    else if (tier == 3)
    {
    	list_1 = __complex_candy;
    	list_2 = __complex_candy;
    }
    
    output += "<hr>";
    output += "<div class=\"r_centre\" style=\"font-size:1.2em;font-weight:bold\">" + buff_name + "</div>";
    output += "<div class=\"r_centre\">Select candy combination:</div>";
    output += "<div style=\"display:table;text-align:left;width:700px;\" class=\"r_centre\">";
    
    
    var cells_since_last_row = 0;
    var row_id = 0;
    var cell_id = 0;
    for (var i = 0; i < list_1.length; i++)
    {
	    if (cells_since_last_row >= 3 || cells_since_last_row == 0)
	    {
			row_id += 1;
	    	if (cells_since_last_row > 0)
				output += "</div>";
				
			output += "<div class=\"synthesis_table_row\" data-active=\"false\">";
			__is_row_active[row_id] = false;
	    	cells_since_last_row = 0;
	    }
	    
	    
        var item_id_1 = list_1[i];
        
        var compatible_items = [];
        for (var j = 0; j < list_2.length; j++)
        {
	        var item_id_2 = list_2[j];
        	if ((item_id_1 + item_id_2) % 5 != (subid - 1))
        		continue;
        	
        	compatible_items.push(item_id_2);
        	
        }
        if (compatible_items.length == 0)
        	continue;
        	
	    __cell_data[cell_id] = compatible_items;
        output += "<span class=\"synthesis_button_left\" id=\"left_" + cell_id + "\" onclick=\"synthesisRowClicked(event, " + row_id + ");\">";
        
	    output += "<span class=\"synthesis_component_header\">" + lookupItemName(item_id_1) + "</span>";
	    
	    output += "<div class=\"synthesis_component_container\"></div>";
	    output += "</span>";
	    cells_since_last_row += 1;
	    cell_id += 1;
    }
    //Fill in the blanks:
    for (var cell_id = cells_since_last_row; cell_id < 3; cell_id++)
    {
    	output += "<div style=\"display:table-cell;\" onclick=\"synthesisRowClicked(event, " + row_id + ");\"></div>";
    }
    output += "</div>";
    output += "</div>";
    
	document.getElementById("synthesis_output").innerHTML = output;
}

function synthesisButtonClicked(event, tier, subid)
{
	var buff_name = event.target.innerHTML; //Hack? Hack.
	recalculateForEffect(buff_name, tier, subid);
	for (var tier = 1; tier <= 3; tier++)
	{
		for (var subid = 1; subid <= 5; subid++)
		{
			document.getElementById("button_tier" + tier + "_" + subid).className = "synthesis_button";
		}
	}
	event.target.className = "synthesis_button_clicked";
}

function synthesisRowClicked(event, row_id)
{
	var row = event.target;
	var active = !__is_row_active[row_id];
	__is_row_active[row_id] = active;
	//var active = !(row.getAttribute("data-active") === "true");
	//row.setAttribute("data-active", active);
	
	for (var cell_id = (row_id - 1) * 3; cell_id < (row_id - 1) * 3 + 3; cell_id++)
	{
		var secondary_items_list = __cell_data[cell_id];
		var new_html = "";
		
		if (active)
		{
			for (var i = 0; i < secondary_items_list.length; i++)
			{
				var item_id_2 = secondary_items_list[i];
				if (i != 0)
					new_html += "<br>";
				new_html += "+ " + lookupItemName(item_id_2);
			}
		
		}
		document.getElementById("left_" + cell_id).getElementsByClassName("synthesis_component_container")[0].innerHTML = new_html;
	}
}

function calculateUnknownCandy()
{	
	var unknown_candy = [];
	
	for (var item_id in __item_ids_to_names)
	{
		if (!__item_ids_to_names.hasOwnProperty(item_id))
			continue;
		var has_match = false;
		for (var i = 0; i < __complex_candy.length; i++)
		{
			var item_id_2 = __complex_candy[i];
			if (item_id_2 == item_id)
			{
				has_match = true;
				break;
			}
		}
		if (!has_match)
		{
			for (var i = 0; i < __simple_candy.length; i++)
			{
				var item_id_2 = __simple_candy[i];
				if (item_id_2 == item_id)
				{
					has_match = true;
					break;
				}
			}
		}
		if (!has_match)
			unknown_candy.push(item_id);
	}
	return unknown_candy;
}

function recalculateCandyCombination()
{
	var first_candy_name = document.getElementById("select_first_candy").value;
	var second_candy_name = document.getElementById("select_second_candy").value;
	
	var item_id_1 = parseInt(__names_to_item_ids[first_candy_name]);
	var item_id_2 = parseInt(__names_to_item_ids[second_candy_name]);
	if (item_id_1 == undefined || item_id_1 <= 0 || item_id_2 == undefined || item_id_2 <= 0)
	{
		document.getElementById("synthesis_combination_output").innerHTML = "";
		return;
	}
	
	var out = "";
	
	var candy_1_type = __item_ids_to_candy_type[item_id_1];
	var candy_2_type = __item_ids_to_candy_type[item_id_2];
	
	var tier = -1;
	if (candy_1_type == "simple" && candy_2_type == "simple")
		tier = 1;
	else if (candy_1_type == "complex" && candy_2_type == "complex")
		tier = 3;
	else if ((candy_1_type == "simple" && candy_2_type == "complex") || (candy_1_type == "complex" && candy_2_type == "simple"))
		tier = 2;
	
	var subid = (item_id_1 + item_id_2) % 5;
	
	//out += "subid = " + subid + ", item_id_1 = " + item_id_1 + ", item_id_2 = " + item_id_2 + "<br>";
	var effect = "";
	if (tier == 1)
	{
		if (subid == 0)
			effect = "Synthesis: Hot";
		else if (subid == 1)
			effect = "Synthesis: Cold";
		else if (subid == 2)
			effect = "Synthesis: Pungent";
		else if (subid == 3)
			effect = "Synthesis: Scary";
		else if (subid == 4)
			effect = "Synthesis: Greasy";
	}
	else if (tier == 2)
	{
		if (subid == 0)
			effect = "Synthesis: Strong";
		else if (subid == 1)
			effect = "Synthesis: Smart";
		else if (subid == 2)
			effect = "Synthesis: Cool";
		else if (subid == 3)
			effect = "Synthesis: Hardy";
		else if (subid == 4)
			effect = "Synthesis: Energy";
	}
	else if (tier == 3)
	{
		if (subid == 0)
			effect = "Synthesis: Greed";
		else if (subid == 1)
			effect = "Synthesis: Collection";
		else if (subid == 2)
			effect = "Synthesis: Movement";
		else if (subid == 3)
			effect = "Synthesis: Learning";
		else if (subid == 4)
			effect = "Synthesis: Style";
	}
	var effect_descriptions = {
	"Synthesis: Cold": "+9 Cold res",
	"Synthesis: Collection": "+150% item",
	"Synthesis: Cool": "+300% moxie",
	"Synthesis: Energy": "+300% maximum MP",
	"Synthesis: Greasy": "+9 sleaze res",
	"Synthesis: Greed": "+300% meat",
	"Synthesis: Hardy": "+300% maximum HP",
	"Synthesis: Hot": "+9 hot res",
	"Synthesis: Learning": "+50% myst experience",
	"Synthesis: Movement": "+50% muscle experience",
	"Synthesis: Pungent": "+9 stench res",
	"Synthesis: Scary": "+9 spooky res",
	"Synthesis: Smart": "+300% myst",
	"Synthesis: Strong": "+300% muscle",
	"Synthesis: Style": "+50% moxie experience"};
	
	out += "Combines into:<br><br>";
	if (effect == "")
	{
		document.getElementById("synthesis_combination_output").innerHTML = "";
		return;
	}
	else
	{
		effect_description = effect_descriptions[effect];
		out += "<strong>" + effect_description + "</strong> - ";
		out += effect + " (30 turns)";
	}
	
	
	
	document.getElementById("synthesis_combination_output").innerHTML = out;
}

function pageLoaded()
{
	recalculateDatafiles();
	if (true)
	{
		//Sort by mall price:
		__complex_candy.sort(function(a, b) { return mallPriceOfItem(a) - mallPriceOfItem(b); });
		__simple_candy.sort(function(a, b) { return mallPriceOfItem(a) - mallPriceOfItem(b); });
	}
	else
	{
		//Sort complex/simple candy by name:
		__complex_candy.sort(function(a, b) { var v = ""; if (__item_ids_to_names.hasOwnProperty(a)) v = __item_ids_to_names[a]; return v.localeCompare(__item_ids_to_names[b]); });
		__simple_candy.sort(function(a, b) { var v = ""; if (__item_ids_to_names.hasOwnProperty(a)) v = __item_ids_to_names[a]; return v.localeCompare(__item_ids_to_names[b]); });
	}
	if (document.getElementById("unknown_candy_output") != undefined)
	{
		//Write out unknown candy:
		var unknown_candy = calculateUnknownCandy();
		if (unknown_candy.length > 0)
		{
			unknown_candy.sort(function(a, b) { return mallPriceOfItem(a) - mallPriceOfItem(b); }); //cheapest to spade
			var new_html = "<hr>Unspaded candy:<br><p>";
			for (var i = 0; i < unknown_candy.length; i++)
			{
				var item_id = unknown_candy[i];
				if (i != 0)
					new_html += ", ";
				new_html += lookupItemName(item_id);
			}
			new_html += "</p>";
			document.getElementById("unknown_candy_output").innerHTML = new_html;
			
		}
	}
	if (document.getElementById("select_first_candy") != undefined)
	{
		var full_useful_candy_list = [];
		for (var i = 0; i < __simple_candy.length; i++)
			full_useful_candy_list.push(__simple_candy[i]);
		for (var i = 0; i < __complex_candy.length; i++)
			full_useful_candy_list.push(__complex_candy[i]);
		
		//Sort by name:
		full_useful_candy_list.sort(function(a, b) { var v = ""; if (__item_ids_to_names.hasOwnProperty(a)) v = __item_ids_to_names[a]; return v.localeCompare(__item_ids_to_names[b]); });
		
		var select_form_1 = document.getElementById("select_first_candy");
		var select_form_2 = document.getElementById("select_second_candy");
		for (var i = 0; i < full_useful_candy_list.length; i++)
		{
			var item_id = full_useful_candy_list[i];
			var option_1 = document.createElement("option");
			option_1.text = lookupItemName(item_id);
			select_form_1.add(option_1);
			
			var option_2 = document.createElement("option");
			option_2.text = lookupItemName(item_id);
			select_form_2.add(option_2);
			
			//select_form_2.add(option_1);
		}
	}
}

function candyOutputList(candy_list)
{
	var out = "";
	for (var i = 0; i < candy_list.length; i++)
	{
		var item_id = candy_list[i];
		var item_name = lookupItemName(item_id);
		/*if (i != 0)
			out += ", ";*/
		out += "<div style=\"margin:5px;width:200px;display:inline-block;\">";
		out += item_name;
		out += "</div>";
	}
	return out;
}

function pageLoadedCandy()
{
	pageLoaded();
	var out = "";	
	//Sort complex/simple candy by name:
	__complex_candy.sort(function(a, b) { var v = ""; if (__item_ids_to_names.hasOwnProperty(a)) v = __item_ids_to_names[a]; return v.localeCompare(__item_ids_to_names[b]); });
	__simple_candy.sort(function(a, b) { var v = ""; if (__item_ids_to_names.hasOwnProperty(a)) v = __item_ids_to_names[a]; return v.localeCompare(__item_ids_to_names[b]); });
	out += "<strong style=\"font-size:1.2em;\">Simple candy:</strong><br>";
	out += candyOutputList(__simple_candy);
	out += "<hr><strong style=\"font-size:1.2em;\">Complex candy:</strong><br>";
	out += candyOutputList(__complex_candy);
	
	var unknown_candy = calculateUnknownCandy();
	out += "<hr><strong style=\"font-size:1.2em;\">Unspaded candy:</strong><br>";
	out += candyOutputList(unknown_candy);
	document.getElementById("synthesis_output").innerHTML = out;
	
}