import { Injectable } from '@angular/core';
import {
  AuthSession,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js'
import { environment } from '../../environments/environment.development'

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  readonly supabase: SupabaseClient
  readonly _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    return this.supabase.auth.getSession()
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }
}
