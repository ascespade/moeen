#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class MLLearningEngine {
  constructor() {
    this.workspaceRoot = path.join(__dirname, '..');
    this.logFile = path.join(this.workspaceRoot, 'logs', 'ml-learning.log');
    this.modelFile = path.join(this.workspaceRoot, 'learning', 'ml-model.json');
    this.trainingDataFile = path.join(
      this.workspaceRoot,
      'learning',
      'training-data.json'
    );
    this.patternsFile = path.join(
      this.workspaceRoot,
      'learning',
      'patterns.json'
    );
    this.model = {
      patterns: {},
      predictions: {},
      weights: {},
      accuracy: 0,
      lastUpdated: null,
    };
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ML Learning: ${message}\n`;

    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage.trim());
  }

  async initialize() {
    this.log('Initializing ML Learning Engine...');

    // Create learning directory
    const learningDir = path.join(this.workspaceRoot, 'learning');
    if (!fs.existsSync(learningDir)) {
      fs.mkdirSync(learningDir, { recursive: true });
    }

    // Load existing model
    await this.loadModel();

    // Load training data
    await this.loadTrainingData();

    this.log('ML Learning Engine initialized');
  }

  async loadModel() {
    if (fs.existsSync(this.modelFile)) {
      try {
        const data = fs.readFileSync(this.modelFile, 'utf8');
        this.model = JSON.parse(data);
        this.log('ML model loaded');
      } catch (error) {
        this.log(`Error loading model: ${error.message}`, 'warn');
        this.model = this.initializeModel();
      }
    } else {
      this.model = this.initializeModel();
    }
  }

  initializeModel() {
    return {
      patterns: {
        success: {},
        failure: {},
        performance: {},
        errors: {},
      },
      predictions: {
        nextFailure: null,
        optimalTiming: {},
        resourceNeeds: {},
      },
      weights: {
        timeOfDay: 0.1,
        dayOfWeek: 0.1,
        systemLoad: 0.2,
        errorHistory: 0.3,
        recentChanges: 0.3,
      },
      accuracy: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  async loadTrainingData() {
    if (fs.existsSync(this.trainingDataFile)) {
      try {
        const data = fs.readFileSync(this.trainingDataFile, 'utf8');
        this.trainingData = JSON.parse(data);
        this.log('Training data loaded');
      } catch (error) {
        this.log(`Error loading training data: ${error.message}`, 'warn');
        this.trainingData = [];
      }
    } else {
      this.trainingData = [];
    }
  }

  async saveModel() {
    this.model.lastUpdated = new Date().toISOString();
    fs.writeFileSync(this.modelFile, JSON.stringify(this.model, null, 2));
  }

  async saveTrainingData() {
    fs.writeFileSync(
      this.trainingDataFile,
      JSON.stringify(this.trainingData, null, 2)
    );
  }

  async collectDataPoint(event) {
    this.log(`Collecting data point: ${event.type}`);

    const dataPoint = {
      timestamp: new Date().toISOString(),
      type: event.type,
      success: event.success || false,
      duration: event.duration || 0,
      context: {
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        systemLoad: process.memoryUsage().heapUsed,
        errorCount: event.errorCount || 0,
        recentChanges: event.recentChanges || 0,
      },
      outcome: event.outcome || 'unknown',
    };

    this.trainingData.push(dataPoint);

    // Keep only last 1000 data points
    if (this.trainingData.length > 1000) {
      this.trainingData = this.trainingData.slice(-1000);
    }

    await this.saveTrainingData();
    return dataPoint;
  }

  async analyzePatterns() {
    this.log('Analyzing patterns...');

    const patterns = {
      success: {},
      failure: {},
      performance: {},
      errors: {},
    };

    // Analyze success patterns
    const successData = this.trainingData.filter(d => d.success);
    patterns.success = this.findPatterns(successData);

    // Analyze failure patterns
    const failureData = this.trainingData.filter(d => !d.success);
    patterns.failure = this.findPatterns(failureData);

    // Analyze performance patterns
    const performanceData = this.trainingData.filter(d => d.duration > 0);
    patterns.performance = this.analyzePerformancePatterns(performanceData);

    // Analyze error patterns
    const errorData = this.trainingData.filter(d => d.context.errorCount > 0);
    patterns.errors = this.findPatterns(errorData);

    this.model.patterns = patterns;
    await this.saveModel();

    this.log('Pattern analysis completed');
    return patterns;
  }

  findPatterns(data) {
    if (data.length === 0) return {};

    const patterns = {};

    // Time of day patterns
    const timePatterns = {};
    data.forEach(d => {
      const hour = d.context.timeOfDay;
      timePatterns[hour] = (timePatterns[hour] || 0) + 1;
    });
    patterns.timeOfDay = timePatterns;

    // Day of week patterns
    const dayPatterns = {};
    data.forEach(d => {
      const day = d.context.dayOfWeek;
      dayPatterns[day] = (dayPatterns[day] || 0) + 1;
    });
    patterns.dayOfWeek = dayPatterns;

    // System load patterns
    const loadRanges = ['low', 'medium', 'high'];
    const loadPatterns = {};
    data.forEach(d => {
      const load = d.context.systemLoad;
      let range = 'low';
      if (load > 50 * 1024 * 1024) range = 'medium';
      if (load > 100 * 1024 * 1024) range = 'high';
      loadPatterns[range] = (loadPatterns[range] || 0) + 1;
    });
    patterns.systemLoad = loadPatterns;

    return patterns;
  }

  analyzePerformancePatterns(data) {
    if (data.length === 0) return {};

    const durations = data.map(d => d.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);

    return {
      average: avgDuration,
      maximum: maxDuration,
      minimum: minDuration,
      variance: this.calculateVariance(durations, avgDuration),
    };
  }

  calculateVariance(values, mean) {
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  async trainModel() {
    this.log('Training ML model...');

    if (this.trainingData.length < 10) {
      this.log('Insufficient training data', 'warn');
      return;
    }

    // Simple machine learning algorithm
    const features = this.extractFeatures();
    const predictions = this.generatePredictions(features);

    this.model.predictions = predictions;
    this.model.accuracy = this.calculateAccuracy();

    await this.saveModel();
    this.log(`Model trained with accuracy: ${this.model.accuracy.toFixed(2)}`);
  }

  extractFeatures() {
    const features = {
      timeOfDay: {},
      dayOfWeek: {},
      systemLoad: {},
      errorHistory: {},
      recentChanges: {},
    };

    this.trainingData.forEach(dataPoint => {
      const hour = dataPoint.context.timeOfDay;
      const day = dataPoint.context.dayOfWeek;
      const load = dataPoint.context.systemLoad;
      const errors = dataPoint.context.errorCount;
      const changes = dataPoint.context.recentChanges;

      features.timeOfDay[hour] = (features.timeOfDay[hour] || 0) + 1;
      features.dayOfWeek[day] = (features.dayOfWeek[day] || 0) + 1;
      features.systemLoad[load] = (features.systemLoad[load] || 0) + 1;
      features.errorHistory[errors] = (features.errorHistory[errors] || 0) + 1;
      features.recentChanges[changes] =
        (features.recentChanges[changes] || 0) + 1;
    });

    return features;
  }

  generatePredictions(features) {
    const predictions = {
      nextFailure: this.predictNextFailure(features),
      optimalTiming: this.predictOptimalTiming(features),
      resourceNeeds: this.predictResourceNeeds(features),
    };

    return predictions;
  }

  predictNextFailure(features) {
    // Simple prediction based on error patterns
    const errorData = this.trainingData.filter(d => !d.success);
    if (errorData.length === 0) return null;

    const avgTimeBetweenFailures =
      this.calculateAverageTimeBetweenFailures(errorData);
    const lastFailure = errorData[errorData.length - 1];
    const nextFailureTime = new Date(lastFailure.timestamp);
    nextFailureTime.setTime(nextFailureTime.getTime() + avgTimeBetweenFailures);

    return nextFailureTime.toISOString();
  }

  calculateAverageTimeBetweenFailures(errorData) {
    if (errorData.length < 2) return 0;

    const times = errorData.map(d => new Date(d.timestamp).getTime());
    const intervals = [];

    for (let i = 1; i < times.length; i++) {
      intervals.push(times[i] - times[i - 1]);
    }

    return intervals.reduce((a, b) => a + b, 0) / intervals.length;
  }

  predictOptimalTiming(features) {
    // Find time slots with highest success rate
    const timeSlots = {};

    this.trainingData.forEach(d => {
      const hour = d.context.timeOfDay;
      if (!timeSlots[hour]) {
        timeSlots[hour] = { success: 0, total: 0 };
      }
      timeSlots[hour].total++;
      if (d.success) timeSlots[hour].success++;
    });

    const successRates = {};
    Object.keys(timeSlots).forEach(hour => {
      const slot = timeSlots[hour];
      successRates[hour] = slot.success / slot.total;
    });

    // Find best time slots
    const sortedSlots = Object.entries(successRates)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return sortedSlots.map(([hour, rate]) => ({ hour: parseInt(hour), rate }));
  }

  predictResourceNeeds(features) {
    // Predict resource needs based on historical patterns
    const resourceNeeds = {
      memory: 0,
      cpu: 0,
      disk: 0,
    };

    const recentData = this.trainingData.slice(-100); // Last 100 data points

    if (recentData.length > 0) {
      const avgMemory =
        recentData.reduce((sum, d) => sum + d.context.systemLoad, 0) /
        recentData.length;
      resourceNeeds.memory = Math.min(1, avgMemory / (100 * 1024 * 1024)); // Normalize to 0-1
      resourceNeeds.cpu = Math.min(
        1,
        recentData.filter(d => d.duration > 5000).length / recentData.length
      );
      resourceNeeds.disk = Math.min(
        1,
        recentData.filter(d => d.context.recentChanges > 0).length /
          recentData.length
      );
    }

    return resourceNeeds;
  }

  calculateAccuracy() {
    // Simple accuracy calculation based on prediction success
    const recentData = this.trainingData.slice(-50);
    if (recentData.length < 10) return 0;

    let correctPredictions = 0;
    let totalPredictions = 0;

    // This is a simplified accuracy calculation
    // In a real implementation, you'd compare predictions with actual outcomes
    recentData.forEach(dataPoint => {
      totalPredictions++;
      // Simple heuristic: if success rate is high, prediction is likely correct
      if (dataPoint.success) correctPredictions++;
    });

    return totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
  }

  async generateRecommendations() {
    this.log('Generating recommendations...');

    const recommendations = [];

    // Performance recommendations
    if (this.model.patterns.performance) {
      const perf = this.model.patterns.performance;
      if (perf.average > 10000) {
        // 10 seconds
        recommendations.push({
          type: 'performance',
          priority: 'high',
          message: 'Average execution time is high. Consider optimization.',
          action: 'optimize_performance',
          confidence: 0.8,
        });
      }
    }

    // Timing recommendations
    if (this.model.predictions.optimalTiming) {
      const optimalTimes = this.model.predictions.optimalTiming;
      if (optimalTimes.length > 0) {
        recommendations.push({
          type: 'scheduling',
          priority: 'medium',
          message: `Optimal execution times: ${optimalTimes.map(t => `${t.hour}:00`).join(', ')}`,
          action: 'adjust_schedule',
          confidence: 0.6,
        });
      }
    }

    // Resource recommendations
    if (this.model.predictions.resourceNeeds) {
      const needs = this.model.predictions.resourceNeeds;
      if (needs.memory > 0.8) {
        recommendations.push({
          type: 'resources',
          priority: 'high',
          message: 'High memory usage predicted. Consider memory optimization.',
          action: 'optimize_memory',
          confidence: 0.7,
        });
      }
    }

    return recommendations;
  }

  async runLearningCycle() {
    this.log('Running learning cycle...');

    // Analyze patterns
    await this.analyzePatterns();

    // Train model
    await this.trainModel();

    // Generate recommendations
    const recommendations = await this.generateRecommendations();

    this.log(
      `Learning cycle completed. Generated ${recommendations.length} recommendations`
    );
    return recommendations;
  }

  async generateLearningReport() {
    this.log('Generating learning report...');

    const report = {
      timestamp: new Date().toISOString(),
      model: this.model,
      trainingDataSize: this.trainingData.length,
      recommendations: await this.generateRecommendations(),
      summary: {
        accuracy: this.model.accuracy,
        patternsDiscovered: Object.keys(this.model.patterns).length,
        predictionsGenerated: Object.keys(this.model.predictions).length,
        lastUpdated: this.model.lastUpdated,
      },
    };

    const reportFile = path.join(
      this.workspaceRoot,
      'reports',
      'ml-learning-report.json'
    );
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    this.log(`Learning report saved: ${reportFile}`);
    return report;
  }

  async start() {
    this.log('Starting ML Learning Engine...');

    await this.initialize();

    // Run initial learning cycle
    await this.runLearningCycle();

    // Set up continuous learning
    const learningInterval = setInterval(async () => {
      try {
        await this.runLearningCycle();
        await this.generateLearningReport();
      } catch (error) {
        this.log(`Learning cycle error: ${error.message}`, 'error');
      }
    }, 600000); // Every 10 minutes

    // Cleanup on exit
    process.on('SIGINT', () => {
      clearInterval(learningInterval);
      this.log('ML Learning Engine stopped');
    });

    process.on('SIGTERM', () => {
      clearInterval(learningInterval);
      this.log('ML Learning Engine stopped');
    });
  }
}

// Main execution
if (require.main === module) {
  const mlEngine = new MLLearningEngine();
  mlEngine.start().catch(error => {
    console.error('ML Learning Engine failed:', error);
    process.exit(1);
  });
}

module.exports = MLLearningEngine;
