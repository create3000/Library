#!/usr/bin/env node
"use strict";

const
   os                     = require ("os"),
   { default: Semaphore } = require ("semaphore-async-await"),
   { sh, system }         = require ("shell-tools");

const
   tests = `${process .cwd ()}/Tests/Components/`,
   lock  = new Semaphore (os .cpus () .length);

async function queue (name, fn)
{
   await lock .acquire ();
   console .log (name);
   await fn ();
   lock .release ();
}

function convert (filename)
{
   queue (filename, () => system (`npx --yes x3d-tidy -r -m -i '${filename}' -o '.x3d' 1>/dev/null`));
}

const files = sh (`find '${tests}' -type f \\( -name "*.x3d" -o -name "*.x3dv" -o -name "*.x3dj" -o -name "*.wrl" -o -name "*.gltf" -o -name "*.glb" \\)`) .trim () .split ("\n") .sort ();

for (const filename of files)
   convert (filename);
