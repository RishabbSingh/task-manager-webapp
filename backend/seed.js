require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  dueDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

const sampleTasks = [
  { title: 'Set up project repository', description: 'Initialize Git repo, add .gitignore and README', priority: 'High', status: 'Completed', dueDate: new Date('2025-01-10') },
  { title: 'Design database schema', description: 'Plan out MongoDB collections and relationships', priority: 'High', status: 'Completed', dueDate: new Date('2025-01-15') },
  { title: 'Build REST API endpoints', description: 'Create CRUD routes for tasks with authentication middleware', priority: 'High', status: 'In Progress', dueDate: new Date('2025-02-01') },
  { title: 'Implement JWT authentication', description: 'Register, login, and protect routes using JWT tokens', priority: 'High', status: 'In Progress', dueDate: new Date('2025-02-05') },
  { title: 'Build React frontend', description: 'Create dashboard with task list, filters, and pagination', priority: 'Medium', status: 'Pending', dueDate: new Date('2025-02-20') },
  { title: 'Add Tailwind CSS styling', description: 'Style all components with Tailwind utility classes', priority: 'Medium', status: 'Pending', dueDate: new Date('2025-02-25') },
  { title: 'Write unit tests', description: 'Cover controllers and middleware with Jest tests', priority: 'Low', status: 'Pending', dueDate: new Date('2025-03-01') },
  { title: 'Deploy to production', description: 'Deploy backend to Railway and frontend to Vercel', priority: 'Medium', status: 'Pending', dueDate: new Date('2025-03-10') },
  { title: 'Configure CI/CD pipeline', description: 'Set up GitHub Actions for automated testing and deployment', priority: 'Low', status: 'Pending', dueDate: new Date('2025-03-15') },
  { title: 'Performance optimization', description: 'Add caching, indexes, and lazy loading for better performance', priority: 'Low', status: 'Pending', dueDate: new Date('2025-03-20') },
];

const seed = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('   URI:', process.env.MONGODB_URI?.substring(0, 40) + '...');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully!\n');

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('   Done\n');

    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 12);
    const user = await User.create({ name: 'Demo User', email: 'demo@taskflow.com', password: hashedPassword, role: 'user' });
    await User.create({ name: 'Admin User', email: 'admin@taskflow.com', password: hashedPassword, role: 'admin' });
    console.log('   ✅ Users created\n');

    console.log('📋 Creating tasks...');
    await Task.insertMany(sampleTasks.map(t => ({ ...t, user: user._id })));
    console.log('   ✅ 10 tasks created\n');

    console.log('═══════════════════════════════════════');
    console.log('🎉 Seeded! Login with:');
    console.log('   Email:    demo@taskflow.com');
    console.log('   Password: password123');
    console.log('═══════════════════════════════════════');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    if (error.message.includes('ECONNREFUSED')) console.error('💡 MongoDB is not running locally — use Atlas URI');
    else if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) console.error('💡 Wrong username/password in MONGODB_URI');
    else if (error.message.includes('timed out')) console.error('💡 IP not whitelisted — add 0.0.0.0/0 in Atlas Network Access');
    process.exit(1);
  }
};

seed();