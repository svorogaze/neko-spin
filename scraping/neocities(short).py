import requests
from bs4 import BeautifulSoup
from time import sleep
import json
with open("neocities.json", "w+") as f:
    saved_links = []
    for i in range(1, 60):
        page = requests.get(f"https://neocities.org/browse?sort_by=most_followed&tag=&page={i}")
        soup = BeautifulSoup(page.content, "html.parser")
        res = soup.find_all("a", class_="neo-Screen-Shot")
        for link in res:
            saved_links.append(link.attrs["href"][8:]) # delete https:// prefix
        sleep(1)
    json.dump(saved_links, f, indent=4)