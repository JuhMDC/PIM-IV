/* Contratos HTTP simulados. Não requer API nem SQL Server. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
(async () => {
  const script = fs.readFileSync(path.resolve(__dirname, '../src/lib/api.ts'), 'utf8');
  const code = ts.transpileModule(script, {compilerOptions:{module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2021}}).outputText;
  const calls=[];
  const sandbox = {
    exports: {},
    process: {env:{EXPO_PUBLIC_API_URL:'https://api.example.com/'}},
    AbortController, setTimeout, clearTimeout,
    fetch: async (url, options) => {
      calls.push({url,options});
      return {ok:true,status:200,text:async()=>JSON.stringify(url.includes('veiculos')
        ? [{id:12,marca:'Honda',modelo:'Civic',ano:2022,preco:105000,cor:'Cinza',cambio:'Automático',status:'Disponível',categoria:'Sedã',quilometragem:12000,imagemUrl:'/veiculos/civic-cinza.webp'}]
        : {protocolo:91,mensagem:'OK'})};
    },
  };
  vm.runInNewContext(code,sandbox);
  const {api,urlImagem,API_BASE}=sandbox.exports;
  assert.equal(API_BASE,'https://api.example.com');
  const carros=await api.veiculos();
  assert.equal(carros[0].modelo,'Civic');
  assert.equal(carros[0].preco,105000);
  assert.equal(urlImagem(carros[0].imagemUrl),'https://api.example.com/veiculos/civic-cinza.webp');
  const cadastro={nome:'Cliente Exemplo',email:'cliente@example.com',cpf:'52998224725',telefone:'11999999999',dataNascimento:'1995-05-12',idVeiculo:12,dataAgendamento:'2026-12-15',horario:'10:00'};
  const result=await api.testDrive(cadastro);
  assert.equal(result.protocolo,91);
  assert.equal(calls[1].url,'https://api.example.com/api/mobile/testdrives');
  assert.equal(JSON.parse(calls[1].options.body).idVeiculo,12);
  assert.equal(calls[1].options.headers['Content-Type'],'application/json');
  console.log('Contratos API simulados aprovados: GET catálogo, imagem e POST test-drive.');
})().catch(e=>{console.error(e);process.exitCode=1;});
