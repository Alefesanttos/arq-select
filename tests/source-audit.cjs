const fs=require('node:fs'),vm=require('node:vm');
const failures=[];let checked=0;
for(const file of fs.readdirSync('.')){
 const validate=source=>{try{new vm.Script(source,{filename:file});checked++}catch(error){failures.push(`${file}: ${error.message}`)}};
 if(file.endsWith('.js'))validate(fs.readFileSync(file,'utf8'));
 if(file.endsWith('.html'))for(const script of fs.readFileSync(file,'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  if(!/src=|application\/ld\+json|application\/json|type="module"/.test(script[1]))validate(script[2]);
 }
}
console.log(`${checked} JavaScript files and inline scripts checked.`);
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
