const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');const M=require(root+'/assets/partitori/model.js');
const near=(a,b)=>assert(Math.abs(a-b)<1e-10*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
const a=M.solve(5,220,220,22000,22000),b=M.solve(5,22000,22000,220,220);
near(a.ideal,1.25);near(a.out,500/401);near(b.out,5/104);near(b.ideal,1.25);
for(let n=0;n<100;n++){const r=[100+n*731,280+n*241,81000-n*317,1000+n*601],v=n/20,m=M.solve(v,...r);near(m.currents[0],m.currents[1]+m.currents[2]);near(m.voltages[0]+m.voltages[1],v);near(m.voltages[2]+m.voltages[3],m.v1);m.voltages.forEach((val,i)=>near(val,m.currents[i]*r[i]));near(v*m.currents[0],m.currents.reduce((acc,i,k)=>acc+i*i*r[k],0));}
near(M.solve(0,220,220,22000,22000).out,0);assert.throws(()=>M.solve(5,0,2,3,4));
if(process.argv.includes('--figures')){const s={v:5,r1:220,r2:220,r3:22000,r4:22000};for(const [name,kind]of [['primo','first'],['secondo','second'],['cascata','cascade']]){let svg=M.diagram(s,kind,false);svg=svg.replace('<g class="wires">','<style>.wires{fill:none;stroke:currentColor;stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round}text{fill:currentColor;stroke:none;font:19px sans-serif}.junction{fill:currentColor}</style><g class="wires">');fs.writeFileSync(path.join(root,'assets/partitori',name+'.svg'),svg);}}
console.log('PASS: presets, 100 parameter sets, Kirchhoff, Ohm, power balance, zero input, input validation.');
