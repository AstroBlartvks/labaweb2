package org.astro;

public class Main {
    public static void main(String[] args) {
        try {
            EmbeddedTomcatApp.main(args);
        } catch (Exception e) {
            System.err.println("Failed to start embedded server: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}

