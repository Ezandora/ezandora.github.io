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



function seedForCornucopiaUse(path_number, class_number, daycount, previous_cornucopias_used)
{
	return 3 * ((previous_cornucopias_used + 1) + path_number) + 5 * daycount + 7 * class_number;
}

var __cfcu_debug = [];
function cashewsForCornucopiaUse(path_number, class_number, daycount, previous_cornucopias_used)
{
	var seed = seedForCornucopiaUse(path_number, class_number, daycount, previous_cornucopias_used);
	var seed_lookup = seed.toString();
	if (__thanksgarden_cornucopia_rewards[seed_lookup] === undefined)
	{
		/*if (__cfcu_debug[seed_lookup] === undefined)
		{
			console.log("Unable to find (" + path_number + ", " + class_number + ", " + daycount + ", " + previous_cornucopias_used + ") = " + seed);
			__cfcu_debug[seed_lookup] = true;
		}*/
		return -1;
	}
	return __thanksgarden_cornucopia_rewards[seed_lookup]["cashew"];
}

//Returns true if done.
function incrementHarvestSchedule(schedule)
{
	var index = schedule.length - 1;
	while (index >= 0)
	{
		if (schedule[index])
		{
			schedule[index] = false;
			//Continue on.
		}
		else
		{
			schedule[index] = true;
			return false;
		}
		index--;
	}
	return true;
}

function recurseOnCornucopiaUsageScenarios(cornucopias_schedule, result, day_index, schedule_so_far, unused_cornucopias)
{
	var cornucopias_we_have = cornucopias_schedule[day_index] + unused_cornucopias;
	if (day_index == cornucopias_schedule.length - 1)
	{
		//Finished.
		schedule_so_far.push(cornucopias_we_have);
		result.push(schedule_so_far.slice(0));
		return;
	}
	//Iterate over every possibility.
	for (var i = 0; i <= cornucopias_we_have; i++)
	{
		var unused_cornucopias_next = cornucopias_we_have - i;
		new_schedule = schedule_so_far.slice(0);
		new_schedule.push(i);
		recurseOnCornucopiaUsageScenarios(cornucopias_schedule, result, day_index + 1, new_schedule, unused_cornucopias_next);
	}
}

function calculateCornucopiaUsageScenarios(cornucopias_schedule, pulling_cornucopias)
{
	var result = [];
	
	
	recurseOnCornucopiaUsageScenarios(cornucopias_schedule, result, 0, [], pulling_cornucopias);
	
	return result;
}

function calculatePlansForRun(path_number, class_number, run_daycount, pulling_cornucopias, cannot_harvest)
{
	//Find the plan that gives us the most cashews.
	//Examine every possible garden harvest schedule, then every cornucopia usage inside of that.
	
	//var best_plan_cashew_count = 0;
	//var best_plan_harvest_schedules = []; //true if we harvest on that day, false otherwise
	//var best_plan_cornucopia_usage_schedules = []; //number of cornucopias to use on that day
	if (cannot_harvest == undefined)
		cannot_harvest = false;
	
	var plans = [];
	var harvest_schedule = [];
	for (var day = 0; day < run_daycount; day++)
	{
		harvest_schedule.push(false);
	}
	if (__paths_that_cannot_garden[path_number])
		cannot_harvest = true;
	
	//var debug_output = "<p>";
	
	var first = true;
	while (true)
	{
		//First increment is fine, because we always want to harvest on last day anyways, and we start as false,false,false,false,false.
		if (!cannot_harvest)
		{
			var done = incrementHarvestSchedule(harvest_schedule);
			if (done)
				break;
			//Always harvest on last day:
			if (!harvest_schedule[harvest_schedule.length - 1])
				continue;
		}
		else if (!first)
			break;
		first = false;
		//debug_output += "Examining " + harvest_schedule + "<br>";
		
		var cornucopias_schedule = [];
		var garden_day = 0;
		
		//Calculate cornucopias harvested on each day:
		for (var day = 0; day < run_daycount; day++)
		{
			var cornucopias_gained = 0;
			garden_day++;
			
			var harvesting = harvest_schedule[day];
			if (harvesting)
			{
				if (garden_day == 1)
					cornucopias_gained = 1;
				else if (garden_day == 2)
					cornucopias_gained = 3;
				else if (garden_day == 3)
					cornucopias_gained = 5;
				else if (garden_day == 4)
					cornucopias_gained = 8;
				else if (garden_day == 5)
					cornucopias_gained = 11;
				else if (garden_day == 6)
					cornucopias_gained = 15;
				else if (garden_day >= 7)
					cornucopias_gained = 0;
				garden_day = 0;
			}
			if (cannot_harvest)
				cornucopias_gained = 0;
			cornucopias_schedule.push(cornucopias_gained);
		}
		//debug_output += "cornucopias_schedule: " + JSON.stringify(cornucopias_schedule) + "<br>";
		
		//Now, calculate every possible usage scenario of cornucopias:
		//You always use all of them on the last day.
		
		var usage_scenarios = calculateCornucopiaUsageScenarios(cornucopias_schedule, pulling_cornucopias);
		
		for (var scenario_id = 0; scenario_id < usage_scenarios.length; scenario_id++)
		{
			var scenario = usage_scenarios[scenario_id];
			
			var cornucopias_used = 0;
			var cashews_earned = 0;
			var has_invalid_seed_ids = false;
			var cashews_earned_per_day = [];
			var missing_seeds = [];
			var cornucopias_pulled_per_day = [];
			var spare_cornucopias = 0;
			for (var day = 0; day < run_daycount; day++)
			{
				spare_cornucopias += cornucopias_schedule[day];
				
				var cashews_earned_today = 0;
				var cornucopias_to_use_today = scenario[day];
				var cornucopias_pulled_today = Math.max(0, cornucopias_to_use_today - spare_cornucopias);
				spare_cornucopias += cornucopias_pulled_today;
				for (var cornucopia_id = 0; cornucopia_id < cornucopias_to_use_today; cornucopia_id++)
				{
					var cashews = cashewsForCornucopiaUse(path_number, class_number, day + 1, cornucopias_used);
					if (cashews == -1)
					{
						cashews = 0;
						has_invalid_seed_ids = true;
						missing_seeds.push(seedForCornucopiaUse(path_number, class_number, day + 1, cornucopias_used));
					}
					//debug_output += "&nbsp;&nbsp;&nbsp;&nbsp;cashews = " + cashews + " (" + path_number + ", " + class_number + ", " + (day + 1) + ", " + cornucopias_used + ")<br>";
					cashews_earned += cashews;
					cashews_earned_today += cashews;
					cornucopias_used++;
					spare_cornucopias--;
				}
				cashews_earned_per_day.push(cashews_earned_today);
				cornucopias_pulled_per_day.push(cornucopias_pulled_today);
			}
			if (has_invalid_seed_ids)
				cashews_earned = -1;
			
			plans.push({cashewsEarned:cashews_earned, harvestSchedule:harvest_schedule.slice(0), cornucopiaSchedule:scenario.slice(0), cashewsEarnedPerDay:cashews_earned_per_day.slice(0), cornucopiaHarvestedPerDay:cornucopias_schedule.slice(0), missingSeeds:missing_seeds.slice(0), cornucopiasPulledPerDay:cornucopias_pulled_per_day.slice(0)});
			/*if (cashews_earned >= best_plan_cashew_count)
			{
				if (cashews_earned > best_plan_cashew_count)
				{
					best_plan_cashew_count = cashews_earned;
					best_plan_harvest_schedules = [];
					best_plan_cornucopia_usage_schedules = [];
				}
				best_plan_harvest_schedules.push(harvest_schedule.slice(0));
				best_plan_cornucopia_usage_schedules.push(scenario.slice(0));
			}*/
			//debug_output += "cashews_earned = " + cashews_earned + "<br>";
		}
		//debug_output += "usage_scenarios: " + JSON.stringify(usage_scenarios) + "<br>";
		//debug_output += "<br>";
	}
	
	//debug_output += "Best plan: " + best_plan_cashew_count + " cashews via harvest schedule " + JSON.stringify(best_plan_harvest_schedules) + " and cornucopia usage schedule " + JSON.stringify(best_plan_cornucopia_usage_schedules) + "<br>";
	
	//debug_output += "</p>";
	//document.getElementById("debug_div").innerHTML += debug_output;
	
	return plans;
	//return {cashewsEarned:best_plan_cashew_count, harvestSchedules:best_plan_harvest_schedules, cornucopiaSchedules:best_plan_cornucopia_usage_schedules};
}

//test_block: function(plan)
function filterBestPlans(plans, eligibility_function, scoring_function, scoring_function_input)
{
	if (eligibility_function === undefined)
		eligibility_function = function(plan) { return true; };
	if (scoring_function === undefined)
		scoring_function = function(plan, extra) { return plan.cashewsEarned; };
	var best_score = 0;
	var best_plans = [];
	for (var i = 0; i < plans.length; i++)
	{
		var plan = plans[i];
		if (!eligibility_function(plan))
			continue;
		var score = scoring_function(plan, scoring_function_input);
		if (score >= best_score)
		{
			if (score > best_score)
			{
				best_score = score;
				best_plans = [];
			}
			best_plans.push(plan);
		}
	}
	best_plans.sort(function(a, b) { return b.cashewsEarned - a.cashewsEarned; });
	return best_plans;
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

function generatePlanOutput(plans, extra_output_function, data_to_feed_output_function)
{
	//Test - do all the plans have identical harvest schedules, but one of them uses all cornucopias per day?
	//If so, remove the rest, to reduce cognitive load.
	
	
	var output = "<div style=\"margin-left:3em;\">";
	
	var show_cashews_on_each = false;
	
	var all_plans_have_identical_cashews_earned = true;
	var shared_cashews_earned = -1;
	var plans_use_all_cornucopias = []; //1:1 to plans
	for (var i = 0; i < plans.length; i++)
	{
		var plan = plans[i];
		if (shared_cashews_earned == -1)
		{
			shared_cashews_earned = plan.cashewsEarned;
		}
		else if (shared_cashews_earned != plan.cashewsEarned)
		{
			all_plans_have_identical_cashews_earned = false;
		}
		var uses_all_cornucopias = true;
		for (var j = 0; j < plan.cornucopiaSchedule.length; j++)
		{
			if (plan.cornucopiaSchedule[j] != plan.cornucopiaHarvestedPerDay[j])
			{
				uses_all_cornucopias = false;
				break;
			}
		}
		plans_use_all_cornucopias.push(uses_all_cornucopias);
	}
	if (true)
	{
		//If multiple plans share a harvest schedule, and one is use-as-you-go, delete the harder one.
		//Standard turtle tamer has this use case.
		var indices_to_delete = {};
		var have_indices_to_delete = false; //querying whether a hash has elements at all is weird. easier to just store
		for (var i = 0; i < plans.length; i++)
		{
			var plan_1 = plans[i];
			if (!plans_use_all_cornucopias[i])
				continue;
			//plan_1 uses all cornucopias
			//no, we won't be going to plan_9
			for (var j = 0; j < plans.length; j++)
			{
				if (i == j) continue;
				var plan_2 = plans[j];
				
				if (twoSimpleArraysAreEqual(plan_1.harvestSchedule, plan_2.harvestSchedule))
				{
					//Assume plan_2 does not use all of them.
					indices_to_delete[j] = true;
					have_indices_to_delete = true;
				}
			}
		}
		if (have_indices_to_delete)
		{
			var new_plans = [];
			for (var i = 0; i < plans.length; i++)
			{
				if (indices_to_delete[i]) continue;
				new_plans.push(plans[i]);
			}
			plans = new_plans;
			plans_use_all_cornucopias = undefined; //invalid; don't bother recalculating, we don't use it
		}
	}
	else if (false)
	{
		//Old method - only support one set of harvest schedules.
		//Gelatinous noob has this use case.
		var have_plan_that_uses_all_cornucopias_per_day = false;
		var all_plans_use_identical_harvest = true;
		var all_cornucopia_harvest_plan = [];
		for (var i = 0; i < plans.length; i++)
		{
			var plan = plans[i];
			if (i != 0 && !twoSimpleArraysAreEqual(plans[0].harvestSchedule, plan.harvestSchedule))
				all_plans_use_identical_harvest = false;
			var uses_all_cornucopias = plans_use_all_cornucopias[i];
			if (uses_all_cornucopias)
			{
				have_plan_that_uses_all_cornucopias_per_day = true;
				all_cornucopia_harvest_plan = plan;
			}
		}
		if (all_plans_use_identical_harvest && all_plans_have_identical_cashews_earned && have_plan_that_uses_all_cornucopias_per_day)
		{
			plans = [all_cornucopia_harvest_plan];
			plans_use_all_cornucopias = undefined;
		}
	}
	if (!all_plans_have_identical_cashews_earned)
		show_cashews_on_each = true;
	
	var all_plans_have_identical_extra_outputs = true;
	var shared_extra_output = "";
	if (extra_output_function != undefined)
	{
		for (var i = 0; i < plans.length; i++)
		{
			var plan = plans[i];
			var extra_output = extra_output_function(plan, data_to_feed_output_function);
			if (i == 0)
				shared_extra_output = extra_output;
			else if (shared_extra_output != extra_output)
			{
				all_plans_have_identical_extra_outputs = false;
			}
		}
	}
	
	var initial_line = "";
	if (all_plans_have_identical_cashews_earned)
	{
		initial_line += shared_cashews_earned + " cashews earned.";
	}
	if (all_plans_have_identical_extra_outputs)
	{
		if (initial_line != "")
			initial_line += " ";
		initial_line += shared_extra_output;
	}
	output += "<div style=\"display:table;\">";
	for (var i = 0; i < plans.length; i++)
	{
		var plan = plans[i];
		
		//cashewsEarned, harvestSchedule, cornucopiaSchedule, cashewsEarnedPerDay, cornucopiaHarvestedPerDay, missingSeeds, cornucopiasPulledPerDay
		//{"cashewsEarned":12,"harvestSchedule":[false,true],"cornucopiaSchedule":[0,3],"cashewsEarnedPerDay":[0,12]}
		var days_harvesting = [];
		var days_acquiring_cornucopia = [];
		for (var day = 0; day < plan.harvestSchedule.length; day++)
		{
			if (plan.harvestSchedule[day])
				days_harvesting.push(day + 1);
		}
		//output += JSON.stringify(plan) + "<br>";
		output += "<div style=\"display:table-row;\"><div class=\"bullet_cell\">";
		output += "&bullet;</div><div style=\"display:table-cell;\">";
		if (i > 0)
			output += "<hr class=\"hr_little_margin\">";
		//if (i > 0)
			//output += "OR ";
		if (show_cashews_on_each)
			output += plan.cashewsEarned + " cashews.<br>";
			
		var major_lines = [];
		if (days_harvesting.length > 0)
			major_lines.push("<strong>Harvest</strong> on day" + (days_harvesting.length > 1 ? "s" : "") + " " + listJoinComponents(days_harvesting, ", ", "and") + ".");
		
		var cornucopia_schedule_output = [];
		var we_use_all_cornucopias_we_harvest = true;
		var we_pull_extras = false;
		var days_using_cornucopias = 0;
		for (var day = 0; day < plan.cornucopiaSchedule.length; day++)
		{
			if (plan.cornucopiaHarvestedPerDay[day] != plan.cornucopiaSchedule[day])
			{
				we_use_all_cornucopias_we_harvest = false;
			}
			if (plan.cornucopiasPulledPerDay[day] > 0)
			{
				we_pull_extras = true;
			}
			if (plan.cornucopiaSchedule[day] > 0)
				days_using_cornucopias++;
		}
		//Pulls:
		if (we_pull_extras)
		{
			var output_list = [];
			//Auto-correct schedule so it pulls at most twenty a day:
			for (var day = plan.cornucopiaSchedule.length; day >= 0; day--)
			{
				var pulling_amount = plan.cornucopiasPulledPerDay[day];
				if (pulling_amount > 20)
				{
					if (day > 0)
					{
						var remainder = pulling_amount - 20;
						plan.cornucopiasPulledPerDay[day] = 20;
						plan.cornucopiasPulledPerDay[day - 1] += remainder;
					}
					else
					{
						//Does this happen? Skip this plan, then?
						output += "<div style=\"color:red\">Error while building this entry, probably wrong.</div>";
					}
				}
				
			}
			
			for (var day = 0; day < plan.cornucopiaSchedule.length; day++)
			{
				var pulling_amount = plan.cornucopiasPulledPerDay[day];
				if (pulling_amount == 0) continue;
				output_list.push(pulling_amount + " cornucopia" + (pulling_amount > 1 ? "s" : "") + " on day " + (day + 1));
			}
			if (output_list.length > 0)
				major_lines.push("<strong>Pull</strong> " + listJoinComponents(output_list, ", ", "and"));
		}
		if (!we_use_all_cornucopias_we_harvest || we_pull_extras)
		{
			for (var day = 0; day < plan.cornucopiaSchedule.length; day++)
			{
				var amount = plan.cornucopiaSchedule[day];
				if (amount == 0) continue;
			
				var line = amount;
				if (cornucopia_schedule_output.length == 0)
					line += " cornucopia" + (amount > 1 ? "s" : "");
				if (day == plan.cornucopiaSchedule.length - 1)
				{
					if (cornucopia_schedule_output.length > 0)
						line = "the rest";
					else
						line = "all cornucopias";
				}
				if (days_harvesting.length > 1 || days_using_cornucopias)
					line += " on day " + (day + 1);
				cornucopia_schedule_output.push(line);
			}
		}
		if (days_harvesting.length > 1 || we_pull_extras)
		{
			if (we_use_all_cornucopias_we_harvest)
				major_lines.push("<strong>Use</strong> cornucopias as you get them");
			else
				major_lines.push("<strong>Use</strong> " + listJoinComponents(cornucopia_schedule_output, ", ", "and"));
		}
		else
			major_lines.push("<strong>Use</strong> all cornucopias");
		if (major_lines.length > 0)
			output += listJoinComponents(major_lines, "<br>", "");
		//output += ".";
		if (extra_output_function !== undefined && !all_plans_have_identical_extra_outputs)
		{
			output += "<br><span style=\"margin-left:10px;\">" + extra_output_function(plan, data_to_feed_output_function) + "</span>";
		}
		output += "</div></div>";
	}
	if (initial_line != "")
	{
		output += "<div style=\"display:table-row;\"><div class=\"bullet_cell\"></div><div style=\"display:table-cell;\">";
		output += "<hr class=\"hr_little_margin\">";
		output += initial_line;
		output += "</div></div>";
		//output += "<hr class=\"hr_little_margin\">";
	}
	output += "</div>"; //table
	
	output += "</div>"; //indention
	
	return output; //JSON.stringify(plans);
}


function planIsIdentical(p1, p2)
{
	//cashewsEarned, harvestSchedule, cornucopiaSchedule, cashewsEarnedPerDay
	if (p1.cashewsEarned !== p2.cashewsEarned)
		return false;
	
	if (!twoSimpleArraysAreEqual(p1.harvestSchedule, p2.harvestSchedule))
		return false;
	if (!twoSimpleArraysAreEqual(p1.cornucopiaSchedule, p2.cornucopiaSchedule))
		return false;
	if (!twoSimpleArraysAreEqual(p1.cashewsEarnedPerDay, p2.cashewsEarnedPerDay))
		return false;
	if (!twoSimpleArraysAreEqual(p1.cornucopiaHarvestedPerDay, p2.cornucopiaHarvestedPerDay))
		return false;
	if (!twoSimpleArraysAreEqual(p1.missingSeeds, p2.missingSeeds))
		return false;
	if (!twoSimpleArraysAreEqual(p1.cornucopiasPulledPerDay, p2.cornucopiasPulledPerDay))
		return false;
	return true;
}

function plansAreIdentical(plans_1, plans_2)
{
	//hacky:
	if (plans_1.length != plans_2.length) return false;
	for (var i = 0; i < plans_1.length; i++)
	{
		var p1 = plans_1[i];
		var p2 = plans_2[i];
		if (!planIsIdentical(p1, p2))
			return false;
			
	}
	/*if (JSON.stringify(plans_1) !== JSON.stringify(plans_2))
	{
		console.log("ERROR: " + plans_1 + " is not equal to " + plans_2);
	}*/
	return true;
}

function calculateBlasterFlufferUseForPlan(plan, require_gravy_boat_first, avoid_turkey_blasters)
{
	var blasters_obtained = 0;
	var gravy_boats_obtained = 0;
	var earliest_day_with_blaster = plan.cashewsEarnedPerDay.length - 1;
	//Calculate how many stuffing fluffers are usable in this plan:
	var cashews_total = 0;
	for (var day = 0; day < plan.cashewsEarnedPerDay.length; day++)
	{
		cashews_total += plan.cashewsEarnedPerDay[day];
		if (cashews_total >= 3 && require_gravy_boat_first && gravy_boats_obtained == 0)
		{
			cashews_total -= 3;
			gravy_boats_obtained++;
		}
		if (!avoid_turkey_blasters || avoid_turkey_blasters == undefined)
		{
			for (var blaster = 0; blaster < 3; blaster++)
			{
				if (cashews_total < 3) break;
				cashews_total -= 3;
				blasters_obtained++;
				if (day < earliest_day_with_blaster)
					earliest_day_with_blaster = day;
			}
		}
	}
	var fluffers = Math.floor(cashews_total / 3.0);
	
	var result = {turkeyBlasters:blasters_obtained, stuffingFluffers:fluffers, earliestDayWithBlaster:earliest_day_with_blaster, gravyBoats:gravy_boats_obtained};
	return result;
}

function outputRunData(path_number, class_number, cornucopias_pulling, have_garden, min_run_length, max_run_length)
{
	var turkey_blaster_value = 1.0;
	if (__paths_that_cannot_use_spleen[path_number])
		turkey_blaster_value = 0.0;
	var stuffing_fluffer_value = 1.0;
	if (__paths_that_do_not_fight_the_war[path_number])
		stuffing_fluffer_value = 0.0;
	
	if (__paths_that_cannot_garden[path_number])
		have_garden = false;
	var output = "<hr>";
	output += "<div class=\"r_centre\" style=\"font-size:1.5em;font-weight:bold;\">" + __classes[class_number] + " in path " + __paths[path_number] + "</div>";
	for (var daycount = min_run_length; daycount <= max_run_length; daycount++)
	{
		//Show:
		//Best overall.
		//Best if we harvest the first day.
		//Best if we harvest the second day. (three-day+ runs)
		var cornucopia_pulling_for_daycount = cornucopias_pulling;
		//We don't compute pulling past day four, because this code isn't fast enough for that.
		var deliberately_ignoring_pulls = false;
		if (daycount > 4 && daycount * cornucopia_pulling_for_daycount > 60)
		{
			if (cornucopia_pulling_for_daycount > 0)
				deliberately_ignoring_pulls = true;
			cornucopia_pulling_for_daycount = 0;
		}
		var plans = calculatePlansForRun(path_number, class_number, daycount, cornucopia_pulling_for_daycount, !have_garden);
		
		var have_invalid_plan = false;
		var missing_seeds = {};
		for (var i = 0; i < plans.length; i++)
		{
			if (plans[i].cashewsEarned == -1)
			{
				have_invalid_plan = true;
				for (var j = 0; j < plans[i].missingSeeds.length; j++)
				{
					missing_seeds[plans[i].missingSeeds[j]] = true;
				}
				break;
			}
		}
		var missing_seeds_out = [];
		
		for (var seed in missing_seeds)
		{
			if (!missing_seeds.hasOwnProperty(seed)) continue;
			missing_seeds_out.push(seed);
		}
		
		var best_plans_overall = filterBestPlans(plans);
		
		
		var stuffing_fluffer_test = function(plan, extra)
		{
			var require_gravy_boat = false;
			if (extra.obtainGravyBoat || turkey_blaster_value < 1.0)
				require_gravy_boat = true;
			var result = calculateBlasterFlufferUseForPlan(plan, require_gravy_boat, turkey_blaster_value < 1.0);
			//Cashew tiebreaker; I've seen it happen!
			//I thought about this, but it's self-defeating, since we should be showing both already:
			//(plan.cashewsEarnedPerDay.length - result.earliestDayWithBlaster) * turkey_blaster_value * 0.00001
			//Cashews also seem to be self-defeating; see Standard Pastamancer, which has:
			/*
				Turnsaving plan:
				• 12 cashews. Harvest on days 2 and 3, use 1 cornucopia on day 2 and the rest on day 3.
				• OR 13 cashews. Harvest on days 2 and 3, use 2 cornucopias on day 2 and the rest on day 3.
				• OR 12 cashews. Harvest on days 1 and 3, use 1 cornucopia on day 2 and the rest on day 3.
				Will obtain 4 turkey blasters.
			*/
			//It should eliminate the first one, though, but the second two are important... hmm...
			// + plan.cashewsEarned * 0.000001;
			var value = result.turkeyBlasters * turkey_blaster_value + result.stuffingFluffers * 0.01 * stuffing_fluffer_value;
			if (extra.obtainGravyBoat)
				value += result.gravyBoats * stuffing_fluffer_value; //FIXME better, but essentially stuffing_fluffer_value is one to one whether we want gravy boats. for now. ooOOoOOoo
			return value;
		};
		var turnsaving_output_function = function(plan, extra)
		{
			var output = "";
			var result = calculateBlasterFlufferUseForPlan(plan, extra.includeGravyBoat || turkey_blaster_value < 1.0, turkey_blaster_value < 1.0);
			
			var list = [];
			if (result.gravyBoats > 0)
				list.push(result.gravyBoats + " gravy boat" + (result.gravyBoats > 1 ? "s" : "")); //gravy boat plural? sure, why not?
			if (result.turkeyBlasters > 0)
				list.push(result.turkeyBlasters + " turkey blaster" + (result.turkeyBlasters > 1 ? "s" : ""));
			if (result.stuffingFluffers > 0)
				list.push(result.stuffingFluffers + " stuffing fluffer" + (result.stuffingFluffers > 1 ? "s" : ""));
			
			if (list.length > 0)
				output += "Will obtain " + listJoinComponents(list, ", ", "and") + ".";
			return output;
		}
		var best_plans_for_turnsaving = filterBestPlans(plans, undefined, stuffing_fluffer_test, {obtainGravyBoat:false});
		
		var day_one_test = function(plan) { return plan.cashewsEarnedPerDay[0] >= 3; };
		var day_two_test = function(plan) { return plan.cashewsEarnedPerDay[0] + plan.cashewsEarnedPerDay[1] >= 3; };
		
		var best_plans_having_cashews_day_one = [];
		var best_plans_having_cashews_day_two = [];
		if (__setting_output_one_day_early_plans)
		{
			best_plans_having_cashews_day_one = filterBestPlans(plans, day_one_test, stuffing_fluffer_test, {obtainGravyBoat:true});
		}
		if (__setting_output_two_day_early_plans)
		{
			best_plans_having_cashews_day_two = filterBestPlans(plans, day_two_test, stuffing_fluffer_test, {obtainGravyBoat:true});
		}		
		if (daycount > min_run_length)
			output += "<hr style=\"margin-top:15px;margin-bottom:15px;\">";
		output += "<div style=\"margin-left:auto;margin-right:auto;width:90%;\">";
		output += "<div id=\"header_day_" + daycount + "\">";
		output += "<span class=\"day_header_number\">" + daycount + "</span>";
		output += "<span class=\"day_header\">-day run</span></div>";
		if (deliberately_ignoring_pulls)
			output += "<div style=\"color:red;\">Deliberately ignoring pulls because the calculation would take too long, apologies.</div>";
		else if (cornucopia_pulling_for_daycount > 8 || (path_number == 32 && cornucopia_pulling_for_daycount >= 3))
		{
			if (path_number == 32)
				output += "<div>To skip the war in Pocket Familiars, you need a minimum of 33 cashews, an average of 39 cashews, and at most 42 cashews.</div><div>Or 11 / 13 / 14 stuffing fluffers.</div>";
			else
				output += "<div>To skip the war, you need a minimum of 66 cashews, an average of 73 cashews, and at most 84 cashews.</div><div>Or 22 / 25 / 28 stuffing fluffers.</div>";
		}
		if (have_invalid_plan)
		{
			//this leads to entertaining output such as
			//Harvest on days 4 and 5, use all cornucopias on day 5.
			//So, just ignore it.
			output += "<div style=\"color:red;\">Missing seed" + (missing_seeds_out.length > 1 ? "s" : "") + " " + listJoinComponents(missing_seeds_out, ", ", "and") + ", cannot compute optimal plan." + "</div></div>";
			continue;
		}
		var should_output_turnsaving_plan = best_plans_for_turnsaving.length > 0;
		var should_output_cashews_plan = true;
		if (plansAreIdentical(best_plans_for_turnsaving, best_plans_overall))
			should_output_turnsaving_plan = false;
		if (turkey_blaster_value < 1)
			should_output_turnsaving_plan = false;
		/*if (best_plans_for_turnsaving.length == 1 && best_plans_overall.length == 1 && best_plans_for_turnsaving[0].cashewsEarned == best_plans_overall[0].cashewsEarned && false)
		{
			should_output_turnsaving_plan = true;
			should_output_cashews_plan = false;
		}*/
		
		if (best_plans_for_turnsaving.length > 0 && should_output_turnsaving_plan)
		{
			output += "<strong>Turnsaving:</strong> " + generatePlanOutput(best_plans_for_turnsaving, turnsaving_output_function, {includeGravyBoat:false});
		}
		
		if (should_output_cashews_plan)
		{
			var identifier = "Plan:";
			if (should_output_turnsaving_plan || __setting_output_one_day_early_plans || __setting_output_two_day_early_plans)
				identifier = "Most cashews:";
			if (!should_output_turnsaving_plan && (__setting_output_one_day_early_plans || __setting_output_two_day_early_plans))
				identifier = "Turnsaving/cashews:";
			if (should_output_turnsaving_plan)
				output += "<br>";
			output += "<strong>" + identifier + "</strong>";
			if (!should_output_turnsaving_plan)
				output += generatePlanOutput(best_plans_overall, turnsaving_output_function, {includeGravyBoat:false});
			else
				output += generatePlanOutput(best_plans_overall);
		}
		if (best_plans_having_cashews_day_one.length > 0 && best_plans_having_cashews_day_two.length > 0 && plansAreIdentical(best_plans_having_cashews_day_one, best_plans_having_cashews_day_two) && !plansAreIdentical(best_plans_having_cashews_day_one, best_plans_overall) && !plansAreIdentical(best_plans_having_cashews_day_one, best_plans_for_turnsaving))
			output += "<br><strong>Gravy boat by day one/two:</strong>" + generatePlanOutput(best_plans_having_cashews_day_one, turnsaving_output_function, {includeGravyBoat:true});
		else
		{
			if (best_plans_having_cashews_day_one.length > 0 && !day_one_test(best_plans_overall[0]) && !plansAreIdentical(best_plans_having_cashews_day_one, best_plans_overall) && !plansAreIdentical(best_plans_having_cashews_day_one, best_plans_for_turnsaving))
				output += "<br><strong>Gravy boat by day one:</strong> " + generatePlanOutput(best_plans_having_cashews_day_one, turnsaving_output_function, {includeGravyBoat:true});
			if (best_plans_having_cashews_day_two.length > 0 && !day_two_test(best_plans_overall[0]) && !plansAreIdentical(best_plans_having_cashews_day_two, best_plans_overall) && !plansAreIdentical(best_plans_having_cashews_day_two, best_plans_for_turnsaving))
				output += "<br><strong>Gravy boat by day two:</strong> " + generatePlanOutput(best_plans_having_cashews_day_two, turnsaving_output_function, {includeGravyBoat:true});
		}
		output += "</div>";
		
		//output += "plans = " + JSON.stringify(plans);
		//output += daycount + "-day plans: " + generatePlanOutput(plans) + "<br><br>";
	}
	
	if (!have_garden && cornucopias_pulling < 1)
		output = "<hr><h3 style=\"color:red\">Set some cornucopias to pull.</h3>";
	
	document.getElementById("output_div").innerHTML = output;
}

function rewardsStringForSeed(seed)
{
	var rewards = __thanksgarden_cornucopia_rewards[seed.toString()];
	var output_list = [];
	for (var reward in rewards)
	{
		if (!rewards.hasOwnProperty(reward)) continue;
		var amount = rewards[reward];
		if (amount <= 1)
			output_list.push(reward);
		else
			output_list.push(reward + " (" + amount + ")");
	}
	return listJoinComponents(output_list, ", ", "and");
}

function outputSeedInformation(path_id, class_id, day_id, cornucopia_number)
{
	var output = "<div style=\"margin-left:1em;\">";
	
	var seed = seedForCornucopiaUse(path_id, class_id, day_id, cornucopia_number);
	var reward_string = rewardsStringForSeed(seed);
	output += "Seed " + seed;
	
	if (reward_string == undefined || reward_string == "")
		output += " is unspaded.";
	else
		output += " gives " + rewardsStringForSeed(seed);
	
	output += "</div>";
	document.getElementById("output_2_div").innerHTML = output;
	
}

function outputSpadingData()
{
	var output = "<br>";
	var seeds = [];
	for (var seed_string in __thanksgarden_cornucopia_rewards)
	{
		if (!__thanksgarden_cornucopia_rewards.hasOwnProperty(seed_string)) continue;
		var seed = parseInt(seed_string);
		seeds.push(seed);
	}
	//amusingly, seeds.sort() would sort them as strings or something. javascript!
	seeds.sort(function(a, b) { return a - b; });
	
	var min_id = seeds[0];
	var max_id = seeds[seeds.length - 1];
	
	var missing_seeds = [];
	for (var i = min_id; i <= max_id; i++)
	{
		var lookup = i.toString();
		if (__thanksgarden_cornucopia_rewards[lookup] === undefined)
			missing_seeds.push(i);
	}
	missing_seeds.push((max_id + 1) + "+");
	if (missing_seeds.length > 0)
		output += "<div style=\"font-size:0.9em;color:grey\">Seeds needing spading: " + listJoinComponents(missing_seeds, ", ", "and") + ".</div>";
		
	document.getElementById("spading_div").innerHTML = output;
}

function outputSeedData()
{
	var output = "";
	//was {"2":179,"3":166,"4":150,"5":151}
	//var histogram = {2:0, 3:0, 4:0, 5:0};
	for (var seed_string in __thanksgarden_cornucopia_rewards)
	{
		if (!__thanksgarden_cornucopia_rewards.hasOwnProperty(seed_string)) continue;
		
		output += "<div>";
		output += seed_string + ": " + rewardsStringForSeed(seed_string);
		output += "</div>";
		//histogram[__thanksgarden_cornucopia_rewards[seed_string]["cashew"]]++;
	}
	//output += JSON.stringify(histogram);
	
	document.getElementById("output_div").innerHTML = output;
}


var __onpage_classes = [];
function writeInputs()
{
	var fields_to_monitor = ["path_selection", "class_selection", "daycount_input", "cornucopias_used_input", "cornucopia_selection", "run_length_selection"];
	var checkboxes_to_monitor = ["have_garden_checkbox"];
	
	
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
	
		output += "<div class=\"input_table_cell align_right\">Cornucopias pulling:</div>";
		output += "<div class=\"input_table_cell\"><select id=\"cornucopia_selection\" onchange=\"inputChanged();\">";
		for (var i = 0; i <= 30; i++)
		{
			output += "<option value=" + i + ">";
			output += i;
			output += "</option>";
		}
		output += "</select></div>";
	}
	if (true)
	{
		output += "<div class=\"input_table_cell align_right\">Have garden?</div>";
		output += "<div class=\"input_table_cell\">";
		output += "<input type=\"checkbox\" id=\"have_garden_checkbox\" onchange=\"inputChanged();\">";
		output += "</div>";
	}
	
	
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
	
	if (true)
	{
		output += "</div>"; //row
		//output += "</div>"; //table
		//output += "<div style=\"display:table;\">";
		output += "<div style=\"display:table-row;\">";
		output += "<div class=\"input_table_cell align_right\">Run length:</div>";
		output += "<div class=\"input_table_cell\"><select id=\"run_length_selection\" onchange=\"inputChanged();\">";
		for (var i = 1; i <= 6; i++)
		{
			output += "<option value=" + i + ">";
			output += i + " day" + (i > 1 ? "s" : "");
			output += "</option>";
		}
		output += "</select></div>";
	}
	output += "</div>";
	output += "</div>";
	
	if (true)
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




function updateOutput()
{

	var run_length = document.getElementById("run_length_selection").value;
	var min_run_length = 2;
	var max_run_length = 5;
	if (run_length != undefined)
	{
		min_run_length = run_length;
		max_run_length = run_length;
	}
	
	var path_id = document.getElementById("path_selection").value;
	var class_id = document.getElementById("class_selection").value;
	if (path_id !== undefined && path_id !== "")
		path_id = parseInt(path_id);
	if (class_id !== undefined && class_id !== "")
		class_id = parseInt(class_id);
	var cornucopias_pulling = document.getElementById("cornucopia_selection").value;
	if (cornucopias_pulling != undefined)
		cornucopias_pulling = parseInt(cornucopias_pulling);
	if (!(cornucopias_pulling >= 0 && cornucopias_pulling <= 30))
		cornucopias_pulling = 0;
		
	var day_id = document.getElementById("daycount_input").value;
	var cornucopia_number = document.getElementById("cornucopias_used_input").value;
	if (day_id !== undefined && day_id !== "")
		day_id = parseInt(day_id);
	if (cornucopia_number !== undefined && cornucopia_number !== "")
		cornucopia_number = parseInt(cornucopia_number);
	
	var have_garden = document.getElementById("have_garden_checkbox").checked;
	if (have_garden == undefined || have_garden == null)
		have_garden = true;
		
	if (path_id != -1 && class_id != -1 && path_id !== undefined && class_id !== undefined && path_id !== "" && class_id !== "")
	{
		outputRunData(path_id, class_id, cornucopias_pulling, have_garden, min_run_length, max_run_length);
		if (day_id > 0 && cornucopia_number >= 0 && day_id !== undefined && cornucopia_number !== undefined && day_id !== "" && cornucopia_number !== "")
		{
			outputSeedInformation(path_id, class_id, day_id, cornucopia_number);
		}
		else
			document.getElementById("output_2_div").innerHTML = "";
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
	//Doesn't look good, doesn't help much:
	//setupScrolling();
}


function pageLoadedSeedData()
{
	outputSeedData();
	outputSpadingData();
}