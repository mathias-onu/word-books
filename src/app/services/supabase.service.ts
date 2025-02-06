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
  readonly client: SupabaseClient
  readonly _session: AuthSession | null = null

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    return this.client.auth.getSession()
  }

  signIn(email: string, password: string) {
    return this.client.auth.signInWithPassword({
      email: email,
      password: password
    })
  }

  signOut() {
    return this.client.auth.signOut()
  }
}
