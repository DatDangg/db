import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'db.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read db.json', detail: error.message });
  }
}