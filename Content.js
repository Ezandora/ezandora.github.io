/*async function loadJSONFromServer(url: string)
{
    let response = await fetch(url);
    if (!response.ok) return "";
    
    return response.json();
}


async function ContentSetup()
{
    console.log("ContentSetup()");
    //let current_path : string = window.location.pathname.split("/").at(-1);
    let current_path : string = window.location.href
    let json_description = current_path + "content.json";
    
    let content_json = await loadJSONFromServer(json_description);
    
    console.log("content_json = " + content_json);
}*/
function ContentSetup() {
    let carousel_image_elements = Array.from(document.getElementsByClassName("subbubble_carousel_image"));
    for (let carousel_image_uncast of carousel_image_elements) {
        let carousel_image = carousel_image_uncast;
        let subbubble_image = carousel_image.parentElement.parentElement.getElementsByClassName("subbubble_image")[0];
        carousel_image.addEventListener("click", function (event) {
            subbubble_image.src = carousel_image.src;
            subbubble_image.parentElement.scrollIntoView();
            event.stopPropagation();
        });
    }
    if (true) {
        let subbubble_image_elements = Array.from(document.getElementsByClassName("subbubble_image"));
        for (let subbubble_image_uncast of subbubble_image_elements) {
            let subbubble_image = subbubble_image_uncast;
            subbubble_image.addEventListener("click", function () {
                let parent_element = subbubble_image.parentElement;
                if (!parent_element.classList.contains("subbubble_large")) {
                    parent_element.classList.add("subbubble_large");
                    //document.scrollTo(0, parent_element.top);
                }
                else {
                    parent_element.classList.remove("subbubble_large");
                }
                parent_element.scrollIntoView();
            });
        }
    }
    else {
        let subbubble_elements = Array.from(document.getElementsByClassName("subbubble"));
        for (let subbubble of subbubble_elements) {
            subbubble.addEventListener("click", function () {
                if (!subbubble.classList.contains("subbubble_large")) {
                    subbubble.classList.add("subbubble_large");
                    //document.scrollTo(0, parent_element.top);
                }
                else {
                    subbubble.classList.remove("subbubble_large");
                }
                subbubble.scrollIntoView();
            });
        }
    }
}
//document.onload = function() { ContentSetup() };
//document.addEventListener("load", function() { console.log("1"); ContentSetup(); });
//ContentSetup();
