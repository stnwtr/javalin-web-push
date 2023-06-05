window.onload = () => {
    document.getElementById("perm-button").onclick = () => {
        const status = document.getElementById("perm-status")
        status.innerText = ""

        if ("Notification" in window) {
            status.innerText = "Browser does support notifications"
        } else {
            status.innerText = "Browser does not support notifications"
            return
        }

        switch (Notification.permission) {
            case "granted":
                status.innerText += "\n" + "Permission previously granted";
                break
            case "denied":
                status.innerText += "\n" + "Permission previously denied";
                break
            case "default": {
                status.innerText += "\n Asking for permission"
                Notification.requestPermission().then(value => {
                    if (value === "granted") {
                        status.innerText += "\n" + "Permission granted"
                    } else {
                        status.innerText += "\n" + "Permission denied"
                    }
                }).catch(reason => {
                    status.innerText += "\n" + reason
                })
            }
        }
    }

    document.getElementById("local-button").onclick = () => {
        const status = document.getElementById("local-status")
        status.innerText = ""

        status.innerText = "Building notification"
        const notification = new Notification("Titel", {
            body: "The Notification body",
            vibrate: [100, 200, 100],
            icon: "https://img.uxwing.com/wp-content/themes/uxwing/download/arrow-direction/random-icon.svg"
        })

        notification.onshow = () => {
            status.innerText += "\n" + "Showing notification"
        }

        notification.onclick = () => {
            status.innerText += "\n" + "Clicked notification"
        }

        notification.onclick = () => {
            status.innerText += "\n" + "Closed notification"
        }
    }
}
