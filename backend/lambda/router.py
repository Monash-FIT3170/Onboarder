import json

from typing import Callable

import controller

routes = dict()


def dispatch(event: dict):
    
    # intercept cognito here

    resource = event.get('resource')
    method = event.get('httpMethod')
    func = routes.get(resource, {}).get(method)

    path_params = event.get('pathParameters', {})
    querystring_params = event.get('queryStringParameters', {})
    body = event.get('body')
    # possible validation here

    result = func(path_params, querystring_params, body)
    
    return result


def route(path: str, methods: list[str]) -> Callable:
    def inner(func):
        if path not in routes:
            routes[path] = {}

        for method in methods:
            routes[path][method] = func

        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        
        return wrapper
    
    return inner


@route('/openings', ['GET'])
def openings(params: dict = {}, _ = {}, __ = {}, ___ = {}):
    body = {
        'opening_id': 345678,
        'recruitment_round_id': 45678,
        'title': 'OpeningTitle',
        'description': 'Description of Opening',
        'app_role': 'Some text',
        'status': 'Accepting'
    }

    response = {
        'statusCode': 200,
        'body': json.dumps(body)
    }
    return response