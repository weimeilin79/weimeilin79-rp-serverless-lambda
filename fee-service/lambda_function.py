import json
import requests
import logging
import base64
import time

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def busy_wait(seconds=2):
    """A function that keeps the CPU busy for the specified number of seconds."""
    end_time = time.time() + seconds
    while time.time() < end_time:
        pass 
    
def lambda_handler(event, context):
    # logger.info(f"body get: {event}") 
    
    for record in event['records']['orders-0']:
        payload = base64.b64decode(record['value']).decode('utf-8')
        payload = json.loads(payload)  # Convert JSON string to dictionary
        
        # logger.info(f"Decoded payload: {payload}")  
        row, col = payload['seatNumber'][0], int(payload['seatNumber'][1:])
        if row in ['A', 'B', 'C']:
            seat_fee_percent = 0.05
        elif row in ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']:
            seat_fee_percent = 0.03
        else:
            seat_fee_percent = 0.01

        payment_method = payload['paymentMethod']
        if payment_method == 'Credit Card':
            payment_method_fee_percent = 0.03
        elif payment_method in ['PayPal', 'Venmo', 'ApplePay', 'SamsungPay']:
            payment_method_fee_percent = 0.035
        else:
            payment_method_fee_percent = 0.02

        base_price = 100  
        total_fee_percent = seat_fee_percent + payment_method_fee_percent
        total_fee = base_price * total_fee_percent
        final_price = base_price + total_fee

        # Update the payload with the final price and total fee
        payload['finalPrice'] = final_price
        payload['fee'] = total_fee

        # Serialize the updated payload to JSON
        requestBody = json.dumps(payload)
        logger.info(f"Request body being sent: {requestBody}")  # Log the request body

        api_url = "http://xx:8080/tickets" 
        headers = {"Content-Type": "application/json"}
        # allow Lambda to scale
        busy_wait(seconds=2)
        
        response = requests.post(api_url, data=requestBody, headers=headers)
        
        if response.status_code == 204:
            # Process successful response
            logger.info('Successfully processed ticket purchase and called API.')
        else:
            # Handle error response
            logger.error(f"Failed to call API. Status code: {response.status_code}, Body: {response.text}")