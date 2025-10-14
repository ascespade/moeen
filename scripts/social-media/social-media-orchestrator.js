#!/usr/bin/env node
// social-media-orchestrator.js
// Social Media Posting Automation System
// Handles multi-platform posting with Google Drive integration, scheduling, and engagement tracking

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const winston = require('winston');
const cron = require('node-cron');
const FormData = require('form-data');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const GoogleDriveIntegration = require('./google-drive-integration');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/social-media.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class SocialMediaOrchestrator {
  constructor() {
    this.config = {
      platforms: {
        tiktok: {
          enabled: !!process.env.TIKTOK_CLIENT_KEY,
          clientKey: process.env.TIKTOK_CLIENT_KEY,
          clientSecret: process.env.TIKTOK_CLIENT_SECRET,
          accessToken: process.env.TIKTOK_ACCESS_TOKEN,
          apiUrl: 'https://open-api.tiktok.com'
        },
        instagram: {
          enabled: !!process.env.INSTAGRAM_ACCESS_TOKEN,
          accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
          apiUrl: 'https://graph.facebook.com/v18.0'
        },
        linkedin: {
          enabled: !!process.env.LINKEDIN_ACCESS_TOKEN,
          accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
          apiUrl: 'https://api.linkedin.com/v2'
        },
        facebook: {
          enabled: !!process.env.FACEBOOK_ACCESS_TOKEN,
          accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
          apiUrl: 'https://graph.facebook.com/v18.0'
        }
      },
      postingSchedule: {
        enabled: true,
        times: ['09:00', '15:00', '21:00'], // Post 3 times per day
        timezone: 'Asia/Riyadh'
      },
      videosPerDay: 3,
      maxRetries: 3,
      retryDelay: 5000
    };
    
    this.googleDrive = new GoogleDriveIntegration();
    this.stats = {
      postsScheduled: 0,
      postsPublished: 0,
      postsFailed: 0,
      videosProcessed: 0,
      engagementTracked: 0,
      errors: 0,
      lastPost: null,
      platforms: {}
    };
    this.isRunning = false;
    this.postQueue = [];
    this.isInitialized = false;
  }

  async initialize() {
    logger.info('🚀 Initializing Social Media Orchestrator...');
    
    try {
      // Initialize Google Drive integration
      await this.googleDrive.initialize();
      
      // Validate platform configurations
      await this.validatePlatforms();
      
      // Load existing post queue
      await this.loadPostQueue();
      
      // Schedule posting tasks
      this.schedulePostingTasks();
      
      // Start engagement tracking
      this.startEngagementTracking();
      
      this.isInitialized = true;
      logger.info('✅ Social Media Orchestrator initialized successfully');
      
    } catch (error) {
      logger.error('❌ Failed to initialize Social Media Orchestrator:', error);
      throw error;
    }
  }

  async validatePlatforms() {
    logger.info('🔍 Validating platform configurations...');
    
    for (const [platform, config] of Object.entries(this.config.platforms)) {
      if (config.enabled) {
        try {
          await this.testPlatformConnection(platform, config);
          logger.info(`✅ ${platform} platform validated`);
        } catch (error) {
          logger.error(`❌ ${platform} platform validation failed:`, error);
          config.enabled = false;
        }
      } else {
        logger.info(`⏭️ ${platform} platform disabled`);
      }
    }
  }

  async testPlatformConnection(platform, config) {
    switch (platform) {
      case 'tiktok':
        return await this.testTikTokConnection(config);
      case 'instagram':
        return await this.testInstagramConnection(config);
      case 'linkedin':
        return await this.testLinkedInConnection(config);
      case 'facebook':
        return await this.testFacebookConnection(config);
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }

  async testTikTokConnection(config) {
    try {
      const response = await axios.get(`${config.apiUrl}/user/info/`, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`
        }
      });
      
      if (response.status === 200) {
        logger.info(`✅ TikTok connected as: ${response.data.data?.display_name || 'Unknown'}`);
        return true;
      }
      throw new Error(`Unexpected status: ${response.status}`);
    } catch (error) {
      logger.error('❌ TikTok connection test failed:', error.message);
      throw error;
    }
  }

  async testInstagramConnection(config) {
    try {
      const response = await axios.get(`${config.apiUrl}/me`, {
        params: {
          access_token: config.accessToken,
          fields: 'id,name'
        }
      });
      
      if (response.status === 200) {
        logger.info(`✅ Instagram connected as: ${response.data.name || 'Unknown'}`);
        return true;
      }
      throw new Error(`Unexpected status: ${response.status}`);
    } catch (error) {
      logger.error('❌ Instagram connection test failed:', error.message);
      throw error;
    }
  }

  async testLinkedInConnection(config) {
    try {
      const response = await axios.get(`${config.apiUrl}/people/~`, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      if (response.status === 200) {
        logger.info(`✅ LinkedIn connected as: ${response.data.firstName || 'Unknown'}`);
        return true;
      }
      throw new Error(`Unexpected status: ${response.status}`);
    } catch (error) {
      logger.error('❌ LinkedIn connection test failed:', error.message);
      throw error;
    }
  }

  async testFacebookConnection(config) {
    try {
      const response = await axios.get(`${config.apiUrl}/me`, {
        params: {
          access_token: config.accessToken,
          fields: 'id,name'
        }
      });
      
      if (response.status === 200) {
        logger.info(`✅ Facebook connected as: ${response.data.name || 'Unknown'}`);
        return true;
      }
      throw new Error(`Unexpected status: ${response.status}`);
    } catch (error) {
      logger.error('❌ Facebook connection test failed:', error.message);
      throw error;
    }
  }

  async loadPostQueue() {
    try {
      const queueData = await fs.readFile('./temp/post-queue.json', 'utf8');
      this.postQueue = JSON.parse(queueData);
      logger.info(`📋 Loaded ${this.postQueue.length} posts from queue`);
    } catch (error) {
      logger.info('📋 No existing post queue found, starting fresh');
      this.postQueue = [];
    }
  }

  async savePostQueue() {
    try {
      await fs.writeFile('./temp/post-queue.json', JSON.stringify(this.postQueue, null, 2));
      logger.info(`💾 Saved ${this.postQueue.length} posts to queue`);
    } catch (error) {
      logger.error('❌ Failed to save post queue:', error);
    }
  }

  schedulePostingTasks() {
    logger.info('⏰ Scheduling posting tasks...');
    
    if (this.config.postingSchedule.enabled) {
      // Schedule posts at specified times
      this.config.postingSchedule.times.forEach(time => {
        cron.schedule(`0 ${time.split(':')[1]} ${time.split(':')[0]} * * *`, async () => {
          logger.info(`📅 Scheduled posting time: ${time}`);
          await this.processScheduledPosts();
        });
      });
    }

    // Daily video selection and queue preparation
    cron.schedule('0 6 * * *', async () => {
      logger.info('🌅 Daily video selection and queue preparation...');
      await this.prepareDailyPosts();
    });

    // Queue processing every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      await this.processPostQueue();
    });
  }

  async prepareDailyPosts() {
    logger.info('📹 Preparing daily posts...');
    
    try {
      // Select random videos for the day
      const videos = await this.googleDrive.selectRandomVideos(this.config.videosPerDay);
      
      if (videos.length === 0) {
        logger.warn('⚠️ No videos available for posting');
        return;
      }
      
      // Create posts for each video
      for (const video of videos) {
        await this.createPostFromVideo(video);
      }
      
      await this.savePostQueue();
      logger.info(`✅ Prepared ${videos.length} posts for the day`);
      
    } catch (error) {
      logger.error('❌ Failed to prepare daily posts:', error);
      this.stats.errors++;
    }
  }

  async createPostFromVideo(video) {
    logger.info(`📝 Creating post for video: ${video.name}`);
    
    try {
      const post = {
        id: uuidv4(),
        videoId: video.id,
        videoName: video.name,
        videoUrl: video.webViewLink,
        thumbnailUrl: video.thumbnailLink,
        caption: this.generateCaption(video),
        hashtags: this.generateHashtags(video),
        platforms: this.selectPlatformsForVideo(video),
        scheduledTime: this.calculateNextPostTime(),
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        attempts: 0,
        lastAttempt: null,
        results: {}
      };
      
      this.postQueue.push(post);
      this.stats.postsScheduled++;
      
      logger.info(`✅ Created post ${post.id} for ${post.platforms.join(', ')}`);
      
    } catch (error) {
      logger.error(`❌ Failed to create post for video ${video.name}:`, error);
      this.stats.errors++;
    }
  }

  generateCaption(video) {
    const templates = [
      `🎥 ${video.name} - اكتشف المزيد من المحتوى المميز!`,
      `✨ ${video.name} - محتوى جديد ومثير للاهتمام!`,
      `🚀 ${video.name} - لا تفوت هذا المحتوى الرائع!`,
      `💡 ${video.name} - تعلم شيئاً جديداً اليوم!`,
      `🎯 ${video.name} - محتوى مفيد وممتع!`
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate;
  }

  generateHashtags(video) {
    const baseHashtags = ['#مُعين', '#مركز_الهمم', '#صحة', '#رعاية_صحية'];
    const categoryHashtags = {
      'tutorial': ['#تعليم', '#دروس', '#تعلم'],
      'demo': ['#عرض', '#تجربة', '#تجريب'],
      'educational': ['#تعليمي', '#معلومات', '#ثقافة'],
      'business': ['#أعمال', '#مهني', '#شركات'],
      'healthcare': ['#طب', '#صحة', '#علاج'],
      'technology': ['#تقنية', '#تكنولوجيا', '#برمجة']
    };
    
    const videoHashtags = categoryHashtags[video.category] || [];
    const allHashtags = [...baseHashtags, ...videoHashtags, ...video.tags.map(tag => `#${tag}`)];
    
    // Return random selection of hashtags (max 10)
    return allHashtags.slice(0, 10).join(' ');
  }

  selectPlatformsForVideo(video) {
    const enabledPlatforms = Object.entries(this.config.platforms)
      .filter(([_, config]) => config.enabled)
      .map(([name, _]) => name);
    
    // Select 2-3 random platforms for each video
    const count = Math.min(Math.floor(Math.random() * 2) + 2, enabledPlatforms.length);
    return this.shuffleArray(enabledPlatforms).slice(0, count);
  }

  calculateNextPostTime() {
    const now = new Date();
    const times = this.config.postingSchedule.times.map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledTime = new Date(now);
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // If the time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      return scheduledTime;
    });
    
    // Return the earliest available time
    return times.sort((a, b) => a - b)[0].toISOString();
  }

  async processScheduledPosts() {
    logger.info('📅 Processing scheduled posts...');
    
    const now = new Date();
    const scheduledPosts = this.postQueue.filter(post => 
      post.status === 'scheduled' && 
      new Date(post.scheduledTime) <= now
    );
    
    for (const post of scheduledPosts) {
      await this.publishPost(post);
    }
    
    await this.savePostQueue();
  }

  async processPostQueue() {
    // Process any failed posts that can be retried
    const retryablePosts = this.postQueue.filter(post => 
      post.status === 'failed' && 
      post.attempts < this.config.maxRetries
    );
    
    for (const post of retryablePosts) {
      await this.publishPost(post);
    }
    
    if (retryablePosts.length > 0) {
      await this.savePostQueue();
    }
  }

  async publishPost(post) {
    logger.info(`📤 Publishing post ${post.id}...`);
    
    post.attempts++;
    post.lastAttempt = new Date().toISOString();
    
    try {
      // Download video if needed
      const videoPath = await this.downloadVideoForPost(post);
      
      // Publish to each platform
      for (const platform of post.platforms) {
        try {
          const result = await this.publishToPlatform(platform, post, videoPath);
          post.results[platform] = {
            success: true,
            postId: result.postId,
            url: result.url,
            publishedAt: new Date().toISOString()
          };
          
          logger.info(`✅ Published to ${platform}: ${result.postId}`);
          
        } catch (error) {
          logger.error(`❌ Failed to publish to ${platform}:`, error);
          post.results[platform] = {
            success: false,
            error: error.message,
            attemptedAt: new Date().toISOString()
          };
        }
      }
      
      // Check if any platform succeeded
      const successCount = Object.values(post.results).filter(r => r.success).length;
      
      if (successCount > 0) {
        post.status = 'published';
        this.stats.postsPublished++;
        logger.info(`✅ Post ${post.id} published successfully to ${successCount} platforms`);
      } else {
        post.status = 'failed';
        this.stats.postsFailed++;
        logger.error(`❌ Post ${post.id} failed on all platforms`);
      }
      
      // Clean up downloaded video
      if (videoPath) {
        try {
          await fs.unlink(videoPath);
        } catch (error) {
          logger.warn(`⚠️ Failed to clean up video file: ${error.message}`);
        }
      }
      
    } catch (error) {
      logger.error(`❌ Failed to publish post ${post.id}:`, error);
      post.status = 'failed';
      this.stats.postsFailed++;
      this.stats.errors++;
    }
  }

  async downloadVideoForPost(post) {
    try {
      const tempDir = './temp/videos';
      await fs.mkdir(tempDir, { recursive: true });
      
      const fileName = `${post.id}_${post.videoName}`;
      const videoPath = path.join(tempDir, fileName);
      
      await this.googleDrive.downloadVideo(post.videoId, videoPath);
      return videoPath;
      
    } catch (error) {
      logger.error(`❌ Failed to download video for post ${post.id}:`, error);
      throw error;
    }
  }

  async publishToPlatform(platform, post, videoPath) {
    switch (platform) {
      case 'tiktok':
        return await this.publishToTikTok(post, videoPath);
      case 'instagram':
        return await this.publishToInstagram(post, videoPath);
      case 'linkedin':
        return await this.publishToLinkedIn(post, videoPath);
      case 'facebook':
        return await this.publishToFacebook(post, videoPath);
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }

  async publishToTikTok(post, videoPath) {
    const config = this.config.platforms.tiktok;
    
    try {
      // TikTok video upload
      const formData = new FormData();
      formData.append('video', fs.createReadStream(videoPath));
      formData.append('description', `${post.caption}\n\n${post.hashtags}`);
      
      const response = await axios.post(`${config.apiUrl}/share/video/upload/`, formData, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          ...formData.getHeaders()
        }
      });
      
      if (response.status === 200) {
        return {
          postId: response.data.data?.share_id || 'unknown',
          url: `https://www.tiktok.com/@your_account/video/${response.data.data?.share_id}`
        };
      }
      
      throw new Error(`TikTok API error: ${response.status}`);
      
    } catch (error) {
      logger.error('❌ TikTok publish failed:', error);
      throw error;
    }
  }

  async publishToInstagram(post, videoPath) {
    const config = this.config.platforms.instagram;
    
    try {
      // Instagram video upload
      const formData = new FormData();
      formData.append('video', fs.createReadStream(videoPath));
      formData.append('caption', `${post.caption}\n\n${post.hashtags}`);
      
      const response = await axios.post(`${config.apiUrl}/me/media`, formData, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          ...formData.getHeaders()
        }
      });
      
      if (response.status === 200) {
        return {
          postId: response.data.id,
          url: `https://www.instagram.com/p/${response.data.id}/`
        };
      }
      
      throw new Error(`Instagram API error: ${response.status}`);
      
    } catch (error) {
      logger.error('❌ Instagram publish failed:', error);
      throw error;
    }
  }

  async publishToLinkedIn(post, videoPath) {
    const config = this.config.platforms.linkedin;
    
    try {
      // LinkedIn video upload
      const formData = new FormData();
      formData.append('video', fs.createReadStream(videoPath));
      formData.append('text', `${post.caption}\n\n${post.hashtags}`);
      
      const response = await axios.post(`${config.apiUrl}/ugcPosts`, formData, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          ...formData.getHeaders()
        }
      });
      
      if (response.status === 201) {
        return {
          postId: response.data.id,
          url: `https://www.linkedin.com/feed/update/${response.data.id}/`
        };
      }
      
      throw new Error(`LinkedIn API error: ${response.status}`);
      
    } catch (error) {
      logger.error('❌ LinkedIn publish failed:', error);
      throw error;
    }
  }

  async publishToFacebook(post, videoPath) {
    const config = this.config.platforms.facebook;
    
    try {
      // Facebook video upload
      const formData = new FormData();
      formData.append('video', fs.createReadStream(videoPath));
      formData.append('description', `${post.caption}\n\n${post.hashtags}`);
      
      const response = await axios.post(`${config.apiUrl}/me/videos`, formData, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          ...formData.getHeaders()
        }
      });
      
      if (response.status === 200) {
        return {
          postId: response.data.id,
          url: `https://www.facebook.com/your_page/videos/${response.data.id}`
        };
      }
      
      throw new Error(`Facebook API error: ${response.status}`);
      
    } catch (error) {
      logger.error('❌ Facebook publish failed:', error);
      throw error;
    }
  }

  startEngagementTracking() {
    logger.info('📊 Starting engagement tracking...');
    
    // Track engagement every hour
    cron.schedule('0 * * * *', async () => {
      await this.trackEngagement();
    });
  }

  async trackEngagement() {
    logger.info('📊 Tracking engagement metrics...');
    
    try {
      const publishedPosts = this.postQueue.filter(post => post.status === 'published');
      
      for (const post of publishedPosts) {
        for (const [platform, result] of Object.entries(post.results)) {
          if (result.success) {
            try {
              const metrics = await this.getPlatformMetrics(platform, result.postId);
              
              // Store metrics in Supabase
              await supabase
                .from('social_media_metrics')
                .insert({
                  post_id: post.id,
                  platform: platform,
                  platform_post_id: result.postId,
                  metrics: metrics,
                  timestamp: new Date().toISOString()
                });
              
              this.stats.engagementTracked++;
              
            } catch (error) {
              logger.error(`❌ Failed to track engagement for ${platform} post ${result.postId}:`, error);
            }
          }
        }
      }
      
    } catch (error) {
      logger.error('❌ Engagement tracking failed:', error);
    }
  }

  async getPlatformMetrics(platform, postId) {
    // This would implement actual API calls to get engagement metrics
    // For now, return mock data
    return {
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 25)
    };
  }

  async saveStatistics() {
    try {
      const statsData = {
        ...this.stats,
        timestamp: new Date().toISOString(),
        queueSize: this.postQueue.length,
        enabledPlatforms: Object.entries(this.config.platforms)
          .filter(([_, config]) => config.enabled)
          .map(([name, _]) => name)
      };
      
      await fs.writeFile('./logs/social-media-stats.json', JSON.stringify(statsData, null, 2));
      
      // Store in Supabase
      await supabase
        .from('system_metrics')
        .insert({
          service_name: 'social-media-orchestrator',
          metrics: statsData,
          timestamp: new Date().toISOString()
        });
      
      logger.info('📊 Statistics saved');
    } catch (error) {
      logger.error('❌ Failed to save statistics:', error);
    }
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async shutdown() {
    logger.info('🛑 Shutting down Social Media Orchestrator...');
    this.isRunning = false;
    
    // Save final statistics and queue
    await this.saveStatistics();
    await this.savePostQueue();
    
    logger.info('✅ Social Media Orchestrator shutdown complete');
    process.exit(0);
  }

  // Public API
  getStats() {
    return {
      ...this.stats,
      queueSize: this.postQueue.length,
      isInitialized: this.isInitialized,
      enabledPlatforms: Object.entries(this.config.platforms)
        .filter(([_, config]) => config.enabled)
        .map(([name, _]) => name)
    };
  }

  async forcePost() {
    logger.info('📤 Force post requested...');
    await this.processScheduledPosts();
  }

  async getPostQueue() {
    return this.postQueue;
  }
}

// Export for use in other modules
module.exports = SocialMediaOrchestrator;

// Run if this file is executed directly
if (require.main === module) {
  const orchestrator = new SocialMediaOrchestrator();
  
  orchestrator.initialize()
    .then(() => {
      logger.info('🚀 Social Media Orchestrator ready');
      
      // Keep process alive
      process.on('SIGINT', () => orchestrator.shutdown());
      process.on('SIGTERM', () => orchestrator.shutdown());
      
    })
    .catch(error => {
      logger.error('❌ Social Media Orchestrator failed:', error);
      process.exit(1);
    });
}
