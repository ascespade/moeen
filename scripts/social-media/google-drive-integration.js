#!/usr/bin/env node
// google-drive-integration.js
// Google Drive API integration for video selection and management
// Handles video discovery, metadata extraction, and random selection

const google = require('googleapis');
let fs = require('fs').promises;
let path = require('path');
let winston = require('winston');
const { () => ({} as any) } = require('@supabase/supabase-js');
const v4: uuidv4 = require('uuid');

// Configure Winston logger
let logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/google-drive.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Supabase client
let supabase = () => ({} as any)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class GoogleDriveIntegration {
  constructor() {
    this.config = {
      apiKey: process.env.GOOGLE_DRIVE_API_KEY,
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
      credentialsPath:
        process.env.GOOGLE_CREDENTIALS_PATH || './google-credentials.json',
      videosPerDay: 3,
      supportedFormats: ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'],
      maxFileSize: 500 * 1024 * 1024, // 500MB
      cacheDuration: 24 * 60 * 60 * 1000 // 24 hours
    };
    this.drive = null;
    this.videoCache = new Map();
    this.stats = {
      videosDiscovered: 0,
      videosSelected: 0,
      videosDownloaded: 0,
      errors: 0,
      lastSync: null,
      cacheHits: 0,
      cacheMisses: 0
    };
    this.isInitialized = false;
  }

  async initialize() {
    logger.info('🔧 Initializing Google Drive integration...');

    try {
      // Initialize Google Drive API
      await this.initializeDriveAPI();

      // Test connection
      await this.testConnection();

      // Load video cache
      await this.loadVideoCache();

      this.isInitialized = true;
      logger.info('✅ Google Drive integration initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize Google Drive integration:', error);
      throw error;
    }
  }

  async initializeDriveAPI() {
    try {
      // Try to load credentials from file
      let credentials;
      try {
        let credentialsData = await fs.readFile(
          this.config.credentialsPath,
          'utf8'
        );
        credentials = JSON.parse(credentialsData);
      } catch (error) {
        logger.warn('⚠️ No credentials file found, using API key only');
      }

      // Initialize the Drive API
      this.drive = google.drive({
        version: 'v3',
        auth: credentials
          ? new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive.readonly']
          })
          : this.config.apiKey
      });

      logger.info('✅ Google Drive API initialized');
    } catch (error) {
      logger.error('❌ Failed to initialize Google Drive API:', error);
      throw error;
    }
  }

  async testConnection() {
    logger.info('🔗 Testing Google Drive connection...');

    try {
      let response = await this.drive.about.get({
        fields: 'user,storageQuota'
      });

      logger.info(
        `✅ Connected to Google Drive as: ${response.data.user.displayName}`
      );
      logger.info(
        `📊 Storage quota: ${this.formatBytes(response.data.storageQuota.limit)} total, ${this.formatBytes(response.data.storageQuota.usage)} used`
      );
    } catch (error) {
      logger.error('❌ Failed to test Google Drive connection:', error);
      throw error;
    }
  }

  async loadVideoCache() {
    try {
      let cacheData = await fs.readFile('./temp/video-cache.json', 'utf8');
      let cache = JSON.parse(cacheData);
      this.videoCache = new Map(Object.entries(cache));
      logger.info(`📋 Loaded video cache with ${this.videoCache.size} entries`
    } catch (error) {
      logger.info('📋 No existing video cache found, starting fresh');
      this.videoCache = new Map();
    }
  }

  async saveVideoCache() {
    try {
      let cacheData = Object.fromEntries(this.videoCache);
      await fs.writeFile(
        './temp/video-cache.json',
        JSON.stringify(cacheData, null, 2)
      );
      logger.info(`💾 Saved video cache with ${this.videoCache.size} entries`
    } catch (error) {
      logger.error('❌ Failed to save video cache:', error);
    }
  }

  async discoverVideos(forceRefresh = false) {
    logger.info('🔍 Discovering videos in Google Drive...');

    try {
      // Check cache first
      if (!forceRefresh && this.isCacheValid()) {
        logger.info('📋 Using cached video list');
        this.stats.cacheHits++;
        return Array.from(this.videoCache.values());
      }

      this.stats.cacheMisses++;

      // Search for video files
      let videos = await this.searchVideoFiles();

      // Update cache
      this.videoCache.clear();
      videos.forEach((video) => {
        this.videoCache.set(video.id, video);
      });

      await this.saveVideoCache();

      this.stats.videosDiscovered = videos.length;
      this.stats.lastSync = new Date();

      logger.info(`✅ Discovered ${videos.length} videos`
      return videos;
    } catch (error) {
      logger.error('❌ Failed to discover videos:', error);
      this.stats.errors++;
      throw error;
    }
  }

  async searchVideoFiles() {
    let videos = [];
    let nextPageToken = null;

    do {
      try {
        let query = this.buildSearchQuery();

        let response = await this.drive.files.list({
          q: query,
          fields:
            'nextPageToken, files(id, name, size, mimeType, createdTime, modifiedTime, webViewLink, thumbnailLink)',
          pageSize: 100,
          pageToken: nextPageToken,
          orderBy: 'modifiedTime desc'
        });

        let files = response.data.files || [];

        for (const file of files) {
          if (this.isValidVideoFile(file)) {
            let video = await this.enrichVideoMetadata(file);
            videos.push(video);
          }
        }

        nextPageToken = response.data.nextPageToken;
      } catch (error) {
        logger.error('❌ Error searching video files:', error);
        break;
      }
    } while (nextPageToken);

    return videos;
  }

  buildSearchQuery() {
    let mimeTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-matroska',
      'video/webm',
      'video/x-m4v'
    ];

    let query = `mimeType in '${mimeTypes.join('\',\'')}'`

    if (this.config.folderId) {
      query += ` and '${this.config.folderId}' in parents`
    }

    query += ' and trashed=false';

    return query;
  }

  isValidVideoFile(file) {
    // Check file size
    if (file.size && parseInt(file.size, 10) > this.config.maxFileSize) {
      return false;
    }

    // Check file extension
    let fileName = file.name.toLowerCase();
    let hasValidExtension = this.config.supportedFormats.some((ext) =>
      fileName.endsWith(ext)
    );

    return hasValidExtension;
  }

  async enrichVideoMetadata(file) {
    try {
      // Get additional metadata
      let metadata = await this.drive.files.get({
        fileId: file.id,
        fields:
          'id,name,size,mimeType,createdTime,modifiedTime,webViewLink,thumbnailLink,description,properties'
      });

      let video = {
        id: file.id,
        name: file.name,
        size: parseInt(file.size, 10) || 0,
        mimeType: file.mimeType,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
        thumbnailLink: file.thumbnailLink,
        description: metadata.data.description || '',
        properties: metadata.data.properties || {},
        duration: null,
        resolution: null,
        lastUsed: null,
        usageCount: 0,
        tags: this.extractTags(file.name, metadata.data.description),
        category: this.categorizeVideo(file.name, metadata.data.description)
      };

      // Try to get video duration and resolution (if available)
      try {
        let videoMetadata = await this.getVideoMetadata(file.id);
        video.duration = videoMetadata.duration;
        video.resolution = videoMetadata.resolution;
      } catch (error) {
        // Video metadata might not be available
      }

      return video;
    } catch (error) {
      logger.error(`❌ Failed to enrich metadata for ${file.name}:`
      return {
        id: file.id,
        name: file.name,
        size: parseInt(file.size, 10) || 0,
        mimeType: file.mimeType,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
        thumbnailLink: file.thumbnailLink,
        lastUsed: null,
        usageCount: 0,
        tags: [],
        category: 'uncategorized'
      };
    }
  }

  async getVideoMetadata(fileId) {
    try {
      let response = await this.drive.files.get({
        fileId: fileId,
        fields: 'videoMediaMetadata'
      });

      let metadata = response.data.videoMediaMetadata;
      if (metadata) {
        return {
          duration: metadata.durationMillis
            ? parseInt(metadata.durationMillis, 10)
            : null,
          resolution:
            metadata.width && metadata.height
              ? `${metadata.width}x${metadata.height}`
              : null
        };
      }

      return { duration: null, resolution: null };
    } catch (error) {
      logger.error(`❌ Failed to get video metadata for ${fileId}:`
      return { duration: null, resolution: null };
    }
  }

  extractTags(fileName, description) {
    let tags = [];
    let text = `${fileName} ${description || ''}`

    // Common video tags
    let tagPatterns = {
      tutorial: ['tutorial', 'how to', 'guide', 'learn'],
      demo: ['demo', 'demonstration', 'showcase'],
      educational: ['educational', 'education', 'learning', 'course'],
      entertainment: ['fun', 'entertainment', 'comedy', 'music'],
      business: ['business', 'corporate', 'professional'],
      healthcare: ['health', 'medical', 'healthcare', 'doctor'],
      technology: ['tech', 'technology', 'software', 'app']
    };

    Object.entries(tagPatterns).forEach(([tag, patterns]) => {
      if (patterns.some((pattern) => text.includes(pattern))) {
        tags.push(tag);
      }
    });

    return tags;
  }

  categorizeVideo(fileName, description) {
    let text = `${fileName} ${description || ''}`

    if (text.includes('tutorial') || text.includes('how to')) return 'tutorial';
    if (text.includes('demo') || text.includes('showcase')) return 'demo';
    if (text.includes('educational') || text.includes('course'))
      return 'educational';
    if (text.includes('business') || text.includes('corporate'))
      return 'business';
    if (text.includes('health') || text.includes('medical'))
      return 'healthcare';
    if (text.includes('tech') || text.includes('software')) return 'technology';

    return 'general';
  }

  async selectRandomVideos(count = null) {
    let targetCount = count || this.config.videosPerDay;
    logger.info(`🎲 Selecting ${targetCount} random videos...`

    try {
      // Discover videos if cache is empty
      if (this.videoCache.size === 0) {
        await this.discoverVideos();
      }

      let allVideos = Array.from(this.videoCache.values());

      if (allVideos.length === 0) {
        logger.warn('⚠️ No videos available for selection');
        return [];
      }

      // Filter videos that haven't been used recently
      let availableVideos = allVideos.filter((video) => {
        if (!video.lastUsed) return true;

        const daysSinceLastUsed =
          (Date.now() - new Date(video.lastUsed).getTime()) /
          (1000 * 60 * 60 * 24);
        return daysSinceLastUsed >= 7; // Don't reuse videos for 7 days
      });

      if (availableVideos.length < targetCount) {
        logger.warn(
          `⚠️ Only ${availableVideos.length} videos available (requested ${targetCount})`
        );
      }

      // Select random videos
      let selectedVideos = this.shuffleArray(availableVideos).slice(
        0,
        targetCount
      );

      // Update usage statistics
      for (const video of selectedVideos) {
        video.lastUsed = new Date().toISOString();
        video.usageCount = (video.usageCount || 0) + 1;
        this.videoCache.set(video.id, video);
      }

      await this.saveVideoCache();

      this.stats.videosSelected += selectedVideos.length;

      logger.info(`✅ Selected ${selectedVideos.length} videos`
      return selectedVideos;
    } catch (error) {
      logger.error('❌ Failed to select random videos:', error);
      this.stats.errors++;
      throw error;
    }
  }

  shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async downloadVideo(videoId, outputPath) {
    logger.info(`📥 Downloading video ${videoId}...`

    try {
      let response = await this.drive.files.get(
        {
          fileId: videoId,
          alt: 'media'
        },
        {
          responseType: 'stream'
        }
      );

      let writeStream = require('fs').createWriteStream(outputPath);
      response.data.pipe(writeStream);

      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          logger.info(`✅ Video downloaded to ${outputPath}`
          this.stats.videosDownloaded++;
          resolve(outputPath);
        });

        writeStream.on('error', (error) => {
          logger.error(`❌ Failed to download video ${videoId}:`
          reject(error);
        });
      });
    } catch (error) {
      logger.error(`❌ Failed to download video ${videoId}:`
      this.stats.errors++;
      throw error;
    }
  }

  async getVideoDownloadUrl(videoId) {
    try {
      let response = await this.drive.files.get({
        fileId: videoId,
        fields: 'webContentLink'
      });

      return response.data.webContentLink;
    } catch (error) {
      logger.error(
        `❌ Failed to get download URL for video ${videoId}:`
        error
      );
      throw error;
    }
  }

  isCacheValid() {
    if (!this.stats.lastSync) return false;

    let cacheAge = Date.now() - new Date(this.stats.lastSync).getTime();
    return cacheAge < this.config.cacheDuration;
  }

  async saveStatistics() {
    try {
      let statsData = {
        ...this.stats,
        timestamp: new Date().toISOString(),
        cacheSize: this.videoCache.size,
        isInitialized: this.isInitialized
      };

      await fs.writeFile(
        './logs/google-drive-stats.json',
        JSON.stringify(statsData, null, 2)
      );

      // Store in Supabase
      await supabase.from('system_metrics').insert({
        service_name: 'google-drive',
        metrics: statsData,
        timestamp: new Date().toISOString()
      });

      logger.info('📊 Statistics saved');
    } catch (error) {
      logger.error('❌ Failed to save statistics:', error);
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    let k = 1024;
    let sizes = ['Bytes', 'KB', 'MB', 'GB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Public API
  getStats() {
    return {
      ...this.stats,
      cacheSize: this.videoCache.size,
      isInitialized: this.isInitialized
    };
  }

  async forceRefresh() {
    logger.info('🔄 Force refresh requested...');
    await this.discoverVideos(true);
  }

  async getVideoById(videoId) {
    return this.videoCache.get(videoId);
  }

  async getAllVideos() {
    if (this.videoCache.size === 0) {
      await this.discoverVideos();
    }
    return Array.from(this.videoCache.values());
  }
}

// Export for use in other modules
module.exports = GoogleDriveIntegration;

// Run if this file is executed directly
if (require.main === module) {
  let driveIntegration = new GoogleDriveIntegration();

  driveIntegration
    .initialize()
    .then(async() => {
      logger.info('🚀 Google Drive integration ready');

      // Example usage
      let videos = await driveIntegration.selectRandomVideos(3);
      logger.info(`Selected videos: ${videos.map((v) => v.name).join(', ')}`

      // Save statistics
      await driveIntegration.saveStatistics();
    })
    .catch((error) => {
      logger.error('❌ Google Drive integration failed:', error);
      process.exit(1);
    });
}
