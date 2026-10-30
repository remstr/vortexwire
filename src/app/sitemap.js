import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const baseUrl = 'https://www.vortexwire.fyi';

export default async function sitemap() {
  const contentDirectory = path.join(process.cwd(), 'content');
  const categories = ['culture', 'tech', 'automotive'];
  
  // Static pages
  const routes = [
    '',
    '/about',
    '/contact',
    '/disclaimer',
    ...categories.map((cat) => `/${cat}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic article pages from content folders
  let posts = [];
  categories.forEach((category) => {
    const catDir = path.join(contentDirectory, category);
    if (fs.existsSync(catDir)) {
      const filenames = fs.readdirSync(catDir);
      filenames.forEach((filename) => {
        if (filename.endsWith('.mdx')) {
          const filePath = path.join(catDir, filename);
          const stats = fs.statSync(filePath);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContents);

          posts.push({
            url: `${baseUrl}/${category}/${filename.replace(/\.mdx$/, '').toLowerCase()}`,
            lastModified: new Date(data.date || stats.mtime).toISOString(),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        }
      });
    }
  });

  return [...routes, ...posts];
}
