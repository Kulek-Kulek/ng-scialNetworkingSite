import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent: string = 'edit your post';
  eneteredTitle: string = 'title';
  post: Post;
  isLoading = false;
  private mode = 'create';
  private postId: string;



  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.postId = paramMap.get('postId');
        this.mode = 'edit';
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            this.post = { id: postData.post._id, title: postData.post.title, content: postData.post.content }
          });
      } else {
        this.postId = null;
        this.mode = 'create';
      }
    })
  }


  onSavePost(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPosts(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    form.resetForm();
  }
}
