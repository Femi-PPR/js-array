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
    let colour;
    let iconType;
    type = type.toLowerCase();
    switch (type) {
        case "warning":
            colour = "yellow";
            iconType = "exclamation-triangle";
            break;
        case "error":
            colour = "red";
            iconType = "x-circle";
            break;
        case "success":
            colour = "green";
            iconType = "check-circle";
            break;
        default:
            throw new TypeError("An invalid alert type was given");
    }

    let capitalType = type.charAt(0).toUpperCase() + type.slice(1);
    let alert = {
        msg: msg,
    };

    alert.$elem = $(`<div data-type="${type}" class="alert flex container p-3.5 rounded items-center gap-2 bg-${colour}-50">
    <span class="icon-[heroicons--${iconType}-16-solid] bg-${colour}-400"></span>
    <div>
        <h2 class="inline text-${colour}-800">${capitalType}: </h2>
        <p class="inline text-${colour}-700">${escapeHtml(msg)}</p>
    </div>
    <button class="ml-auto flex p-1.5 rounded hover:bg-${colour}-100"><span class="icon-[fluent--dismiss-16-filled] text-${colour}-500"></span></button>
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

// $("#select-btn").click(() => {
//     console.log("plink");
//     createAlert("error", "Bad very bad bad");
//     createAlert("warning", "Bad very bad bad");
//     createAlert("success", "Bad very bad bad");
// });

$alertWrapper.on("click", ".alert", (event) => {
    let $target = $(event.currentTarget);
    let data = $target.data();
    let msg = $target.find("p").text();
    console.log(msg);
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
    console.log();
});
