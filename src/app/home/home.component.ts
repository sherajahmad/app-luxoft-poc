import { Component, OnInit } from '@angular/core';
import { IEmployee } from '../model/model.employee';
import { PagerService } from '../service/pager.service';
import * as _ from 'underscore';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PagerService]
})
export class HomeComponent implements OnInit {
  baseUrl = 'http://localhost:31583/api/Employee/';
  sort = {
    active: 'createdDate',
    descending: true
  };
  addOrEdit = false;
  pageSize = 1;
  profileForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    fullName: new FormControl('', Validators.required),
    address:  new FormControl('', Validators.required),
    dob:  new FormControl('', Validators.required),
    emailid:  new FormControl('', Validators.required)
  });
  employee: IEmployee;
  emplist: IEmployee[];
   // pager object
   pager: any = {};
    // paged items
    pagedItems: any[];
  constructor( private pagerService: PagerService, private httpClient: HttpClient) { }

  ngOnInit() {
      this.setPage(1);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }

   this.getData(page, null);


}
editEmp(employee: IEmployee) {
  this.profileForm.setValue({
    id: employee.id,
    name: employee.name,
    fullName: employee.fullName,
    address:  employee.address,
    dob:  employee.dob,
    emailid:  employee.emailid,
  });
  this.addOrEdit = true;
}
delateEmp(id: number) {
 this.httpClient.post(this.baseUrl + 'EmpDelete', {id: id}).subscribe((res: any) => {
  let sortCol = (this.sort.descending ?  this.sort.active + '_desc' : this.sort.active);
  this.getData(1, sortCol);
      });
}
cancelSave() {
  this.profileForm.setValue({
    id: '',
    name: '',
    fullName: '',
    address:  '',
    dob:  '',
    emailid:  '',
  });
  this.addOrEdit = false;
}
onSubmit() {
  this.httpClient.post(this.baseUrl + 'AddEmployee' , this.profileForm.value ).subscribe((res: any) => {
 console.log(res);

 if (this.profileForm.value.id === '') {
  this.getData(1, null);
 }

 this.profileForm.setValue({
  id: '',
  name: '',
  fullName: '',
  address:  '',
  dob:  '',
  emailid:  '',
});

   });

}
sortByEvent (column: string) {

    if (this.sort.active === column) {
      this.sort.descending = !this.sort.descending;
   } else {
    this.sort.active = column;
    this.sort.descending = false;
   }

 let sortCol = (this.sort.descending ?  column + '_desc' : column);
  this.getData(1, sortCol );

}
getData(page, sortCol ) {
 let getdataUrl = this.baseUrl + 'GetData?' + 'page=' + page ;
  if (sortCol) {
    getdataUrl += '&&sortCol=' + sortCol;
  }
  this.httpClient.get(getdataUrl).subscribe((res: any) => {
    this.pager = this.pagerService.getPager(res.RecordCount, page, this.pageSize);
  this.pagedItems = res.Employees;
   });
}

getIcon (column: string) {


  // call api here ;
    if (this.sort.active === column) {
      return this.sort.descending
        ? 'glyphicon-chevron-up'
        : 'glyphicon-chevron-down';
      }

    return 'glyphicon-star';
  }
}
