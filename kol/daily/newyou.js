var __newyou_data = {0:"",
1:"",
2:"Be a Mind Master",
3:"Keep Free Hate in your Heart",
4:"Keep Free Hate in your Heart",
5:"Be Superficially interested",
6:"Keep Free Hate in your Heart",
7:"",
8:"Be Superficially interested",
9:"Adapt to Change Eventually",
10:"Be Superficially interested",
11:"",
12:"",
13:"",
14:"",
15:"",
16:"",
17:"",
18:"",
19:"Always be Collecting",
20:"Be Superficially interested",
21:"Be a Mind Master",
22:"Be Superficially interested",
23:"Be a Mind Master",
24:"Keep Free Hate in your Heart",
25:"Be Superficially interested",
26:"Always be Collecting",
27:"Keep Free Hate in your Heart",
28:"Keep Free Hate in your Heart",
29:"Be Superficially interested",
30:"Be Superficially interested",
31:"Be a Mind Master",
32:"Think Win-Lose",
33:"Be Superficially interested",
34:"Adapt to Change Eventually",
35:"Be Superficially interested",
36:"Always be Collecting",
37:"Keep Free Hate in your Heart",
38:"Think Win-Lose",
39:"Think Win-Lose",
40:"Adapt to Change Eventually",
41:"Keep Free Hate in your Heart",
42:"Be Superficially interested",
43:"Work For Hours a Week",
44:"Adapt to Change Eventually",
45:"",
46:"",
47:"",
48:"",
49:"",
50:"",
51:"",
52:"",
53:"Keep Free Hate in your Heart",
54:"Always be Collecting",
55:"Work For Hours a Week",
56:"Be a Mind Master",
57:"Work For Hours a Week",
58:"Work For Hours a Week",
59:"Keep Free Hate in your Heart",
60:"Keep Free Hate in your Heart",
61:"Keep Free Hate in your Heart",
62:"Adapt to Change Eventually",
63:"Always be Collecting",
64:"Keep Free Hate in your Heart",
65:"",
66:"",
67:"",
68:"",
69:"",
70:""};

var __newyou_description_lookup = {
"Adapt to Change Eventually":"+4 stats/fight, +50% init, or change monster to something else",
"Always be Collecting":"+50% item, +100% meat, or duplicate monster",
"Be a Mind Master":"+100% spell damage, 15 MP/fight, or free run/banish for 80 adventures",
"Be Superficially interested":"+/- combat, or weak olfaction",
"Keep Free Hate in your Heart":"+30 ML, or gives three PVP fights",
"Think Win-Lose":"+50% all stats, or instakill",
"Work For Hours a Week":"+5 familiar weight, or meat from monster strength"
};

function DailiesGenerateNewYou(path_id, class_id, day_number)
{
	var output_string = "";
	
	var id = path_id + class_id + day_number;
	
	output_string = __newyou_data[id];
	if (output_string == undefined || output_string.length == 0)
		return [];
		
	var description = __newyou_description_lookup[output_string];
	if (description != undefined && description.length > 0)
		output_string += " <span style=\"color:#555555;font-size:0.9em;\">(" + description + ")</span>";
		
	return ["New-You", output_string];
}
__dailies_generation_functions.push(DailiesGenerateNewYou);