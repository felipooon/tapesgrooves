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
  "rock": [
    "Nirvana",
    "Radiohead",
    "Pink Floyd",
    "Led Zeppelin",
    "The Beatles",
    "Queen",
    "David Bowie",
    "The Rolling Stones",
    "The Doors",
    "Fleetwood Mac",
    "The Clash",
    "The Smiths",
    "Joy Division",
    "The Cure",
    "Pixies",
    "Smashing Pumpkins",
    "R.E.M.",
    "Oasis",
    "Blur",
    "Arctic Monkeys",
    "Foo Fighters",
    "Red Hot Chili Peppers",
    "Deep Purple",
    "The Police",
    "Dire Straits",
    "U2",
    "Jimi Hendrix",
    "The Who",
    "King Crimson",
    "Soundgarden",
    "Alice in Chains",
    "Pearl Jam",
    "Audioslave",
    "The Strokes",
    "Interpol",
    "Rush",
    "Yes",
    "Genesis",
    "Cream",
    "The Velvet Underground",
    "Neil Young",
    "The Kinks",
    "Black Rebel Motorcycle Club",
    "Queens of the Stone Age",
    "White Stripes",
    "Franz Ferdinand",
    "Weezer",
    "Sonic Youth",
    "Jane's Addiction",
    "Faith No More",
    "Rage Against the Machine",
    "The Black Keys",
    "Muse",
    "Kasabian",
    "Pavement",
    "Pulp",
    "Suede",
    "The Killers",
    "The White Stripes",
    "Yeah Yeah Yeahs",
    "Bloc Party",
    "Foals",
    "The Libertines",
    "Television",
    "Talking Heads",
    "Gang of Four",
    "Wire",
    "Echo & the Bunnymen",
    "Siouxsie and the Banshees",
    "Bauhaus",
    "New Order",
    "Cocteau Twins",
    "Slowdive",
    "My Bloody Valentine",
    "Ride",
    "Lush",
    "The Jesus and Mary Chain",
    "Primal Scream",
    "The Stone Roses",
    "Happy Mondays",
    "The Charlatans",
    "Supergrass",
    "Manic Street Preachers",
    "Placebo",
    "The Verve",
    "Stereophonics",
    "Travis",
    "Coldplay",
    "Feeder",
    "Doves",
    "Elbow",
    "Kaiser Chiefs",
    "The Fratellis",
    "The Wombats",
    "The Kooks",
    "Razorlight",
    "The Subways",
    "The Vines",
    "The Hives",
    "The Datsuns",
    "Jet",
    "Wolfmother",
    "Silverchair",
    "Bush",
    "Stone Temple Pilots",
    "Temple of the Dog",
    "Mad Season",
    "Screaming Trees",
    "Mudhoney",
    "L7",
    "Babes in Toyland",
    "Hole",
    "Garbage",
    "No Doubt",
    "Skunk Anansie",
    "Guano Apes",
    "The Cranberries",
    "Alanis Morissette",
    "Patti Smith",
    "PJ Harvey",
    "Tori Amos",
    "Fiona Apple",
    "Liz Phair",
    "Courtney Barnett",
    "St. Vincent",
    "Sleater-Kinney",
    "Bikini Kill",
    "Le Tigre",
    "The Breeders",
    "Veruca Salt",
    "Dinosaur Jr.",
    "Meat Puppets",
    "Husker Du",
    "Minutemen",
    "Fugazi",
    "Rites of Spring",
    "Drive Like Jehu",
    "Jawbreaker",
    "Sunny Day Real Estate",
    "Jimmy Eat World",
    "American Football",
    "Modest Mouse",
    "Built to Spill",
    "Guided by Voices",
    "Neutral Milk Hotel",
    "Yo La Tengo",
    "Spiritualized",
    "The Brian Jonestown Massacre",
    "The Dandy Warhols",
    "The Black Angels",
    "King Gizzard & The Lizard Wizard",
    "Thee Oh Sees",
    "Ty Segall",
    "Fuzz",
    "Wand",
    "Allman Brothers Band",
    "Lynyrd Skynyrd",
    "Creedence Clearwater Revival",
    "The Band",
    "Crosby Stills Nash & Young",
    "Buffalo Springfield",
    "The Byrds",
    "Love",
    "Jefferson Airplane",
    "Janis Joplin",
    "Big Brother and the Holding Company",
    "Ten Years After",
    "Free",
    "Bad Company",
    "Foghat",
    "Grand Funk Railroad",
    "Mountain",
    "Blue Oyster Cult",
    "Thin Lizzy",
    "Wishbone Ash",
    "Uriah Heep",
    "Hawkwind",
    "UFO",
    "Scorpions",
    "Rainbow",
    "Whitesnake",
    "Def Leppard",
    "Boston",
    "Foreigner",
    "Journey",
    "Kansas",
    "Styx",
    "REO Speedwagon",
    "Cheap Trick",
    "Heart",
    "Pat Benatar",
    "Joan Jett",
    "Arcade Fire",
    "Kings of Leon",
    "Spoon",
    "Phoenix",
    "Death Cab for Cutie",
    "The Shins",
    "Bright Eyes",
    "The Darkness",
    "Silversun Pickups",
    "Tame Impala",
    "The War on Drugs",
    "Alabama Shakes",
    "Royal Blood",
    "Nothing But Thieves",
    "Mac DeMarco",
    "Parquet Courts",
    "Car Seat Headrest",
    "Alvvays",
    "Japanese Breakfast",
    "Mitski",
    "Big Thief",
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
    "Babasonicos",
    "Jorge Drexler",
    "Mon Laferte",
    "Los Bunkers",
    "Illya Kuryaki and the Valderramas",
    "Seru Giran",
    "Pappo",
    "Rata Blanca",
    "El Cuarteto de Nos",
    "Aterciopelados",
    "Santana",
    "Spinetta Jade",
    "Invisible Spinetta",
    "Mercedes Sosa",
    "Silvio Rodriguez",
    "Buena Vista Social Club",
    "Los Jaivas",
    "Lucybell",
    "Javier Calamaro",
    "Attaque 77",
    "La Renga",
    "Divididos",
    "Bersuit Vergarabat",
    "Mano Negra",
    "Plastilina Mosh",
    "Control Machete",
    "Zoe",
    "Mikel Erentxun",
    "Duncan Dhu",
    "Radio Futura",
    "Nacha Pop",
    "Los Secretos",
    "Hombres G",
    "El Ultimo de la Fila",
    "Manolo Garcia",
    "Jarabe de Palo",
    "La Union",
    "Mecano",
    "Amaral",
    "Los Planetas",
    "Vetusta Morla",
    "Love of Lesbian",
    "Dorian",
    "Leiva",
    "Bunbury",
    "Calamaro",
    "Kany Garcia",
    "Cultura Profetica",
    "Los Amigos Invisibles",
    "Desorden Publico",
    "Caramelos de Cianuro",
    "La Gusana Ciega",
    "Fobia",
    "Jumbo",
    "Kinky",
    "DLD",
    "Porter",
    "Hello Seahorse!",
    "Enjambre",
    "Siddhartha",
    "Little Jesus",
    "Reyno",
    "Camilo Septimo",
    "Los Mesoneros",
    "Bandalos Chinos",
    "Conociendo Rusia",
    "El Mato a un Policia Motorizado",
    "Usted Señalemelo",
    "Las Ligas Menores",
    "Bestia Bebe",
    "Los Espiritus",
    "La Maquina de Hacer Pajaros",
    "Vox Dei",
    "Almendra",
    "Manal",
    "Color Humano",
    "Aquelarre",
    "Crucis",
    "Mia",
    "La Portuaria",
    "Los Pericos",
    "Los Autenticos Decadentes",
    "Kapanga",
    "Catupecu Machu",
    "Massacre",
    "Carajo",
    "Cabezones",
    "Santos Inocentes",
    "Juana La Loca",
    "Suarez",
    "Electrodomesticos",
    "Congreso",
    "Aguaturbia",
    "Los Blops",
    "Sol y Lluvia",
    "Schwenke & Nilo",
    "Weichafe",
    "Chancho en Piedra",
    "Tiro de Gracia",
    "Makiza",
    "Gondwana",
    "Saiko",
    "Gepe",
    "Javiera Mena",
    "Alex Anwandter",
    "Pedropiedra",
    "Ases Falsos",
    "Denise Rosenthal",
    "Chico Trujillo",
    "Santaferia",
    "La Floripondio",
    "Moral Distraida",
    "Manuel Garcia",
    "Violeta Parra",
    "Victor Jara",
    "Inti-Illimani",
    "Quilapayun",
    "Patricio Manns",
    "Julieta Venegas",
    "Miranda!",
    "Calle 13",
    "Austin TV",
    "La Vela Puerca",
    "No Te Va Gustar",
    "Natalia Lafourcade",
    "Rosalia",
    "C. Tangana",
    "Centavrvs",
    "Clubz",
    "Caloncho",
    "Juan Pablo Vega",
    "Elsa y Elmar",
    "Esteman",
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
    "Emilia"
  ],
  "synth": [
    "Michael Jackson",
    "Prince",
    "Madonna",
    "Depeche Mode",
    "New Order",
    "Tears For Fears",
    "Duran Duran",
    "The Human League",
    "A-ha",
    "Pet Shop Boys",
    "Wham",
    "George Michael",
    "Cyndi Lauper",
    "Whitney Houston",
    "Eurythmics",
    "Talking Heads",
    "Blondie",
    "Daft Punk",
    "Kavinsky",
    "The Weeknd",
    "Giorgio Moroder",
    "Bee Gees",
    "ABBA",
    "Donna Summer",
    "Earth Wind & Fire",
    "Chic",
    "Kool & The Gang",
    "Rick James",
    "Steely Dan",
    "Hall & Oates",
    "Kraftwerk",
    "Gary Numan",
    "Orchestral Manoeuvres in the Dark",
    "Simple Minds",
    "Ultravox",
    "Spandau Ballet",
    "Thompson Twins",
    "Modern Talking",
    "Erasure",
    "Soft Cell",
    "Alphaville",
    "Bronski Beat",
    "Dead or Alive",
    "Boy George",
    "Culture Club",
    "Talk Talk",
    "INXS",
    "Heaven 17",
    "Blancmange",
    "Visage",
    "Yazoo",
    "Yello",
    "Art of Noise",
    "Propaganda",
    "Frankie Goes to Hollywood",
    "The Buggles",
    "Kim Wilde",
    "Nik Kershaw",
    "Howard Jones",
    "Belinda Carlisle",
    "Rick Astley",
    "Kylie Minogue",
    "Samantha Fox",
    "Bananarama",
    "Sandra",
    "C.C. Catch",
    "Bad Boys Blue",
    "Fancy",
    "Silent Circle",
    "Gazebo",
    "Baltimora",
    "Ken Laszlo",
    "Den Harrow",
    "Radiorama",
    "Scotch",
    "Sabrina",
    "Mitch Murder",
    "Lazerhawk",
    "Com Truise",
    "Miami Nights 1984",
    "Timecop1983",
    "The Midnight",
    "Gunship",
    "FM-84",
    "Carpenter Brut",
    "Perturbator",
    "Dance With the Dead",
    "Dynatron",
    "Trevor Something",
    "College",
    "Electric Youth",
    "Desire",
    "Chromatics",
    "Glass Candy",
    "Ladytron",
    "Goldfrapp",
    "Roisin Murphy",
    "Moloko",
    "La Roux",
    "Chvrches",
    "Empire of the Sun",
    "Justice",
    "LCD Soundsystem",
    "Phoenix",
    "Cut Copy",
    "Passion Pit",
    "Hot Chip",
    "Robyn",
    "CSS",
    "Chromeo",
    "Crystal Castles",
    "Klaxons",
    "Dua Lipa",
    "Lorde",
    "Charli XCX",
    "Grimes",
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
    "Amy Winehouse",
    "Norah Jones",
    "Erykah Badu",
    "D'Angelo",
    "Lauryn Hill",
    "B.B. King",
    "Muddy Waters",
    "Kamasi Washington",
    "Robert Glasper",
    "Stan Getz",
    "Wayne Shorter",
    "Lee Morgan",
    "Grant Green",
    "Dexter Gordon",
    "Sonny Rollins",
    "Cannonball Adderley",
    "Art Blakey",
    "McCoy Tyner",
    "Wes Montgomery",
    "Oscar Peterson",
    "Sarah Vaughan",
    "Al Green",
    "Curtis Mayfield",
    "Donny Hathaway",
    "Duke Ellington",
    "Count Basie",
    "Charlie Parker",
    "Dizzy Gillespie",
    "Bud Powell",
    "Clifford Brown",
    "Max Roach",
    "Horace Silver",
    "Freddie Hubbard",
    "Joe Henderson",
    "Woody Shaw",
    "Donald Byrd",
    "Kenny Burrell",
    "Jimmy Smith",
    "Stanley Turrentine",
    "Bobby Hutcherson",
    "Jackie McLean",
    "Hank Mobley",
    "Gerry Mulligan",
    "Paul Desmond",
    "Stan Kenton",
    "Gil Evans",
    "Sun Ra",
    "Pharoah Sanders",
    "Alice Coltrane",
    "Ornette Coleman",
    "Albert Ayler",
    "Don Cherry",
    "Archie Shepp",
    "Cecil Taylor",
    "Weather Report",
    "Return to Forever",
    "Mahavishnu Orchestra",
    "Chick Corea",
    "Al Di Meola",
    "John McLaughlin",
    "Pat Metheny",
    "Jaco Pastorius",
    "Michael Brecker",
    "Steps Ahead",
    "Roy Hargrove",
    "Christian McBride",
    "Brad Mehldau",
    "Esperanza Spalding",
    "Snarky Puppy",
    "Hiatus Kaiyote",
    "Yussef Dayes",
    "Alfa Mist",
    "Nubya Garcia",
    "Shabaka Hutchings",
    "Moses Boyd",
    "Kokoroko",
    "Ezra Collective",
    "GoGo Penguin",
    "BADBADNOTGOOD",
    "Jill Scott",
    "Anthony Hamilton",
    "John Legend",
    "Sharon Jones & the Dap-Kings",
    "Jamie Cullum",
    "Corinne Bailey Rae",
    "Ledisi",
    "Bilal",
    "Thundercat",
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
    "Laufey",
    "Olivia Dean",
    "Arlo Parks",
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
    "Justice",
    "Kraftwerk",
    "Daft Punk",
    "Four Tet",
    "Burial",
    "Bonobo",
    "Bicep",
    "Caribou",
    "Laurent Garnier",
    "Squarepusher",
    "Royksopp",
    "Air",
    "Morcheeba",
    "Zero 7",
    "Thievery Corporation",
    "Faithless",
    "Orbital",
    "Leftfield",
    "Groove Armada",
    "DJ Shadow",
    "Nightmares on Wax",
    "Kruder & Dorfmeister",
    "Tycho",
    "Jon Hopkins",
    "Moderat",
    "Apparat",
    "Modeselektor",
    "Nicolas Jaar",
    "Darkside",
    "Floating Points",
    "Mount Kimbie",
    "Kieran Hebden",
    "Jamie xx",
    "The xx",
    "Maribou State",
    "Ross from Friends",
    "DJ Seinfeld",
    "Mall Grab",
    "Peggy Gou",
    "Overmono",
    "Fred again..",
    "Paul Kalkbrenner",
    "Booka Shade",
    "Trentemoller",
    "Gui Boratto",
    "Stephan Bodzin",
    "Tale of Us",
    "Mind Against",
    "Maceo Plex",
    "Solomun",
    "Sven Vath",
    "Richie Hawtin",
    "Carl Cox",
    "Jeff Mills",
    "Derrick May",
    "Juan Atkins",
    "Kevin Saunderson",
    "Robert Hood",
    "Basic Channel",
    "Deepchord",
    "Gas",
    "The Orb",
    "Future Sound of London",
    "Shpongle",
    "Infected Mushroom",
    "Hallucinogen",
    "Ott",
    "Carbon Based Lifeforms",
    "Solar Fields",
    "St Germain",
    "Gotan Project",
    "Wax Poetic",
    "Tosca",
    "Peace Orchestra",
    "Fila Brazillia",
    "Digitalism",
    "Simian Mobile Disco",
    "Boys Noize",
    "Disclosure",
    "Flume",
    "KAYTRANADA",
    "Rufus Du Sol",
    "ODESZA",
    "Lane 8",
    "Kiasmos",
    "Tourist",
    "George FitzGerald",
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
    "Eminem",
    "Jay-Z",
    "MF DOOM",
    "Kendrick Lamar",
    "J Dilla",
    "Cypress Hill",
    "The Fugees",
    "Beastie Boys",
    "Lauryn Hill",
    "Mos Def",
    "Public Enemy",
    "De La Soul",
    "Common",
    "Slick Rick",
    "Big L",
    "N.W.A.",
    "Rakim",
    "KRS-One",
    "Mobb Deep",
    "Gang Starr",
    "Method Man",
    "Ghostface Killah",
    "Busta Rhymes",
    "Ice Cube",
    "The Roots",
    "Digable Planets",
    "Souls of Mischief",
    "Talib Kweli",
    "Black Star",
    "Raekwon",
    "GZA",
    "Ol Dirty Bastard",
    "Redman",
    "Pete Rock & C.L. Smooth",
    "Big Daddy Kane",
    "EPMD",
    "Eric B. & Rakim",
    "Boogie Down Productions",
    "Brand Nubian",
    "Main Source",
    "Lord Finesse",
    "O.C.",
    "Showbiz & A.G.",
    "D.I.T.C.",
    "Pharoahe Monch",
    "Organized Konfusion",
    "Smif-N-Wessun",
    "Black Moon",
    "Heltah Skeltah",
    "Boot Camp Clik",
    "Jeru the Damaja",
    "Group Home",
    "Cella Dwellas",
    "Non Phixion",
    "Necro",
    "Jedi Mind Tricks",
    "Dilated Peoples",
    "Jurassic 5",
    "Blackalicious",
    "Hieroglyphics",
    "Del the Funky Homosapien",
    "Lootpack",
    "Madlib",
    "Quasimoto",
    "Freddie Gibbs",
    "Danny Brown",
    "Earl Sweatshirt",
    "Tyler, The Creator",
    "Joey Bada$$",
    "Action Bronson",
    "Roc Marciano",
    "Westside Gunn",
    "Conway the Machine",
    "Benny the Butcher",
    "Kanye West",
    "50 Cent",
    "The Game",
    "Lupe Fiasco",
    "T.I.",
    "Lil Wayne",
    "Clipse",
    "Slum Village",
    "Little Brother",
    "Drake",
    "J. Cole",
    "Travis Scott",
    "Mac Miller",
    "A$AP Rocky",
    "Childish Gambino",
    "Run The Jewels",
    "ScHoolboy Q",
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
    "Jamiroquai",
    "Maceo Parker",
    "The Bar-Kays",
    "Rufus",
    "Kassav",
    "Fela Kuti",
    "Manu Dibango",
    "William Onyeabor",
    "Tony Allen",
    "Ebo Taylor",
    "Labi Siffre",
    "Roy Ayers",
    "Donny Hathaway",
    "Gil Scott-Heron",
    "Shuggie Otis",
    "Betty Davis",
    "Marva Whitney",
    "Lyn Collins",
    "Sharon Jones & the Dap-Kings",
    "Charles Bradley",
    "Lee Fields",
    "The Budos Band",
    "Menahan Street Band",
    "El Michels Affair",
    "Orgone",
    "The New Mastersounds",
    "Monophonics",
    "Vulfpeck",
    "The Fearless Flyers",
    "Cory Wong",
    "Lettuce",
    "Galactic",
    "Dumpstaphunk",
    "Soulive",
    "Greyboy Allstars",
    "The Brand New Heavies",
    "Incognito",
    "Breakbot",
    "Chromeo",
    "Tuxedo",
    "Mayer Hawthorne",
    "Silk Sonic",
    "Bruno Mars",
    "Anderson .Paak",
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
    "Slipknot",
    "Sepultura",
    "Ghost",
    "Mastodon",
    "Gojira",
    "Sex Pistols",
    "The Ramones",
    "Bad Religion",
    "Green Day",
    "Blink-182",
    "The Offspring",
    "Tool",
    "System of a Down",
    "Deftones",
    "Korn",
    "Anthrax",
    "Avenged Sevenfold",
    "Soundgarden",
    "Alice in Chains",
    "Death",
    "Opeth",
    "Machine Head",
    "Testament",
    "Kreator",
    "Helloween",
    "Accept",
    "Saxon",
    "Mercyful Fate",
    "King Diamond",
    "Venom",
    "Celtic Frost",
    "Bathory",
    "Possessed",
    "Morbid Angel",
    "Cannibal Corpse",
    "Obituary",
    "Deicide",
    "Carcass",
    "Napalm Death",
    "At the Gates",
    "In Flames",
    "Dark Tranquillity",
    "Soilwork",
    "Arch Enemy",
    "Children of Bodom",
    "Amorphis",
    "Paradise Lost",
    "My Dying Bride",
    "Anathema",
    "Katatonia",
    "Moonspell",
    "Type O Negative",
    "Danzig",
    "Misfits",
    "Samhain",
    "Ministry",
    "Nine Inch Nails",
    "Fear Factory",
    "Static-X",
    "Rob Zombie",
    "White Zombie",
    "Prong",
    "Helmet",
    "Biohazard",
    "Madball",
    "Agnostic Front",
    "Sick of It All",
    "Hatebreed",
    "Terror",
    "Converge",
    "The Dillinger Escape Plan",
    "Botch",
    "Neurosis",
    "Isis",
    "Cult of Luna",
    "Lamb of God",
    "Killswitch Engage",
    "Trivium",
    "Bullet for My Valentine",
    "Meshuggah",
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
    "Cultura Profetica",
    "Gondwana",
    "Steel Pulse",
    "Dennis Brown",
    "Gregory Isaacs",
    "Max Romeo",
    "Horace Andy",
    "Bitty McLean",
    "Alborosie",
    "Chronixx",
    "Damian Marley",
    "Third World",
    "Yellowman",
    "Jacob Miller",
    "Israel Vibration",
    "Augustus Pablo",
    "King Tubby",
    "Scientist",
    "Mad Professor",
    "Prince Jammy",
    "Sly & Robbie",
    "The Congos",
    "The Abyssinians",
    "The Gladiators",
    "Culture",
    "Mighty Diamonds",
    "Wailing Souls",
    "The Heptones",
    "The Paragons",
    "Alton Ellis",
    "Ken Boothe",
    "John Holt",
    "Delroy Wilson",
    "Sugar Minott",
    "Barrington Levy",
    "Frankie Paul",
    "Half Pint",
    "Tenor Saw",
    "Super Cat",
    "Buju Banton",
    "Capleton",
    "Sizzla",
    "Anthony B",
    "Protoje",
    "Kabaka Pyramid",
    "Koffee",
    "Stephen Marley",
    "Gentleman",
    "SOJA",
    "Rebelution",
    "Fat Freddy's Drop",
    "The Black Seeds",
    "Collie Buddz",
    "Los Cafres",
    "Dread Mar I",
    "Jesse Royal",
    "Sticky Fingers",
    "Ocean Alley",
    "Stick Figure",
    "Iration",
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
    "Tame Impala",
    "Khruangbin",
    "Men I Trust",
    "Mac DeMarco",
    "Unknown Mortal Orchestra",
    "Mild High Club",
    "Ginger Root",
    "Cortex",
    "T-Square",
    "Junko Ohashi",
    "Minako Yoshida",
    "Meiko Nakahara",
    "Kiyotaka Sugiyama",
    "Omega Tribe",
    "Yellow Magic Orchestra",
    "Haruomi Hosono",
    "Ryuichi Sakamoto",
    "Masayoshi Takanaka",
    "Yukihiro Takahashi",
    "Akiko Yano",
    "EPO",
    "Hitomi Tohyama",
    "Cindy",
    "Tomoko Aran",
    "Yasuha",
    "Chika Asamoto",
    "Piper",
    "Pacific Breeze",
    "Hiroshi Sato",
    "Makoto Matsushita",
    "Noriki",
    "Ken Muramatsu",
    "Jiro Inagaki",
    "Ryo Kawasaki",
    "Kazumi Watanabe",
    "BOY PABLO",
    "Cuco",
    "Crumb",
    "Homeshake",
    "Sunset Rollercoaster",
    "Phum Viphurit",
    "HYUKOH",
    "SE SO NEON",
    "ADOY",
    "Yogee New Waves",
    "Never Young Beach",
    "Suchmos",
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
    "Kings of Convenience",
    "Nick Drake",
    "Nara Leao",
    "Chico Buarque",
    "Jorge Ben Jor",
    "Milton Nascimento",
    "Marcos Valle",
    "Toquinho",
    "Maria Bethania",
    "Edu Lobo",
    "Sergio Mendes",
    "Seu Jorge",
    "Bebel Gilberto",
    "Lucas Arruda",
    "Dorival Caymmi",
    "Ary Barroso",
    "Luiz Bonfa",
    "Bola Sete",
    "Rosinha de Valenca",
    "Tamba Trio",
    "Zimbo Trio",
    "Os Cariocas",
    "Quarteto em Cy",
    "Wilson Simonal",
    "Elza Soares",
    "Clara Nunes",
    "Beth Carvalho",
    "Cartola",
    "Nelson Cavaquinho",
    "Paulinho da Viola",
    "Martinho da Vila",
    "Joao Bosco",
    "Djavan",
    "Ivan Lins",
    "Gonzaguinha",
    "Alceu Valenca",
    "Geraldo Azevedo",
    "Ze Ramalho",
    "Fagner",
    "Arthur Verocai",
    "Hermeto Pascoal",
    "Egberto Gismonti",
    "Naná Vasconcelos",
    "Airto Moreira",
    "Ceu",
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
  ],
  "all": [
    "Nirvana",
    "Radiohead",
    "Pink Floyd",
    "Led Zeppelin",
    "The Beatles",
    "Queen",
    "David Bowie",
    "The Rolling Stones",
    "The Doors",
    "Fleetwood Mac",
    "The Clash",
    "The Smiths",
    "Joy Division",
    "The Cure",
    "Pixies",
    "Smashing Pumpkins",
    "R.E.M.",
    "Oasis",
    "Blur",
    "Arctic Monkeys",
    "Foo Fighters",
    "Red Hot Chili Peppers",
    "Deep Purple",
    "The Police",
    "Dire Straits",
    "U2",
    "Jimi Hendrix",
    "The Who",
    "King Crimson",
    "Soundgarden",
    "Alice in Chains",
    "Pearl Jam",
    "Audioslave",
    "The Strokes",
    "Interpol",
    "Rush",
    "Yes",
    "Genesis",
    "Cream",
    "The Velvet Underground",
    "Neil Young",
    "The Kinks",
    "Black Rebel Motorcycle Club",
    "Queens of the Stone Age",
    "White Stripes",
    "Franz Ferdinand",
    "Weezer",
    "Sonic Youth",
    "Jane's Addiction",
    "Faith No More",
    "Rage Against the Machine",
    "The Black Keys",
    "Muse",
    "Kasabian",
    "Pavement",
    "Pulp",
    "Suede",
    "The Killers",
    "The White Stripes",
    "Yeah Yeah Yeahs",
    "Bloc Party",
    "Foals",
    "The Libertines",
    "Television",
    "Talking Heads",
    "Gang of Four",
    "Wire",
    "Echo & the Bunnymen",
    "Siouxsie and the Banshees",
    "Bauhaus",
    "New Order",
    "Cocteau Twins",
    "Slowdive",
    "My Bloody Valentine",
    "Ride",
    "Lush",
    "The Jesus and Mary Chain",
    "Primal Scream",
    "The Stone Roses",
    "Happy Mondays",
    "The Charlatans",
    "Supergrass",
    "Manic Street Preachers",
    "Placebo",
    "The Verve",
    "Stereophonics",
    "Travis",
    "Coldplay",
    "Feeder",
    "Doves",
    "Elbow",
    "Kaiser Chiefs",
    "The Fratellis",
    "The Wombats",
    "The Kooks",
    "Razorlight",
    "The Subways",
    "The Vines",
    "The Hives",
    "The Datsuns",
    "Jet",
    "Wolfmother",
    "Silverchair",
    "Bush",
    "Stone Temple Pilots",
    "Temple of the Dog",
    "Mad Season",
    "Screaming Trees",
    "Mudhoney",
    "L7",
    "Babes in Toyland",
    "Hole",
    "Garbage",
    "No Doubt",
    "Skunk Anansie",
    "Guano Apes",
    "The Cranberries",
    "Alanis Morissette",
    "Patti Smith",
    "PJ Harvey",
    "Tori Amos",
    "Fiona Apple",
    "Liz Phair",
    "Courtney Barnett",
    "St. Vincent",
    "Sleater-Kinney",
    "Bikini Kill",
    "Le Tigre",
    "The Breeders",
    "Veruca Salt",
    "Dinosaur Jr.",
    "Meat Puppets",
    "Husker Du",
    "Minutemen",
    "Fugazi",
    "Rites of Spring",
    "Drive Like Jehu",
    "Jawbreaker",
    "Sunny Day Real Estate",
    "Jimmy Eat World",
    "American Football",
    "Modest Mouse",
    "Built to Spill",
    "Guided by Voices",
    "Neutral Milk Hotel",
    "Yo La Tengo",
    "Spiritualized",
    "The Brian Jonestown Massacre",
    "The Dandy Warhols",
    "The Black Angels",
    "King Gizzard & The Lizard Wizard",
    "Thee Oh Sees",
    "Ty Segall",
    "Fuzz",
    "Wand",
    "Allman Brothers Band",
    "Lynyrd Skynyrd",
    "Creedence Clearwater Revival",
    "The Band",
    "Crosby Stills Nash & Young",
    "Buffalo Springfield",
    "The Byrds",
    "Love",
    "Jefferson Airplane",
    "Janis Joplin",
    "Big Brother and the Holding Company",
    "Ten Years After",
    "Free",
    "Bad Company",
    "Foghat",
    "Grand Funk Railroad",
    "Mountain",
    "Blue Oyster Cult",
    "Thin Lizzy",
    "Wishbone Ash",
    "Uriah Heep",
    "Hawkwind",
    "UFO",
    "Scorpions",
    "Rainbow",
    "Whitesnake",
    "Def Leppard",
    "Boston",
    "Foreigner",
    "Journey",
    "Kansas",
    "Styx",
    "REO Speedwagon",
    "Cheap Trick",
    "Heart",
    "Pat Benatar",
    "Joan Jett",
    "Soda Stereo",
    "Gustavo Cerati",
    "Charly Garcia",
    "Fito Paez",
    "Luis Alberto Spinetta",
    "Pescado Rabioso",
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
    "Babasonicos",
    "Jorge Drexler",
    "Mon Laferte",
    "Los Bunkers",
    "Illya Kuryaki and the Valderramas",
    "Seru Giran",
    "Pappo",
    "Rata Blanca",
    "El Cuarteto de Nos",
    "Aterciopelados",
    "Santana",
    "Spinetta Jade",
    "Invisible Spinetta",
    "Mercedes Sosa",
    "Silvio Rodriguez",
    "Buena Vista Social Club",
    "Los Jaivas",
    "Lucybell",
    "Javier Calamaro",
    "Attaque 77",
    "La Renga",
    "Divididos",
    "Bersuit Vergarabat",
    "Mano Negra",
    "Plastilina Mosh",
    "Control Machete",
    "Zoe",
    "Mikel Erentxun",
    "Duncan Dhu",
    "Radio Futura",
    "Nacha Pop",
    "Los Secretos",
    "Hombres G",
    "El Ultimo de la Fila",
    "Manolo Garcia",
    "Jarabe de Palo",
    "La Union",
    "Mecano",
    "Amaral",
    "Los Planetas",
    "Vetusta Morla",
    "Love of Lesbian",
    "Dorian",
    "Leiva",
    "Bunbury",
    "Calamaro",
    "Kany Garcia",
    "Cultura Profetica",
    "Los Amigos Invisibles",
    "Desorden Publico",
    "Caramelos de Cianuro",
    "La Gusana Ciega",
    "Fobia",
    "Jumbo",
    "Kinky",
    "DLD",
    "Porter",
    "Hello Seahorse!",
    "Enjambre",
    "Siddhartha",
    "Little Jesus",
    "Reyno",
    "Camilo Septimo",
    "Los Mesoneros",
    "Bandalos Chinos",
    "Conociendo Rusia",
    "El Mato a un Policia Motorizado",
    "Usted Señalemelo",
    "Las Ligas Menores",
    "Bestia Bebe",
    "Los Espiritus",
    "La Maquina de Hacer Pajaros",
    "Vox Dei",
    "Almendra",
    "Manal",
    "Color Humano",
    "Aquelarre",
    "Crucis",
    "Mia",
    "La Portuaria",
    "Los Pericos",
    "Los Autenticos Decadentes",
    "Kapanga",
    "Catupecu Machu",
    "Massacre",
    "Carajo",
    "Cabezones",
    "Santos Inocentes",
    "Juana La Loca",
    "Suarez",
    "Electrodomesticos",
    "Congreso",
    "Aguaturbia",
    "Los Blops",
    "Sol y Lluvia",
    "Schwenke & Nilo",
    "Weichafe",
    "Chancho en Piedra",
    "Tiro de Gracia",
    "Makiza",
    "Gondwana",
    "Saiko",
    "Gepe",
    "Javiera Mena",
    "Alex Anwandter",
    "Pedropiedra",
    "Ases Falsos",
    "Denise Rosenthal",
    "Chico Trujillo",
    "Santaferia",
    "La Floripondio",
    "Moral Distraida",
    "Manuel Garcia",
    "Violeta Parra",
    "Victor Jara",
    "Inti-Illimani",
    "Quilapayun",
    "Patricio Manns",
    "Michael Jackson",
    "Prince",
    "Madonna",
    "Depeche Mode",
    "Tears For Fears",
    "Duran Duran",
    "The Human League",
    "A-ha",
    "Pet Shop Boys",
    "Wham",
    "George Michael",
    "Cyndi Lauper",
    "Whitney Houston",
    "Eurythmics",
    "Blondie",
    "Daft Punk",
    "Kavinsky",
    "The Weeknd",
    "Giorgio Moroder",
    "Bee Gees",
    "ABBA",
    "Donna Summer",
    "Earth Wind & Fire",
    "Chic",
    "Kool & The Gang",
    "Rick James",
    "Steely Dan",
    "Hall & Oates",
    "Kraftwerk",
    "Gary Numan",
    "Orchestral Manoeuvres in the Dark",
    "Simple Minds",
    "Ultravox",
    "Spandau Ballet",
    "Thompson Twins",
    "Modern Talking",
    "Erasure",
    "Soft Cell",
    "Alphaville",
    "Bronski Beat",
    "Dead or Alive",
    "Boy George",
    "Culture Club",
    "Talk Talk",
    "INXS",
    "Heaven 17",
    "Blancmange",
    "Visage",
    "Yazoo",
    "Yello",
    "Art of Noise",
    "Propaganda",
    "Frankie Goes to Hollywood",
    "The Buggles",
    "Kim Wilde",
    "Nik Kershaw",
    "Howard Jones",
    "Belinda Carlisle",
    "Rick Astley",
    "Kylie Minogue",
    "Samantha Fox",
    "Bananarama",
    "Sandra",
    "C.C. Catch",
    "Bad Boys Blue",
    "Fancy",
    "Silent Circle",
    "Gazebo",
    "Baltimora",
    "Ken Laszlo",
    "Den Harrow",
    "Radiorama",
    "Scotch",
    "Sabrina",
    "Mitch Murder",
    "Lazerhawk",
    "Com Truise",
    "Miami Nights 1984",
    "Timecop1983",
    "The Midnight",
    "Gunship",
    "FM-84",
    "Carpenter Brut",
    "Perturbator",
    "Dance With the Dead",
    "Dynatron",
    "Trevor Something",
    "College",
    "Electric Youth",
    "Desire",
    "Chromatics",
    "Glass Candy",
    "Ladytron",
    "Goldfrapp",
    "Roisin Murphy",
    "Moloko",
    "La Roux",
    "Chvrches",
    "Empire of the Sun",
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
    "Amy Winehouse",
    "Norah Jones",
    "Erykah Badu",
    "D'Angelo",
    "Lauryn Hill",
    "B.B. King",
    "Muddy Waters",
    "Kamasi Washington",
    "Robert Glasper",
    "Stan Getz",
    "Wayne Shorter",
    "Lee Morgan",
    "Grant Green",
    "Dexter Gordon",
    "Sonny Rollins",
    "Cannonball Adderley",
    "Art Blakey",
    "McCoy Tyner",
    "Wes Montgomery",
    "Oscar Peterson",
    "Sarah Vaughan",
    "Al Green",
    "Curtis Mayfield",
    "Donny Hathaway",
    "Duke Ellington",
    "Count Basie",
    "Charlie Parker",
    "Dizzy Gillespie",
    "Bud Powell",
    "Clifford Brown",
    "Max Roach",
    "Horace Silver",
    "Freddie Hubbard",
    "Joe Henderson",
    "Woody Shaw",
    "Donald Byrd",
    "Kenny Burrell",
    "Jimmy Smith",
    "Stanley Turrentine",
    "Bobby Hutcherson",
    "Jackie McLean",
    "Hank Mobley",
    "Gerry Mulligan",
    "Paul Desmond",
    "Stan Kenton",
    "Gil Evans",
    "Sun Ra",
    "Pharoah Sanders",
    "Alice Coltrane",
    "Ornette Coleman",
    "Albert Ayler",
    "Don Cherry",
    "Archie Shepp",
    "Cecil Taylor",
    "Weather Report",
    "Return to Forever",
    "Mahavishnu Orchestra",
    "Chick Corea",
    "Al Di Meola",
    "John McLaughlin",
    "Pat Metheny",
    "Jaco Pastorius",
    "Michael Brecker",
    "Steps Ahead",
    "Roy Hargrove",
    "Christian McBride",
    "Brad Mehldau",
    "Esperanza Spalding",
    "Snarky Puppy",
    "Hiatus Kaiyote",
    "Yussef Dayes",
    "Alfa Mist",
    "Nubya Garcia",
    "Shabaka Hutchings",
    "Moses Boyd",
    "Kokoroko",
    "Ezra Collective",
    "GoGo Penguin",
    "BADBADNOTGOOD",
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
    "Justice",
    "Four Tet",
    "Burial",
    "Bonobo",
    "Bicep",
    "Caribou",
    "Laurent Garnier",
    "Squarepusher",
    "Royksopp",
    "Air",
    "Morcheeba",
    "Zero 7",
    "Thievery Corporation",
    "Faithless",
    "Orbital",
    "Leftfield",
    "Groove Armada",
    "DJ Shadow",
    "Nightmares on Wax",
    "Kruder & Dorfmeister",
    "Tycho",
    "Jon Hopkins",
    "Moderat",
    "Apparat",
    "Modeselektor",
    "Nicolas Jaar",
    "Darkside",
    "Floating Points",
    "Mount Kimbie",
    "Kieran Hebden",
    "Jamie xx",
    "The xx",
    "Maribou State",
    "Ross from Friends",
    "DJ Seinfeld",
    "Mall Grab",
    "Peggy Gou",
    "Overmono",
    "Fred again..",
    "Paul Kalkbrenner",
    "Booka Shade",
    "Trentemoller",
    "Gui Boratto",
    "Stephan Bodzin",
    "Tale of Us",
    "Mind Against",
    "Maceo Plex",
    "Solomun",
    "Sven Vath",
    "Richie Hawtin",
    "Carl Cox",
    "Jeff Mills",
    "Derrick May",
    "Juan Atkins",
    "Kevin Saunderson",
    "Robert Hood",
    "Basic Channel",
    "Deepchord",
    "Gas",
    "The Orb",
    "Future Sound of London",
    "Shpongle",
    "Infected Mushroom",
    "Hallucinogen",
    "Ott",
    "Carbon Based Lifeforms",
    "Solar Fields",
    "St Germain",
    "Gotan Project",
    "Wax Poetic",
    "Tosca",
    "Peace Orchestra",
    "Fila Brazillia",
    "2Pac",
    "The Notorious B.I.G.",
    "Wu-Tang Clan",
    "Nas",
    "A Tribe Called Quest",
    "Outkast",
    "Dr. Dre",
    "Snoop Dogg",
    "Eminem",
    "Jay-Z",
    "MF DOOM",
    "Kendrick Lamar",
    "J Dilla",
    "Cypress Hill",
    "The Fugees",
    "Beastie Boys",
    "Mos Def",
    "Public Enemy",
    "De La Soul",
    "Common",
    "Slick Rick",
    "Big L",
    "N.W.A.",
    "Rakim",
    "KRS-One",
    "Mobb Deep",
    "Gang Starr",
    "Method Man",
    "Ghostface Killah",
    "Busta Rhymes",
    "Ice Cube",
    "The Roots",
    "Digable Planets",
    "Souls of Mischief",
    "Talib Kweli",
    "Black Star",
    "Raekwon",
    "GZA",
    "Ol Dirty Bastard",
    "Redman",
    "Pete Rock & C.L. Smooth",
    "Big Daddy Kane",
    "EPMD",
    "Eric B. & Rakim",
    "Boogie Down Productions",
    "Brand Nubian",
    "Main Source",
    "Lord Finesse",
    "O.C.",
    "Showbiz & A.G.",
    "D.I.T.C.",
    "Pharoahe Monch",
    "Organized Konfusion",
    "Smif-N-Wessun",
    "Black Moon",
    "Heltah Skeltah",
    "Boot Camp Clik",
    "Jeru the Damaja",
    "Group Home",
    "Cella Dwellas",
    "Non Phixion",
    "Necro",
    "Jedi Mind Tricks",
    "Dilated Peoples",
    "Jurassic 5",
    "Blackalicious",
    "Hieroglyphics",
    "Del the Funky Homosapien",
    "Lootpack",
    "Madlib",
    "Quasimoto",
    "Freddie Gibbs",
    "Danny Brown",
    "Earl Sweatshirt",
    "Tyler, The Creator",
    "Joey Bada$$",
    "Action Bronson",
    "Roc Marciano",
    "Westside Gunn",
    "Conway the Machine",
    "Benny the Butcher",
    "Parliament",
    "Funkadelic",
    "James Brown",
    "Sly & The Family Stone",
    "The Gap Band",
    "George Clinton",
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
    "Jamiroquai",
    "Maceo Parker",
    "The Bar-Kays",
    "Rufus",
    "Kassav",
    "Fela Kuti",
    "Manu Dibango",
    "William Onyeabor",
    "Tony Allen",
    "Ebo Taylor",
    "Labi Siffre",
    "Roy Ayers",
    "Gil Scott-Heron",
    "Shuggie Otis",
    "Betty Davis",
    "Marva Whitney",
    "Lyn Collins",
    "Sharon Jones & the Dap-Kings",
    "Charles Bradley",
    "Lee Fields",
    "The Budos Band",
    "Menahan Street Band",
    "El Michels Affair",
    "Orgone",
    "The New Mastersounds",
    "Monophonics",
    "Vulfpeck",
    "The Fearless Flyers",
    "Cory Wong",
    "Lettuce",
    "Galactic",
    "Dumpstaphunk",
    "Soulive",
    "Greyboy Allstars",
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
    "Slipknot",
    "Sepultura",
    "Ghost",
    "Mastodon",
    "Gojira",
    "Sex Pistols",
    "The Ramones",
    "Bad Religion",
    "Green Day",
    "Blink-182",
    "The Offspring",
    "Tool",
    "System of a Down",
    "Deftones",
    "Korn",
    "Anthrax",
    "Avenged Sevenfold",
    "Death",
    "Opeth",
    "Machine Head",
    "Testament",
    "Kreator",
    "Helloween",
    "Accept",
    "Saxon",
    "Mercyful Fate",
    "King Diamond",
    "Venom",
    "Celtic Frost",
    "Bathory",
    "Possessed",
    "Morbid Angel",
    "Cannibal Corpse",
    "Obituary",
    "Deicide",
    "Carcass",
    "Napalm Death",
    "At the Gates",
    "In Flames",
    "Dark Tranquillity",
    "Soilwork",
    "Arch Enemy",
    "Children of Bodom",
    "Amorphis",
    "Paradise Lost",
    "My Dying Bride",
    "Anathema",
    "Katatonia",
    "Moonspell",
    "Type O Negative",
    "Danzig",
    "Misfits",
    "Samhain",
    "Ministry",
    "Nine Inch Nails",
    "Fear Factory",
    "Static-X",
    "Rob Zombie",
    "White Zombie",
    "Prong",
    "Helmet",
    "Biohazard",
    "Madball",
    "Agnostic Front",
    "Sick of It All",
    "Hatebreed",
    "Terror",
    "Converge",
    "The Dillinger Escape Plan",
    "Botch",
    "Neurosis",
    "Isis",
    "Cult of Luna",
    "Bob Marley",
    "Peter Tosh",
    "Jimmy Cliff",
    "Burning Spear",
    "Black Uhuru",
    "Toots and the Maytals",
    "Lee Scratch Perry",
    "Sublime",
    "Manu Chao",
    "Steel Pulse",
    "Dennis Brown",
    "Gregory Isaacs",
    "Max Romeo",
    "Horace Andy",
    "Bitty McLean",
    "Alborosie",
    "Chronixx",
    "Damian Marley",
    "Third World",
    "Yellowman",
    "Jacob Miller",
    "Israel Vibration",
    "Augustus Pablo",
    "King Tubby",
    "Scientist",
    "Mad Professor",
    "Prince Jammy",
    "Sly & Robbie",
    "The Congos",
    "The Abyssinians",
    "The Gladiators",
    "Culture",
    "Mighty Diamonds",
    "Wailing Souls",
    "The Heptones",
    "The Paragons",
    "Alton Ellis",
    "Ken Boothe",
    "John Holt",
    "Delroy Wilson",
    "Sugar Minott",
    "Barrington Levy",
    "Frankie Paul",
    "Half Pint",
    "Tenor Saw",
    "Super Cat",
    "Buju Banton",
    "Capleton",
    "Sizzla",
    "Anthony B",
    "Protoje",
    "Kabaka Pyramid",
    "Koffee",
    "Tatsuro Yamashita",
    "Mariya Takeuchi",
    "Casiopea",
    "Anri",
    "Miki Matsubara",
    "Taeko Onuki",
    "Tame Impala",
    "Khruangbin",
    "Men I Trust",
    "Mac DeMarco",
    "Unknown Mortal Orchestra",
    "Mild High Club",
    "Ginger Root",
    "Cortex",
    "T-Square",
    "Junko Ohashi",
    "Minako Yoshida",
    "Meiko Nakahara",
    "Kiyotaka Sugiyama",
    "Omega Tribe",
    "Yellow Magic Orchestra",
    "Haruomi Hosono",
    "Ryuichi Sakamoto",
    "Masayoshi Takanaka",
    "Yukihiro Takahashi",
    "Akiko Yano",
    "EPO",
    "Hitomi Tohyama",
    "Cindy",
    "Tomoko Aran",
    "Yasuha",
    "Chika Asamoto",
    "Piper",
    "Pacific Breeze",
    "Hiroshi Sato",
    "Makoto Matsushita",
    "Noriki",
    "Ken Muramatsu",
    "Jiro Inagaki",
    "Ryo Kawasaki",
    "Kazumi Watanabe",
    "BOY PABLO",
    "Cuco",
    "Crumb",
    "Homeshake",
    "Sunset Rollercoaster",
    "Phum Viphurit",
    "HYUKOH",
    "SE SO NEON",
    "ADOY",
    "Yogee New Waves",
    "Never Young Beach",
    "Suchmos",
    "Astrud Gilberto",
    "Antonio Carlos Jobim",
    "Joao Gilberto",
    "Caetano Veloso",
    "Gal Costa",
    "Gilberto Gil",
    "Vinicius de Moraes",
    "Baden Powell",
    "Elis Regina",
    "Kings of Convenience",
    "Nick Drake",
    "Nara Leao",
    "Chico Buarque",
    "Jorge Ben Jor",
    "Milton Nascimento",
    "Marcos Valle",
    "Toquinho",
    "Maria Bethania",
    "Edu Lobo",
    "Sergio Mendes",
    "Seu Jorge",
    "Bebel Gilberto",
    "Lucas Arruda",
    "Dorival Caymmi",
    "Ary Barroso",
    "Luiz Bonfa",
    "Bola Sete",
    "Rosinha de Valenca",
    "Tamba Trio",
    "Zimbo Trio",
    "Os Cariocas",
    "Quarteto em Cy",
    "Wilson Simonal",
    "Elza Soares",
    "Clara Nunes",
    "Beth Carvalho",
    "Cartola",
    "Nelson Cavaquinho",
    "Paulinho da Viola",
    "Martinho da Vila",
    "Joao Bosco",
    "Djavan",
    "Ivan Lins",
    "Gonzaguinha",
    "Alceu Valenca",
    "Geraldo Azevedo",
    "Ze Ramalho",
    "Fagner",
    "Arthur Verocai",
    "Hermeto Pascoal",
    "Egberto Gismonti",
    "Naná Vasconcelos",
    "Airto Moreira",
    "Arcade Fire",
    "Kanye West",
    "Kings of Leon",
    "Phoenix",
    "Death Cab for Cutie",
    "LCD Soundsystem",
    "MGMT",
    "Cut Copy",
    "Passion Pit",
    "Julieta Venegas",
    "Miranda!",
    "John Legend",
    "Jamie Cullum",
    "Frank Ocean",
    "Mac Miller",
    "Travis Scott",
    "Drake",
    "J. Cole",
    "Dua Lipa",
    "Lorde",
    "Charli XCX",
    "Grimes",
    "Foster the People",
    "Bleachers",
    "SZA",
    "Daniel Caesar",
    "Leon Bridges",
    "Michael Kiwanuka",
    "Thundercat",
    "Childish Gambino",
    "Run The Jewels",
    "A$AP Rocky",
    "Denzel Curry",
    "JID",
    "Little Simz",
    "The War on Drugs",
    "Royal Blood",
    "Nothing But Thieves",
    "Alvvays",
    "Japanese Breakfast",
    "Mitski",
    "Big Thief",
    "IDLES",
    "Fontaines D.C.",
    "Shame",
    "Greta Van Fleet",
    "Bring Me The Horizon",
    "Disclosure",
    "KAYTRANADA",
    "Flume",
    "Rufus Du Sol",
    "ODESZA",
    "Natalia Lafourcade",
    "Rosalia",
    "C. Tangana",
    "Caloncho",
    "Sticky Fingers",
    "Ocean Alley",
    "Fat Freddy's Drop",
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
    "Barry Can't Swim",
    "Sofia Kourtesis",
    "Steve Lacy",
    "Silk Sonic",
    "Cleo Sol",
    "SAULT",
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
    "Lila Ike",
    "Boygenius",
    "Phoebe Bridgers",
    "Faye Webster",
    "The Marias",
    "TV Girl",
    "Royel Otis",
    "Spoon",
    "The Shins",
    "Bright Eyes",
    "The Darkness",
    "Silversun Pickups",
    "Alabama Shakes",
    "Parquet Courts",
    "Car Seat Headrest",
    "Black Midi",
    "Wolf Alice",
    "Sam Fender",
    "Catfish and the Bottlemen",
    "The 1975",
    "Everything Everything",
    "Sleaford Mods",
    "Viagra Boys",
    "Amyl and the Sniffers",
    "English Teacher",
    "Mannequin Pussy",
    "Wunderhorse",
    "Squid",
    "Dry Cleaning",
    "Porridge Radio",
    "Bartees Strange",
    "Momma",
    "Wednesday",
    "Feeble Little Horse",
    "Water From Your Eyes",
    "Calle 13",
    "Austin TV",
    "La Vela Puerca",
    "No Te Va Gustar",
    "Centavrvs",
    "Clubz",
    "Juan Pablo Vega",
    "Elsa y Elmar",
    "Esteman",
    "Monsieur Perine",
    "Bomba Estereo",
    "Diamante Electrico",
    "Milo J",
    "Shinova",
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
    "Hot Chip",
    "Robyn",
    "CSS",
    "Chromeo",
    "Crystal Castles",
    "Klaxons",
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
    "Rina Sawayama",
    "Remi Wolf",
    "PinkPantheress",
    "Jungle",
    "Nation of Language",
    "Cannons",
    "Jill Scott",
    "Anthony Hamilton",
    "Corinne Bailey Rae",
    "Ledisi",
    "Bilal",
    "Jordan Rakei",
    "Tom Misch",
    "Lianne La Havas",
    "Moses Sumney",
    "Anderson .Paak",
    "Jacob Collier",
    "Gregory Porter",
    "Mac Ayres",
    "Masego",
    "Dominique Fils-Aime",
    "Joy Oladokun",
    "Emma-Jean Thackray",
    "Samara Joy",
    "Digitalism",
    "Simian Mobile Disco",
    "Boys Noize",
    "Lane 8",
    "Kiasmos",
    "Tourist",
    "George FitzGerald",
    "Salute",
    "TSHA",
    "Logic1000",
    "Elkka",
    "Kelly Lee Owens",
    "India Jordan",
    "Jayda G",
    "Two Shell",
    "Nia Archives",
    "50 Cent",
    "The Game",
    "Lupe Fiasco",
    "T.I.",
    "Lil Wayne",
    "Clipse",
    "Slum Village",
    "Little Brother",
    "ScHoolboy Q",
    "Pusha T",
    "Vince Staples",
    "Brockhampton",
    "Saba",
    "Smino",
    "Noname",
    "Mick Jenkins",
    "Isaiah Rashad",
    "Ab-Soul",
    "Rome Streetz",
    "Baby Keem",
    "Genesis Owusu",
    "Doechii",
    "redveil",
    "MIKE",
    "Armand Hammer",
    "Billy Woods",
    "Kenny Mason",
    "The Brand New Heavies",
    "Incognito",
    "Breakbot",
    "Tuxedo",
    "Mayer Hawthorne",
    "Bruno Mars",
    "Franc Moody",
    "Toro y Moi",
    "SG Lewis",
    "Say She She",
    "Thee Sacred Souls",
    "Neal Francis",
    "The Dip",
    "Lady Wray",
    "Prep",
    "Free Nationals",
    "Lamb of God",
    "Killswitch Engage",
    "Trivium",
    "Bullet for My Valentine",
    "Meshuggah",
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
    "Loathe",
    "Chat Pile",
    "Jesus Piece",
    "Zulu",
    "Soul Glo",
    "Static Dress",
    "Dying Wish",
    "Stephen Marley",
    "Gentleman",
    "SOJA",
    "Rebelution",
    "The Black Seeds",
    "Collie Buddz",
    "Los Cafres",
    "Dread Mar I",
    "Jesse Royal",
    "Stick Figure",
    "Iration",
    "Mortimer",
    "Samory I",
    "Jaz Elise",
    "Inna De Yard",
    "Yellow Days",
    "King Krule",
    "Still Woozy",
    "Loving",
    "Feng Suave",
    "Vacations",
    "Gus Dapperton",
    "Balthazar",
    "Wallows",
    "Beabadoobee",
    "Ceu",
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
    "Rubel",
    "Silva",
    "Bala Desejo",
    "Gilsons",
    "Dora Morelenbaum",
    "Father John Misty",
    "Adrianne Lenker",
    "Lizzy McAlpine",
    "Waxahatchee",
    "MJ Lenderman",
    "Clairo",
    "Peach Pit",
    "Dayglow",
    "Beach Fossils",
    "Wild Nothing",
    "DIIV",
    "Real Estate",
    "Deerhunter",
    "Grizzly Bear",
    "Local Natives",
    "Vampire Weekend",
    "Two Door Cinema Club",
    "Bombay Bicycle Club",
    "Mazzy Star",
    "Soccer Mommy",
    "Snail Mail",
    "Julien Baker",
    "Kali Uchis",
    "Brent Faiyaz",
    "Jhene Aiko",
    "Giveon",
    "Summer Walker",
    "H.E.R.",
    "Snoh Aalegra",
    "Jorja Smith",
    "Sabrina Claudio",
    "Mahalia",
    "Raveena",
    "Maxwell",
    "Dwele",
    "Sade",
    "Roberta Flack",
    "Bill Withers",
    "Bad Bunny",
    "Duki",
    "YSY A",
    "Neo Pistea",
    "Tiago PZK",
    "Bhavi",
    "Khea",
    "Residente",
    "Ana Tijoux",
    "Portavoz",
    "Movimiento Original",
    "Villano Antillano",
    "Young Miko",
    "Quevedo",
    "Saiko (ES)",
    "Dellafuente",
    "Morad",
    "Maka",
    "Mala Rodriguez",
    "Nach",
    "Violadores del Verso",
    "Kase.O",
    "SFDK",
    "ToteKing",
    "Cartel de Santa",
    "Alemán",
    "Gera MX"
  ],
  "indie": [
    "The Strokes",
    "Arctic Monkeys",
    "Tame Impala",
    "Mac DeMarco",
    "Alvvays",
    "Phoebe Bridgers",
    "Boygenius",
    "Clairo",
    "The 1975",
    "Wallows",
    "Men I Trust",
    "TV Girl",
    "Mitski",
    "Big Thief",
    "The Marias",
    "Wet Leg",
    "Geese",
    "Black Country, New Road",
    "The Smile",
    "Yard Act",
    "Inhaler",
    "The Last Dinner Party",
    "English Teacher",
    "Royel Otis",
    "Faye Webster",
    "Remi Wolf",
    "Beabadoobee",
    "Vacations",
    "Loving",
    "Feng Suave",
    "Still Woozy",
    "Gus Dapperton",
    "Yellow Days",
    "King Krule",
    "Crumb",
    "Cuco",
    "BOY PABLO",
    "Peach Pit",
    "Dayglow",
    "Beach Fossils",
    "Wild Nothing",
    "DIIV",
    "Real Estate",
    "Deerhunter",
    "Grizzly Bear",
    "Local Natives",
    "Fleet Foxes",
    "Vampire Weekend",
    "Two Door Cinema Club",
    "Bombay Bicycle Club",
    "Foals",
    "The Kooks",
    "The Wombats",
    "Phoenix",
    "Arcade Fire",
    "Yeah Yeah Yeahs",
    "Interpol",
    "Modest Mouse",
    "Spoon",
    "Death Cab for Cutie",
    "The Shins",
    "Bright Eyes",
    "Neutral Milk Hotel",
    "Built to Spill",
    "Yo La Tengo",
    "Pavement",
    "Dinosaur Jr.",
    "Pixies",
    "The Smiths",
    "Cocteau Twins",
    "Slowdive",
    "My Bloody Valentine",
    "Ride",
    "Lush",
    "Mazzy Star",
    "Japanese Breakfast",
    "Soccer Mommy",
    "Snail Mail",
    "Julien Baker"
  ],
  "rnb": [
    "Frank Ocean",
    "SZA",
    "Daniel Caesar",
    "Steve Lacy",
    "The Weeknd",
    "Erykah Badu",
    "D'Angelo",
    "Lauryn Hill",
    "Amy Winehouse",
    "Cleo Sol",
    "SAULT",
    "Kali Uchis",
    "Brent Faiyaz",
    "Jhene Aiko",
    "Giveon",
    "Summer Walker",
    "H.E.R.",
    "Snoh Aalegra",
    "Jorja Smith",
    "Sabrina Claudio",
    "Mahalia",
    "Raveena",
    "Mac Ayres",
    "Masego",
    "Jordan Rakei",
    "Tom Misch",
    "Lianne La Havas",
    "Moses Sumney",
    "Anderson .Paak",
    "Leon Bridges",
    "Michael Kiwanuka",
    "Arlo Parks",
    "Olivia Dean",
    "Laufey",
    "Joy Oladokun",
    "Dominique Fils-Aime",
    "Jill Scott",
    "Anthony Hamilton",
    "John Legend",
    "Sharon Jones & the Dap-Kings",
    "Corinne Bailey Rae",
    "Ledisi",
    "Bilal",
    "Maxwell",
    "Dwele",
    "Sade",
    "Stevie Wonder",
    "Marvin Gaye",
    "Aretha Franklin",
    "Donny Hathaway",
    "Curtis Mayfield",
    "Al Green",
    "Sam Cooke",
    "Otis Redding",
    "Ray Charles",
    "Chaka Khan",
    "Roberta Flack",
    "Bill Withers"
  ],
  "urbano": [
    "Rosalia",
    "C. Tangana",
    "Bad Bunny",
    "Rauw Alejandro",
    "Bizarrap",
    "Duki",
    "Wos",
    "Trueno",
    "Ca7riel & Paco Amoroso",
    "Dillom",
    "Nathy Peluso",
    "Alvaro Diaz",
    "Rels B",
    "Milo J",
    "Cruz Cafune",
    "Judeline",
    "Guitarricadelafuente",
    "Nicki Nicole",
    "Emilia",
    "YSY A",
    "Neo Pistea",
    "Tiago PZK",
    "Bhavi",
    "Khea",
    "Calle 13",
    "Residente",
    "Tiro de Gracia",
    "Control Machete",
    "Makiza",
    "Ana Tijoux",
    "Portavoz",
    "Movimiento Original",
    "Chita",
    "Lara91k",
    "Taichu",
    "Saramalacara",
    "Villano Antillano",
    "Young Miko",
    "Quevedo",
    "Saiko (ES)",
    "Dellafuente",
    "Morad",
    "Maka",
    "Morcheeba",
    "Mala Rodriguez",
    "Nach",
    "Violadores del Verso",
    "Kase.O",
    "SFDK",
    "ToteKing",
    "Cartel de Santa",
    "Alemán",
    "Gera MX"
  ]
};

// Mood presets connected to the Disquero Clerk
const MOOD_PRESETS = {
  "heartbreak": {
    "title": "CORAZÓN ROTO & MELANCOLÍA",
    "clerkMsg": "A veces la música melancólica es el mejor abrazo. Te preparé una batea con grabaciones íntimas, acústicas y letras desgarradoras de múltiples artistas.",
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
      "Iron & Wine",
      "Sun Kil Moon",
      "Red House Painters",
      "Mount Eerie",
      "Sparklehorse",
      "Bright Eyes",
      "Julien Baker",
      "Lucy Dacus",
      "Angel Olsen",
      "Sharon Van Etten",
      "Mitski",
      "Big Thief",
      "Adrianne Lenker",
      "Keaton Henson",
      "City and Colour",
      "Boygenius",
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
    "clerkMsg": "¡A romper la rutina! Te acabo de seleccionar una batea con furia pura, guitarras encendidas y decibelios al máximo.",
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
      "Misfits",
      "Minor Threat",
      "Descendents",
      "Pennywise",
      "NOFX",
      "Rancid",
      "Dropkick Murphys",
      "Social Distortion",
      "Rise Against",
      "The Distillers",
      "Bikini Kill",
      "Amyl and the Sniffers",
      "Fontaines D.C.",
      "Shame",
      "Viagra Boys",
      "Turnstile",
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
    "title": "FIESTA & BAILE RETRO",
    "clerkMsg": "¡A mover el cuerpo! Aquí tienes puro ritmo disco, synthpop de los 80s y bajos funk con una selección súper variada.",
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
      "KC and The Sunshine Band",
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
      "Talk Talk",
      "Sylvester",
      "The Pointer Sisters",
      "Heatwave",
      "Shalamar",
      "Chaka Khan",
      "Grace Jones",
      "Baccara",
      "Lipps Inc.",
      "Village People",
      "Ottawan",
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
    "clerkMsg": "Perfecto para bajar las revoluciones, tomarte un café y mirar la lluvia. Esta selección es pura calma, swing y elegancia.",
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
      "Marcos Valle",
      "Joao Gilberto",
      "Arlo Parks",
      "Laufey",
      "Bruno Major",
      "Cigarettes After Sex",
      "Olivia Dean",
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
    "clerkMsg": "Prepárate para un viaje extrasensorial. Esta selección tiene texturas hipnóticas, rock progresivo y sonidos de otra dimensión.",
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
      "Kikagaku Moyo",
      "The Black Angels",
      "Dungen",
      "GOAT",
      "Thee Oh Sees",
      "Crumb",
      "Melody's Echo Chamber",
      "Pond",
      "Morgan Delt",
      "Balthazar"
    ]
  },
  "latin_bohemia": {
    "title": "BOHEMIA & ROCK LATINO",
    "clerkMsg": "La sangre latina y la poesía popular. Aquí están los discos que marcaron la historia y las noches bohemias de nuestro continente.",
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
      "Chico Trujillo",
      "Congreso",
      "Inti-Illimani",
      "Quilapayun",
      "Victor Jara",
      "Violeta Parra",
      "Natalia Lafourcade",
      "Rosalia",
      "C. Tangana",
      "Bandalos Chinos",
      "Conociendo Rusia",
      "El Mato a un Policia Motorizado",
      "Usted Señalemelo",
      "Silvana Estrada",
      "Kevin Kaarl"
    ]
  },
  "nostalgia_80s": {
    "title": "NOSTALGIA & SYNTHWAVE 80s",
    "clerkMsg": "Viaje directo a las luces de neón, cajas de ritmo y sintetizadores analógicos. Te armé una batea con puro New Wave y nostalgia ochentera.",
    "seeds": [
      "Depeche Mode",
      "New Order",
      "The Smiths",
      "Tears for Fears",
      "Duran Duran",
      "Pet Shop Boys",
      "A-ha",
      "Echo & the Bunnymen",
      "The Cure",
      "Orchestral Manoeuvres in the Dark",
      "Simple Minds",
      "Talk Talk",
      "INXS",
      "The Human League",
      "Soft Cell",
      "Eurythmics",
      "Billy Idol",
      "The Police",
      "Roxy Music",
      "Blondie",
      "Spandau Ballet",
      "Visage",
      "Boy Harsher",
      "Molchat Doma",
      "Kavinsky",
      "The Midnight",
      "Gunship",
      "Gary Numan",
      "Ultravox",
      "Alphaville",
      "Modern Talking",
      "Berlin"
    ]
  },
  "focus_flow": {
    "title": "CONCENTRACIÓN & DEEP FOCUS",
    "clerkMsg": "Para perderte en tus pensamientos, estudiar o trabajar con calma absoluta. Paisajes instrumentales, post-rock y minimalismo sonoro.",
    "seeds": [
      "Sigur Ros",
      "Godspeed You! Black Emperor",
      "Mogwai",
      "Explosions in the Sky",
      "Nils Frahm",
      "Max Richter",
      "Olafur Arnalds",
      "Tycho",
      "Brian Eno",
      "Jon Hopkins",
      "Bonobo",
      "Kiasmos",
      "Marconi Union",
      "This Will Destroy You",
      "Mono",
      "Balmorhea",
      "Ludovico Einaudi",
      "Stars of the Lid",
      "Hammock",
      "Boards of Canada",
      "Four Tet",
      "William Basinski",
      "Steve Reich",
      "Philip Glass",
      "Yann Tiersen",
      "C418",
      "Helios",
      "Goldmund",
      "Aphex Twin"
    ]
  },
  "roadtrip": {
    "title": "CARRETERA & VIENTO LIBRE",
    "clerkMsg": "Baja la ventanilla, sube el volumen y deja que el asfalto corra. Discos de rock clásico y guitarras doradas para devorar kilómetros.",
    "seeds": [
      "Fleetwood Mac",
      "Tom Petty",
      "Creedence Clearwater Revival",
      "Bruce Springsteen",
      "Dire Straits",
      "The War on Drugs",
      "Eagles",
      "Neil Young",
      "Queens of the Stone Age",
      "Kyuss",
      "Khruangbin",
      "ZZ Top",
      "Lynyrd Skynyrd",
      "America",
      "Crosby, Stills, Nash & Young",
      "Steely Dan",
      "The Doobie Brothers",
      "Boston",
      "Heart",
      "The Allman Brothers Band",
      "Santana",
      "JJ Cale",
      "The Black Keys",
      "Kurt Vile",
      "The Rolling Stones",
      "Bob Seger",
      "Steve Miller Band"
    ]
  },
  "urban_flow": {
    "title": "FLOW URBANO & BEAT NOCTURNO",
    "clerkMsg": "Ritmos pesados, barras afiladas y groove nocturno. Desde la época dorada del hip-hop hasta el R&B moderno y el trap latino.",
    "seeds": [
      "Kendrick Lamar",
      "A Tribe Called Quest",
      "Wu-Tang Clan",
      "Nas",
      "Mac Miller",
      "Tyler, The Creator",
      "J Dilla",
      "C. Tangana",
      "Duki",
      "Trueno",
      "Ca7riel",
      "Paco Amoroso",
      "Bad Bunny",
      "Frank Ocean",
      "SZA",
      "Lauryn Hill",
      "Outkast",
      "2Pac",
      "The Notorious B.I.G.",
      "MF DOOM",
      "Anderson .Paak",
      "Childish Gambino",
      "J. Cole",
      "Travis Scott",
      "Drake",
      "Rosalia",
      "Bizarrap",
      "Wos",
      "Ysy A",
      "Neo Pistea"
    ]
  },
  "dark_goth": {
    "title": "NOCHE OSCURA & DARKWAVE",
    "clerkMsg": "Para cuando se apaga la luz y reina el misterio. Bajos profundos, guitarras con chorus frío y atmósferas góticas hipnóticas.",
    "seeds": [
      "Bauhaus",
      "Siouxsie and the Banshees",
      "The Sisters of Mercy",
      "Lebanon Hanover",
      "She Past Away",
      "Christian Death",
      "Joy Division",
      "Killing Joke",
      "Clan of Xymox",
      "Molchat Doma",
      "Twin Tribes",
      "The Damned",
      "Cocteau Twins",
      "The Chameleons",
      "Asylum Party",
      "Drab Majesty",
      "Cold Cave",
      "Dead Can Dance",
      "Peter Murphy",
      "Fields of the Nephilim",
      "The Mission",
      "London After Midnight",
      "Linea Aspera",
      "Selofan"
    ]
  },
  "sunset_breeze": {
    "title": "ATARDECER & BUENA VIBRA",
    "clerkMsg": "Cálido como los últimos rayos de sol sobre la playa. Melodías luminosas de city pop, neo-psicodelia costera y reggae dub para relajar.",
    "seeds": [
      "Tatsuro Yamashita",
      "Mariya Takeuchi",
      "Miki Matsubara",
      "Anri",
      "Taeko Onuki",
      "Men I Trust",
      "Mac DeMarco",
      "Bob Marley",
      "UB40",
      "Manu Chao",
      "Devendra Banhart",
      "Caetano Veloso",
      "Jorge Ben Jor",
      "Gilberto Gil",
      "Marcos Valle",
      "Khruangbin",
      "Toro y Moi",
      "Mild High Club",
      "Boy Pablo",
      "Cuco",
      "Yellow Days",
      "Real Estate",
      "Alvvays",
      "Connan Mockasin",
      "Homeshake",
      "Inner Wave",
      "Grover Washington Jr.",
      "Cal Tjader"
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
  const cleanYear = (year && !isNaN(parseInt(year))) ? parseInt(year) : 1995;
  const isVintage = cleanYear < 1990;
  const isNineties = cleanYear >= 1990 && cleanYear < 2000;
  const isModern = cleanYear >= 2000;

  // 32 Rich, melomaniac perspectives categorized by sound, era and store curator wisdom
  const generalPraises = [
    `Una de las grabaciones más inspiradas en la discografía de ${artist}. Publicado en ${year}, captura la calidez física y analógica de los grandes estudios de la época, convirtiéndose en un tesoro codiciado por coleccionistas.`,
    `Un manifiesto sonoro indiscutible de ${genre}. Las composiciones de ${artist} en este álbum envejecieron con una vigencia asombrosa, destacando por su producción minuciosa y arreglos memorables.`,
    `El tipo de disco que solía agotarse el mismo día de reposición en las bateas. ${artist} logró aquí un equilibrio magistral entre melodías adictivas y una experimentación que definió escuela.`,
    `Una obra concebida para ser experimentada de punta a punta, sin saltarse una sola pista. Las capas instrumentales y la lírica de ${artist} te transportan a un viaje atmosférico irrepetible.`,
    `Si buscas una recomendación con personalidad propia, este trabajo de ${artist} (${year}) ofrece una masterización exquisita que brilla con especial magia a través de auriculares.`,
    `Pocas producciones logran envejecer con tanta elegancia. ${artist} construyó en este lanzamiento un puente perfecto entre la emoción cruda y la sofisticación técnica de ${genre}.`,
    `Un clásico de culto rescatado del cajón de joyas. La química de grabación y los matices armónicos de ${artist} representan una época dorada de creatividad sin ataduras comerciales.`,
    `Considerado por críticos y audiófilos como un punto de inflexión. En ${year}, este álbum abrió nuevas avenidas estéticas para todo el movimiento de ${genre}.`
  ];

  const vintagePraises = [
    `Grabado en cinta magnética de 2 pulgadas en pleno apogeo de ${year}. Las texturas de sintetizadores y guitarras analógicas de ${artist} guardan ese grano cálido imposible de replicar en la era digital.`,
    `Un testamento definitivo de la era dorada de las consolas analógicas. ${artist} destiló en este LP (${year}) un sonido exuberante que definió la identidad de ${genre} en todo el mundo.`,
    `Una joya de la era de los cassettes y vinilos pesados. La producción de este disco de ${artist} destaca por su dinamismo sin compresión excesiva, dejando respirar cada instrumento.`,
    `En ${year}, este lanzamiento consagró a ${artist} como pionero sonoro. La atmósfera envolvente y el groove rítmico lo convierten en una escucha obligatoria de las bateas clásicas.`
  ];

  const ninetiesPraises = [
    `El esplendor de la era del Compact Disc noventero. Lanzado en ${year}, este álbum de ${artist} rompió moldes con su energía visceral, convirtiéndose en la banda sonora de toda una generación.`,
    `Una obra cumbre de los años 90. Con ${year} como escenario, ${artist} fusionó la introspección lírica con paredes de sonido y una producción que redefinió ${genre}.`,
    `Un disco que dominó las rotaciones de radio y las estanterías de las disquerías en ${year}. ${artist} alcanzó aquí una madurez compositiva que no ha perdido un ápice de fuerza.`,
    `Diseñado para lucir en los reproductores Discman portátiles de la época. La claridad estéreo y la profundidad de bajos hacen que este trabajo de ${artist} siga sonando fresco hoy.`
  ];

  const modernPraises = [
    `Un clásico moderno del nuevo milenio. Lanzado en ${year}, ${artist} sintetiza la herencia clásica de ${genre} con una vanguardia electrónica y acústica de primer nivel.`,
    `Una de las declaraciones artísticas más aclamadas de los últimos tiempos. ${artist} demostró que los álbumes conceptuales siguen siendo el formato rey para contar historias profundas.`,
    `Producción cristalina, arreglos milimétricos y una interpretación vocal cautivadora. Este álbum de ${artist} (${year}) es una clase magistral de cómo reinventar ${genre}.`,
    `Un fenómeno sonoro contemporáneo. Desde su lanzamiento en ${year}, este disco ha acumulado elogios por su audacia y su capacidad de generar himnos que resuenan en todo el planeta.`
  ];

  let pool = generalPraises;
  if (isVintage) {
    pool = [...generalPraises, ...vintagePraises];
  } else if (isNineties) {
    pool = [...generalPraises, ...ninetiesPraises];
  } else if (isModern) {
    pool = [...generalPraises, ...modernPraises];
  }

  // Deterministic seed based on string hash
  let hash = 0;
  const str = `${artist}:${title}:${genre}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % pool.length;
  return pool[idx];
}

// Fetch real background story & historical context from Wikipedia API (ES & EN fallback)
async function fetchWikipediaAlbumStory(artist, title) {
  // Strip remaster, deluxe and edition suffixes for accurate search
  const cleanTitle = title
    .replace(/\s*[\(\[](remaster(ed)?|deluxe|anniversary|special|expanded|edition|bonus|version|live|explicit|single).*?[\)\]]/gi, '')
    .trim();

  const searchCandidates = [
    `${artist} ${cleanTitle}`,
    `${cleanTitle} álbum`,
    `${cleanTitle} album`,
    `${cleanTitle} ${artist}`
  ];

  // 1. Primary: Spanish Wikipedia REST API (CORS open with origin=*)
  for (const query of searchCandidates) {
    try {
      const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
      const res = await fetch(searchUrl);
      if (res.ok) {
        const data = await res.json();
        const items = data.query?.search;
        if (items && items.length > 0) {
          // Prioritize results containing album or matching title
          const match = items.find(i => {
            const t = i.title.toLowerCase();
            return t.includes('álbum') || t.includes('album') || t.includes(cleanTitle.toLowerCase());
          }) || items[0];

          const summaryUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(match.title)}`;
          const sRes = await fetch(summaryUrl);
          if (sRes.ok) {
            const sData = await sRes.json();
            if (sData.extract && sData.extract.length > 75 && sData.type !== 'disambiguation') {
              return {
                extract: sData.extract,
                source: 'Wikipedia (Historia & Datos de Grabación)',
                sourceUrl: sData.content_urls?.desktop?.page || null
              };
            }
          }
        }
      }
    } catch (e) {
      // Continue to next candidate
    }
  }

  // 2. Secondary fallback: English Wikipedia
  try {
    const enQuery = `${artist} ${cleanTitle} album`;
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(enQuery)}&utf8=&format=json&origin=*`;
    const res = await fetch(searchUrl);
    if (res.ok) {
      const data = await res.json();
      const items = data.query?.search;
      if (items && items.length > 0) {
        const best = items[0];
        const sRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(best.title)}`);
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.extract && sData.extract.length > 75 && sData.type !== 'disambiguation') {
            return {
              extract: sData.extract,
              source: 'Wikipedia Encyclopedia (Archive)',
              sourceUrl: sData.content_urls?.desktop?.page || null
            };
          }
        }
      }
    }
  } catch (e) {}

  return null;
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

// Generic Deezer JSONP caller for any endpoint (search, album, tracks)
function fetchDeezerEndpointJSONP(endpoint) {
  return new Promise((resolve) => {
    const cbName = 'dz_ep_' + Math.random().toString(36).substring(2, 9);
    const script = document.createElement('script');
    const timer = setTimeout(() => {
      cleanup();
      resolve(null);
    }, 6000);

    function cleanup() {
      clearTimeout(timer);
      try { delete window[cbName]; } catch (e) {}
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[cbName] = function(resp) {
      cleanup();
      resolve(resp);
    };

    const separator = endpoint.includes('?') ? '&' : '?';
    script.src = `${endpoint}${separator}output=jsonp&callback=${cbName}`;
    script.onerror = () => {
      cleanup();
      resolve(null);
    };
    document.head.appendChild(script);
  });
}

// Fetch complete album tracklist with song titles and audio previews
async function fetchAlbumTracklist(artist, albumTitle) {
  const query = `${artist} ${albumTitle}`;

  // 1. Primary: Deezer Worldwide Catalog (100M+ tracks, instant tracklist)
  try {
    const searchUrl = `https://api.deezer.com/search/album?q=${encodeURIComponent(query)}&limit=1`;
    const searchResp = await fetchDeezerEndpointJSONP(searchUrl);
    if (searchResp && searchResp.data && searchResp.data.length > 0) {
      const albumId = searchResp.data[0].id;
      const tracksUrl = `https://api.deezer.com/album/${albumId}/tracks`;
      const tracksResp = await fetchDeezerEndpointJSONP(tracksUrl);
      if (tracksResp && tracksResp.data && tracksResp.data.length > 0) {
        return tracksResp.data.map((t, idx) => ({
          position: t.track_position || (idx + 1),
          title: t.title_short || t.title,
          durationSec: t.duration || 180,
          previewUrl: t.preview
        }));
      }
    }
  } catch (e) {
    console.warn("Deezer tracklist fetch error", e);
  }

  // 2. Secondary fallback: iTunes API lookup
  try {
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=1`;
    const res = await fetch(itunesUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const cid = data.results[0].collectionId;
        const lookupRes = await fetch(`https://itunes.apple.com/lookup?id=${cid}&entity=song`);
        if (lookupRes.ok) {
          const lookupData = await lookupRes.json();
          const songs = lookupData.results.filter(r => r.wrapperType === 'track');
          if (songs.length > 0) {
            return songs.map((s, idx) => ({
              position: s.trackNumber || (idx + 1),
              title: s.trackName,
              durationSec: s.trackTimeMillis ? Math.round(s.trackTimeMillis / 1000) : 180,
              previewUrl: s.previewUrl
            }));
          }
        }
      }
    }
  } catch (e) {
    console.warn("iTunes tracklist fallback error", e);
  }

  return [];
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

    // Album Tracklist Elements
    this.tracklistSection = document.getElementById('album-tracklist-section');
    this.tracklistToggleBtn = document.getElementById('tracklist-toggle-btn');
    this.tracklistCountBadge = document.getElementById('tracklist-count-badge');
    this.tracklistItemsList = document.getElementById('tracklist-items-list');
    this.currentTracklist = [];
    this.activeTrackIndex = -1;

    this.initEventListeners();
    this.updateTracklistPlacement();
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

    // Category Tabs (15 Curated Genres with auto-scroll and drag swipe)
    const tabsContainer = document.querySelector('.category-tabs');
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        this.currentSearchTerm = '';
        searchInput.value = '';
        const cat = btn.dataset.category;
        sounds.playCrateClack();
        this.loadCrateCategory(cat);
      });
    });

    // Touch and Drag-to-Scroll support for category chips on mobile & tablet
    if (tabsContainer) {
      let isTabsDragging = false;
      let startTabsX = 0;
      let scrollTabsStart = 0;

      tabsContainer.addEventListener('mousedown', (e) => {
        isTabsDragging = true;
        startTabsX = e.pageX - tabsContainer.offsetLeft;
        scrollTabsStart = tabsContainer.scrollLeft;
      });

      window.addEventListener('mouseup', () => {
        isTabsDragging = false;
      });

      tabsContainer.addEventListener('mousemove', (e) => {
        if (!isTabsDragging) return;
        e.preventDefault();
        const x = e.pageX - tabsContainer.offsetLeft;
        const walk = (x - startTabsX) * 1.6;
        tabsContainer.scrollLeft = scrollTabsStart - walk;
      });
    }

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

    // Album Tracklist Collapsible Toggle (Hidden tab on mobile, open by default on desktop)
    if (this.tracklistToggleBtn && this.tracklistSection) {
      this.tracklistToggleBtn.addEventListener('click', () => {
        sounds.playMechanicalClick();
        const isOpen = this.tracklistSection.classList.toggle('is-open');
        this.tracklistToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

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

    // Handle viewport resize for tracklist placement (desktop vs mobile player attachment)
    window.addEventListener('resize', () => {
      this.updateTracklistPlacement();
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
      all: 'MEZCLA UNIVERSAL (TODAS LAS ÉPOCAS)',
      rock: 'ROCK & ALT-ROCK (60s - 2020s)',
      indie: 'INDIE ROCK & BEDROOM POP',
      latino: 'ROCK & POP LATINO',
      urbano: 'URBANO & TRAP LATINO',
      synth: 'SYNTHPOP, ELECTRO & 80s',
      rnb: 'NEO-SOUL & MODERN R&B',
      jazz: 'JAZZ, SOUL & BLUES',
      electronic: 'ELECTRÓNICA & CLUB',
      hiphop: 'HIP-HOP & RAP GLOBAL',
      funk: 'FUNK, GROOVE & DISCO',
      metal: 'METAL, PUNK & HEAVY CORE',
      reggae: 'REGGAE, DUB & SKA',
      citypop: 'CITY POP & NEO-PSICODELIA',
      bossa: 'BOSSA NOVA, MPB & FOLK'
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
    
    // Initial rich editorial review
    const initialBlurb = album.review || generateEditorialBlurb(album.artist, album.title, album.genre, album.year);
    const reviewTextEl = document.getElementById('inspect-review-text');
    
    reviewTextEl.textContent = initialBlurb;
    reviewTextEl.style.opacity = '1';

    // Fetch deep real album background story from Wikipedia in the background (clean, no labels)
    fetchWikipediaAlbumStory(album.artist, album.title).then(wikiResult => {
      // Check if user is still viewing the same album
      if (wikiResult && this.selectedAlbum && this.selectedAlbum.title === album.title) {
        reviewTextEl.style.opacity = '0';
        setTimeout(() => {
          reviewTextEl.textContent = wikiResult.extract;
          reviewTextEl.style.opacity = '1';
        }, 200);
      }
    });

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

    // Setup tracklist UI mode (Desktop: open below cover; Mobile: attached under player)
    this.updateTracklistPlacement();
    if (this.tracklistSection) {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        this.tracklistSection.classList.remove('is-open');
        if (this.tracklistToggleBtn) this.tracklistToggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        this.tracklistSection.classList.add('is-open');
        if (this.tracklistToggleBtn) this.tracklistToggleBtn.setAttribute('aria-expanded', 'true');
      }
    }

    this.loadAlbumTracklist(album);

    this.switchScene('inspect');
  }

  // Relocate tracklist: below cover on desktop, attached directly under Walkman/Discman on mobile
  updateTracklistPlacement() {
    const isMobile = window.innerWidth <= 768;
    const tracklist = document.getElementById('album-tracklist-section');
    const deviceStation = document.getElementById('vintage-device-station');
    const mediaCol = document.querySelector('.media-display-col');
    if (!tracklist || !deviceStation || !mediaCol) return;

    if (isMobile) {
      if (tracklist.previousElementSibling !== deviceStation) {
        deviceStation.after(tracklist);
      }
    } else {
      if (tracklist.parentNode !== mediaCol) {
        mediaCol.appendChild(tracklist);
      }
    }
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

  // Load and render album tracklist
  async loadAlbumTracklist(album) {
    if (!this.tracklistItemsList) return;
    this.activeTrackIndex = -1;
    if (this.tracklistCountBadge) this.tracklistCountBadge.textContent = 'Buscando pistas...';
    this.tracklistItemsList.innerHTML = '<div class="tracklist-loading-msg">🔍 Desplegando el cancionero del disco...</div>';

    const tracks = await fetchAlbumTracklist(album.artist, album.title);

    if (tracks && tracks.length > 0) {
      this.currentTracklist = tracks;
      if (this.tracklistCountBadge) this.tracklistCountBadge.textContent = `${tracks.length} temas`;
      this.renderTracklistUI(tracks, album);
    } else {
      const fallbackTracks = [{
        position: 1,
        title: album.sampleTrack || album.title,
        durationSec: 210,
        previewUrl: album.previewUrl
      }];
      this.currentTracklist = fallbackTracks;
      if (this.tracklistCountBadge) this.tracklistCountBadge.textContent = '1 tema (Edición única)';
      this.renderTracklistUI(fallbackTracks, album);
    }
  }

  renderTracklistUI(tracks, album) {
    if (!this.tracklistItemsList) return;
    this.tracklistItemsList.innerHTML = '';

    tracks.forEach((t, idx) => {
      const mins = Math.floor(t.durationSec / 60);
      const secs = (t.durationSec % 60).toString().padStart(2, '0');
      const pos = (t.position || (idx + 1)).toString().padStart(2, '0');

      const isCurrent = (t.previewUrl && album.previewUrl && t.previewUrl === album.previewUrl) || idx === 0;
      if (isCurrent && this.activeTrackIndex === -1) {
        this.activeTrackIndex = idx;
      }

      const row = document.createElement('div');
      row.className = `track-row-item ${idx === this.activeTrackIndex ? 'is-playing' : ''}`;
      row.dataset.index = idx;
      row.title = t.previewUrl ? `Reproducir "${t.title}" (30s)` : t.title;

      row.innerHTML = `
        <span class="track-row-num">${pos}</span>
        <span class="track-row-title">${t.title}</span>
        <span class="track-row-duration">${mins}:${secs}</span>
      `;

      row.addEventListener('click', () => {
        sounds.playMechanicalClick();
        this.playTrackFromList(t, idx);
      });

      this.tracklistItemsList.appendChild(row);
    });
  }

  playTrackFromList(track, idx) {
    this.activeTrackIndex = idx;

    // Update active highlight in UI
    const rows = this.tracklistItemsList.querySelectorAll('.track-row-item');
    rows.forEach((r, i) => {
      r.classList.toggle('is-playing', i === idx);
    });

    // Update Walkman / Discman LCD Screen
    document.getElementById('track-sample-title').textContent = `🎵 ${track.title}`;
    const trackMins = (idx + 1).toString().padStart(2, '0');
    if (this.selectedAlbum && this.selectedAlbum.format === 'cassette') {
      this.lcdModeText.textContent = `TAPE ${trackMins}`;
    } else {
      this.lcdModeText.textContent = `CD-DA ${trackMins}`;
    }

    if (track.previewUrl) {
      this.audioElement.src = track.previewUrl;
      this.playPauseBtn.disabled = false;
      this.playPauseBtn.style.opacity = '1';
      document.getElementById('preview-status-text').textContent = `Reproduciendo "${track.title}" (30s)...`;
      
      this.audioElement.play().then(() => {
        this.isPlayingAudio = true;
        this.playPauseBtn.querySelector('.deck-key').textContent = '⏸';
        this.playPauseBtn.querySelector('.deck-label').textContent = 'PAUSE';
        this.lcdModeText.textContent = 'PLAY';
        this.statusLedDot.classList.add('playing');
        this.setReelsSpinning(true);
        this.startVuMeterAnimation();
      }).catch(err => {
        console.warn('Playback error or user gesture required', err);
      });
    } else {
      document.getElementById('preview-status-text').textContent = `Pista elegida: "${track.title}" (Escúchala completa en Spotify/Apple)`;
    }
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
