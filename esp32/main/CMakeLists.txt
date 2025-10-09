idf_component_register(SRCS "main.c"
                       INCLUDE_DIRS "."
                       EMBED_FILES "certs/server_cert.pem"
                       REQUIRES bme280 driver esp_wifi nvs_flash esp_http_client)
