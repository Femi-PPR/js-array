let activeWarnings = new Map();
let activeErrors = new Map();
let activeSuccesses = new Map();

function createAlert(type, msg) {
    let colour;
    switch (type.toLowerCase()) {
        case "warning":
            colour = "yellow";
            break;
        case "error":
            colour = "red";
            break;
        case "success":
            colour = "green";
            break;
        default:
            throw new TypeError("An invalid alert type was given");
    }

    let alert = {
        bg: `bg-${colour}-50`,
        body: `bg-${colour}-700`,
        head: `bg-${colour}-800`,
        dismiss: `bg-${colour}-500`,
        iconColor: `bg-${colour}-400`,
        icon: "",
        msg: msg,
    };
}
