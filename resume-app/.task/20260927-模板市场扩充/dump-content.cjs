const fs=require('fs'),path=require('path');
const root='src/material/Common';
const mods=process.argv.slice(2);
for(const m of mods){
  for(const f of fs.readdirSync(path.join(root,m)).filter(x=>x.endsWith('.vue')).sort()){
    const src=fs.readFileSync(path.join(root,m,f),'utf8');
    const tpl=(src.split('<template>')[1]||'').split('</template>')[0]||'';
    const st=(src.split('<style lang="scss" scoped>')[1]||'').split('</style>')[0]||'';
    const compact=tpl.replace(/\s+/g,' ').trim();
    const props=[...st.matchAll(/(background-color|border-radius|border-left|border-top|border-bottom|flex-direction|padding-left|padding-top|font-weight|color|grid-template-columns|background-image|box-shadow|gap)\s*:\s*([^;]+);/g)].map(x=>x[1]+'='+x[2].trim()).join(' | ');
    console.log('### '+m+'/'+f);
    console.log('TPL: '+compact.slice(0,700));
    console.log('CSS: '+props.slice(0,900));
    console.log();
  }
}