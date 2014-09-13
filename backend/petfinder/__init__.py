"""Main entry point
"""
from pyramid.config import Configurator

def main(global_config, **settings):
    config = Configurator(settings=settings)
    config.include("cornice")
    #config.add_static_view(name='static', path='/home/karl/jugendhack/petfinder/backend/petfinder/static')
    config.add_static_view(name='static', path='petfinder:static')
    config.scan("petfinder.views")
    return config.make_wsgi_app()
