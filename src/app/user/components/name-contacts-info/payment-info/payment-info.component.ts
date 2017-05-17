import { User } from './../../../../core/models/user';
import { UserService } from './../../../services/user.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {

  @Input() user: User;
  // clientId = 'ca_AFh1FgLLwrY0SPNb39sCEldX472lhvjP';
  clientId = 'ca_A2iFxuO39JaONqxq0Zyp2OH9zTLVHIi3';

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  isAuthUser() {
    return this.userService.isLoggedInUser(this.user);
  }

  connectWithStripe() {
    window.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${this.clientId}&scope=read_write&state=` + localStorage.getItem('accessToken');
  }

  hasConnectedAccount() {
    if (this.userService.authUser['stripe_user_id'] && this.userService.authUser['stripe_user_id'] != "") {
      return true;
    }
    else {
      return false;
    }
  }
}
