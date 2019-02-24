import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Post } from '../post';
import { FormBuilder, FormGroup } from '@angular/forms';
import { post } from 'selenium-webdriver/http';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private http: HttpClient
  ) {
    this.titleService.setTitle('Posts');
  }

  ngOnInit() {
    const objs = this.http.get('https://jsonplaceholder.typicode.com/posts')
    objs.subscribe({
      next: (response: any[]) => {
        this.posts = response.slice(0, 5).map((res) => {
          return new Post(res.id, res.title, res.body);
        });

        console.log(this.posts);
      }
    })
    this.form = this.fb.group({
      id: [''],
      title: [''],
      body: ['']
    })
  }

  onSubmit(form: FormGroup) {
    const val = form.value;
    if (val.id) {
      //update
      const objs = this.http.put('https://jsonplaceholder.typicode.com/posts/' + val.id, val)
      objs.subscribe({
        next: (response: any) => {
          console.log(response);
          const post = new Post(
            response.id, response.title, response.body
          )
          const index = this.posts.findIndex((p) => p.id === post.id)
          console.log(index);
          this.posts[index] = post;
        }

      })

    } else {
      //create
      const objs = this.http.post('https://jsonplaceholder.typicode.com/posts', val)
      objs.subscribe({
        next: (response: any) => {
          console.log(response);
          const post = new Post(
            response.id, response.title, response.body
          )
          this.posts = [post, ...this.posts] //new array
          //or this.posts.unshift(post); //use origin array
          this.form.reset(); //set null when submit
        }
      })
    }

  }

  onDelelte(post: Post) {
    const con = confirm('Are you sure?');
    if(con){
      const objs = this.http.delete('https://jsonplaceholder.typicode.com/posts/' + post.id)
      objs.subscribe({
        next: () => {
          // const index = this.posts
          // .findIndex((p) => {
          //   return p.id === post.id
          // });
          // this.posts.splice(index,1);
          this.posts = this.posts
          .filter(p => p.id !== post.id);
        }
      })
    }
  }

  onClick(post: Post) {
    this.form.patchValue({
      id: post.id,
      title: post.title,
      body: post.body
    })
  }
}
