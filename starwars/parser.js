const fs = require('fs');
const exec = require('child_process').execSync;
 

const queries = [];

function fixAvailability(availability, setNumber) {

  availability = availability === null ? 'unknown': availability[1];

  const retailLimitedSets = ['6963', '6964', '6965', '6966', '6967', '8028', '8031', '8033', '30050', '30051', '30053', '30056', '30059', '30240', '30241', '30242', '30243', '30244', '30246', '30247', '30272', '30274', '30275', '30276', '30279', '30496', '30497', '30380', '30381', '30498', '3219'];

  if (
    retailLimitedSets.indexOf(setNumber) !== -1
  ) {
    return 'Retail - limited';
  }

  const retailBoxedSets = ['66308', '66341', '66364', '66366', '66368', '66377', '66378', '66395', '66396', '66456', '66473', '66221', '65153', '4207901', '65771', '66411', '66431', '66432', '66449', '66479', '66512', '66514', '66515', '66533', '66534', '66535', '66536', '66542', '66555', '66556', '66596', '66597', '66543', '65145', '30050', '30051', '30053', '30241', '30242', '30243', '5005754'];

  if (
    retailBoxedSets.indexOf(setNumber) !== -1
  ) {
    return 'Retail - boxed';
  }

  if (setNumber.match(/^(COMCON|TRU|SW)/)) {
    return 'Promotional';
  }

  const retailSets = ['7181', '10026', '65081', '7283', '10131', '6211', '10174', '7654', '7655', '7656', '7657', '7658', '7659', '7660', '7661', '7662', '7663', '7665', '7666', '7667', '7668', '7669', '10178', '7670', '7671', '7673', '7674', '7675', '7676', '7679', '7680', '7681', '10186', '7748', '7749', '8014', '8015', '8016', '8017', '8018', '8019', '8036', '8037', '8039', '8083', '8084', '8085', '8086', '8087', '8088', '8089', '8093', '8096', '8097', '8098', '75015', '75016', '75017', '75018', '75019', '75020', '75021', '75022', '75058', '75107', '75108', '75112', '75215', '9494', '9495', '9525', '75012', '75013', '75014', '75024', '75158', '75173', '75174', '75175', '75191', '75204', '75205', '75208',
  '75006', '75007', '75008'];

  if (
    retailSets.indexOf(setNumber) !== -1
  ) {
    return 'Retail';
  }

  const promotionalSets = ['6967', '6968', '8029', '11905', '5002122',  '40298', '40299', '40300', '30050', '30056', '30058', '30059', '5002123', '5002938', '6176782', '40176', '40288', '5005376', '5000063', '5001621', '75009', '75010', '75011'];
  if (
    promotionalSets.indexOf(setNumber) !==  -1
  ) {
    return 'Promotional';
  }

  if (availability === 'LEGO exclusive') {
    return 'Retail - limited';
  }

  return availability;
}

function fixPackaging(packaging, setNumber) {
  if (setNumber.match(/^(CELEB|BOBA|YODA)/) || setNumber === 'COMCON019' || setNumber === 'COMCON024' ) {
    return 'Polybag';
  }

  const boxedSets = ['9674', '9675', '9676', '66456', '66476', '75006', '75007', '75008', '75009', '75010', '75011', '66473', '66221', '66308', '66341', '66364', '66364', '66366', '66368', '66377', '66378', '66395', '66396', '65771' ];
  if (
    boxedSets.indexOf(setNumber) !== -1
  ) {
    return 'Box';
  }
  return packaging === null ? 'unknown' : packaging[1];
}

for(let index = 2; index < 29; index++) {
  if (!fs.existsSync(`page${index}.html`)) {
    exec(`curl https://brickset.com/sets/theme-Star-Wars/page-${index} > ./page${index}.html`)
  } else {
    console.log(`File for "page${index}.html" is already downloaded`);
  }
}

for(let index = 1; index < 29; index++) {
  const contents = fs.readFileSync(`page${index}.html`, 'utf8');
  const sets = contents.match(/(<article class='set'>.*?<\/article>)/gmis);
  sets.forEach(set => {
    try {
      const year = set.match(/<a class='year'.*?>(.*?)<\/a>/)[1];
      let availability = set.match(/<dt>Availability<\/dt><dd>(.*?)<\/dd>/s);
      let packaging = set.match(/<dt>Packaging<\/dt><dd>(.*?)<\/dd>/s);
      let genre = set.match(/<div class='tags'>.*?<a class='subtheme'.*?>(.*?)<\/a>.*?<\/div>/s);

      genre = genre === null ? 'LEGOLAND exclusive' : genre[1];

      const data = set.match(/(.*?<img.*?>)/);
      const href = data[1].match(/src="(.*?)"/)[1];
      const titleHtml = data[1].match(/title="(.*?)"/);
      const setDetails = titleHtml[1].split(': ');
      let imageUrl = `/images/starWars/${setDetails[0]}.jpg`;

      if (href.match(/blankbox/)) {
        imageUrl = '/images/starWars/blankbox.gif';
      } else {
        const imagePath = `../app/images/starWars/${setDetails[0]}.jpg`;

        if (!fs.existsSync(imagePath)) {
          exec(`curl ${href} > ../app/images/starWars/${setDetails[0]}.jpg`)
        } else {
          console.log(`Image for set "${setDetails[0]}" is already downloaded`);
        }
      }

      /*
      console.log(genre);
      console.log(year);
      console.log(href);
      console.log(setDetails[0]);
      console.log(setDetails[1]);
      */

      const setNumber = setDetails[0].replace('-1', '');
      
     if (setNumber === '75251') {
       genre = 'Rogue One';
     }

     if (
       setNumber === '7778' ||
       setNumber === '8099'
     ) {
       genre = 'Episode V';
     }

     if (
       setNumber === '75087'
     ) {
       genre = 'The Clone Wars';
     }

    availability = fixAvailability(availability, setNumber);
    packaging = fixPackaging(packaging, setNumber);

     if (
       setNumber !== '75143' && 
       setNumber !== '75252'
     ) {
        queries.push(
          `INSERT INTO starWarsSets (setId, description, genre, year, image, availability, packaging) VALUES (
            "${setNumber}",
            "${setDetails[1]}",
            "${genre.replace(/\s+$/, '')}",
            "${year}",
            "${imageUrl}",
            "${availability}",
            "${packaging}"
            )
          ;`
        );

     }
  } catch(error) {
    console.log(genre);
    //console.log(set);
    //console.log(error);
  }
  });
}

//console.log(queries);

fs.writeFile("queries.txt", queries.join('\n'), function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("The file was saved!");
}); 
