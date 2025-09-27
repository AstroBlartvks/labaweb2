package org.astro.models;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.astro.Vars;
import jakarta.servlet.ServletContext;

import java.io.InputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class StrikeConfigService {
    private final Map<String, StrikeConfig> configMap;
    private final ObjectMapper objectMapper;
    private static volatile StrikeConfigService instance;

    public static synchronized void init(ServletContext context) throws IOException {
        if (instance == null) {
            instance = new StrikeConfigService(context);
        }
    }

    public static StrikeConfigService getInstance() {
        StrikeConfigService result = instance;
        if (result == null) {
            throw new IllegalStateException("StrikeConfigService not initialized");
        }
        return result;
    }

    private StrikeConfigService(ServletContext context) throws IOException {
        this.configMap = new HashMap<>();
        this.objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();
        loadConfig(context, Vars.STRIKE_CONFIG_FILE);
    }

    /**
     * Загружает конфигурацию из JSON файла
     */
    private void loadConfig(ServletContext context, String filePath) throws IOException {
        System.out.println("Attempting to load config from: " + filePath);

        InputStream inputStream = context.getResourceAsStream(filePath);

        if (inputStream == null) {
            throw new IOException("Config file not found in web context: " + filePath);
        }

        try {
            JsonNode rootNode = objectMapper.readTree(inputStream);

            configMap.clear();

            var fields = rootNode.fields();
            while (fields.hasNext()) {
                var entry = fields.next();
                String hexCode = entry.getKey().toUpperCase();
                JsonNode configNode = entry.getValue();

                try {
                    StrikeConfig config = objectMapper.treeToValue(configNode, StrikeConfig.class);
                    configMap.put(hexCode, config);
                } catch (Exception e) {
                    throw new IOException("Invalid configuration for hex code: " + hexCode, e);
                }
            }

            System.out.println("Loaded " + configMap.size() + " strike configurations");
        } finally {
            inputStream.close();
        }
    }

    public StrikeConfig getConfigByHexCode(String hexCode) {
        String normalizedHex = normalizeHexCode(hexCode);

        if (!configMap.containsKey(normalizedHex)) {
            return configMap.get("DEFAULT");
        }

        return configMap.get(normalizedHex);
    }

    public Optional<StrikeConfig> getConfigByHexCodeSafe(String hexCode) {
        String normalizedHex = normalizeHexCode(hexCode);
        return Optional.ofNullable(configMap.get(normalizedHex));
    }

    public boolean containsHexCode(String hexCode) {
        return configMap.containsKey(normalizeHexCode(hexCode));
    }

    public Map<String, StrikeConfig> getAllConfigs() {
        return new HashMap<>(configMap);
    }

    private String normalizeHexCode(String hexCode) {
        if (hexCode == null) {
            throw new IllegalArgumentException("Hex code cannot be null");
        }

        return hexCode.replace("#", "").toUpperCase();
    }
}
