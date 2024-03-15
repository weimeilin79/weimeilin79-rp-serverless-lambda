from kafka import KafkaProducer

import json
import random
import string
import time

# Kafka Consumer Configuration
kafka_brokers = ['xx:9092'] 

# SASL/SSL Configuration
sasl_mechanism = 'SCRAM-SHA-256'  
security_protocol = 'SASL_SSL'  
sasl_plain_username = 'xx'  
sasl_plain_password = 'xx'  


# Initialize Kafka producer
producer = KafkaProducer(
    bootstrap_servers=kafka_brokers,
    security_protocol=security_protocol,
    sasl_mechanism=sasl_mechanism,
    sasl_plain_username=sasl_plain_username,
    sasl_plain_password=sasl_plain_password)

def generate_random_payload():
    purchase_id = ''.join(random.choices(string.digits, k=10))
    phone = f"{random.randint(100, 999)}-{random.randint(1000, 9999)}"
    payment_method = random.choice(['Credit Card', 'PayPal', 'Venmo', 'ApplePay', 'SamsungPay', 'Cash'])
    age = random.randint(18, 70)
    seat_number = f"{random.choice(string.ascii_uppercase)}{random.randint(1, 100)}"
    ip_address = f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"
    device_type = random.choice(['Smartphone', 'Laptop', 'PC'])

    return {
        "purchaseID": purchase_id,
        "phone": phone,
        "paymentMethod": payment_method,
        "age": age,
        "seatNumber": seat_number,
        "IPAddress": ip_address,
        "deviceType": device_type
    }




topic = 'orders'
def start_producing(messages_per_sec):
    topic = 'orders'
    try:
        while True:
            for _ in range(messages_per_sec):  # Send specified number of messages
                payload = generate_random_payload()
                print(f"Sent: {payload}")
                producer.send(topic, value=json.dumps(payload).encode('utf-8'))
                producer.flush()  # Ensure all messages are sent
            time.sleep(0.5)
    except KeyboardInterrupt:
        print("\nStopped.")

if __name__ == "__main__":
    start_cmd = input("Press 'Enter' to start or 's' to stop: ")
    if start_cmd.lower() != 's':
        msgs_per_sec = int(input("How many messages to send every .5 second? "))
        print(f"Starting to send {msgs_per_sec*2} messages per second. Press Ctrl+C to stop.")
        start_producing(msgs_per_sec)
    else:
        print("Stopped before starting.")