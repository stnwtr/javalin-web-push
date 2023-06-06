# Javalin Web Push

Web push notification using modern web push api and javalin.

## Generate certificate

`openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout private.key -out certificate.crt`

## Generate vapid keys

Vapid keys from [here](https://vapidkeys.com/)
