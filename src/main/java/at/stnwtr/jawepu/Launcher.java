package at.stnwtr.jawepu;

import at.stnwtr.jawepu.core.App;
import io.javalin.community.ssl.SSLPlugin;
import io.javalin.community.ssl.TLSConfig;
import io.javalin.config.JavalinConfig;
import io.javalin.plugin.bundled.CorsPluginConfig;

import java.util.function.Consumer;

public class Launcher {
    public static void main(String[] args) {
        Consumer<JavalinConfig> javalinConfig = config -> {
            config.showJavalinBanner = false;
            config.plugins.enableCors(corsContainer -> corsContainer.add(CorsPluginConfig::anyHost));
            config.staticFiles.add("html");
            config.spaRoot.addFile("/", "/html/index.html");
            config.plugins.register(new SSLPlugin(sslConfig -> {
                sslConfig.pemFromClasspath("ssl/jawepu.crt", "ssl/jawepu.key");

                sslConfig.host = "0.0.0.0";
                sslConfig.insecure = true;
                sslConfig.secure = true;
                sslConfig.http2 = true;

                sslConfig.insecurePort = 30040;
                sslConfig.securePort = 30041;
                sslConfig.redirect = true;

                sslConfig.sniHostCheck = false;
                sslConfig.tlsConfig = TLSConfig.INTERMEDIATE;
            }));
        };

        new App(javalinConfig);
    }
}
