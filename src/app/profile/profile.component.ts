import { Component, OnInit , EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { variable } from '@angular/compiler/src/output/output_ast';
import { Account } from '../account';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;
  @Output() change = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Profile');
   }

  ngOnInit() {
    const {firstName,lastName} = this.accountService.account;
    const v = [Validators.required,Validators.minLength(2)]
    this.form = this.fb.group({
      firstName: [this.accountService.account.firstName,v],
      lastName: [this.accountService.account.lastName,[...v,Validators.minLength(3)]]
    });
  }

  onSubmit(form: FormGroup){
    if(form.valid){
    const {firstName,lastName} = form.value;
    const user = new Account(firstName,lastName);
    this.accountService.account = user;
    this.change.emit(user);
    } else {
      alert('Firtsname must be at least 2 characters and lastsname must be at least 3 characters');
      ['firstName',
        'lastName'].forEach((key: string)=>{
          form.get(key).markAsTouched();
        })
        
    }
  }
}
