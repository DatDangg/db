import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const filePath = path.join(process.cwd(), 'data', 'db.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let result = data.blog;

  const { sort, order = 'asc', ...filters } = req.query;
  Object.entries(filters).forEach(([key, value]) => {
    result = result.filter((item) => String(item[key]) === value);
  });

  if (sort) {
    result.sort((a, b) => {
      const valA = a[sort];
      const valB = b[sort];
      if (!valA || !valB) return 0;
      const parsedA = isNaN(Date.parse(valA)) ? valA : new Date(valA);
      const parsedB = isNaN(Date.parse(valB)) ? valB : new Date(valB);
      if (parsedA < parsedB) return order === 'desc' ? 1 : -1;
      if (parsedA > parsedB) return order === 'desc' ? -1 : 1;
      return 0;
    });
  }

  res.status(200).json(result);
}