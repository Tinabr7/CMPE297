import requests
import urllib.parse
import csv
import time
def getGeoLoc(street_address,city,zipcode):
    address = street_address+" "+city+" "+zipcode
    coords = {}
    url = 'https://nominatim.openstreetmap.org/search/' + urllib.parse.quote(address) +'?format=json'
    try:
        response = requests.get(url).json()
    except:
        print(street_address, city, zipcode)
    if(response):
        lon =(response[0]["lon"])
        lat = (response[0]["lat"])

        coords['long'] = lon
        coords['lat'] = lat
    #print(lon,lat)
        return coords
    else:
        return 400

if __name__=="__main__":
    device_id = 0;
    with open("./profile/address_reformated_withCoord.csv", mode='r') as house:
        next(house)
        csv_reader1 = csv.reader(house, delimiter=',')
        house = list(csv_reader1)
        with open("./profile/address_reformated_withCoord2.csv", mode='w+') as house1:
            csvwriter = csv.writer(house1, delimiter=',')
            csvwriter.writerow(["street_name","city","state","zipcode","lat","long","device_id"])
            for row in house:
            # print row
                street_name = row[0]
                city = row[1]
                zipcode = row[2]
                lat = row[3]
                long = row[4]



                csvrow = [street_name,city,zipcode,lat,long,device_id]
                csvwriter.writerow(csvrow)
                device_id+=1
                #time.sleep(5)



