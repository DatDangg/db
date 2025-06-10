import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  const filePath = path.join(process.cwd(), 'data', 'db.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.status(200).json(data.comment);
}
