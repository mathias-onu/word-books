import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { ToastModule } from 'primeng/toast';
import { SupabaseService } from '../../services/supabase.service'

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class OrderComponent {
  readonly fb = inject(FormBuilder)
  readonly messageService = inject(MessageService)
  readonly supabase = inject(SupabaseService)

  orderForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    bookName: ['', Validators.required],
    bookAuthor: ['', Validators.required],
    amount: ['', Validators.required],
    publishingHouse: [''],
    address: ['', Validators.required],
    urgency: ['', Validators.required]
  })
  
  async onSubmit() {
    const insert = await this.supabase.client
      .from('orders')
      .insert({
        created_at: new Date(),
        full_name: this.orderForm.value.fullName,
        phone: Number(this.orderForm.value.phone),
        email: this.orderForm.value.email,
        book_name: this.orderForm.value.bookName,
        book_author: this.orderForm.value.bookAuthor,
        amount: Number(this.orderForm.value.amount),
        publishing_house: this.orderForm.value.publishingHouse,
        address: this.orderForm.value.address,
        urgency: this.orderForm.value.urgency,
      })

    if (insert.error) this.messageService.add({ severity: 'error', summary: 'Error', detail: 'We could not process your order... Please try again' })
    else {  
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order submitted successfully!' })
      this.orderForm.reset()
    }
  }
}
