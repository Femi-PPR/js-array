let collections = new Map();
const $assignBtn = $("#assign-btn");
const $accordion = $("#accordion");

async function triggerDownload(image) {
    let responce = await fetch(image.downloadUrl);
    return responce.ok;
}

function appendImageToEmail(emailObj, image) {
    let imageStr = `<div class="h-48 relative">
    <img class="h-full w-full object-cover" src="${image.url}" alt="${image.description}">
    <div class="bg-black p-2 bg-opacity-75 absolute top-0 left-0 flex gap-3">
        <a href="${image.profileLink}" target="_blank" class="profile-icon-link opacity-75 hover:opacity-100" title="See profile on Unsplash"><img src="${image.profileImg}" class="size-6 rounded-full" alt="Profile picture of ${image.author}"></a>
        <a href="${image.link}" target="_blank" class="usplash-icon-link opacity-75 hover:opacity-100" title="See image on Unsplash"><span class="icon-[ri--unsplash-fill] size-6 text-white"></span></a>
    </div>
</div>`;
    emailObj.appendToItem(imageStr);
}

$assignBtn.click(async () => {
    if (UnsplashImage.currImageObj === undefined) {
        createAlert(
            "error",
            "No image is currently selected. Please press the 'Randomize Image' button to select an image."
        );
        return;
    }
    if (!selectedEmailIds.size) {
        createAlert(
            "error",
            "Can't assign image before emails have been selected"
        );
        return;
    }

    $("#no-collections").hide();

    let alreadyInOneCollection = false;
    let alreadyInAllCollections = true;

    selectedEmailIds.forEach(async (id) => {
        let image = UnsplashImage.currImageObj;
        let emailObj = Email.getEmailById(id);
        if (collections.has(id) && collections.get(id).has(image.url)) {
            alreadyInOneCollection = true;
        } else {
            if (!collections.has(id)) {
                $accordion.append(emailObj.$item);
                collections.set(id, new Set());
            }
            appendImageToEmail(emailObj, image);
            collections.get(id).add(image.url);

            alreadyInAllCollections = false;
            await triggerDownload(image);
        }
    });
    if (!alreadyInOneCollection)
        createAlert(
            "success",
            "Added image to every selected emails collection"
        );
    else if (!alreadyInAllCollections)
        createAlert(
            "warning",
            "Image was not added to all selected emails collections as it already exists some of them"
        );
    else
        createAlert(
            "error",
            "Image was not added to any selected emails collections as it already exists in all of them"
        );
});
