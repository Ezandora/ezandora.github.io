//Written by Ezandora. This script is in the public domain.
//Version 1.0.

var __setting_slow = false;
var __setting_iterate = true; //Instead of picking random letters, increase by one.
var __setting_always_active_after_time = 5.0; //Seconds. After this point, start scrambling all unsolved elements.
var __setting_force_finish_time = 11.0; //Seconds. After this amount of time, force profile back to its original text.

//State-based:
var __noise_level = 0.0; //Chance to lock-in a letter. Increases over time.
var __noise_level_2 = 0.0; //Chance to start scrambling an element. Increases over time.
var __scramble_ticks_done = 0;
var __start_time = Date.now();
var __current_time_elapsed = 0.0;
var __starting_element_count = 0;
var __resets_done = 0;
var __currently_animating = false;
var __user_has_requested_constant_animation = false;
var __current_stage = 0; //Stage 0 is replacing each letter one by one with random text. Stage 1 is descrambling.
var __do_not_rescramble_stage_1 = false;
var __stage_zero_current_character = 0;

function scrambleProcessElement(element, depth, is_initial)
{
	if (element === null || element === undefined) return true;
	if (!is_initial && element.dataset.scrambleState !== undefined && element.dataset.scrambleState === "finished") return true;
	if (depth > 100) return true;
	if (is_initial)
	{
		if (element.dataset.scrambleState !== undefined)
			delete element.dataset.scrambleState;
	}
	if (element.children.length > 0)
	{
		var all_children_are_finished = true;
		for (var i = 0; i < element.children.length; i += 1)
		{
			var element_finished = scrambleProcessElement(element.children[i], depth + 1, is_initial);
			if (!element_finished)
				all_children_are_finished = false;
			else if (!is_initial)
			{
				element.children[i].dataset.scrambleState = "finished";
			}
		}
		return all_children_are_finished;
	}
	
	if (is_initial)
	{
		__starting_element_count += 1;
	}
	if (is_initial && __resets_done <= 1 && element.tagName === "IMG" && element.src !== undefined && element.src.indexOf("magbase.gif") !== -1 && element.style.mixBlendMode !== "multiply")
	{
		//Unlock extra whitespace for the mag sculpture base:
		element.style.mixBlendMode = "multiply";
	}
	if (is_initial && __resets_done <= 1 && element.tagName == "IMG" && ((element.width === 60 && element.height === 100) || (element.src.indexOf("otherimages/masks/mask") !== -1 )))
	{
		//Make their character avatar operate as a button to toggle continual animation:
		element.onclick = function() { scrambleAvatarClicked(); };
		element.style.cursor = "pointer";
	}
	
	//Processing this element:
	//Early rejects:
	if (element.nodeType !== 1) return true;
	if (element.tagName === "STYLE" || element.tagName === "SCRIPT") return true;
	if (element.innerHTML.length === 0) return true;
	if (element.innerHTML.indexOf("<") !== -1 || element.innerHTML.indexOf("&") !== -1 || element.innerHTML.indexOf(">") !== -1) return true; //do not scramble weird characters
	if (element.innerHTML === "fake hand") return true; //performance optimisation
	
	if (is_initial)
	{
		if (element.dataset.scrambleOriginalText === undefined)
			element.dataset.scrambleOriginalText = element.innerHTML;
		element.dataset.scrambleState = "inactive";
	}
	
	var origin_text = element.dataset.scrambleOriginalText;
	if (origin_text == undefined)
	{
		return true;
	}
	if (!is_initial)
	{
		//activate if we're not active:
		var scramble_state = element.dataset.scrambleState;
		if (scramble_state == null || scramble_state == undefined) scramble_state = "inactive";
		if (scramble_state == "inactive" && (Math.random() >= (1.0 - __noise_level_2) || __current_stage === 0))
		{
			scramble_state = "active";
			element.dataset.scrambleState = "active";
		}
		if (scramble_state == "inactive" && __current_time_elapsed < __setting_always_active_after_time) return false;
	}
	var old_text = element.innerHTML;
	var new_text = "";
	var min_best_index = -1;
	for (var i = 0; i < old_text.length; i += 1)
	{
		var c_int = origin_text.charCodeAt(i);
		var c_int_current = old_text.charCodeAt(i);
		
		var range_min = -1;
		var range_max = -1;
		
		if (c_int >= 48 && c_int <= 57) //numbers and such
		{
			range_min = 48;
			range_max = 57;
		}
		else if (c_int >= 65 && c_int <= 90) //letters
		{
			range_min = 65;
			range_max = 90;
		}
		else if (c_int >= 97 && c_int <= 122) //more letters
		{
			range_min = 97;
			range_max = 122;
		}
		
		var new_char_code = c_int;
		if (c_int == c_int_current && min_best_index == i - 1)
			min_best_index = i;
		if (range_min > 0 && (c_int != c_int_current || is_initial || i > min_best_index || __current_stage === 0))
		{
			if (__setting_iterate && !is_initial && i <= min_best_index + 1 && __current_stage === 1)
			{
				new_char_code = c_int_current + 1;
				if (new_char_code > range_max)
					new_char_code = range_min;
			}
			else
				new_char_code = range_min + Math.floor(Math.random() * (range_max - range_min + 1));
		}
		if (new_char_code === 60 || new_char_code === 62 || new_char_code === 38) new_char_code = 61;
		if (!__setting_slow && Math.random() <= __noise_level && !is_initial && __current_stage === 1)
			new_char_code = c_int;
		//In stage zero, if we aren't the desired character, keep what we had before:
		if (__current_stage === 0 && i >= __stage_zero_current_character)
			new_char_code = c_int_current;
		//Don't rescramble what we scrambled in stage 0:
		if (is_initial && __current_stage === 1 && __do_not_rescramble_stage_1)
			new_char_code = c_int_current;
		new_text += String.fromCharCode(new_char_code);
	}
	
	if (__current_time_elapsed > __setting_force_finish_time && __current_stage === 1)
	{
		element.innerHTML = origin_text;
		return true;
	}
	element.innerHTML = new_text;
	if (__current_stage === 1 && new_text == origin_text && !is_initial)
	{
		element.dataset.scrambleState = "finished";
		return true;
	}
	else if (__current_stage === 0 && __stage_zero_current_character >= origin_text.length)
	{
		element.dataset.scrambleState = "finished";
		return true;
	}
	else
	{
		return false;
	}
	return true;
}

function scrambleTick()
{
	__scramble_ticks_done += 1;
	__current_time_elapsed = (Date.now() - __start_time) / 1000.0;
	
	//Increase likelyhood of completing as time goes on:
	__noise_level = 0.1 + 0.6 * Math.min(1.0, __current_time_elapsed / 15.0);
	__noise_level_2 = .011 + 0.25 * Math.min(1.0, __current_time_elapsed / 15.0);
	
	var root = document.documentElement;
	did_finish = scrambleProcessElement(root, 0, false);
	
	__stage_zero_current_character += 1;
	
	if (!did_finish)
	{
		setTimeout(scrambleTick, 16); //16 milliseconds ~= 60 FPS
	}
	else if (__current_stage == 0)
	{
		//Advance to next stage:
		__do_not_rescramble_stage_1 = true;
		scrambleReset(1);
	}
	else
	{
		__currently_animating = false;
		if (__user_has_requested_constant_animation && __starting_element_count < 10000) //Don't re-animate complex profiles.
		{
			setTimeout(function() { scrambleReset(0); }, 1000);
		}
	}
}

function scrambleReset(target_stage)
{
	if (target_stage !== 0 && target_stage !== 1) target_stage = 1;
	__current_stage = target_stage;
	__currently_animating = true;
	__resets_done += 1;
	__start_time = Date.now();
	__scramble_ticks_done = 0;
	__starting_element_count = 0;
	__stage_zero_current_character = 0;
	
	var root = document.documentElement;
	scrambleProcessElement(root, 0, true);
	scrambleTick();
}

function scrambleOnload()
{
	//Override style sheet to use monospaced fonts:
	var font_style_override_element = document.createElement("style");
	font_style_override_element.setAttribute("type", "text/css");
	font_style_override_element.innerHTML = "body, button.button, input.button, input.text, td, textarea { font-family:\"Lucida Console\", Monaco, monospace; }";
	if (font_style_override_element !== undefined)
		document.getElementsByTagName("head")[0].appendChild(font_style_override_element);
	scrambleReset(1);
}


function scrambleAvatarClicked()
{
	//Switch:
	if (__user_has_requested_constant_animation)
	{
		__user_has_requested_constant_animation = false;
	}
	else
	{
		__user_has_requested_constant_animation = true;
	}
		
	
	if (__user_has_requested_constant_animation && !__currently_animating && __starting_element_count < 10000) //Don't re-animate complex profiles.
	{
		scrambleReset(0);
	}
}