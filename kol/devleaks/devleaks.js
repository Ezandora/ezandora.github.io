function randomi(min, max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateProceduralWords(base_list, number_to_generate)
{
	//Pre-process word data:
	var processed = [];
	var maximum_word_count = 0;
	var word_histogram = [];
	var words_by_index = [];
	//console.log("base_list = " + base_list);
	for (var i = 0; i < base_list.length; i++)
	{
		words = base_list[i].split(" ");
		processed.push(words);
		for (var j = 0; j < words.length; j++)
		{
			while (words_by_index.length < j + 1)
			{
				words_by_index.push([]);
			}
			words_by_index[j].push(words[j]);
		}
		if (words.length > maximum_word_count)
			maximum_word_count = words.length;
		while (word_histogram.length < maximum_word_count + 1)
		{
			word_histogram.push(0);
		}
		word_histogram[words.length] += 1;
	}
	
	//console.log("word_histogram = " + word_histogram);
	var cdf_total = 0;
	var word_cdf = [];
	for (var i = 0; i < word_histogram.length; i++)
	{
		cdf_total += word_histogram[i];
		word_cdf.push(cdf_total);
	}
	
	//console.log("word_cdf = " + word_cdf);
	//console.log("words_by_index = " + words_by_index);
	result = [];
	for (var i = 0; i < number_to_generate; i++)
	{
		//Pick a word count using the histogram:
		var cdf_picking_index = randomi(word_cdf[2], word_cdf[word_cdf.length - 1]);
		
		var word_count = 2;
		//console.log("cdf_picking_index = " + cdf_picking_index);
		for (var j = 2; j < word_cdf.length; j++)
		{
			if (j == word_cdf.length - 1)
			{
				word_count = j;
				break;
			}
			//console.log(j + ": " + word_cdf[j] + ", " + cdf_picking_index);
			if (word_cdf[j] <= cdf_picking_index)
			{
				if (j > 0 && word_cdf[j] == word_cdf[j - 1])
				{
					if (randomi(0, 1) == 0)
					{
						continue;
					}
				}	
				word_count = j;
			}
			else
				break;
		}
		
		//var word_count = randomi(2, maximum_word_count);
		
		var entry = [];
		var last_word = "";
		for (var word_index = 0; word_index < word_count; word_index++)
		{
			if (word_index > maximum_word_count + 1)
				break;
			if (word_index + 1 > words_by_index.length)
				break;
			var word = "";
			var breakout = 1000;
			while (word == "" && breakout > 0)
			{
				breakout--;
				//console.log("words_by_index.length = " + words_by_index.length + ", word_index = " + word_index + ", word_count = " + word_count);
				var picked_index = randomi(0, words_by_index[word_index].length - 1);
				word = words_by_index[word_index][picked_index];
				
				/*var picked_index = randomi(0, processed.length - 1);
				if (processed[picked_index].length < word_index + 1)
					continue;
				word = processed[picked_index][word_index];*/
				
				if ((last_word.toLowerCase() == "of" || last_word.toLowerCase() == "the" || last_word.toLowerCase() == "a") && (word == "of" || word == "to" || word == "on" || word == "with" || word == "for"))
					word = "";
				if (last_word.toLowerCase() == word.toLowerCase() && word.toLowerCase() == "the")
					word = "";
				if (word == "For" && word_index == word_count - 1)
				{
					if (randomi(0, 4) != 0)
					{
						word = "";
					}
				}
			}
			if (word_index > 0 && entry[0][0].toLowerCase() == entry[0][0] && word != "")
			{
				word = word.toLowerCase();
			}
			if (word != "")
				entry.push(word);

			if (word_index == word_count - 1)
			{
				if (word == "of" || word == "For" || word == "and" || word == "the" || word == "to" || word == "A" || word == "II:" || word == "'n'" || word == "S." || word == "E." || word == "I." || word == "1st" || word == "charter:" || word == "First" || word == "o'" || word == "&" || word == "on" || word == "The" || word == "Divine" || word == "only" || word == "Artistic" || word == "protonic" || word == "in" || word == "for" || word == "P." || word == "temporal" || word == "a" || word == "vol." || word == "no." || word == "ch." || word == "de" || word == "el" || word == "with" || word == "/" || word == "n" || word == "from" || word == "Mr.")
				{
					word_count++;
				}
				else if (word.endsWith != undefined && (word.endsWith("'s") || word.endsWith(":") || word.endsWith(",")))
				{
					word_count++;
				}
			}
			last_word = word;
		}
		var combined = entry.join(" ");
		if (combined.includes != undefined)
		{
			if (combined.includes("(") && !combined.includes(")"))
				combined += ")";
			if (!combined.includes("(") && combined.includes(")"))
				combined = combined.replace(")", "");
		}
		result.push(combined);
	}
	return result;
}

function formatUpcomingList(list)
{
	var out = "";
	for (var i = 0; i < list.length; i++)
	{
		var entry = list[i];
		
		out += "<div style=\"";
		if (i % 2 == 0)
			out += "background:#EEEEEE;background: linear-gradient(to right, #eeeeee 0%,#ffffff 100%);";
		out += "width:100%;display:inline-block;padding:1px;\">" + entry + "</div>";
		/*if (i > 0)
			out += "<br>";
		if (i % 2 == 0)
			out += "<div style=\"background:#EEEEEE;width:100%;display:inline-block;padding:2px;\">" + entry + "</div>";
		else
			out += entry;*/
	}
	return out;
}
function generate()
{
	paths = generateProceduralWords(__paths, 11);
	iotms = generateProceduralWords(__iotms, 23 + 5);
	items = generateProceduralWords(__items, 23 + 5 + 11 + 2);
	
	//this does nothing
	//items.sort(function(a, b) { a.length - b.length; });
	
	var legitimate_dev_name = "";
	var dev_length = randomi(4, 11);
	var dev_index = -1;
	var last_dev_index_set_i = -1;
	for (i = 0; i < dev_length; i++)
	{
		var breakout = 1000;
		if (dev_index != -1 && __devs[dev_index].length < i + 1)
			dev_index = -1;
		while (dev_index == -1 && breakout > 0)
		{
			dev_index = randomi(0, __devs.length - 1);
			last_dev_index_set_i = i;
			if (__devs[dev_index].length < i + 1)
				dev_index = -1;
		}
		if (dev_index != -1)
		{
			var c = __devs[dev_index][i];
			if (__devs[dev_index] == "YOjImBoS Law")
			{
				if (randomi(0, 1) == 0)
					c = c.toUpperCase();
				else
					c = c.toLowerCase();
			}
			legitimate_dev_name += c;
		}
		//if (i - last_dev_index_set_i >= 2 || randomi(0, 4) == 0)
		if (i - last_dev_index_set_i >= 4 || randomi(0, dev_length - 1) == 0)
			dev_index = -1;
		if (i == dev_length - 1 && legitimate_dev_name[i] == " ")
			dev_length++;
	}
	
	var html = "<div class=\"r_centre\">Spoiled by " + legitimate_dev_name + "</div><br>";
	html += "<div style=\"display:table;width:100%;\">";
	html += "<div style=\"display:table-row;\">";
	html += "<div style=\"display:table-cell;width:60%;\">";
	html += "<strong style=\"font-size:1.2em\">Upcoming challenge paths:</strong>";
	html += "<div style=\"margin-left:10px;\">" + formatUpcomingList(paths) + "</div>";
	html += "<br>"
	html += "<strong style=\"font-size:1.2em\">Upcoming IOTMs:</strong>";
	html += "<div style=\"margin-left:10px;\">" + formatUpcomingList(iotms) + "</div>";
	
	html += "</div>"
	html += "<div style=\"display:table-cell;width:40%;\">";
	//html += "<span style=\"float:right;\">";
	html += "<strong style=\"font-size:1.2em\">Upcoming items:</strong>";
	html += "<div style=\"margin-left:10px;\">" + formatUpcomingList(items) + "</div>";
	//html += "</span>"
	//html += "<div style=\"float:none;\"></div>";
	document.getElementById("output_div").innerHTML = html;
	html += "</div>"
	html += "</div>"
	html += "</div>"
}

function pageLoaded()
{
	document.onkeyup = function(e) { if (e.key == " ") generate(); }
	generate();
}