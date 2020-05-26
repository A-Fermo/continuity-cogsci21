#export GOOGLE_APPLICATION_CREDENTIALS="~/path/to/gae-json-token"

import os
import pandas as pd
import numpy as np
from io import StringIO

# Imports the Google Cloud client library
from google.cloud import datastore

# json library
import json

# Instantiates a client
datastore_client = datastore.Client()

# make query
query = datastore_client.query(kind='DataObject')
results = list(query.fetch())
df = pd.read_json(json.dumps(results, indent=4, sort_keys=True, default=str))

data = pd.DataFrame()
for idx,row in enumerate(df.iterrows()):
    row_data = StringIO(row[1].content)
    dataframe = pd.read_csv(row_data, sep=',')
    dataframe.insert(0,"subject_id",np.repeat(idx+1,dataframe.shape[0]))
    data = pd.concat([data,dataframe],ignore_index=True)
    
cd = os.getcwd()
data.to_csv(r"{}/data.csv".format(cd),index=False)
