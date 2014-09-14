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
def get_pet(request):
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
def create_pet(request):
    """Adds a new pet."""
    #import pdb; pdb.set_trace()
    pet = request.json['pet']
    token = _create_token()
    pet['token'] = token
    #[token] = petbbox
    #import pdb; pdb.set_trace()
    docid, docrevision = db.save(pet)
    return {'token': token, 'id': docid}
    
    #return {'token': '%s-%s' % (user['name'], user['token'])}


@pets.delete()
def del_pet(request):
    """Removes the pet."""
    docid = request.params['_id']
    token = request.params['token']
    doc = db[docid]
    if doc['token'] == token:
        del doc
    return {'Goodbye': docid} 


petdetail = Service(name='petdetail', path='/pet/{petid}', description="get data for the detail page of a pet")

@petdetail.get()
def get_pet(request):
    """Returns the details for the pet with the given id."""
    petid = request.matchdict['petid']
    petdoc = db[petid]
    del petdoc['token']
    print(db[petid])
    return(petdoc)
    #_PETS.keys()}

petdelete = Service(name='petdelete', path='/petdelete', description="delete a pet")

@petdelete.get()
def del_pet(request):
    """Removes the pet."""
    docid = request.params['_id']
    token = request.params['token']
    doc = db[docid]
    if doc['token'] == token:
        del doc
    return 'Goodbye, ' + docid


from pyramid.httpexceptions import HTTPFound
redirectstatic = Service(name='redirectstatic', path='/', description="redirect to static")
@redirectstatic.get()
def redirecttostatic(request):
    return HTTPFound(location='http://petfinder.pajowu.de/static/')