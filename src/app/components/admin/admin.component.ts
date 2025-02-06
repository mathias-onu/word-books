import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  readonly supabase = inject(SupabaseService)
  readonly router = inject(Router)

  orders!: any[]

  // async logout() {
  //   const signOut = await this.supabase.signOut()
  //   this.router.navigateByUrl('/login')
  // }
}
