import { Component, OnInit, ViewChild } from '@angular/core';
import { proddetails } from './int';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isFetching:boolean=false;
  allProducts:proddetails[]=[];
  title = 'Httprequest';
  @ViewChild('productsForm') form:NgForm;
  editMode:boolean=false;
  currentProductId:string;
  constructor(public http:HttpClient)
  {

  }
  ngOnInit(): void {
    this.fetchproducts();
  }
  onProductsFetch()
  {
    this.fetchproducts();

  }

  products:proddetails=
  {
    pName: '',
    desc:'',
    price:0
  }
onProductCreate()
{
  if(!this.editMode)
  {
  console.log(this.products);
  const header=new HttpHeaders({'key':'value'})
  this.http.post('https://apiintegration-52bc7-default-rtdb.firebaseio.com/products.json',this.products,{headers:header}).subscribe((res)=>
  {
    console.log(res);
  });
}
else
{
 this.updateProduct(this.currentProductId,this.products
  );
}
}

fetchproducts()
{
  this.isFetching=true;
  this.http.get<{[key:string]:proddetails}>('https://apiintegration-52bc7-default-rtdb.firebaseio.com/products.json')
  .pipe(map((res)=>
  {
   const products=[];
   for(const key in res)
   {
    if(res.hasOwnProperty(key))
    {
      products.push({...res[key],id:key})
    }
   }
   return products;

  }))
  .subscribe((products)=>
  {
    console.log(products); 
    this.allProducts=products;
  })
  this.isFetching=false;
  
}
onDeleteProduct(id:string)
{
  this.http.delete('https://apiintegration-52bc7-default-rtdb.firebaseio.com/products/'+id+'.json')
.subscribe()
}
onclearProduct()
{
  this.http.delete('https://apiintegration-52bc7-default-rtdb.firebaseio.com/products/.json')
.subscribe()
}
onEditClicked(id:string)
{
  this.currentProductId=id;
  let currentProduct=this.allProducts.find((p) => {return p.id===id});
  console.log(this.form)
  this.form.setValue({
    pName:currentProduct.pName,
    desc:currentProduct.desc,
    price:currentProduct.price
  });
  this.editMode=true;
}
updateProduct(id:string,value:proddetails
  )
{
  this.http.put('https://apiintegration-52bc7-default-rtdb.firebaseio.com/products/'+id+'.json',value)
.subscribe();
}
}
