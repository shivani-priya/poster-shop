var LOAD_NUM=4;//not needed reactive

var watcher;//else 122 throws an error
new Vue({
    el: "#app",
    data: {
        total: 0,
        products: [
        //    { title:"Product 1", id:1, price: 9.99},
        //    { title:"Product 2",id:2, price: 9.99},
        //    { title:"Product 3",id:3, price: 9.99}, 
        ],
        cart:[],
        search:"cat",
        lastSearch: "",
        loading: false,
        results:[]
    },
    methods:{
        addToCart: function(product){
          
           this.total += product.price;
           /*
             let tempArray = [];
           let count = 0;
           console.log("Working")
           while(count < 10) {
            tempArray.push(count)
            count++;
           };
           let newTempArray = tempArray.map(val => val*2*this.total);
            console.log(newTempArray,this.total);
            */
           var found=false;
           for(var i=0;i<this.cart.length;i++){
               if(this.cart[i].id===product.id){
                    this.cart[i].qty++;
                    found=true;
               }    
           }
           if(!found){
               this.cart.push({
               id: product.id,
               title:product.title,
               price:product.price,
               qty: 1

           })
        }
        },
        increment:function(product){
           // this.cart.qty++;
            product.qty++;
            //Instead of below use above
            /*
           for(var i=0;i<this.cart.length;i++){
            if(this.cart[i].id===product.id){
                 this.cart[i].qty++;
                 //found=true;
            }    
        }
        */
        this.total += product.price;
        },
        decrement:function(product){
           // this.product.qty--;??
           product.qty--;
           this.total -= product.price;

           if(product.qty<=0 ){
               //remove that element
               var i=this.cart.indexOf(product);
               this.cart.splice(i,1);

           }
           
           //Instead of below use above
           /*
           for(var i=0;i<this.cart.length;i++){
            if(this.cart[i].id===product.id){
                 this.cart[i].qty--;
                 //found=true;
            }    
        }
        */

        },
        onSubmit: function(){
            this.products=[];
            this.results=[];
            this.loading=true;
           // e.preventDefault();//doesnt work
            
            //var path=`/search?q=${this.search}`;
            var path="/search?q=".concat(this.search)
            this.$http.get(path).then(function(response){
                //Storing all search results in results using only some using slice
                this.results=response.body;
           // this.products=response.body.slice(0,LOAD_NUM);
            this.lastSearch=this.search;
            this.appendResults();
            this.loading=false;
            //setTimeout not required anymore
            });
        },
        appendResults:function(){
            //console.log("Appended")
            if(this.products.length <this.results.length){
                //106 would modify array so new var req
            var toAppend=this.results.slice(
                this.products.length,
                LOAD_NUM + this.products.length); 
                this.products=this.products.concat(toAppend) ;
            }
        }
    },
    filters:{
        formatPrice:function(price){
            return `$${price.toFixed(2)}`
        }
    },
    created: function(){
        this.onSubmit();
        //this.search="";
    },
    updated: function(){
        //create watcher
        var sensor=document.querySelector("#product-list-bottom")
         watcher=scrollMonitor.create(sensor);
         watcher.enterViewport(this.appendResults)// function(){//function callback can now be replaced with this.appenResults
        
    },
    beforeUpdated:function(){
        //destroy watcher listener
        if(watcher){
        watcher.destroy();
        watcher=null;
        }
    }
});

 
        //    let tempArray = [];
        //    let count = 0;
        //    console.log("Working")
        //    while(count < 10) {
        //     tempArray.push(count)
        //     count++;
        //    };
        //    let newTempArray = tempArray.map(val => val*2*this.total);
        //     console.log(newTempArray,this.total);
            


