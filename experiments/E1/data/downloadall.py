#export GOOGLE_APPLICATION_CREDENTIALS=""

# Imports the Google Cloud client library
from google.cloud import datastore

# json library
import json

# Instantiates a client
datastore_client = datastore.Client()

# make query
query = datastore_client.query(kind='DataObject')
results = list(query.fetch())
print(json.dumps(results, indent=4, sort_keys=True, default=str))
