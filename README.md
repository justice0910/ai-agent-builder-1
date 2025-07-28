# AI Agent Builder - Real AI Pipeline System

A powerful AI pipeline builder that allows you to create, configure, and execute custom AI processing workflows using real AI services.

## 🚀 Features

### Real AI Integration
- **Groq AI Integration**: Uses Groq's Llama 3.1 model for real AI processing
- **Multiple AI Operations**: Summarize, translate, rewrite, and extract information
- **Configurable Steps**: Customize each step with specific parameters
- **Pipeline Execution**: Execute multi-step AI workflows with real-time processing

### Pipeline Management
- **Visual Pipeline Builder**: Drag-and-drop interface for building AI workflows
- **Step Configuration**: Configure each step with specific parameters
- **Pipeline Testing**: Test pipelines with custom input text
- **Execution History**: Track and review pipeline executions
- **Real-time Results**: See step-by-step AI processing results

### Supported AI Operations

#### 📝 Summarize
- **Length Options**: Short (1-2 sentences), Medium (3-4 sentences), Long (5-6 sentences)
- **Format Options**: Paragraph, Bullet points, Numbered outline

#### 🌐 Translate
- **Target Languages**: Spanish, French, German, Chinese, Japanese, and more
- **Context Preservation**: Maintains original meaning and context

#### ✏️ Rewrite
- **Tone Options**: Casual, Formal, Professional, Friendly, Academic
- **Style Options**: Concise, Detailed, Persuasive, Informative

#### 🔍 Extract
- **Keywords**: Extract important terms and phrases
- **Entities**: Identify people, organizations, locations, dates
- **Topics**: Identify main themes and subjects
- **Sentiment**: Analyze emotional tone and confidence

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **DND Kit** for drag-and-drop
- **Sonner** for toast notifications

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database management
- **PostgreSQL** for data persistence
- **Groq AI SDK** for AI processing

### Database Schema
- **Users**: User management and authentication
- **Pipelines**: Pipeline definitions and metadata
- **Pipeline Steps**: Individual AI processing steps
- **Pipeline Executions**: Execution tracking and history
- **Execution Outputs**: Step-by-step results storage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Groq API key

### 1. Clone and Install
```bash
git clone <repository-url>
cd ai-agent-builder-1
npm install
```

### 2. Environment Setup

#### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/ai_agent_builder
GROQ_API_KEY=your_groq_api_key_here
PORT=3002
NODE_ENV=development
```

#### Frontend (.env)
```env
GROQ_API_KEY=your_groq_api_key_here
VITE_API_BASE_URL=http://localhost:3002/api
```

### 3. Database Setup
```bash
cd backend
npm run db:generate
npm run db:push
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3002/api

## 📖 Usage Guide

### Creating Your First Pipeline

1. **Access the Dashboard**
   - Navigate to the dashboard after authentication
   - Click "Create New Pipeline"

2. **Add Pipeline Steps**
   - Click "Add Step" to add AI operations
   - Choose from: Summarize, Translate, Rewrite, Extract
   - Configure each step with specific parameters
   - Drag and drop to reorder steps

3. **Configure Step Parameters**
   - **Summarize**: Set length and format preferences
   - **Translate**: Choose target language
   - **Rewrite**: Select tone and style
   - **Extract**: Choose extraction type

4. **Test Your Pipeline**
   - Use the Test Panel to input custom text
   - Click "Run Pipeline" to execute
   - View real-time step-by-step results
   - Copy individual step outputs

5. **Save Your Pipeline**
   - Click "Save Pipeline" to persist your workflow
   - Access saved pipelines from the pipeline list
   - Edit and update existing pipelines

### Example Pipeline Workflows

#### Content Summarization Pipeline
1. **Extract Keywords** → Identify main topics
2. **Summarize** → Create concise summary
3. **Translate** → Convert to target language

#### Content Enhancement Pipeline  
1. **Rewrite** → Improve tone and style
2. **Extract Entities** → Identify key information
3. **Summarize** → Create executive summary

## 🔧 API Endpoints

### Pipeline Management
- `POST /api/pipelines` - Create pipeline
- `GET /api/pipelines` - Get user pipelines
- `GET /api/pipelines/:id` - Get specific pipeline
- `PUT /api/pipelines/:id` - Update pipeline
- `DELETE /api/pipelines/:id` - Delete pipeline

### Pipeline Execution
- `POST /api/pipelines/execute` - Execute pipeline
- `GET /api/pipelines/executions` - Get execution history
- `GET /api/pipelines/executions/:id` - Get execution details

## 🎯 Real AI Processing

The system uses **Groq's Llama 3.1 model** for all AI operations:

- **Fast Processing**: Groq's optimized inference
- **High Quality**: State-of-the-art language model
- **Reliable**: Production-ready AI service
- **Scalable**: Handles multiple concurrent requests

### AI Processing Flow
1. **Input Validation** → Check text quality and length
2. **Prompt Engineering** → Create optimized prompts for each operation
3. **AI Processing** → Execute with Groq's API
4. **Result Processing** → Clean and format outputs
5. **Step Chaining** → Pass results to next step
6. **Execution Tracking** → Log performance and results

## 🔒 Security & Performance

### Security Features
- **API Key Management**: Secure environment variable handling
- **User Isolation**: Pipeline access control
- **Input Validation**: Sanitize and validate user inputs
- **Error Handling**: Graceful failure management

### Performance Optimizations
- **Connection Pooling**: Efficient database connections
- **Caching**: Reduce redundant AI calls
- **Async Processing**: Non-blocking pipeline execution
- **Progress Tracking**: Real-time execution status

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Configure production credentials
2. **Database Migration**: Run schema migrations
3. **Build Frontend**: `npm run build` in frontend directory
4. **Start Services**: Use PM2 or similar process manager

### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3002
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ using React, Node.js, and Groq AI**
