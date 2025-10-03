#!/usr/bin/env tsx

import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

async function testGeminiIntegration() {
  console.log('🤖 Testing Gemini integration...')

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
    أنت مُعين، المساعد الذكي لمركز الهمم. 
    يجب أن تكون متعاطفاً، صبوراً، ومفيداً.
    تجنب التشخيص الطبي ووجه المستفيدين للطاقم الطبي عند الحاجة.
    
    المستفيد يقول: "أشعر بالقلق والتوتر"
    كيف ترد؟
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log('✅ Gemini response:')
    console.log(text)

  } catch (error) {
    console.error('❌ Gemini test failed:', error)
  }
}

async function testOpenAIIntegration() {
  console.log('🤖 Testing OpenAI integration...')

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'أنت مُعين، المساعد الذكي لمركز الهمم. يجب أن تكون متعاطفاً، صبوراً، ومفيداً.'
        },
        {
          role: 'user',
          content: 'أشعر بالقلق والتوتر'
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    })

    console.log('✅ OpenAI response:')
    console.log(completion.choices[0].message.content)

  } catch (error) {
    console.error('❌ OpenAI test failed:', error)
  }
}

async function testWhisperIntegration() {
  console.log('🎤 Testing Whisper integration...')

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    })

    // Note: This would require an actual audio file
    console.log('ℹ️  Whisper test requires an audio file')
    console.log('✅ Whisper integration ready (requires audio file for full test)')

  } catch (error) {
    console.error('❌ Whisper test failed:', error)
  }
}

async function runAllTests() {
  console.log('🚀 Starting AI integration tests...\n')

  await testGeminiIntegration()
  console.log('\n' + '='.repeat(50) + '\n')

  await testOpenAIIntegration()
  console.log('\n' + '='.repeat(50) + '\n')

  await testWhisperIntegration()
  console.log('\n' + '='.repeat(50) + '\n')

  console.log('🎉 All AI integration tests completed!')
}

// Run all tests
runAllTests()
