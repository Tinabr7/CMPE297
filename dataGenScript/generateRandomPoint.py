import csv
import sys
import random
import datetime
import pymongo
from pymongo import MongoClient
from random import randint
import datetime
import time
import threading
import signal
import json
threads = []



from random import randrange
from datetime import timedelta
def random_date(start, end):
    """
    This function will return a random datetime between two datetime
    objects.
    """
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    return start + timedelta(seconds=random_second)

deviceSet = set()

def generate_data(thread_num,numbatch):
    idCount = 0;
    client = pymongo.MongoClient("mongodb://18.219.69.154:27017/")
    print(client)
    mydb = client["myapp"]
    mycol= mydb["projects"]
    print(client)

    with open("./profile/address_reformated_withCoord2.csv", mode='r') as houseAddress:
        next(houseAddress)
        csv_reader1 = csv.reader(houseAddress, delimiter=',')
        house = list(csv_reader1)


        for row in house:
            #print(row)
            device_id = row[5]


            deviceSet.add(device_id)
            address = str((row[0]))
            city = (row[1])
            zipcode = (row[2])
            latitude = (row[3])
            longitude = (row[4])
            temp = random.randint(24, 30)
            seconds = time.time()
            strDate = time.strftime('%Y-%m-%d', time.localtime(seconds))
            timestamp = time.strftime('%H %M %S', time.localtime(seconds))
            print(strDate)

            record = {

                "address": address+" "+city + " "+zipcode,
                "city": city,
                "state": "CA",
                "zipcode": zipcode,
                "long": float(longitude),
                "lat": float(latitude),
                "temp":int(temp),
                "device_id": device_id,
                "date": strDate

             }
            #print(record)
            id = mycol.insert_one(record)
            idCount+=1
            #print(id)
            if(idCount==numbatch):
                print("finish data insert into mongodb")
                exit(0)










def signal_handler(sig, frame):
    print("Program interrupted. Exiting...")
    timeout_handler()


def timeout_handler():
    print("Program timed out. Stopping threads...")
    for t in threads:
        t.stop();


def generate_data_thread_task(thread_num, numbatch):
    #lock.acquire()
    generate_data(thread_num,numbatch)
    #lock.release()


def main_task_generate_data(thread_count,numbatch):
    print("Running generation data tool...")
    signal.signal(signal.SIGINT, signal_handler)

    start_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    timeout = 3600

    print("insert mongodb starttime"+str(start_time))

    # creating a lock
    #lock = threading.Lock()

    for tid in range(thread_count):
        try:
            thread = threading.Thread(target=generate_data_thread_task,args=(tid,numbatch))
            threads.append(thread)
            thread.start()
            if thread.is_alive():
                print(str(tid) + ' Thread Still running')
            else:
                print(str(tid) +' Thread Completed')
        except:
            print("thread exception handle")

    if timeout > -1:
        timer = threading.Timer(timeout, timeout_handler)
        timer.start()

    # wait for threads to complete
    for tid in range(thread_count):
        threads[tid].join()

        print("Threading {0}:".format(tid))

    end_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print("insert mongodb endtime" + str(end_time))
    timer.cancel()


if __name__ == "__main__":
    main_task_generate_data(1,46385)




