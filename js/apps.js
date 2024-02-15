function replaceClass(jqObj, current, replacement) {
    jqObj.removeClass(current);
    jqObj.addClass(replacement);
}

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
