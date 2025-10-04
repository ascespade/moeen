#!/bin/bash

# 🤖 AI Builder Integration - تكامل منهجية Builder AI
# تطبيق منهجية Builder AI للمشروع والذكاء الاصطناعي

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
AI_CONFIG_DIR="/home/codeserver/.config/ai-builder"
WORKSPACE_DIR="/home/codeserver/workspace"
TEMPLATES_DIR="/home/codeserver/workspace/ai-templates"
API_SERVER_DIR="/home/codeserver/ai-api-server"

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Install AI development tools
install_ai_tools() {
    log "🤖 تثبيت أدوات الذكاء الاصطناعي..."
    
    # Python AI libraries
    pip3 install --upgrade \
        openai \
        anthropic \
        langchain \
        langchain-openai \
        langchain-anthropic \
        streamlit \
        gradio \
        fastapi \
        uvicorn \
        pydantic \
        python-dotenv \
        requests \
        aiohttp \
        websockets \
        sqlalchemy \
        alembic \
        redis \
        celery \
        numpy \
        pandas \
        matplotlib \
        seaborn \
        plotly \
        jupyter \
        notebook \
        jupyterlab
    
    # Node.js AI libraries
    if command -v npm &> /dev/null; then
        npm install -g \
            @anthropic-ai/sdk \
            openai \
            langchain \
            @langchain/openai \
            @langchain/anthropic \
            express \
            socket.io \
            axios \
            dotenv \
            cors \
            helmet \
            morgan \
            winston \
            joi \
            bcryptjs \
            jsonwebtoken \
            mongoose \
            prisma \
            @prisma/client
    fi
    
    log "✅ تم تثبيت أدوات الذكاء الاصطناعي"
}

# Create AI project templates
create_ai_templates() {
    log "📋 إنشاء قوالب مشاريع الذكاء الاصطناعي..."
    
    mkdir -p "$TEMPLATES_DIR"
    
    # FastAPI + OpenAI Template
    mkdir -p "$TEMPLATES_DIR/fastapi-openai"
    cat > "$TEMPLATES_DIR/fastapi-openai/main.py" << 'EOF'
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv
import logging

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Builder API",
    description="FastAPI + OpenAI Integration",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

class ChatRequest(BaseModel):
    message: str
    model: str = "gpt-3.5-turbo"
    max_tokens: int = 1000
    temperature: float = 0.7

class ChatResponse(BaseModel):
    response: str
    model: str
    tokens_used: int

@app.get("/")
async def root():
    return {"message": "AI Builder API is running!"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = openai.ChatCompletion.create(
            model=request.model,
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for software development."},
                {"role": "user", "content": request.message}
            ],
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )
        
        return ChatResponse(
            response=response.choices[0].message.content,
            model=request.model,
            tokens_used=response.usage.total_tokens
        )
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/code-review")
async def code_review(code: str):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert code reviewer. Analyze the code and provide constructive feedback."},
                {"role": "user", "content": f"Please review this code:\n\n{code}"}
            ],
            max_tokens=1500,
            temperature=0.3
        )
        
        return {"review": response.choices[0].message.content}
    except Exception as e:
        logger.error(f"Code review error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-code")
async def generate_code(description: str, language: str = "python"):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"You are an expert {language} developer. Generate clean, well-documented code."},
                {"role": "user", "content": f"Generate {language} code for: {description}"}
            ],
            max_tokens=2000,
            temperature=0.5
        )
        
        return {"code": response.choices[0].message.content}
    except Exception as e:
        logger.error(f"Code generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF

    cat > "$TEMPLATES_DIR/fastapi-openai/requirements.txt" << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
openai==1.3.5
python-dotenv==1.0.0
pydantic==2.5.0
python-multipart==0.0.6
aiofiles==23.2.1
EOF

    cat > "$TEMPLATES_DIR/fastapi-openai/.env.example" << 'EOF'
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/aibuilder
REDIS_URL=redis://localhost:6379
SECRET_KEY=your_secret_key_here
DEBUG=True
EOF

    # React + AI Frontend Template
    mkdir -p "$TEMPLATES_DIR/react-ai-frontend"
    cat > "$TEMPLATES_DIR/react-ai-frontend/package.json" << 'EOF'
{
  "name": "react-ai-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.5.1",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.68",
    "@types/react": "^18.2.42",
    "@types/react-dom": "^18.2.17",
    "axios": "^1.6.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "react-scripts": "5.0.1",
    "socket.io-client": "^4.7.4",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4",
    "@mui/material": "^5.14.20",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.19",
    "react-markdown": "^9.0.1",
    "prismjs": "^1.29.0",
    "react-syntax-highlighter": "^15.5.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

    cat > "$TEMPLATES_DIR/react-ai-frontend/src/App.tsx" << 'EOF'
import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/chat', {
        message: input,
        model: 'gpt-3.5-turbo'
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to get response from AI');
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        🤖 AI Builder Chat
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3, minHeight: '400px', maxHeight: '400px', overflow: 'auto' }}>
        {messages.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            Start a conversation with your AI assistant!
          </Typography>
        ) : (
          messages.map((message, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color={message.role === 'user' ? 'primary' : 'secondary'}>
                {message.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
              </Typography>
              <Paper elevation={1} sx={{ p: 2, mt: 1, bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100' }}>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Paper>
            </Box>
          ))
        )}
        {loading && (
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" gap={2}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          sx={{ minWidth: '120px' }}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
}

export default App;
EOF

    # Streamlit AI Dashboard Template
    mkdir -p "$TEMPLATES_DIR/streamlit-ai-dashboard"
    cat > "$TEMPLATES_DIR/streamlit-ai-dashboard/app.py" << 'EOF'
import streamlit as st
import openai
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Configure page
st.set_page_config(
    page_title="AI Builder Dashboard",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

def main():
    st.title("🤖 AI Builder Dashboard")
    st.markdown("---")
    
    # Sidebar
    with st.sidebar:
        st.header("🛠️ Tools")
        tool = st.selectbox(
            "Select Tool",
            ["Chat Assistant", "Code Generator", "Code Reviewer", "Data Analyzer"]
        )
    
    if tool == "Chat Assistant":
        chat_assistant()
    elif tool == "Code Generator":
        code_generator()
    elif tool == "Code Reviewer":
        code_reviewer()
    elif tool == "Data Analyzer":
        data_analyzer()

def chat_assistant():
    st.header("💬 Chat Assistant")
    
    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("What can I help you with?"):
        # Add user message
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Generate AI response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                try:
                    response = openai.ChatCompletion.create(
                        model="gpt-3.5-turbo",
                        messages=[
                            {"role": "system", "content": "You are a helpful AI assistant for software development."},
                            *st.session_state.messages
                        ]
                    )
                    
                    ai_response = response.choices[0].message.content
                    st.markdown(ai_response)
                    st.session_state.messages.append({"role": "assistant", "content": ai_response})
                    
                except Exception as e:
                    st.error(f"Error: {str(e)}")

def code_generator():
    st.header("🔧 Code Generator")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        language = st.selectbox(
            "Programming Language",
            ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust"]
        )
        
        description = st.text_area(
            "Describe what you want to build:",
            height=150,
            placeholder="e.g., Create a REST API endpoint for user authentication"
        )
        
        if st.button("Generate Code", type="primary"):
            if description:
                with st.spinner("Generating code..."):
                    try:
                        response = openai.ChatCompletion.create(
                            model="gpt-4",
                            messages=[
                                {"role": "system", "content": f"You are an expert {language} developer. Generate clean, well-documented code with best practices."},
                                {"role": "user", "content": f"Generate {language} code for: {description}"}
                            ],
                            max_tokens=2000,
                            temperature=0.5
                        )
                        
                        generated_code = response.choices[0].message.content
                        st.session_state.generated_code = generated_code
                        
                    except Exception as e:
                        st.error(f"Error: {str(e)}")
    
    with col2:
        if hasattr(st.session_state, 'generated_code'):
            st.subheader("Generated Code:")
            st.code(st.session_state.generated_code, language=language.lower())
            
            if st.button("Copy to Clipboard"):
                st.success("Code copied to clipboard!")

def code_reviewer():
    st.header("🔍 Code Reviewer")
    
    code_input = st.text_area(
        "Paste your code here:",
        height=300,
        placeholder="Paste the code you want reviewed..."
    )
    
    if st.button("Review Code", type="primary"):
        if code_input:
            with st.spinner("Reviewing code..."):
                try:
                    response = openai.ChatCompletion.create(
                        model="gpt-4",
                        messages=[
                            {"role": "system", "content": "You are an expert code reviewer. Provide constructive feedback on code quality, security, performance, and best practices."},
                            {"role": "user", "content": f"Please review this code:\n\n{code_input}"}
                        ],
                        max_tokens=1500,
                        temperature=0.3
                    )
                    
                    review = response.choices[0].message.content
                    st.markdown("### 📝 Code Review:")
                    st.markdown(review)
                    
                except Exception as e:
                    st.error(f"Error: {str(e)}")

def data_analyzer():
    st.header("📊 Data Analyzer")
    
    # Sample data for demonstration
    data = {
        'Date': pd.date_range('2024-01-01', periods=30, freq='D'),
        'API Calls': [100 + i*5 + (i%7)*20 for i in range(30)],
        'Tokens Used': [1000 + i*50 + (i%5)*100 for i in range(30)],
        'Response Time': [0.5 + (i%10)*0.1 for i in range(30)]
    }
    
    df = pd.DataFrame(data)
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        # API Calls chart
        fig_calls = px.line(df, x='Date', y='API Calls', title='API Calls Over Time')
        st.plotly_chart(fig_calls, use_container_width=True)
        
        # Tokens usage chart
        fig_tokens = px.bar(df, x='Date', y='Tokens Used', title='Token Usage')
        st.plotly_chart(fig_tokens, use_container_width=True)
    
    with col2:
        # Metrics
        st.metric("Total API Calls", f"{df['API Calls'].sum():,}")
        st.metric("Total Tokens", f"{df['Tokens Used'].sum():,}")
        st.metric("Avg Response Time", f"{df['Response Time'].mean():.2f}s")
        
        # Recent activity
        st.subheader("Recent Activity")
        recent_data = df.tail(5)[['Date', 'API Calls']].copy()
        recent_data['Date'] = recent_data['Date'].dt.strftime('%m-%d')
        st.dataframe(recent_data, hide_index=True)

if __name__ == "__main__":
    main()
EOF

    cat > "$TEMPLATES_DIR/streamlit-ai-dashboard/requirements.txt" << 'EOF'
streamlit==1.28.2
openai==1.3.5
pandas==2.1.4
plotly==5.17.0
python-dotenv==1.0.0
numpy==1.24.3
EOF

    chown -R codeserver:codeserver "$TEMPLATES_DIR"
    
    log "✅ تم إنشاء قوالب مشاريع الذكاء الاصطناعي"
}

# Create AI API server
create_ai_api_server() {
    log "🚀 إنشاء خادم API للذكاء الاصطناعي..."
    
    mkdir -p "$API_SERVER_DIR"
    
    # Main API server
    cat > "$API_SERVER_DIR/main.py" << 'EOF'
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import openai
import anthropic
import os
import json
import logging
import asyncio
from datetime import datetime
import redis
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ai_builder.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis setup
redis_client = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

# Models
class ChatLog(Base):
    __tablename__ = "chat_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    message = Column(Text)
    response = Column(Text)
    model = Column(String)
    tokens_used = Column(Integer)
    response_time = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(
    title="AI Builder API Server",
    description="Advanced AI integration with multiple providers",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# AI Clients
openai.api_key = os.getenv("OPENAI_API_KEY")
anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    provider: str = Field(default="openai", regex="^(openai|anthropic)$")
    model: str = "gpt-3.5-turbo"
    max_tokens: int = Field(default=1000, ge=1, le=4000)
    temperature: float = Field(default=0.7, ge=0, le=2)
    system_prompt: Optional[str] = None
    user_id: Optional[str] = None

class CodeRequest(BaseModel):
    description: str
    language: str = "python"
    framework: Optional[str] = None
    complexity: str = Field(default="simple", regex="^(simple|intermediate|advanced)$")
    include_tests: bool = False
    include_docs: bool = True

class ReviewRequest(BaseModel):
    code: str
    language: str = "python"
    focus_areas: List[str] = ["security", "performance", "best_practices"]

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # Add your token verification logic here
    return {"user_id": "default_user"}

# Routes
@app.get("/")
async def root():
    return {
        "message": "AI Builder API Server",
        "version": "2.0.0",
        "status": "running",
        "providers": ["openai", "anthropic"],
        "endpoints": ["/chat", "/generate-code", "/review-code", "/analyze-project"]
    }

@app.post("/chat")
async def chat(
    request: ChatRequest,
    background_tasks: BackgroundTasks,
    user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    start_time = datetime.utcnow()
    
    try:
        if request.provider == "openai":
            messages = []
            if request.system_prompt:
                messages.append({"role": "system", "content": request.system_prompt})
            messages.append({"role": "user", "content": request.message})
            
            response = openai.ChatCompletion.create(
                model=request.model,
                messages=messages,
                max_tokens=request.max_tokens,
                temperature=request.temperature
            )
            
            ai_response = response.choices[0].message.content
            tokens_used = response.usage.total_tokens
            
        elif request.provider == "anthropic":
            response = anthropic_client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=request.max_tokens,
                temperature=request.temperature,
                system=request.system_prompt or "You are a helpful AI assistant.",
                messages=[{"role": "user", "content": request.message}]
            )
            
            ai_response = response.content[0].text
            tokens_used = response.usage.input_tokens + response.usage.output_tokens
        
        response_time = (datetime.utcnow() - start_time).total_seconds()
        
        # Log to database
        background_tasks.add_task(
            log_chat,
            db,
            user.get("user_id"),
            request.message,
            ai_response,
            request.model,
            tokens_used,
            response_time
        )
        
        return {
            "response": ai_response,
            "provider": request.provider,
            "model": request.model,
            "tokens_used": tokens_used,
            "response_time": response_time
        }
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-code")
async def generate_code(
    request: CodeRequest,
    user: dict = Depends(verify_token)
):
    try:
        complexity_prompts = {
            "simple": "Create simple, beginner-friendly code",
            "intermediate": "Create well-structured code with moderate complexity",
            "advanced": "Create sophisticated, production-ready code with advanced patterns"
        }
        
        system_prompt = f"""You are an expert {request.language} developer. 
        {complexity_prompts[request.complexity]}.
        {"Include comprehensive unit tests." if request.include_tests else ""}
        {"Include detailed documentation and comments." if request.include_docs else ""}
        {"Use the {request.framework} framework." if request.framework else ""}
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate {request.language} code for: {request.description}"}
            ],
            max_tokens=3000,
            temperature=0.5
        )
        
        return {
            "code": response.choices[0].message.content,
            "language": request.language,
            "complexity": request.complexity,
            "tokens_used": response.usage.total_tokens
        }
        
    except Exception as e:
        logger.error(f"Code generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/review-code")
async def review_code(
    request: ReviewRequest,
    user: dict = Depends(verify_token)
):
    try:
        focus_areas_text = ", ".join(request.focus_areas)
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system", 
                    "content": f"You are an expert code reviewer. Focus on: {focus_areas_text}. Provide specific, actionable feedback."
                },
                {
                    "role": "user", 
                    "content": f"Review this {request.language} code:\n\n{request.code}"
                }
            ],
            max_tokens=2000,
            temperature=0.3
        )
        
        return {
            "review": response.choices[0].message.content,
            "language": request.language,
            "focus_areas": request.focus_areas,
            "tokens_used": response.usage.total_tokens
        }
        
    except Exception as e:
        logger.error(f"Code review error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats(
    user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        total_chats = db.query(ChatLog).count()
        total_tokens = db.query(ChatLog).with_entities(
            db.func.sum(ChatLog.tokens_used)
        ).scalar() or 0
        avg_response_time = db.query(ChatLog).with_entities(
            db.func.avg(ChatLog.response_time)
        ).scalar() or 0
        
        return {
            "total_chats": total_chats,
            "total_tokens": total_tokens,
            "average_response_time": round(avg_response_time, 2),
            "uptime": "Available via health endpoint"
        }
        
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def log_chat(db: Session, user_id: str, message: str, response: str, model: str, tokens: int, response_time: float):
    chat_log = ChatLog(
        user_id=user_id,
        message=message,
        response=response,
        model=model,
        tokens_used=tokens,
        response_time=response_time
    )
    db.add(chat_log)
    db.commit()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
EOF

    # Requirements
    cat > "$API_SERVER_DIR/requirements.txt" << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
openai==1.3.5
anthropic==0.7.7
python-dotenv==1.0.0
pydantic==2.5.0
sqlalchemy==2.0.23
redis==5.0.1
python-multipart==0.0.6
aiofiles==23.2.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
EOF

    # Docker configuration
    cat > "$API_SERVER_DIR/Dockerfile" << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
EOF

    cat > "$API_SERVER_DIR/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  ai-api:
    build: .
    ports:
      - "8001:8001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/aibuilder
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: aibuilder
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

    chown -R codeserver:codeserver "$API_SERVER_DIR"
    
    log "✅ تم إنشاء خادم API للذكاء الاصطناعي"
}

# Create AI configuration
create_ai_config() {
    log "⚙️ إنشاء تكوين الذكاء الاصطناعي..."
    
    mkdir -p "$AI_CONFIG_DIR"
    
    cat > "$AI_CONFIG_DIR/config.json" << 'EOF'
{
    "providers": {
        "openai": {
            "api_key_env": "OPENAI_API_KEY",
            "models": {
                "chat": ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo-preview"],
                "code": ["gpt-4", "gpt-3.5-turbo"],
                "embeddings": ["text-embedding-ada-002"]
            },
            "rate_limits": {
                "requests_per_minute": 60,
                "tokens_per_minute": 90000
            }
        },
        "anthropic": {
            "api_key_env": "ANTHROPIC_API_KEY",
            "models": {
                "chat": ["claude-3-sonnet-20240229", "claude-3-opus-20240229"],
                "code": ["claude-3-sonnet-20240229"]
            },
            "rate_limits": {
                "requests_per_minute": 50,
                "tokens_per_minute": 40000
            }
        }
    },
    "features": {
        "code_generation": true,
        "code_review": true,
        "chat_assistant": true,
        "project_analysis": true,
        "documentation_generation": true,
        "test_generation": true
    },
    "settings": {
        "default_provider": "openai",
        "default_model": "gpt-3.5-turbo",
        "max_tokens": 2000,
        "temperature": 0.7,
        "enable_logging": true,
        "enable_caching": true,
        "cache_ttl": 3600
    },
    "integrations": {
        "vscode": {
            "enabled": true,
            "extensions": [
                "ms-python.python",
                "ms-vscode.vscode-typescript-next",
                "github.copilot"
            ]
        },
        "git": {
            "enabled": true,
            "auto_commit_messages": true,
            "code_review_on_pr": true
        }
    }
}
EOF

    chown -R codeserver:codeserver "$AI_CONFIG_DIR"
    
    log "✅ تم إنشاء تكوين الذكاء الاصطناعي"
}

# Create AI CLI tools
create_ai_cli_tools() {
    log "🛠️ إنشاء أدوات سطر الأوامر للذكاء الاصطناعي..."
    
    # AI Chat CLI
    cat > /usr/local/bin/ai-chat << 'EOF'
#!/usr/bin/env python3
import requests
import sys
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_BASE = "http://localhost:8001"

def chat(message, provider="openai", model="gpt-3.5-turbo"):
    try:
        response = requests.post(f"{API_BASE}/chat", json={
            "message": message,
            "provider": provider,
            "model": model
        })
        
        if response.status_code == 200:
            data = response.json()
            print(f"🤖 {data['response']}")
            print(f"\n📊 Tokens: {data['tokens_used']}, Time: {data['response_time']:.2f}s")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Connection error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: ai-chat <message> [provider] [model]")
        sys.exit(1)
    
    message = sys.argv[1]
    provider = sys.argv[2] if len(sys.argv) > 2 else "openai"
    model = sys.argv[3] if len(sys.argv) > 3 else "gpt-3.5-turbo"
    
    chat(message, provider, model)
EOF

    # AI Code Generator CLI
    cat > /usr/local/bin/ai-code << 'EOF'
#!/usr/bin/env python3
import requests
import sys
import json

API_BASE = "http://localhost:8001"

def generate_code(description, language="python", complexity="simple"):
    try:
        response = requests.post(f"{API_BASE}/generate-code", json={
            "description": description,
            "language": language,
            "complexity": complexity,
            "include_tests": True,
            "include_docs": True
        })
        
        if response.status_code == 200:
            data = response.json()
            print(f"🔧 Generated {language} code:")
            print("=" * 50)
            print(data['code'])
            print("=" * 50)
            print(f"📊 Tokens used: {data['tokens_used']}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Connection error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: ai-code <description> [language] [complexity]")
        print("Languages: python, javascript, typescript, java, go, rust")
        print("Complexity: simple, intermediate, advanced")
        sys.exit(1)
    
    description = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else "python"
    complexity = sys.argv[3] if len(sys.argv) > 3 else "simple"
    
    generate_code(description, language, complexity)
EOF

    # Make scripts executable
    chmod +x /usr/local/bin/ai-chat
    chmod +x /usr/local/bin/ai-code
    
    log "✅ تم إنشاء أدوات سطر الأوامر للذكاء الاصطناعي"
}

# Setup AI integration with Code Server
integrate_ai_with_code_server() {
    log "🔗 تكامل الذكاء الاصطناعي مع Code Server..."
    
    # Create AI extension settings
    AI_SETTINGS_DIR="/home/codeserver/.local/share/code-server/User"
    mkdir -p "$AI_SETTINGS_DIR"
    
    cat > "$AI_SETTINGS_DIR/ai-settings.json" << 'EOF'
{
    "ai.enabled": true,
    "ai.provider": "openai",
    "ai.model": "gpt-3.5-turbo",
    "ai.apiEndpoint": "http://localhost:8001",
    "ai.features": {
        "codeCompletion": true,
        "codeReview": true,
        "chatAssistant": true,
        "documentationGeneration": true,
        "testGeneration": true
    },
    "ai.shortcuts": {
        "chat": "Ctrl+Shift+A",
        "generateCode": "Ctrl+Shift+G",
        "reviewCode": "Ctrl+Shift+R",
        "generateDocs": "Ctrl+Shift+D"
    }
}
EOF

    # Create AI workspace configuration
    cat > "$WORKSPACE_DIR/.vscode/ai-workspace.json" << 'EOF'
{
    "ai": {
        "enabled": true,
        "autoSuggestions": true,
        "contextAware": true,
        "projectAnalysis": true,
        "codeOptimization": true
    },
    "extensions": {
        "recommended": [
            "ms-python.python",
            "ms-vscode.vscode-typescript-next",
            "github.copilot",
            "tabnine.tabnine-vscode",
            "visualstudioexptteam.vscodeintellicode"
        ]
    }
}
EOF

    chown -R codeserver:codeserver "$AI_SETTINGS_DIR" "$WORKSPACE_DIR/.vscode"
    
    log "✅ تم تكامل الذكاء الاصطناعي مع Code Server"
}

# Main setup function
main() {
    echo -e "${PURPLE}🤖 AI Builder Integration Setup${NC}"
    echo -e "${CYAN}==================================${NC}"
    
    install_ai_tools
    create_ai_templates
    create_ai_api_server
    create_ai_config
    create_ai_cli_tools
    integrate_ai_with_code_server
    
    echo ""
    echo -e "${GREEN}🎉 AI Builder Integration Complete!${NC}"
    echo -e "${CYAN}==================================${NC}"
    echo -e "${BLUE}🚀 Available Features:${NC}"
    echo -e "${YELLOW}  • FastAPI + OpenAI/Anthropic integration${NC}"
    echo -e "${YELLOW}  • React AI frontend templates${NC}"
    echo -e "${YELLOW}  • Streamlit AI dashboard${NC}"
    echo -e "${YELLOW}  • Advanced API server with database${NC}"
    echo -e "${YELLOW}  • CLI tools for AI interactions${NC}"
    echo ""
    echo -e "${BLUE}🛠️ Commands:${NC}"
    echo -e "${GREEN}  ai-chat 'Your message here'${NC}"
    echo -e "${GREEN}  ai-code 'Create a REST API' python${NC}"
    echo -e "${GREEN}  cd $API_SERVER_DIR && python main.py${NC}"
    echo ""
    echo -e "${BLUE}📁 Templates Location:${NC}"
    echo -e "${GREEN}  $TEMPLATES_DIR${NC}"
    echo ""
    echo -e "${BLUE}🔧 API Server:${NC}"
    echo -e "${GREEN}  Location: $API_SERVER_DIR${NC}"
    echo -e "${GREEN}  URL: http://localhost:8001${NC}"
    echo -e "${GREEN}  Docs: http://localhost:8001/docs${NC}"
}

# Execute main function
main "$@"
