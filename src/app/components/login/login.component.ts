import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  readonly fb = inject(FormBuilder)
  readonly router = inject(Router)
  readonly messageService = inject(MessageService)
  readonly supabase = inject(SupabaseService)

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })
  loading: boolean = false

  async onSubmit() {
    const { email, password } = this.loginForm.value

    // Login to Supabase
    try {
      this.loading = true
      const { error } = await this.supabase.signIn(email, password)

      if (error) throw error
      else {
        this.loginForm.reset()
        this.router.navigateByUrl('/admin')
        this.messageService.add({ severity: 'success', summary: 'Logged in', life: 3000 })
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Please check your email or password', life: 3000 })
    } finally {
      this.loading = false
    }
  }
}
