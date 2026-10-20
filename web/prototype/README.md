# Prototype v0: control room simulator

A single-file browser toy: open `index.html` on a phone or desktop.

- The plant model (`sim.js`, inlined into `index.html`) is a **throwaway JavaScript port**
  with made-up coefficients. It is not validated physics.
- The real model will live in the Java `sim` module and be compiled to JS (see the root README).
- Check the model without a browser: `node -e "const S=require('./sim.js');const s=S.newPlant(2);for(let i=0;i<6000;i++)S.step(s,0.05);console.log(s.Tc)"`

Tiers: Gen I (manual only), Gen II (auto trips, active emergency cooling), Gen III+ (adds passive cooling).
