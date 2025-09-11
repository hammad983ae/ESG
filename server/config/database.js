/**
 * Delorenzo Property Group - MongoDB Database Configuration
 * 
 * Copyright (c) 2025 Delorenzo Property Group Pty Ltd
 * Licensed under MIT License - see LICENSE file for details
 * 
 * MongoDB connection and configuration management
 * 
 * @author Delorenzo Property Group Pty Ltd
 * @version 1.0.0
 */

const mongoose = require('mongoose');

class DatabaseConfig {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  /**
   * Connect to MongoDB database
   * @param {string} mongoUri - MongoDB connection string
   * @param {object} options - Connection options
   */
  async connect(mongoUri, options = {}) {
    try {
      const defaultOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0,
        ...options
      };

      this.connection = await mongoose.connect(mongoUri, defaultOptions);
      this.isConnected = true;
      
      console.log('✅ MongoDB connected successfully');
      
      // Set up connection event listeners
      this.setupEventListeners();
      
      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Set up MongoDB connection event listeners
   */
  setupEventListeners() {
    const db = mongoose.connection;

    db.on('connected', () => {
      console.log('📊 MongoDB connected to:', db.host, ':', db.port, '/', db.name);
    });

    db.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      this.isConnected = false;
    });

    db.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      this.isConnected = false;
    });

    db.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      this.isConnected = true;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        this.isConnected = false;
        console.log('🔌 MongoDB disconnected gracefully');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Get connection status
   * @returns {boolean} Connection status
   */
  getConnectionStatus() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Get database instance
   * @returns {object} MongoDB database instance
   */
  getDatabase() {
    return mongoose.connection.db;
  }

  /**
   * Get connection instance
   * @returns {object} Mongoose connection instance
   */
  getConnection() {
    return mongoose.connection;
  }

  /**
   * Create indexes for better performance
   */
  async createIndexes() {
    try {
      const db = this.getDatabase();
      
      // Create indexes for valuations collection
      await db.collection('valuations').createIndexes([
        { key: { userId: 1, createdAt: -1 } },
        { key: { valuationType: 1, status: 1 } },
        { key: { propertyType: 1, createdAt: -1 } },
        { key: { 'results.marketValue': 1 } },
        { key: { esgIncluded: 1, esgFactor: 1 } },
        { key: { tags: 1 } },
        { key: { createdAt: -1 } },
        { key: { propertyName: 'text', propertyLocation: 'text' } }
      ]);

      console.log('📈 Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating database indexes:', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   * @returns {object} Database statistics
   */
  async getStats() {
    try {
      const db = this.getDatabase();
      const stats = await db.stats();
      
      return {
        database: db.databaseName,
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
        objects: stats.objects,
        avgObjSize: stats.avgObjSize
      };
    } catch (error) {
      console.error('❌ Error getting database stats:', error);
      throw error;
    }
  }

  /**
   * Health check for database connection
   * @returns {object} Health check result
   */
  async healthCheck() {
    try {
      const isConnected = this.getConnectionStatus();
      const ping = await mongoose.connection.db.admin().ping();
      
      return {
        status: isConnected ? 'healthy' : 'unhealthy',
        connected: isConnected,
        ping: ping.ok === 1 ? 'success' : 'failed',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        connected: false,
        ping: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create singleton instance
const databaseConfig = new DatabaseConfig();

module.exports = databaseConfig;
