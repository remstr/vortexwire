import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const baseUrl = 'https://www.vortexwire.fyi';

export async function GET() {
  const contentDirectory = path.join(process.cwd(), 'content');
  const categories = ['culture', 'tech', 'automotive'];
  let allPosts = [];

  categories.forEach((category) => {
    const catDir = path.join(contentDirectory, category);
    if (fs.existsSync(catDir)) {
      const filenames = fs.readdirSync(catDir);
      filenames.forEach((filename) => {
        if (filename.endsWith('.mdx')) {
          const filePath = path.join(catDir, filename);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const stats = fs.statSync(filePath);
          const { data } = matter(fileContents);

          allPosts.push({
            title: data.title,
            link: `${baseUrl}/${category}/${filename.replace(/\.mdx$/, '').toLowerCase()}`,
            description: data.excerpt,
            pubDate: new Date(data.date || stats.mtime).toUTCString(),
            category: category,
          });
        }
      });
    }
  });

  // Sort articles by date descending
  allPosts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  const rssItems = allPosts
    .map(
      (post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${post.link}</link>
        <guid>${post.link}</guid>
        <description><![CDATA[${post.description}]]></description>
        <pubDate>${post.pubDate}</pubDate>
        <category>${post.category}</category>
      </item>
    `
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>VortexWire News Desk</title>
      <link>${baseUrl}</link>
      <description>Automated digital wire service covering Culture, Tech, and Automotive.</description>
      <language>en-us</language>
      <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
      ${rssItems}
    </channel>
  </rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
