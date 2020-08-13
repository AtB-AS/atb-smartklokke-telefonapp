# atb-smartklokke-telefonapp
Dette prosjektet består av en Apple Watch app og en iPhone app. Watch-appen er skrevet i Swift og iPhone-appen i React Native.  
iPhone-appen lar deg søke opp og lagre favorittreiser slik at man kan følge med på relevante linjer og få varsler i forkant av avganger.  
Avgangene sendes til Watch-appen slik at man kan ikke trenger å åpne iPhone-appen for å ta en rask titt på de neste avgangene. 

## Kjør prosjektet lokalt
Start med å klone prosjektet til din maskin
```
git clone https://github.com/AtB-AS/atb-smartklokke-telefonapp.git
```

Gå inn i prosjektet og installer npm pakker
```
npm install
```

Gå inn i mappa 'ios' og installer pods
```
cd ios
pod install
```

Åpne prosjektet i Xcode ved å bruke fila smartklokke.xcworkspace i mappa 'ios'.  
Velg 'smartklokke'  og en simulator den skal kjøres på og trykk build and run. Hvis mulig anbefales det å bruke fysiske enheter, da koblingen mellom Apple Watch-simulator og iPhone-simulator er treg.  
Åpne prosjektet i for eksempel VSCode for å gjøre endringer på react-native-appen.  


## Bakgrunn og forarbeid
Prosjektet tar utgangspunkt i brukergruppen faste reisende, og herfra ble det utarbeidet et konsept basert på brukerundersøkelser og intervjuer.  
  
Løsningen er basert på brukersentrert design, hvor løsningen lages i iterasjoner som brukertestes og endres mellom hver iterasjon. Dette har resultert i en løsning 
med god brukervennlighet, og et konsept som kan ha stor nytte hos faste reisende med Apple Watch. Selv om ikke hele løsningen er implementert i kode, er alt brukertestet gjennom prototyping i Figma.  

 

### Innsiktsarbeid
Som del av innsiktsarbeidet ble det laget brukerreiser som beskriver ulike typer reisende og problemer/utfordringer de har.
Vår løsning ønsker å ta tak i noen av disse utfordringene.  
  
I starten av prosjektet utførte vi intervjuer av folk på gata for å få større innsikt i deres reisemønstre og utfordringer tilknyttet bussreiser.
Under gateintervjuene kom det frem at faste reisende bruker lite tid på planlegging av sine reiser, fordi de ofte vet på forhånd hvilke busser og holdeplasser som passer deres reiser.
Noen faste reisende husker også ca tidspunkt bussene deres går, men på grunn av stor variasjon i disse tidene kan det hende at de må vente en del på holdeplassene eller at de mister bussen.
En strategi noen bruker for å motvirke dette er å sjekke sanntidene til bussene flere ganger før avreise.  
  
I og med at faste reisende er mer villige til å laste ned en Apple Watch-app fra AtB (i forhold til for eksempel turister eller andre som sjeldent resier med buss), 
var dette en naturlig brukergruppe vi kunne fokusere på. 
### Brukerreiser
![Brukerreise](https://user-images.githubusercontent.com/37469920/90137280-ba9d3b00-dd75-11ea-8388-4167b969d2d9.png)





### Konsept

<img width="674" alt="Screenshot 2020-08-13 at 10 35 44" src="https://user-images.githubusercontent.com/37469920/90137534-0cde5c00-dd76-11ea-9794-7500933c21b6.png"> 
Brukeres oppfatning av konseptet ble testet ut gjennom gateintervjuer og vi fant at 60% var positive til konseptet. Personer som ble spurt var fra mange forskjellige grupper reisende;
faste reisende daglige og ukentlige, de som bare reiser en gang iblandt og de som nesten aldri reiser med buss.


### Valg av funksjonalitet
Innenfor tidsrammene prosjektet hadde, har vi måttet ta strenge prioriteringer om hvilken funksjonalitet appene skulle inneholde.  
Prioriteringen har i hovedsak bakgrunn i en idémyldringsfase etterfulgt av en brukerundersøkelse, men det er også tatt hensyn til tidsrammene, 
slik at funksjonalitet som kan implementeres raskere eller passer godt sammen prioriteres høyere.  

I brukerundersøkelsen fikk respondanter fordele ut 5 poeng til funksjonaliteter de ønsket, resultatet fra undersøkelsen er gitt i tabellen under.  
| Funksjonalitets-Id | Beskrivelse | Prioriteringsprosent
| :---: | ----------- | :---: |
| 1 | Lagre reiseruter, med start, sluttdestinasjon og tidspunkt | 14%
| 2 | Velg blant dine favoritt-destinasjoner, og få reiseforslag fra din nåværende posisjon i klokka | 55%
| 3 | Lagre bare sluttdestinasjon og tidspunkt, en stund før avreise vil appen lage en reiserute ut i fra din nåværende posisjon | 20%
| 4 | Lagre reiseruter som gjentagende. Eks: Buss til trening hver mandag kl. 20.00 | 20%
| 5 | Varsel på klokka når du må begynne å gjøre deg klar for å gå | 49%
| 6 | Varsel på klokka når du må gå for å rekke bussen | 66%
| 7 | Varsel på klokka om avvik - forsinkelser, kansellering | 63%
| 8 | Varslene er basert på bussens sanntid | 57%
| 9 | Varslene er basert på bussens rutetid | 0%
| 10 | Varsel på klokka like før du må gå av bussen | 14%
| 11 | Se en oversikt over alle planlagte reiser på klokka | 3%
| 12 | Se din buss på et kart på klokka | 26%
| 13 | Se planlagt reiserute på et kart på klokka | 3%
| 14 | Se gjenværende steg i din reiserute på klokka | 17%
| 15 | Se stegene i den planlagte reisen på klokka | 11%
| 16 | Se alternative reiseruter på klokka | 0%
| 17 | Kjøpe billett/periodebillett på klokka | 60%
| 18 | Utsette planlagte reiser med noen minutter, få et nytt reiseforslag. “Slumrefunksjon” | 20%  
<img width="842" alt="Screenshot 2020-08-13 at 12 42 44" src="https://user-images.githubusercontent.com/37469920/90136767-f7b4fd80-dd74-11ea-9f5a-2a11494b207e.png">
Fra resultatet av undersøkelsen er det 6 funksjonaliteter som skiller seg ut og scoorer relativt høyt, av disse er halvparten ulike former for varslinger. 
Derfor valgte vi å fokusere på varslinger om brukeres reiser når vi valgte funksjonaliteter.  

### Løsning
Ut ifra konseptet ble det designet en løsning hvor brukere legger inn favorittreiser i en iPhone app hvor de kan se relevante sanntidsavganger og administrere ulike varsler.
Løsningen inneholder også en Apple Watch app som viser informasjon om dine favorittreiser, samt enklel administrering av favorittreiser og varsler.
Varslene sendes automatisk til smartklokka hvis du har lagt fra deg telefonen.  
  
Innenfor tidsrammene vi hadde klarte vi ikke å implementere hele løsningen, spesielt mangler en god del implementasjon på Watch-appen. Det ble brukt for mye tid i starten av prosjektet på iPhone-appen, noe som resulterte i at nesten all funksjonalitet tilhørende iPhone-appen ble implementert, men på bekostning av at vi dermed fikk for lite tid til Watch-appen. I ettertid ser vi at løsningen vår hadde litt for stort scope for tidsrammene vi hadde, men i og med at oppgaven ikke bad om et ferdig finpusset produkt etter endt prosjekt, lot vi oss sikte høyt etter en løsning med mange utfordringer både design- og implementasjonsmessig. Dette gjorde at det har vært veldig interresant og lærerikt å jobbe på prosjektet, og både designer og utvikler er godt fornøyde med å ha hatt dette prosjektet som sommerjobb i år. 
