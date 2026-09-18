const assert=require('node:assert/strict');
const M=require('../assets/sinusoidi/model.js');
const near=(x,y)=>assert(Math.abs(x-y)<1e-8,`${x} != ${y}`);
near(M.value(5,50,0,.005),5);
near(M.value(5,50,90,0),5);
for(let j=0;j<100;j++){
 const t=j/997;
 const same=M.at(M.presets.same,t),opposite=M.at(M.presets.opposite,t);
 near(same[2],2*same[0]);near(opposite[2],0);near(opposite[3],2*opposite[0]);
 const italy=M.at(M.presets.italy,t);near(italy[1],0);near(italy[3],italy[0]);
 const usa=M.at(M.presets.usa,t);near(usa[2],0);near(usa[3],2*usa[0]);
}
for(const [key,target] of [['italy',230],['usa',240]]){
 const s=M.presets[key];let sum=0;const n=10000;
 for(let j=0;j<n;j++)sum+=M.at(s,j/n/s.f[0])[3]**2;
 near(Math.sqrt(sum/n),target);
}
near(M.at(M.presets.beats,.1)[2],0);
console.log('PASS: phase, peak, sum, difference, domestic RMS values and beat cancellation.');
