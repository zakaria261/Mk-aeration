import test from 'node:test';
import assert from 'node:assert/strict';
import { quoteSchema } from '../lib/quote-validation.ts';
const valid = {id:'c2a04fc7-10ac-44c6-949c-7cdbe8d7f550',service:'vmc',profile:'Professionnel',city:'Grenoble',postcode:'38000',timing:'Projet à définir',description:'Installation d’une ventilation double flux dans un local professionnel.',name:'Client de test',company:'',email:'test@example.invalid',phone:'07 68 47 61 26',consent:true,website:'',startedAt:Date.now()-10000};
test('accepts a complete project and trims contact fields',()=>{const result=quoteSchema.parse({...valid,name:' Client de test '});assert.equal(result.name,'Client de test');});
test('accepts French national and international phone formats',()=>{for(const phone of ['0768476126','07 68 47 61 26','07.68.47.61.26','+33768476126','0033768476126'])assert.equal(quoteSchema.safeParse({...valid,phone}).success,true,phone);});
test('rejects incomplete, invalid and automated requests',()=>{for(const overrides of [{email:'incorrect'},{phone:'1234'},{postcode:'3800'},{description:'Trop court'},{consent:false},{website:'https://spam.invalid'},{service:'fake'},{name:''}])assert.equal(quoteSchema.safeParse({...valid,...overrides}).success,false,JSON.stringify(overrides));});
