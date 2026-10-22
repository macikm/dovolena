# Kalkulačka dovolené (Zákoník práce ČR)

Webová aplikace a PWA (Progressive Web App) pro výpočet zákonného nároku na dovolenou podle platného znění Zákoníku práce (č. 262/2006 Sb., po velké novele od 1. 1. 2021). Aplikace plně podporuje **plné i zkrácené pracovní úvazky** a je optimalizována pro zobrazení na výšku (chytré telefony) i na stolních počítačích.

- **URL:** [https://dovolena.martinmacko.cz](https://dovolena.martinmacko.cz)
- **Git repozitář:** [https://github.com/macikm/dovolena](https://github.com/macikm/dovolena)
- **Interní Docker port:** `8094:80`

---

## 🏖️ Funkce a možnosti kalkulačky

1. **Flexibilní nastavení úvazku a výměry:**
   - Standardní stanovená týdenní doba u zaměstnavatele (40 h, 38,75 h, 37,5 h či vlastní hodnota).
   - Výměra dovolené zadávaná buď **v týdnech** (4, 5, 8 týdnů i desetinná čísla), nebo **v hodinách** (např. 160 h, 200 h) s **obousměrným přepočtem**.
   - Volba mezi plným úvazkem a konkrétním zkráceným úvazkem (např. 20 h/týden pro poloviční úvazek).
2. **Zadání odpracované doby:**
   - **Po měsících (12 měsíců):** rozpis Leden až Prosinec s automatickým sčítáním do celkové sumy a rychlými předvolbami (*Celý rok*, *6 měsíců*, *3 měsíce*).
   - **Přímá roční suma:** možnost zadat přímo celkový počet odpracovaných hodin za rok.
3. **Přesný legislativní výpočet (§ 211 – § 216 ZP):**
   - Automatické ověření podmínky vzniku nároku na poměrnou část: **odpracování alespoň 4 celých týdnů (4násobku TPD)** dle § 213 odst. 3 ZP.
   - Výpočet celých odpracovaných týdnů ($n \le 52$).
   - Aplikace pravidla $1/52$ za každý odpracovaný celý násobek TPD.
   - **Zákonné zaokrouhlení na celé hodiny nahoru** dle § 216 odst. 5 ZP.
   - Přepočet výsledku na **hodiny**, **dny** a **týdny**.
   - Indikace, kolik hodin zbývá k dokončení dalšího celého týdne a kolik hodin dovolené tím zaměstnanec získá navíc.
4. **PWA (Progressive Web App):**
   - Aplikaci lze jedním kliknutím nainstalovat na plochu mobilu nebo počítače jako samostatnou aplikaci.
   - Offline podpora díky Service Workeru a lokálnímu mezipaměťovému úložišti.
   - Optimalizované rozhraní pro mobilní telefony (orientace na výšku, bezpečné okraje pro notch / home indicator).
   - Tmavý i světlý režim s automatickou detekcí a možností ručního přepnutí.

---

## ⚖️ Legislativní vzorec (§ 213 ZP)

Za každý odpracovaný celý násobek týdenní pracovní doby (TPD) přísluší zaměstnanci $1/52$ z roční výměry dovolené:

$$\text{Nárok (v hodinách)} = \left\lceil \frac{\text{počet celých odpracovaných týdnů}}{52} \times \text{TPD} \times \text{výměra v týdnech} \right\rceil$$

*Pokud zaměstnanec neodpracoval alespoň 4 celé týdny, nárok na dovolenou za daný kalendářní rok nevzniká ($0\text{ hodin}$).*

---

## 🚀 Spuštění v Dockeru

Aplikace běží v lehkém produkčním Nginx kontejneru na portu **8094**.

```bash
# Sestavení a spuštění kontejneru na pozadí
docker compose up -d --build

# Zobrazení logů
docker compose logs -f

# Kontrola stavu (healthcheck)
docker compose ps
```

Healthcheck endpoint je k dispozici na `http://localhost:8094/health`.

---

## 🔄 Automatická aktualizace (`update.sh`)

Skript zkontroluje nové commity na Git větvi `main`, stáhne je a automaticky znovusestaví kontejner:

```bash
chmod +x update.sh
./update.sh
```

---

## 💻 Lokální vývoj

```bash
npm install
npm run dev
```

Sestavení produkčního buildu:

```bash
npm run build
```
