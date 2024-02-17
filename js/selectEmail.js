let selectedEmailIds = new Set();
const $emailSelectElem = $("#existing-emails");
const $emailInputElem = $("#new-email");
const $selectBtn = $("#select-btn");
const $selectedDiv = $("#selected-div");

class Email {
    static count = 0;
    static emailList = new Set();
    static idLookupTable = new Map();

    constructor(email) {
        this.email = email;
        this.id = ++Email.count;
        this.$option = $(`<option value="${this.id}">${this.email}</option>`);
        this.$selected = $(
            `<small class="flex gap-1 items-center">${this.email} <i data-id="${this.id}" class="remove-email cursor-pointer text-red-600 icon-[mdi--remove-bold]"></i></small>`
        );
        this.$item = $(`<div id="item-1" class="item bg-palette-2">
    <button class="header w-full bg-palette-8 p-5 text-xl flex justify-between items-center">
        <h2 class="overflow-hidden">${this.email}</h2>
        <span class="icon-[ion--chevron-down] size-7"></span>
    </button>
    <div class="content transition-all flex gap-5 flex-wrap">
    </div>                    
</div>`);
        Email.emailList.add(email);
        Email.idLookupTable.set(this.id, this);
    }

    static exists(email) {
        return Email.emailList.has(email);
    }

    static getEmailById(id) {
        return Email.idLookupTable.get(id);
    }

    removeOption() {
        this.$option.remove();
    }

    removeSelected() {
        this.$selected.remove();
    }

    appendToItem(elemStr) {
        this.$item.children(".content").append(elemStr);
    }
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function addEmailtoSelection(emailObj) {
    selectedEmailIds.add(emailObj.id);
    $selectedDiv.append(emailObj.$selected);
}

function removeEmailfromSelection(emailObj) {
    selectedEmailIds.delete(emailObj.id);
    emailObj.removeSelected();
    $emailSelectElem.append(emailObj.$option);
}

$emailInputElem.on("input", () => {
    let disableSelect = $emailInputElem.val() !== "";
    $emailSelectElem.attr("disabled", disableSelect);
});

$selectBtn.click(() => {
    if ($emailInputElem.val() === "" && $emailSelectElem.val() === null) {
        createAlert("error", "THERE IS NOTHING HERE!!!!!!");
        return;
    }

    if ($emailInputElem.val() !== "") {
        let email = escapeHtml($emailInputElem.val());

        if (Email.exists(email)) {
            createAlert("error", "ALREADY EXISTS EMAIL!!!!!!");
            return;
        }

        if (Email.count >= 30) {
            createAlert("error", "TOO MANY EMAILS ALREADY. NO MORE!!!!!!");
            return;
        }

        addEmailtoSelection(new Email(email));
        $emailInputElem.val("");
        $emailSelectElem.attr("disabled", false);
    } else {
        let id = parseInt($emailSelectElem.val());
        let emailObj = Email.getEmailById(id);
        addEmailtoSelection(emailObj);
        emailObj.removeOption();
    }
});
// Quiexercitationculpasuntcillumdolor.Loremdoloreconsecteturmagnaconsequatmagnaveniamnonadipisicingmagnamagnaenimnulla.Mollitdolaborumconsequatidsuntexercitationmagnacommododolornisiadnon.Iddolorlaboreoccaecatsuntconsequatadipisicingadsuntreprehenderitaliquip.Occaecatetidcommodoadidexcepteurnonvoluptate.Nonveniamdolorduisconsequatestenimipsumoccaecatad.
$selectedDiv.on("click", ".remove-email", (event) => {
    const $target = $(event.target);
    console.log($target.data("id"));
    removeEmailfromSelection(Email.getEmailById($target.data("id")));
});
