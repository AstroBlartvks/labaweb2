package org.astro

import org.apache.catalina.Context
import org.apache.catalina.LifecycleException
import org.apache.catalina.startup.Tomcat
import org.apache.catalina.webresources.{DirResourceSet, StandardRoot}

import java.io.File
import java.nio.file.{Files, Path, Paths}
import scala.util.{Try, Using}

object EmbeddedTomcatApp {

  def main(args: Array[String]): Unit = {
    val port = System.getProperty("server.port", "8080")

    val tomcat = new Tomcat()
    tomcat.setPort(port.toInt)
    tomcat.getConnector

    val webappDirLocation = {
      val defaultLocation = "src/main/webapp/"
      val workingDir = System.getProperty("user.dir")
      val webappPath = Paths.get(workingDir, defaultLocation)

      if (Files.exists(webappPath)) {
        webappPath.toString
      } else {
        val tempWebapp = Files.createTempDirectory("webapp")
        extractWebappResources(tempWebapp)
        tempWebapp.toString
      }
    }

    val ctx = tomcat.addWebapp("", new File(webappDirLocation).getAbsolutePath)

    val additionWebInfClasses = new File("target/classes")
    if (additionWebInfClasses.exists()) {
      val resources = new StandardRoot(ctx)
      resources.addPreResources(new DirResourceSet(resources, "/WEB-INF/classes",
        additionWebInfClasses.getAbsolutePath, "/"))
      ctx.setResources(resources)
    }

    println(s"Starting Tomcat on port $port")
    println(s"Application will be available at: http://localhost:$port/")

    tomcat.start()
    tomcat.getServer.await()
  }

  private def extractWebappResources(tempDir: Path): Unit = {
    Files.createDirectories(tempDir.resolve("WEB-INF"))
    Files.createDirectories(tempDir.resolve("css"))
    Files.createDirectories(tempDir.resolve("js"))

    Try {
      Option(getClass.getClassLoader.getResourceAsStream("META-INF/webapp/WEB-INF/web.xml"))
        .foreach { webXmlContent =>
          Using(webXmlContent) { stream =>
            Files.copy(stream, tempDir.resolve("WEB-INF/web.xml"))
          }
        }
    }.recover {
      case e: Exception =>
        println(s"Could not copy web.xml: ${e.getMessage}")
    }

    extractResourceFromClasspath("META-INF/webapp/index.jsp", tempDir.resolve("index.jsp"))
    extractResourceFromClasspath("META-INF/webapp/result.jsp", tempDir.resolve("result.jsp"))
    extractResourceFromClasspath("META-INF/webapp/error.jsp", tempDir.resolve("error.jsp"))
    extractResourceFromClasspath("META-INF/webapp/css/style.css", tempDir.resolve("css/style.css"))
    extractResourceFromClasspath("META-INF/webapp/js/script.js", tempDir.resolve("js/script.js"))
  }

  private def extractResourceFromClasspath(resourcePath: String, targetPath: Path): Unit = {
    Try {
      Option(getClass.getClassLoader.getResourceAsStream(resourcePath))
        .foreach { inputStream =>
          Using(inputStream) { stream =>
            Files.createDirectories(targetPath.getParent)
            Files.copy(stream, targetPath)
          }
        }
    }.recover {
      case e: Exception =>
        println(s"Could not extract $resourcePath: ${e.getMessage}")
    }
  }
}