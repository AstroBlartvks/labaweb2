package org.astro;

import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.StandardRoot;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class EmbeddedTomcatApp {

    public static void main(String[] args) throws LifecycleException, IOException {

        String port = System.getProperty("server.port", "8080");

        Tomcat tomcat = new Tomcat();
        tomcat.setPort(Integer.parseInt(port));
        tomcat.getConnector();

        String webappDirLocation = "src/main/webapp/";
        String workingDir = System.getProperty("user.dir");
        Path webappPath = Paths.get(workingDir, webappDirLocation);

        if (!Files.exists(webappPath)) {
            Path tempWebapp = Files.createTempDirectory("webapp");
            extractWebappResources(tempWebapp);
            webappDirLocation = tempWebapp.toString();
        } else {
            webappDirLocation = webappPath.toString();
        }

        Context ctx = tomcat.addWebapp("", new File(webappDirLocation).getAbsolutePath());

        File additionWebInfClasses = new File("target/classes");
        if (additionWebInfClasses.exists()) {
            StandardRoot resources = new StandardRoot(ctx);
            resources.addPreResources(new DirResourceSet(resources, "/WEB-INF/classes",
                    additionWebInfClasses.getAbsolutePath(), "/"));
            ctx.setResources(resources);
        }

        System.out.println("Starting Tomcat on port " + port);
        System.out.println("Application will be available at: http://localhost:" + port + "/");

        tomcat.start();
        tomcat.getServer().await();
    }

    private static void extractWebappResources(Path tempDir) throws IOException {
        Files.createDirectories(tempDir.resolve("WEB-INF"));
        Files.createDirectories(tempDir.resolve("css"));
        Files.createDirectories(tempDir.resolve("js"));

        try {
            var webXmlContent = EmbeddedTomcatApp.class.getClassLoader()
                    .getResourceAsStream("META-INF/webapp/WEB-INF/web.xml");
            if (webXmlContent != null) {
                Files.copy(webXmlContent, tempDir.resolve("WEB-INF/web.xml"));
            }
        } catch (Exception e) {
            System.out.println("Could not copy web.xml: " + e.getMessage());
        }

        // Extract other webapp resources from classpath
        extractResourceFromClasspath("META-INF/webapp/index.jsp", tempDir.resolve("index.jsp"));
        extractResourceFromClasspath("META-INF/webapp/result.jsp", tempDir.resolve("result.jsp"));
        extractResourceFromClasspath("META-INF/webapp/error.jsp", tempDir.resolve("error.jsp"));
        extractResourceFromClasspath("META-INF/webapp/css/style.css", tempDir.resolve("css/style.css"));
        extractResourceFromClasspath("META-INF/webapp/js/script.js", tempDir.resolve("js/script.js"));
    }

    private static void extractResourceFromClasspath(String resourcePath, Path targetPath) {
        try {
            var inputStream = EmbeddedTomcatApp.class.getClassLoader().getResourceAsStream(resourcePath);
            if (inputStream != null) {
                Files.createDirectories(targetPath.getParent());
                Files.copy(inputStream, targetPath);
            }
        } catch (Exception e) {
            System.out.println("Could not extract " + resourcePath + ": " + e.getMessage());
        }
    }
}