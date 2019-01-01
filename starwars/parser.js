const fs = require('fs');
const exec = require('child_process').execSync;
 

const queries = [];

function fixAvailability(availability, setNumber) {

  availability = availability === null ? 'unknown': availability[1];

  const retailLimitedSets = ['66308-1', '66341-1', '66364-1', '66366-1', '66368-1', '66377-1', '66378-1', '66395-1', '66396-1', '66456-1', '66473-1', '66221-1', '65153-1', '4207901-1', '65771-1', '66411-1', '66431-1', '66432-1', '66449-1', '66479-1', '66512-1', '66514-1', '66515-1', '66533-1', '66534-1', '66535-1', '66536-1', '66542-1', '66555-1', '66556-1', '66596-1', '66597-1', '66543-1', '65145-1', '3219-1', '6963-1', '6964-1', '6965-1', '6966-1', '6967-1', '8028-1', '8031-1', '8033-1', '30050-1', '30051-1', '30053-1', '30056-1', '30059-1', '30240-1', '30241-1', '30242-1', '30243-1', '30244-1', '30246-1', '30247-1', '30272-1', '30274-1', '30275-1', '30276-1', '30279-1', '30496-1', '30497-1', '30380-1', '30381-1', '30498-1'];

  if (
    retailLimitedSets.indexOf(setNumber) !== -1
  ) {
    return 'Retail - boxed';
  }

  if (setNumber.match(/^(COMCON|TRU|SW)/)) {
    return 'Promotional';
  }

  const retailSets = ['7181-1', '10026-1', '65081-1', '7283-1', '10131-1', '6211-1', '10174-1', '7654-1', '7655-1', '7656-1', '7657-1', '7658-1', '7659-1', '7660-1', '7661-1', '7662-1', '7663-1', '7665-1', '7666-1', '7667-1', '7668-1', '7669-1', '10178-1', '7670-1', '7671-1', '7673-1', '7674-1', '7675-1', '7676-1', '7679-1', '7680-1', '7681-1', '10186-1', '7748-1', '7749-1', '8014-1', '8015-1', '8016-1', '8017-1', '8018-1', '8019-1', '8036-1', '8037-1', '8039-1', '8083-1', '8084-1', '8085-1', '8086-1', '8087-1', '8088-1', '8089-1', '8093-1', '8096-1', '8097-1', '8098-1', '75006-1', '75007-1', '75008-1', '75009-1', '75010-1', '75011-1', '75015-1', '75016-1', '75017-1', '75018-1', '75019-1', '75020-1', '75021-1', '75022-1', '75058-1', '75107-1', '75108-1', '75112-1', '75215-1', '9494-1', '9495-1', '9525-1', '75012-1', '75013-1', '75014-1', '75024-1', '75158-1', '75173-1', '75174-1', '75175-1', '75191-1', '75204-1', '75205-1', '75208-1'];
  if (
    retailSets.indexOf(setNumber) !== -1
  ) {
    return 'Retail';
  }

  const promotionalSets = ['6967-1', '6968-1', '8029-1', '11905-1', '5002122-1', '30496-1', '30497-1', '30380-1', '30381-1', '30498-1', '40298-1', '40299-1', '40300-1', '30050-1', '30056-1', '30058-1', '30059-1', '30240-1', '30241-1', '30243-1', '30244-1', '30246-1', '30247-1', '5002123-1', '30272-1', '30274-1', '30276-1', '5002938-1', '6176782-1', '40176-1', '40288-1', '5005376-1', '5000063-1', '5001621-1'];
  if (
    promotionalSets.indexOf(setNumber) !== -1
  ) {
    return 'Promotional';
  }

  if (availability === 'LEGO exclusive') {
    return 'Retail - limited';
  }

  return availability;
}

function fixPackaging(packaging, setNumber) {
  if (setNumber.match(/^(CELEB|BOBA|YODA)/) || setNumber === 'COMCON019-1' || setNumber === 'COMCON024-1' ) {
    return 'Polybag';
  }

  const boxedSets = ['9674-1', '9675-1', '9676-1', '66221-1', '66308-1', '66341-1', '66364-1', '66366-1', '66368-1', '66377-1', '66378-1', '66395-1', '66396-1', '66456-1', '66476-1', '75006-1', '75007-1', '75008-1', '75009-1', '75010-1', '75011-1', '66473-1'];
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

      const setNumber = setDetails[0];
      
     if (setNumber === '75251-1') {
       genre = 'Rogue One';
     }

     if (
       setNumber === '7778-1' ||
       setNumber === '8099-1'
     ) {
       genre = 'Episode V';
     }

     if (
       setNumber === '75087-1'
     ) {
       genre = 'The Clone Wars';
     }

    availability = fixAvailability(availability, setNumber);
    packaging = fixPackaging(packaging, setNumber);

     if (
       setNumber !== '75143-1' && 
       setNumber !== '75252-1'
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
