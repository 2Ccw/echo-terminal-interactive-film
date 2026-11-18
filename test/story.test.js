import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source=await readFile(new URL("../public/story.js",import.meta.url),"utf8");
const { story,endings }=await import("../public/story.js");

test("every choice reaches a valid story node or ending",()=>{
  for(const [id,node] of Object.entries(story)) for(const choice of node.choices) assert.ok(story[choice.next]||endings[choice.next],`${id} -> ${choice.next}`);
});

test("all story nodes can be reached from the opening",()=>{
  const seen=new Set(), visit=id=>{if(seen.has(id)||endings[id])return;seen.add(id);for(const c of story[id].choices)visit(c.next);}; visit("wake");
  assert.deepEqual([...Object.keys(story).filter(id=>!seen.has(id))],[]);
});

test("contains meaningful branching and five complete endings",()=>{
  assert.ok(Object.values(story).filter(node=>node.choices.length>1).length>=2); assert.equal(Object.keys(endings).length,5);
  for(const ending of Object.values(endings)) assert.ok(ending.text.length>45);
});

test("story asset remains self-contained",()=>assert.ok(source.includes("ending_truth")));
