import { getDraftProject } from './../../../reducers/project.selector';
import { ToastyService } from 'ng2-toasty';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from './../../../../app.state';
import { Store } from '@ngrx/store';
import { ProjectService } from './../../../services/project.service';
import { Project } from './../../../../core/models/project';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-review',
  templateUrl: './project-review.component.html',
  styleUrls: ['./project-review.component.scss']
})
export class ProjectReviewComponent implements OnInit {

  @Output() backToEditor: EventEmitter<number> = new EventEmitter<number>();
  private projectSub: Subscription = new Subscription();

  errors: Array<string> = [];
  project: any;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private store: Store<AppState>,
    private toastyService: ToastyService
  ) {
    this.projectSub = this.store.select(getDraftProject).subscribe((project) => {
      this.project = project;
    });
  }

  ngOnInit() {
  }

  private fetchProject() {
  }

  onBackToEditor() {
    this.backToEditor.emit(1);
  }

  isStoryPresent() {
    let status = false;
    this.project.story.sections.forEach(section => {
      if (section.heading || section.description || section.image_url) {
        status = true;
      }
    });
    return status;
  }

  isRewardsPresent() {
    let status = false;
    this.project.rewards.forEach(reward => {
      if (reward.title || reward.description || reward.image_url || reward.amount) {
        status =  true;
      }
    });
    return status;
  }

  isFaqsPresent() {
    let status = false;
    this.project.faqs.forEach(faq => {
      if (faq.question || faq.answer) {
        status = true;
      }
    });
    return status;
  }

  isLinksPresent() {
    let status = false;
    this.project.links.forEach(link => {
      if (link.url) {
        status = true;
      }
    });
    return status;
  }

  onLaunch() {
    const isValid = this.checkIfProjectIsValid();
    if (isValid) {
      this.projectService.launchProject(this.project.id).subscribe((status) => {
        console.log('status');
        if (status) {
          this.router.navigate(['/']);
          this.toastyService.success('Your Project is Pending for Approval, We Will notify you once your project is approved');
        } else {
          this.toastyService.error('Something went wrong!');
        }
      });
      localStorage.setItem('current_project_id', null);
    }
  }

  private checkIfProjectIsValid() {
    let status = true;
    this.errors = [];
    if (!this.project.title) {
      this.errors.push('Campaign Title is missing');
      status = false;
   }
    if (!this.project.pledged_amount) {
      this.errors.push('Campaign Goal Amount is Mising');
      status = false;
   }
    if (!this.project.duration) {
      this.errors.push('Campaign Duration is missig');
      status = false;
   }
    if (!this.project.image_url) {
      this.errors.push('Campaign Image is missing');
      status = false;
   }
    if (!this.isStoryPresent()) {
      this.errors.push('Campaign Story is missing');
      status = false;
    }
    return status;
  }

}
