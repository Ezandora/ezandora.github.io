var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let __original_color_very_dark_background = "";
function loadJSONFromServer(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(url);
        if (!response.ok)
            return "";
        return response.json();
    });
}
function pathIsVideo(url) {
    let lowercase_url = url.toLocaleLowerCase();
    if (lowercase_url.endsWith("webm") || lowercase_url.endsWith("mp4"))
        return true;
    return false;
}
var SimpleGestureDirection;
(function (SimpleGestureDirection) {
    SimpleGestureDirection[SimpleGestureDirection["None"] = 0] = "None";
    SimpleGestureDirection[SimpleGestureDirection["Up"] = 1] = "Up";
    SimpleGestureDirection[SimpleGestureDirection["Down"] = 2] = "Down";
    SimpleGestureDirection[SimpleGestureDirection["Left"] = 3] = "Left";
    SimpleGestureDirection[SimpleGestureDirection["Right"] = 4] = "Right";
})(SimpleGestureDirection || (SimpleGestureDirection = {}));
function simpleGestureRegisterForElement(element, handler) {
    element.addEventListener("touchstart", function (e) { simpleGestureTouchstart(e); });
    element.addEventListener("touchend", function (e) { simpleGestureTouchend(e, element, handler); });
}
let __simple_gesture_saved_touch_starts = {};
function simpleGestureTouchstart(event) {
    //console.log("simpleGestureTouchstart. event.touches: " + event.touches.length + ", event.changedTouches: " + event.changedTouches.length);
    if (event.touches.length > 1)
        return;
    for (let touch of event.touches) {
        __simple_gesture_saved_touch_starts[touch.identifier] = touch;
    }
}
function simpleGestureTouchend(event, element, handler) {
    if (event.changedTouches.length > 1)
        return;
    //console.log("simpleGestureTouchend. event.changedTouches: " + event.changedTouches.length);
    for (let end_touch of event.changedTouches) {
        //console.log("touch " + end_touch.identifier);
        let start_touch = __simple_gesture_saved_touch_starts[end_touch.identifier];
        delete __simple_gesture_saved_touch_starts[end_touch.identifier];
        let x_delta = end_touch.clientX - start_touch.clientX;
        let y_delta = end_touch.clientY - start_touch.clientY;
        let x_delta_absolute = Math.abs(x_delta);
        let y_delta_absolute = Math.abs(y_delta);
        let minimum_distance_to_matter = 50.0;
        //console.log("x_delta = " + x_delta + " y_delta = " + y_delta);
        //Simple approach:
        if (x_delta_absolute < minimum_distance_to_matter && y_delta_absolute < minimum_distance_to_matter)
            continue;
        let gesture = {
            direction: SimpleGestureDirection.None,
        };
        if (x_delta_absolute > y_delta_absolute) {
            if (x_delta < 0.0) {
                //left
                gesture.direction = SimpleGestureDirection.Left;
            }
            else {
                //right
                gesture.direction = SimpleGestureDirection.Right;
            }
        }
        else {
            if (y_delta < 0.0) {
                //up
                gesture.direction = SimpleGestureDirection.Up;
            }
            else {
                //down;
                gesture.direction = SimpleGestureDirection.Down;
            }
        }
        handler(element, gesture);
    }
}
function fullscreenImageContainerHandleGesture(element, gesture) {
    //console.log("received swiped " + gesture.direction);
    if (gesture.direction === SimpleGestureDirection.Up || gesture.direction === SimpleGestureDirection.Down) {
        element.click();
    }
}
function enlargeImage(image) {
    if (image.classList.contains("fullscreen_image"))
        return;
    if (image.dataset.fullscreen_state !== "0INACTIVE")
        return;
    let new_background = document.createElement("div");
    new_background.classList.add("fullscreen_background");
    new_background.style.height = document.body.clientHeight + "px";
    let new_container = document.createElement("div");
    new_container.classList.add("fullscreen_image_container");
    let element_bounds = image.getBoundingClientRect();
    let image_clone = image.cloneNode(true);
    let image_parent = image.parentNode;
    image_parent.insertBefore(image_clone, image);
    image_parent.removeChild(image);
    /*let swap = element;
    element = new_image;
    new_image = swap;*/
    /*image.addEventListener("click", function ()
    {
        enlargeImage(image);
    }, {once:true});*/
    for (let class_element of image.classList) {
        image.classList.remove(class_element);
    }
    if (image.tagName === "VIDEO") {
        let clone_as_video = image_clone;
        let image_as_video = image;
        /*Firefox will fire a canplay for every currentTime chance, so only fire this once: */
        clone_as_video.addEventListener("canplay", function () {
            clone_as_video.currentTime = image_as_video.currentTime;
        }, { once: true });
    }
    //Position the clone exactly where its predecessor was, as a starting point:
    image.style.left = element_bounds.left + "px";
    image.style.width = element_bounds.width + "px";
    image.style.top = element_bounds.top + "px";
    image.style.height = element_bounds.height + "px";
    image.classList.add("fullscreen_image");
    new_container.appendChild(image);
    document.body.appendChild(new_background);
    document.body.appendChild(new_container);
    //document.body.classList.add("hiddenScrollbar");
    //This doesn't support zooming in/out properly, so disabled.
    //simpleGestureRegisterForElement(new_container, fullscreenImageContainerHandleGesture);
    //let root_element = <HTMLElement>document.querySelector(":root");
    //root_element.style.setProperty("--color-very-dark-background", "black");
    //	document.body.style.background = "black";
    //theme-color no longer available in Safari 26
    //document.querySelector("meta[name=\"theme-color\"]").setAttribute("content", "black");
    /*Array.from(document.getElementsByClassName("sticky_header")).forEach((sticky_element) => {
        sticky_element.classList.add("sticky_header_black");
    });*/
    new_container.addEventListener("click", function () {
        if (image.dataset.fullscreen_state !== "3FULLSCREEN" && image.dataset.fullscreen_state !== "2GROWING")
            return;
        /*document.body.removeChild(new_container);*/
        if (image.dataset.fullscreen_state === "3FULLSCREEN") {
            new_container.classList.remove("instant_transition");
            image.classList.remove("instant_transition");
        }
        image.dataset.fullscreen_state = "4SHRINKING";
        document.body.classList.remove("hiddenScrollbar");
        //Bug in safari: it ignores changes to the background color of sticky header elements, and prevents changes to the window highlight color. Which leaves a purple bar at the top in Safari.
        //We can fix this by not having a background color in the sticky elements, but then they floating text when scrolling down.
        //root_element.style.setProperty("--color-very-dark-background", __original_color_very_dark_background);
        /*Array.from(document.getElementsByClassName("sticky_header")).forEach((sticky_element : HTMLElement) => {
            sticky_element.style.backgroundColor = "black";
        });*/
        image.addEventListener("transitionend", function () {
            if (image.dataset.fullscreen_state !== "4SHRINKING")
                return;
            image.dataset.fullscreen_state = "0INACTIVE";
            new_container.removeChild(image);
            //Change class to what it was before:
            for (let class_element of image.classList) {
                image.classList.remove(class_element);
            }
            for (let class_element of image_clone.classList) {
                image.classList.add(class_element);
            }
            //Kind of hacky, change the style back:
            image.style.cssText = document.defaultView.getComputedStyle(image_clone, "").cssText;
            let parent_element = image_clone.parentElement;
            parent_element.insertBefore(image, image_clone);
            parent_element.removeChild(image_clone);
            document.body.removeChild(new_background);
            document.body.removeChild(new_container);
            /*Array.from(document.getElementsByClassName("sticky_header")).forEach((sticky_element) => {
                sticky_element.classList.remove("sticky_header_black");
            });*/
        }, { once: true });
        image.classList.remove("fullscreen_image_full");
        new_background.classList.remove("fullscreen_background_black");
        //setTimeout(end_function, 3000);
    });
    image.dataset.fullscreen_state = "1PREPARING";
    //If we call this immediately, it won't execute the animation.
    //So call a zero-length timeout. Kind of bad?
    setTimeout(function () {
        if (image.dataset.fullscreen_state !== "1PREPARING") {
            console.log("something is dreadfully wrong, image.dataset.fullscreen_state is " + image.dataset.fullscreen_state + " and not 1PREPARING");
        }
        image.dataset.fullscreen_state = "2GROWING";
        image.classList.add("fullscreen_image_full");
        /*new_container.classList.add("fullscreen_background_black");*/
        new_background.classList.add("fullscreen_background_black");
        image.addEventListener("transitionend", function () {
            if (image.dataset.fullscreen_state !== "2GROWING")
                return;
            image.dataset.fullscreen_state = "3FULLSCREEN";
            image.classList.add("instant_transition");
            new_container.classList.add("instant_transition");
            document.body.classList.add("hiddenScrollbar");
        }, { once: true });
    }, 0);
}
function ContentSetup(content_json_path) {
    return __awaiter(this, void 0, void 0, function* () {
        //let current_path : string = window.location.pathname.split("/").at(-1);
        //let current_path : string = window.location.href
        //let content_json_path = current_path + "content.json";
        let content = yield loadJSONFromServer(content_json_path);
        let projects_div = document.getElementById("projects_bubble");
        //console.log("content = " + JSON.stringify(content));
        for (let entry of content["entries"]) {
            let subbubble = document.createElement("div");
            subbubble.classList.add("subbubble");
            {
                let header = document.createElement("H2");
                header.classList.add("bubble_header");
                header.innerHTML = entry["title"];
                subbubble.appendChild(header);
            }
            {
                let subheader = document.createElement("p");
                subheader.classList.add("bubble_subheader");
                subheader.innerHTML = entry["subheader"];
                subbubble.appendChild(subheader);
            }
            let addImage = function (source_image, element_class, parent_element) {
                let urls = source_image["urls"];
                let first_url = urls[0];
                if (pathIsVideo(first_url)) {
                    let video = document.createElement("video");
                    video.classList.add(element_class);
                    video.autoplay = true;
                    video.loop = true;
                    video.muted = true;
                    video.playsInline = true;
                    for (let url of urls) {
                        let source = document.createElement("source");
                        source.src = url;
                        if (url.toLocaleLowerCase().endsWith("webm"))
                            source.type = "video/webm";
                        if (url.toLocaleLowerCase().endsWith("mp4"))
                            source.type = "video/mp4";
                        video.appendChild(source);
                    }
                    parent_element.appendChild(video);
                    return video;
                }
                else {
                    let image = document.createElement("img");
                    image.classList.add(element_class);
                    image.src = first_url;
                    if ("description" in source_image) {
                        image.alt = source_image["description"];
                        image.title = source_image["description"];
                    }
                    parent_element.appendChild(image);
                    return image;
                }
                return null;
            };
            let subbubble_element = addImage(entry["images"][0], "subbubble_image", subbubble);
            subbubble_element.dataset.fullscreen_state = "0INACTIVE";
            subbubble_element.addEventListener("click", function () {
                enlargeImage(subbubble_element);
            });
            if (entry["images"].length > 1) {
                let carousel = document.createElement("div");
                carousel.classList.add("image_carousel");
                subbubble.appendChild(carousel);
                for (let image of entry["images"]) {
                    if (pathIsVideo(image["urls"][0]))
                        continue; //unsupported
                    let image_element = addImage(image, "subbubble_carousel_image", carousel);
                    image_element.addEventListener("click", function (event) {
                        let subbubble_element_as_image = (subbubble_element);
                        //let subbubble_image : HTMLImageElement = <HTMLImageElement>image_element.parentElement.parentElement.getElementsByClassName("subbubble_image")[0];
                        if (subbubble_element_as_image.src !== image_element.src) {
                            let previous_sh = subbubble_element_as_image.scrollHeight;
                            subbubble_element_as_image.src = image_element.src;
                            subbubble_element_as_image.alt = image_element.alt;
                            subbubble_element_as_image.title = image_element.title;
                            let new_sh = subbubble_element_as_image.scrollHeight;
                            let delta = new_sh - previous_sh;
                            if (Math.abs(delta) > 0.9)
                                window.scrollBy(0, delta);
                            //subbubble_image.parentElement.scrollIntoView();
                        }
                        else {
                            //enlargeImage(subbubble_image);
                            subbubble_element.click();
                        }
                        event.stopPropagation();
                    });
                }
            }
            {
                let description = document.createElement("div");
                description.classList.add("subbubble_description");
                description.innerHTML = entry["description"];
                subbubble.appendChild(description);
            }
            projects_div === null || projects_div === void 0 ? void 0 : projects_div.appendChild(subbubble);
        }
        let root_element = document.querySelector(":root");
        __original_color_very_dark_background = getComputedStyle(root_element).getPropertyValue("--color-very-dark-background");
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
    });
}
//document.onload = function() { ContentSetup() };
//document.addEventListener("load", function() { console.log("1"); ContentSetup(); });
//ContentSetup();
