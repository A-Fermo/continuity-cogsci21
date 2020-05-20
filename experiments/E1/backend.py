import os
import urllib

from google.appengine.api import users
from google.appengine.ext import ndb

import jinja2
import webapp2
import csv
import logging

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])

import cgi
import urllib

#from google.appengine.api import users
from google.appengine.ext import ndb

import webapp2

class DataObject(ndb.Model):
    """Models a single participants data with experiment name, results and date."""
    exp = ndb.StringProperty(required=True)
    content = ndb.TextProperty(required=True) # defaults to non-indexed
    date = ndb.DateTimeProperty(auto_now_add=True, indexed=False)    

    
class MainPage(webapp2.RequestHandler):

    def get(self):
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render())

        
class WriteDataObject(webapp2.RequestHandler):

    def process(self):
        data = DataObject()

        data.content = self.request.get('content')
        data.exp = self.request.get('exp')
        data.put()

    def post(self):
        self.process()

    def get(self):
        self.process()

        
#
# This request (when enabled) will return a CSV file
# containing all result rows for the given experiment.
# To disable this functionality, simply comment out the
# appropriate line in the Web Application configuration
# at the bottom of this file.
#
class LoadResults(webapp2.RequestHandler):

    def process(self):
        self.response.headers['Content-Type'] = 'text/csv'
        self.response.headers['Content-Disposition'] = 'inline;filename=results.csv'

        property_names = set()
        data = DataObject.query().fetch()

        for u in data:
            logging.info("found uid: " + str(u.key.id()))
            property_names.update(u._properties.keys())

        writer = csv.DictWriter(self.response.out, fieldnames=sorted(property_names))
        writer.writeheader()

        for u in data:
            d = dict()

            try:
                for k, v in u._properties.iteritems():
                    d[k] = str(v._get_user_value(u))

                writer.writerow(d)

            except UnicodeEncodeError:
                logging.error("UnicodeEncodeError detected, row ignored");

    def post(self):
        self.process()

    def get(self):
        self.process()

        
application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/submit', WriteDataObject),
# Uncomment the following line to allow download of results    
    ('/info', LoadResults)    
], debug=True)
