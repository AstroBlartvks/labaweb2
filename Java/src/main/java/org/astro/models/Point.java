package org.astro.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Представляет точку в двумерном пространстве с дополнительной информацией о попадании в заданную область.
 * Логика определения попадания основана на координатах (x, y) и радиусе r.
 * Точка также хранит временную метку создания.
 */
public class Point implements Serializable {
    private double x;
    private double y;
    private double r;
    private boolean hit;
    private String timestamp;

    public Point(double x, double y, double r) {
        /**
         * Создает объект Point с заданными координатами и радиусом.
         * Статус попадания определяется вызовом метода {@link #checkHit()}.
         * Временная метка устанавливается в текущее время в формате "HH:mm:ss".
         *
         * @param x координата x точки
         * @param y координата y точки
         * @param r радиус, используемый для определения попадания
         */
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = checkHit();
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    private boolean checkHit() {
        /**
         * Проверяет, попадает ли точка (x, y) в заданную область относительно радиуса r.
         * Область определяется следующим образом в зависимости от четверти:
         * - В первой четверти (x >= 0, y >= 0): точка должна находиться внутри квадрата со стороной r.
         * - В четвертой четверти (x >= 0, y <= 0): точка должна находиться внутри четверти окружности радиусом r/2.
         * - В третьей четверти (x <= 0, y <= 0): точка должна находиться выше линии y = -2*x - r.
         * - В второй четверти (x <= 0, y >= 0): точка считается вне области.
         *
         * @return true, если точка попадает в область, иначе false
         */
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