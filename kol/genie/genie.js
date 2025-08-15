
var __translation_text = [];

function pageLoaded()
{
	var sources = ["corrected.txt"];
	for (var i = 0; i < sources.length; i++)
	{
		var file_name = sources[i];
		//console.log("Requesting " + file_name);
		var request = new XMLHttpRequest();
		request.open("GET", file_name);
		request.onreadystatechange = function()
		{
			if (request.readyState != 4)
				return;
			//console.log("Received response. Incrementing " + __translation_text.length);
			__translation_text.push(request.responseText.replace(/\r\n/g,"\r"));
		};
		request.send();
	}
	//document.getElementById("genie_input").innerHTML = "Quoth Dunyazad, \"O brother mine, an thou be other than sleepy, do tell us some of thy pleasant tales,\" whereupon Shahrazad replied, \"With love and good will.\"–It hath reached me, O Master of my Bottle, that you shall obtain the one-thousand-eight-hundred-eighty-seven translation.\rQuoth Dunyazad, \"O brother mine, an thou be other than sleepy, do tell us some of thy pleasant tales,\" whereupon Shahrazad replied, \"With love and good will.\"–It hath reached me, O Master of my Bottle, that the scribe, Burton, is responsible for this translation.\r\rQuoth Dunyazad, \"O brother mine, an thou be other than sleepy, do tell us some of thy pleasant tales,\" whereupon Shahrazad replied, \"With love and good will.\"–It hath reached me, O Master of my Bottle, that you shall locate the third supplemental volume.\r\rQuoth Dunyazad, \"O brother mine, an thou be other than sleepy, do tell us some of thy pleasant tales,\" whereupon Shahrazad replied, \"With love and good will.\"–It hath reached me, O Master of my Bottle, that the archive of Gutenberg shall help you thusly.\r\rQuoth Dunyazad, \"O brother mine, an thou be other than sleepy, do tell us some of thy pleasant tales,\" whereupon Shahrazad replied, \"With love and good will.\"–It hath reached me, O Master of my Bottle, that one shall read for 519 nights and 301 moments.\r\rQuoth Dunyazad, \"O brother mine, an thou be other than sleepy, do tell us some of thy pleasant tales,\" whereupon Shahrazad replied, \"With love and good will.\"–It hath reached me, O Master of my Bottle, that one shall read for 537 nights and 209 moments.\r\rQuoth Dunyazad, \"O brother mine, an thou be other than sleepy, do tell us some of thy pleasant tales,\" whereupon Shahrazad replied, \"With love and good will.\"–It hath reached me, O Master of my Bottle, that one shall read for 588 nights and 184 moments.\r\rQuoth Dunyazad, \"O brother mine, an thou be other than sleepy, do tell us some of thy pleasant tales,\" whereupon Shahrazad replied, \"With love and good will.\"–It hath reached me, O Master of my Bottle, that one shall read for 535 nights and 292 moments.\r\rQuoth Dunyazad, \"O brother mine, an thou be other than sleepy, do tell us some of thy pleasant tales,\" whereupon Shahrazad replied, \"With love and good will.\"–It hath reached me, O Master of my Bottle, that one shall read for 546 nights and 272 moments.\r\rQuoth Dunyazad, \"O brother mine, an thou be other than sleepy, do tell us some of thy pleasant tales,\" whereupon Shahrazad replied, \"With love and good will.\"–It hath reached me, O Master of my Bottle, that this shall prove you my master intellectually.\r\rQuoth Dunyazad, \"O brother mine, an thou be other than sleepy, do tell us some of thy pleasant tales,\" whereupon Shahrazad replied, \"With love and good will.\"–It hath reached me, O Master of my Bottle, that this is a feat worthy of being memorialized";
	//document.getElementById("genie_input").innerHTML = "that one shall read for 553 nights and 284 moments that one shall read for 529 nights and 250 moments that one shall read for 562 nights and 293 moments that one shall read for 580 nights and 258 moments that one shall read for 528 nights and 300 moments";
	//document.getElementById("genie_input").innerHTML = "that one shall read for 554 nights and 269 moments that one shall read for 559 nights and 219 moments that one shall read for 568 nights and 327 moments that one shall read for 552 nights and 223 moments that one shall read for 555 nights and 241 moments that one shall read for 519 nights and 172 moments";
}


function convertNightToText(night)
{
	if (night < 100 || night >= 1000) return ""; //dunno
	var output = "When it was the ";
	
	if (night >= 100 && night < 200)
		output += "One";
	else if (night >= 200 && night < 300)
		output += "Two";
	else if (night >= 300 && night < 400)
		output += "Three";
	else if (night >= 400 && night < 500)
		output += "Four";
	else if (night >= 500 && night < 600)
		output += "Five";
	else if (night >= 600 && night < 700)
		output += "Six";
	else if (night >= 700 && night < 800)
		output += "Seven";
	else if (night >= 800 && night < 900)
		output += "Eight";
	else if (night >= 900 && night < 1000)
		output += "Nine";
	
	
	var nights_second_stage = night - Math.floor(night / 100.0) * 100;
	
	var tens_digit = Math.floor(nights_second_stage / 10.0);
	var ones_digit = nights_second_stage - tens_digit * 10;
	
	if (nights_second_stage == 0)
		output += " Hundredth";
	else
		output += " Hundred and ";
	
	if (nights_second_stage == 0)
	{
	}
	else if (nights_second_stage == 1)
		output += "First";
	else if (nights_second_stage == 2)
		output += "Second";
	else if (nights_second_stage == 3)
		output += "Third";
	else if (nights_second_stage == 4)
		output += "Fourth";
	else if (nights_second_stage == 5)
		output += "Fifth";
	else if (nights_second_stage == 6)
		output += "Sixth";
	else if (nights_second_stage == 7)
		output += "Seventh";
	else if (nights_second_stage == 8)
		output += "Eighth";
	else if (nights_second_stage == 9)
		output += "Ninth";
	else if (nights_second_stage == 10)
		output += "Tenth";
	else if (nights_second_stage == 11)
		output += "Eleventh";
	else if (nights_second_stage == 12)
		output += "Twelfth";
	else if (nights_second_stage == 13)
		output += "Thirteenth";
	else if (nights_second_stage == 14)
		output += "Fourteenth";
	else if (nights_second_stage == 15)
		output += "Fifteenth";
	else if (nights_second_stage == 16)
		output += "Sixteenth";
	else if (nights_second_stage == 17)
		output += "Seventeenth";
	else if (nights_second_stage == 18)
		output += "Eighteenth";
	else if (nights_second_stage == 19)
		output += "Nineteenth";
	else if (nights_second_stage == 20)
		output += "Twentieth";
	else if (nights_second_stage == 30)
		output += "Thirtieth";
	else if (nights_second_stage == 40)
		output += "Fortieth";
	else if (nights_second_stage == 50)
		output += "Fiftieth";
	else if (nights_second_stage == 60)
		output += "Sixtieth";
	else if (nights_second_stage == 70)
		output += "Seventieth";
	else if (nights_second_stage == 80)
		output += "Eightieth";
	else if (nights_second_stage == 90)
		output += "Ninetieth";
	else
	{
		if (tens_digit == 2)
			output += "Twenty";
		else if (tens_digit == 3)
			output += "Thirty";
		else if (tens_digit == 4)
			output += "Forty";
		else if (tens_digit == 5)
			output += "Fifty";
		else if (tens_digit == 6)
			output += "Sixty";
		else if (tens_digit == 7)
			output += "Seventy";
		else if (tens_digit == 8)
			output += "Eighty";
		else if (tens_digit == 9)
			output += "Ninety";
		output += "-";
		if (ones_digit == 1)
			output += "first";
		else if (ones_digit == 2)
			output += "second";
		else if (ones_digit == 3)
			output += "third";
		else if (ones_digit == 4)
			output += "fourth";
		else if (ones_digit == 5)
			output += "fifth";
		else if (ones_digit == 6)
			output += "sixth";
		else if (ones_digit == 7)
			output += "seventh";
		else if (ones_digit == 8)
			output += "eighth";
		else if (ones_digit == 9)
			output += "ninth";
		
	}
	output += " Night,";
	//console.log(night + ": " + output);
	return output;
}

function runTests()
{
	for (var night = 497; night <= 592; night++)
	{
		var night_text = convertNightToText(night);
		
		var found = false;
		for (var j = 0; j < __translation_text.length; j++)
		{
			var text = __translation_text[j];
			var index = text.indexOf(night_text);
			if (index < 0) continue;
			found = true;
		}
		if (!found)
			console.log("Cannot find night " + night + " with lookup " + night_text);
	}
}

function genieInputKeyUp()
{
	//runTests();
	
	//Parse text:
	var output = "";
	var input = document.getElementById("genie_input").value;
	
	//that one shall read for 580 nights and 258 moments
	//var regex = /that one shall read for ([0-9]*) nights and ([0-9]*) moments/g;
	var regex = /[[t_][h_][a_][t_] [o_][n_][e_] [s_][h_][a_][l_][l_] [r_][e_][a_][d_] [f_][o_][r_] ([0-9]*) [n_][i_][g_][h_][t_][s_] [a_][n_][d_] ([0-9]*) [m_][o_][m_][e_][n_][t_][s_]/g;
	
	var entries = [];
	
	//Parse:
	while (true)
	{
		var entry = regex.exec(input);
		if (entry == undefined)
			break;
		
		var nights = parseInt(entry[1]);
		var moments = parseInt(entry[2]);
		
		entries.push([nights, moments]);
		//output += "<br>" + entry;
	}
	//output += entries.join("|");
	
	
	//output += "<br>Have " + __translation_text.length + " files loaded.";
	
	var word = "";
	for (var i = 0; i < entries.length; i++)
	{
		//output += "<br>";
		var nights = entries[i][0];
		var moments = entries[i][1];
		
		//Look up night:
		var night_text = convertNightToText(nights);
		//
		if (night_text == "")
		{
			output += "Warning: unable to support night " + nights;
			continue;
		}
		//Find night:
		var found = false;
		for (var j = 0; j < __translation_text.length; j++)
		{
			var text = __translation_text[j];
			var index = text.indexOf(night_text);
			if (index < 0) continue;
			index = text.indexOf("Quoth Dunyazad", index);
			found = true;
			//console.log("? " + text[index] + text[index + 1] + text[index + 2] + text[index + 3] + text[index + 4] + text[index + 5] + text[index + 6] + text[index + 7] + text[index + 8] + text[index + 9] + text[index + 10]);
			//Look up letter:
			var letter_index = index + moments; //+night_text.length
			
			if (false)
			{
				output += "<br>";
				output += "<br>" + nights + " nights, " + moments + " moments";
				output += "<br>night_text(" + nights + ") = \"" + night_text + "\"";
				output += "<br>index = " + index + ", letter_index = " + letter_index + ", delta = " + (letter_index - index);
				output += "<br>Which is: ";
				for (var k = 0; k < 20; k++)
					output += text[letter_index + k];
				output += "<br>Alternate: \"";
				for (var k = 0; k < 250; k++)
				{
					var c = text[index + k];
					if (c == "\r")
						c = "*<br>";
					if (c == "\n")
						c = "•<br>";
					output += c;
				}
				output += "\"";
			}
			var letter = text[letter_index];
			var char_code = letter.charCodeAt(0);
			//if (!(char_code >= 65 && char_code <= 90) || (char_code >= 97 && char_code <= 122))
			if (!((char_code >= "a".charCodeAt(0) && char_code <= "z".charCodeAt(0)) || (char_code >= "A".charCodeAt(0) && char_code <= "Z".charCodeAt(0))))
				letter = "?";
			
			word += letter;
			break;
		}
		if (!found)
			output += "<br>Warning: Unable to find a letter on night " + nights + " with lookup " + night_text;
		
	}
	if (word.length > 0)
	{
		word = word.toLowerCase();
		var capitalised_word = word.slice(0);
		capitalised_word = capitalised_word[0].toUpperCase() + capitalised_word.substr(1);
		output += "<br>Wish for: \"trophy " + word + "\" or \"trophy " + capitalised_word + "\"";
	}
	
	document.getElementById("genie_output").innerHTML = output;
}