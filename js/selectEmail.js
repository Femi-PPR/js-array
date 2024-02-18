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
        this.$option = $(
            `<option value="${this.id}" class="overflow-hidden min-w-0 text-ellipsis max-w-full">${this.email}</option>`
        );
        this.$selected = $(
            `<small class="flex gap-1 max-w-72 items-center"><span class="overflow-hidden text-ellipsis">${this.email}</span> <i data-id="${this.id}" class="remove-email cursor-pointer text-red-600 hover:text-red-700 min-w-3 icon-[mdi--remove-bold]"></i></small>`
        );
        this.$item = $(`<div id="item-1" class="item bg-palette-2">
    <button class="header w-full bg-palette-8 p-5 text-xl flex gap-3 justify-between items-center">
        <h2 class="overflow-hidden text-ellipsis">${this.email}</h2>
        <span class="icon-[ion--chevron-down] min-w-7 size-7"></span>
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
    $emailSelectElem.prop("disabled", disableSelect);
});

function emailValid(email) {
    let input = document.getElementById("new-email");
    let validity = input.validity;

    if (Email.exists(email)) {
        createAlert(
            "error",
            "The email address you provided already exists. Please use a different email address."
        );
        return false;
    }

    if (Email.count >= 30) {
        createAlert(
            "error",
            "You have reached the maximum limit for email additions. No further emails can be added at this time."
        );
        return false;
    }
    if (validity.typeMismatch) {
        createAlert(
            "error",
            "The email you provided is not valid. Please enter a valid email address."
        );
        return false;
    }

    return true;
}

$selectBtn.click(() => {
    if ($emailInputElem.val() === "" && $emailSelectElem.val() === null) {
        createAlert(
            "error",
            "No email address has been provided to be selected. Please enter an email address."
        );
        return;
    }

    if ($emailInputElem.val() !== "") {
        let email = escapeHtml($emailInputElem.val());
        if (!emailValid(email)) return;

        addEmailtoSelection(new Email(email));
        $emailInputElem.val("");
        $emailSelectElem.prop("disabled", false);
    } else {
        let id = parseInt($emailSelectElem.val());
        let emailObj = Email.getEmailById(id);
        addEmailtoSelection(emailObj);
        emailObj.removeOption();
        if ($emailSelectElem.children().length === 1) {
            $("#default-selection").prop("selected", true);
        }
    }
});

$selectedDiv.on("click", ".remove-email", (event) => {
    const $target = $(event.target);
    removeEmailfromSelection(Email.getEmailById($target.data("id")));
});
