import os
import json
import binascii
import couchdb
from webob import Response, exc
from cornice import Service
import pyramid
from . import config
from geojson import Feature, Point, FeatureCollection
couch = couchdb.Server()
couch.resource.credentials = (config.couchdbuser,config.couchdbpass)
pets = Service(name='pets', path='/pets', description="Pets")
db = couch['petfinder']

def _create_token():
    return binascii.b2a_hex(os.urandom(20))

class _401(exc.HTTPError):
    def __init__(self, msg='Unauthorized'):
        body = {'status': 401, 'message': msg}
        Response.__init__(self, json.dumps(body))
        self.status = 401
        self.content_type = 'application/json'
@pets.get()
def get_users(request):
    """Returns a list of all pets in a bbox."""
    #if bbox in 
    #import pdb; pdb.set_trace()
    bbox = request.params['bbox']
    featurecoll = []
    for pet in db.view("_design/search/_spatial/points", bbox=bbox):
        #print(i)
        point = Point((pet['value']['lastseen'][0],pet['value']['lastseen'][1]))
        del pet['value']['token']
        feature = Feature(geometry=point,properties=pet['value'])
        featurecoll.append(feature)
    return FeatureCollection(featurecoll)
    #_PETS.keys()}


@pets.post()
def create_user(request):
    """Adds a new user."""
    #import pdb; pdb.set_trace()
    pet = request.json['pet']
    token = _create_token()
    pet['token'] = token
    #[token] = pet
    db.save(pet)
    return {'token': token}
    
    #return {'token': '%s-%s' % (user['name'], user['token'])}


@pets.delete()
def del_user(request):
    """Removes the user."""
    docid = request.json['_id']
    token = request.json['token']
    doc = db[docid]
    if doc['token'] == token:
        del doc
    return {'Goodbye': docid} 


