import requests
import time
from time import sleep
import io
import pandas as pd
import os

def get_data():
    
    url = 'https://data.nhi.gov.tw/resource/mask/maskdata.csv'
    
    tStart = time.time()
    try:
        r = requests.get(url)
    except requests.exceptions.Timeout:
        print('Timeout')
    except requests.exceptions.RequestException as e:
        print('some error happend! ctrl c to shut down',e)
        get_data()
        return
    tEnd = time.time()
    print(r.status_code,"It cost %f sec" % (tEnd - tStart))
    
    urlData = r.content
    rawData = pd.read_csv(io.StringIO(urlData.decode('utf-8')))
    rawData = rawData[['醫事機構代碼','成人口罩剩餘數','兒童口罩剩餘數','來源資料時間']]
    return rawData
    
def handle_data():
    old_data = ""
    try:
        old_data = pd.read_csv(r'old.csv')
       
    except IOError:
        print("File not exist, create new one")
        old_data = get_data()
        old_data.to_csv(r'old.csv', index=False)
        return
    else:
        new_data = get_data()
        combin_data = pd.concat([new_data,old_data], ignore_index=True)
        combin_data.to_csv(r'old.csv', index=False)
        size = os.path.getsize('old.csv')
        print('size:',size/(1024*1024),'Mb')
        

print('running...')

import datetime

while True:
    now = datetime.datetime.now()
    # if not (7 < now.hour and now.hour <22):
    if 0:
        print('off line')
    else:
        handle_data()
    sleep(60)