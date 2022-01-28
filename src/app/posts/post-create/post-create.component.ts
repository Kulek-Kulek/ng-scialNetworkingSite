import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent: string = 'edit your post';
  eneteredTitle: string = 'title';


  constructor(public postsService: PostsService) { }

  ngOnInit(): void {

  }


  onAddPost(form: NgForm) {
    if (form.invalid) return;
    this.postsService.addPosts(form.value.title, form.value.content);
    form.resetForm();
  }
}
