# Handoff: Minecraft modding kezdés (Fabric, Claude Code + VS Code)

Ez a doksi egy felhős beszélgetés összefoglalója, hogy lokális Claude Code sessionben folytatható legyen.

## Cél
Minél egyszerűbb módon kipróbálni a Minecraft modolást:
- egyedi blokk, egyszerű textúrával
- a blokk csinál valamit (viselkedés)
- a blokknak van UI-ja (GUI)
- kipróbálás a Minecraftban

## Döntések eddig
- **Platform:** Minecraft **Java Edition**, **Fabric** (könnyebb, mint Forge/NeoForge; NeoForge később is opció).
- **Nyelv:** Java.
- **Eszközök:** **Claude Code** írja a kódot, a szerkesztő **VS Code** (nem kell IntelliJ), build/futtatás terminálból Gradle-lel.
- **Minecraft verzió:** MÉG NEM DÖNTÖTT. Kérdezd meg a felhasználót, és egy verziót használj végig (a Minecraft API verziónként változik, tutorialokat is a pontos verzióhoz keress).
- **Java tudás:** nincs megadva, kérdezd meg.

## Előkészületek (a felhasználó gépén)
1. **JDK** telepítése: a választott Minecraft verzió által megkövetelt (jelenleg 21+).
2. **Projekt generálása** a Fabric template generátorral (fabricmc.net -> Develop -> Template Mod Generator). A Gradle wrapper (`./gradlew`) benne van, külön Gradle nem kell.
3. **VS Code:** *Extension Pack for Java* (Microsoft), opcionálisan *Gradle for Java*. Ha a JDK-t nem találja: `java.jdt.ls.java.home` beállítás. Piros hibák esetén: `Java: Clean Java Language Server Workspace`.
4. **Egyszer futtatni:** `./gradlew genSources`. Dekompilált Minecraft forrást generál, amit Claude olvasni tud, és a VS Code-ban F12-vel lehet navigálni. Ez csökkenti az API-találgatást.
5. **Próbaindítás:** `./gradlew runClient` elindít egy dev Minecraftot a mododdal (nem kell a valódi játékba telepíteni).

## Lépések (becsült idő tapasztalt Java-s fejlesztőnek)
1. **Környezet** (1-2 óra): lásd fent, `runClient` működik.
2. **Egyszerű blokk** (1-2 óra): `Block` + `BlockItem` regisztráció, creative tabba tétel; JSON-ök: blockstate, model, item model; 16x16 PNG textúra; lang bejegyzés a névhez.
3. **Viselkedés** (1-2 óra): pl. `onUse` felülírása (jobb klikk -> chat üzenet, item dobás, effekt).
4. **UI / GUI** (4-10+ óra elsőre, a legnehezebb rész): 
   - `BlockEntity` (adat, pl. inventory) + típus regisztráció
   - `ScreenHandler` (szerveroldali logika, slotok) + típus regisztráció
   - `Screen` (kliensoldali kirajzolás), GUI háttértextúra
   - megnyitás `onUse`-ból
   - Kezdd egyszerűvel (1 slot vagy 1 gomb).
5. **Teszt és iteráció:** erőforrások (textúra, JSON) újratöltése játékban F3+T; kódváltozáshoz újraindítás. Kész mod: `./gradlew build` -> jar a `build/libs`-ben.

Teljes idő: Java-t ismerőnek hétvége (kb. 8-15 óra); programozni tudónak, de Java nélkül 1-2 hét esti munka.

## Munkafolyamat Claude Code-dal
1. Claude megírja a Java kódot és a JSON fájlokat.
2. `./gradlew build` -> Claude látja és javítja a fordítási hibákat.
3. A felhasználó futtatja a `./gradlew runClient`-et, és kipróbálja a blokkot / GUI-t.
4. A felhasználó leírja vagy screenshotban megmutatja, mit lát; Claude javít; ismétlés.

Megjegyzés: Claude nem látja a Minecraft ablakot, a vizuális ellenőrzés (textúra, GUI elrendezés) a felhasználóé. Felhős sessionben nincs kijelző, így ott a `runClient` nem használható; ezért kell lokális session.

## Tippek
- Egy tutorial sorozatot kövess elejétől a végéig a pontos verzióhoz (Fabric docs, Kaupenjoe YouTube), ne keverd a verziókat.
- Előbb GUI nélküli blokkot csinálj, utána add hozzá a nehezebb részt.
- Textúra: bármilyen pixel editor, vagy Claude generálhat egyszerű PNG-t scriptből.
- Alternatíva Java nélkül: Bedrock add-onok (JSON + JS), de az egyedi UI-juk korlátozott.

## Következő lépés (innen folytasd)
1. Kérdezd meg: Minecraft verzió, Java tapasztalat, Fabric vs NeoForge (alapértelmezett: Fabric).
2. Ellenőrizd a JDK-t (`java -version`) és hogy van-e már template projekt.
3. Ha nincs projekt, segíts legenerálni / beállítani, majd `genSources` és `runClient`.
4. Folytasd a 2. lépéstől: első egyszerű blokk textúrával.
