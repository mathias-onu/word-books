import { Injectable, inject } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { SupabaseService } from '../services/supabase.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  readonly supabase = inject(SupabaseService)
  readonly router = inject(Router)

  async canActivate(): Promise<boolean> {
    const { data } = await this.supabase.session

    if (data.session) return true
    else {
      this.router.navigate(['/login'])
      return false
    }
  }
} 