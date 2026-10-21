# SCRAM

> **S**afe **C**ontrol **R**od **A**xe **M**an — the emergency shutdown of a nuclear reactor.

SCRAM is a **Minecraft mod** about realistic power generation, with nuclear
power at its centre: coolant loops, turbines, condensers, control rods, fuel
cycles and the grid they feed. Get it wrong and you get a SCRAM, or a meltdown.

> Status: **early planning**. Nothing is playable yet; see the [roadmap](docs/ROADMAP.md).

## Goals

- Plants that work like plants: fission (PWR / BWR) first, then fossil, hydro,
  wind, solar, geothermal, and fusion as an endgame goal.
- Real fuel cycle: mining, enrichment, fabrication, burnup, waste.
- Real operations: startup, load following, trips, SCRAMs.
- A grid that needs balancing, not just a pile of generators.

## Key decisions

| Topic | Decision | Status |
|-------|----------|--------|
| Project type | A mod (Java code), not a modpack | Decided |
| Loader | NeoForge | Decided |
| Minecraft version | 1.21.1 | Decided (revisit if companion mods move to 26.x) |
| Language | Java 21 | Decided |
| Architecture | Pure-Java `sim` module (no Minecraft imports) plus a NeoForge `mod` module | Decided |
| Server/client | Server owns the simulation; the client only displays synced values | Decided |
| Simulation step | Fixed time step per game tick (1/20 s) | Decided |
| Tuning data | Constants and designs in JSON, shared between sim, mod and web tool | Decided |
| Engineer tooling | Browser tool running the sim (`web` module, Java compiled to JS, e.g. TeaVM) | Proposed, needs a proof of concept |
| Mod compatibility | NeoForge energy/fluid/item capabilities; JEI/EMI, Jade/WTHIT; Patchouli for the guide | Proposed |
| Relation to Mekanism | Standalone reactor and own simulation; expose NeoForge capabilities so it still connects to other mods' cables and pipes | Decided |

## Architecture

```
sim/   pure Java: physics, plant components, unit tests, JSON in/out
mod/   NeoForge: block entities (tick the sim server-side, save/load),
       capabilities, menus and screens, networking, data loading
web/   prototype v0 browser simulator (web/prototype); later: Java sim compiled to JS
docs/  roadmap and system specs (docs/specs/TEMPLATE.md)
```

## Building

Requires JDK 21.

```
./gradlew :sim:test          # simulation tests
./gradlew build              # everything
./gradlew runClient          # launch Minecraft with the mod (needs the mod module)
```

`-PskipMod` builds only `sim`, useful where maven.neoforged.net is unreachable.

> The `mod` module is scaffolded but not yet verified to build: the `sim`
> tests pass, but the NeoForge versions in `mod/build.gradle` have not been
> checked against the NeoForge maven.

Roles map roughly onto MVC/MVVM: `sim` is the model, block entities are the
controllers, menus with synced data are the view-models, screens and
renderers are the views.

## How we work

- Electrical engineers write **system specs** (real behaviour, simplified
  model, equations/numbers, failure modes, a fidelity setting per system).
- The developer marks each spec's feasibility and builds it.
- Physics expectations become **unit tests** in `sim`, so disagreements are
  failing tests, not arguments.
- Tunable values live in JSON so they can be changed without touching Java.
- Regular playtest builds go to the engineers for feedback.

## Contributing

Ideas, system specs and balance feedback are welcome. Open an issue first for
anything big.

## License

MIT, see [LICENSE](LICENSE).
