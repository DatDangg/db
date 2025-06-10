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

  const {
    _sort,
    _order = 'asc',
    _limit,
    sort,
    order = 'asc',
    limit,
    ...filters
  } = req.query;

  // lọc theo mọi key ngoài sort/order/limit
  Object.entries(filters).forEach(([key, value]) => {
    result = result.filter((item) => String(item[key]) === value);
  });

  // hỗ trợ _sort hoặc sort
  const sortKey = _sort || sort;
  const sortOrder = _sort ? _order : order;
  if (sortKey) {
    result.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (!valA || !valB) return 0;
      const parsedA = isNaN(Date.parse(valA)) ? valA : new Date(valA);
      const parsedB = isNaN(Date.parse(valB)) ? valB : new Date(valB);
      if (parsedA < parsedB) return sortOrder === 'desc' ? 1 : -1;
      if (parsedA > parsedB) return sortOrder === 'desc' ? -1 : 1;
      return 0;
    });
  }

  // hỗ trợ _limit hoặc limit
  const finalLimit = Number(_limit || limit);
  if (!isNaN(finalLimit)) {
    result = result.slice(0, finalLimit);
  }

  res.status(200).json(result);
}
