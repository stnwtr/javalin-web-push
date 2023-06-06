package at.stnwtr.jawepu.core;

import io.javalin.Javalin;
import io.javalin.config.JavalinConfig;
import io.javalin.http.NotFoundResponse;

import java.util.function.Consumer;

import static io.javalin.apibuilder.ApiBuilder.get;
import static io.javalin.apibuilder.ApiBuilder.path;

public class App {
    private final Javalin javalin;

    public App(Consumer<JavalinConfig> javalinConfig) {
        javalin = Javalin.create(javalinConfig).start();
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
                    }
                });
            });
        });
    }
}
