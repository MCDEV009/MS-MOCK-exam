import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import User from './models/User.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/milliy_cert_mock';

const sampleQuestions = [
    {
        questionText: 'Agar a = 5 va b = 3 bo\'lsa, 2a + 3b ifodaning qiymatini toping.',
        options: { A: '19', B: '21', C: '15', D: '16' },
        correctAnswer: 'A',
        category: 'algebra',
        subject: 'matematika',
        topic: 'Algebraik ifodalar',
        difficulty: 'easy',
        language: 'uzbek',
        explanation: '2a + 3b = 2(5) + 3(3) = 10 + 9 = 19'
    },
    {
        questionText: 'Tenglamani yeching: 3x - 5 = 10',
        options: { A: '3', B: '5', C: '6', D: '4' },
        correctAnswer: 'B',
        category: 'algebra',
        subject: 'matematika',
        topic: 'Chiziqli tenglamalar',
        difficulty: 'easy',
        language: 'uzbek',
        explanation: '3x = 15 => x = 5'
    },
    {
        questionText: 'Doiraning yuzi S = 36π bo\'lsa, uning radiusini toping.',
        options: { A: '6', B: '12', C: '18', D: '9' },
        correctAnswer: 'A',
        category: 'geometriya',
        subject: 'matematika',
        topic: 'Planimetriya',
        difficulty: 'medium',
        language: 'uzbek',
        explanation: 'S = πr^2 => 36π = πr^2 => r^2 = 36 => r = 6'
    },
    {
        questionText: 'Funksiyaning hosilasini toping: f(x) = x^3 - 2x',
        options: { A: '3x^2 - 2', B: '3x^2 + 2', C: '2x^2 - 2', D: '3x^2' },
        correctAnswer: 'A',
        category: 'funksiyalar',
        subject: 'matematika',
        topic: 'Hosila',
        difficulty: 'medium',
        language: 'uzbek',
        explanation: '(x^3)\' = 3x^2, (-2x)\' = -2'
    },
    {
        questionText: 'Ehtimollar nazariyasi: Tangani 2 marta tashlaganda, ikkisi ham gerb tushish ehtimolini toping.',
        options: { A: '1/2', B: '1/4', C: '3/4', D: '1/3' },
        correctAnswer: 'B',
        category: 'ehtimollar',
        subject: 'matematika',
        topic: 'Ehtimollar',
        difficulty: 'hard',
        language: 'uzbek',
        explanation: 'Har bir tashlash 1/2. P = 1/2 * 1/2 = 1/4'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        let user = await User.findOne();
        if (!user) {
            console.log('Creating a dummy admin user...');
            user = await User.create({
                username: 'admin',
                email: 'admin@example.com',
                password: 'password123', // In real app should be hashed
                role: 'admin',
                fullName: 'Admin User'
            });
        }

        // Prepare questions with required fields
        const questionsToInsert = [];

        // Generate more questions by duplicating the samples with slight variations or just repeating
        // to ensure we have enough for "count: 50" if needed, but for now just inserting samples.
        // The frontend default might request 50, but usually tests handle fewer if available or we need to generate more.
        // Let's generate 60 questions by cycling through samples.

        for (let i = 0; i < 60; i++) {
            const sample = sampleQuestions[i % sampleQuestions.length];
            questionsToInsert.push({
                ...sample,
                questionText: `${sample.questionText} (V${i + 1})`, // Make unique
                createdBy: user._id,
                status: 'approved' // CRITICAL for the filter
            });
        }

        await Question.deleteMany({ questionText: { $regex: /\(V\d+\)$/ } }); // Clean up previous seeds if any
        await Question.insertMany(questionsToInsert);

        console.log(`✅ Seeded ${questionsToInsert.length} questions successfully`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
