let __svg_namespace = "http://www.w3.org/2000/svg";


function drawTraversal(x, y, radius, svg_element, point_coordinates, traversal)
{
	for (let i = 0; i < point_coordinates.length; i += 1)
	{
		let point_element = document.createElementNS(__svg_namespace, "circle");
		//console.log("point_element = " + point_element + ", svg_element = " + svg_element);
		let i_coordinate = point_coordinates[i];
		point_element.setAttribute("cx", i_coordinate[0] * radius + x);
		point_element.setAttribute("cy", i_coordinate[1] * radius + y);
		point_element.setAttribute("r", 5);
		point_element.setAttribute("fill", "black");
//		point.stroke = "black";
//		point.strokeWidth = 2;
		svg_element.appendChild(point_element);
	}
	let previous_index = -1;
	if (traversal.length > 0)
		previous_index = traversal[0];
	for (let i = 1; i < traversal.length; i += 1)
	{
		//draw line from previous index to current index:
		if (previous_index >= point_coordinates.length) break;
		let current_index = traversal[i];
		if (current_index >= point_coordinates.length) continue;
		let line_element = document.createElementNS(__svg_namespace, "line");
		line_element.setAttribute("x1", point_coordinates[previous_index][0] * radius + x);
		line_element.setAttribute("y1", point_coordinates[previous_index][1] * radius + y);
		line_element.setAttribute("x2", point_coordinates[current_index][0] * radius + x);
		line_element.setAttribute("y2", point_coordinates[current_index][1] * radius + y);
		line_element.setAttribute("stroke", "black");
		line_element.setAttribute("stroke-width", 2);
		svg_element.appendChild(line_element);

		previous_index = current_index;
	}
}

function drawTraversalEncapsulated(parent_element, radius, point_coordinates, traversal)
{
	let svg_element = document.createElementNS(__svg_namespace, "svg");
	svg_element.setAttribute("width", radius * 2.0 + 10.0);
	svg_element.setAttribute("height", radius * 2.0 + 10.0);
	svg_element.setAttribute("class", "traversal")
	parent_element.appendChild(svg_element);

	drawTraversal(radius + 5, radius + 5, radius, svg_element, point_coordinates, traversal);

}

function checkArrayEquality(a, b)
{
	if (a.length != b.length) return;
	return a.every((value, index) => value === b[index]);
}

function encodeTraversalIntoNumber(traversal, node_count)
{
	let result = 0;
	let multiplication = 1;
	for (let i = 0; i < traversal.length; i += 1)
	{
		result += traversal[i] * multiplication;
		multiplication *= node_count;
	}
	return result;
}

function encodeSpecialReverseTraversalIntoNumber(traversal, node_count)
{
	let result = 0;
	let multiplication = 1;
	for (let i = 0; i < traversal.length; i += 1)
	{
		let ii = i;
		if (i > 0 && i < traversal.length - 1)
			ii = (traversal.length - 3) - (i - 1) + 1;
		//if (node_count < 6)
			//console.log("i = " + i + ", ii = " + ii + ", traversal.length = " + traversal.length + ", node_count = " + node_count)
		result += traversal[ii] * multiplication;
		multiplication *= node_count;
	}
	return result;
}

function calculateAllTraversalRecurse(node_count, all_traversal, building_traversal, previously_present_map, all_traversal_number_map)
{
	if (building_traversal.length === node_count)
	{
		let reject = false;
		if (true && building_traversal.length > 0)
		{
			//Check if the reverse is already present:
			building_traversal.push(building_traversal[0]);
			let reverse_traversal_number_alternate_method = encodeSpecialReverseTraversalIntoNumber(building_traversal, node_count);
			building_traversal.pop();

			let reject_according_to_number_method = all_traversal_number_map.has(reverse_traversal_number_alternate_method)

			//(this is obviously not performant but correct)
			/*reverse_traversal = building_traversal.slice(1).toReversed();
			reverse_traversal.unshift(building_traversal[0]);
			reverse_traversal.push(building_traversal[0]);
			//if (node_count === 3)
				//console.log("building_traversal = " + building_traversal + ", reverse_traversal = " + reverse_traversal);
			let reverse_traversal_number = encodeTraversalIntoNumber(reverse_traversal, node_count);
			if (reverse_traversal_number !== reverse_traversal_number_alternate_method)
				console.log("reverse_traversal_number = " + reverse_traversal_number + ", reverse_traversal_number_alternate_method = " + reverse_traversal_number_alternate_method);
			let reject_according_to_number_method = all_traversal_number_map.has(reverse_traversal_number);*/


			//if node_count * node_count < 2^53, we can encode the traversal it into a number? maybe?
			if (node_count < 67108864) //2^26, should be 2^26.5 but whatever
			{
				reject = reject_according_to_number_method;
			}
			else
			{
				reverse_traversal = building_traversal.slice(1).toReversed();
				reverse_traversal.unshift(building_traversal[0]);
				reverse_traversal.push(building_traversal[0]);
				for (let traversal of all_traversal)
				{
					if (checkArrayEquality(traversal, reverse_traversal))
					{
						reject = true;
						break;
					}
				}
				//if (reject_according_to_number_method !== reject)
					//console.log("reject_according_to_number_method = " + reject_according_to_number_method + ", reject = " + reject + ", building_traversal = " + building_traversal + " (" + encodeTraversalIntoNumber(building_traversal, node_count) + ")" + ", reverse_traversal = " + reverse_traversal + " (" + encodeTraversalIntoNumber(reverse_traversal, node_count) + ")");
			}
		}
		if (!reject)
		{
			//if (node_count === 3)
				//console.log("adding " + building_traversal);
			building_traversal.push(building_traversal[0]);
			all_traversal.push([...building_traversal]);
			building_traversal.pop();
			all_traversal_number_map.set(encodeTraversalIntoNumber(building_traversal, node_count));
		}
		return;
	}
	for (let i = 0; i < node_count; i += 1)
	{
		if (building_traversal.length === 0 && i > 0) continue; //we always start from the same person
		if (previously_present_map.has(i)) continue;
		//Instead of creating and destroying a bunch of clones and maps, just push/pop on the same:
		//new_traversal = [...building_traversal];
		//new_traversal.push(i);
		building_traversal.push(i);
		//let new_present_map = new Map(previously_present_map)
		//new_present_map.set(i, true);
		previously_present_map.set(i, true);
		calculateAllTraversalRecurse(node_count, all_traversal, building_traversal, previously_present_map, all_traversal_number_map);
		previously_present_map.delete(i);
		building_traversal.pop();
	}
}

function calculateAllTraversal(node_count)
{
	if (node_count < 2) return [];
	let all_traversal = [];
	let previously_present_map = new Map();
	let all_traversal_number_map = new Map();
	calculateAllTraversalRecurse(node_count, all_traversal, [], previously_present_map, all_traversal_number_map);

	return all_traversal;
}

function pluralize(number, singular, plural)
{
	if (number === 1)
		return singular;
	return plural;
}

function redoLayout()
{

	//let svg_element = document.getElementById("drawingSVG");
	//let svg_element = document.createElementNS(__svg_namespace, "svg");
	//svg_element.style.width = "100%";
	//svg_element.style.height = "100%";
	//svg_element.setAttribute("width", "100vw");
	//svg_element.setAttribute("height", "100vh");
	//document.body.appendChild(svg_element);

	document.getElementById("main_container")?.remove();
	let main_container = document.createElement("div");
	main_container.classList.add("main_container");
	main_container.id = "main_container";
	document.body.appendChild(main_container);
	let maximum_points = Number(document.getElementById("node_count_input").innerHTML);
	let radius = 40.0;
	for (let points = 1; points <= maximum_points; points += 1)
	{
		let point_coordinates = [];
		for (let i = 0; i < points; i += 1)
		{
			let angle_degrees = (360.0 / points) * i + 180.0;
			let angle_radians = angle_degrees * (Math.PI / 180.0);
			let ix = 1.0 * Math.cos(angle_radians);
			let iy = 1.0 * Math.sin(angle_radians);
			point_coordinates.push([ix, iy]);
		}
		let all_traversal = calculateAllTraversal(point_coordinates.length);

		let containing_element = document.createElement("div");
		containing_element.classList.add("traversal_container");
		let hue = (points - 1) * 360.0 / maximum_points;
		containing_element.style.backgroundColor = "hsl(" + String(hue) + ", 75%, 80%)";
		containing_element.style.flex = "1 1 25%";

		let should_display = all_traversal.length < 10000;
		if (should_display)
		{
			//this is not correct but close enough:
			let minimum_width = ((radius * 2.0 + 20.0) * all_traversal.length);
			if (all_traversal.length > 3)
				minimum_width /= 2.0;
			minimum_width += 20.0; //padding
			containing_element.style.flex = "1 1 " + minimum_width + "px";
		}
		main_container.appendChild(containing_element);

		let title = document.createElement("div");
		title.classList.add("traversal_containiner_title");
		title.innerHTML = String(points) + " " + pluralize(points, "node", "nodes") + " " + pluralize(points, "has", "have") + " " + String(all_traversal.length) + " " + pluralize(all_traversal.length, "traversal", "traversals") + (should_display ? ":" : " (not displayed)");
		containing_element.appendChild(title);

		let subcontaining_element = document.createElement("div");
		containing_element.appendChild(subcontaining_element);
		subcontaining_element.classList.add("traversal_subcontainer");
		if (all_traversal.length === 0)
			drawTraversalEncapsulated(subcontaining_element, radius, point_coordinates, []);
		else if (should_display)
		{
			for (let traversal of all_traversal)
			{
			//drawTraversal(x + 50.0, y + 50.0, 50.0, svg_element, point_coordinates, [0, 1]);
				drawTraversalEncapsulated(subcontaining_element, radius, point_coordinates, traversal);
			}
		}
	}
}

function ContentSetup()
{
	redoLayout();
}

function modifyNodeCountByAmount(amount)
{
	let node_count_input_element = document.getElementById("node_count_input");
	let old_value = Number(node_count_input_element.innerHTML)
	let new_value = old_value + amount;
	if (new_value > 11) new_value = 11;
	if (new_value < 1) new_value = 1;
	if (new_value !== old_value)
	{
		node_count_input_element.innerHTML = new_value;
		redoLayout();
	}
}

function nodeCountInputPlusButtonClicked()
{
	modifyNodeCountByAmount(1);
}

function nodeCountInputMinusButtonClicked()
{
	modifyNodeCountByAmount(-1);
}