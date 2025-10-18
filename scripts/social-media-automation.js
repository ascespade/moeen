#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class SocialMediaAutomation {
  constructor() {
    this.workspaceRoot = path.join(__dirname, '..');
    this.videosDir = path.join(this.workspaceRoot, 'videos');
    this.logFile = path.join(this.workspaceRoot, 'logs', 'social-media.log');
    this.scheduleFile = path.join(
      this.workspaceRoot,
      'temp',
      'post-schedule.json'
    );
    this.configFile = path.join(
      this.workspaceRoot,
      'config',
      'social-media-config.json'
    );
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Social Media: ${message}\n`

    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFileSync(this.logFile, logMessage);
    // console.log(logMessage.trim());
  }

  async initialize() {
    this.log('Initializing Social Media Automation...');

    // Create necessary directories
    const directories = ['videos', 'config', 'logs', 'temp', 'reports'];

    for (const dir of directories) {
      const fullPath = path.join(this.workspaceRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`Created directory: ${dir}`
      }
    }

    // Initialize configuration
    await this.initializeConfig();

    this.log('Social Media Automation initialized');
  }

  async initializeConfig() {
    if (!fs.existsSync(this.configFile)) {
      const defaultConfig = {
        platforms: {
          tiktok: {
            enabled: true,
            apiKey: process.env.TIKTOK_API_KEY || '',
            accessToken: process.env.TIKTOK_ACCESS_TOKEN || '',
            webhookUrl: process.env.TIKTOK_WEBHOOK_URL || ''
          },
          instagram: {
            enabled: true,
            apiKey: process.env.INSTAGRAM_API_KEY || '',
            accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
            webhookUrl: process.env.INSTAGRAM_WEBHOOK_URL || ''
          },
          linkedin: {
            enabled: true,
            apiKey: process.env.LINKEDIN_API_KEY || '',
            accessToken: process.env.LINKEDIN_ACCESS_TOKEN || '',
            webhookUrl: process.env.LINKEDIN_WEBHOOK_URL || ''
          },
          facebook: {
            enabled: true,
            apiKey: process.env.FACEBOOK_API_KEY || '',
            accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
            webhookUrl: process.env.FACEBOOK_WEBHOOK_URL || ''
          }
        },
        posting: {
          postsPerDay: 3,
          minTimeBetweenPosts: 4 * 60 * 60 * 1000, // 4 hours
          maxTimeBetweenPosts: 8 * 60 * 60 * 1000, // 8 hours
          hashtags: [
            '#healthcare',
            '#ai',
            '#innovation',
            '#technology',
            '#medical'
          ]
        },
        content: {
          videoFormats: ['.mp4', '.mov', '.avi', '.mkv'],
          maxFileSize: 100 * 1024 * 1024, // 100MB
          descriptionTemplates: [
            'Amazing healthcare innovation! {hashtags}',
            'Check out this breakthrough in medical technology! {hashtags}',
            'Revolutionary healthcare solution! {hashtags}',
            'The future of healthcare is here! {hashtags}'
          ]
        }
      };

      // Ensure config directory exists
      const configDir = path.dirname(this.configFile);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      fs.writeFileSync(this.configFile, JSON.stringify(defaultConfig, null, 2));
      this.log('Default configuration created');
    }
  }

  async loadConfig() {
    try {
      const configData = fs.readFileSync(this.configFile, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      this.log(`Error loading config: ${error.message}`
      return null;
    }
  }

  async getAvailableVideos() {
    this.log('Scanning for available videos...');

    const videos = [];

    if (!fs.existsSync(this.videosDir)) {
      this.log('Videos directory does not exist');
      return videos;
    }

    try {
      const files = fs.readdirSync(this.videosDir);
      const config = await this.loadConfig();

      for (const file of files) {
        const filePath = path.join(this.videosDir, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
          const ext = path.extname(file).toLowerCase();

          if (config.content.videoFormats.includes(ext)) {
            if (stats.size <= config.content.maxFileSize) {
              videos.push({
                filename: file,
                path: filePath,
                size: stats.size,
                modified: stats.mtime.toISOString()
              });
            } else {
              this.log(
                `Video too large: ${file} (${Math.round(stats.size / 1024 / 1024)}MB)`
              );
            }
          }
        }
      }
    } catch (error) {
      this.log(`Error scanning videos: ${error.message}`
    }

    this.log(`Found ${videos.length} available videos`
    return videos;
  }

  async selectRandomVideos(count = 3) {
    this.log(`Selecting ${count} random videos...`

    const availableVideos = await this.getAvailableVideos();

    if (availableVideos.length === 0) {
      this.log('No videos available for posting');
      return [];
    }

    if (availableVideos.length <= count) {
      this.log(`Only ${availableVideos.length} videos available, using all`
      return availableVideos;
    }

    // Select random videos
    const selectedVideos = [];
    const usedIndices = new Set();

    while (
      selectedVideos.length < count &&
      selectedVideos.length < availableVideos.length
    ) {
      const randomIndex = Math.floor(Math.random() * availableVideos.length);

      if (!usedIndices.has(randomIndex)) {
        selectedVideos.push(availableVideos[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }

    this.log(`Selected ${selectedVideos.length} videos for posting`
    return selectedVideos;
  }

  async generatePostSchedule() {
    this.log('Generating post schedule...');

    const config = await this.loadConfig();
    if (!config) {
      throw new Error('Failed to load configuration');
    }

    const selectedVideos = await this.selectRandomVideos(
      config.posting.postsPerDay
    );

    if (selectedVideos.length === 0) {
      this.log('No videos selected for posting');
      return [];
    }

    const schedule = [];
    const now = new Date();

    for (let i = 0; i < selectedVideos.length; i++) {
      const video = selectedVideos[i];

      // Calculate random time between min and max intervals
      const minInterval = config.posting.minTimeBetweenPosts;
      const maxInterval = config.posting.maxTimeBetweenPosts;
      const randomInterval =
        minInterval + Math.random() * (maxInterval - minInterval);

      const postTime = new Date(now.getTime() + i * randomInterval);

      // Generate description
      const description = this.generateDescription(video, config);

      schedule.push({
        id: `post_${Date.now()}_${i}`
        video: video,
        scheduledTime: postTime.toISOString(),
        platforms: Object.keys(config.platforms).filter(
          (platform) => config.platforms[platform].enabled
        ),
        description: description,
        status: 'scheduled'
      });
    }

    // Save schedule
    fs.writeFileSync(this.scheduleFile, JSON.stringify(schedule, null, 2));

    this.log(`Generated schedule with ${schedule.length} posts`
    return schedule;
  }

  generateDescription(video, config) {
    const templates = config.content.descriptionTemplates;
    const hashtags = config.posting.hashtags.join(' ');

    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace('{hashtags}', hashtags);
  }

  async postToPlatform(platform, postData) {
    this.log(`Posting to ${platform}...`

    const config = await this.loadConfig();
    if (!config || !config.platforms[platform]) {
      throw new Error(`Platform ${platform} not configured`
    }

    const platformConfig = config.platforms[platform];

    if (!platformConfig.enabled) {
      this.log(`Platform ${platform} is disabled, skipping`
      return { success: false, reason: 'disabled' };
    }

    try {
      // Simulate API call to platform
      const result = await this.simulatePlatformPost(
        platform,
        postData,
        platformConfig
      );

      this.log(`Successfully posted to ${platform}`
      return { success: true, result: result };
    } catch (error) {
      this.log(`Failed to post to ${platform}: ${error.message}`
      return { success: false, error: error.message };
    }
  }

  async simulatePlatformPost(platform, postData, platformConfig) {
    // Simulate API call delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Simulate potential errors
    if (Math.random() < 0.1) {
      // 10% chance of error
      throw new Error(`Simulated ${platform} API error`
    }

    return {
      platform: platform,
      postId: `${platform}_${Date.now()}`
      url: `https://${platform}.com/post/${Date.now()}`
      timestamp: new Date().toISOString()
    };
  }

  async executeScheduledPosts() {
    this.log('Executing scheduled posts...');

    if (!fs.existsSync(this.scheduleFile)) {
      this.log('No schedule file found');
      return [];
    }

    const schedule = JSON.parse(fs.readFileSync(this.scheduleFile, 'utf8'));
    const now = new Date();
    const results = [];

    for (const post of schedule) {
      if (post.status !== 'scheduled') {
        continue;
      }

      const postTime = new Date(post.scheduledTime);

      if (postTime <= now) {
        this.log(`Executing post: ${post.id}`

        const postResults = [];

        for (const platform of post.platforms) {
          const result = await this.postToPlatform(platform, post);
          postResults.push({
            platform: platform,
            ...result
          });
        }

        // Update post status
        post.status = 'completed';
        post.results = postResults;
        post.completedAt = new Date().toISOString();

        results.push({
          postId: post.id,
          video: post.video.filename,
          results: postResults
        });

        this.log(`Post ${post.id} completed`
      }
    }

    // Save updated schedule
    fs.writeFileSync(this.scheduleFile, JSON.stringify(schedule, null, 2));

    this.log(`Executed ${results.length} posts`
    return results;
  }

  async generatePostingReport() {
    this.log('Generating posting report...');

    const report = {
      timestamp: new Date().toISOString(),
      schedule: [],
      summary: {
        totalPosts: 0,
        successfulPosts: 0,
        failedPosts: 0,
        platforms: {}
      }
    };

    if (fs.existsSync(this.scheduleFile)) {
      const schedule = JSON.parse(fs.readFileSync(this.scheduleFile, 'utf8'));
      report.schedule = schedule;

      for (const post of schedule) {
        report.summary.totalPosts++;

        if (post.status === 'completed' && post.results) {
          for (const result of post.results) {
            if (result.success) {
              report.summary.successfulPosts++;
            } else {
              report.summary.failedPosts++;
            }

            if (!report.summary.platforms[result.platform]) {
              report.summary.platforms[result.platform] = {
                successful: 0,
                failed: 0
              };
            }

            if (result.success) {
              report.summary.platforms[result.platform].successful++;
            } else {
              report.summary.platforms[result.platform].failed++;
            }
          }
        }
      }
    }

    // Save report
    const reportFile = path.join(
      this.workspaceRoot,
      'reports',
      'social-media-report.json'
    );
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    this.log(`Posting report saved to: ${reportFile}`
    return report;
  }

  async runAutomation() {
    this.log('Starting social media automation...');

    await this.initialize();

    // Generate schedule
    const schedule = await this.generatePostSchedule();

    if (schedule.length === 0) {
      this.log('No posts scheduled, automation complete');
      return;
    }

    // Execute posts
    const results = await this.executeScheduledPosts();

    // Generate report
    const report = await this.generatePostingReport();

    this.log('Social media automation completed');
    return {
      schedule: schedule,
      results: results,
      report: report
    };
  }
}

// Main execution
if (require.main === module) {
  const automation = new SocialMediaAutomation();

  automation
    .runAutomation()
    .then((result) => {
      // console.log('Social media automation completed successfully');
      if (result) {
        // console.log(JSON.stringify(result, null, 2));
      }
    })
    .catch((error) => {
      // console.error('Social media automation failed:', error);
      process.exit(1);
    });
}

module.exports = SocialMediaAutomation;
