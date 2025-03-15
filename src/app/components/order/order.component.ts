import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms'
import { SupabaseService } from '../../services/supabase.service'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { ToastModule } from 'primeng/toast'
import { RadioButtonModule } from 'primeng/radiobutton'
import { InputNumberModule } from 'primeng/inputnumber';

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
    ToastModule,
    RadioButtonModule,
    InputNumberModule
  ],
  providers: [MessageService]
})
export class OrderComponent implements OnInit {
  readonly fb = inject(FormBuilder)
  readonly messageService = inject(MessageService)
  readonly supabase = inject(SupabaseService)

  orderForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    delivery: ['easybox', Validators.required],
    homeAddress: [{ value: '', disabled: true }],
    urgency: ['', Validators.required],
    books: this.fb.array(this.createBooks())
  })
  loading: boolean = false

  get books(): FormArray {
    return this.orderForm.get('books') as FormArray
  }

  ngOnInit() {
    this.orderForm.get('delivery')?.valueChanges.subscribe(value => {
      const homeAddressControl = this.orderForm.get('homeAddress')
      if (value === 'home') {
        homeAddressControl?.setValidators([Validators.required])
        homeAddressControl?.enable()
      } else {
        homeAddressControl?.clearValidators()
        homeAddressControl?.reset()
        homeAddressControl?.disable()
      }
      homeAddressControl?.updateValueAndValidity()
    })

    this.orderForm.get('publishingHouse')?.valueChanges.subscribe(value => {
      const otherPublishingHouseControl = this.orderForm.get('otherPublishingHouse')
      if (value === 'other') otherPublishingHouseControl?.enable()
      else {
        otherPublishingHouseControl?.reset()
        otherPublishingHouseControl?.disable()
      }
      otherPublishingHouseControl?.updateValueAndValidity()
    })
  }

  async onSubmit() {
    this.loading = true

    const userDetails = {
      full_name: this.orderForm.value.fullName,
      phone: Number(this.orderForm.value.phone),
      email: this.orderForm.value.email,
      address: this.orderForm.value.delivery === 'home' ? this.orderForm.value.homeAddress : 'easybox',
      urgency: this.orderForm.value.urgency
    }

    const orders = []
    for (const book of this.books.controls) {
      if (book.value.bookName.length > 0) {
        orders.push({
          ...userDetails,
          book_name: book.value.bookName,
          book_author: book.value.bookAuthor,
          amount: Number(book.value.amount),
          publishing_house: book.value.publishingHouse === 'other' ? book.value.otherPublishingHouse : book.value.publishingHouse,
          created_at: new Date()
        })
      }
    }

    const { error } = await this.supabase.client
      .from('orders')
      .insert(orders)

    this.loading = false

    if (error) {
      this.messageService.add({ severity: 'error', life: 7000, summary: 'Eroare', detail: 'Încercați din nou sau contactați-ne la adresa de email din josul paginii...' })
    } else {
      this.messageService.add({ severity: 'success', life: 10000, summary: 'Success', detail: 'Comanda a fost plasată cu succes! Vă vom contacta în cel mai scurt timp posibil pentru confirmare și livrare.' })
      this.orderForm.reset()
    }
  }

  private createBooks(): FormGroup[] {
    return Array(5).fill(null).map((item, i) => this.fb.group({
      bookName: ['', i === 0 ? Validators.required : ''],
      bookAuthor: [''],
      publishingHouse: [''],
      otherPublishingHouse: [{ value: '', disabled: true }],
      amount: [1, i === 0 ? Validators.required : '']
    }))
  }
}
