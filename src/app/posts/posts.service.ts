import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const querryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts/' + querryParams)
      .pipe(map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            }
          }),
          maxPosts: postData.maxPosts
        }
      }))
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts });
      });
  }

  getPost(id: string) {
    return this.http.get<{ message: string, post: { _id: string, title: string, content: string, imagePath: string } }>('http://localhost:3000/api/posts/' + id);
    // return { ...this.posts.find(p => p.id === id) }
  }

  getPostUpdatesListener() {
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts/', postData)
      .subscribe((resData) => {
        this.router.navigate(['/']);
      });
  }


  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image
      }
    }

    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(resData => {
        this.router.navigate(['/']);
      })
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
