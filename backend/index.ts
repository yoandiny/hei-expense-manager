import 'dotenv/config';
import express from 'express';
import categoryRoutes from './routes/categories';
import summaryRoutes from './routes/summary';

const app = express();
app.use(express.json());
app.use('/api/categories', categoryRoutes);
app.use('/api/summary', summaryRoutes);

app.get('/', (req, res) => {
    res.send('API Personal Expense Tracker fonctionne !');
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server démarré sur le port ${PORT}`);
});