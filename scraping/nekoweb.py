import requests
from bs4 import BeautifulSoup
from time import sleep
import json
with open("nekoweb.json", "w+") as f:
    saved_links = []
    for i in range(1, 30):
        try:
            page = requests.get(f"https://nekoweb.org/explore?page={i}&sort=views&by=name&q=")
            soup = BeautifulSoup(page.content, "html.parser")
            res = soup.select(".site-box > a")
            for rel_link in res:
                try:
                    link = f'https:{rel_link.attrs["href"]}'
                    page = requests.get(link)
                    if "was not found" in page.text or 'href="https://www.w3schools.com/html/"' in page.text:
                        continue

                    saved_links.append(link[8:]) # delete https:// prefix
                except:
                    print(f'Failed to get the page from a link: {rel_link.attrs["href"]}')
        except:
            print(f"Failed to get the {i}th page of list")
        sleep(1)
    json.dump(saved_links, f, indent=4)