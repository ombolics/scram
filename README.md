# SCRAM

> **S**afe **C**ontrol **R**od **A**xe **M**an — the emergency shutdown of a nuclear reactor.
> In this modpack, you'll learn to love the button, because you will need it.

SCRAM is a Minecraft modpack about **realistic power generation**, with nuclear
power at its centre. Instead of "place block, get infinite RF", you build and run
real plant designs: coolant loops, turbines, condensers, control rods, fuel
cycles, and the grid they feed. Get it wrong and you get a SCRAM, or a meltdown.

> Status: **early scaffolding**. Nothing is playable yet; see the [roadmap](docs/ROADMAP.md).

## Goals

- Plants that work like plants: fission (PWR / BWR), plus fossil, hydro, wind,
  solar, geothermal, and fusion as an endgame goal.
- Real fuel cycle: mining, enrichment, fabrication, burnup, spent fuel, waste.
- Real operations: startup, load following, xenon-style transients, trips, SCRAMs.
- A power grid that needs balancing, not just a pile of generators.
- Progression that teaches how a plant fits together.

## Target platform

Proposed: **NeoForge 1.21.1**. This is a draft and may change; see
[docs/MODS.md](docs/MODS.md) for the candidate mod list.

## Repository layout

| Path | Purpose |
|------|---------|
| `docs/` | Design notes, roadmap, candidate mod list |
| `config/` | Mod configuration overrides shipped with the pack |
| `kubejs/` | Recipe, tag and progression scripts |
| `mods/` | Local-only mod jars (git-ignored); the pack manifest lists mods instead |

## Contributing

Ideas, plant designs and balance feedback are welcome. Open an issue first for
anything big. Keep jars out of git.

## License

MIT, see [LICENSE](LICENSE). Mods included in the pack keep their own licenses.
