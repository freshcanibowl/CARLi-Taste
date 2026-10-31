import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const route=readFileSync(new URL('../app/api/recommend/route.ts',import.meta.url),'utf8');
const status=readFileSync(new URL('../app/api/status/route.ts',import.meta.url),'utf8');
test('recommend API uses real discoverCulture adapter',()=>assert.match(route,/await discoverCulture\(/));
test('recommend API fails closed without Qloo key',()=>assert.match(route,/QLOO_KEY_MISSING/));
test('recommend API never approves pet venues',()=>assert.match(route,/buildDiscoveryView/));
test('status distinguishes configured key from live verification',()=>{assert.match(status,/qlooConfigured/);assert.match(status,/liveQlooVerified:false/)});
