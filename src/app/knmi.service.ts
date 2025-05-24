import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelloWorldService {
  private apiUrl = 'http://localhost:7148/api/helloworld';

  constructor(private http: HttpClient) {}

  getHelloWorldMessage(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}