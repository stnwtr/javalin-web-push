class Status {
    constructor(id) {
        this.element = document.getElementById(id)
        this.element.innerText = ""
    }

    add(line) {
        if (this.element.innerText === "") {
            this.element.innerText = line
        } else {
            this.element.innerText += "\n" + line
        }
    }
}

async function requestPermission() {
    const status = new Status("perm-status")
    status.add("Requesting permission")

    if ("Notification" in window) {
        status.add("Browser does support notifications")
    } else {
        status.add("Browser does not support notifications")
        return
    }

    switch (Notification.permission) {
        case "granted": {
            status.add("Permission previously granted")
            break
        }
        case "denied": {
            status.add("Permission previously denied")
            break
        }
        case "default": {
            status.add("Asking for permission")
            const permission = await Notification.requestPermission()
            if (permission === "granted") {
                status.add("Permission granted")
            } else {
                status.add("Permission denied")
            }
        }
    }
}

async function localNotification() {
    const status = new Status("local-status")
    status.add("Sending local notification")

    status.add("Building notification")
    const notification = new Notification("Titel", {
        body: "The notification body",
        vibrate: [100, 200, 100],
        icon: "https://img.uxwing.com/wp-content/themes/uxwing/download/arrow-direction/random-icon.svg"
    })

    notification.onshow = () => {
        status.add("Showing notification")
    }

    notification.onclick = () => {
        status.add("Clicked notification")
    }

    notification.onclick = () => {
        status.add("Closed notification")
    }
}

async function checkWebPush() {
    const status = new Status("available-status")
    status.add("Check if service-worker and push-manager are available")

    if ("serviceWorker" in navigator && "PushManager" in window) {
        status.add("Yes, available")
    } else {
        status.add("Not available")
    }
}

async function getPubKey() {
    const status = new Status("pubkey-status")
    status.add("Fetch vapid public key")

    const key = await fetch(window.location.origin + "/api/vapid/public.key")
        .then(value => value.text())
        .catch(_ => null)

    if (!key) {
        status.add("Could not fetch public key")
    } else {
        status.add("Got public key")
        vapidPublicKey = key
    }
}

async function subscribe() {
    const status = new Status("sub-status")
    status.add("Subscribing to push notifications")

    await navigator.serviceWorker.register("service-worker.js")
    status.add("Registered service worker")

    const registration = await navigator.serviceWorker.ready

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
    })
    status.add("Subscribed!")

    const response = await fetch(window.location.origin + "/api/subscribe", {
        method: "post",
        body: JSON.stringify(subscription)
    }).then(x => x.text())
    status.add("Sent to server: " + response)
}

async function unsubscribe() {
    const status = new Status("unsub-status")
    status.add("Unsubscribing from push notifications")

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    const unsub = await subscription.unsubscribe()
    status.add("Unsubscribed: " + unsub)

    const unreg = await registration.unregister()
    status.add("Unregistered: " + unreg)

    const response = await fetch(window.location.origin + "/api/unsubscribe", {
        method: "delete"
    }).then(x => x.text())
    status.add("Sent to server: " + response)

    let time = 3
    setInterval(() => {
        status.add("Refreshing in " + time--)
        if (time <= 0) {
            window.location.reload()
        }
    }, 1000)
}

async function serverNotification() {
    const status = new Status("server-status")
    status.add("Requesting server push notification")

    const response = await fetch(window.location.origin + "/api/push", {
        method: "post"
    }).then(x => x.text())

    status.add("Sent to server: " + response)
}

let vapidPublicKey = null;

window.onload = () => {
    document.getElementById("perm-button").onclick = requestPermission
    document.getElementById("local-button").onclick = localNotification
    document.getElementById("available-button").onclick = checkWebPush
    document.getElementById("pubkey-button").onclick = getPubKey
    document.getElementById("sub-button").onclick = subscribe
    document.getElementById("unsub-button").onclick = unsubscribe
    document.getElementById("server-button").onclick = serverNotification;
}
