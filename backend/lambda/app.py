
import router


def lambda_handler(event, context):

    result = router.dispatch(event)

    return result
