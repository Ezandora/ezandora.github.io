let __svg_namespace = "http://www.w3.org/2000/svg";


function formatOldPixelAsNewEm(pixels)
{
	return String(pixels / 22.5) + "em";
}

function drawTraversal(x, y, radius, should_output_labels, svg_element, point_coordinates, traversal)
{
	for (let i = 0; i < point_coordinates.length; i += 1)
	{
		let point_element = document.createElementNS(__svg_namespace, "circle");
		//console.log("point_element = " + point_element + ", svg_element = " + svg_element);
		let i_coordinate = point_coordinates[i];
		point_element.setAttribute("cx", formatOldPixelAsNewEm(i_coordinate[0] * radius + x));
		point_element.setAttribute("cy", formatOldPixelAsNewEm(i_coordinate[1] * radius + y));
		point_element.setAttribute("r", formatOldPixelAsNewEm(radius / 40.0 * 5.0));
		point_element.setAttribute("fill", "currentColor");
//		point.stroke = "black";
//		point.strokeWidth = 2;
		svg_element.appendChild(point_element);

		if (should_output_labels)
		{
			let text_label = document.createElementNS(__svg_namespace, "text");
			text_label.setAttribute("font-size", formatOldPixelAsNewEm(22.5)); //1em
			let ix = x;
			let iy = y;
			if (point_coordinates.length === 1)
			{
				ix += radius / 40.0 * 15.0;
			}
			text_label.setAttribute("x", formatOldPixelAsNewEm(i_coordinate[0] * (20.0 + radius) + ix - 7.5));
			text_label.setAttribute("y", formatOldPixelAsNewEm(i_coordinate[1] * (20.0 + radius) + iy));
			text_label.setAttribute("fill", "currentColor");
			text_label.textContent = i;
			text_label.setAttribute("dominant-baseline", "middle");
			text_label.setAttribute("text-anchor", "start");

			svg_element.appendChild(text_label);
		}
	}
	if (traversal.length > 0)
	{
		let previous_index = traversal[0];
		for (let i = 1; i < traversal.length; i += 1)
		{
			//draw line from previous index to current index:
			if (previous_index >= point_coordinates.length) break;
			let current_index = traversal[i];
			if (current_index >= point_coordinates.length) continue;
			let line_element = document.createElementNS(__svg_namespace, "line");
			line_element.setAttribute("x1", formatOldPixelAsNewEm(point_coordinates[previous_index][0] * radius + x));
			line_element.setAttribute("y1", formatOldPixelAsNewEm(point_coordinates[previous_index][1] * radius + y));
			line_element.setAttribute("x2", formatOldPixelAsNewEm(point_coordinates[current_index][0] * radius + x));
			line_element.setAttribute("y2", formatOldPixelAsNewEm(point_coordinates[current_index][1] * radius + y));
			line_element.setAttribute("stroke", "currentColor");
			line_element.setAttribute("stroke-width", formatOldPixelAsNewEm(radius / 40.0 * 2.0));
			svg_element.appendChild(line_element);

			previous_index = current_index;
		}
	}
}

function drawTraversalCalculateSVGSizeInPixels(radius, should_output_labels)
{
	let svg_size = radius * 2.0 + (radius / 40.0 * 5.0 + 1.0) * 2.0; //the point radius plus a pixel's padding, on both sides
	if (should_output_labels)
		svg_size += (22.5 + 1.0 + 3.0) * 2.0;
	return svg_size;
}

function drawTraversalEncapsulated(parent_element, radius, should_output_labels, point_coordinates, traversal, unique_rotation)
{
	let svg_element = document.createElementNS(__svg_namespace, "svg");
	let svg_size = drawTraversalCalculateSVGSizeInPixels(radius, should_output_labels);

	svg_element.setAttribute("width", formatOldPixelAsNewEm(svg_size));
	svg_element.setAttribute("height", formatOldPixelAsNewEm(svg_size));
	svg_element.classList.add("traversal");
	parent_element.appendChild(svg_element);

	if (false)
	{
		//raster a background element for coordinate debugging
		let background_debug_element = document.createElementNS(__svg_namespace, "rect");
		background_debug_element.setAttribute("width", "100%");
		background_debug_element.setAttribute("height", "100%");
		background_debug_element.setAttribute("fill", "hsl(214, 99%, 31%)");
		svg_element.appendChild(background_debug_element);
	}

	let coordinate_correction = (svg_size - radius * 2.0) * 0.5; //move element to exact center


	drawTraversal(radius + coordinate_correction, radius + coordinate_correction, radius, should_output_labels, svg_element, point_coordinates, traversal);

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

function encodeRotatedTraversalIntoNumber(traversal, node_count, rotation, shift, reversal_type)
{
	//old reversal type: 0 - no reversal 1 - reverse before shift 2 - reverse after shift
	//new is just 0 - no reversal, 1 - reverse after shift
	let result = 0;
	let multiplication = 1;
	for (let i = 0; i < traversal.length; i += 1)
	{
		//let ii = (i + rotation) % traversal.length;

		//if (node_count < 6)
			//console.log("i = " + i + ", ii = " + ii + ", traversal.length = " + traversal.length + ", node_count = " + node_count + ", rotation = " + rotation)
		//result += traversal[ii] * multiplication;

		let ii = i;
		/*if (reversal_type == 1 && false)
			ii = (traversal.length - 1) - ii;*/
		ii = (ii + shift) % traversal.length;
		if (reversal_type === 1)
			ii = (traversal.length - 1) - ii;
		result += ((traversal[ii] + rotation) % node_count) * multiplication;
		multiplication *= node_count;
	}
	return result;
}

function encodeReverseTraversalIntoNumber(traversal, node_count)
{
	let result = 0;
	let multiplication = 1;
	for (let i = 0; i < traversal.length; i += 1)
	{
		let ii = i;
		//old special method:
		/*if (i > 0 && i < traversal.length - 1)
		{
			ii = (traversal.length - 3) - (i - 1) + 1;
		}*/
		ii = (traversal.length - 1) - i;
		//if (node_count < 6)
			//console.log("i = " + i + ", ii = " + ii + ", traversal.length = " + traversal.length + ", node_count = " + node_count)
		result += traversal[ii] * multiplication;
		multiplication *= node_count;
	}
	return result;
}

function calculateAllTraversalRecurse(node_count, all_traversal, unique_rotation_traversals, building_traversal, previously_present_map, all_traversal_number_map, all_traversal_number_map_without_last_element)
{
	if (building_traversal.length === node_count)
	{
		let reject = false;
		if (true && building_traversal.length > 0)
		{
			//Check if the reverse is already present:
			building_traversal.push(building_traversal[0]);
			let reverse_traversal_number_alternate_method = encodeReverseTraversalIntoNumber(building_traversal, node_count);
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
			//building_traversal.pop();
			all_traversal_number_map.set(encodeTraversalIntoNumber(building_traversal, node_count));
			building_traversal.pop();


			let rotation_is_unique = true;
			//This is incorrect, but what is correct?
			//Check shifted rotations with the number map:
			//building_traversal.push(building_traversal[0]);
			for (let rotation = 1; rotation < node_count; rotation += 1)
			{
				for (let shift = 0; shift < node_count; shift += 1)
				{
					for (let reversal_type = 0; reversal_type <= 1; reversal_type += 1)
					{
						let rotated_traversal_encoded = encodeRotatedTraversalIntoNumber(building_traversal, node_count, rotation, shift, reversal_type);
						if (all_traversal_number_map_without_last_element.has(rotated_traversal_encoded))
						{
							//console.log("non-unique at " + rotation);
							rotation_is_unique = false;
							break;
						}
					}
					if (!rotation_is_unique) break;
				}
				if (!rotation_is_unique) break;
			}
			all_traversal_number_map_without_last_element.set(encodeTraversalIntoNumber(building_traversal, node_count));
			//building_traversal.pop();

			//building_traversal.pop();

			if (rotation_is_unique)
			{
				unique_rotation_traversals.set(all_traversal.length - 1, true);
			}
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
		calculateAllTraversalRecurse(node_count, all_traversal, unique_rotation_traversals, building_traversal, previously_present_map, all_traversal_number_map, all_traversal_number_map_without_last_element);
		previously_present_map.delete(i);
		building_traversal.pop();
	}
}

function calculateAllTraversal(node_count)
{
	let all_traversal = [];
	let unique_rotation_traversals = new Map();
	if (node_count < 2)
	{
		if (node_count > 0)
			unique_rotation_traversals.set(0, true);
		return [all_traversal, unique_rotation_traversals];
	}
	let previously_present_map = new Map();
	let all_traversal_number_map = new Map();
	let all_traversal_number_map_without_last_element = new Map();
	calculateAllTraversalRecurse(node_count, all_traversal, unique_rotation_traversals, [], previously_present_map, all_traversal_number_map, all_traversal_number_map_without_last_element);

	//console.log("unique_rotation_traversals = " + JSON.stringify([...unique_rotation_traversals]))
	return [all_traversal, unique_rotation_traversals];
}

function pluralize(number, singular, plural)
{
	if (number === 1)
		return singular;
	return plural;
}

function redoLayout()
{
	document.getElementById("main_container")?.remove(); //destroy last results
	let main_container = document.createElement("div");
	main_container.classList.add("main_container");
	main_container.id = "main_container";
	document.body.appendChild(main_container);
	let maximum_points = Number(document.getElementById("node_count_input").innerHTML);
	let radius = 50.0;
	for (let points = 1; points <= maximum_points; points += 1)
	{
		let point_coordinates = [];
		//Generate points around an imaginary circle. Always start on the left, at the vertical center.
		let initial_angle = -90.0;

		if (true)
		{
			//Does this angle create a horizontal line? If not, find the closest one, and correct the angle so it's horizontal.
			//Just looks nicer, visually.
			let best_dx = 0.0;
			let best_dy = Number.MAX_VALUE;
			for (let i = 1; i < points; i += 1)
			{
				let angle_1 = (360.0 / points) * (i - 1) + initial_angle;
				let angle_2 = (360.0 / points) * i + initial_angle;
				let dx = Math.cos(angle_2 * (Math.PI / 180.0)) - Math.cos(angle_1 * (Math.PI / 180.0));
				let dy = Math.sin(angle_2 * (Math.PI / 180.0)) - Math.sin(angle_1 * (Math.PI / 180.0));
				//console.log("dx = " + dx + ", dy = " + dy);

				//if (Math.abs(dx) > Math.abs(best_dx) || Math.abs(best_dx) < 0.001)
				if (Math.abs(dy) < Math.abs(best_dy))
				{
					best_dx = dx;
					best_dy = dy;
				}
			}
			if (Math.abs(best_dy) > 0.01 && points > 1)
			{
				//console.log(points + " best_dx = " + best_dx + ", best_dy = " + best_dy);
				let angle_correction = Math.atan2(best_dy, best_dx) * 180.0 / Math.PI;
				//console.log("angle_correction = " + angle_correction);
				initial_angle += angle_correction;
			}
			//Correct initial rotation so the zero point is in the top-left:
			let closest_point_to_target_angle = -1;
			//let closest_point_angle = 0.0;
			let closest_point_delta = 0.0;
			let target_angle = 225.0;

			for (let i = 0; i < points; i += 1)
			{
				let angle = (360.0 / points) * i + initial_angle;
				//console.log(i + "/" + points + ": " + angle);
				//let delta_1 = Math.abs(angle - target_angle);
				let delta = Math.min(Math.abs(angle - target_angle), Math.abs((angle + 360.0) - target_angle), Math.abs((angle - 360.0) - target_angle));
				if (closest_point_to_target_angle === -1 || delta < closest_point_delta)
				{
					closest_point_to_target_angle = i;
					//closest_point_angle = angle;
					closest_point_delta = delta;
				}
			}
			//console.log(points + " closest_point_to_target_angle = " + closest_point_to_target_angle + ", closest_point_delta = " + closest_point_delta);
			if (closest_point_to_target_angle !== 0)
			{
				initial_angle += (360.0 / points) * closest_point_to_target_angle;
			}
		}

		for (let i = 0; i < points; i += 1)
		{
			let angle_degrees = (360.0 / points) * i + initial_angle;
			let angle_radians = angle_degrees * (Math.PI / 180.0);
			let ix = 1.0 * Math.cos(angle_radians);
			let iy = 1.0 * Math.sin(angle_radians);
			if (points === 1)
			{
				//Center it:
				ix = 0.0;
				iy = 0.0;
			}
			point_coordinates.push([ix, iy]);
		}
		const [all_traversal, unique_rotation_traversals] = calculateAllTraversal(point_coordinates.length);
		/*const result = calculateAllTraversal(point_coordinates.length);
		const all_traversal = result[0];
		const unique_rotation_traversals = result[1];*/

		let containing_element = document.createElement("div");
		containing_element.classList.add("traversal_container");
		//Spread out hue across the spectrum:
		let hue = (points - 1) * 360.0 / maximum_points;
		containing_element.style.backgroundColor = "hsl(" + String(hue) + ", 75%, 80%)";
		containing_element.style.flex = "1 1 25%";

		let should_display = all_traversal.length < 10000;
		if (should_display)
		{
			//this is not correct but close enough:
			let minimum_width_px = ((radius * 2.0 + 20.0) * all_traversal.length);
			if (all_traversal.length > 3)
				minimum_width_px /= 2.0;
			minimum_width_px += 20.0; //padding
			let minimum_width_em = minimum_width_px / 22.5;
			containing_element.style.flex = "1 1 " + minimum_width_em + "em";
		}
		main_container.appendChild(containing_element);

		let title = document.createElement("div");
		title.classList.add("traversal_containiner_title");
		title.innerHTML = String(points) + " " + pluralize(points, "node", "nodes");
		containing_element.appendChild(title);
		let subtitle = document.createElement("div");
		subtitle.classList.add("traversal_containiner_subtitle");

		let subtitle_text = String(all_traversal.length) + " " + pluralize(all_traversal.length, "traversal", "traversals");
		if (all_traversal.length > 0)
			subtitle_text += " and " + String(unique_rotation_traversals.size) + " unique " + pluralize(unique_rotation_traversals.size, "rotation", "rotations");
		subtitle_text += (should_display ? "" : " (not displayed)");
		subtitle.innerHTML = subtitle_text;
		containing_element.appendChild(subtitle);

		let should_output_labels = document.getElementById("toggle_labels_checkbox").checked;

		/*let target_node_spacing = "5.0em"; //about 113 px, vs 4.0888em native svg
		if (should_output_labels)
			target_node_spacing = "7.5em"; //about 169 px, vs 6.444em native svg*/
		//base off of radius:
		let target_node_spacing_pixels = drawTraversalCalculateSVGSizeInPixels(radius, should_output_labels) + 22.0;
		if (should_output_labels)
			target_node_spacing_pixels += 12.0;
		let target_node_spacing = formatOldPixelAsNewEm(target_node_spacing_pixels);
		//console.log("target_node_spacing = " + target_node_spacing)
		document.documentElement.style.setProperty("--node-spacing", target_node_spacing);

		let subcontaining_element = document.createElement("div");
		containing_element.appendChild(subcontaining_element);
		subcontaining_element.classList.add("traversal_subcontainer");
		let iterating_traversals = all_traversal;
		if (iterating_traversals.length === 0)
		{
			//output empty traversal for layout
			iterating_traversals = [[]];
		}

		if (should_display)
		{
			//for (let traversal of all_traversal)
			//console.log("unique_rotation_traversals = " + JSON.stringify([...unique_rotation_traversals]))
			for (let i = 0; i < iterating_traversals.length; i += 1)
			{
				let subsubcontaining_element = document.createElement("div");
				subsubcontaining_element.classList.add("subsubcontaining_element");


				/*if (i < all_traversal.length - 1)
					subsubcontaining_element.style.borderRight = "1px solid black";
				subsubcontaining_element.style.borderBottom = "1px solid black";*/
				subcontaining_element.appendChild(subsubcontaining_element);
				let traversal = iterating_traversals[i];
				let unique_rotation = unique_rotation_traversals.has(i);
				drawTraversalEncapsulated(subsubcontaining_element, radius, should_output_labels, point_coordinates, traversal, unique_rotation);

				if (unique_rotation)
					subsubcontaining_element.classList.add("traversal_rotation_first");
				else
					subsubcontaining_element.classList.add("traversal_rotation_repeated");

				if (should_output_labels)
				{
					let traversal_text = document.createElement("div");
					traversal_text.innerHTML = traversal;
					traversal_text.classList.add("traversal_text");
					subsubcontaining_element.appendChild(traversal_text);
				}
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

function toggleLabelsCheckboxClicked()
{
	redoLayout();
}
