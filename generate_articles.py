import os
import re
from datetime import datetime

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    return re.sub(r'[\s_-]+', '-', text).strip('-')

def save_article_to_mdx(category, title, excerpt, content, image_url, image_alt):
    slug = slugify(title)
    cat_folder = category.lower()
    target_dir = os.path.join("content", cat_folder)
    
    # Ensure the directory exists
    os.makedirs(target_dir, exist_ok=True)
    
    file_path = os.path.join(target_dir, f"{slug}.mdx")
    
    if os.path.exists(file_path):
        print(f"Article already exists: {slug}.mdx")
        return

    current_date = datetime.now().strftime("%Y-%m-%d")
    
    # VortexWire MDX Frontmatter format
    mdx_content = f"""---
title: "{title}"
date: "{current_date}"
author: "VortexWire Editorial Desk"
category: "{category.capitalize()}"
excerpt: "{excerpt}"
featuredImage: "{image_url}"
imageAlt: "{image_alt}"
---

{content}
"""

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(mdx_content)
    
    print(f"Successfully created new article: {file_path}")

if __name__ == "__main__":
    # Test sample data (replace this with your Gemini/RSS scraping logic)
    save_article_to_mdx(
        category="tech",
        title="Apple's New Touchscreen MacBook Pro",
        excerpt="Apple's new touchscreen laptop arrives with a massive price tag.",
        content="## The Future of MacBooks\n\nApple has finally integrated touchscreens into its pro lineup, shaking up the industry...",
        image_url="https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
        image_alt="Apple MacBook Pro"
    )
