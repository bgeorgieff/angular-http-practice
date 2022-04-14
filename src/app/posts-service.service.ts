import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from "@angular/common/http";
import { Post } from "./post.model";
import { map, catchError, tap } from "rxjs/operators";
import { Observable, Subject, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PostsServiceService {
  loadedPosts: Post[] = [];
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<Post[]> {
    return this.http
      .get<{ [key: string]: Post }>(
        "https://angular-course-8a2ac-default-rtdb.europe-west1.firebasedatabase.app/posts.json",
        {
          headers: new HttpHeaders({
            "Custom-header": "hello",
          }),
          params: new HttpParams().set("print", "pretty"),
        }
      )
      .pipe(
        map((data) => {
          const postsArray: Post[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              postsArray.push({ ...data[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  postNewPost(title: string, content: string) {
    const postData: Post = { title, content };
    return this.http
      .post<{ name: string }>(
        "https://angular-course-8a2ac-default-rtdb.europe-west1.firebasedatabase.app/posts.json",
        postData,
        { observe: "response" }
      )
      .subscribe((responseData) => {
        console.log(responseData);
        this.loadedPosts.push({
          title: postData.title,
          content: postData.content,
          // id: responseData.name,
        });
      });
  }

  deletePosts() {
    return this.http
      .delete(
        "https://angular-course-8a2ac-default-rtdb.europe-west1.firebasedatabase.app/posts.json",
        { observe: "events", responseType: "json" }
      )
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            console.log(event);
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
