#include <stdio.h>

#include "driver/gpio.h"
#include "driver/i2c.h"
#include "esp_err.h"
#include "esp_log.h"
#include "freertos/task.h"

#include "sdkconfig.h"
#include "bme280.h"

#define SDA_PIN GPIO_NUM_8
#define SCL_PIN GPIO_NUM_9

#define TAG_BME280 "BME280"

void i2c_controller_init() {

    i2c_config_t i2c_config = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = SDA_PIN,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_io_num = SCL_PIN,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = 1000000
    };
    i2c_param_config(I2C_NUM_0, &i2c_config);
    i2c_driver_install(I2C_NUM_0, I2C_MODE_MASTER,0,0,0);
}

void app_main(void) {
    ESP_LOGI("TEMP_MONITOR", "Hello ESP32-S3!");

    while(1) {
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}
