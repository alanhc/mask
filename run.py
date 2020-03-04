import requests
import time
from time import sleep
import io
import pandas as pd
import os
import datetime

file = open('console.log', 'a+', encoding='UTF-8')



def get_data():
    now = datetime.datetime.now()
    url = 'https://data.nhi.gov.tw/resource/mask/maskdata.csv'
    
    tStart = time.time()
    try:
        r = requests.get(url)
    except requests.exceptions.Timeout:
        print('Timeout')
        file.write(now.strftime("%H:%M:%S")+ ' Timeout\n')
        file.flush() 
    except Exception as e:
        print('some error happend! ctrl c to shut down',e)
        file.write(now.strftime("%H:%M:%S")+ ' some error happend! ctrl c to shut down'+"\n"+str(e))
        file.flush() 
        get_data()
        return
    tEnd = time.time()
    print(r.status_code,"It cost %f sec" % (tEnd - tStart))
    
    urlData = r.content
    r.encoding = 'utf-8'
    rawData=""
    try:
        rawData = pd.read_csv(io.StringIO(urlData.decode('utf-8')))
    except Exception:
        print('some decode problem, try again.')
        file.write(now.strftime("%H:%M:%S")+ ' some decode problem, try again.\n')
        file.flush() 
        get_data()
    
    rawData = rawData[['醫事機構代碼','成人口罩剩餘數','兒童口罩剩餘數','來源資料時間']]
    return rawData
    
def handle_data():
    old_data = ""
    now = datetime.datetime.now()
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
        


def main():
    now = datetime.datetime.now()
    print(now.strftime("%H:%M:%S"), ' running...')
    file.write('\n=====================================\n')
    file.write(now.strftime("%H:%M:%S")+' running..\n')
    while True:
        now = datetime.datetime.now()
        if (7 < now.hour and now.hour <22):
            print(' geting data...')
            try :
                handle_data()
            except Exception as e:
                print('some decode problem, try again.',e)
                file.write(now.strftime("%H:%M:%S")+ ' some decode problem, try again.\n'+str(e)+"\n")
                file.flush() 
                main()
                return
            print(now.strftime("%H:%M:%S")+' done.')
        else:
            print("It's my sleeping time.")
        file.flush() 
        sleep(60)
        


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        now = datetime.datetime.now()
        file.write(now.strftime("%H:%M:%S")+' Interrupted..\n')
        file.close()
        
    