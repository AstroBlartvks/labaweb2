package org.astro.services;

import org.astro.models.Point;
import org.astro.models.StrikeConfigService;

import java.io.IOException;

import static org.astro.imageHandler.PixelReader.getPixelStandard;

public class CheckPointHit {
    public static synchronized void check(Point point) throws IOException {
        int roundedX = (int) Math.round(point.getX());
        int roundedY = (int) Math.round(point.getY());
        String hexCode = getPixelStandard(roundedX, roundedY);

        System.out.println("Исходные координаты: X=" + roundedX + ", Y=" + roundedY + ", HEX=" + hexCode);

        point.setConfig(StrikeConfigService.getInstance().getConfigByHexCode(hexCode));

        point.setHit(point.getConfig().type() == 1);
    }
}
