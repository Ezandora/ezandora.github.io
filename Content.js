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
function enlargeImage(element) {
    let new_container = document.createElement("div");
    new_container.classList.add("fullscreen_image_container");
    let new_image = element.cloneNode(true);
    for (let class_element of new_image.classList) {
        new_image.classList.remove(class_element);
    }
    if (element.tagName === "VIDEO") {
        let element_as_video = element;
        let new_image_as_video = new_image;
        /*Firefox will fire a canplay for every currentTime chance, so only fire this once: */
        new_image_as_video.addEventListener("canplay", function () {
            new_image_as_video.currentTime = element_as_video.currentTime;
        }, { once: true });
    }
    //Position the clone exactly where its predecessor was, as a starting point:
    let rect = element.getBoundingClientRect();
    new_image.style.left = rect.left + "px";
    new_image.style.width = (rect.right - rect.left) + "px";
    //new_image.style.right = rect.right + "px";
    new_image.style.top = rect.top + "px";
    new_image.style.height = (rect.bottom - rect.top) + "px";
    //new_image.style.position = "absolute";
    new_image.style.borderRadius = "var(--roundrect-radius)";
    new_image.classList.add("fullscreen_image");
    new_container.appendChild(new_image);
    document.body.appendChild(new_container);
    document.body.classList.add("hiddenScrollbar");
    new_container.addEventListener("click", function () {
        /*document.body.removeChild(new_container);*/
        new_container.classList.remove("instant_transition");
        new_image.classList.remove("instant_transition");
        document.body.classList.remove("hiddenScrollbar");
        for (let event_name of ["transitionend", "transitioncancel"]) {
            new_image.addEventListener(event_name, function () {
                if (document.body.contains(new_container)) {
                    document.body.removeChild(new_container);
                }
            }, { once: true });
        }
        new_image.classList.remove("fullscreen_image_full");
        new_container.classList.remove("fullscreen_image_container_black");
        setTimeout(function () {
            //Backup in case transitionend / transitioncancel didn't fire:
            //Which can happen if the browser didn't transition the element in the first place.
            if (document.body.contains(new_container)) {
                document.body.removeChild(new_container);
            }
        }, 500);
    });
    //If we call this immediately, it won't execute the animation.
    //So call a zero-length timeout. Kind of bad?
    setTimeout(function () {
        new_image.classList.add("fullscreen_image_full");
        new_container.classList.add("fullscreen_image_container_black");
        new_image.addEventListener("transitionend", function () {
            new_image.classList.add("instant_transition");
            new_container.classList.add("instant_transition");
        }, { once: true });
    }, 0);
}
function ContentSetup() {
    let carousel_image_elements = Array.from(document.getElementsByClassName("subbubble_carousel_image"));
    for (let carousel_image_uncast of carousel_image_elements) {
        let carousel_image = carousel_image_uncast;
        let subbubble_image = carousel_image.parentElement.parentElement.getElementsByClassName("subbubble_image")[0];
        carousel_image.addEventListener("click", function (event) {
            if (subbubble_image.src !== carousel_image.src) {
                subbubble_image.src = carousel_image.src;
                //subbubble_image.parentElement.scrollIntoView();
            }
            else {
                enlargeImage(subbubble_image);
            }
            event.stopPropagation();
        });
    }
    if (true) {
        let subbubble_image_elements = Array.from(document.getElementsByClassName("subbubble_image"));
        for (let subbubble_element_uncast of subbubble_image_elements) {
            let subbubble_element = subbubble_element_uncast;
            subbubble_element.addEventListener("click", function () {
                enlargeImage(subbubble_element);
            });
        }
    }
    /*else if (true)
    {
        let subbubble_image_elements = Array.from(document.getElementsByClassName("subbubble_image"));
        for (let subbubble_image_uncast of subbubble_image_elements)
        {
            let subbubble_image : HTMLImageElement = <HTMLImageElement>subbubble_image_uncast;
            
            subbubble_image.addEventListener("click", function ()
            {
                let parent_element = subbubble_image.parentElement;
                if (!parent_element.classList.contains("subbubble_large"))
                {
                    parent_element.classList.add("subbubble_large");
                    //document.scrollTo(0, parent_element.top);
                }
                else
                {
                    parent_element.classList.remove("subbubble_large");
                }
                parent_element.scrollIntoView();
            });
        }
    }*/
    /*else
    {
        let subbubble_elements = Array.from(document.getElementsByClassName("subbubble"));
        for (let subbubble of subbubble_elements)
        {
            
            subbubble.addEventListener("click", function ()
            {
                if (!subbubble.classList.contains("subbubble_large"))
                {
                    subbubble.classList.add("subbubble_large");
                    //document.scrollTo(0, parent_element.top);
                }
                else
                {
                    subbubble.classList.remove("subbubble_large");
                }
                subbubble.scrollIntoView();
            });
        }
    }*/
}
//document.onload = function() { ContentSetup() };
//document.addEventListener("load", function() { console.log("1"); ContentSetup(); });
//ContentSetup();
