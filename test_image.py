import feedparser
import requests
from bs4 import BeautifulSoup

# Using direct publisher RSS feeds instead of Google News wrappers
DIRECT_FEEDS = [
    "https://techcrunch.com/feed/",
    "https://www.theverge.com/rss/index.xml"
]

def test_extract_image(entry):
    print(f"\n🔍 Testing Article: {entry.title}")
    print(f"🔗 Direct Link: {entry.link}")
    
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    
    # 1. Check native RSS media enclosure first (very common on TechCrunch/Verge)
    if hasattr(entry, 'media_content') and entry.media_content:
        for media in entry.media_content:
            if 'url' in media:
                print(f"✅ Found via RSS Media: {media['url']}")
                return media['url']

    # 2. Scrape the direct article page
    try:
        r = requests.get(entry.link, headers=headers, timeout=10)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        og_img = soup.find("meta", {"property": "og:image"})
        if og_img and og_img.get('content'):
            img_url = og_img.get('content')
            if img_url.startswith("http"):
                print(f"✅ Found Real Publisher OpenGraph Image: {img_url}")
                return img_url

    except Exception as e:
        print(f"⚠️ Scraping error: {e}")

    print("❌ No image found.")
    return None

if __name__ == '__main__':
    print("🚀 Testing Direct Publisher Image Extraction...")
    
    for feed_url in DIRECT_FEEDS:
        print(f"\n📂 Fetching Feed: {feed_url}")
        feed = feedparser.parse(feed_url)
        
        # Test just the first article from each feed
        if feed.entries:
            test_extract_image(feed.entries[0])
            print("-" * 50)