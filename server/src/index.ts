import express from 'express';
import cors from 'cors';
import prisma from './db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Keep original filename but prepend timestamp to avoid collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

// Get all logs
app.get('/api/logs', async (req, res) => {
  const { search, tag } = req.query;
  try {
    let where: any = {};
    if (search) {
      const terms = String(search).trim().split(/\s+/);
      if (terms.length > 0) {
        where.AND = terms.map((term: string) => ({
          OR: [
            { title: { contains: term } },
            { content: { contains: term } }
          ]
        }));
      }
    }

    if (tag) {
      where.tags = {
        some: {
          name: String(tag)
        }
      };
    }

    const logs = await prisma.log.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { tags: true }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Get log by id
app.get('/api/logs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const log = await prisma.log.findUnique({
      where: { id: Number(id) },
      include: { 
        tags: true,
        history: {
          orderBy: { updatedAt: 'desc' }
        }
      }
    });
    if (log) {
      res.json(log);
    } else {
      res.status(404).json({ error: 'Log not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch log' });
  }
});

// Create new log
app.get('/', (req, res) => {
  res.send('Hello from Personal Blog Server!');
});

app.post('/api/logs', async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }
  
  if (tags && (!Array.isArray(tags) || tags.length > 3)) {
    res.status(400).json({ error: 'Tags must be an array of max 3 strings' });
    return;
  }

  try {
    const newLog = await prisma.log.create({
      data: {
        title,
        content,
        tags: tags ? {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        } : undefined
      },
      include: { tags: true }
    });
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create log' });
  }
});

// Update log
app.put('/api/logs/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  
  if (tags && (!Array.isArray(tags) || tags.length > 3)) {
    res.status(400).json({ error: 'Tags must be an array of max 3 strings' });
    return;
  }

  try {
    const existingLog = await prisma.log.findUnique({ where: { id: Number(id) } });
    if (!existingLog) {
      res.status(404).json({ error: 'Log not found' });
      return;
    }

    // Create history record with OLD content
    await prisma.logHistory.create({
      data: {
        logId: Number(id),
        content: existingLog.content
      }
    });

    // Upsert tags to ensure they exist for 'set'
    if (tags) {
      for (const tag of tags) {
        await prisma.tag.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag }
        });
      }
    }

    const updatedLog = await prisma.log.update({
      where: { id: Number(id) },
      data: { 
        title, 
        content,
        tags: tags ? {
          set: tags.map((t: string) => ({ name: t }))
        } : undefined
      },
      include: { tags: true }
    });
    res.json(updatedLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update log' });
  }
});

// Delete log
app.delete('/api/logs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.log.delete({
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
