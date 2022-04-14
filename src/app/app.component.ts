import { Component, OnInit } from "@angular/core";
import { Post } from "./post.model";
import { PostsServiceService } from "./posts-service.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isLoading = false;
  error = null;

  constructor(private postService: PostsServiceService) {}

  ngOnInit(): void {
    this.onFetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request

    this.postService.postNewPost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isLoading = true;
    this.postService.getAllPosts().subscribe(
      (posts) => {
        this.isLoading = false;
        this.postService.loadedPosts = this.loadedPosts = posts;
      },
      (error) => {
        this.isLoading = false;
        this.error = error.message;
      }
    );
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(() => {
      this.postService.loadedPosts = this.loadedPosts = [];
    });
  }
}
