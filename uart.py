import serial

uartPort = serial.Serial("/dev/ttyACM0", 38400, timeout=None)

try:
    while True:
        line = uartPort.readline().decode('utf-8').strip().split(',')
        if line:
            print(f"Received: Temp = {line[0]}°C | Humidity = {line[1]}% | Pressure = {line[2]} hPa")
except KeyboardInterrupt:
    print("\nExiting...")
finally:
    uartPort.close()