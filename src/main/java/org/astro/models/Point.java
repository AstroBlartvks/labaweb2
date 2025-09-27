package org.astro.models;

import java.io.IOException;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.astro.imageHandler.PixelReader.getPixelStandard;

/**
 * Представляет точку в двумерном пространстве с дополнительной информацией о попадании в заданную область.
 * Логика определения попадания основана на координатах (x, y).
 * Точка также хранит временную метку создания.
 */
public class Point implements Serializable {
    private double x;
    private double y;
    private boolean hit;
    private String timestamp;
    private StrikeConfig config;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    public double getX() { return x; }
    public double getY() { return y; }

    public StrikeConfig getConfig() { return config; }

    public void setConfig(StrikeConfig config) { this.config = config; }

    public void setHit(boolean hit) { this.hit = hit; }

    public boolean isHit() { return hit; }
    public String getTimestamp() { return timestamp; }

    public String title() {
        return config.title();
    }

    public String text() {
        return config.text();
    }

    public String srcImage() {
        return "./images/" + config.srcImage();
    }

    public String sound() {
        return "./sounds/" + config.sound();
    }
}
