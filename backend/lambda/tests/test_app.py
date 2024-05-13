import sys
sys.path.append('C:\\Users\\Antony\\New folder\\Onboarder\\backend\\lambda')
import app

def test_lambda_handler():
    response = app.lambda_handler({}, {})
    expected = {'statusCode': 200, 'body': '{"opening_id": 345678, "recruitment_round_id": 45678, "title": "OpeningTitle", "description": "Description of Opening", "app_role": "Some text", "status": "Accepting"}'}
    assert response == expected

if __name__=="__main__":
    test_lambda_handler()