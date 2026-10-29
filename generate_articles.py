import os
import re
import random
import feedparser
from datetime import datetime
from google import genai

# --- CONFIGURATION & MULTI-KEY ROTATION ---
API_KEYS = [
    os.environ.get("GEMINI_API_KEY_1"),
    os.environ.get("GEMINI_API_KEY_2"),
    os.environ.get("GEMINI_API_KEY_3")
]
API_KEYS = [key for key in API_KEYS if key]

# RSS Feeds mapped to VortexWire categories
RSS_FEEDS = {
    "culture": [
        "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml",
        "https://feeds.feedburner.com/RollingStoneCulture"
    ],
    "tech": [
        "https://www.theverge.com/rss/index.xml",
        "https://techcrunch.com/feed/"
    ],
    "automotive": [
        "https://www.autoblog.com/rss.xml",
        "https://www.motor1.com/rss/news/all/"
    ]
}

TRACKED_LOG = "posted_articles.txt"

def load_posted_titles():
    if not os.path.exists(TRACKED_LOG):
        return set()
    with open(TRACKED_LOG, "r", encoding="utf-8") as f:
        return set(line.strip() for line in f if line.strip())

def save_posted_title(title):
    with open(TRACKED_LOG, "a", encoding="utf-8") as f:
        f.write(title + "\n")

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    return re.sub(r'[\s_-]+', '-', text).strip('-')

def generate_with_key_rotation(prompt):
    if not API_KEYS:
        raise ValueError("No Gemini API keys found in environment variables!")
    
    keys_to_try = API_KEYS.copy()
    random.shuffle(keys_to_try)
    
    for idx, api_key in enumerate(keys_to_try):
        try:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            return response.text
        except Exception as e:
            print(f"Key attempt {idx + 1} failed: {e}. Rotating...")
            continue
    raise Exception("All Gemini API keys failed or hit rate limits.")

def process_category(category, feeds, max_articles=2):
    posted_titles = load_posted_titles()
    count = 0
    
    print(f"\n--- Processing Category: {category.upper()} ---")
    
    for feed_url in feeds:
        if count >= max_articles:
            break
            
        parsed_feed = feedparser.parse(feed_url)
        for entry in parsed_feed.entries:
            if count >= max_articles:
                break
                
            title = entry.get("title", "")
            summary = entry.get("summary", entry.get("description", ""))
            
            if not title or title in posted_titles:
                continue
                
            print(f"Rewriting: {title}")
            
            prompt = f"""
            Rewrite the following news item into an engaging, professional digital magazine article for VortexWire.
            Keep it objective, sharp, and styled for a modern US news feed reader.
            Provide output in clean Markdown format with subheadings. Do not include frontmatter in your AI output response.
            
            Original Title: {title}
            Original Summary: {summary}
            """
            
            try:
                rewritten_content = generate_with_key_rotation(prompt)
                
                # Generate metadata fields safely outside f-strings
                slug = slugify(title)
                target_dir = os.path.join("content", category)
                os.makedirs(target_dir, exist_ok=True)
                file_path = os.path.join(target_dir, f"{slug}.mdx")
                
                if os.path.exists(file_path):
                    continue
                
                current_date = datetime.now().strftime("%Y-%m-%d")
                
                # Clean strings prior to f-string template
                safe_title = title.replace('"', '\\"')
                raw_excerpt = (summary[:150] + '...') if len(summary) > 150 else summary
                safe_excerpt = raw_excerpt.replace('"', '\\"')
                
                # Build MDX Frontmatter file safely
                mdx_content = f"""---
title: "{safe_title}"
date: "{current_date}"
author: "VortexWire Editorial Desk"
category: "{category.capitalize()}"
excerpt: "{safe_excerpt}"
featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475"
imageAlt: "{safe_title}"
---

{rewritten_content}
"""
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(mdx_content)
                
                save_posted_title(title)
                posted_titles.add(title)
                count += 1
                print(f"Saved: {file_path}")
                
            except Exception as e:
                print(f"Failed to process article '{title}': {e}")
                continue

if __name__ == "__main__":
    for cat, feed_list in RSS_FEEDS.items():
        process_category(cat, feed_list, max_articles=2)
