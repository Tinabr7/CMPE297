import csv

import requests
import urllib.parse
def generateCsv():
    with open("./profile/Addresses_in_the_City_of_Los_Angeles.csv", mode='r') as house:
        next(house)
        csv_reader1 = csv.reader(house, delimiter=',')
        house = list(csv_reader1)
        with open("./profile/address_reformated.csv", mode='w+') as house1:
            csvwriter = csv.writer(house1, delimiter=',')
            csvwriter.writerow(["street_name","city","state","zipcode","device_id","lat","long"])
            for row in house:
            # print row
                street_name = row[3]+" "+row[6]+" "+row[7]
                csvrow = (street_name, "Los Angeles", row[10], row[0],row[11],row[12])

                csvwriter.writerow(csvrow)
if __name__ == "__main__":
    generateCsv()