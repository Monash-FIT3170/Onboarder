
import router


def lambda_handler(event, context):
    try:
        result = router.dispatch(event)
    except Exception as e:
        return {
            "statusCode": 500,
            "body": {
                "error": str(e),
            },
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            }
        }

    return result
