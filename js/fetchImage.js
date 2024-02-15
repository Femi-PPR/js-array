const $previewImg = $("#preview-img");
const $profileLink = $(".unsplash-profile-link");
const $imgLink = $(".unsplash-img-link");
const USERNAME_REGEX = /^[\da-zA-Z_]*$/;
const LOADING_ICON_STR =
    '<div id="loading-bg" class="h-full flex justify-center items-center bg-palette-6"><span class="animate-spin size-14 icon-[tdesign--loading]"></span></div>';

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
        this.author = `${data.user.name} (@${data.user.username})`;
        this.profileLink = data.user.links.html;
        this.profileImg = data.user.profile_image.small;
        this.hash = data.blur_hash;
        this.blurWidth = 20;
        this.blurHeight = this.#calcHeight(data.height / data.width);
    }

    #calcHeight(aspectRatio) {
        return Math.round((aspectRatio * this.blurWidth) / 4) * 4;
    }
}

async function fetchImage(query = "", username = "", contentFilter = "high") {
    const request = new Request();
    request
        .addParam("query", query)
        .addParam("username", username)
        .addParam("content_filter", contentFilter);

    $("#loading-div").append(LOADING_ICON_STR);

    try {
        const responce = await fetch(request.url);
        console.log(responce);
        if (responce.ok) {
            const data = await responce.json();
            console.log("1!");
            const image = new Image(data);
            const blurhashImgData = await blurhash
                .decodePromise(image.hash, image.blurWidth, image.blurHeight)
                .then((blurhashImgData) => {
                    console.log("HERE!");
                    // console.log(`All the data ${blurhashImgData}`);
                    $("#loading-bg").remove();
                    return blurhashImgData;
                });
            const $canvas = $(
                blurhash.drawImageDataOnNewCanvas(
                    blurhashImgData,
                    image.blurWidth,
                    image.blurHeight
                )
            )
                .addClass("object-cover w-full h-full rounded-lg")
                .attr("id", "blur-img");
            console.log(`TESTING ${$canvas}`);
            $("#loading-div").append($canvas);
            $previewImg.attr("src", image.url).attr("alt", image.description);
            console.log($previewImg.attr("alt"));
            $profileLink.attr("href", image.profileLink).text(image.author);
            $imgLink.attr("href", image.link);
        } else {
            let errMsg;
            switch (responce.status) {
                case 400:
                    errMsg = "Reached Rate Limit";
                    break;
                case 401:
                    errMsg = "Unathorized";
                    break;
                case 404:
                    errMsg = "Found no matches for query";
                    break;
                default:
                    errMsg = "Error. Something happened idk what.";
                    break;
            }
            console.log(`${responce.status}: ${errMsg}`);
        }
    } catch (e) {
        console.error("ERROR:", e.name, e.message);
    }
}

$previewImg.on("load", () => {
    console.log("FINISHED!!!");
    $("#blur-img").remove();
});

$("#randomizer-btn").on("click", async () => {
    const username = $("#username").val();
    if (!USERNAME_REGEX.test(username)) {
        console.log(
            "Username can only contain letters, numbers, and underscores"
        );
        return;
    }
    fetchImage(
        $("#query").val(),
        $("#username").val(),
        $("#content-filter").val()
    );
});
