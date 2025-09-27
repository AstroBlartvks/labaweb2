package org.astro.imageHandler;

import jakarta.servlet.ServletContext;
import org.astro.Vars;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;

public class PixelReader {
    private static volatile BufferedImage image;

    public static synchronized void init(ServletContext context) {
        if (image != null) {
            return;
        }

        try (InputStream is = context.getResourceAsStream(Vars.CHECK_AREA_FILE)) {
            if (is == null) {
                throw new RuntimeException("Image file not found: " + Vars.CHECK_AREA_FILE);
            }
            image = ImageIO.read(is);
            System.out.println("Image loaded successfully: " + Vars.CHECK_AREA_FILE);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load image", e);
        }
    }

    public static String getPixelStandard(int x, int y) throws IOException {
        BufferedImage img = image;
        if (img == null) {
            throw new IllegalStateException("PixelReader not initialized");
        }

        if (x < 0 || x >= img.getWidth() || y < 0 || y >= img.getHeight()) {
            throw new IOException("Coordinates out of bounds: (" + x + ", " + y + ")");
        }

        return String.format("%06X", img.getRGB(x, y) & 0xFFFFFF);
    }
}
