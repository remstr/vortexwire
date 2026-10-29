import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export function getPostsByCategory(category) {
  const catDir = path.join(contentDirectory, category);
  
  if (!fs.existsSync(catDir)) {
    return [];
  }

  const filenames = fs.readdirSync(catDir);
  const posts = filenames.map((filename) => {
    const filePath = path.join(catDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: filename.replace(/\.mdx$/, ''),
      ...data,
      content,
    };
  });

  // Sort posts by date descending
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}