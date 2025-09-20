package org.astro

object Main {
  def main(args: Array[String]): Unit = {
    try {
      EmbeddedTomcatApp.main(args)
    } catch {
      case e: Exception =>
        System.err.println(s"Failed to start embedded server: ${e.getMessage}")
        e.printStackTrace()
        System.exit(1)
    }
  }
}