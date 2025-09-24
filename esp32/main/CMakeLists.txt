idf_component_register(SRCS "main.c"
                       INCLUDE_DIRS "."
                       REQUIRES bme280 driver esp_wifi nvs_flash)
