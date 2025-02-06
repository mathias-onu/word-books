import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SupabaseService } from '../../services/supabase.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  readonly supabase = inject(SupabaseService)
  readonly router = inject(Router)
  readonly messageService = inject(MessageService)

  orders!: any[]

  async ngOnInit(): Promise<void> {
    await this.getData()
  }

  async getData() {
    const { data, error } = await this.supabase.client.from('orders').select('*')
    if (error) this.messageService.add({ severity: 'error', summary: 'Could not obtain the orders...', life: 3000 })
    else this.orders = data
  }

  async logout() {
    const { error } = await this.supabase.signOut()
    if (error) throw error
    this.router.navigateByUrl('/login')
  }
}
