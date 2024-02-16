let collections = new Map();
const $assignBtn = $("#assign-btn");
const $accordion = $("#accordion");

const testImage = new UnsplashImage("", true);

console.log(testImage);

function createItem() {
    `<div id="item-1" class="item bg-palette-2">
    <button class="header w-full bg-palette-8 p-5 text-xl flex justify-between items-center">
        <h2 class="overflow-hidden">testemail@email.com</h2>
        <span class="icon-[ion--chevron-down] size-7"></span>
    </button>
    <div class="content transition-all flex gap-5 flex-wrap">
        <div class="h-48 relative">
            <img class="h-full w-full object-cover" src="http://placekitten.com/300/450" alt="">
            <div class="bg-black p-2 bg-opacity-75 absolute top-0 left-0 flex gap-3">
                <a href="" class="profile-icon-link opacity-75 hover:opacity-100" title="See profile on Unsplash"><img src="http://placekitten.com/30/30" class="size-6 rounded-full" alt=""></a>
                <a href="" class="usplash-icon-link opacity-75 hover:opacity-100" title="See image on Unsplash"><span class="icon-[ri--unsplash-fill] size-6 text-white"></span></a>
            </div>
        </div>
        <div class="h-48 relative">
            <img class="h-full w-full object-cover" src="http://placekitten.com/400/400" alt="">
            <div class="bg-black p-2 bg-opacity-75 absolute top-0 left-0 flex gap-3">
                <a href="" class="profile-icon-link opacity-75 hover:opacity-100" title="See profile on Unsplash"><img src="http://placekitten.com/30/30" class="size-6 rounded-full" alt=""></a>
                <a href="" class="usplash-icon-link opacity-75 hover:opacity-100" title="See image on Unsplash"><span class="icon-[ri--unsplash-fill] size-6 text-white"></span></a>
            </div>
        </div>
        <div class="h-48 relative">
            <img class="h-full w-full object-cover" src="http://placekitten.com/450/500" alt="">
            <div class="bg-black p-2 bg-opacity-75 absolute top-0 left-0 flex gap-3">
                <a href="" class="profile-icon-link opacity-75 hover:opacity-100" title="See profile on Unsplash"><img src="http://placekitten.com/30/30" class="size-6 rounded-full" alt=""></a>
                <a href="" class="usplash-icon-link opacity-75 hover:opacity-100" title="See image on Unsplash"><span class="icon-[ri--unsplash-fill] size-6 text-white"></span></a>
            </div>

        </div>                            
        <div class="h-48 relative">
            <img class="h-full w-full object-cover" src="http://placekitten.com/400/450" alt="">
            <div class="bg-black p-2 bg-opacity-75 absolute top-0 left-0 flex gap-3">
                <a href="" class="profile-icon-link opacity-75 hover:opacity-100" title="See profile on Unsplash"><img src="http://placekitten.com/30/30" class="size-6 rounded-full" alt=""></a>
                <a href="" class="usplash-icon-link opacity-75 hover:opacity-100" title="See image on Unsplash"><span class="icon-[ri--unsplash-fill] size-6 text-white"></span></a>
            </div>
        </div>
    </div>                    
</div>`;
}

async function triggerDownload(image) {
    const responce = await fetch(image.downloadUrl);
    return responce.ok;
}

function appendImage(emailObj, image) {
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
    if (!selectedEmailIds.size) {
        console.log("CANT ASSIGN NOTHING!!!");
        return;
    }

    selectedEmailIds.forEach(async (id) => {
        let image = UnsplashImage.currImageObj;
        if (collections.has(id) && collections.get(id).has(image.url)) return;

        let emailObj = Email.getEmailById(id);
        if (!collections.has(id)) {
            $accordion.append(emailObj.$item);
            collections.set(id, new Set());
        }
        appendImage(emailObj, image);
        removeEmailfromSelection(emailObj);
        collections.get(id).add(image.url);

        // await triggerDownload(image);
    });

    fetchImage(
        $("#query").val(),
        $("#username").val(),
        $("#content-filter").val()
    );
});
