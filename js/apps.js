const $previewImg = $("#preview-img");
const $profileLink = $(".unsplash-profile-link");
const $imgLink = $(".unsplash-img-link");

class Request {
    url =
        "https://api.unsplash.com/photos/random/?client_id=XYRQifXX_-x6Nroy6uWI4RcI-L1ufecX4TPi_iIFN4k&orientation=portrait";

    addParam(paramName, paramValue) {
        if (typeof paramValue !== "string")
            throw new TypeError(
                `Error: Expected a string value for paramValue, got a ${typeof paramValue} instead.`
            );

        if (paramValue) this.url += `&${paramName}=${paramValue}`;
        return this;
    }
}

class Image {
    constructor(data) {
        this.description = data.description;
        this.url = `${data.urls.raw}?q=75&fm=jpg&w=300&fit=max`;
        this.link = data.links.html;
        this.download = data.links.download_location;
        this.author = data.user.name;
        this.profileLink = data.user.links.html;
        this.profileImg = data.user.profile_image.small;
    }
}

const BASE_URL = "https://api.unsplash.com/photos/random/?orientation=portrait";

function toggleDropdown() {
    const $dropdown = $("#adv-options");
    const $chevron = $("#adv-toggle-btn span");

    if ($dropdown.hasClass("opt-active")) {
        replaceClass($dropdown, "opt-active", "opt-collapse");
        replaceClass(
            $chevron,
            "icon-[mdi--chevron-up]",
            "icon-[mdi--chevron-down]"
        );
    } else if ($dropdown.hasClass("opt-collapse")) {
        replaceClass($dropdown, "opt-collapse", "opt-active");
        replaceClass(
            $chevron,
            "icon-[mdi--chevron-down]",
            "icon-[mdi--chevron-up]"
        );
    }
}

function toggleCollection($element, $chevron) {
    if ($element.hasClass("active")) {
        $element.removeClass("active");
        replaceClass(
            $chevron,
            "icon-[ion--chevron-up]",
            "icon-[ion--chevron-down]"
        );
    } else {
        $element.addClass("active");
        replaceClass(
            $chevron,
            "icon-[ion--chevron-down]",
            "icon-[ion--chevron-up]"
        );
    }
}

$("#accordion").on("click", ".header", (event) => {
    const $item = $(event.target.closest(".item"));
    const $chevron1 = $(event.target.querySelector("span"));
    toggleCollection($item, $chevron1);
});

function replaceClass(jqObj, current, replacement) {
    jqObj.removeClass(current);
    jqObj.addClass(replacement);
}

async function fetchImage(query = "", username = "", contentFilter = "high") {
    const request = new Request();
    request
        .addParam("query", query)
        .addParam("username", username)
        .addParam("content_filter", contentFilter);

    try {
        const responce = await fetch(request.url);
        if (responce.status === 200) {
            const data = await responce.json();
            const image = new Image(data);
            $previewImg.attr("src", image.url).attr("alt", image.description);
            console.log($previewImg.attr("alt"));
            $profileLink.attr("href", image.profileLink).text(image.author);
            $imgLink.attr("href", image.link);
        } else {
            console.log(`${responce.status}: ${responce.statusText}`);
        }
    } catch (e) {
        console.error("ERROR,IG");
    }
}

$("#randomizer-btn").on("click", async () => {
    fetchImage(
        $("#query").val(),
        $("#username").val(),
        $("#content-filter").val()
    );
});
