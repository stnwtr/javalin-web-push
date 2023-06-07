package at.stnwtr.jawepu.core;

import com.google.gson.JsonParser;
import io.javalin.Javalin;
import io.javalin.config.JavalinConfig;
import io.javalin.http.NotFoundResponse;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.function.Consumer;

import static io.javalin.apibuilder.ApiBuilder.*;

public class App {
    private final Javalin javalin;
    private final PushService pushService;
    private Subscription subscription;

    public App(Consumer<JavalinConfig> javalinConfig) {
        javalin = Javalin.create(javalinConfig).start();
        pushService = generatePushService();

        Runtime.getRuntime().addShutdownHook(new Thread(javalin::stop));

        javalin.routes(() -> {
            path("/api", () -> {
                get("/vapid/public.key", ctx -> {
                    try (var is = App.class.getClassLoader().getResourceAsStream("vapid/public.key")) {
                        if (is != null) {
                            ctx.result(new String(is.readAllBytes()));
                        } else {
                            throw new NotFoundResponse();
                        }
                    } catch (IOException e) {
                        throw new NotFoundResponse();
                    }
                });
                post("/subscribe", ctx -> {
                    var json = JsonParser.parseString(ctx.body()).getAsJsonObject();
                    subscription = new Subscription(
                            json.get("endpoint").getAsString(),
                            new Subscription.Keys(
                                    json.get("keys").getAsJsonObject().get("p256dh").getAsString(),
                                    json.get("keys").getAsJsonObject().get("auth").getAsString()
                            )
                    );

                    ctx.result("done");
                });
                delete("/unsubscribe", ctx -> {
                    subscription = null;
                    ctx.result("done");
                });
                post("/push", ctx -> {
                    pushService.send(new Notification(subscription, "Hello world"));
                    ctx.result("done");
                });
            });
        });
    }

    private static PushService generatePushService() {
        try (var pub = App.class.getClassLoader().getResourceAsStream("vapid/public.key");
             var priv = App.class.getClassLoader().getResourceAsStream("vapid/private.key")) {

            if (pub == null || priv == null) {
                throw new RuntimeException();
            }

            return new PushService(
                    new String(pub.readAllBytes()),
                    new String(priv.readAllBytes()),
                    "mailto: <name@domain.com>"
            );
        } catch (IOException | GeneralSecurityException e) {
            throw new RuntimeException();
        }
    }
}
