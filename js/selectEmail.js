let selectedEmails = [];
const $emailSelectElem = $("#existing-emails");
const $emailInputElem = $("#new-email");
const $selectBtn = $("#select-btn");
const selectedDiv = $("#selected-div");

class Email {
    static count = 0;
    static emailList = new Set();
    static idLookupTable = new Map();

    constructor(email) {
        this.email = email;
        this.id = ++Email.count;
        this.$option = $(`<option value="${this.id}">${this.email}</option>`);
        this.$selected = $(
            `<span>${this.email} <i data-id="${this.id}" class="remove-email icon-[mdi--remove]"></i></span>`
        );
        Email.emailList.add(email);
        Email.idLookupTable.set(this.id, this);
    }

    static exists(email) {
        return Email.emailList.has(email);
    }

    static findEmailById(id) {
        return Email.idLookupTable.get(id);
    }

    removeOption() {
        this.$option.remove();
    }

    removeSelected() {
        this.$selected.remove();
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

function addEmailtoSelection(emailObj) {}

$emailInputElem.on("input", () => {
    let disableSelect = $emailInputElem.val() !== "";
    $emailSelectElem.attr("disabled", disableSelect);
});

$selectBtn.click(() => {
    if ($emailInputElem.val() === "" && $emailSelectElem.val() === null) {
        console.log("THERE IS NOTHING HERE!!!!!!");
        return;
    }

    if ($emailInputElem.val() !== "") {
        let email = escapeHtml($emailInputElem.val());
        selectedEmails.push(email);
        new Email(email);
    }
});
