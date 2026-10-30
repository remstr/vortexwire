import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export function getPostsByCategory(category) {
  const catDir = path.join(contentDirectory, category.toLowerCase());
  
  if (!fs.existsSync(catDir)) {
    return [];
  }

  const filenames = fs.readdirSync(catDir).filter((filename) => filename.endsWith('.mdx'));
  
  const posts = filenames.map((filename) => {
    const filePath = path.join(catDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath); // Capture exact file creation/modification timestamp
    const { data, content } = matter(fileContents);

    return {
      slug: filename.replace(/\.mdx$/, '').toLowerCase(),
      category: category.toLowerCase(),
      birthtime: stats.birthtimeMs || stats.mtimeMs,
      ...data,
      content,
    };
  });

  // Sort posts primarily by date descending, with file timestamp tie-breaker
  return posts.sort((a, b) => {
    const dateComparison = new Date(b.date) - new Date(a.date);
    if (dateComparison !== 0) return dateComparison;
    return b.birthtime - a.birthtime;
  });
}
