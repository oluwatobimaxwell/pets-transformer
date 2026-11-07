"""How the API is described to the generated frontend client."""

from fastapi.routing import APIRoute


def operation_name(route: APIRoute) -> str:
    """The function name becomes the generated client's name, such as listSamples."""
    return route.name
