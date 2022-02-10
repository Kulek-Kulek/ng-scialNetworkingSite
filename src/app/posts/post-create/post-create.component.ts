// NGModule approach

// import { Component, OnInit } from '@angular/core';
// import { NgForm, ReactiveFormsModule } from '@angular/forms';
// import { ActivatedRoute, ParamMap } from '@angular/router';
// import { Post } from '../post.model';

// import { PostsService } from '../posts.service';

// @Component({
//   selector: 'app-post-create',
//   templateUrl: './post-create.component.html',
//   styleUrls: ['./post-create.component.css']
// })
// export class PostCreateComponent implements OnInit {
//   enteredContent: string = 'edit your post';
//   eneteredTitle: string = 'title';
//   post: Post;
//   isLoading = false;
//   private mode = 'create';
//   private postId: string;



//   constructor(public postsService: PostsService, public route: ActivatedRoute) { }

//   ngOnInit(): void {
//     this.route.paramMap.subscribe((paramMap: ParamMap) => {
//       if (paramMap.has('postId')) {
//         this.postId = paramMap.get('postId');
//         this.mode = 'edit';
//         this.isLoading = true;
//         this.postsService.getPost(this.postId)
//           .subscribe(postData => {
//             this.isLoading = false;
//             this.post = { id: postData.post._id, title: postData.post.title, content: postData.post.content }
//           });
//       } else {
//         this.postId = null;
//         this.mode = 'create';
//       }
//     })
//   }


//   onSavePost(form: NgForm) {
//     if (form.invalid) return;

//     this.isLoading = true;
//     if (this.mode === 'create') {
//       this.postsService.addPosts(form.value.title, form.value.content);
//     } else {
//       this.postsService.updatePost(this.postId, form.value.title, form.value.content);
//     }

//     form.resetForm();
//   }
// }




// ReactiveFormsModule approach

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

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
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;



  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.postId = paramMap.get('postId');
        this.mode = 'edit';
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            this.post = { id: postData.post._id, title: postData.post.title, content: postData.post.content, imagePath: postData.post.imagePath }
            this.form.setValue(
              {
                title: this.post.title,
                content: this.post.content,
                image: this.post.imagePath
              }
            )
          });
      } else {
        this.postId = null;
        this.mode = 'create';
      }
    })
  }


  onSavePost() {
    if (this.form.invalid) return;

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPosts(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }

    this.form.reset();
  }


  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }
}
