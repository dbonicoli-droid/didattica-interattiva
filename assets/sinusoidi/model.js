(function(root){
 'use strict';
 const presets={
  same:{a:[5,5],f:[50,50],p:[0,0],duration:60},
  opposite:{a:[5,5],f:[50,50],p:[0,180],duration:60},
  quadrature:{a:[5,5],f:[50,50],p:[0,90],duration:60},
  beats:{a:[5,5],f:[50,55],p:[0,0],duration:400},
  italy:{a:[230*Math.SQRT2,0],f:[50,50],p:[0,0],duration:60},
  usa:{a:[120*Math.SQRT2,120*Math.SQRT2],f:[60,60],p:[0,180],duration:50}
 };
 const value=(a,f,p,t)=>a*Math.sin(2*Math.PI*f*t+p*Math.PI/180);
 const at=(s,t)=>{const x=value(s.a[0],s.f[0],s.p[0],t),y=value(s.a[1],s.f[1],s.p[1],t);return [x,y,x+y,x-y]};
 const api={presets,value,at};
 if(typeof module==='object')module.exports=api;else root.SineModel=api;
})(typeof globalThis==='undefined'?this:globalThis);
