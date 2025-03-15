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
    this.loading = true;

    const publishingHouse = this.orderForm.value.publishingHouse === 'other' 
      ? this.orderForm.value.otherPublishingHouse 
      : this.orderForm.value.publishingHouse;

    // TODO: bug - does not allow insertion of orders which the same email address 
    // actually, it might be the case of just the email (mathias.onu@protozeph.com) - test with multiple email addresses
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
        publishing_house: publishingHouse,
        address: this.orderForm.value.delivery === 'home' ? this.orderForm.value.homeAddress : 'easybox',
        urgency: this.orderForm.value.urgency
      })

    this.loading = false;

    if (insert.error) this.messageService.add({ severity: 'error', life: 7000, summary: 'Eroare', detail: 'Încercați din nou sau contactați-ne la adresa de email din josul paginii...' })
    else {  
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Comanda a fost plasată cu succes!' });
      this.orderForm.reset()
    }
  }

  private createBooks(): FormGroup[] {
    return Array(5).fill(null).map((item, i) => this.fb.group({
      bookName: ['', i === 0 ? Validators.required : ''],
      bookAuthor: [''],
      publishingHouse: [''],
      otherPublishingHouse: [{ value: '', disabled: true }],
      amount: ['', i === 0 ? Validators.required : '']
    }))
  }
}
