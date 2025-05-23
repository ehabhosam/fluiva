import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/constants';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  /**
   * Verifies a JWT token from Supabase
   * @param token The JWT token to verify
   * @returns Promise resolving to the user data if token is valid, null otherwise
   */
  async verifyToken(token: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.auth.getUser(token);

      if (error) {
        console.error('Error verifying token:', error.message);
        return null;
      }

      return data?.user || null;
    } catch (error) {
      console.error('Exception verifying token:', error);
      return null;
    }
  }

  /**
   * Gets a user by ID from Supabase
   * @param userId The user ID to look up
   * @returns Promise resolving to the user data if found, null otherwise
   */
  async getUserById(userId: string): Promise<any> {
    try {
      // This assumes you have a 'users' table in your Supabase database
      // Adjust the query according to your actual database structure
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching user:', error);
      return null;
    }
  }
}
