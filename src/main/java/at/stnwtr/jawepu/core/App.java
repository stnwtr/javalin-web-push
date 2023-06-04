package at.stnwtr.jawepu.core;

import io.javalin.Javalin;
import io.javalin.config.JavalinConfig;

import java.util.function.Consumer;

public class App {
    private final Javalin javalin;

    public App(Consumer<JavalinConfig> javalinConfig) {
        javalin = Javalin.create(javalinConfig).start();
        Runtime.getRuntime().addShutdownHook(new Thread(javalin::stop));
    }
}
