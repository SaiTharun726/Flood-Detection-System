#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// WiFi credentials
const char* ssid = "Tharun"; // Your WiFi SSID
const char* password = "Password"; // Your WiFi Password

// MQTT Broker
const char* mqtt_server = "broker.emqx.io";
const int port = 1883;
const char* publishTopic = "floodDetection/sensorData";
const char* publishRainTopic = "floodDetection/alertrainData";
const char* publishFloodTopic = "floodDetection/alertfloodData";

#define DHTPIN 14 // Pin for DHT sensor
#define DHTTYPE DHT11
#define TRIG_PIN 13 // Trigger pin for ultrasonic sensor
#define ECHO_PIN 12 // Echo pin for ultrasonic sensor
#define RAIN_SENSOR_PIN 34 // Rain sensor pin

// Thresholds
const float HUMIDITY_THRESHOLD = 80.0;
const float TEMPERATURE_THRESHOLD = 35.0;
const float WATER_LEVEL_THRESHOLD = 50.0;
const int RAIN_SENSOR_THRESHOLD = 2000;

// DHT and MQTT Setup
DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi();
void reconnect();
void publishSensorData(float humidity, float temperature, float waterLevel, int rainValue);
void publishAlert(const char* topic, const String alertMessage);

void setup() {
    Serial.begin(115200);

    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);

    // Connect to WiFi
    setup_wifi();

    // MQTT Server Setup
    client.setServer(mqtt_server, port);
    dht.begin();
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();

    // Read sensor data
    float humidity =dht.readHumidity();
    float temperature = dht.readTemperature();
    float waterLevel =measureWaterLevel();
    int rainValue = readRainSensor();

    if (isnan(humidity) || isnan(temperature)) {
        Serial.println("Failed to read from DHT sensor!");
        return;
    }

    publishSensorData(humidity, temperature, waterLevel, rainValue);

    if (waterLevel < WATER_LEVEL_THRESHOLD) {
        publishAlert(publishFloodTopic, "Flood detected! Water level: " + String(waterLevel));
    }
    if (rainValue < RAIN_SENSOR_THRESHOLD) {
        publishAlert(publishRainTopic, "Rain detected! Rain value: " + String(rainValue));
    }

    delay(5000);
}

void publishSensorData(float humidity, float temperature, float waterLevel, int rainValue) {
    if (client.connected()) {
        String message = "Humidity:" + String(humidity) + 
                         ",Temperature:" + String(temperature) + 
                         ",WaterLevel:" + String(waterLevel) + 
                         ",RainValue:" + String(rainValue);
        client.publish(publishTopic, message.c_str());
        Serial.println("Sensor data published: " + message);
    }
}

void publishAlert(const char* topic, const String alertMessage) {
    if (client.connected()) {
        client.publish(topic, alertMessage.c_str());
        Serial.println("Alert published: " + alertMessage);
    }
}

float measureWaterLevel() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH);
    float distance = duration * 0.034 / 2;

    return distance;
}

int readRainSensor() {
    return analogRead(RAIN_SENSOR_PIN);
}

void setup_wifi() {
    delay(10);
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }

    Serial.println();
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

void reconnect() {
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        String clientId = "ESP32Client_" + String(random(0xffff), HEX);
        if (client.connect(clientId.c_str())) {
            Serial.println("connected");
            client.subscribe(publishTopic);
            client.subscribe(publishRainTopic);
            client.subscribe(publishFloodTopic);
        } else {   
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}
