import optimisation
import json

if __name__=="__main__":
    opening_id = "123"
    event = json.dumps({'Records': [{'body': {'opening_id': opening_id}}]})
    optimisation.lambda_handler(event, {})