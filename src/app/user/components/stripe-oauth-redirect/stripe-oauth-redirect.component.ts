import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StripeService } from './../../../core/services/stripe.service';

@Component({
  selector: 'app-stripe-oauth-redirect',
  templateUrl: './stripe-oauth-redirect.component.html',
  styleUrls: ['./stripe-oauth-redirect.component.scss']
})
export class StripeOauthRedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute,
  	private stripeService: StripeService) { }

  ngOnInit() {

  }
}
	