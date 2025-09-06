import requests
from bs4 import BeautifulSoup
from time import sleep
import json
saved_links = []
with open("geocities.json", "w+") as f:
    html = requests.get("https://geocities.restorativland.org/")
    soup = BeautifulSoup(html.text, "html.parser")
    area_links = soup.select("h2 > a") # area links are always under h2
    for area in area_links:
        html = requests.get(f"https://geocities.restorativland.org/{area.attrs['href']}")
        soup = BeautifulSoup(html.text, "html.parser")
        page_links = soup.select(".card-image > a")
        for link in page_links:
            saved_links.append(f"geocities.restorativland.org{link.attrs['href']}")
        sleep(1)
    json.dump(saved_links, f, indent=4)
