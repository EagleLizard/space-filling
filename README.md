Required: 
* TypeScript 2.5.2+
* TypeScript Compiler

to get TypeScript:

```
  npm i -g typescript
```

To run, compile the code:
```
  tsc
```

Make the run script executable:
```
chmod a+x ./run.sh
```

Execute the script:
```
./run.sh
```

Output uses ASCII braille to perform a step-by-step animation of the algorithm.

The `clear()` api for `drawille` doesn't produce the expected functionality, so each frame is written to `stdout` in a stream.