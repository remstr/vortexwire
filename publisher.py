import os
import feedparser
import requests
import time
import re
from datetime import datetime
from bs4 import BeautifulSoup
from google import genai

# --- CONFIGURATION ---
ALL_KEYS = [
    "AIzaSyAloMH2DR8tDabsreP24kP31ElYEz2KEDI",
    "AIzaSyBPJrb509wezb8wsXZv60IIlGwBmkf5mHs",
    "AIzaSyA2_yXRGRQoxtOkGaeYi47bP8V7-GoKgyo"
]

# Multiple direct publisher RSS feeds per category for high reliability and clean image extraction
FEEDS = {
    "culture": [
        "https://variety.com/feed/",
        "https://www.theverge.com/rss/index.xml"
    ],
    "tech": [
        "https://techcrunch.com/feed/",
        "https://www.theverge.com/rss/index.xml"
    ],
    "automotive": [
        "https://electrek.co/feed/",
        "https://www.slashgear.com/feed/"
    ]
}

DUPLICATES_FILE = 'posted_urls.txt'
MAX_ARTICLES_PER_CATEGORY = 2  # Production setting: 2 articles per category (6 total per run)

# Curated fallback images matching categories if a site blocks scraping entirely
FALLBACK_IMAGES = {
    "culture": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    "tech": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "automotive": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
}

def rewrite_article_with_ai(title, raw_text, api_key):
    client = genai.Client(api_key=api_key)
    models_to_try = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-3-flash-preview']
    
    prompt = f"""
    You are a sharp, witty senior editor for VortexWire, a US-based digital magazine. 
    Rewrite the following article into a punchy, engaging US news brief (strictly 200 to 250 words).
    
    VOICE & EDITORIAL RULES:
    1. NO CLICHÉS: NEVER start articles with cheesy robotic openers like "Hold onto your helmets," "Buckle up," "Picture this," or "In today's fast-paced world." Dive straight into the story with punchy, natural human phrasing.
    2. WRITE LIKE A HUMAN: Avoid stiff, formal AI filler phrases. Talk to the reader like a pop-culture-savvy friend with dry wit or light humor when appropriate.
    3. SHORT & SCANNABLE: Keep paragraphs to 2 sentences max. Use bullet points (-) for quick takeaways.
    4. NO METADATA LEAKS: Under ---CONTENT---, write ONLY the article body text. Never repeat labels like title, slug, or category.
    5. No markdown code blocks around your output, just plain text separated by the exact tags below.

    Original Title: {title}
    Source Text: {raw_text[:3000]}
    
    OUTPUT FORMAT EXACTLY LIKE THIS:
    ---TITLE---
    [Engaging, witty SEO Title here]
    ---EXCERPT---
    [1-sentence witty meta summary here]
    ---CONTENT---
    [Humorous, punchy markdown article body text here, approx 200-250 words]
    """

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(model=model_name, contents=prompt)
            res_text = response.text
            
            title_match = re.search(r'---TITLE---\s*(.*?)\s*---EXCERPT---', res_text, re.DOTALL)
            excerpt_match = re.search(r'---EXCERPT---\s*(.*?)\s*---CONTENT---', res_text, re.DOTALL)
            content_match = re.search(r'---CONTENT---\s*(.*)', res_text, re.DOTALL)

            if title_match and excerpt_match and content_match:
                new_title = title_match.group(1).strip().replace('"', '\\"')
                excerpt = excerpt_match.group(1).strip().replace('"', '\\"')
                content = content_match.group(1).strip()
                
                content = re.sub(r'^```[a-z]*\n', '', content, flags=re.IGNORECASE)
                content = re.sub(r'\n```$', '', content).strip()
                
                return new_title, excerpt, content
        except Exception as e:
            continue
            
    return None, None, None

def get_publisher_image_and_text(entry, category):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    
    if hasattr(entry, 'media_content') and entry.media_content:
        for media in entry.media_content:
            if 'url' in media and media['url'].startswith("http"):
                img_url = media['url']
                break
        else:
            img_url = None
    else:
        img_url = None

    try:
        r = requests.get(entry.link, headers=headers, timeout=12)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        if not img_url:
            og_img = soup.find("meta", {"property": "og:image"})
            if og_img and og_img.get('content') and og_img.get('content').startswith("http"):
                img_url = og_img.get('content')
        
        paragraphs = soup.find_all('p')
        full_text = " ".join([p.get_text().strip() for p in paragraphs if len(p.get_text()) > 30])
        
        if not img_url:
            img_url = FALLBACK_IMAGES.get(category, FALLBACK_IMAGES["tech"])
            
        if len(full_text) > 100:
            return img_url, full_text
    except Exception as e:
        print(f"    ⚠️ Scraper notice: {e}")

    fallback_text = getattr(entry, 'summary', entry.title)
    final_img = img_url if img_url else FALLBACK_IMAGES.get(category, FALLBACK_IMAGES["tech"])
    return final_img, fallback_text

if __name__ == '__main__':
    print("🚀 VortexWire Production Multi-Article Engine Initialized...")
    
    seen = open(DUPLICATES_FILE, 'r', encoding='utf-8').read().splitlines() if os.path.exists(DUPLICATES_FILE) else []
    key_counter = 0

    for category, feed_urls in FEEDS.items():
        print(f"\n📂 Processing Category: {category.upper()}")
        category_processed = 0
        
        for feed_url in feed_urls:
            if category_processed >= MAX_ARTICLES_PER_CATEGORY:
                break
                
            print(f"  Fetching Feed: {feed_url}")
            feed = feedparser.parse(feed_url)
            
            for entry in feed.entries:
                if category_processed >= MAX_ARTICLES_PER_CATEGORY:
                    break
                if entry.link in seen:
                    continue
                    
                current_key = ALL_KEYS[key_counter % len(ALL_KEYS)]
                key_counter += 1
                
                print(f"  🔍 Processing: {entry.title[:50]}...")
                img_url, raw_text = get_publisher_image_and_text(entry, category)
                
                if not raw_text:
                    continue
                    
                print(f"  🤖 Rewriting via Gemini (Human & Witty Voice)...")
                new_title, excerpt, body_content = rewrite_article_with_ai(entry.title, raw_text, current_key)
                
                if body_content:
                    slug = "".join([c if c.isalnum() else "-" for c in new_title.lower()])[:50].strip("-")
                    date_str = datetime.now().strftime("%Y-%m-%d")
                    
                    target_dir = os.path.join("content", category)
                    os.makedirs(target_dir, exist_ok=True)
                    
                    file_path = os.path.join(target_dir, f"{slug}.mdx")
                    
                    mdx_content = f"""---
title: "{new_title}"
slug: "{slug}"
category: "{category.capitalize()}"
author: "VortexWire Editorial Desk"
date: "{date_str}"
featuredImage: "{img_url}"
imageAlt: "{new_title}"
excerpt: "{excerpt}"
---

{body_content}

---
*Source feed reference: [{entry.title}]({entry.link})*
"""

                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(mdx_content)
                    
                    print(f"  ✅ [SUCCESS] Generated: content/{category}/{slug}.mdx")
                    
                    with open(DUPLICATES_FILE, 'a', encoding='utf-8') as f:
                        f.write(entry.link + '\n')
                        
                    category_processed += 1
                    time.sleep(2) # Brief pause between requests

    print(f"\n✨ Production run complete! Generated {MAX_ARTICLES_PER_CATEGORY} articles per category across Culture, Tech, and Automotive.")