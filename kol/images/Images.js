


function ContentSetup()
{
	let image_urls = [
	"21_December_2018_toy_leaderboard.png",
	"zero.png",
	"wholekingdom.png",
	"valentines-day.png",
	"top_detective_reward.png",
	"translated-guide.png",
	"terminal_gui.png",
	"shaq-test.png",
	"service.png",
	"seasonreward.png",
	"seahorse.png",
	"rng.png",
	"pixellated.png",
	"ns3.png",
	"mummery.png",
	"mumble.png",
	"mu.png",
	"mockup-ideas.png",
	"mine_generate.png",
	"mafia.png",
	"item_ids_versus_desc_ids.png",
	"hpbuffs.png",
	"item_id.png",
	"hermit.png",
	"helping!.png",
	"heart.png",
	"genie.png",
	"fancy_calligraphy_pen.png",
	"fancy_calligraphy_pen_correct.png",
	"first_row.png",
	"fakehands2.png",
	"fakehands.png",
	"dukevampire.png",
	"cyrus2.png",
	"cyrus.png",
	"compact.png",
	"azula-boss.gif",
	"asdonmartingui.png",
	"ascension_history.png",
	"ampersand.png",
	"ai_hearts.png",
	"addore_pickremove.png",
	"TheLostSCHRLeaderboard.png",
	"LeaderboardBeforeRollover14May2019.png",
	"PlantSpirit.gif",
	"LeaderboardAfterRollover14May2019.png",
	"24.png",
	"witchess_solver/rejectable_80.png",
	"witchess_solver/rejectable_77.png",
	"witchess_ai/rook.png",
	"witchess_ai/ai_hearts.png",
	];
	
	let images_container_element = document.getElementById("images_container");
	
	for (image_url of image_urls)
	{
		let container = document.createElement("div");
		container.classList.add("image_container");
		let image_element = document.createElement("img");
		image_element.src = image_url;
		container.appendChild(image_element);
		
		let text = document.createElement("div");
		text.innerHTML = image_url;
		container.appendChild(text);
		images_container_element.appendChild(container);
	}
}