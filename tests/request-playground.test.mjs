import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveRequest} from '../data/requestPlayground.ts';

test('pending and shipped questions return only the matching sample records',()=>{
  assert.deepEqual(resolveRequest('Show pending orders').rows.map(row=>row.id),['DEMO-104','DEMO-108']);
  assert.deepEqual(resolveRequest('Show shipped orders').rows.map(row=>row.id),['DEMO-113']);
});
test('count questions honor the same status filter',()=>{
  assert.equal(resolveRequest('How many orders are there?').count,3);
  assert.equal(resolveRequest('How many pending orders?').count,2);
  assert.equal(resolveRequest('Count shipped orders').count,1);
});
test('destructive examples are blocked without returning records',()=>{
  const result=resolveRequest('Delete all orders');
  assert.equal(result.blocked,true);
  assert.deepEqual(result.rows,[]);
});
test('unsupported domains and unsupported statuses ask for a supported example',()=>{
  assert.equal(resolveRequest('How many planets are there?'),null);
  assert.equal(resolveRequest('Show cancelled orders'),null);
});
