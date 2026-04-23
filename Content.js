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
/*
Always returns lowercase.
*/
function extensionForURL(url) {
    var _a;
    return (_a = url.split(/[#?]/)[0].split(".").pop()) === null || _a === void 0 ? void 0 : _a.trim().toLocaleLowerCase();
}
function pathIsVideo(url) {
    let file_extension = extensionForURL(url);
    if (file_extension === "webm" || file_extension === "mp4")
        return true;
    return false;
}
function internetMediaTypeForURL(url) {
    //Extremely incomplete.
    let media_map = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "jxl": "image/jxl",
        "avif": "image/avif",
        "gif": "image/gif",
        "png": "image/png",
        "apng": "image/apng",
        "svg": "image/svg+xml",
        "webp": "image/webp",
        "bmp": "image/bmp",
        "ico": "image/vnd.microsoft.icon",
        "tif": "image/tiff",
        "tiff": "image/tiff",
        "mp4": "video/mp4",
        "webm": "video/webm",
        "avi": "video/x-msvideo",
        "mpeg": "video/mpeg",
        "mpg": "video/mpeg",
        "ogv": "video/ogg",
        "ts": "video/mp2t",
        "3gp": "video/3gpp" //can be audio
    };
    let extension = extensionForURL(url);
    if (extension in media_map)
        return media_map[extension];
    return "";
}
function domElementClearClassList(element) {
    //copying a DOMTokenList is weird. it's either this or "[].slice.call(element.classList)", because JavaScript / the DOM is not... terribly consistent. Lots of "arrays" that aren't actually arrays.
    let names_to_remove = [...element.classList];
    for (let class_name of names_to_remove) {
        element.classList.remove(class_name);
    }
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
var FullscreenTransitionState;
(function (FullscreenTransitionState) {
    FullscreenTransitionState["INACTIVE"] = "INACTIVE";
    FullscreenTransitionState["PREPARING"] = "PREPARING";
    FullscreenTransitionState["GROWING"] = "GROWING";
    FullscreenTransitionState["FULLSCREEN"] = "FULLSCREEN";
    FullscreenTransitionState["SHRINKING"] = "SHRINKING";
})(FullscreenTransitionState || (FullscreenTransitionState = {}));
;
function enlargeImage(image) {
    /*if (image.classList.contains("fullscreen_image"))
        return;*/
    if (image.dataset.fullscreen_state !== FullscreenTransitionState.INACTIVE)
        return;
    let inner_image = image;
    if (image.tagName === "PICTURE") {
        inner_image = image.getElementsByTagName("img")[0];
    }
    let new_background = document.createElement("div");
    new_background.classList.add("fullscreen_background");
    new_background.style.height = document.body.clientHeight + "px";
    let new_container = document.createElement("div");
    new_container.classList.add("fullscreen_image_container");
    let element_bounds = inner_image.getBoundingClientRect();
    let image_clone = image.cloneNode(true);
    let image_parent = image.parentNode;
    image_parent.insertBefore(image_clone, image);
    image_parent.removeChild(image);
    domElementClearClassList(image);
    if (image.tagName === "PICTURE") {
        domElementClearClassList(inner_image);
    }
    if (image.tagName === "VIDEO") {
        let clone_as_video = image_clone;
        let image_as_video = image;
        //Firefox will fire a canplay for every currentTime chance, so only fire this once:
        clone_as_video.addEventListener("canplay", function () {
            clone_as_video.currentTime = image_as_video.currentTime;
        }, { once: true });
    }
    //Position the clone exactly where its predecessor was, as a starting point:
    inner_image.style.left = element_bounds.left + "px";
    inner_image.style.width = element_bounds.width + "px";
    inner_image.style.top = element_bounds.top + "px";
    inner_image.style.height = element_bounds.height + "px";
    inner_image.classList.add("fullscreen_image");
    new_container.appendChild(image);
    document.body.appendChild(new_background);
    document.body.appendChild(new_container);
    //This doesn't support zooming in/out properly, so disabled.
    //simpleGestureRegisterForElement(new_container, fullscreenImageContainerHandleGesture);
    let root_element = document.querySelector(":root");
    root_element.style.setProperty("--color-very-dark-background", "black");
    new_container.addEventListener("click", function () {
        if (image.dataset.fullscreen_state !== FullscreenTransitionState.FULLSCREEN && image.dataset.fullscreen_state !== FullscreenTransitionState.GROWING)
            return;
        /*document.body.removeChild(new_container);*/
        if (image.dataset.fullscreen_state === FullscreenTransitionState.FULLSCREEN) {
            new_container.classList.remove("instant_transition");
            image.classList.remove("instant_transition");
        }
        image.dataset.fullscreen_state = FullscreenTransitionState.SHRINKING;
        document.body.classList.remove("hiddenScrollbar");
        //Bug in safari: it ignores changes to the background color of sticky header elements, and prevents changes to the window highlight color. Which leaves a purple bar at the top in Safari.
        //We can fix this by not having a background color in the sticky elements, but then they floating text when scrolling down.
        root_element.style.setProperty("--color-very-dark-background", __original_color_very_dark_background);
        image.addEventListener("transitionend", function () {
            if (image.dataset.fullscreen_state !== FullscreenTransitionState.SHRINKING)
                return;
            image.dataset.fullscreen_state = FullscreenTransitionState.INACTIVE;
            new_container.removeChild(image);
            //Change class to what it was before:
            domElementClearClassList(image);
            for (let class_element of image_clone.classList) {
                image.classList.add(class_element);
            }
            if (image !== inner_image && image.tagName === "PICTURE") {
                domElementClearClassList(inner_image);
                let inner_image_clone = image_clone.getElementsByTagName("img")[0];
                for (let class_element of inner_image_clone.classList) {
                    inner_image.classList.add(class_element);
                }
                inner_image.style.cssText = document.defaultView.getComputedStyle(inner_image_clone, "").cssText;
            }
            //Kind of hacky, change the style back:
            image.style.cssText = document.defaultView.getComputedStyle(image_clone, "").cssText;
            let parent_element = image_clone.parentElement;
            parent_element.insertBefore(image, image_clone);
            parent_element.removeChild(image_clone);
            document.body.removeChild(new_background);
            document.body.removeChild(new_container);
        }, { once: true });
        inner_image.classList.remove("fullscreen_image_full");
        new_background.classList.remove("fullscreen_background_black");
    });
    image.dataset.fullscreen_state = FullscreenTransitionState.PREPARING;
    //If we call this immediately, it won't execute the animation.
    //So call a zero-length timeout. Kind of bad?
    setTimeout(function () {
        if (image.dataset.fullscreen_state !== FullscreenTransitionState.PREPARING) {
            console.log("something is dreadfully wrong, image.dataset.fullscreen_state is " + image.dataset.fullscreen_state + " and not PREPARING");
        }
        image.dataset.fullscreen_state = FullscreenTransitionState.GROWING;
        inner_image.classList.add("fullscreen_image_full");
        /*new_container.classList.add("fullscreen_background_black");*/
        new_background.classList.add("fullscreen_background_black");
        image.addEventListener("transitionend", function () {
            if (image.dataset.fullscreen_state !== FullscreenTransitionState.GROWING)
                return;
            image.dataset.fullscreen_state = FullscreenTransitionState.FULLSCREEN;
            image.classList.add("instant_transition");
            new_container.classList.add("instant_transition");
            document.body.classList.add("hiddenScrollbar");
        }, { once: true });
    }, 0);
}
function ContentSetup(content_json_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield loadJSONFromServer(content_json_path);
        let projects_div = document.getElementById("projects_bubble");
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
            let base_url = "";
            if ("image url base" in entry)
                base_url = entry["image url base"];
            //Add in base url here:
            for (let source_image of entry["images"]) {
                let urls = source_image["urls"];
                //let secondary_base_url = ""
                //if ("image url secondary base" in source_image)
                //	secondary_base_url = source_image["image url secondary base"];
                /*for (let i = 0; i < urls.length; i += 1)
                {
                    //urls[i] = base_url + secondary_base_url + urls[i];
                    urls[i] = base_url + urls[i];
                }*/
                let media_queries = [];
                if ("media queries" in source_image)
                    media_queries = source_image["media queries"];
                //Fill out urls with image formats:
                let urls_new = [];
                let media_queries_new = [];
                for (let i = 0; i < urls.length; i += 1) {
                    let url = urls[i];
                    let media_query = "";
                    if (i < media_queries.length)
                        media_query = media_queries[i];
                    if (media_query === "phone")
                        media_query = "(max-width:600px)";
                    if ("image formats available" in entry) {
                        for (let image_format of entry["image formats available"]) {
                            urls_new.push(base_url + url + "." + image_format);
                            media_queries_new.push(media_query);
                        }
                    }
                    else {
                        urls_new.push(base_url + url);
                        media_queries_new.push(media_query);
                    }
                }
                source_image["urls"] = urls_new;
                source_image["media queries"] = media_queries_new;
            }
            let addImage = function (source_images, source_image_id, element_class, parent_element) {
                return __awaiter(this, void 0, void 0, function* () {
                    let source_image = source_images[source_image_id];
                    let urls = source_image["urls"];
                    let media_queries = source_image["media queries"];
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
                            source.type = internetMediaTypeForURL(url);
                            video.appendChild(source);
                        }
                        video.dataset.id = source_image_id;
                        parent_element.appendChild(video);
                        return video;
                    }
                    else {
                        let image = document.createElement("img");
                        let return_value = image;
                        let picture = document.createElement("picture");
                        for (let url_id = 0; url_id < urls.length; url_id += 1) {
                            let url = urls[url_id];
                            let media_query = "";
                            if (url_id < media_queries.length)
                                media_query = media_queries[url_id];
                            let source = document.createElement("source");
                            source.srcset = encodeURI(url); //encode URL because we use spaces in our image name specification
                            source.type = internetMediaTypeForURL(url);
                            if (media_query.length > 0)
                                source.media = media_query;
                            picture.appendChild(source);
                        }
                        picture.appendChild(image);
                        parent_element.appendChild(picture);
                        return_value = picture;
                        picture.dataset.id = source_image_id;
                        image.loading = "lazy";
                        image.classList.add(element_class);
                        image.src = encodeURI(urls[urls.length - 1]);
                        if ("description" in source_image) {
                            image.alt = source_image["description"];
                            image.title = source_image["description"];
                        }
                        return return_value;
                    }
                });
            };
            {
                let subbubble_element = yield addImage(entry["images"], 0, "subbubble_image", subbubble);
                subbubble_element.classList.add("subbubble_first_image");
                subbubble_element.dataset.fullscreen_state = FullscreenTransitionState.INACTIVE;
                subbubble_element.addEventListener("click", function () {
                    enlargeImage(subbubble_element);
                });
            }
            if (entry["images"].length > 1) {
                let carousel = document.createElement("div");
                carousel.classList.add("image_carousel");
                subbubble.appendChild(carousel);
                for (let i = 0; i < entry["images"].length; i += 1) {
                    if (pathIsVideo(entry["images"][i]["urls"][0]))
                        continue; //not yet supported
                    let image_element = yield addImage(entry["images"], i, "subbubble_carousel_image", carousel);
                    image_element.addEventListener("click", function (event) {
                        return __awaiter(this, void 0, void 0, function* () {
                            var _a, _b, _c, _d;
                            let getInnerImage = function (element) {
                                if (element.tagName === "PICTURE")
                                    return element.getElementsByTagName("img")[0];
                                return element;
                            };
                            let first_picture = (_b = (_a = image_element.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getElementsByClassName("subbubble_first_image")[0];
                            if (first_picture.dataset.id !== image_element.dataset.id) {
                                let previous_sh = getInnerImage(first_picture).scrollHeight;
                                let previous_page_y_offset = window.pageYOffset;
                                let image_clone = image_element.cloneNode(true);
                                let inner_image = image_clone.getElementsByTagName("img")[0];
                                inner_image.loading = "eager";
                                yield inner_image.decode(); //wait for decode to get scrollHeight?
                                (_c = first_picture.parentNode) === null || _c === void 0 ? void 0 : _c.insertBefore(image_clone, first_picture);
                                (_d = first_picture.parentNode) === null || _d === void 0 ? void 0 : _d.removeChild(first_picture);
                                domElementClearClassList(image_clone);
                                image_clone.classList.add("subbubble_first_image");
                                let image_clone_img = image_clone.getElementsByTagName("img")[0];
                                domElementClearClassList(image_clone_img);
                                image_clone_img.classList.add("subbubble_image");
                                image_clone.dataset.fullscreen_state = FullscreenTransitionState.INACTIVE;
                                image_clone.addEventListener("click", function () {
                                    enlargeImage(image_clone);
                                });
                                let current_page_y_offset = window.pageYOffset;
                                //Scroll page so the element we clicked on doesn't move.
                                //Both chromium and firefox do this automatically, safari doesn't. we can determine browser behavior by checking if pageYOffset changed
                                let new_sh = getInnerImage(image_clone).scrollHeight;
                                let delta = new_sh - previous_sh;
                                let page_delta = current_page_y_offset - previous_page_y_offset;
                                delta -= page_delta;
                                //console.log("previous page y offset: " + previous_page_y_offset + " new = " + current_page_y_offset + " delta = " + page_delta);
                                //console.log("sh: " + previous_sh + " => " + new_sh + " delta = " + delta);
                                if (Math.abs(delta) > 0.9) {
                                    window.scrollBy(0, delta);
                                }
                            }
                            else {
                                //enlargeImage(subbubble_image);
                                first_picture.click();
                            }
                            event.stopPropagation();
                        });
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
    });
}
