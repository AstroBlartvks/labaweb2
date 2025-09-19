package org.astro.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Point implements Serializable {
    private double x;
    private double y;
    private double r;
    private boolean hit;
    private String timestamp;

    public Point(double x, double y, double r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = checkHit();
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    private boolean checkHit() {
        if (x >= 0 && y >= 0) {
            return x <= r && y <= r;
        }

        if (x>= 0 && y <= 0) {
            return x*x + y*y <= (r/2)*(r/2);
        }

        if (x <= 0 && y <= 0) {
            return y >= -2*x - r;
        }

        return false;
    }

    public double getX() { return x; }
    public double getY() { return y; }
    public double getR() { return r; }
    public boolean isHit() { return hit; }
    public String getTimestamp() { return timestamp; }
}