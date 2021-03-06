import requests
import time
from time import sleep
import io
import pandas as pd
import os
import datetime
import pandas as pd
from sqlalchemy import create_engine
from secrets import db_user, db_pass


file = open('console.log', 'a+', encoding='UTF-8')
now = datetime.datetime.now()
filename = str(now.strftime("%Y-%m-%d"))+'.csv'

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
    #print(r.status_code,"It cost %f sec" % (tEnd - tStart))
    
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
    to_result_table(rawData)
    return rawData
    
def to_result_table(data):
    t1 = pd.read_csv('data.csv', index_col=['醫事機構代碼'])
    t1 = t1[['醫事機構名稱','TGOS X', 'TGOS Y']]
    t2 = data
    t2 = t2.set_index('醫事機構代碼')
    #print('t1',t1.shape)
    #print('t2',t2.shape)
    #print(t1.head())
    #print(t2.head())
    result = pd.concat([t1, t2], axis=1, join='inner')
    result.dropna(axis=0)
    #print('data shape:',result.shape)
    #print(result.head())
    result.to_csv('dist/result.csv')


def handle_data():
    
    old_data = ""

    now = datetime.datetime.now()
    filename = str(now.strftime("%Y-%m-%d"))+'.csv'
    try:
        old_data = pd.read_csv(filename)
       
    except IOError:
        print("File not exist, create new one")
        old_data = get_data()
        old_data.to_csv(filename, index=False)
    
        return
    else:
        new_data = get_data()
        combin_data = pd.concat([new_data,old_data], ignore_index=True)
        combin_data.to_csv(filename, index=False)
        size = os.path.getsize(filename)
        #print('size:',size/(1024*1024),'Mb')
        
def save_to_database():
    
    tStart = time.time()
    now = datetime.datetime.now()
    filename = str(now.strftime("%Y-%m-%d"))+'.csv'
    data = pd.read_csv(filename)
    data.columns = ['id','adult','child','time']
    engine = create_engine('mysql+pymysql://'+db_user+':'+db_pass+'@localhost:3306/db_mask')
    data.to_sql('mask', engine,if_exists='append')
    tEnd = time.time()
    print("Write to MySQL successfully!It cost %f sec"% (tEnd - tStart))


def main():
    saved = False

    now = datetime.datetime.now()
    filename = str(now.strftime("%Y-%m-%d"))+'.csv'
    print(now.strftime("%H:%M:%S"), ' running...')
    file.write('\n================== '+str(now.strftime("%Y-%m-%d"))+' ===================\n')
    file.write(now.strftime("%H:%M:%S")+' running..\n')
    
    while True:
        now = datetime.datetime.now()
        if (7 < now.hour and now.hour <22):
            filename = str(now.strftime("%Y-%m-%d"))+'.csv'    
            saved=False
            #print(' geting data...')
            try :
                handle_data()
            except Exception as e:
                print('some decode problem, try again.',e)
                file.write(now.strftime("%H:%M:%S")+ ' some decode problem, try again.\n'+str(e)+"\n")
                file.flush() 
                main()
                return
            #print(now.strftime("%H:%M:%S")+' done.')
        else:
            if (not saved):
                try :
                    save_to_database()
                except Exception:
                    print('not save')
                saved = True
            #print("It's my sleeping time.")
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
        
    