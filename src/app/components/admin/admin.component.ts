import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SupabaseService } from '../../services/supabase.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToastModule,
    SkeletonModule,
    Dialog,
    InputTextModule
  ],
  providers: [MessageService],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  readonly supabase = inject(SupabaseService)
  readonly router = inject(Router)
  readonly messageService = inject(MessageService)
  readonly fb = inject(FormBuilder)

  isLoading: boolean = true
  orders!: any[]
  displayEditDialog: boolean = false
  selectedOrder!: any
  editOrderForm: FormGroup = this.fb.group({
    id: [''],
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    bookName: ['', Validators.required],
    bookAuthor: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1)]],
    publishingHouse: [''],
    address: ['', Validators.required],
    urgency: [''],
    price: [0],
    status: [''],
  })

  async ngOnInit(): Promise<void> {
    await this.getData()
  }

  async getData() {
    this.isLoading = true

    try {
      const { data, error } = await this.supabase.client.from('orders').select('*').order('created_at', { ascending: false })

      if (error) throw error
      else {
        this.orders = data
        this.isLoading = false
      }
    }
    catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Could not obtain the orders...', life: 3000 })
    }
    finally {
      this.isLoading = false
    }
  }

  async logout() {
    const { error } = await this.supabase.signOut()
    if (error) throw error
    this.router.navigateByUrl('/login')
  }

  async updateOrder(orderId: string, updatedData: any) {
    this.isLoading = true;

    const { data, error } = await this.supabase.client
      .from('orders')
      .update({
        full_name: updatedData.fullName,
        phone: updatedData.phone,
        email: updatedData.email,
        book_name: updatedData.bookName,
        book_author: updatedData.bookAuthor,
        amount: updatedData.amount,
        publishing_house: updatedData.publishingHouse,
        address: updatedData.address,
        urgency: updatedData.urgency,
        price: updatedData.price,
        status: updatedData.status
      })
      .eq('id', orderId);

    this.isLoading = false;

    if (error) {
      throw error; // Let the calling function handle the error
    }

    return data;
  }

  openEditDialog(order: any) {
    this.selectedOrder = order
    this.editOrderForm.patchValue({
      id: order.id,
      fullName: order.full_name,
      phone: order.phone,
      email: order.email,
      bookName: order.book_name,
      bookAuthor: order.book_author,
      amount: order.amount,
      publishingHouse: order.publishing_house,
      address: order.address,
      urgency: order.urgency,
      price: order.price,
      status: order.status
    })
    this.displayEditDialog = true
  }

  async onDialogEdit() {
    const orderId = this.editOrderForm.value.id

    if (this.editOrderForm.valid) {
      const updatedData = this.editOrderForm.value;

      try {
        await this.updateOrder(orderId, updatedData);

        // Update the local orders array
        const index = this.orders.findIndex(order => order.id === orderId);
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...updatedData };
        }

        // Close the dialog
        this.displayEditDialog = false;

        this.messageService.add({ severity: 'success', summary: 'Order updated successfully', life: 3000 });
        await this.getData()
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Could not update the order.', life: 3000 });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Please fill in all required fields.', life: 3000 });
    }
  }
}
