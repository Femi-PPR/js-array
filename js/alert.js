let activeWarnings = new Map();
let activeErrors = new Map();
let activeSuccesses = new Map();
const $alertWrapper = $("#alert-wrapper");

function removeAlert(alertMap, msg) {
    let prevAlert = alertMap.get(msg);
    clearTimeout(prevAlert.timeout);
    prevAlert.$elem.stop().hide();
    prevAlert.$elem.remove();
    alertMap.delete(msg);
}

function slideUpAlert(alertMap, elem, msg) {
    elem.slideUp(
        (complete = () => {
            removeAlert(alertMap, msg);
        })
    );
}

function addToActiveAlerts(alertMap, alert) {
    if (alertMap.has(alert.msg)) removeAlert(alertMap, alert.msg);
    $alertWrapper.prepend(alert.$elem);

    alert.$elem.slideDown();
    let timeout = setTimeout(() => {
        slideUpAlert(alertMap, alert.$elem, alert.msg);
    }, 5000);
    alertMap.set(alert.msg, {
        timeout: timeout,
        $elem: alert.$elem,
    });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function createAlert(type, msg) {
    let alertStyles;
    type = type.toLowerCase();
    switch (type) {
        case "warning":
            alertStyles = {
                bg: "bg-yellow-50",
                icon: "icon-[heroicons--exclamation-triangle-16-solid]",
                iconColor: "bg-yellow-400",
                head: "text-yellow-800",
                body: "text-yellow-700",
                dismiss: "text-yellow-500",
                dismissHover: "hover:bg-yellow-100",
            };
            break;
        case "error":
            alertStyles = {
                bg: "bg-red-50",
                icon: "icon-[heroicons--x-circle-16-solid]",
                iconColor: "bg-red-400",
                head: "text-red-800",
                body: "text-red-700",
                dismiss: "text-red-500",
                dismissHover: "hover:bg-red-100",
            };
            break;
        case "success":
            alertStyles = {
                bg: "bg-green-50",
                icon: "icon-[heroicons--check-circle-16-solid]",
                iconColor: "bg-green-400",
                head: "text-green-800",
                body: "text-green-700",
                dismiss: "text-green-500",
                dismissHover: "hover:bg-green-100",
            };
            break;
        default:
            throw new TypeError("An invalid alert type was given");
    }

    let capitalType = type.charAt(0).toUpperCase() + type.slice(1);
    let alert = { msg: msg };

    alert.$elem = $(`<div data-type="${type}" class="alert flex container p-3.5 rounded items-center gap-2 ${
        alertStyles.bg
    }">
    <span class=" min-w-4 ${alertStyles.icon} ${alertStyles.iconColor}"></span>
    <div>
        <h2 class="inline ${alertStyles.head}">${capitalType}: </h2>
        <p class="inline ${alertStyles.body}">${escapeHtml(msg)}</p>
    </div>
    <button class="ml-auto flex p-1.5 rounded ${
        alertStyles.dismissHover
    }"><span class="icon-[fluent--dismiss-16-filled] ${
        alertStyles.dismiss
    }"></span></button>
</div>`).hide();

    switch (type.toLowerCase()) {
        case "warning":
            addToActiveAlerts(activeWarnings, alert);
            break;
        case "error":
            addToActiveAlerts(activeErrors, alert);
            break;
        case "success":
            addToActiveAlerts(activeSuccesses, alert);
            break;
        default:
            throw new TypeError("An invalid alert type was given");
    }
}

$alertWrapper.on("click", ".alert", (event) => {
    let $target = $(event.currentTarget);
    let data = $target.data();
    let msg = $target.find("p").text();
    if (Object.keys(data).length) {
        switch (data.type.toLowerCase()) {
            case "warning":
                slideUpAlert(activeWarnings, $target, msg);
                break;
            case "error":
                slideUpAlert(activeErrors, $target, msg);
                break;
            case "success":
                slideUpAlert(activeSuccesses, $target, msg);
                break;
            default:
                throw new TypeError("An invalid alert type was given");
        }
    }
});
