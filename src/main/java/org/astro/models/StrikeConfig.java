package org.astro.models;

public record StrikeConfig(
        String sound,
        String title,
        String text,
        String srcImage,
        int type
) {

    public StrikeConfig {
        if (sound == null || sound.isBlank()) {
            throw new IllegalArgumentException("Sound cannot be null or empty");
        }
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Text cannot be null or empty");
        }
    }
}