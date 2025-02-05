import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { ToastModule } from 'primeng/toast';

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

  onSubmit() {
    if (this.orderForm.valid) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order submitted successfully!' })
      this.orderForm.reset()
    }
  }
}
