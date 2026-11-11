/* Testes de lógica sem necessidade de emulador ou conexão com o banco. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/lib/utils.ts'), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2021 } }).outputText;
const sandbox = { exports: {}, module: { exports: {} }, Intl, Date, Number, Math, String, RegExp };
vm.runInNewContext(js, sandbox);
const {parcelaPrice, cpfValido, dataISOValida, cleanKey, onlyDigits, brl} = sandbox.exports;

assert.equal(parcelaPrice(100_000, 20_000, 0, 40), 2000);
assert.ok(Math.abs(parcelaPrice(100_000, 20_000, 1.5, 48) - 2350) < 200);
assert.equal(parcelaPrice(100_000, 120_000, 1.5, 48), 0);
assert.equal(parcelaPrice(100_000, 20_000, 1.5, 0), 0);
assert.equal(cpfValido('529.982.247-25'), true);
assert.equal(cpfValido('111.111.111-11'), false);
assert.equal(cpfValido('529.982.247-26'), false);
assert.equal(dataISOValida('2026-02-28'), true);
assert.equal(dataISOValida('2026-02-30'), false);
assert.equal(dataISOValida('2026-13-01'), false);
assert.equal(cleanKey('Veículo  São!'), 'veiculosa o'.replace(/[^a-z0-9]/g,''));
assert.equal(onlyDigits('(11) 99999-9999'), '11999999999');
assert.equal(brl(null), 'Consulte o valor');
console.log('Testes aprovados: parcelas, CPF, datas, filtros e formatação.');
