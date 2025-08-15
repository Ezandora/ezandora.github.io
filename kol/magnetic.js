//I would not recommend this code for anything really.
//In particular, we store state by the background colour of the various pixel divs.
//This would probably be much better off with, like, canvas and an internal array.

//In-game, each pixel image is random, from one to ten.
//So, when we load this page, generate a random configuration:

var __base_hack_support = false;
var __chosen_pixel_image_ids = [];
function updateString()
{
	//Save configuration:
	var storage_string = "";
	for (var y = 0; y < 25; y++)
	{
		for (var x = 0; x < 25; x++)
		{
			var pixel_id = y * 25 + x;
			var pixel_set = false;
			if (document.getElementById("pixel" + pixel_id).style.backgroundColor === "black")
				pixel_set = true;
			if (pixel_set)
				storage_string += "1";
			else
				storage_string += "0";
		}
	}
	
	try
	{
		if (typeof localStorage !== "undefined")
		{
			localStorage.setItem("pixels", storage_string);
		}
	}
	catch (exception)
	{
	}
	
	//Update in-game simulation:
	var sculpture_html = "";
	sculpture_html += "<div class=\"magnetic_sculpture\">";
	for (var y = 0; y < 25; y++)
	{
		for (var x = 0; x < 25; x++)
		{
			var pixel_id = y * 25 + x;
			var pixel_set = false;
			if (document.getElementById("pixel" + pixel_id).style.backgroundColor === "black")
				pixel_set = true;
			if (pixel_set)
			{
				var image_number = __chosen_pixel_image_ids[pixel_id];
				var left = x * 8;
				var top = y * 8;
				sculpture_html += "<img src=\"images/magsculpture/magpixel" + image_number + ".gif\" style=\"left: " + left + "px; top: " + top + "px;\" class=\"magnetic_pixel\">";
			}
		}
	}
	sculpture_html += "<img src=\"images/magsculpture/magbase.gif\" class=\"magnetic_base\">";
	sculpture_html += "</div>";
	document.getElementById("magnetic_sculpture_display").innerHTML = sculpture_html;
	
	//Build mafia command:
	var mafia_command = "ashq visit_url(\"inv_use.php?pwd=\"+my_hash()+\"&whichitem=6085&set="; //pwd?
	var chat_command = "/goto inv_use.php?pwd='+pwdhash+'&whichitem=6085&set=";
	
	var set_portion_of_command = "";
	var coordinates_added = 0;
	for (var y = 0; y < 25; y++)
	{
		for (var x = 0; x < 25; x++)
		{
			var pixel_id = y * 25 + x;
			var pixel_set = false;
			if (document.getElementById("pixel" + pixel_id).style.backgroundColor === "black")
				pixel_set = true;
			if (pixel_set)
			{
				if (coordinates_added > 0)
					set_portion_of_command += "+";
				set_portion_of_command += y + "," + x;
				coordinates_added++;
			}
		}
	}
	mafia_command += set_portion_of_command;
	chat_command += set_portion_of_command;
	mafia_command += "\", false, true);";
	//Use opacity for the container, so it doesn't reflow anything:
	if (coordinates_added == 0)
	{
		document.getElementById("url_output").innerHTML = "";
		document.getElementById("chat_url_output").innerHTML = "";
		document.getElementById("url_output_container").style.opacity = 0;
	}
	else
	{
		document.getElementById("url_output").innerHTML = mafia_command;
		document.getElementById("chat_url_output").innerHTML = chat_command;
		document.getElementById("url_output_container").style.opacity = 1;
	}
	
}

function pixelCoordinateIsUnusable(x, y)
{
	if (__base_hack_support)
		return false;
	//plinth
	if (y >= 15 && y <= 17 && x >= 0 && x <= 14)
		return true;
	return false;
}

function pixelCoordinateIsUnusableCombined(combined)
{
	return pixelCoordinateIsUnusable(combined % 25, Math.floor(combined / 25));
}

function pixelSetElement(element, pixel_set)
{	
	if (pixel_set)
	{
		element.style.backgroundColor = "black";
	}
	else
	{
		element.style.backgroundColor = "white";
	}
	
	updateString();
}

function pixelInvertElement(element)
{
	var pixel_set = false;
	if (element.style.backgroundColor === "black")
		pixel_set = true;
	pixelSetElement(element, !pixel_set);
}

var __mouse_is_down = false;
var __mouse_is_erasing_pixels = false;
var __last_pixel_id_encountered = -1;

function lookupPixelIDForInputMouseEvent(event)
{
	var element_seen = document.elementFromPoint(event.clientX, event.clientY);
	if (element_seen === undefined)
		return -1;
	if (element_seen.className === "pixel")
	{
		var id = parseInt(element_seen.id.replace("pixel", ""));
		return id;
	}
	
	return -1;
}

function pixelContainerMouseIsProbablyNotDownAnymore()
{
	__mouse_is_down = false;
	__mouse_is_erasing_pixels = false;
	__last_pixel_id_encountered = -1;
}

function pixelContainerMouseMoved(event)
{
	if (!__mouse_is_down) //can check mouse event, but then we don't know if it's erasing or not
		return;
	
	if (event.button < 0)
	{
		pixelContainerMouseIsProbablyNotDownAnymore();
		return;
	}
	
	var pixel_id = lookupPixelIDForInputMouseEvent(event);
	
	if (pixel_id < 0)
		return;
	if (pixelCoordinateIsUnusableCombined(pixel_id))
		return;
	
	if (__last_pixel_id_encountered === pixel_id)
		return;
	
	__last_pixel_id_encountered = pixel_id;
	pixelSetElement(document.getElementById("pixel" + pixel_id), !__mouse_is_erasing_pixels);
	
	
}

function pixelContainerMouseDown(event)
{
	if (event.button > 0)
		return;
	try
	{
		event.preventDefault(); //text-editing cursor
	}
	catch (no)
	{
	}
	
	__mouse_is_down = true;
	
	var current_pixel_id = lookupPixelIDForInputMouseEvent(event);
	if (current_pixel_id >= 0)
	{
		if (pixelCoordinateIsUnusableCombined(current_pixel_id))
			return;
		if (document.getElementById("pixel" + current_pixel_id).style.backgroundColor === "black")
			__mouse_is_erasing_pixels = true;
		pixelInvertElement(document.getElementById("pixel" + current_pixel_id));
	}
}

function pixelContainerMouseUp(event)
{
	if (event.button > 0)
		return;
	pixelContainerMouseIsProbablyNotDownAnymore();
}

function generalMouseUp(event)
{
	if (event.button > 0)
		return;
	pixelContainerMouseIsProbablyNotDownAnymore();
}

function erasePixels()
{
	
	for (var y = 0; y < 25; y++)
	{
		for (var x = 0; x < 25; x++)
		{
			var pixel_id = y * 25 + x;
			var pixel_set = false;
			var element = document.getElementById("pixel" + pixel_id);
			if (element.style.backgroundColor === "black")
				element.style.backgroundColor = "white";
		}
	}
	updateString();
}

function pageLoaded(base_hack_support)
{
	__base_hack_support = base_hack_support;
	//Generate pixel HTML:
	
	//By adding the mouseup listener to the document, we can get it when the mouse is outside the element.
	//Maybe.
	if (document.addEventListener)
		document.addEventListener("mouseup", function() { generalMouseUp(event); });
	__chosen_pixel_image_ids = [];
	for (var i = 0; i < 625; i++)
		__chosen_pixel_image_ids.push(Math.floor((Math.random() * 10) + 1));
	
	var saved_configuration = "";
	
	try
	{
		if (typeof localStorage !== "undefined")
		{
			//retrieve from cache:
			saved_configuration = localStorage.getItem("pixels");
			if (saved_configuration == undefined)
				saved_configuration = "";
		}
	}
	catch (exception)
	{
	}
	
	var pixel_html = "";
	pixel_html += "<div style=\"display:table;\">";
	for (var y = 0; y < 25; y++)
	{
		pixel_html += "<div style=\"display:table-row;\">";
		for (var x = 0; x < 25; x++)
		{
			var id = y * 25 + x;
			pixel_html += "<div class=\"pixel\" style=\"background-color:";
			
			var pixel_set = false;
			if (saved_configuration.length > id)
			{
				if (saved_configuration[id] == "1")
					pixel_set = true;
			}
			if (pixelCoordinateIsUnusable(x, y))
				pixel_html += "#B2B2B2";
			else if (pixel_set)
				pixel_html += "black";
			else
				pixel_html += "white";
			pixel_html += "\"";
			pixel_html += " id=\"pixel" + id + "\"";
			pixel_html += "></div>";
		}
		pixel_html += "</div>";
	}
	pixel_html += "</div>";
	document.getElementById("pixel_collection").innerHTML = pixel_html;
	
	updateString();
}