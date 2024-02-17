const $previewImg = $("#preview-img");
const $profileLink = $(".unsplash-profile-link");
const $imgLink = $(".unsplash-img-link");
const USERNAME_REGEX = /^[\da-zA-Z_]*$/;
const LOADING_ICON_STR =
    '<div id="loading-bg" class="h-full flex justify-center items-center bg-palette-6"><span class="animate-spin size-14 icon-[tdesign--loading]"></span></div>';

class Request {
    url =
        "https://api.unsplash.com/photos/random/?client_id=XYRQifXX_-x6Nroy6uWI4RcI-L1ufecX4TPi_iIFN4k&orientation=portrait";

    constructor(url = null) {
        if (url !== null) {
            this.url = url;
        }
    }

    addParam(paramName, paramValue) {
        if (typeof paramValue !== "string")
            throw new TypeError(
                `Error: Expected a string value for paramValue, got a ${typeof paramValue} instead.`
            );

        if (paramValue) this.url += `&${paramName}=${paramValue}`;
        return this;
    }
}

class UnsplashImage {
    static currImageObj;

    constructor(data, test = false) {
        if (test) {
            this.description = data.description;
            this.url = "http://placekitten.com/300/450";
            this.link = "http://placekitten.com";
            this.downloadUrl = "http://placekitten.com";
            this.author = `Kay (@kay)`;
            this.profileLink = "http://placekitten.com";
            this.profileImg = "http://placekitten.com/30/30";
            // this.hash = data.blur_hash;
            // this.blurWidth = 20;
            // this.blurHeight = this.#calcHeight(data.height / data.width);
        } else {
            this.description = data.description;
            this.url = `${data.urls.raw}?q=75&fm=jpg&w=300&fit=max`;
            this.link = data.links.html;
            this.downloadUrl = `${data.links.download_location}&client_id=XYRQifXX_-x6Nroy6uWI4RcI-L1ufecX4TPi_iIFN4k`;
            this.author = `${data.user.name} (@${data.user.username})`;
            this.profileLink = data.user.links.html;
            this.profileImg = data.user.profile_image.small;
            this.hash = data.blur_hash;
            this.blurWidth = 20;
            this.blurHeight = this.#calcHeight(data.height / data.width);
        }

        UnsplashImage.currImageObj = this;
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
        if (responce.ok) {
            const data = await responce.json();
            const image = new UnsplashImage(data);
            const blurhashImgData = await blurhash
                .decodePromise(image.hash, image.blurWidth, image.blurHeight)
                .then((blurhashImgData) => {
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
            $("#loading-div").append($canvas);
            $previewImg.attr("src", image.url).attr("alt", image.description);
            $profileLink.attr("href", image.profileLink).text(image.author);
            $imgLink.attr("href", image.link);
        } else {
            $("#loading-bg").remove();
            let errMsg;
            switch (responce.status) {
                case 403:
                    errMsg =
                        "You have reached the rate limit for the hour. Please try again later.";
                    break;
                case 404:
                    errMsg =
                        "Found no images that match the given search query.";
                    break;
                default:
                    errMsg = "Error. Something happened, idk.";
                    break;
            }
            createAlert("error", errMsg);
        }
    } catch (e) {
        console.error(`ERROR ${e.name}: ${e.message}`);
    } finally {
        $("#loading-bg").remove();
    }
}

$previewImg.on("load", () => {
    $("#blur-img").remove();
});

$("#randomizer-btn").on("click", async () => {
    const username = $("#username").val();
    if (!USERNAME_REGEX.test(username)) {
        createAlert(
            "error",
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
