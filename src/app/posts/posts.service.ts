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
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts/')
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content
          }
        })
      }))
      .subscribe(transformedData => {
        this.posts = transformedData;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<{ message: string, post: { _id: string, title: string, content: string } }>('http://localhost:3000/api/posts/' + id);
    // return { ...this.posts.find(p => p.id === id) }
  }

  getPostUpdatesListener() {
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, content: string) {
    const post: Post = {
      id: null,
      title,
      content
    }

    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts/', { post })
      .subscribe((resData) => {
        const id = resData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
    this.router.navigate(['/']);
  }


  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id,
      title,
      content
    }

    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(resData => {
        const updatedPosts = [...this.posts];
        const updatingPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[updatingPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(resData => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        console.log(resData);
      });
  }
}
