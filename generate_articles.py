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

def parse_ai_output(ai_response_text):
    """Parses out TITLE, EXCERPT, and CONTENT using the explicit tags."""
    title_match = re.search(r'---TITLE---\s*(.*?)\s*---EXCERPT---', ai_response_text, re.DOTALL)
    excerpt_match = re.search(r'---EXCERPT---\s*(.*?)\s*---CONTENT---', ai_response_text, re.DOTALL)
    content_match = re.search(r'---CONTENT---\s*(.*)', ai_response_text, re.DOTALL)

    title = title_match.group(1).strip() if title_match else ""
    excerpt = excerpt_match.group(1).strip() if excerpt_match else ""
    content = content_match.group(1).strip() if content_match else ai_response_text

    return title, excerpt, content

def extract_image_url(entry, category):
    """Extracts real image from RSS feed or falls back to category defaults."""
    # Fallback images per category so they don't all look identical
    fallbacks = {
        "culture": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
        "tech": "https://images.unsplash.com/photo-1518770660439-4636190af475",
        "automotive": "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
    }
    default_img = fallbacks.get(category, "https://images.unsplash.com/photo-1518770660439-4636190af475")

    # Check for media content
    if "media_content" in entry and entry.media_content:
        for media in entry.media_content:
            url = media.get("url")
            if url:
                return url

    # Check for media thumbnail
    if "media_thumbnail" in entry and entry.media_thumbnail:
        for thumb in entry.media_thumbnail:
            url = thumb.get("url")
            if url:
                return url

    # Check for enclosures
    if "enclosures" in entry and entry.enclosures:
        for enc in entry.enclosures:
            if "image" in enc.get("type", ""):
                return enc.get("href", default_img)

    return default_img

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
                
            orig_title = entry.get("title", "")
            summary = entry.get("summary", entry.get("description", ""))
            
            if not orig_title or orig_title in posted_titles:
                continue
                
            print(f"Rewriting: {orig_title}")
            
            prompt = f"""
    You are a sharp, witty senior editor for VortexWire, a US-based digital magazine. 
    Rewrite the following article into a punchy, engaging US news brief (strictly 200 to 250 words).
    
    VOICE & EDITORIAL RULES:
    1. NO CLICHÉS: NEVER start articles with cheesy robotic openers like "Hold onto your helmets," "Buckle up," "Picture this," or "In today's fast-paced world." Dive straight into the story with punchy, natural human phrasing.
    2. WRITE LIKE A HUMAN: Avoid stiff, formal AI filler phrases. Talk to the reader like a pop-culture-savvy friend with dry wit or light humor when appropriate.
    3. SHORT & SCANNABLE: Keep paragraphs to 2 sentences max. Use bullet points (-) for quick takeaways.
    4. NO METADATA LEAKS: Under ---CONTENT---, write ONLY the article body text. Never repeat labels like title, slug, or category.
    5. No markdown code blocks around your output, just plain text separated by the exact tags below.

    Original Title: {orig_title}
    Source Text: {summary[:3000]}
    
    OUTPUT FORMAT EXACTLY LIKE THIS:
    ---TITLE---
    [Engaging, witty SEO Title here]
    ---EXCERPT---
    [1-sentence witty meta summary here]
    ---CONTENT---
    [Humorous, punchy markdown article body text here, approx 200-250 words]
    """
            
            try:
                raw_response = generate_with_key_rotation(prompt)
                new_title, new_excerpt, new_content = parse_ai_output(raw_response)
                
                if not new_title:
                    new_title = orig_title

                # Generate file path safely
                slug = slugify(new_title)
                target_dir = os.path.join("content", category)
                os.makedirs(target_dir, exist_ok=True)
                file_path = os.path.join(target_dir, f"{slug}.mdx")
                
                if os.path.exists(file_path):
                    continue
                
                current_date = datetime.now().strftime("%Y-%m-%d")
                
                # Clean strings for safe frontmatter injection
                safe_title = new_title.replace('"', '\\"')
                safe_excerpt = new_excerpt.replace('"', '\\"')
                image_url = extract_image_url(entry, category)
                
                # Build MDX Frontmatter file
                mdx_content = f"""---
title: "{safe_title}"
date: "{current_date}"
author: "VortexWire Editorial Desk"
category: "{category.capitalize()}"
excerpt: "{safe_excerpt}"
featuredImage: "{image_url}"
imageAlt: "{safe_title}"
---

{new_content}
"""
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(mdx_content)
                
                save_posted_title(orig_title)
                posted_titles.add(orig_title)
                count += 1
                print(f"Saved: {file_path}")
                
            except Exception as e:
                print(f"Failed to process article '{orig_title}': {e}")
                continue

if __name__ == "__main__":
    for cat, feed_list in RSS_FEEDS.items():
        process_category(cat, feed_list, max_articles=2)
