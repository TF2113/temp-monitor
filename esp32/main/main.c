#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>

#include "driver/gpio.h"
#include "driver/i2c.h"
#include "esp_err.h"
#include "esp_log.h"
#include "esp_sleep.h"

#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_netif.h"
#include "nvs_flash.h"
#include "esp_http_client.h"

#include "freertos/task.h"
#include "freertos/event_groups.h"

#include "sdkconfig.h"
#include "bme280.h"
#include "wifi_config.h"
#include "sensor_data.h"

#define SDA_PIN GPIO_NUM_8
#define SCL_PIN GPIO_NUM_9
#define MAX_RETRY 10
#define SLEEP_TIME_US 60000000

extern const uint8_t server_cert_pem_start[] asm("_binary_server_cert_pem_start");
extern const uint8_t server_cert_pem_end[]   asm("_binary_server_cert_pem_end");

static EventGroupHandle_t wifi_event_group;
const int WIFI_CONNECTED_BIT = BIT0;
static int retry_cnt = 0;

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

s8 BME280_I2C_bus_write(u8 dev_addr, u8 reg_addr, u8 *reg_data, u8 cnt){
    
    s32 iError = BME280_INIT_VALUE;
    esp_err_t espRc;

    i2c_cmd_handle_t cmd = i2c_cmd_link_create();

    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (dev_addr << 1) | I2C_MASTER_WRITE, true);

    i2c_master_write_byte(cmd, reg_addr, true);
    i2c_master_write(cmd, reg_data, cnt, true);
    i2c_master_stop(cmd);

    espRc = i2c_master_cmd_begin(I2C_NUM_0, cmd, 10/portTICK_PERIOD_MS);
    if (espRc == ESP_OK){
        iError = SUCCESS;
    } else {
        iError = ESP_FAIL;
    }

    i2c_cmd_link_delete(cmd);

    return (s8)iError;
}

s8 BME280_I2C_bus_read(u8 dev_addr, u8 reg_addr, u8 *reg_data, u8 cnt){
    
    s32 iError = BME280_INIT_VALUE;
    esp_err_t espRc;

    i2c_cmd_handle_t cmd = i2c_cmd_link_create();

    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (dev_addr << 1) | I2C_MASTER_WRITE, true);
    i2c_master_write_byte(cmd, reg_addr, true);

    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (dev_addr << 1) | I2C_MASTER_READ, true);

    if (cnt > 1){
        i2c_master_read(cmd, reg_data, cnt-1, I2C_MASTER_ACK);
    }
    i2c_master_read_byte(cmd, reg_data+cnt-1, I2C_MASTER_NACK);
    i2c_master_stop(cmd);

    espRc = i2c_master_cmd_begin(I2C_NUM_0, cmd, pdMS_TO_TICKS(100));
    if (espRc == ESP_OK){
        iError = SUCCESS;
    } else {
        iError = ESP_FAIL;
    }

    i2c_cmd_link_delete(cmd);

    return (s8)iError;
}

void BME280_delay_msec(u32 msec) {
    vTaskDelay(msec/portTICK_PERIOD_MS);
}

sensor_data_t sensor_read(void) {

    sensor_data_t data = {0};

    struct bme280_t bme280 = {
        .bus_write = BME280_I2C_bus_write,
        .bus_read = BME280_I2C_bus_read,
        .dev_addr = BME280_I2C_ADDRESS1,
        .delay_msec = BME280_delay_msec
    };

    s32 com_rslt;
    s32 v_uncomp_temperature;
    s32 v_uncomp_humidity;
    s32 v_uncomp_pressure;

    com_rslt = bme280_init(&bme280);

    com_rslt += bme280_set_oversamp_temperature(BME280_OVERSAMP_2X);
    com_rslt += bme280_set_oversamp_humidity(BME280_OVERSAMP_1X);
    com_rslt += bme280_set_oversamp_pressure(BME280_OVERSAMP_16X);

    com_rslt += bme280_set_standby_durn(BME280_STANDBY_TIME_1_MS);
    com_rslt += bme280_set_filter(BME280_FILTER_COEFF_16);

    com_rslt += bme280_set_power_mode(BME280_NORMAL_MODE);
    vTaskDelay(pdMS_TO_TICKS(100));
    if(com_rslt == SUCCESS){

        com_rslt = bme280_read_uncomp_pressure_temperature_humidity(&v_uncomp_pressure, &v_uncomp_temperature, &v_uncomp_humidity);

        double temp = bme280_compensate_temperature_double(v_uncomp_temperature);            
        double hum = bme280_compensate_humidity_double(v_uncomp_humidity);
        double pa = (bme280_compensate_pressure_double(v_uncomp_pressure)/100);

        ESP_LOGI("Sensor", "Temp=%.2fC Hum=%.2f%% Pressure=%.2f hPa", temp, hum, pa);

        data.temp = temp;
        data.hum = hum;
        data.pa = pa;

    } else {
        ESP_LOGE("Error", "Init or setting error. Code: %d", com_rslt);
    }
    return data;
}

static void wifi_event_handler(void* arg, esp_event_base_t event_base, int32_t event_id, void* event_data){
    
    switch(event_id){
        case WIFI_EVENT_STA_START:
            esp_wifi_connect();
            ESP_LOGI("TEMP_MONITOR", "Attempting WIFI connection\n");
            break;
        
        case WIFI_EVENT_STA_CONNECTED:
            ESP_LOGI("TEMP_MONITOR", "WIFI Connected");
            break;
        
        case IP_EVENT_STA_GOT_IP:
            xEventGroupSetBits(wifi_event_group, WIFI_CONNECTED_BIT);
            ESP_LOGI("TEMP_MONITOR", "Got IP");
            break;

        case WIFI_EVENT_STA_DISCONNECTED:
            ESP_LOGI("TEMP_MONITOR", "WIFI disconnected, Retrying\n");
            if (retry_cnt++ < MAX_RETRY){
                esp_wifi_connect();
            } else {
                ESP_LOGI("TEMP_MONITOR", "Max retry attempts reached, closing.\n");
            }
            break;
        
        default:
            break;
    }
}

void wifi_init(void) {

    wifi_event_group = xEventGroupCreate();

    esp_event_loop_create_default();
    esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &wifi_event_handler, NULL);
    esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, &wifi_event_handler, NULL);

    wifi_config_t wifi_config = {
        .sta = {
            .ssid = ESP_WIFI_SSD,
            .password = ESP_WIFI_PASS,
            .threshold.authmode = WIFI_AUTH_WPA2_PSK,
        },
    };
    esp_netif_init();
    esp_netif_create_default_wifi_sta();

    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    esp_wifi_init(&cfg);
    esp_wifi_set_mode(WIFI_MODE_STA);
    esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config);
    esp_wifi_start();
    esp_wifi_connect();

    xEventGroupWaitBits(wifi_event_group, WIFI_CONNECTED_BIT,
                        false, true, portMAX_DELAY);
    ESP_LOGI("WiFi", "Connected and ready!");
}

esp_err_t client_event_handler(esp_http_client_event_handle_t evt){

    switch(evt->event_id){

        case HTTP_EVENT_ON_DATA:
            printf("HTTP_EVENT_ON_DATA: %.*s\n", evt->data_len, (char *)evt->data);
            break;

        default:
            break;
    }
    return ESP_OK;
}

static void post_request(double temp, double hum, double pa) {
    
    esp_http_client_config_t config = {
        .url = API_ENDPOINT,
        .transport_type = HTTP_TRANSPORT_OVER_TCP,
        .cert_pem = (char *) server_cert_pem_start,
        .event_handler = client_event_handler
    };

    esp_http_client_handle_t client = esp_http_client_init(&config);

    char buffer[128];
    snprintf(buffer, sizeof(buffer), "{\"temperature\":%.2f, \"humidity\":%.2f, \"pressure\":%.2f}", temp, hum, pa);

    esp_http_client_set_method(client, HTTP_METHOD_POST);
    esp_http_client_set_post_field(client, buffer, strlen(buffer));
    esp_http_client_set_header(client, "Content-Type", "application/json");
    esp_http_client_set_header(client, "X-API-KEY", API_KEY);


    esp_err_t err = esp_http_client_perform(client);
    if (err == ESP_OK) {
        ESP_LOGI("POST", "Data sent successfully");
    } else {
        ESP_LOGE("POST", "Failed to send data: %s", esp_err_to_name(err));
    }
    esp_http_client_cleanup(client);
}

void app_main(void) {

    ESP_LOGI("TEMP_MONITOR", "Hello!");

    esp_err_t ret = nvs_flash_init();
    if(ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);
    wifi_init();
    i2c_controller_init();

    sensor_data_t post_data = sensor_read();

    int retry_cnt = 0;

    while (post_data.pa == 0 && post_data.hum == 0 && post_data.temp == 0){
        post_data = sensor_read();
        retry_cnt++;
        vTaskDelay(pdMS_TO_TICKS(100));

        if (retry_cnt == 3){
            ESP_LOGI("TEMP_MONITOR", "Failed to get valid reading after 3 tries.");
            break;
        }
    }

    if (post_data.pa != 0){
        post_request(post_data.temp, post_data.hum, post_data.pa);
    }

    ESP_LOGI("TEMP_MONITOR", "Starting deep sleep for %d seconds", SLEEP_TIME_US/1000000);

    esp_sleep_enable_timer_wakeup(SLEEP_TIME_US);
    esp_deep_sleep_start();
}
