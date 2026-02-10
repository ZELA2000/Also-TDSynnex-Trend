import bcrypt from 'bcryptjs';
import { User } from '../types';
import config from '../config';

/**
 * In-memory user storage (replace with database in production)
 */
class UserService {
  private users: Map<string, User> = new Map();

  constructor() {
    this.initializeAdminUser();
  }

  /**
   * Initialize default admin user
   */
  private async initializeAdminUser() {
    const hashedPassword = await bcrypt.hash(config.admin.password, 10);
    
    const adminUser: User = {
      id: '1',
      username: config.admin.username,
      email: config.admin.email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    };

    this.users.set(adminUser.id, adminUser);
    console.log(`✅ Admin user initialized: ${config.admin.username}`);
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  /**
   * Validate user credentials
   */
  async validateCredentials(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  /**
   * Update last login time
   */
  async updateLastLogin(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastLogin = new Date();
      this.users.set(userId, user);
    }
  }

  /**
   * Create new user
   */
  async createUser(username: string, email: string, password: string, role: 'admin' | 'user' | 'viewer' = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser: User = {
      id: (this.users.size + 1).toString(),
      username,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    };

    this.users.set(newUser.id, newUser);
    return newUser;
  }

  /**
   * Get user without password
   */
  sanitizeUser(user: User) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}

export const userService = new UserService();
