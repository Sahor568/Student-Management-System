import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  http = inject(HttpClient);
  totalStudent = signal<any[]>([]);
  totalTeacher = signal<any[]>([]);
  totalClass = signal<any[]>([]);
  totalAttendance = signal<any[]>([]);
  recentlyAddedStudent = signal<any[]>([]);
  recentlyMarkedAttendance = signal<any[]>([]);

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/students').subscribe(d => this.totalStudent.set(d));
    this.http.get<any[]>('http://localhost:3000/teachers').subscribe(d => this.totalTeacher.set(d));
    this.http.get<any[]>('http://localhost:3000/classes').subscribe(d => this.totalClass.set(d));
    this.http.get<any[]>('http://localhost:3000/attendance').subscribe(d => this.totalAttendance.set(d));
    this.http.get<any[]>('http://localhost:3000/students').subscribe(d => this.recentlyAddedStudent.set(d.slice(-3)));
    this.http.get<any[]>('http://localhost:3000/attendance').subscribe(d => this.recentlyMarkedAttendance.set(d.slice(-3)));
  }
}
