import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

interface Submission {
  name: string;
  email: string;
  phone: string;
  github_link: string;
  stopwatch_time: number;
}

interface Database {
  submissions: Submission[];
}

const dbPath = path.join(__dirname, '..', 'db.json');

app.use(express.json());

app.get('/ping', (req, res) => {
  res.json(true);
});

app.post('/submit', (req, res) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  console.log('Received submission:', req.body);

  if (!name || !email || !phone || !github_link || stopwatch_time === undefined) {
    return res.status(400).json({ error: 'Invalid submission data' });
  }

  const newSubmission: Submission = { name, email, phone, github_link, stopwatch_time };

  const data: Database = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  data.submissions.push(newSubmission);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  res.json({ success: true });
});

app.get('/read', (req, res) => {
  const index = parseInt(req.query.index as string);
  console.log('Requested index:', index);
  
  const data: Database = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  if (index >= 0 && index < data.submissions.length) {
    res.json(data.submissions[index]);
  } else {
    res.status(404).json({ error: 'Submission not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
