/**
 * TAPES & GROOVES
 * Interactive 3D Record Store Experience & Infinite Music Discovery Engine
 * Includes Mood Selector, 12 Expanded Genres, and Vintage Walkman/Discman Deck
 */

// ==========================================================================
// 1. PROCEDURAL SOUND SYNTHESIS ENGINE (Web Audio API)
// ==========================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientGain = null;
    this.ambientSource = null;
    this.isAmbientPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Melodic brass door chime when entering the store
  playDoorBell() {
    this.init();
    const now = this.ctx.currentTime;
    
    const notes = [
      { freq: 880, time: 0, dur: 1.2 },        // A5
      { freq: 1174.66, time: 0.12, dur: 1.5 }, // D6
      { freq: 1318.51, time: 0.28, dur: 1.8 }  // E6
    ];

    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, now + note.time);

      gain.gain.setValueAtTime(0, now + note.time);
      gain.gain.linearRampToValueAtTime(0.18, now + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur);
    });
  }

  // Satisfying tactile clack sound when browsing through cases in the crate
  playCrateClack() {
    this.init();
    const now = this.ctx.currentTime;
    
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400 + Math.random() * 400, now);
    filter.Q.setValueAtTime(4.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Mechanical deck button push latch click (Walkman / Discman)
  playMechanicalClick() {
    this.init();
    const now = this.ctx.currentTime;

    // Heavy tactile click + spring release
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // High pitch rapid motor whirring (Tape rewind / fast-forward)
  playTapeRewind() {
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.18);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Smooth dramatic swoosh when pulling album from crate
  playSwoosh() {
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.25);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Ambient vinyl crackle & warm store atmosphere
  toggleAmbient() {
    this.init();
    if (this.isAmbientPlaying) {
      if (this.ambientGain) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      this.isAmbientPlaying = false;
      return false;
    } else {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        const pop = Math.random() > 0.9994 ? (Math.random() * 1.5 - 0.75) : 0;
        output[i] = white * 0.015 + pop;
      }

      this.ambientSource = this.ctx.createBufferSource();
      this.ambientSource.buffer = buffer;
      this.ambientSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.2);

      this.ambientSource.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientSource.start();
      this.isAmbientPlaying = true;
      return true;
    }
  }
}

const sounds = new SoundEngine();

// ==========================================================================
// 2. MASSIVE SEARCH SEED BANKS (12 Expanded Genres + Moods)
// ==========================================================================
const GENRE_SEEDS = {
  "all": [
    "Pink Floyd",
    "David Bowie",
    "The Beatles",
    "Queen",
    "Led Zeppelin",
    "Fleetwood Mac",
    "Michael Jackson",
    "Prince",
    "Stevie Wonder",
    "The Rolling Stones",
    "The Doors",
    "Bob Marley",
    "Nirvana",
    "Radiohead",
    "The Cure",
    "Depeche Mode",
    "Soda Stereo",
    "Charly Garcia",
    "Luis Alberto Spinetta",
    "Daft Punk",
    "Massive Attack",
    "Portishead",
    "Bjork",
    "Gorillaz",
    "Amy Winehouse",
    "The Smiths",
    "Blur",
    "Oasis",
    "The Strokes",
    "Arctic Monkeys",
    "The White Stripes",
    "Queens of the Stone Age",
    "Franz Ferdinand",
    "Muse",
    "The Black Keys",
    "Interpol",
    "Arcade Fire",
    "The Killers",
    "Yeah Yeah Yeahs",
    "Kanye West",
    "Eminem",
    "Outkast",
    "Jay-Z",
    "Coldplay",
    "Kings of Leon",
    "Modest Mouse",
    "Phoenix",
    "Death Cab for Cutie",
    "LCD Soundsystem",
    "Justice",
    "MGMT",
    "Empire of the Sun",
    "Cut Copy",
    "Passion Pit",
    "Los Bunkers",
    "Zoe",
    "Babasonicos",
    "Julieta Venegas",
    "Jorge Drexler",
    "Mon Laferte",
    "Miranda!",
    "Slipknot",
    "System of a Down",
    "Tool",
    "Deftones",
    "Mastodon",
    "Avenged Sevenfold",
    "Norah Jones",
    "John Legend",
    "Jamie Cullum",
    "Sharon Jones & the Dap-Kings",
    "Tame Impala",
    "Kendrick Lamar",
    "Frank Ocean",
    "Tyler, The Creator",
    "Mac Miller",
    "Travis Scott",
    "Drake",
    "J. Cole",
    "The Weeknd",
    "Dua Lipa",
    "Lorde",
    "Charli XCX",
    "Grimes",
    "Chvrches",
    "Foster the People",
    "Bleachers",
    "SZA",
    "Daniel Caesar",
    "Leon Bridges",
    "Michael Kiwanuka",
    "Kamasi Washington",
    "Thundercat",
    "Hiatus Kaiyote",
    "Childish Gambino",
    "Run The Jewels",
    "A$AP Rocky",
    "Joey Bada$$",
    "Freddie Gibbs",
    "Denzel Curry",
    "JID",
    "Little Simz",
    "Khruangbin",
    "Men I Trust",
    "Mac DeMarco",
    "Unknown Mortal Orchestra",
    "Mild High Club",
    "Courtney Barnett",
    "St. Vincent",
    "The War on Drugs",
    "Royal Blood",
    "Nothing But Thieves",
    "Alvvays",
    "Japanese Breakfast",
    "Mitski",
    "Big Thief",
    "King Gizzard & The Lizard Wizard",
    "IDLES",
    "Fontaines D.C.",
    "Shame",
    "Greta Van Fleet",
    "Ghost",
    "Bring Me The Horizon",
    "Disclosure",
    "Jamie xx",
    "Four Tet",
    "Bonobo",
    "Caribou",
    "Bicep",
    "KAYTRANADA",
    "Flume",
    "Rufus Du Sol",
    "ODESZA",
    "Natalia Lafourcade",
    "Rosalia",
    "C. Tangana",
    "El Mato a un Policia Motorizado",
    "Bandalos Chinos",
    "Conociendo Rusia",
    "Usted Señalemelo",
    "Siddhartha",
    "Little Jesus",
    "Camilo Septimo",
    "Los Mesoneros",
    "Caloncho",
    "Chronixx",
    "Protoje",
    "Sticky Fingers",
    "Ocean Alley",
    "Fat Freddy's Drop",
    "Cultura Profetica",
    "Billie Eilish",
    "Olivia Rodrigo",
    "Harry Styles",
    "Caroline Polachek",
    "Magdalena Bay",
    "Troye Sivan",
    "Chappell Roan",
    "Wet Leg",
    "Turnstile",
    "Geese",
    "Black Country, New Road",
    "The Smile",
    "Yard Act",
    "Inhaler",
    "The Last Dinner Party",
    "Fred again..",
    "Overmono",
    "Barry Can't Swim",
    "Peggy Gou",
    "Sofia Kourtesis",
    "Steve Lacy",
    "Silk Sonic",
    "Cleo Sol",
    "SAULT",
    "Yussef Dayes",
    "Ezra Collective",
    "Laufey",
    "Olivia Dean",
    "Arlo Parks",
    "Silvana Estrada",
    "Kevin Kaarl",
    "Ed Maverick",
    "Bratty",
    "Sen Senra",
    "Ca7riel & Paco Amoroso",
    "Dillom",
    "Wos",
    "Trueno",
    "Nathy Peluso",
    "Judeline",
    "Guitarricadelafuente",
    "Valeria Castro",
    "Arde Bogota",
    "Silvestre y La Naranja",
    "Sleep Token",
    "Spiritbox",
    "Electric Callboy",
    "Lorna Shore",
    "Bad Omens",
    "Koffee",
    "Lila Ike",
    "Boygenius",
    "Phoebe Bridgers",
    "Faye Webster",
    "The Marias",
    "TV Girl",
    "Royel Otis"
  ],
  "rock": [
    "The Beatles",
    "The Rolling Stones",
    "Led Zeppelin",
    "Pink Floyd",
    "The Who",
    "The Doors",
    "Queen",
    "David Bowie",
    "Jimi Hendrix",
    "Fleetwood Mac",
    "The Clash",
    "The Police",
    "Dire Straits",
    "U2",
    "The Cure",
    "The Smiths",
    "Joy Division",
    "Pixies",
    "R.E.M.",
    "Nirvana",
    "Pearl Jam",
    "Soundgarden",
    "Alice in Chains",
    "Smashing Pumpkins",
    "Oasis",
    "Blur",
    "Radiohead",
    "Pulp",
    "Suede",
    "The Verve",
    "Foo Fighters",
    "Red Hot Chili Peppers",
    "Rage Against the Machine",
    "Weezer",
    "Sonic Youth",
    "Jane's Addiction",
    "The Strokes",
    "Arctic Monkeys",
    "The White Stripes",
    "Queens of the Stone Age",
    "Franz Ferdinand",
    "Muse",
    "The Black Keys",
    "Interpol",
    "Arcade Fire",
    "The Killers",
    "Yeah Yeah Yeahs",
    "Bloc Party",
    "Foals",
    "The Libertines",
    "Kings of Leon",
    "Modest Mouse",
    "Spoon",
    "Phoenix",
    "Death Cab for Cutie",
    "The Shins",
    "Bright Eyes",
    "Wolfmother",
    "Jet",
    "The Darkness",
    "Kasabian",
    "The Hives",
    "The Vines",
    "Silversun Pickups",
    "Kaiser Chiefs",
    "The Fratellis",
    "The Kooks",
    "The Wombats",
    "The Subways",
    "Tame Impala",
    "The War on Drugs",
    "Alabama Shakes",
    "Royal Blood",
    "Nothing But Thieves",
    "Mac DeMarco",
    "Courtney Barnett",
    "St. Vincent",
    "Parquet Courts",
    "Car Seat Headrest",
    "Alvvays",
    "Japanese Breakfast",
    "Mitski",
    "Big Thief",
    "King Gizzard & The Lizard Wizard",
    "Thee Oh Sees",
    "Ty Segall",
    "IDLES",
    "Fontaines D.C.",
    "Shame",
    "Black Midi",
    "Greta Van Fleet",
    "Wolf Alice",
    "Sam Fender",
    "Catfish and the Bottlemen",
    "The 1975",
    "CHVRCHES",
    "Foals",
    "Everything Everything",
    "Sleaford Mods",
    "Viagra Boys",
    "Amyl and the Sniffers",
    "Wet Leg",
    "Turnstile",
    "Geese",
    "Black Country, New Road",
    "The Smile",
    "Yard Act",
    "Inhaler",
    "The Last Dinner Party",
    "English Teacher",
    "Mannequin Pussy",
    "Royel Otis",
    "Wunderhorse",
    "Squid",
    "Dry Cleaning",
    "Porridge Radio",
    "Bartees Strange",
    "Momma",
    "Wednesday",
    "Feeble Little Horse",
    "Water From Your Eyes"
  ],
  "latino": [
    "Soda Stereo",
    "Gustavo Cerati",
    "Charly Garcia",
    "Fito Paez",
    "Luis Alberto Spinetta",
    "Pescado Rabioso",
    "Seru Giran",
    "Los Prisioneros",
    "Los Tres",
    "La Ley",
    "Virus",
    "Sumo",
    "Los Fabulosos Cadillacs",
    "Enanitos Verdes",
    "Caifanes",
    "Cafe Tacvba",
    "Molotov",
    "Heroes del Silencio",
    "Enrique Bunbury",
    "Andres Calamaro",
    "Los Rodriguez",
    "Los Jaivas",
    "Mercedes Sosa",
    "Silvio Rodriguez",
    "Buena Vista Social Club",
    "Aterciopelados",
    "Divididos",
    "Bersuit Vergarabat",
    "Attaque 77",
    "La Renga",
    "Pappo",
    "Rata Blanca",
    "Los Bunkers",
    "Zoe",
    "Babasonicos",
    "Julieta Venegas",
    "Jorge Drexler",
    "Mon Laferte",
    "Miranda!",
    "Calle 13",
    "Austin TV",
    "Porter",
    "Hello Seahorse!",
    "Kinky",
    "Plastilina Mosh",
    "Control Machete",
    "DLD",
    "Enjambre",
    "Caramelos de Cianuro",
    "Los Amigos Invisibles",
    "Lucybell",
    "Chancho en Piedra",
    "Tiro de Gracia",
    "Makiza",
    "Gepe",
    "Javiera Mena",
    "Alex Anwandter",
    "El Cuarteto de Nos",
    "La Vela Puerca",
    "No Te Va Gustar",
    "Catupecu Machu",
    "Kapanga",
    "Carajo",
    "Vetusta Morla",
    "Love of Lesbian",
    "Dorian",
    "Leiva",
    "Natalia Lafourcade",
    "Rosalia",
    "C. Tangana",
    "El Mato a un Policia Motorizado",
    "Bandalos Chinos",
    "Conociendo Rusia",
    "Usted Señalemelo",
    "Las Ligas Menores",
    "Bestia Bebe",
    "Los Espiritus",
    "Siddhartha",
    "Little Jesus",
    "Camilo Septimo",
    "Los Mesoneros",
    "Centavrvs",
    "Clubz",
    "Caloncho",
    "Juan Pablo Vega",
    "Elsa y Elmar",
    "Esteman",
    "Pedropiedra",
    "Ases Falsos",
    "Chico Trujillo",
    "Santaferia",
    "Moral Distraida",
    "Manuel Garcia",
    "Cultura Profetica",
    "Gondwana",
    "Monsieur Perine",
    "Bomba Estereo",
    "Diamante Electrico",
    "Silvana Estrada",
    "Kevin Kaarl",
    "Ed Maverick",
    "Bratty",
    "Sen Senra",
    "Ca7riel & Paco Amoroso",
    "Dillom",
    "Wos",
    "Trueno",
    "Milo J",
    "Nathy Peluso",
    "Judeline",
    "Guitarricadelafuente",
    "Valeria Castro",
    "Arde Bogota",
    "Shinova",
    "Silvestre y La Naranja",
    "Goyo",
    "Chita",
    "Lara91k",
    "Taichu",
    "Saramalacara",
    "Bizarrap",
    "Rauw Alejandro",
    "Cruz Cafune",
    "Rels B",
    "Alvaro Diaz",
    "Nicki Nicole",
    "Emilia",
    "Milo J"
  ],
  "synth": [
    "Depeche Mode",
    "New Order",
    "Tears For Fears",
    "Duran Duran",
    "The Human League",
    "A-ha",
    "Pet Shop Boys",
    "Wham",
    "George Michael",
    "Eurythmics",
    "Talking Heads",
    "Blondie",
    "Kraftwerk",
    "Gary Numan",
    "Orchestral Manoeuvres in the Dark",
    "Simple Minds",
    "Ultravox",
    "Spandau Ballet",
    "Alphaville",
    "Bronski Beat",
    "Dead or Alive",
    "Talk Talk",
    "INXS",
    "Erasure",
    "Soft Cell",
    "Kavinsky",
    "The Midnight",
    "GUNSHIP",
    "FM-84",
    "Timecop1983",
    "Com Truise",
    "Miami Nights 1984",
    "Daft Punk",
    "Justice",
    "LCD Soundsystem",
    "Phoenix",
    "Cut Copy",
    "Passion Pit",
    "Empire of the Sun",
    "Hot Chip",
    "Ladytron",
    "Goldfrapp",
    "Robyn",
    "CSS",
    "La Roux",
    "Chromeo",
    "Crystal Castles",
    "Klaxons",
    "The Weeknd",
    "Dua Lipa",
    "Lorde",
    "Charli XCX",
    "Grimes",
    "CHVRCHES",
    "Foster the People",
    "Bleachers",
    "Carly Rae Jepsen",
    "Years & Years",
    "Christine and the Queens",
    "Roosevelt",
    "L'Imperatrice",
    "Parcels",
    "Future Islands",
    "St. Lucia",
    "M83",
    "Naked and Famous",
    "Purity Ring",
    "STRFKR",
    "Miami Horror",
    "Caroline Polachek",
    "Magdalena Bay",
    "Troye Sivan",
    "Billie Eilish",
    "Harry Styles",
    "Rina Sawayama",
    "Remi Wolf",
    "Chappell Roan",
    "PinkPantheress",
    "Jungle",
    "Nation of Language",
    "Cannons",
    "Men I Trust"
  ],
  "jazz": [
    "Miles Davis",
    "John Coltrane",
    "Bill Evans",
    "Chet Baker",
    "Thelonious Monk",
    "Dave Brubeck",
    "Charles Mingus",
    "Herbie Hancock",
    "Ella Fitzgerald",
    "Billie Holiday",
    "Nina Simone",
    "Louis Armstrong",
    "Stevie Wonder",
    "Marvin Gaye",
    "Aretha Franklin",
    "Otis Redding",
    "Sam Cooke",
    "Ray Charles",
    "Donny Hathaway",
    "Curtis Mayfield",
    "Al Green",
    "Sun Ra",
    "Pharoah Sanders",
    "Alice Coltrane",
    "Weather Report",
    "Return to Forever",
    "Mahavishnu Orchestra",
    "Chick Corea",
    "Pat Metheny",
    "Jaco Pastorius",
    "Amy Winehouse",
    "Norah Jones",
    "Erykah Badu",
    "D'Angelo",
    "Jill Scott",
    "Anthony Hamilton",
    "John Legend",
    "Sharon Jones & the Dap-Kings",
    "Jamie Cullum",
    "Corinne Bailey Rae",
    "Ledisi",
    "Bilal",
    "Roy Hargrove",
    "Brad Mehldau",
    "Christian McBride",
    "Esperanza Spalding",
    "Robert Glasper",
    "Kamasi Washington",
    "Thundercat",
    "Hiatus Kaiyote",
    "Snarky Puppy",
    "BADBADNOTGOOD",
    "Jordan Rakei",
    "Tom Misch",
    "Lianne La Havas",
    "Moses Sumney",
    "Anderson .Paak",
    "Jacob Collier",
    "Gregory Porter",
    "Leon Bridges",
    "Michael Kiwanuka",
    "Frank Ocean",
    "Daniel Caesar",
    "SZA",
    "Mac Ayres",
    "Masego",
    "Steve Lacy",
    "Silk Sonic",
    "Cleo Sol",
    "SAULT",
    "Yussef Dayes",
    "Ezra Collective",
    "Nubya Garcia",
    "Alfa Mist",
    "Kokoroko",
    "Laufey",
    "Olivia Dean",
    "Arlo Parks",
    "Moses Boyd",
    "Shabaka Hutchings",
    "Dominique Fils-Aime",
    "Joy Oladokun",
    "Emma-Jean Thackray",
    "Samara Joy"
  ],
  "electronic": [
    "Massive Attack",
    "Portishead",
    "Tricky",
    "The Prodigy",
    "The Chemical Brothers",
    "Fatboy Slim",
    "Underworld",
    "Aphex Twin",
    "Boards of Canada",
    "Moby",
    "Gorillaz",
    "Bjork",
    "Kraftwerk",
    "Leftfield",
    "Orbital",
    "Faithless",
    "Groove Armada",
    "DJ Shadow",
    "Nightmares on Wax",
    "Daft Punk",
    "Justice",
    "Four Tet",
    "Burial",
    "Bonobo",
    "Caribou",
    "Royksopp",
    "Air",
    "Morcheeba",
    "Zero 7",
    "Thievery Corporation",
    "Trentemoller",
    "Booka Shade",
    "Modeselektor",
    "Apparat",
    "Digitalism",
    "Simian Mobile Disco",
    "Boys Noize",
    "Tycho",
    "Gui Boratto",
    "Paul Kalkbrenner",
    "Disclosure",
    "Jamie xx",
    "The xx",
    "Nicolas Jaar",
    "Darkside",
    "Jon Hopkins",
    "Flume",
    "KAYTRANADA",
    "Rufus Du Sol",
    "ODESZA",
    "Bicep",
    "Maribou State",
    "Floating Points",
    "Mount Kimbie",
    "Moderat",
    "Ross from Friends",
    "DJ Seinfeld",
    "Mall Grab",
    "Peggy Gou",
    "Lane 8",
    "Kiasmos",
    "Tourist",
    "George FitzGerald",
    "Fred again..",
    "Overmono",
    "Salute",
    "Barry Can't Swim",
    "Sofia Kourtesis",
    "TSHA",
    "Logic1000",
    "Elkka",
    "Kelly Lee Owens",
    "India Jordan",
    "Jayda G",
    "Two Shell",
    "Nia Archives",
    "PinkPantheress"
  ],
  "hiphop": [
    "2Pac",
    "The Notorious B.I.G.",
    "Wu-Tang Clan",
    "Nas",
    "A Tribe Called Quest",
    "Outkast",
    "Dr. Dre",
    "Snoop Dogg",
    "MF DOOM",
    "J Dilla",
    "Cypress Hill",
    "The Fugees",
    "Beastie Boys",
    "Lauryn Hill",
    "Mos Def",
    "Public Enemy",
    "De La Soul",
    "Common",
    "Rakim",
    "Mobb Deep",
    "Gang Starr",
    "Kanye West",
    "Eminem",
    "50 Cent",
    "Jay-Z",
    "The Game",
    "Lupe Fiasco",
    "T.I.",
    "Lil Wayne",
    "Clipse",
    "Madlib",
    "Quasimoto",
    "Talib Kweli",
    "Black Star",
    "Slum Village",
    "Little Brother",
    "Kendrick Lamar",
    "Drake",
    "J. Cole",
    "Travis Scott",
    "Tyler, The Creator",
    "Mac Miller",
    "A$AP Rocky",
    "Joey Bada$$",
    "Childish Gambino",
    "Run The Jewels",
    "ScHoolboy Q",
    "Danny Brown",
    "Earl Sweatshirt",
    "Freddie Gibbs",
    "Pusha T",
    "Vince Staples",
    "Brockhampton",
    "Denzel Curry",
    "JID",
    "Little Simz",
    "Anderson .Paak",
    "Saba",
    "Smino",
    "Noname",
    "Mick Jenkins",
    "Isaiah Rashad",
    "Ab-Soul",
    "Westside Gunn",
    "Benny the Butcher",
    "Conway the Machine",
    "Rome Streetz",
    "Baby Keem",
    "Genesis Owusu",
    "Doechii",
    "redveil",
    "MIKE",
    "Armand Hammer",
    "Billy Woods",
    "Kenny Mason"
  ],
  "funk": [
    "Earth Wind & Fire",
    "Chic",
    "Kool & The Gang",
    "Rick James",
    "Parliament",
    "Funkadelic",
    "Stevie Wonder",
    "James Brown",
    "Sly & The Family Stone",
    "The Gap Band",
    "George Clinton",
    "Curtis Mayfield",
    "Tower of Power",
    "The Commodores",
    "Chaka Khan",
    "The Meters",
    "Bootsy Collins",
    "Average White Band",
    "War",
    "The Isley Brothers",
    "Ohio Players",
    "Zapp & Roger",
    "Fela Kuti",
    "Jamiroquai",
    "Maceo Parker",
    "The Brand New Heavies",
    "Incognito",
    "Sharon Jones & the Dap-Kings",
    "Charles Bradley",
    "Lee Fields",
    "The Budos Band",
    "Menahan Street Band",
    "El Michels Affair",
    "Breakbot",
    "Chromeo",
    "Tuxedo",
    "Mayer Hawthorne",
    "The New Mastersounds",
    "Silk Sonic",
    "Bruno Mars",
    "Anderson .Paak",
    "Vulfpeck",
    "Cory Wong",
    "The Fearless Flyers",
    "Jungle",
    "Parcels",
    "L'Imperatrice",
    "Franc Moody",
    "Men I Trust",
    "Khruangbin",
    "Toro y Moi",
    "Thundercat",
    "SAULT",
    "Tom Misch",
    "SG Lewis",
    "Say She She",
    "Thee Sacred Souls",
    "Monophonics",
    "Neal Francis",
    "Genesis Owusu",
    "The Dip",
    "Lady Wray",
    "Prep",
    "Free Nationals"
  ],
  "metal": [
    "Iron Maiden",
    "Judas Priest",
    "Metallica",
    "Megadeth",
    "Slayer",
    "Pantera",
    "Motorhead",
    "Black Sabbath",
    "Ozzy Osbourne",
    "Dio",
    "Rammstein",
    "Sepultura",
    "Death",
    "Opeth",
    "Machine Head",
    "Testament",
    "Kreator",
    "Helloween",
    "Anthrax",
    "Slipknot",
    "System of a Down",
    "Tool",
    "Deftones",
    "Korn",
    "Mastodon",
    "Avenged Sevenfold",
    "Lamb of God",
    "Killswitch Engage",
    "Trivium",
    "Gojira",
    "Children of Bodom",
    "Bullet for My Valentine",
    "In Flames",
    "Arch Enemy",
    "Meshuggah",
    "The Dillinger Escape Plan",
    "Converge",
    "Ghost",
    "Bring Me The Horizon",
    "Architects",
    "Deafheaven",
    "Baroness",
    "Kvelertak",
    "Power Trip",
    "Code Orange",
    "Knocked Loose",
    "Zeal & Ardor",
    "Animals as Leaders",
    "Periphery",
    "Polyphia",
    "Beartooth",
    "Polaris",
    "Wage War",
    "Jinjer",
    "Tesseract",
    "Sleep Token",
    "Spiritbox",
    "Turnstile",
    "Lorna Shore",
    "Electric Callboy",
    "Bad Omens",
    "Loathe",
    "Chat Pile",
    "Jesus Piece",
    "Zulu",
    "Soul Glo",
    "Static Dress",
    "Dying Wish"
  ],
  "reggae": [
    "Bob Marley",
    "Peter Tosh",
    "Jimmy Cliff",
    "Burning Spear",
    "Black Uhuru",
    "Toots and the Maytals",
    "Lee Scratch Perry",
    "Sublime",
    "Manu Chao",
    "Los Fabulosos Cadillacs",
    "Dennis Brown",
    "Gregory Isaacs",
    "Augustus Pablo",
    "King Tubby",
    "Scientist",
    "Mad Professor",
    "Sly & Robbie",
    "The Congos",
    "Cultura Profetica",
    "Gondwana",
    "Damian Marley",
    "Stephen Marley",
    "Gentleman",
    "Alborosie",
    "SOJA",
    "Rebelution",
    "Fat Freddy's Drop",
    "The Black Seeds",
    "Collie Buddz",
    "Los Cafres",
    "Dread Mar I",
    "Chronixx",
    "Protoje",
    "Kabaka Pyramid",
    "Jesse Royal",
    "Sticky Fingers",
    "Ocean Alley",
    "Stick Figure",
    "Iration",
    "Koffee",
    "Lila Ike",
    "Mortimer",
    "Samory I",
    "Jaz Elise",
    "Inna De Yard"
  ],
  "citypop": [
    "Tatsuro Yamashita",
    "Mariya Takeuchi",
    "Casiopea",
    "Anri",
    "Miki Matsubara",
    "Taeko Onuki",
    "T-Square",
    "Junko Ohashi",
    "Minako Yoshida",
    "Meiko Nakahara",
    "Yellow Magic Orchestra",
    "Haruomi Hosono",
    "Ryuichi Sakamoto",
    "Masayoshi Takanaka",
    "Yukihiro Takahashi",
    "Piper",
    "Tame Impala",
    "Khruangbin",
    "Men I Trust",
    "Mac DeMarco",
    "Unknown Mortal Orchestra",
    "Mild High Club",
    "Ginger Root",
    "Cortex",
    "BOY PABLO",
    "Cuco",
    "Crumb",
    "Sunset Rollercoaster",
    "Phum Viphurit",
    "HYUKOH",
    "SE SO NEON",
    "ADOY",
    "Yellow Days",
    "King Krule",
    "Still Woozy",
    "The Marias",
    "TV Girl",
    "Faye Webster",
    "Laufey",
    "Loving",
    "Feng Suave",
    "Vacations",
    "Royel Otis",
    "Gus Dapperton",
    "Balthazar",
    "Wallows",
    "Remi Wolf",
    "Beabadoobee"
  ],
  "bossa": [
    "Stan Getz",
    "Astrud Gilberto",
    "Antonio Carlos Jobim",
    "Joao Gilberto",
    "Caetano Veloso",
    "Gal Costa",
    "Gilberto Gil",
    "Vinicius de Moraes",
    "Baden Powell",
    "Elis Regina",
    "Chico Buarque",
    "Jorge Ben Jor",
    "Milton Nascimento",
    "Marcos Valle",
    "Toquinho",
    "Maria Bethania",
    "Arthur Verocai",
    "Hermeto Pascoal",
    "Egberto Gismonti",
    "Sergio Mendes",
    "Cartola",
    "Djavan",
    "Kings of Convenience",
    "Seu Jorge",
    "Ceu",
    "Bebel Gilberto",
    "Devendra Banhart",
    "Iron & Wine",
    "Sufjan Stevens",
    "Fleet Foxes",
    "Bon Iver",
    "Jose Gonzalez",
    "Jack Johnson",
    "Rodrigo Amarante",
    "Liniker",
    "Tim Bernardes",
    "O Terno",
    "Lucas Arruda",
    "Rubel",
    "Silva",
    "Bala Desejo",
    "Gilsons",
    "Dora Morelenbaum",
    "Father John Misty",
    "Big Thief",
    "Phoebe Bridgers",
    "Adrianne Lenker",
    "Boygenius",
    "Laufey",
    "Lizzy McAlpine",
    "Waxahatchee",
    "MJ Lenderman",
    "Arlo Parks"
  ]
};

// Mood presets connected to the Disquero Clerk
const MOOD_PRESETS = {
  "heartbreak": {
    "title": "CORAZÓN ROTO & MELANCOLÍA",
    "clerkMsg": "A veces la música melancólica es el mejor abrazo. Te preparé una batea con grabaciones íntimas, acústicas y letras desgarradoras de todas las épocas.",
    "seeds": [
      "Radiohead",
      "Mazzy Star",
      "The Cure",
      "Cigarettes After Sex",
      "Elliott Smith",
      "Joy Division",
      "Spinetta",
      "Portishead",
      "Nirvana",
      "Phoebe Bridgers",
      "Jeff Buckley",
      "Bon Iver",
      "Sufjan Stevens",
      "Damien Rice",
      "Fiona Apple",
      "Nick Cave",
      "Cat Power",
      "The National",
      "Daughter",
      "Slowdive",
      "Cocteau Twins",
      "Sinead O'Connor",
      "Leonard Cohen",
      "Tom Waits",
      "Tracy Chapman",
      "Joni Mitchell",
      "Chet Baker",
      "Low",
      "Nick Drake",
      "Spinetta Jade",
      "Boygenius",
      "Mitski",
      "Big Thief",
      "Adrianne Lenker",
      "Faye Webster",
      "Lana Del Rey",
      "Frank Ocean",
      "Daniel Caesar",
      "Billie Eilish",
      "Olivia Rodrigo",
      "Silvana Estrada",
      "Ed Maverick",
      "Kevin Kaarl",
      "Bratty",
      "Conociendo Rusia"
    ]
  },
  "adrenaline": {
    "title": "ADRENALINA & REBELDÍA",
    "clerkMsg": "¡A romper la rutina! Te acabo de seleccionar una batea con furia pura, guitarras encendidas y decibelios al máximo desde el punk 70s hasta el hardcore 2020s.",
    "seeds": [
      "Rage Against the Machine",
      "The Prodigy",
      "Metallica",
      "The Clash",
      "Beastie Boys",
      "Sex Pistols",
      "Slipknot",
      "Motorhead",
      "Bad Religion",
      "System of a Down",
      "Audioslave",
      "Foo Fighters",
      "Queens of the Stone Age",
      "Pantera",
      "The Offspring",
      "White Zombie",
      "Refused",
      "Fugazi",
      "Dead Kennedys",
      "The Hives",
      "IDLES",
      "The Stooges",
      "Black Flag",
      "Slayer",
      "Judas Priest",
      "Iron Maiden",
      "Rammstein",
      "Green Day",
      "Soundgarden",
      "At the Drive-In",
      "Turnstile",
      "Fontaines D.C.",
      "Amyl and the Sniffers",
      "Shame",
      "Viagra Boys",
      "Royal Blood",
      "Bring Me The Horizon",
      "Architects",
      "Sleep Token",
      "Spiritbox",
      "Dillom",
      "Wos",
      "Ca7riel & Paco Amoroso",
      "Molotov",
      "Death Grips"
    ]
  },
  "party": {
    "title": "FIESTA & BAILE RETRO/MODERNO",
    "clerkMsg": "¡A mover el cuerpo! Aquí tienes puro ritmo disco, synthpop de los 80s, electro francés de los 2000s y hits de baile contemporáneos.",
    "seeds": [
      "Daft Punk",
      "Michael Jackson",
      "Chic",
      "Donna Summer",
      "New Order",
      "Bee Gees",
      "Earth Wind & Fire",
      "Kool & The Gang",
      "Madonna",
      "Kavinsky",
      "Prince",
      "ABBA",
      "Giorgio Moroder",
      "Sister Sledge",
      "Rick James",
      "The Chemical Brothers",
      "Fatboy Slim",
      "Justice",
      "LCD Soundsystem",
      "Jamiroquai",
      "Boney M",
      "Wham",
      "Gloria Gaynor",
      "The Trammps",
      "Diana Ross",
      "Kylie Minogue",
      "Pet Shop Boys",
      "Depeche Mode",
      "Dua Lipa",
      "The Weeknd",
      "Charli XCX",
      "Fred again..",
      "Peggy Gou",
      "Jungle",
      "Parcels",
      "L'Imperatrice",
      "Silk Sonic",
      "Bizarrap",
      "Rauw Alejandro",
      "Kaytranada",
      "Disclosure",
      "Chromeo",
      "Empire of the Sun",
      "Cut Copy"
    ]
  },
  "chill": {
    "title": "LLUVIA, CAFÉ & RELAJO",
    "clerkMsg": "Perfecto para bajar las revoluciones, tomarte un café y mirar la lluvia. Esta selección combina clásicos del jazz y bossa con lo-fi y neo-soul moderno.",
    "seeds": [
      "Miles Davis",
      "Chet Baker",
      "Bill Evans",
      "Erykah Badu",
      "Norah Jones",
      "Tom Jobim",
      "Stan Getz",
      "Khruangbin",
      "D'Angelo",
      "Sade",
      "Nick Drake",
      "Air",
      "Bonobo",
      "Zero 7",
      "Thievery Corporation",
      "Morcheeba",
      "Astrud Gilberto",
      "Leon Bridges",
      "Lianne La Havas",
      "Corinne Bailey Rae",
      "Jose Gonzalez",
      "Kings of Convenience",
      "Jack Johnson",
      "Men I Trust",
      "Mac DeMarco",
      "Tycho",
      "Billie Holiday",
      "Nina Simone",
      "Caetano Veloso",
      "Jorge Drexler",
      "Laufey",
      "Olivia Dean",
      "Arlo Parks",
      "Cleo Sol",
      "SAULT",
      "Tom Misch",
      "Steve Lacy",
      "Cuco",
      "The Marias",
      "Sunset Rollercoaster",
      "Feng Suave"
    ]
  },
  "trippy": {
    "title": "VIAJE MENTAL & PSICODELIA",
    "clerkMsg": "Prepárate para un viaje extrasensorial. Esta selección reúne desde el rock psicodélico de los 60s hasta la neo-psicodelia de Tame Impala y King Gizzard.",
    "seeds": [
      "Pink Floyd",
      "Massive Attack",
      "Tame Impala",
      "King Crimson",
      "The Doors",
      "Boards of Canada",
      "Aphex Twin",
      "Can",
      "Porcupine Tree",
      "Kraftwerk",
      "Tool",
      "The Flaming Lips",
      "Animal Collective",
      "Brian Eno",
      "Neu!",
      "Hawkwind",
      "Gong",
      "Yes",
      "Genesis",
      "Jimi Hendrix",
      "Jefferson Airplane",
      "Grateful Dead",
      "Spacemen 3",
      "Spiritualized",
      "Unknown Mortal Orchestra",
      "Mild High Club",
      "The Velvet Underground",
      "Cocteau Twins",
      "Slowdive",
      "Caribou",
      "King Gizzard & The Lizard Wizard",
      "Thee Oh Sees",
      "Kikagaku Moyo",
      "The Black Angels",
      "Crumb",
      "Kikagaku Moyo",
      "Melody's Echo Chamber",
      "Pond",
      "Morgan Delt",
      "Balthazar"
    ]
  },
  "latin_bohemia": {
    "title": "BOHEMIA & MÚSICA LATINA",
    "clerkMsg": "La sangre latina y la poesía popular. Desde la trova clásica y el rock en español hasta el nuevo indie latino de hoy.",
    "seeds": [
      "Charly Garcia",
      "Soda Stereo",
      "Silvio Rodriguez",
      "Mercedes Sosa",
      "Los Jaivas",
      "Pescado Rabioso",
      "Caifanes",
      "Buena Vista Social Club",
      "Fito Paez",
      "Los Tres",
      "Seru Giran",
      "Luis Alberto Spinetta",
      "Gustavo Cerati",
      "Los Prisioneros",
      "La Ley",
      "Virus",
      "Sumo",
      "Los Fabulosos Cadillacs",
      "Enanitos Verdes",
      "Cafe Tacvba",
      "Molotov",
      "Heroes del Silencio",
      "Andres Calamaro",
      "Jorge Drexler",
      "Mon Laferte",
      "Los Bunkers",
      "Aterciopelados",
      "Pappo",
      "Rata Blanca",
      "El Cuarteto de Nos",
      "Natalia Lafourcade",
      "Rosalia",
      "C. Tangana",
      "Bandalos Chinos",
      "Conociendo Rusia",
      "El Mato a un Policia Motorizado",
      "Usted Señalemelo",
      "Silvana Estrada",
      "Kevin Kaarl",
      "Chico Trujillo",
      "Congreso",
      "Inti-Illimani",
      "Quilapayun",
      "Victor Jara",
      "Violeta Parra"
    ]
  }
};

// ==========================================================================
// 3. CURATED MASTERPIECE FALLBACK CATALOG (Offline Safety)
// ==========================================================================
const CURATED_FALLBACK = [
  {
    title: "Nevermind",
    artist: "Nirvana",
    year: "1991",
    genre: "Grunge / Alt Rock",
    format: "cd",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7b/09/b8/7b09b83b-967a-1122-2615-56faeaee6b15/13UAAIM41940.rgb.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/91/97/9d/91979d3c-95b6-75be-ca2b-34a11f26a798/mzaf_13508658804364121404.plus.aac.p.m4a",
    sampleTrack: "Smells Like Teen Spirit",
    review: "El disco que definió la rabia y melancolía de toda una generación. Producido por Butch Vig, cambió la historia del rock para siempre en 1991.",
    spotifyQuery: "Nirvana Nevermind",
    spineColor: "#004466"
  },
  {
    title: "Canción Animal",
    artist: "Soda Stereo",
    year: "1990",
    genre: "Rock en Español",
    format: "cd",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/11/49/a7/1149a712-45e7-2965-f9ea-5471da32454f/886443610997.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/e5/23/bf/e523bfd6-bb40-1e5b-b934-2e64ca65ee81/mzaf_12411993213076722880.plus.aac.p.m4a",
    sampleTrack: "De Música Ligera",
    review: "El cenit del rock en español. Riffs crudos, melodías celestiales compuestas por Gustavo Cerati y un sonido que conquistó todo el continente.",
    spotifyQuery: "Soda Stereo Cancion Animal",
    spineColor: "#e67300"
  },
  {
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    year: "1973",
    genre: "Progressive Rock",
    format: "cassette",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4a/14/b4/4a14b4c4-725d-4f10-ff34-e4612948bc54/0094638241755.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/3c/cf/7b/3ccf7be8-a3be-ca34-ce92-ea9b60da8490/mzaf_1130666060132332617.plus.aac.p.m4a",
    sampleTrack: "Money",
    review: "Grabado en Abbey Road con Alan Parsons. Un viaje sonoro ininterrumpido sobre el tiempo, el dinero, la locura y la existencia humana.",
    spotifyQuery: "Pink Floyd The Dark Side of the Moon",
    spineColor: "#111111"
  },
  {
    title: "Discovery",
    artist: "Daft Punk",
    year: "2001",
    genre: "French Touch / Electronic",
    format: "cd",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/6b/0e/e7/6b0ee736-2ee9-7db7-24a9-847e09ea8368/0724384960655.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/05/17/74/051774c8-5dc6-d44a-9351-4e7805d762e9/mzaf_6886475653063851509.plus.aac.p.m4a",
    sampleTrack: "One More Time",
    review: "Nostalgia retrofuturista, samples setenteros filtrados y una producción legendaria que convirtió a los robots franceses en íconos mundiales.",
    spotifyQuery: "Daft Punk Discovery",
    spineColor: "#2a2a2a"
  },
  {
    title: "Clics Modernos",
    artist: "Charly García",
    year: "1983",
    genre: "New Wave / Synthpop",
    format: "cassette",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/90/19/2d/90192d24-3f7c-40ad-a567-28fc76402ec9/886443603418.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/91/92/ff/9192ffd1-591b-a50e-a9b0-9b62649a2123/mzaf_15024479502283020967.plus.aac.p.m4a",
    sampleTrack: "Nos Siguen Pegando Abajo",
    review: "Grabado en Nueva York con Joe Blaney. Charly introdujo samplers y cajas de ritmos para crear un manifiesto de libertad bailable e irrepetible.",
    spotifyQuery: "Charly Garcia Clics Modernos",
    spineColor: "#d4a017"
  },
  {
    title: "Kind of Blue",
    artist: "Miles Davis",
    year: "1959",
    genre: "Modal Jazz",
    format: "cd",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/85/65/56/856556cf-7a32-9694-8149-6f9aa0a67117/886443603425.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/71/6a/02/716a02b1-1d54-1563-7e28-1efc39ee3fe1/mzaf_16156107386820295627.plus.aac.p.m4a",
    sampleTrack: "So What",
    review: "El testamento definitivo de la elegancia y la improvisación modal con John Coltrane y Bill Evans. Una joya eterna para la historia humana.",
    spotifyQuery: "Miles Davis Kind of Blue",
    spineColor: "#0d2b45"
  }
];

function getSpineColorForTitle(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 45%, 22%)`;
}

function generateEditorialBlurb(artist, title, genre, year) {
  const praises = [
    `Una obra cumbre en la trayectoria de ${artist}. Grabado con la magia sonora de ${year}, encapsula a la perfección el espíritu de ${genre}.`,
    `Considerado por críticos y coleccionistas como uno de los lanzamientos más inspirados de ${artist}. Las composiciones de este disco envejecieron como el buen vino.`,
    `Una joya imprescindible del universo de ${genre}. Lanzado en ${year}, este álbum redefinió la estética y el sonido característico de ${artist}.`,
    `Un tesoro rescatado de las bateas. Cada compás de este álbum de ${artist} refleja autenticidad, producción artesanal y maestría lírica.`,
    `Si buscas una recomendación que te sorprenda hoy, este trabajo de ${artist} (${year}) ofrece una experiencia auditiva envolvente de principio a fin.`
  ];
  return praises[Math.abs(artist.length + title.length) % praises.length];
}

// ==========================================================================
// ==========================================================================
// UNIVERSAL MUSIC SEARCH ENGINE (Deezer JSONP + iTunes Fallback)
// Guarantees 100% unblocked, worldwide, unlimited search for any artist or genre
// ==========================================================================
// Helper to extract accurate release year from Deezer track (via ISRC or album info)
function getYearFromTrack(track) {
  if (track.release_date) {
    const yr = new Date(track.release_date).getFullYear();
    if (!isNaN(yr)) return yr.toString();
  }
  if (track.isrc && track.isrc.length >= 7) {
    const yy = track.isrc.substring(5, 7);
    if (/^\d{2}$/.test(yy)) {
      const num = parseInt(yy, 10);
      return num <= 30 ? `20${yy}` : `19${yy}`;
    }
  }
  return '202X';
}

function fetchDeezerJSONP(query, limit = 40) {
  return new Promise((resolve) => {
    const cbName = 'dz_cb_' + Math.random().toString(36).substring(2, 9);
    const script = document.createElement('script');
    const timer = setTimeout(() => {
      cleanup();
      resolve([]);
    }, 6000);

    function cleanup() {
      clearTimeout(timer);
      try { delete window[cbName]; } catch (e) {}
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[cbName] = function(resp) {
      cleanup();
      if (resp && resp.data && Array.isArray(resp.data)) {
        resolve(resp.data);
      } else {
        resolve([]);
      }
    };

    script.src = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}&output=jsonp&callback=${cbName}`;
    script.onerror = () => {
      cleanup();
      resolve([]);
    };
    document.head.appendChild(script);
  });
}

async function fetchArtistTracks(artistSeed, limit = 8) {
  // 1. Try Deezer first (fast, open, 0 rate-limiting, 100% global catalog)
  try {
    const dzResults = await fetchDeezerJSONP(artistSeed, limit);
    if (dzResults && dzResults.length > 0) {
      return dzResults.map(t => ({
        collectionName: t.album ? t.album.title : t.title,
        artistName: t.artist ? t.artist.name : artistSeed,
        releaseDate: getYearFromTrack(t),
        primaryGenreName: 'Rock & Pop',
        artworkUrl100: (t.album && (t.album.cover_xl || t.album.cover_big || t.album.cover_medium)) 
          ? (t.album.cover_xl || t.album.cover_big || t.album.cover_medium) 
          : 'assets/crate_close_up.jpg',
        previewUrl: t.preview,
        trackName: t.title || 'Pista Destacada'
      }));
    }
  } catch (e) {}

  // 2. Fallback to iTunes
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artistSeed)}&entity=song&limit=${limit}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (e) {}

  return [];
}

// 4. APPLICATION STATE & CONTROLLER
// ==========================================================================
class RecordStoreApp {
  constructor() {
    this.currentScene = 'exterior';
    this.currentCategory = 'all';
    this.crateItems = [];
    this.selectedAlbum = null;
    this.audioElement = new Audio();
    this.isPlayingAudio = false;
    this.currentSearchTerm = '';
    this.batchCount = 1;
    this.vuInterval = null;

    // Cache DOM Elements
    this.scenes = {
      exterior: document.getElementById('scene-exterior'),
      interior: document.getElementById('scene-interior'),
      crate: document.getElementById('scene-crate'),
      inspect: document.getElementById('scene-inspect')
    };

    this.crateRack = document.getElementById('crate-rack');
    this.crateLabelTag = document.getElementById('crate-label-tag');
    this.ambientBtn = document.getElementById('ambient-btn');
    this.loadingIndicator = document.getElementById('loading-indicator');
    this.clerkMsg = document.getElementById('clerk-msg');

    // Walkman / Discman Deck Elements
    this.deviceModelBadge = document.getElementById('device-model-badge');
    this.lcdModeText = document.getElementById('lcd-mode-text');
    this.statusLedDot = document.getElementById('status-led-dot');
    this.playPauseBtn = document.getElementById('play-pause-btn');
    this.btnRewind = document.getElementById('btn-rewind');
    this.btnForward = document.getElementById('btn-forward');
    this.btnStop = document.getElementById('btn-stop');
    this.vuFills = document.querySelectorAll('.vu-fill');

    this.initEventListeners();
    this.loadCrateCategory('all');
  }

  // Bind UI Events
  initEventListeners() {
    // Ambient sound toggle
    this.ambientBtn.addEventListener('click', () => {
      const active = sounds.toggleAmbient();
      if (active) {
        this.ambientBtn.classList.add('active');
        this.ambientBtn.innerHTML = '<span>🔊</span><span>Vinilo / Lofi: ON</span>';
      } else {
        this.ambientBtn.classList.remove('active');
        this.ambientBtn.innerHTML = '<span>📻</span><span>Sonido Ambiente</span>';
      }
    });

    // Brand Logo Return to Exterior
    document.getElementById('brand-home-btn').addEventListener('click', () => {
      this.stopAudioPreview();
      this.switchScene('exterior');
    });

    // Scene Transitions
    document.getElementById('enter-store-btn').addEventListener('click', () => {
      sounds.playDoorBell();
      this.switchScene('interior');
    });

    document.getElementById('back-to-street-btn').addEventListener('click', () => {
      this.switchScene('exterior');
    });

    document.getElementById('approach-crate-btn').addEventListener('click', () => {
      sounds.playSwoosh();
      this.switchScene('crate');
    });

    document.getElementById('back-to-interior-btn').addEventListener('click', () => {
      this.switchScene('interior');
    });

    // Mood Selector Buttons
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const moodKey = btn.dataset.mood;
        const mood = MOOD_PRESETS[moodKey];
        if (mood) {
          sounds.playCrateClack();
          if (this.clerkMsg) {
            this.clerkMsg.textContent = mood.clerkMsg;
          }
          // Smooth transition directly to crate with this mood loaded!
          setTimeout(() => {
            sounds.playSwoosh();
            this.switchScene('crate');
            this.loadCustomMood(mood);
          }, 350);
        }
      });
    });

    // Crate Search Form
    const searchForm = document.getElementById('crate-search-form');
    const searchInput = document.getElementById('crate-search-input');
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        this.searchCustomQuery(query);
      }
    });

    // Shuffle Crate (Fetch fresh batch of 20 random records)
    document.getElementById('crate-shuffle-btn').addEventListener('click', () => {
      sounds.playCrateClack();
      this.batchCount++;
      if (this.currentSearchTerm) {
        this.searchCustomQuery(this.currentSearchTerm);
      } else {
        this.loadCrateCategory(this.currentCategory, true);
      }
    });

    // Random Pick from Crate
    document.getElementById('dig-random-btn').addEventListener('click', () => {
      this.pickRandomFromCrate();
    });

    // Category Tabs (12 Expanded Genres)
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSearchTerm = '';
        searchInput.value = '';
        const cat = btn.dataset.category;
        sounds.playCrateClack();
        this.loadCrateCategory(cat);
      });
    });

    // Crate horizontal scroll arrows
    document.getElementById('crate-left-arrow').addEventListener('click', () => {
      this.crateRack.scrollBy({ left: -240, behavior: 'smooth' });
      sounds.playCrateClack();
    });

    document.getElementById('crate-right-arrow').addEventListener('click', () => {
      this.crateRack.scrollBy({ left: 240, behavior: 'smooth' });
      sounds.playCrateClack();
    });

    // Inspect Card Actions
    document.getElementById('close-inspect-btn').addEventListener('click', () => {
      this.closeInspect();
    });

    document.getElementById('return-crate-btn').addEventListener('click', () => {
      this.closeInspect();
    });

    document.getElementById('pick-another-btn').addEventListener('click', () => {
      this.closeInspect();
      setTimeout(() => {
        this.pickRandomFromCrate();
      }, 350);
    });

    // Vintage Deck Mechanical Controls (Walkman / Discman)
    this.playPauseBtn.addEventListener('click', () => {
      sounds.playMechanicalClick();
      this.toggleAudioPreview();
    });

    this.btnRewind.addEventListener('click', () => {
      sounds.playMechanicalClick();
      sounds.playTapeRewind();
      this.audioElement.currentTime = Math.max(0, this.audioElement.currentTime - 5);
      this.updateAudioProgress();
    });

    this.btnForward.addEventListener('click', () => {
      sounds.playMechanicalClick();
      sounds.playTapeRewind();
      if (this.audioElement.duration) {
        this.audioElement.currentTime = Math.min(this.audioElement.duration, this.audioElement.currentTime + 5);
        this.updateAudioProgress();
      }
    });

    this.btnStop.addEventListener('click', () => {
      sounds.playMechanicalClick();
      this.stopAudioPreview();
    });

    // Progress Bar Click Seek
    document.getElementById('player-progress-container').addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      if (this.audioElement.duration) {
        this.audioElement.currentTime = clickPos * this.audioElement.duration;
        this.updateAudioProgress();
      }
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this.updateAudioProgress();
    });

    this.audioElement.addEventListener('ended', () => {
      this.onAudioEnded();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentScene === 'inspect') {
        this.closeInspect();
      } else if (e.code === 'Space' && this.currentScene === 'inspect') {
        e.preventDefault();
        sounds.playMechanicalClick();
        this.toggleAudioPreview();
      } else if (this.currentScene === 'crate') {
        if (e.key === 'ArrowRight') {
          this.crateRack.scrollBy({ left: 160, behavior: 'smooth' });
          sounds.playCrateClack();
        } else if (e.key === 'ArrowLeft') {
          this.crateRack.scrollBy({ left: -160, behavior: 'smooth' });
          sounds.playCrateClack();
        }
      }
    });
  }

  // Switch between visual stages
  switchScene(sceneName) {
    Object.keys(this.scenes).forEach(name => {
      this.scenes[name].classList.remove('active');
    });

    this.currentScene = sceneName;
    if (this.scenes[sceneName]) {
      this.scenes[sceneName].classList.add('active');
    }

    if (sceneName === 'crate') {
      setTimeout(() => {
        this.crateRack.scrollLeft = 0;
      }, 100);
    }
  }

  // Helper to normalize artist names for strict unique-artist crate deduplication
  normalizeArtist(name) {
    if (!name) return '';
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/^(the|los|las|el|la)\s+/i, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  // Load crate with custom Mood preset (Strict Artist Diversity)
  async loadCustomMood(mood) {
    this.showLoading(true, `Alistando la batea para: ${mood.title}...`);

    // Pick 24 diverse seeds from the expanded mood pool
    const pickedSeeds = [...mood.seeds].sort(() => Math.random() - 0.5).slice(0, 24);

    let collectedAlbums = [];
    const secondaryAlbums = [];
    const seenTitles = new Set();
    const seenArtists = new Set();

    try {
      // Query unblocked universal engine for each seed
      const fetchPromises = pickedSeeds.map(seed => fetchArtistTracks(seed, 8));
      const responses = await Promise.all(fetchPromises);

      responses.forEach((trackList, seedIdx) => {
        if (trackList && trackList.length > 0) {
          // Group songs by album to allow picking albums and tracks at random
          const albumGroups = new Map();
          for (const song of trackList) {
            const albumTitle = song.collectionName;
            if (!albumTitle) continue;
            if (!albumGroups.has(albumTitle)) {
              albumGroups.set(albumTitle, []);
            }
            albumGroups.get(albumTitle).push(song);
          }

          // Filter out already seen album titles in this crate
          const availableAlbums = Array.from(albumGroups.keys()).filter(title => !seenTitles.has(title.toLowerCase()));

          if (availableAlbums.length > 0) {
            // Pick a RANDOM album from this artist's available releases!
            const chosenAlbumTitle = availableAlbums[Math.floor(Math.random() * availableAlbums.length)];
            const tracksInAlbum = albumGroups.get(chosenAlbumTitle);
            // Pick a RANDOM track from this album for the 30s preview!
            const chosenTrack = tracksInAlbum[Math.floor(Math.random() * tracksInAlbum.length)];

            const normArtist = this.normalizeArtist(chosenTrack.artistName);

            const highResArt = chosenTrack.artworkUrl100
              ? chosenTrack.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
              : 'assets/crate_close_up.jpg';

            const releaseYear = chosenTrack.releaseDate
              ? new Date(chosenTrack.releaseDate).getFullYear().toString()
              : '199X';

            const format = (collectedAlbums.length + seedIdx) % 2 === 0 ? 'cd' : 'cassette';

            const albumObj = {
              title: chosenAlbumTitle,
              artist: chosenTrack.artistName,
              year: releaseYear,
              genre: chosenTrack.primaryGenreName || 'Rock & Pop',
              format: format,
              artwork: highResArt,
              previewUrl: chosenTrack.previewUrl,
              sampleTrack: chosenTrack.trackName || 'Pista Destacada',
              review: generateEditorialBlurb(chosenTrack.artistName, chosenAlbumTitle, chosenTrack.primaryGenreName || 'este género', releaseYear),
              spotifyQuery: `${chosenTrack.artistName} ${chosenAlbumTitle}`,
              spineColor: getSpineColorForTitle(chosenTrack.artistName + chosenAlbumTitle)
            };

            // STRICT: At most 1 album per artist in primary selection for 100% unique artists
            if (!seenArtists.has(normArtist)) {
              seenArtists.add(normArtist);
              seenTitles.add(chosenAlbumTitle.toLowerCase());
              collectedAlbums.push(albumObj);
            } else if (!seenTitles.has(chosenAlbumTitle.toLowerCase())) {
              secondaryAlbums.push(albumObj);
            }

            // Also keep other unselected albums as backup secondary candidates
            for (const otherTitle of availableAlbums) {
              if (otherTitle !== chosenAlbumTitle && !seenTitles.has(otherTitle.toLowerCase())) {
                const otherTracks = albumGroups.get(otherTitle);
                const otherTrack = otherTracks[0];
                secondaryAlbums.push({
                  title: otherTitle,
                  artist: otherTrack.artistName,
                  year: otherTrack.releaseDate ? new Date(otherTrack.releaseDate).getFullYear().toString() : '199X',
                  genre: otherTrack.primaryGenreName || 'Rock & Pop',
                  format: (secondaryAlbums.length % 2 === 0) ? 'cd' : 'cassette',
                  artwork: otherTrack.artworkUrl100 ? otherTrack.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg') : 'assets/crate_close_up.jpg',
                  previewUrl: otherTrack.previewUrl,
                  sampleTrack: otherTrack.trackName || 'Pista Destacada',
                  review: generateEditorialBlurb(otherTrack.artistName, otherTitle, otherTrack.primaryGenreName || 'este género', '199X'),
                  spotifyQuery: `${otherTrack.artistName} ${otherTitle}`,
                  spineColor: getSpineColorForTitle(otherTrack.artistName + otherTitle)
                });
              }
            }
          }
        }
      });

      // If we have under 20 due to any empty seed response, backfill with secondary unique titles
      if (collectedAlbums.length < 20 && secondaryAlbums.length > 0) {
        for (const extra of secondaryAlbums) {
          if (collectedAlbums.length >= 24) break;
          if (!seenTitles.has(extra.title.toLowerCase())) {
            seenTitles.add(extra.title.toLowerCase());
            collectedAlbums.push(extra);
          }
        }
      }
    } catch (err) {
      console.warn("Mood fetch error", err);
    }

    this.showLoading(false);

    if (collectedAlbums.length >= 8) {
      this.crateItems = collectedAlbums.sort(() => Math.random() - 0.5).slice(0, 24);
    } else {
      const fallbackFiltered = CURATED_FALLBACK.filter(a => !seenArtists.has(this.normalizeArtist(a.artist)));
      this.crateItems = [...collectedAlbums, ...fallbackFiltered].sort(() => Math.random() - 0.5).slice(0, 24);
    }

    if (this.crateLabelTag) {
      this.crateLabelTag.textContent = `BATEA: ${mood.title}`;
    }

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.renderCrate();
  }

  // Fetch a massive, random collection of albums with strict artist diversity (no repetitive artists)
  async loadCrateCategory(cat, isShuffle = false) {
    this.currentCategory = cat;
    this.showLoading(true, "Abriendo cajas nuevas del almacén...");

    const seeds = GENRE_SEEDS[cat] || GENRE_SEEDS.all;
    // Pick 24 random seeds from the large pool of artists
    const pickedSeeds = [...seeds].sort(() => Math.random() - 0.5).slice(0, 24);

    let collectedAlbums = [];
    const secondaryAlbums = [];
    const seenTitles = new Set();
    const seenArtists = new Set();

    try {
      // Query unblocked universal engine for each seed
      const fetchPromises = pickedSeeds.map(seed => fetchArtistTracks(seed, 8));
      const responses = await Promise.all(fetchPromises);

      responses.forEach((trackList, seedIdx) => {
        if (trackList && trackList.length > 0) {
          // Group songs by album to allow picking albums and tracks at random
          const albumGroups = new Map();
          for (const song of trackList) {
            const albumTitle = song.collectionName;
            if (!albumTitle) continue;
            if (!albumGroups.has(albumTitle)) {
              albumGroups.set(albumTitle, []);
            }
            albumGroups.get(albumTitle).push(song);
          }

          // Filter out already seen album titles in this crate
          const availableAlbums = Array.from(albumGroups.keys()).filter(title => !seenTitles.has(title.toLowerCase()));

          if (availableAlbums.length > 0) {
            // Pick a RANDOM album from this artist's available releases!
            const chosenAlbumTitle = availableAlbums[Math.floor(Math.random() * availableAlbums.length)];
            const tracksInAlbum = albumGroups.get(chosenAlbumTitle);
            // Pick a RANDOM track from this album for the 30s preview!
            const chosenTrack = tracksInAlbum[Math.floor(Math.random() * tracksInAlbum.length)];

            const normArtist = this.normalizeArtist(chosenTrack.artistName);

            const highResArt = chosenTrack.artworkUrl100
              ? chosenTrack.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
              : 'assets/crate_close_up.jpg';

            const releaseYear = chosenTrack.releaseDate
              ? new Date(chosenTrack.releaseDate).getFullYear().toString()
              : '199X';

            const format = (collectedAlbums.length + seedIdx) % 2 === 0 ? 'cd' : 'cassette';

            const albumObj = {
              title: chosenAlbumTitle,
              artist: chosenTrack.artistName,
              year: releaseYear,
              genre: chosenTrack.primaryGenreName || 'Rock & Pop',
              format: format,
              artwork: highResArt,
              previewUrl: chosenTrack.previewUrl,
              sampleTrack: chosenTrack.trackName || 'Pista Destacada',
              review: generateEditorialBlurb(chosenTrack.artistName, chosenAlbumTitle, chosenTrack.primaryGenreName || 'este género', releaseYear),
              spotifyQuery: `${chosenTrack.artistName} ${chosenAlbumTitle}`,
              spineColor: getSpineColorForTitle(chosenTrack.artistName + chosenAlbumTitle)
            };

            // STRICT: At most 1 album per artist in primary selection for 100% unique artists
            if (!seenArtists.has(normArtist)) {
              seenArtists.add(normArtist);
              seenTitles.add(chosenAlbumTitle.toLowerCase());
              collectedAlbums.push(albumObj);
            } else if (!seenTitles.has(chosenAlbumTitle.toLowerCase())) {
              secondaryAlbums.push(albumObj);
            }

            // Also keep other unselected albums as backup secondary candidates
            for (const otherTitle of availableAlbums) {
              if (otherTitle !== chosenAlbumTitle && !seenTitles.has(otherTitle.toLowerCase())) {
                const otherTracks = albumGroups.get(otherTitle);
                const otherTrack = otherTracks[0];
                secondaryAlbums.push({
                  title: otherTitle,
                  artist: otherTrack.artistName,
                  year: otherTrack.releaseDate ? new Date(otherTrack.releaseDate).getFullYear().toString() : '199X',
                  genre: otherTrack.primaryGenreName || 'Rock & Pop',
                  format: (secondaryAlbums.length % 2 === 0) ? 'cd' : 'cassette',
                  artwork: otherTrack.artworkUrl100 ? otherTrack.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg') : 'assets/crate_close_up.jpg',
                  previewUrl: otherTrack.previewUrl,
                  sampleTrack: otherTrack.trackName || 'Pista Destacada',
                  review: generateEditorialBlurb(otherTrack.artistName, otherTitle, otherTrack.primaryGenreName || 'este género', '199X'),
                  spotifyQuery: `${otherTrack.artistName} ${otherTitle}`,
                  spineColor: getSpineColorForTitle(otherTrack.artistName + otherTitle)
                });
              }
            }
          }
        }
      });

      // If we have under 20 albums due to any fetch miss, backfill with secondary albums
      if (collectedAlbums.length < 20 && secondaryAlbums.length > 0) {
        for (const extra of secondaryAlbums) {
          if (collectedAlbums.length >= 24) break;
          if (!seenTitles.has(extra.title.toLowerCase())) {
            seenTitles.add(extra.title.toLowerCase());
            collectedAlbums.push(extra);
          }
        }
      }
    } catch (err) {
      console.warn("iTunes API live search error, using fallback catalog", err);
    }

    this.showLoading(false);

    if (collectedAlbums.length >= 8) {
      this.crateItems = collectedAlbums.sort(() => Math.random() - 0.5).slice(0, 24);
    } else {
      const fallbackFiltered = CURATED_FALLBACK.filter(a => !seenArtists.has(this.normalizeArtist(a.artist)));
      this.crateItems = [...collectedAlbums, ...fallbackFiltered].sort(() => Math.random() - 0.5).slice(0, 24);
    }

    const catLabels = {
      all: 'MEZCLA UNIVERSAL',
      rock: 'ROCK CLÁSICO & GRUNGE',
      latino: 'ROCK & POP EN ESPAÑOL',
      synth: '80s POP & SYNTHWAVE',
      jazz: 'JAZZ, SOUL & BLUES',
      electronic: 'ELECTRÓNICA & TRIP-HOP',
      hiphop: 'HIP-HOP & RAP 90s',
      funk: 'FUNK, DISCO & MOTOWN',
      metal: 'METAL & PUNK ROCK',
      reggae: 'REGGAE, DUB & SKA',
      citypop: 'CITY POP & NEO-PSICODELIA',
      bossa: 'BOSSA NOVA & ACÚSTICO'
    };

    if (this.crateLabelTag) {
      this.crateLabelTag.textContent = `${catLabels[cat] || 'TESOROS'} • LOTE #${this.batchCount}`;
    }

    this.renderCrate();
  }

  // Search literally ANY artist, band, album or genre in the world on demand (Dual Engine Deezer + iTunes)
  async searchCustomQuery(query) {
    this.currentSearchTerm = query;
    this.showLoading(true, `Revolviendo el almacén en busca de "${query}"...`);

    let rawTracks = [];
    const normQuery = this.normalizeArtist(query);

    // 1. Primary: Deezer Worldwide Music Catalog (100M+ tracks, 100% open, zero rate limits)
    try {
      const dzTracks = await fetchDeezerJSONP(query, 50);
      if (dzTracks && dzTracks.length > 0) {
        rawTracks = dzTracks.map(t => ({
          albumTitle: t.album ? t.album.title : t.title,
          artistName: t.artist ? t.artist.name : query,
          releaseYear: getYearFromTrack(t),
          genre: 'Universal',
          artwork: (t.album && (t.album.cover_xl || t.album.cover_big || t.album.cover_medium)) 
            ? (t.album.cover_xl || t.album.cover_big || t.album.cover_medium) 
            : 'assets/crate_close_up.jpg',
          previewUrl: t.preview,
          trackName: t.title || 'Pista Principal'
        }));
      }
    } catch (e) {
      console.warn("Deezer search error", e);
    }

    // 2. Secondary fallback: iTunes API if Deezer returned 0 results
    if (rawTracks.length === 0) {
      try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=50`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            rawTracks = data.results.map(s => ({
              albumTitle: s.collectionName,
              artistName: s.artistName,
              releaseYear: s.releaseDate ? new Date(s.releaseDate).getFullYear().toString() : '199X',
              genre: s.primaryGenreName || 'Universal',
              artwork: s.artworkUrl100 ? s.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg') : 'assets/crate_close_up.jpg',
              previewUrl: s.previewUrl,
              trackName: s.trackName || 'Pista Principal'
            }));
          }
        }
      } catch (e) {
        console.warn("iTunes fallback search error", e);
      }
    }

    let foundAlbums = [];
    const secondaryFound = [];
    const seenTitles = new Set();
    const artistCounts = new Map();

    if (rawTracks.length > 0) {
      // If user searched for a specific band/artist, allow multiple albums from them
      const isSpecificArtistQuery = rawTracks.some(s => {
        const a = this.normalizeArtist(s.artistName);
        return a === normQuery || (normQuery.length >= 4 && a.includes(normQuery));
      });

      const maxPerArtist = isSpecificArtistQuery ? 8 : 1;

      rawTracks.forEach((song, idx) => {
        const albumTitle = song.albumTitle;
        if (!albumTitle || seenTitles.has(albumTitle.toLowerCase())) return;

        const normArtist = this.normalizeArtist(song.artistName);
        const currentCount = artistCounts.get(normArtist) || 0;

        const format = idx % 2 === 0 ? 'cd' : 'cassette';

        const albumObj = {
          title: albumTitle,
          artist: song.artistName,
          year: song.releaseYear,
          genre: song.genre,
          format: format,
          artwork: song.artwork,
          previewUrl: song.previewUrl,
          sampleTrack: song.trackName,
          review: generateEditorialBlurb(song.artistName, albumTitle, song.genre, song.releaseYear),
          spotifyQuery: `${song.artistName} ${albumTitle}`,
          spineColor: getSpineColorForTitle(song.artistName + albumTitle)
        };

        if (currentCount < maxPerArtist) {
          seenTitles.add(albumTitle.toLowerCase());
          artistCounts.set(normArtist, currentCount + 1);
          foundAlbums.push(albumObj);
        } else {
          secondaryFound.push(albumObj);
        }
      });

      // Backfill up to 24 with secondary records if available
      if (foundAlbums.length < 16 && secondaryFound.length > 0) {
        for (const extra of secondaryFound) {
          if (foundAlbums.length >= 24) break;
          if (!seenTitles.has(extra.title.toLowerCase())) {
            seenTitles.add(extra.title.toLowerCase());
            foundAlbums.push(extra);
          }
        }
      }
    }

    this.showLoading(false);

    if (foundAlbums.length > 0) {
      this.crateItems = foundAlbums.slice(0, 24);
      if (this.crateLabelTag) {
        this.crateLabelTag.textContent = `BÚSQUEDA: "${query.toUpperCase()}" (${foundAlbums.length} DISCOS)`;
      }
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.renderCrate();
    } else {
      alert(`No encontramos discos específicos para "${query}". Intenta con otro término o artista.`);
    }
  }

  // Render physical jewel cases & cassettes in the crate
  renderCrate() {
    this.crateRack.innerHTML = '';

    this.crateItems.forEach((album, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = `crate-item format-${album.format}`;
      itemEl.dataset.index = idx;

      const formatLabel = album.format === 'cd' ? 'COMPACT DISC' : 'CASSETTE TAPE';
      const spineStyle = album.spineColor
        ? `style="background: linear-gradient(90deg, #101015 0%, ${album.spineColor} 50%, #151520 100%);"`
        : '';

      itemEl.innerHTML = `
        <div class="item-spine" ${spineStyle}>
          <span class="item-badge-top">${formatLabel}</span>
          <span class="item-spine-title">${album.artist} • ${album.title}</span>
          <span class="item-badge-bottom">${album.year}</span>
        </div>
      `;

      itemEl.addEventListener('mouseenter', () => {
        sounds.playCrateClack();
      });

      itemEl.addEventListener('click', () => {
        sounds.playSwoosh();
        itemEl.classList.add('active-choice');
        setTimeout(() => {
          this.inspectAlbum(album);
          itemEl.classList.remove('active-choice');
        }, 300);
      });

      this.crateRack.appendChild(itemEl);
    });

    this.crateRack.scrollLeft = 0;
  }

  // Pick random album from the current crate
  pickRandomFromCrate() {
    if (this.crateItems.length === 0) return;
    const randomIdx = Math.floor(Math.random() * this.crateItems.length);
    const chosen = this.crateItems[randomIdx];

    const itemElements = this.crateRack.querySelectorAll('.crate-item');
    if (itemElements[randomIdx]) {
      itemElements[randomIdx].scrollIntoView({ behavior: 'smooth', inline: 'center' });
      itemElements[randomIdx].classList.add('active-choice');
    }

    sounds.playSwoosh();
    setTimeout(() => {
      this.inspectAlbum(chosen);
      if (itemElements[randomIdx]) {
        itemElements[randomIdx].classList.remove('active-choice');
      }
    }, 400);
  }

  // Open Album Reveal View (Modal Showcase)
  async inspectAlbum(album) {
    this.selectedAlbum = album;

    // Populate Modal UI
    document.getElementById('inspect-album-title').textContent = album.title;
    document.getElementById('inspect-artist-name').textContent = album.artist;
    document.getElementById('inspect-genre').textContent = album.genre;
    document.getElementById('inspect-year').textContent = album.year;
    document.getElementById('inspect-review-text').textContent = album.review;
    document.getElementById('track-sample-title').textContent = `🎵 ${album.sampleTrack || 'Muestra de Audio'}`;

    const caseImage = document.getElementById('inspect-case-art');
    caseImage.src = album.artwork;

    const physicalCase = document.getElementById('inspect-physical-case');
    const formatPill = document.getElementById('inspect-format-pill');
    const discEl = document.getElementById('inspect-compact-disc');

    // Adapt Walkman vs Discman Branding & Mode
    if (album.format === 'cassette') {
      physicalCase.className = 'physical-case format-cassette';
      formatPill.className = 'format-pill pill-cassette';
      formatPill.textContent = '📼 CASSETTE VINTAGE';
      discEl.style.display = 'none';

      this.deviceModelBadge.textContent = 'WALKMAN WM-EX1 • AUTO REVERSE';
      this.lcdModeText.textContent = 'TAPE 1';
    } else {
      physicalCase.className = 'physical-case format-cd';
      formatPill.className = 'format-pill pill-cd';
      formatPill.textContent = '💿 COMPACT DISC';
      discEl.style.display = 'block';

      this.deviceModelBadge.textContent = 'DISCMAN D-E305 • ESP DIGITAL AUDIO';
      this.lcdModeText.textContent = 'CD-DA 01';
    }

    // External Streaming Search Links
    const encodedQuery = encodeURIComponent(`${album.artist} ${album.title}`);
    document.getElementById('link-spotify').href = `https://open.spotify.com/search/${encodedQuery}`;
    document.getElementById('link-apple').href = `https://music.apple.com/us/search?term=${encodedQuery}`;
    document.getElementById('link-youtube').href = `https://www.youtube.com/results?search_query=${encodedQuery}`;

    // Reset Audio Player
    this.stopAudioPreview();
    if (album.previewUrl) {
      this.audioElement.src = album.previewUrl;
      document.getElementById('preview-status-text').textContent = 'Pulsa PLAY para escuchar muestra (30s)';
      this.playPauseBtn.disabled = false;
      this.playPauseBtn.style.opacity = '1';
    } else {
      document.getElementById('preview-status-text').textContent = 'Escucha el álbum completo con los enlaces directos';
      this.playPauseBtn.disabled = true;
      this.playPauseBtn.style.opacity = '0.4';
    }

    this.switchScene('inspect');
  }

  // Audio Preview Controls
  toggleAudioPreview() {
    if (!this.selectedAlbum || !this.selectedAlbum.previewUrl) return;

    if (this.isPlayingAudio) {
      this.audioElement.pause();
      this.isPlayingAudio = false;
      this.playPauseBtn.querySelector('.deck-key').textContent = '▶';
      this.playPauseBtn.querySelector('.deck-label').textContent = 'PLAY';
      this.lcdModeText.textContent = 'PAUSE';
      this.statusLedDot.classList.remove('playing');
      this.setReelsSpinning(false);
      this.stopVuMeterAnimation();
      document.getElementById('preview-status-text').textContent = 'Pausado';
    } else {
      this.audioElement.play().then(() => {
        this.isPlayingAudio = true;
        this.playPauseBtn.querySelector('.deck-key').textContent = '⏸';
        this.playPauseBtn.querySelector('.deck-label').textContent = 'PAUSE';
        this.lcdModeText.textContent = 'PLAY';
        this.statusLedDot.classList.add('playing');
        this.setReelsSpinning(true);
        this.startVuMeterAnimation();
        document.getElementById('preview-status-text').textContent = 'Reproduciendo en auriculares (30s)...';
      }).catch(err => {
        console.warn('Autoplay prevented or audio load error:', err);
      });
    }
  }

  stopAudioPreview() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.isPlayingAudio = false;
    this.playPauseBtn.querySelector('.deck-key').textContent = '▶';
    this.playPauseBtn.querySelector('.deck-label').textContent = 'PLAY';
    this.lcdModeText.textContent = 'STOP';
    this.statusLedDot.classList.remove('playing');
    this.setReelsSpinning(false);
    this.stopVuMeterAnimation();
    document.getElementById('player-progress-bar').style.width = '0%';
    document.getElementById('player-time-badge').textContent = '00:00';
    document.getElementById('preview-status-text').textContent = 'Detenido';
  }

  updateAudioProgress() {
    if (!this.audioElement.duration) return;
    const current = this.audioElement.currentTime;
    const dur = this.audioElement.duration;
    const pct = (current / dur) * 100;
    document.getElementById('player-progress-bar').style.width = `${pct}%`;

    const mins = Math.floor(current / 60);
    const secs = Math.floor(current % 60).toString().padStart(2, '0');
    document.getElementById('player-time-badge').textContent = `0${mins}:${secs}`;
  }

  onAudioEnded() {
    this.isPlayingAudio = false;
    this.playPauseBtn.querySelector('.deck-key').textContent = '▶';
    this.playPauseBtn.querySelector('.deck-label').textContent = 'PLAY';
    this.lcdModeText.textContent = 'END';
    this.statusLedDot.classList.remove('playing');
    this.setReelsSpinning(false);
    this.stopVuMeterAnimation();
    document.getElementById('player-progress-bar').style.width = '100%';
    document.getElementById('preview-status-text').textContent = 'Fin de la cinta (¿te gustó? búscala en Spotify)';
  }

  // Realistic Equalizer Spectrum Animation
  startVuMeterAnimation() {
    this.stopVuMeterAnimation();
    this.vuInterval = setInterval(() => {
      this.vuFills.forEach((bar, idx) => {
        const rand = 20 + Math.random() * 75;
        bar.style.height = `${rand}%`;
      });
    }, 120);
  }

  stopVuMeterAnimation() {
    if (this.vuInterval) {
      clearInterval(this.vuInterval);
      this.vuInterval = null;
    }
    this.vuFills.forEach(bar => {
      bar.style.height = '15%';
    });
  }

  setReelsSpinning(isSpinning) {
    const disc = document.getElementById('inspect-compact-disc');
    const spools = document.querySelectorAll('.cassette-spool');

    if (isSpinning) {
      disc.classList.add('spinning');
      spools.forEach(s => s.classList.add('spinning'));
    } else {
      disc.classList.remove('spinning');
      spools.forEach(s => s.classList.remove('spinning'));
    }
  }

  closeInspect() {
    this.stopAudioPreview();
    sounds.playSwoosh();
    this.switchScene('crate');
  }

  showLoading(show, message = "Cargando...") {
    if (show) {
      document.getElementById('loading-text').textContent = message;
      this.loadingIndicator.classList.add('visible');
    } else {
      this.loadingIndicator.classList.remove('visible');
    }
  }
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new RecordStoreApp();
});
