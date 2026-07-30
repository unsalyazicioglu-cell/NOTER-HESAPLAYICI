window.addEventListener("scroll",()=>{

const nav=document.querySelector("nav");

if(window.scrollY>50){

nav.style.background="rgba(10,10,10,.80)";

}else{

nav.style.background="rgba(10,10,10,.35)";

}

});
