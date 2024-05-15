
import router


def lambda_handler(event, context):
    try:
        result = router.dispatch(event)
    except Exception as e:
        return {
            "statusCode": 500,
            "body": {
                "error": str(e),
            }
        }

    return result
