# 🦙 Ollama Setup Guide for Social Studio

## 🚀 Overview

Your Social Studio now uses **Ollama as the fallback AI provider** with the **llama3.2:3b** model, replacing OpenAI. This gives you:

- **🆓 Free local AI** - No API costs or quotas
- **🔒 Privacy** - All processing happens locally
- **⚡ Fast responses** - No network latency
- **🛡️ Reliability** - Always available offline

---

## 📋 Prerequisites

- **Operating System**: Windows 10/11, macOS, or Linux
- **Memory**: At least 4GB RAM for llama3.2:3b
- **Storage**: ~2GB for the model file
- **Network**: Internet connection for initial download

---

## 🔧 Installation Steps

### **1. Install Ollama**

#### **Windows:**
1. Visit: [https://ollama.ai/download/windows](https://ollama.ai/download/windows)
2. Download and run the installer
3. Follow the installation wizard

#### **macOS:**
1. Visit: [https://ollama.ai/download/macos](https://ollama.ai/download/macos)
2. Download the `.dmg` file
3. Drag Ollama to Applications folder

#### **Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### **2. Download the AI Model**

Open terminal/command prompt and run:

```bash
ollama pull llama3.2:3b
```

This downloads the ~2GB model file. Wait for completion.

### **3. Start Ollama Server**

```bash
ollama serve
```

**Note**: Keep this terminal window open while using the Social Studio.

### **4. Verify Installation**

Test that everything works:

```bash
ollama run llama3.2:3b "Hello, tell me about financial markets"
```

You should see a response about financial markets.

---

## ⚙️ Configuration

Your `.env.local` is already configured:

```bash
# Primary AI Provider (Gemini)
GEMINI_API_KEY=your_gemini_key_here

# Fallback AI Provider (Ollama)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

### **Custom Configuration Options:**

#### **Different Model:**
```bash
# Use a different model (must be downloaded first)
OLLAMA_MODEL=llama3.1:8b
```

#### **Remote Ollama Server:**
```bash
# If running Ollama on another machine
OLLAMA_BASE_URL=http://192.168.1.100:11434
```

---

## 🔄 How It Works

### **Request Flow:**
1. **User clicks "Generate Content"**
2. **Try Gemini first** (cloud-based, fast)
3. **If Gemini fails** → Switch to Ollama (local, reliable)
4. **Generate content** using llama3.2:3b model
5. **Return content** with "Ollama" badge

### **Provider Indicators:**
- **Blue "Gemini" badge** → Content from Google Gemini
- **Green "Ollama" badge** → Content from local Ollama
- **Toast notifications** show which provider was used

---

## 🛠️ Troubleshooting

### **Common Issues:**

#### **"Ollama server is not running"**
**Solution:**
```bash
# Start the server
ollama serve
```

#### **"Model not found"**
**Solution:**
```bash
# Download the model
ollama pull llama3.2:3b
```

#### **"Connection refused"**
**Solution:**
1. Check if Ollama is running: `ollama list`
2. Restart Ollama server: `ollama serve`
3. Check port 11434 is not blocked

#### **Slow responses**
**Possible causes:**
- Insufficient RAM (need 4GB+ free)
- CPU usage high from other apps
- Large model on slow storage

**Solutions:**
- Close unnecessary applications
- Use smaller model: `llama3.2:1b`
- Move to SSD storage if on HDD

#### **Model keeps downloading**
**Solution:**
- Wait for complete download
- Check internet connection
- Ensure sufficient disk space

---

## 🎯 Available Models

### **Recommended Models:**

| Model | Size | RAM Required | Speed | Quality |
|-------|------|--------------|-------|---------|
| `llama3.2:1b` | ~1GB | 2GB+ | ⚡⚡⚡ | ⭐⭐⭐ |
| `llama3.2:3b` | ~2GB | 4GB+ | ⚡⚡ | ⭐⭐⭐⭐ |
| `llama3.1:8b` | ~4.7GB | 8GB+ | ⚡ | ⭐⭐⭐⭐⭐ |

### **Switch Models:**

```bash
# Download new model
ollama pull llama3.1:8b

# Update .env.local
OLLAMA_MODEL=llama3.1:8b

# Restart your dev server
npm run dev
```

---

## 📊 Performance Comparison

### **Gemini vs Ollama:**

| Aspect | Gemini (Primary) | Ollama (Fallback) |
|--------|------------------|-------------------|
| **Speed** | ⚡⚡⚡ (Cloud) | ⚡⚡ (Local) |
| **Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Cost** | Free tier limits | Completely free |
| **Privacy** | Cloud processed | Local processing |
| **Reliability** | Depends on quota | Always available |
| **Setup** | Just API key | Install + Download |

---

## 🔍 Testing Your Setup

### **1. Test Individual Models:**

**Test Ollama:**
```bash
curl http://localhost:11434/api/generate \
  -d '{"model":"llama3.2:3b","prompt":"Hello","stream":false}'
```

**Test Integration:**
- Visit: `http://localhost:3000/api/social`
- Should show both Gemini and Ollama status

### **2. Test Content Generation:**
1. Go to Social Studio
2. Configure settings and generate content
3. Look for green "Ollama" badge if Gemini fails

---

## 💡 Pro Tips

### **Performance Optimization:**
1. **Close unnecessary apps** before using Ollama
2. **Use SSD storage** for better model loading
3. **Increase virtual memory** if RAM is limited
4. **Use smaller models** on older hardware

### **Development Workflow:**
1. **Start Ollama** before development: `ollama serve`
2. **Keep terminal open** during development
3. **Monitor resource usage** in task manager
4. **Test both providers** regularly

### **Model Management:**
```bash
# List installed models
ollama list

# Remove unused models
ollama rm llama3.1:8b

# Update models (re-download latest)
ollama pull llama3.2:3b
```

---

## 🎉 Benefits

### **✅ Cost Savings**
- **No OpenAI charges** - Ollama is completely free
- **No quota limits** - Generate unlimited content
- **No API key required** - Just local installation

### **✅ Privacy & Security**
- **Local processing** - Content never leaves your machine
- **No data logging** - Unlike cloud APIs
- **Full control** - Your data, your hardware

### **✅ Reliability**
- **Always available** - No internet required after setup
- **No rate limits** - Generate as much as you want
- **Consistent quality** - Same model, same results

### **✅ Customization**
- **Multiple models** - Choose based on your needs
- **Fine-tuning options** - Adjust temperature, tokens
- **Local deployment** - Scale to multiple machines

---

## 🚀 Next Steps

1. **✅ Install Ollama** following the steps above
2. **✅ Download llama3.2:3b** model
3. **✅ Start the server** with `ollama serve`
4. **✅ Test your setup** in Social Studio
5. **🎯 Generate content** and enjoy free, local AI!

Your Social Studio now has a robust, cost-effective AI fallback system! 🦙🚀

---

## 📞 Support

**Ollama Resources:**
- 📚 [Official Documentation](https://ollama.ai/docs)
- 💬 [Community Discord](https://discord.gg/ollama)
- 🐛 [GitHub Issues](https://github.com/ollama/ollama/issues)

**DerivHub Integration:**
- Check `API_DOCUMENTATION.md` for technical details
- Monitor console logs for debugging
- Test with `/api/social` endpoint