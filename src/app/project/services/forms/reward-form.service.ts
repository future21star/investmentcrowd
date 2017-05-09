import { Project } from './../../../core/models/project';
import { DateService } from './../../../core/services/date.service';
import { Reward } from './../../../core/models/reward';
import { FormBuilder, Validators, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class RewardFormService {

  project: Project;

  constructor(
    private fb: FormBuilder,
    private dateService: DateService
  ) { }

  initRewardForm(project) {
    let rewards = project.rewards;
    this.project = project;
    if (rewards.length === 0) {
      rewards = [new Reward];
    }

    const reward_attributes_array = [];
    rewards.forEach((reward: any) => {
      const fg = this.initFormGroup(reward);
      reward_attributes_array.push(fg);
    });

    return this.fb.group({
      'id': [project.id, Validators.required],
      'type': ['reward', Validators.required],
      'rewards_attributes': this.fb.array(reward_attributes_array)
    });
  }

  initFormGroup(reward) {
    let date: Date = reward.delivery_date || new Date();
    date = new Date(date);

    return this.fb.group({
      'id': [reward.id],
      'title': [reward.title, Validators.required],
      'description': [reward.description, [Validators.required, this.descriptionValidator]],
      'delivery_date': [date],
      'day': [date.getDate()],
      'month': [this.dateService.months[date.getMonth()]],
      'year': [date.getFullYear()],
      'quantity': [reward.quantity, [Validators.required, this.validateRewardQuantity.bind(this)]],
      'amount': [reward.amount, [Validators.required, this.validateRewardAmount.bind(this)]],
      'currency': [reward.currency || 'USD'],
      '_destroy': [false]
    });
  }

  descriptionValidator(control: FormControl) {
    if (control.value.length > 350 || control.value.split(' ').length > 50) {
      return { invalid: true };
    }
    return null;
  }

  validateRewardAmount(c: FormControl) {
    if (!c.parent || !this.project.pledged_amount) {
      return null;
    }
    const goal_amount = +this.project.pledged_amount;
    const pouch_amount = c.value;
    const pouch_quantity = +(<FormArray>c.parent).get('quantity').value;
    const totalRewardAmount = pouch_amount * pouch_quantity;
    return totalRewardAmount < goal_amount ? null : { invalid: true };
  }

  validateRewardQuantity(c: FormControl) {
    if (!c.parent || !this.project.pledged_amount) {
      return null;
    }
    const goal_amount = +this.project.pledged_amount;
    const pouch_quantity = c.value;
    const pouch_amount = +(<FormArray>c.parent).get('amount').value;
    const totalRewardAmount = pouch_amount * pouch_quantity;
    return totalRewardAmount < goal_amount ? null : { invalid: true };
  }

}
